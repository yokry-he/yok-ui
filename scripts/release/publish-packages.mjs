import { spawn } from 'node:child_process'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildReleaseArtifacts,
  createCommandInvocation,
  getReleaseArtifactOutputDirectory,
  redactSensitiveText,
  runCommand,
  validateRegistryUrl
} from './package-artifacts.mjs'
import { releaseLevels, releasePackageNames } from './package-graph.mjs'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const defaultRegistry = 'https://registry.npmjs.org/'
const exactVersionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/
const distTagPattern = /^[A-Za-z][0-9A-Za-z._-]{0,127}$/
const integrityPattern = /^sha(?:256|384|512)-[A-Za-z0-9+/]+={0,2}$/
// Newly created scoped packages can take several minutes to reach registry reads.
// Linear backoff across 24 attempts allows about 4.6 minutes of propagation.
const defaultVerificationAttempts = 24
const defaultVerificationDelayMs = 1_000
const defaultPublishTimeoutMs = 15 * 60 * 1_000
let receiptSequence = 0

function validateExactVersion(version) {
  if (typeof version !== 'string' || !exactVersionPattern.test(version)) {
    throw new Error(`Release version ${String(version)} must be an exact semantic version`)
  }

  return version
}

function validateTag(tag) {
  if (
    typeof tag !== 'string' ||
    !distTagPattern.test(tag) ||
    exactVersionPattern.test(tag) ||
    tag.includes('..')
  ) {
    throw new Error(`Release tag ${String(tag)} must be a safe npm dist-tag, not a version or range`)
  }

  return tag
}

function validateBoolean(value, name) {
  if (typeof value !== 'boolean') {
    throw new Error(`Release option ${name} must be a boolean`)
  }

  return value
}

function timestamp(now) {
  const value = now()
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new Error('Release clock returned an invalid timestamp')
  }

  return date.toISOString()
}

function safeErrorMessage(error) {
  return redactSensitiveText(error instanceof Error ? error.message : String(error))
}

function hasInteractiveTerminal({ stdin, stdout, stderr }) {
  return Boolean(stdin?.isTTY && stdout?.isTTY && stderr?.isTTY)
}

function interactiveTerminalError(context) {
  return new Error(
    `${context} requires an interactive terminal so npm can request the account 2FA code. ` +
    'Run npm login in a terminal, then rerun the confirmed release there. ' +
    'Never pass an OTP or npm token as a command argument.'
  )
}

export async function runInteractiveNpmPublish({
  command,
  args,
  context,
  cwd = workspaceRoot,
  timeoutMs = defaultPublishTimeoutMs,
  requireTty = true,
  env = process.env,
  platform = process.platform,
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
  spawnImpl = spawn
}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error(`${context} timeoutMs must be a positive finite number`)
  }

  if (requireTty && !hasInteractiveTerminal({ stdin, stdout, stderr })) {
    throw interactiveTerminalError(context)
  }

  const invocation = createCommandInvocation(command, args, { platform, env })

  await new Promise((resolvePromise, reject) => {
    let child

    try {
      child = spawnImpl(invocation.command, invocation.args, {
        cwd,
        env,
        shell: false,
        stdio: 'inherit',
        windowsVerbatimArguments: invocation.windowsVerbatimArguments
      })
    } catch (error) {
      reject(new Error(`${context} failed to start: ${safeErrorMessage(error)}`))
      return
    }

    let settled = false
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeoutMs)

    child.on('error', (error) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      reject(new Error(`${context} failed to start: ${safeErrorMessage(error)}`))
    })

    child.on('close', (code, signal) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)

      if (timedOut) {
        reject(new Error(`${context} timed out after ${timeoutMs}ms`))
        return
      }

      if (code !== 0) {
        const exitDetail = signal ? `signal ${signal}` : `exit code ${String(code)}`
        reject(new Error(`${context} failed (${exitDetail})`))
        return
      }

      resolvePromise(undefined)
    })
  })
}

function isExactVersionNotFound(error, packageName, version) {
  const message = safeErrorMessage(error)
  const exactPackageSpec = `${packageName}@${version}`
  const hasE404 = /(?:^|\s)(?:npm\s+error\s+code\s+)?E404(?:\s|$)/i.test(message)
  const hasExactContext = message.includes(exactPackageSpec)
  const hasForeignScopedPackage = (
    message.match(/@[0-9A-Za-z._-]+\/[0-9A-Za-z._-]+/g) ?? []
  ).some((referencedPackageName) => referencedPackageName !== packageName)
  const hasExactVersionMiss = new RegExp(
    `No match found for version\\s+["']?${version.replaceAll('.', '\\.')}["']?`,
    'i'
  ).test(message)

  const hasExactPackageMiss = message.split(/\r?\n/).some((line) =>
    line.includes(exactPackageSpec) &&
    /(?:not in this registry|not found|could not be found)/i.test(line) &&
    !/^Query\s+/i.test(line.trim())
  )

  return hasE404 && !hasForeignScopedPackage && hasExactContext && (
    hasExactVersionMiss || hasExactPackageMiss
  )
}

function parseIntegrityOutput(stdout, packageName, version) {
  const output = String(stdout).trim()

  if (output === '') {
    return null
  }

  let parsed

  try {
    parsed = JSON.parse(output)
  } catch {
    throw new Error(`Registry returned invalid JSON for ${packageName}@${version}`)
  }

  if (parsed === null || parsed === '') {
    return null
  }

  if (typeof parsed !== 'string' || !integrityPattern.test(parsed)) {
    throw new Error(`Registry returned invalid dist.integrity for ${packageName}@${version}`)
  }

  return parsed
}

export async function lookupRegistryIntegrity({
  packageName,
  version,
  registry,
  commandRunner = runCommand
}) {
  const packageSpec = `${packageName}@${version}`

  try {
    const { stdout } = await commandRunner({
      command: npmCommand,
      args: ['view', packageSpec, 'dist.integrity', '--json', '--registry', registry],
      context: `Query ${packageSpec} registry integrity`,
      cwd: workspaceRoot
    })

    return {
      status: 'found',
      integrity: parseIntegrityOutput(stdout, packageName, version)
    }
  } catch (error) {
    if (isExactVersionNotFound(error, packageName, version)) {
      return { status: 'absent' }
    }

    throw new Error(`Registry query failed for ${packageSpec}: ${safeErrorMessage(error)}`)
  }
}

function readRequiredValue(args, index, option) {
  const value = args[index + 1]

  if (value === undefined || value.startsWith('--')) {
    throw new Error(`${option} requires a value`)
  }

  return value
}

export function parsePublishCliArgs(args) {
  const commandArgs = args[0] === 'publish' ? args.slice(1) : args
  const normalizedArgs = commandArgs[0] === '--' ? commandArgs.slice(1) : commandArgs
  let version
  let tag = 'latest'
  let registry = defaultRegistry
  let provenance = false
  let confirmPublicRelease = false
  let explicitDryRun = false
  const seen = new Set()

  for (let index = 0; index < normalizedArgs.length; index += 1) {
    const argument = normalizedArgs[index]

    if (seen.has(argument)) {
      throw new Error(`Duplicate release option ${argument}`)
    }

    seen.add(argument)

    if (argument === '--version') {
      version = readRequiredValue(normalizedArgs, index, argument)
      index += 1
      continue
    }

    if (argument === '--tag') {
      tag = readRequiredValue(normalizedArgs, index, argument)
      index += 1
      continue
    }

    if (argument === '--registry') {
      registry = readRequiredValue(normalizedArgs, index, argument)
      index += 1
      continue
    }

    if (argument === '--provenance') {
      provenance = true
      continue
    }

    if (argument === '--confirm-public-release') {
      confirmPublicRelease = true
      continue
    }

    if (argument === '--dry-run') {
      explicitDryRun = true
      continue
    }

    throw new Error(`Unknown release option ${argument}`)
  }

  if (explicitDryRun && confirmPublicRelease) {
    throw new Error('--dry-run cannot be combined with --confirm-public-release')
  }

  return {
    version: validateExactVersion(version),
    tag: validateTag(tag),
    registry: validateRegistryUrl(registry, 'Release registry'),
    provenance,
    dryRun: !confirmPublicRelease,
    confirmPublicRelease
  }
}

export async function writePublishReceiptAtomic(receiptPath, receipt, adapters = {}) {
  const mkdirAdapter = adapters.mkdir ?? mkdir
  const writeFileAdapter = adapters.writeFile ?? writeFile
  const renameAdapter = adapters.rename ?? rename
  const rmAdapter = adapters.rm ?? rm
  const directory = dirname(receiptPath)
  const temporaryPath = resolve(
    directory,
    `.publish-receipt.json.${process.pid}.${receiptSequence++}.tmp`
  )

  await mkdirAdapter(directory, { recursive: true })

  try {
    const serialized = `${redactSensitiveText(JSON.stringify(receipt, null, 2))}\n`

    await writeFileAdapter(temporaryPath, serialized, { encoding: 'utf8', mode: 0o600 })
    await renameAdapter(temporaryPath, receiptPath)
  } catch (error) {
    try {
      await rmAdapter(temporaryPath, { force: true })
    } catch (cleanupError) {
      throw new AggregateError(
        [error, cleanupError],
        'Publish receipt write failed and temporary receipt cleanup also failed'
      )
    }

    throw error
  }
}

function validateArtifacts(artifacts, version) {
  if (!Array.isArray(artifacts)) {
    throw new Error('Release artifact builder must return an array')
  }

  const expectedLevels = new Map(
    releaseLevels.flatMap((packageNames, level) =>
      packageNames.map((packageName) => [packageName, level])
    )
  )
  const artifactByName = new Map()

  for (const artifact of artifacts) {
    const packageName = artifact?.packageName

    if (typeof packageName !== 'string' || !expectedLevels.has(packageName)) {
      throw new Error(`Release artifact contains unexpected package ${String(packageName)}`)
    }

    if (artifactByName.has(packageName)) {
      throw new Error(`Release artifact set contains duplicate ${packageName}`)
    }

    if (artifact.version !== version) {
      throw new Error(`${packageName} artifact version does not match ${version}`)
    }

    if (artifact.level !== expectedLevels.get(packageName)) {
      throw new Error(`${packageName} artifact release level is invalid`)
    }

    if (typeof artifact.tarballPath !== 'string' || !artifact.tarballPath.endsWith('.tgz')) {
      throw new Error(`${packageName} publication requires a verified .tgz tarball path`)
    }

    if (typeof artifact.integrity !== 'string' || !integrityPattern.test(artifact.integrity)) {
      throw new Error(`${packageName} artifact integrity is invalid`)
    }

    if (!Number.isSafeInteger(artifact.bytes) || artifact.bytes <= 0) {
      throw new Error(`${packageName} artifact byte size is invalid`)
    }

    artifactByName.set(packageName, artifact)
  }

  if (artifactByName.size !== releasePackageNames.length) {
    throw new Error(
      `Release artifact set must contain all ${releasePackageNames.length} packages`
    )
  }

  return releasePackageNames.map((packageName) => artifactByName.get(packageName))
}

function createReceipt({ version, tag, registry, provenance, dryRun, receiptPath, startedAt }) {
  const registryUrl = new URL(registry)

  return {
    schemaVersion: 1,
    dryRun,
    version,
    tag,
    provenance,
    receiptPath,
    registry: {
      host: registryUrl.host,
      publicUrl: registryUrl.href
    },
    startedAt,
    updatedAt: startedAt,
    packages: []
  }
}

function packageReceipt(artifact) {
  return {
    name: artifact.packageName,
    version: artifact.version,
    level: artifact.level,
    artifact: {
      integrity: artifact.integrity,
      bytes: artifact.bytes,
      fileName: artifact.tarballPath.split(/[\\/]/).at(-1)
    },
    status: 'planned'
  }
}

export async function publishRelease({
  version,
  tag = 'latest',
  registry = defaultRegistry,
  provenance = false,
  dryRun = true,
  confirmPublicRelease = false,
  adapters = {}
} = {}) {
  const normalizedVersion = validateExactVersion(version)
  const normalizedTag = validateTag(tag)
  const normalizedRegistry = validateRegistryUrl(registry, 'Release registry')

  validateBoolean(provenance, 'provenance')
  validateBoolean(dryRun, 'dryRun')
  validateBoolean(confirmPublicRelease, 'confirmPublicRelease')

  if (!dryRun && !confirmPublicRelease) {
    throw new Error('Network publication requires explicit confirmPublicRelease')
  }

  if (dryRun && confirmPublicRelease) {
    throw new Error('dryRun cannot be combined with confirmPublicRelease')
  }

  const terminal = adapters.terminal ?? {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr
  }
  const trustedPublisherEnvironment = adapters.trustedPublisherEnvironment ?? Boolean(
    process.env.GITHUB_ACTIONS === 'true' && process.env.ACTIONS_ID_TOKEN_REQUEST_URL
  )
  validateBoolean(trustedPublisherEnvironment, 'trustedPublisherEnvironment')
  const nonInteractiveTrustedPublish = provenance && trustedPublisherEnvironment
  const usesDefaultInteractivePublisher =
    adapters.publishCommand === undefined && adapters.commandRunner === undefined

  if (
    !dryRun &&
    !nonInteractiveTrustedPublish &&
    usesDefaultInteractivePublisher &&
    !hasInteractiveTerminal(terminal)
  ) {
    throw interactiveTerminalError('Local npm publication')
  }

  const buildArtifacts = adapters.buildArtifacts ?? buildReleaseArtifacts
  const registryLookup = adapters.registryLookup ?? lookupRegistryIntegrity
  const commandRunner = adapters.commandRunner ?? runCommand
  const publishCommand = adapters.publishCommand ?? adapters.commandRunner ?? runInteractiveNpmPublish
  const now = adapters.now ?? (() => new Date())
  const relativeReceiptPath = `outputs/publish/${normalizedVersion}/publish-receipt.json`
  const receiptPath = resolve(workspaceRoot, relativeReceiptPath)
  const writeReceipt = adapters.writeReceipt ?? (
    (receipt) => writePublishReceiptAtomic(receiptPath, receipt)
  )
  const receipt = createReceipt({
    version: normalizedVersion,
    tag: normalizedTag,
    registry: normalizedRegistry,
    provenance,
    dryRun,
    receiptPath: relativeReceiptPath,
    startedAt: timestamp(now)
  })

  const persistReceipt = async () => {
    receipt.updatedAt = timestamp(now)
    await writeReceipt(structuredClone(receipt), receiptPath)
  }
  const verificationAttempts = adapters.verificationAttempts ?? defaultVerificationAttempts
  const verificationDelayMs = adapters.verificationDelayMs ?? defaultVerificationDelayMs
  const sleep = adapters.sleep ?? (
    (delayMs) => new Promise((resolvePromise) => setTimeout(resolvePromise, delayMs))
  )

  if (!Number.isSafeInteger(verificationAttempts) || verificationAttempts <= 0) {
    throw new Error('verificationAttempts must be a positive safe integer')
  }

  if (!Number.isFinite(verificationDelayMs) || verificationDelayMs < 0) {
    throw new Error('verificationDelayMs must be a non-negative finite number')
  }

  let artifacts

  try {
    artifacts = validateArtifacts(await buildArtifacts({
      version: normalizedVersion,
      outputDir: getReleaseArtifactOutputDirectory(normalizedVersion)
    }), normalizedVersion)
  } catch (error) {
    receipt.failure = {
      stage: 'artifacts',
      summary: `Failed to build verified artifacts for ${normalizedVersion}`
    }
    await persistReceipt()
    throw new Error(`${receipt.failure.summary}: ${safeErrorMessage(error)}`)
  }

  receipt.packages = artifacts.map(packageReceipt)
  await persistReceipt()

  for (let index = 0; index < artifacts.length; index += 1) {
    const artifact = artifacts[index]
    const packageRecord = receipt.packages[index]
    let published

    try {
      published = await registryLookup({
        packageName: artifact.packageName,
        version: normalizedVersion,
        registry: normalizedRegistry,
        commandRunner
      })
    } catch (error) {
      packageRecord.status = 'failed'
      receipt.failure = {
        packageName: artifact.packageName,
        stage: 'registry',
        summary: `Failed to query ${artifact.packageName}@${normalizedVersion}`
      }
      await persistReceipt()
      throw new Error(`${receipt.failure.summary}: ${safeErrorMessage(error)}`)
    }

    if (published?.status === 'found') {
      if (published.integrity === artifact.integrity) {
        packageRecord.status = 'skipped'
        await persistReceipt()
        continue
      }

      packageRecord.status = 'failed'
      receipt.failure = {
        packageName: artifact.packageName,
        stage: 'integrity',
        summary: `Registry integrity conflict for ${artifact.packageName}@${normalizedVersion}`
      }
      await persistReceipt()
      throw new Error(
        `${receipt.failure.summary}; refusing to overwrite an existing immutable npm version`
      )
    }

    if (published?.status !== 'absent') {
      packageRecord.status = 'failed'
      receipt.failure = {
        packageName: artifact.packageName,
        stage: 'registry',
        summary: `Registry returned an invalid status for ${artifact.packageName}@${normalizedVersion}`
      }
      await persistReceipt()
      throw new Error(receipt.failure.summary)
    }

    if (dryRun) {
      continue
    }

    const args = [
      'publish',
      artifact.tarballPath,
      '--access',
      'public',
      '--tag',
      normalizedTag,
      '--registry',
      normalizedRegistry
    ]

    // npm can attach OIDC provenance automatically in supported CI environments;
    // the explicit flag remains available for reproducible workflow compatibility.
    if (provenance) {
      args.push('--provenance')
    }

    let operationStage = 'publish'

    try {
      packageRecord.status = 'publishing'
      await persistReceipt()
      await publishCommand({
        command: npmCommand,
        args,
        context: `Publish ${artifact.packageName}@${normalizedVersion}`,
        cwd: workspaceRoot,
        requireTty: !nonInteractiveTrustedPublish,
        ...terminal
      })

      operationStage = 'verification'
      packageRecord.status = 'verifying'
      await persistReceipt()
      let verified = false

      for (let attempt = 1; attempt <= verificationAttempts; attempt += 1) {
        let verification

        try {
          verification = await registryLookup({
            packageName: artifact.packageName,
            version: normalizedVersion,
            registry: normalizedRegistry,
            commandRunner
          })
        } catch (error) {
          if (attempt === verificationAttempts) {
            throw new Error(
              `Registry verification query failed after ${verificationAttempts} attempts: ` +
              safeErrorMessage(error)
            )
          }

          await sleep(verificationDelayMs * attempt)
          continue
        }

        if (verification?.status === 'found') {
          if (verification.integrity === artifact.integrity) {
            verified = true
            break
          }

          if (verification.integrity !== null) {
            throw new Error(
              `Published registry integrity does not match the verified tarball on attempt ${attempt}`
            )
          }

          if (attempt < verificationAttempts) {
            await sleep(verificationDelayMs * attempt)
          }
          continue
        }

        if (verification?.status !== 'absent') {
          throw new Error(`Registry returned invalid verification status on attempt ${attempt}`)
        }

        if (attempt < verificationAttempts) {
          await sleep(verificationDelayMs * attempt)
        }
      }

      if (!verified) {
        throw new Error(
          `Registry did not expose matching integrity after ${verificationAttempts} verification attempts`
        )
      }

      packageRecord.status = 'published'
      packageRecord.verifiedAt = timestamp(now)
      await persistReceipt()
    } catch (error) {
      packageRecord.status = 'failed'
      receipt.failure = {
        packageName: artifact.packageName,
        stage: operationStage,
        summary: operationStage === 'verification'
          ? `Failed to verify ${artifact.packageName}@${normalizedVersion} after publication`
          : `Failed to publish ${artifact.packageName}@${normalizedVersion}`
      }
      await persistReceipt()
      throw new Error(`${receipt.failure.summary}: ${safeErrorMessage(error)}`)
    }
  }

  receipt.completedAt = timestamp(now)
  await persistReceipt()
  return structuredClone(receipt)
}

async function runCli() {
  const options = parsePublishCliArgs(process.argv.slice(2))
  const receipt = await publishRelease(options)

  console.log(JSON.stringify(receipt, null, 2))
}

const isCliEntry = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isCliEntry) {
  runCli().catch((error) => {
    console.error(safeErrorMessage(error))
    process.exitCode = 1
  })
}
