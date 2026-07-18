import { execFile } from 'node:child_process'
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
import { dirname, isAbsolute, posix, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { loadReleasePackages } from './package-graph.mjs'

const execFileAsync = promisify(execFile)
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

function packedEntryForTarget(packageName, field, target) {
  if (typeof target !== 'string' || !target.startsWith('./')) {
    throw new Error(
      `${packageName} field ${field} target ${String(target)} must be a package-relative path`
    )
  }

  const relativeTarget = target.slice(2)
  const normalizedTarget = posix.normalize(relativeTarget)

  if (
    relativeTarget.includes('\\') ||
    normalizedTarget === '..' ||
    normalizedTarget.startsWith('../') ||
    posix.isAbsolute(normalizedTarget)
  ) {
    throw new Error(
      `${packageName} field ${field} target ${target} escapes the packed package directory`
    )
  }

  return `${packageEntryPrefix}${normalizedTarget}`
}

function assertPackedTarget(packageName, field, target, entries) {
  const packedEntry = packedEntryForTarget(packageName, field, target)

  if (!entries.has(packedEntry)) {
    throw new Error(
      `${packageName} field ${field} target ${target} is missing from the tarball`
    )
  }
}

function inspectConditionalExport(packageName, field, target, entries) {
  if (!isPlainObject(target)) {
    throw new Error(
      `${packageName} field ${field} must be a string or an import/types conditional export`
    )
  }

  for (const condition of ['types', 'import']) {
    if (!Object.hasOwn(target, condition)) {
      throw new Error(`${packageName} field ${field}.${condition} is required`)
    }
  }

  for (const [condition, conditionTarget] of Object.entries(target)) {
    assertPackedTarget(packageName, `${field}.${condition}`, conditionTarget, entries)
  }
}

function inspectExports(packageName, exportsField, entries) {
  if (typeof exportsField === 'string') {
    assertPackedTarget(packageName, 'exports', exportsField, entries)
    return
  }

  if (!isPlainObject(exportsField) || Object.keys(exportsField).length === 0) {
    throw new Error(`${packageName} field exports must define at least one export`)
  }

  const exportEntries = Object.entries(exportsField)
  const isSubpathMap = exportEntries.every(([exportPath]) => exportPath.startsWith('.'))

  if (!isSubpathMap) {
    inspectConditionalExport(packageName, 'exports', exportsField, entries)
    return
  }

  for (const [exportPath, target] of exportEntries) {
    const field = `exports[${JSON.stringify(exportPath)}]`

    if (typeof target === 'string') {
      assertPackedTarget(packageName, field, target, entries)
    } else {
      inspectConditionalExport(packageName, field, target, entries)
    }
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

async function runCommand(command, args, context) {
  try {
    return await execFileAsync(command, args, {
      cwd: workspaceRoot,
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024
    })
  } catch (error) {
    const stdout = typeof error?.stdout === 'string' ? error.stdout.trim() : ''
    const stderr = typeof error?.stderr === 'string' ? error.stderr.trim() : ''
    const details = [stderr, stdout, error instanceof Error ? error.message : String(error)]
      .filter(Boolean)
      .join('\n')

    throw new Error(`${context} failed${details ? `:\n${details}` : ''}`)
  }
}

export async function inspectPackageTarball({ expectedPackage, tarballPath }) {
  const packageName = packageContext(expectedPackage)
  const absoluteTarballPath = resolve(tarballPath)
  const [{ stdout: entryOutput }, { stdout: manifestOutput }] = await Promise.all([
    runCommand(
      tarCommand,
      ['-tzf', absoluteTarballPath],
      `${packageName} tar entry inspection for ${absoluteTarballPath}`
    ),
    runCommand(
      tarCommand,
      ['-xOf', absoluteTarballPath, 'package/package.json'],
      `${packageName} packed manifest inspection for ${absoluteTarballPath}`
    )
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

async function packReleasePackage(releasePackage, outputDir, version) {
  const beforePack = new Set(await listTarballs(outputDir))

  await runCommand(
    pnpmCommand,
    [
      '--dir',
      `packages/${releasePackage.directory}`,
      'pack',
      '--pack-destination',
      outputDir
    ],
    `${releasePackage.name} pack`
  )

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
  await inspectPackageTarball({
    expectedPackage: {
      name: releasePackage.name,
      version
    },
    tarballPath
  })

  const [{ size: bytes }, integrity] = await Promise.all([
    stat(tarballPath),
    calculateIntegrity(tarballPath)
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

export async function buildReleaseArtifacts({ outputDir, version } = {}) {
  const releasePackages = await loadReleasePackages()
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

  await runCommand(pnpmCommand, ['build'], 'Yok UI workspace build')

  const artifacts = []

  for (const releasePackage of releasePackages) {
    artifacts.push(
      await packReleasePackage(releasePackage, resolvedOutputDir, alignedVersion)
    )
  }

  await writeFile(
    resolve(resolvedOutputDir, 'release-artifacts.json'),
    `${JSON.stringify(artifacts, null, 2)}\n`,
    'utf8'
  )

  return artifacts
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
