import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  writeFile
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadReleasePackages, releasePackageNames } from './package-graph.mjs'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const publishRoot = resolve(workspaceRoot, 'outputs/publish')
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const tarCommand = process.platform === 'win32' ? 'tar.exe' : 'tar'
const dependencyFields = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
  'devDependencies'
]
const packageEntryPrefix = 'package/'
const defaultCommandTimeoutMs = 5 * 60 * 1_000
const defaultMaxBufferBytes = 20 * 1024 * 1024
const windowsCmdMetaCharacters = /([()\][%!^"`<>&|;, *?])/g
const semverLikePattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/
const declarationFilePattern = /\.d\.(?:ts|mts|cts)$/i
const stylesheetFilePattern = /\.(?:css|scss|sass|less|styl|stylus)$/i

export function redactSensitiveText(value) {
  return String(value)
    .replace(/(Authorization\s*:\s*Bearer\s+)[^\s]+/gi, '$1[REDACTED]')
    .replace(/(_authToken\s*=\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s\r\n]+)/gi, '$1[REDACTED]')
    .replace(/(\bNPM_TOKEN\s*=\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s\r\n]+)/gi, '$1[REDACTED]')
    .replace(/\bnpm_[A-Za-z0-9]{20,}\b/g, '[REDACTED]')
    .replace(/\b(https?:\/\/)[^/\s@]+@/gi, '$1[REDACTED]@')
}

function createRedactedError(message) {
  return new Error(redactSensitiveText(message))
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

function packageContext(expectedPackage, manifest) {
  return expectedPackage?.name ?? manifest?.name ?? '<unknown package>'
}

function normalizeTarEntry(entry) {
  return entry.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, '')
}

function validatePackagePathSegments(packageName, field, pathContext, relativePath) {
  const context = `${packageName} field ${field} ${pathContext}`

  if (relativePath.includes('\\')) {
    throw new Error(
      `${context} contains a literal backslash`
    )
  }

  for (const segment of relativePath.split('/')) {
    if (segment === '') {
      throw new Error(`${context} contains an empty path segment`)
    }

    let decodedSegment

    try {
      decodedSegment = decodeURIComponent(segment)
    } catch {
      throw new Error(
        `${context} contains malformed percent encoding in segment ${segment}`
      )
    }

    const decodedSeparator = decodedSegment.includes('/')
      ? '/'
      : decodedSegment.includes('\\')
        ? '\\'
        : ''

    if (decodedSeparator) {
      throw new Error(
        `${context} segment ${segment} decodes to forbidden path separator ${JSON.stringify(decodedSeparator)}`
      )
    }

    if (
      decodedSegment === '.' ||
      decodedSegment === '..' ||
      decodedSegment.toLowerCase() === 'node_modules'
    ) {
      const decodedContext = decodedSegment === segment ? '' : ` (decoded as ${decodedSegment})`

      throw new Error(
        `${context} contains forbidden path segment ${segment}${decodedContext}`
      )
    }
  }
}

function packedEntryForTarget(packageName, field, target) {
  if (typeof target !== 'string' || !target.startsWith('./')) {
    throw new Error(
      `${packageName} field ${field} target ${String(target)} must be a package-relative path`
    )
  }

  const relativeTarget = target.slice(2)

  validatePackagePathSegments(packageName, field, `target ${target}`, relativeTarget)

  return `${packageEntryPrefix}${relativeTarget}`
}

function assertPackedTarget(packageName, field, target, entries) {
  const packedEntry = packedEntryForTarget(packageName, field, target)

  if (target.includes('*')) {
    return
  }

  if (!entries.has(packedEntry)) {
    throw new Error(
      `${packageName} field ${field} target ${target} is missing from the tarball`
    )
  }
}

function inspectExportTarget(packageName, field, target, entries) {
  if (typeof target === 'string') {
    assertPackedTarget(packageName, field, target, entries)
    return
  }

  if (target === null) {
    return
  }

  if (Array.isArray(target)) {
    if (target.length === 0) {
      throw new Error(
        `${packageName} field ${field} must be a string, null, condition object, or non-empty fallback array`
      )
    }

    target.forEach((fallbackTarget, index) => {
      inspectExportTarget(packageName, `${field}[${index}]`, fallbackTarget, entries)
    })
    return
  }

  if (!isPlainObject(target) || Object.keys(target).length === 0) {
    throw new Error(
      `${packageName} field ${field} must be a string, null, condition object, or non-empty fallback array`
    )
  }

  for (const [condition, conditionTarget] of Object.entries(target)) {
    if (condition === '' || condition.startsWith('.')) {
      throw new Error(
        `${packageName} field ${field} contains invalid condition key ${JSON.stringify(condition)}`
      )
    }

    inspectExportTarget(packageName, `${field}.${condition}`, conditionTarget, entries)
  }
}

function inspectExports(packageName, exportsField, entries) {
  if (typeof exportsField === 'string' || Array.isArray(exportsField)) {
    inspectExportTarget(packageName, 'exports', exportsField, entries)
    return
  }

  if (!isPlainObject(exportsField) || Object.keys(exportsField).length === 0) {
    throw new Error(`${packageName} field exports must define at least one export`)
  }

  const exportEntries = Object.entries(exportsField)
  const invalidSubpathEntry = exportEntries.find(
    ([exportPath]) => exportPath.startsWith('.') && exportPath !== '.' && !exportPath.startsWith('./')
  )

  if (invalidSubpathEntry) {
    throw new Error(
      `${packageName} field exports contains invalid subpath key ${JSON.stringify(invalidSubpathEntry[0])}`
    )
  }

  const subpathEntries = exportEntries.filter(
    ([exportPath]) => exportPath === '.' || exportPath.startsWith('./')
  )

  if (subpathEntries.length > 0 && subpathEntries.length !== exportEntries.length) {
    throw new Error(`${packageName} field exports cannot mix subpath and condition keys`)
  }

  if (subpathEntries.length === 0) {
    inspectExportTarget(packageName, 'exports', exportsField, entries)
    return
  }

  for (const [exportPath, target] of exportEntries) {
    const field = `exports[${JSON.stringify(exportPath)}]`

    if (exportPath !== '.') {
      validatePackagePathSegments(
        packageName,
        'exports',
        `subpath key ${JSON.stringify(exportPath)}`,
        exportPath.slice(2)
      )
    }

    inspectExportTarget(packageName, field, target, entries)
  }
}

export function inspectPackedManifest({ expectedPackage, manifest, entries }) {
  const packageName = packageContext(expectedPackage, manifest)

  if (!isPlainObject(expectedPackage)) {
    throw new Error(`${packageName} expected package metadata must be a plain object`)
  }

  if (!isPlainObject(manifest)) {
    throw new Error(`${packageName} packed manifest must be a plain object`)
  }

  if (!Array.isArray(entries)) {
    throw new Error(`${packageName} packed entries must be an array`)
  }

  for (const field of ['name', 'version']) {
    if (manifest[field] !== expectedPackage[field]) {
      throw new Error(
        `${packageName} field ${field} expected ${String(expectedPackage[field])} but found ${String(manifest[field])}`
      )
    }
  }

  for (const field of dependencyFields) {
    const dependencies = manifest[field]

    if (dependencies === undefined) {
      continue
    }

    if (!isPlainObject(dependencies)) {
      throw new Error(`${packageName} field ${field} must be a plain object`)
    }

    for (const [dependencyName, dependencyVersion] of Object.entries(dependencies)) {
      if (typeof dependencyVersion === 'string' && dependencyVersion.startsWith('workspace:')) {
        throw new Error(
          `${packageName} field ${field} dependency ${dependencyName} uses forbidden workspace protocol ${dependencyVersion}`
        )
      }
    }
  }

  if (
    !Array.isArray(manifest.files) ||
    manifest.files.length === 0 ||
    manifest.files.some((entry) => typeof entry !== 'string' || entry.length === 0)
  ) {
    throw new Error(`${packageName} field files must be a non-empty array of paths`)
  }

  if (!manifest.files.includes('README.md')) {
    throw new Error(`${packageName} field files must include README.md`)
  }

  const packedEntries = new Set(entries.map(normalizeTarEntry))

  if (!packedEntries.has('package/README.md')) {
    throw new Error(
      `${packageName} field README.md target package/README.md is missing from the tarball`
    )
  }

  for (const field of ['main', 'module', 'types']) {
    assertPackedTarget(packageName, field, manifest[field], packedEntries)
  }

  inspectExports(packageName, manifest.exports, packedEntries)

  return manifest
}

function escapeWindowsCommand(command) {
  return command.replace(windowsCmdMetaCharacters, '^$1')
}

function escapeWindowsArgument(value) {
  let argument = String(value)

  argument = argument.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"')
  argument = argument.replace(/(?=(\\+?)?)\1$/, '$1$1')
  argument = `"${argument}"`
  argument = argument.replace(windowsCmdMetaCharacters, '^$1')

  // Cmd shims parse arguments once in cmd.exe and again in the shim.
  return argument.replace(windowsCmdMetaCharacters, '^$1')
}

export function createCommandInvocation(
  command,
  args,
  { platform = process.platform, env = process.env } = {}
) {
  if (platform !== 'win32' || !/\.(?:cmd|bat)$/i.test(command)) {
    return {
      command,
      args: [...args],
      windowsVerbatimArguments: false
    }
  }

  if ([command, ...args].some((value) => /[\0\r\n]/.test(String(value)))) {
    throw new Error('Windows command arguments must not contain NUL or line break characters')
  }

  const commandLine = [
    escapeWindowsCommand(command),
    ...args.map(escapeWindowsArgument)
  ].join(' ')

  return {
    command: env.ComSpec ?? env.COMSPEC ?? 'cmd.exe',
    args: ['/d', '/s', '/c', `"${commandLine}"`],
    windowsVerbatimArguments: true
  }
}

export async function runCommand({
  command,
  args,
  context,
  cwd = workspaceRoot,
  timeoutMs = defaultCommandTimeoutMs,
  maxBufferBytes = defaultMaxBufferBytes,
  env = process.env,
  platform = process.platform,
  spawnImpl = spawn
}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw createRedactedError(`${context} timeoutMs must be a positive finite number`)
  }

  const invocation = createCommandInvocation(command, args, { platform, env })

  return await new Promise((resolvePromise, reject) => {
    let child

    try {
      child = spawnImpl(invocation.command, invocation.args, {
        cwd,
        env,
        shell: false,
        windowsVerbatimArguments: invocation.windowsVerbatimArguments,
        stdio: ['ignore', 'pipe', 'pipe']
      })
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)

      reject(createRedactedError(`${context} failed to start: ${reason}`))
      return
    }

    const stdoutChunks = []
    const stderrChunks = []
    let bufferedBytes = 0
    let settled = false
    let timedOut = false
    let exceededBuffer = false

    function appendOutput(chunks, chunk) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)

      bufferedBytes += buffer.length
      if (bufferedBytes > maxBufferBytes) {
        exceededBuffer = true
        child.kill('SIGKILL')
        return
      }

      chunks.push(buffer)
    }

    child.stdout?.on('data', (chunk) => appendOutput(stdoutChunks, chunk))
    child.stderr?.on('data', (chunk) => appendOutput(stderrChunks, chunk))

    const timeout = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeoutMs)

    child.on('error', (error) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeout)
      reject(createRedactedError(`${context} failed to start: ${error.message}`))
    })

    child.on('close', (code, signal) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeout)

      if (timedOut) {
        reject(createRedactedError(`${context} timed out after ${timeoutMs}ms`))
        return
      }

      if (exceededBuffer) {
        reject(createRedactedError(`${context} exceeded output limit of ${maxBufferBytes} bytes`))
        return
      }

      const stdout = Buffer.concat(stdoutChunks).toString('utf8')
      const stderr = Buffer.concat(stderrChunks).toString('utf8')

      if (code !== 0) {
        const output = [stderr.trim(), stdout.trim()].filter(Boolean).join('\n')
        const exitDetail = signal ? `signal ${signal}` : `exit code ${String(code)}`

        reject(createRedactedError(
          `${context} failed (${exitDetail})${output ? `:\n${output}` : ''}`
        ))
        return
      }

      resolvePromise({ stdout, stderr })
    })
  })
}

export async function inspectPackageTarball({
  expectedPackage,
  tarballPath,
  commandTimeoutMs = defaultCommandTimeoutMs,
  commandRunner = runCommand
}) {
  const packageName = packageContext(expectedPackage)
  const absoluteTarballPath = resolve(tarballPath)
  const [{ stdout: entryOutput }, { stdout: manifestOutput }] = await Promise.all([
    commandRunner({
      command: tarCommand,
      args: ['-tzf', absoluteTarballPath],
      context: `${packageName} tar entry inspection for ${absoluteTarballPath}`,
      cwd: workspaceRoot,
      timeoutMs: commandTimeoutMs
    }),
    commandRunner({
      command: tarCommand,
      args: ['-xOf', absoluteTarballPath, 'package/package.json'],
      context: `${packageName} packed manifest inspection for ${absoluteTarballPath}`,
      cwd: workspaceRoot,
      timeoutMs: commandTimeoutMs
    })
  ])
  const entries = entryOutput
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
  let manifest

  try {
    manifest = JSON.parse(manifestOutput)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)

    throw new Error(`${packageName} field package/package.json is invalid JSON: ${reason}`)
  }

  inspectPackedManifest({ expectedPackage, manifest, entries })

  return { manifest, entries }
}

export async function calculateIntegrity(tarballPath) {
  const hash = createHash('sha512')

  await new Promise((resolvePromise, reject) => {
    const stream = createReadStream(tarballPath)

    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', resolvePromise)
  })

  return `sha512-${hash.digest('base64')}`
}

export function getAlignedReleaseVersion(releasePackages) {
  const packageVersions = releasePackages.map(({ name, manifest }) => ({
    name,
    version: manifest.version
  }))
  const versions = new Set(packageVersions.map(({ version }) => version))

  if (versions.size !== 1 || packageVersions.some(({ version }) => typeof version !== 'string')) {
    const summary = packageVersions.map(({ name, version }) => `${name}=${String(version)}`).join(', ')

    throw new Error(`Release package versions are not aligned: ${summary}`)
  }

  return packageVersions[0].version
}

function resolvePublishOutputDirectory(outputDir) {
  if (typeof outputDir !== 'string' || outputDir.length === 0) {
    throw new Error('Release artifact outputDir must be a non-empty path')
  }

  const resolvedOutputDir = isAbsolute(outputDir)
    ? resolve(outputDir)
    : resolve(workspaceRoot, outputDir)
  const relativeOutputDir = relative(publishRoot, resolvedOutputDir)

  if (
    relativeOutputDir === '' ||
    relativeOutputDir === '..' ||
    relativeOutputDir.startsWith(`..${sep}`) ||
    isAbsolute(relativeOutputDir)
  ) {
    throw new Error(
      `Release artifact outputDir ${resolvedOutputDir} must be a child of ${publishRoot}`
    )
  }

  return resolvedOutputDir
}

async function assertNoSymlinkSegments(outputDir) {
  const relativeFromWorkspace = relative(workspaceRoot, outputDir)
  const segments = relativeFromWorkspace.split(sep)
  let currentPath = workspaceRoot

  for (const segment of segments) {
    currentPath = resolve(currentPath, segment)

    try {
      const pathStat = await lstat(currentPath)

      if (pathStat.isSymbolicLink()) {
        throw new Error(`Release artifact output path must not contain symlink ${currentPath}`)
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error
      }
    }
  }
}

async function listTarballs(outputDir) {
  return (await readdir(outputDir))
    .filter((entry) => entry.endsWith('.tgz'))
    .sort()
}

async function packReleasePackage(
  releasePackage,
  outputDir,
  version,
  {
    commandRunner,
    commandTimeoutMs,
    inspectTarball,
    integrityCalculator
  }
) {
  const beforePack = new Set(await listTarballs(outputDir))

  await commandRunner({
    command: pnpmCommand,
    args: [
      '--dir',
      `packages/${releasePackage.directory}`,
      'pack',
      '--pack-destination',
      outputDir
    ],
    context: `${releasePackage.name} pack`,
    cwd: workspaceRoot,
    timeoutMs: commandTimeoutMs
  })

  const createdTarballs = (await listTarballs(outputDir)).filter(
    (entry) => !beforePack.has(entry)
  )

  if (createdTarballs.length !== 1) {
    throw new Error(
      `${releasePackage.name} pack expected one new tarball but found ${createdTarballs.length}: ` +
      `${createdTarballs.join(', ') || '<none>'}`
    )
  }

  const tarballPath = resolve(outputDir, createdTarballs[0])
  await inspectTarball({
    expectedPackage: {
      name: releasePackage.name,
      version
    },
    tarballPath,
    commandTimeoutMs,
    commandRunner
  })

  const [{ size: bytes }, integrity] = await Promise.all([
    stat(tarballPath),
    integrityCalculator(tarballPath)
  ])

  return {
    packageName: releasePackage.name,
    version,
    tarballPath,
    bytes,
    integrity,
    level: releasePackage.level
  }
}

export async function buildReleaseArtifacts({
  outputDir,
  version,
  commandTimeoutMs = defaultCommandTimeoutMs,
  adapters = {}
} = {}) {
  if (!Number.isFinite(commandTimeoutMs) || commandTimeoutMs <= 0) {
    throw new Error('Release artifact commandTimeoutMs must be a positive finite number')
  }

  const loadPackages = adapters.loadReleasePackages ?? loadReleasePackages
  const commandRunner = adapters.commandRunner ?? runCommand
  const inspectTarball = adapters.inspectPackageTarball ?? inspectPackageTarball
  const integrityCalculator = adapters.calculateIntegrity ?? calculateIntegrity
  const releasePackages = await loadPackages()
  const alignedVersion = getAlignedReleaseVersion(releasePackages)

  if (version !== undefined && version !== alignedVersion) {
    throw new Error(
      `Requested release version ${String(version)} does not match aligned package version ${alignedVersion}`
    )
  }

  const resolvedOutputDir = resolvePublishOutputDirectory(outputDir)
  await assertNoSymlinkSegments(resolvedOutputDir)
  await rm(resolvedOutputDir, { recursive: true, force: true })
  await mkdir(resolvedOutputDir, { recursive: true })
  let outputPrepared = true

  try {
    await commandRunner({
      command: pnpmCommand,
      args: ['build'],
      context: 'Yok UI workspace build',
      cwd: workspaceRoot,
      timeoutMs: commandTimeoutMs
    })

    const artifacts = []

    for (const releasePackage of releasePackages) {
      artifacts.push(
        await packReleasePackage(releasePackage, resolvedOutputDir, alignedVersion, {
          commandRunner,
          commandTimeoutMs,
          inspectTarball,
          integrityCalculator
        })
      )
    }

    await writeFile(
      resolve(resolvedOutputDir, 'release-artifacts.json'),
      `${JSON.stringify(artifacts, null, 2)}\n`,
      'utf8'
    )

    outputPrepared = false
    return artifacts
  } catch (error) {
    if (outputPrepared) {
      try {
        await rm(resolvedOutputDir, { recursive: true, force: true })
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          `Release artifact build failed and cleanup of ${resolvedOutputDir} also failed`
        )
      }
    }

    throw error
  }
}

function isPathInside(parentPath, candidatePath) {
  const relativePath = relative(parentPath, candidatePath)

  return relativePath !== '' &&
    relativePath !== '..' &&
    !relativePath.startsWith(`..${sep}`) &&
    !isAbsolute(relativePath)
}

function validateRegistry(registry) {
  let registryUrl

  if (typeof registry !== 'string') {
    throw new Error('Smoke test registry must be a valid HTTP(S) URL')
  }

  if (!/^https?:\/\//i.test(registry)) {
    if (/^https?:/i.test(registry)) {
      throw new Error('Smoke test registry must be an explicit HTTP(S) URL with //')
    }

    throw new Error('Smoke test registry must be a valid HTTP(S) URL')
  }

  try {
    registryUrl = new URL(registry)
  } catch {
    throw new Error('Smoke test registry must be a valid HTTP(S) URL')
  }

  if (!['http:', 'https:'].includes(registryUrl.protocol)) {
    throw new Error('Smoke test registry must be a valid HTTP(S) URL')
  }

  if (registryUrl.username || registryUrl.password) {
    throw new Error('Smoke test registry URL must not contain credentials')
  }

  if (registryUrl.search) {
    throw new Error('Smoke test registry URL must not contain query parameters')
  }

  if (registryUrl.hash) {
    throw new Error('Smoke test registry URL must not contain a fragment')
  }

  const hostname = registryUrl.hostname.toLowerCase()
  const unwrappedHostname = hostname.replace(/^\[|\]$/g, '')
  const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(unwrappedHostname)

  if (
    registryUrl.protocol === 'http:' &&
    (!isLoopback || !/^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(registry))
  ) {
    throw new Error('Smoke test registry must use HTTPS except for loopback localhost, 127.0.0.1, or ::1')
  }

  if (!isLoopback && !hostname.includes('.')) {
    throw new Error('Smoke test registry hostname must be fully-qualified, not an ambiguous single-label name')
  }

  return registryUrl.href
}

function validateSmokeVersion(version) {
  if (version === undefined) {
    throw new Error('Registry smoke test requires version')
  }

  if (typeof version !== 'string' || !semverLikePattern.test(version)) {
    throw new Error(`Registry smoke test version ${String(version)} must be semver-like`)
  }

  return version
}

async function validateSmokeTarballs(tarballs) {
  if (!Array.isArray(tarballs) || tarballs.length === 0) {
    throw new Error('Tarball smoke test requires non-empty tarball package records')
  }

  const recordByPackageName = new Map()

  for (const record of tarballs) {
    if (!isPlainObject(record) || typeof record.packageName !== 'string' || typeof record.tarballPath !== 'string') {
      throw new Error('Tarball smoke test tarball package records must contain packageName and tarballPath')
    }

    if (recordByPackageName.has(record.packageName)) {
      throw new Error(`Tarball smoke test tarball package records contain duplicate ${record.packageName}`)
    }

    recordByPackageName.set(record.packageName, record)
  }

  const actualPackageNames = [...recordByPackageName.keys()].sort()
  const expectedPackageNames = [...releasePackageNames].sort()

  if (JSON.stringify(actualPackageNames) !== JSON.stringify(expectedPackageNames)) {
    throw new Error(
      'Tarball smoke test tarball package records must match the eight release packages; ' +
      `expected ${expectedPackageNames.join(', ')}, received ${actualPackageNames.join(', ')}`
    )
  }

  const normalizedRecords = []

  for (const packageName of releasePackageNames) {
    const record = recordByPackageName.get(packageName)
    const tarballPath = resolve(record.tarballPath)
    let tarballStat

    try {
      tarballStat = await stat(tarballPath)
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)

      throw new Error(`${packageName} tarball ${tarballPath} cannot be read: ${reason}`)
    }

    if (!tarballStat.isFile() || !tarballPath.endsWith('.tgz')) {
      throw new Error(`${packageName} tarball ${tarballPath} must be a .tgz file`)
    }

    if (
      record.version !== undefined &&
      (typeof record.version !== 'string' || !semverLikePattern.test(record.version))
    ) {
      throw new Error(
        `${packageName} tarball record version ${String(record.version)} must be semver-like`
      )
    }

    normalizedRecords.push({
      packageName,
      tarballPath,
      ...(record.version === undefined ? {} : { version: record.version })
    })
  }

  return normalizedRecords
}

function isTypesCondition(condition) {
  return condition === 'types' || condition.startsWith('types@')
}

function collectPublicEntryTargets(
  target,
  { insideTypesCondition = false, typeTargets = [], styleTargets = [] } = {}
) {
  if (typeof target === 'string') {
    if (insideTypesCondition || declarationFilePattern.test(target)) {
      typeTargets.push(target)
    }

    if (stylesheetFilePattern.test(target)) {
      styleTargets.push(target)
    }
  } else if (Array.isArray(target)) {
    target.forEach((entry) => {
      collectPublicEntryTargets(entry, {
        insideTypesCondition,
        typeTargets,
        styleTargets
      })
    })
  } else if (isPlainObject(target)) {
    for (const [condition, conditionTarget] of Object.entries(target)) {
      collectPublicEntryTargets(conditionTarget, {
        insideTypesCondition: insideTypesCondition || isTypesCondition(condition),
        typeTargets,
        styleTargets
      })
    }
  }

  return { typeTargets, styleTargets }
}

async function assertInstalledFile(packageName, packageRealRoot, field, target) {
  const relativeTarget = packedEntryForTarget(packageName, field, target)
    .slice(packageEntryPrefix.length)
  const targetPath = resolve(packageRealRoot, relativeTarget)
  let targetRealPath
  let targetStat

  try {
    targetRealPath = await realpath(targetPath)
    targetStat = await stat(targetRealPath)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)

    throw new Error(
      `${packageName} declared ${field} ${target} does not resolve in the clean consumer: ${reason}`
    )
  }

  if (!isPathInside(packageRealRoot, targetRealPath)) {
    throw new Error(
      `${packageName} declared ${field} ${target} resolves outside installed package root ${packageRealRoot}`
    )
  }

  if (!targetStat.isFile()) {
    throw new Error(
      `${packageName} declared ${field} ${target} does not resolve to a file in the clean consumer`
    )
  }

  return targetPath
}

async function inspectInstalledPackageEntries(consumerDirectory, expectedVersions) {
  const typeEntries = new Set()
  const cssEntries = new Set()

  for (const packageName of releasePackageNames) {
    const packageDirectory = resolve(consumerDirectory, 'node_modules', ...packageName.split('/'))
    let packageRealRoot

    try {
      packageRealRoot = await realpath(packageDirectory)
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)

      throw new Error(`${packageName} installed package root cannot be resolved: ${reason}`)
    }

    const manifestPath = resolve(packageRealRoot, 'package.json')
    let manifest

    try {
      manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)

      throw new Error(`${packageName} installed manifest ${manifestPath} cannot be read: ${reason}`)
    }

    if (!isPlainObject(manifest) || manifest.name !== packageName) {
      throw new Error(`${packageName} installed manifest has an unexpected package identity`)
    }

    const expectedVersion = expectedVersions.get(packageName)

    if (expectedVersion !== undefined && manifest.version !== expectedVersion) {
      throw new Error(
        `${packageName} installed version ${String(manifest.version)} does not match expected ${expectedVersion}`
      )
    }

    if (typeof manifest.types !== 'string') {
      throw new Error(`${packageName} installed manifest is missing its declared types entry`)
    }

    await assertInstalledFile(packageName, packageRealRoot, 'types entry', manifest.types)
    typeEntries.add(`${packageName}:${manifest.types}`)

    if (
      typeof manifest.exports !== 'string' &&
      !Array.isArray(manifest.exports) &&
      !isPlainObject(manifest.exports)
    ) {
      continue
    }

    const exportEntries = isPlainObject(manifest.exports) &&
      Object.keys(manifest.exports).some((key) => key === '.' || key.startsWith('./'))
      ? Object.entries(manifest.exports)
      : [['.', manifest.exports]]

    for (const [exportPath, target] of exportEntries) {
      const { typeTargets, styleTargets } = collectPublicEntryTargets(target)

      for (const typeTarget of typeTargets) {
        await assertInstalledFile(
          packageName,
          packageRealRoot,
          `export ${exportPath} types target`,
          typeTarget
        )
        typeEntries.add(`${packageName}:${typeTarget}`)
      }

      for (const styleTarget of styleTargets) {
        await assertInstalledFile(
          packageName,
          packageRealRoot,
          `CSS export ${exportPath} target`,
          styleTarget
        )
      }

      if (styleTargets.length > 0) {
        cssEntries.add(exportPath === '.' ? packageName : `${packageName}${exportPath.slice(1)}`)
      }
    }
  }

  return {
    typeEntries: [...typeEntries],
    cssEntries: [...cssEntries]
  }
}

function smokeCommandSummary(source) {
  if (source.kind === 'registry') {
    return `pnpm add --ignore-workspace --ignore-scripts --registry ${source.registry} vue@^3.5.0 @yok-ui/*@${source.version}`
  }

  return 'pnpm add --ignore-workspace --ignore-scripts vue@^3.5.0 <eight verified Yok UI tarballs>'
}

export async function smokeTestTarballs({
  tarballs,
  keepTemp = false,
  registry,
  version,
  commandTimeoutMs = defaultCommandTimeoutMs,
  adapters = {}
} = {}) {
  const hasTarballs = tarballs !== undefined
  const hasRegistry = registry !== undefined

  if (hasTarballs && hasRegistry) {
    throw new Error('Smoke test cannot combine tarballs and registry modes')
  }

  if (!hasTarballs && !hasRegistry) {
    throw new Error('Smoke test requires tarballs or registry')
  }

  if (typeof keepTemp !== 'boolean') {
    throw new Error('Smoke test keepTemp must be a boolean')
  }

  if (!Number.isFinite(commandTimeoutMs) || commandTimeoutMs <= 0) {
    throw new Error('Smoke test commandTimeoutMs must be a positive finite number')
  }

  const commandRunner = adapters.commandRunner ?? runCommand
  const temporaryRoot = adapters.temporaryRoot ?? tmpdir()
  let source
  let installSpecs
  const expectedVersions = new Map()

  if (hasRegistry) {
    const normalizedRegistry = validateRegistry(registry)
    const normalizedVersion = validateSmokeVersion(version)

    source = { kind: 'registry', registry: normalizedRegistry, version: normalizedVersion }
    installSpecs = releasePackageNames.map((packageName) => `${packageName}@${normalizedVersion}`)
    releasePackageNames.forEach((packageName) => {
      expectedVersions.set(packageName, normalizedVersion)
    })
  } else {
    if (version !== undefined) {
      throw new Error('Tarball smoke test does not accept registry version')
    }

    const records = await validateSmokeTarballs(tarballs)

    source = { kind: 'tarballs', tarballs: records }
    installSpecs = records.map(({ tarballPath }) => tarballPath)
    records.forEach(({ packageName, version: artifactVersion }) => {
      if (artifactVersion !== undefined) {
        expectedVersions.set(packageName, artifactVersion)
      }
    })
  }

  const [workspaceRealRoot, temporaryRealRoot] = await Promise.all([
    realpath(workspaceRoot),
    realpath(temporaryRoot)
  ])

  if (
    temporaryRealRoot === workspaceRealRoot ||
    isPathInside(workspaceRealRoot, temporaryRealRoot)
  ) {
    throw new Error(
      `Smoke test temporary directory true path must be outside the workspace: ${temporaryRealRoot}`
    )
  }

  const createdConsumerDirectory = await mkdtemp(
    resolve(temporaryRealRoot, 'yok-ui-clean-consumer-')
  )
  const consumerDirectory = await realpath(createdConsumerDirectory)
  let isolationAccepted = false

  const registryArgs = source.kind === 'registry'
    ? ['--registry', source.registry]
    : []
  const installArgs = [
    'add',
    '--ignore-workspace',
    '--ignore-scripts',
    ...registryArgs,
    'vue@^3.5.0',
    ...installSpecs
  ]

  try {
    if (
      consumerDirectory === workspaceRealRoot ||
      isPathInside(workspaceRealRoot, consumerDirectory)
    ) {
      throw new Error(
        `Smoke test temporary directory true path must be outside the workspace: ${consumerDirectory}`
      )
    }

    isolationAccepted = true

    const consumerManifest = {
      private: true,
      type: 'module',
      ...(source.kind === 'tarballs'
        ? {
            pnpm: {
              overrides: Object.fromEntries(
                source.tarballs.map(({ packageName, tarballPath }) => [
                  packageName,
                  pathToFileURL(tarballPath).href
                ])
              )
            }
          }
        : {})
    }

    await writeFile(
      resolve(consumerDirectory, 'package.json'),
      `${JSON.stringify(consumerManifest, null, 2)}\n`,
      'utf8'
    )

    await commandRunner({
      command: pnpmCommand,
      args: installArgs,
      context: `Clean consumer install in ${consumerDirectory}`,
      cwd: consumerDirectory,
      timeoutMs: commandTimeoutMs
    })

    const { typeEntries, cssEntries } = await inspectInstalledPackageEntries(
      consumerDirectory,
      expectedVersions
    )
    const probePath = resolve(consumerDirectory, 'import-probe.mjs')

    await writeFile(
      probePath,
      `const packages = ${JSON.stringify(releasePackageNames)}\n` +
      'for (const packageName of packages) { await import(packageName) }\n',
      'utf8'
    )

    await commandRunner({
      command: process.execPath,
      args: [probePath],
      context: `Clean consumer ESM import probe in ${consumerDirectory}`,
      cwd: consumerDirectory,
      timeoutMs: commandTimeoutMs
    })

    return {
      source,
      importedPackages: [...releasePackageNames],
      typeEntries,
      cssEntries,
      ...(keepTemp ? { tempDirectory: consumerDirectory } : {})
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)

    throw createRedactedError(
      `Clean consumer smoke test failed in ${consumerDirectory}: ${reason}\n` +
      `Action: rerun ${smokeCommandSummary(source)}`
    )
  } finally {
    if (!keepTemp || !isolationAccepted) {
      // Remove the directory entry created beneath the trusted temp root. Never
      // recursively remove the resolved target if that entry is swapped for a
      // symlink between creation and containment validation.
      await rm(createdConsumerDirectory, { recursive: true, force: true })
    }
  }
}

async function runCli() {
  const [mode, ...cliArgs] = process.argv.slice(2)

  if (mode !== 'verify') {
    throw new Error(
      'Usage: node scripts/release/package-artifacts.mjs verify ' +
      '[--registry [url] --version x.y.z] [--keep-temp]'
    )
  }

  let registry
  let version
  let keepTemp = false

  for (let index = 0; index < cliArgs.length; index += 1) {
    const argument = cliArgs[index]

    if (argument === '--keep-temp') {
      keepTemp = true
      continue
    }

    if (argument === '--version') {
      version = cliArgs[index + 1]
      index += 1
      continue
    }

    if (argument === '--registry') {
      const candidate = cliArgs[index + 1]

      if (candidate && !candidate.startsWith('--')) {
        registry = candidate
        index += 1
      } else {
        registry = 'https://registry.npmjs.org/'
      }
      continue
    }

    throw new Error(`Unknown release verification option ${argument}`)
  }

  if (registry !== undefined) {
    const smoke = await smokeTestTarballs({ registry, version, keepTemp })

    console.log(JSON.stringify({ smoke }, null, 2))
    return
  }

  const releasePackages = await loadReleasePackages()
  const alignedVersion = getAlignedReleaseVersion(releasePackages)

  if (version !== undefined && version !== alignedVersion) {
    throw new Error(
      `Requested release version ${String(version)} does not match aligned package version ${alignedVersion}`
    )
  }

  const outputDir = resolve(publishRoot, alignedVersion)
  const artifacts = await buildReleaseArtifacts({ outputDir, version: alignedVersion })
  const smoke = await smokeTestTarballs({ tarballs: artifacts, keepTemp })

  console.log(JSON.stringify({ artifacts, smoke }, null, 2))
}

const isCliEntry = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isCliEntry) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
