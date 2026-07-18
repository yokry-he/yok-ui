import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import {
  lstat,
  mkdir,
  readdir,
  rm,
  stat,
  writeFile
} from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadReleasePackages } from './package-graph.mjs'

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
    throw new Error(`${context} timeoutMs must be a positive finite number`)
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

      reject(new Error(`${context} failed to start: ${reason}`))
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
      reject(new Error(`${context} failed to start: ${error.message}`))
    })

    child.on('close', (code, signal) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeout)

      if (timedOut) {
        reject(new Error(`${context} timed out after ${timeoutMs}ms`))
        return
      }

      if (exceededBuffer) {
        reject(new Error(`${context} exceeded output limit of ${maxBufferBytes} bytes`))
        return
      }

      const stdout = Buffer.concat(stdoutChunks).toString('utf8')
      const stderr = Buffer.concat(stderrChunks).toString('utf8')

      if (code !== 0) {
        const output = [stderr.trim(), stdout.trim()].filter(Boolean).join('\n')
        const exitDetail = signal ? `signal ${signal}` : `exit code ${String(code)}`

        reject(new Error(`${context} failed (${exitDetail})${output ? `:\n${output}` : ''}`))
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

async function runCli() {
  const [mode] = process.argv.slice(2)

  if (mode !== 'verify') {
    throw new Error('Usage: node scripts/release/package-artifacts.mjs verify')
  }

  const releasePackages = await loadReleasePackages()
  const version = getAlignedReleaseVersion(releasePackages)
  const outputDir = resolve(publishRoot, version)
  const artifacts = await buildReleaseArtifacts({ outputDir, version })

  console.log(JSON.stringify(artifacts, null, 2))
}

const isCliEntry = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isCliEntry) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
