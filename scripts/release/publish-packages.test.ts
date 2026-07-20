import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, resolve } from 'node:path'
import { EventEmitter } from 'node:events'
import { afterEach, describe, expect, it } from 'vitest'
import { releaseLevels, releasePackageNames } from './package-graph.mjs'
import {
  lookupRegistryIntegrity,
  parsePublishCliArgs,
  publishRelease,
  runInteractiveNpmPublish,
  writePublishReceiptAtomic
} from './publish-packages.mjs'

const version = '0.1.0'
const registry = 'https://registry.npmjs.org/'
const temporaryDirectories: string[] = []

function artifactName(packageName: string) {
  return `${packageName.replace('@', '').replace('/', '-')}-${version}.tgz`
}

function createArtifacts() {
  return releaseLevels.flatMap((packageNames, level) =>
    packageNames.map((packageName) => ({
      packageName,
      version,
      level,
      tarballPath: `/safe/artifacts/${artifactName(packageName)}`,
      integrity: `sha512-${Buffer.from(packageName).toString('base64')}`,
      bytes: 100 + level
    }))
  )
}

function createHarness({
  published = new Map<string, string | null>(),
  lookupError = new Map<string, Error>(),
  publishFailure = '',
  verification = 'match'
}: {
  published?: Map<string, string | null>
  lookupError?: Map<string, Error>
  publishFailure?: string
  verification?: 'match' | 'absent' | 'mismatch'
} = {}) {
  const artifacts = createArtifacts()
  const commandCalls: Array<Record<string, any>> = []
  const lookupCalls: Array<Record<string, any>> = []
  const receipts: Array<Record<string, any>> = []
  let tick = 0

  return {
    artifacts,
    commandCalls,
    lookupCalls,
    receipts,
    adapters: {
      buildArtifacts: async (options: Record<string, any>) => {
        expect(options.version).toBe(version)
        return artifacts
      },
      registryLookup: async (options: Record<string, any>) => {
        lookupCalls.push(options)
        const error = lookupError.get(options.packageName)

        if (error) throw error

        if (published.has(options.packageName)) {
          return { status: 'found', integrity: published.get(options.packageName) }
        }

        const artifact = artifacts.find(({ packageName }) => packageName === options.packageName)!
        const wasPublished = commandCalls.some(({ args }) => args?.[1] === artifact.tarballPath)

        if (!wasPublished || verification === 'absent') {
          return { status: 'absent' }
        }

        return {
          status: 'found',
          integrity: verification === 'match' ? artifact.integrity : 'sha512-different'
        }
      },
      commandRunner: async (options: Record<string, any>) => {
        commandCalls.push(options)

        if (publishFailure && options.context.includes(publishFailure)) {
          throw new Error(
            'npm failed Authorization: Bearer npm_SECRET12345678901234567890 _authToken=npm_OTHERSECRET123456789012345'
          )
        }

        return { stdout: 'published', stderr: '' }
      },
      now: () => new Date(Date.UTC(2026, 6, 18, 0, 0, tick++)),
      writeReceipt: async (receipt: Record<string, any>) => {
        receipts.push(structuredClone(receipt))
      }
    }
  }
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('parsePublishCliArgs', () => {
  it('defaults to a non-mutating dry-run', () => {
    expect(parsePublishCliArgs(['--version', version])).toEqual({
      version,
      tag: 'latest',
      registry,
      provenance: false,
      dryRun: true,
      confirmPublicRelease: false
    })
  })

  it('accepts the leading pnpm argument separator used by documented commands', () => {
    expect(parsePublishCliArgs(['--', '--version', version, '--dry-run'])).toMatchObject({
      version,
      dryRun: true,
      confirmPublicRelease: false
    })
  })

  it('accepts the publish subcommand before the pnpm argument separator', () => {
    expect(parsePublishCliArgs(['publish', '--', '--version', version, '--dry-run'])).toMatchObject({
      version,
      dryRun: true,
      confirmPublicRelease: false
    })
  })

  it('accepts a confirmed provenance release', () => {
    expect(parsePublishCliArgs([
      '--version', version,
      '--tag', 'next',
      '--registry', 'https://registry.example.test/npm/',
      '--confirm-public-release',
      '--provenance'
    ])).toEqual({
      version,
      tag: 'next',
      registry: 'https://registry.example.test/npm/',
      provenance: true,
      dryRun: false,
      confirmPublicRelease: true
    })
  })

  it.each([
    [],
    ['--version'],
    ['--version', 'workspace:*'],
    ['--version', version, '--tag', '1.2.3'],
    ['--version', version, '--registry', 'http://registry.npmjs.org/'],
    ['--version', version, '--registry', 'https://user:secret@example.test/'],
    ['--version', version, '--dry-run', '--confirm-public-release'],
    ['--version', version, '--unknown'],
    ['--version', version, '--token', 'secret'],
    ['--version', version, '--otp', '123456']
  ])('rejects invalid or unsafe arguments %#', (args) => {
    expect(() => parsePublishCliArgs(args)).toThrow()
  })

  it('allows HTTP only for explicit loopback registries', () => {
    expect(parsePublishCliArgs([
      '--version', version,
      '--registry', 'http://127.0.0.1:4873/'
    ]).registry).toBe('http://127.0.0.1:4873/')
  })
})

describe('lookupRegistryIntegrity', () => {
  it('queries the exact version at the explicit registry', async () => {
    const calls: Array<Record<string, any>> = []
    const result = await lookupRegistryIntegrity({
      packageName: '@yok-ui/core',
      version,
      registry,
      commandRunner: async (options: Record<string, any>) => {
        calls.push(options)
        return { stdout: '"sha512-exact"\n', stderr: '' }
      }
    })

    expect(result).toEqual({ status: 'found', integrity: 'sha512-exact' })
    expect(calls[0].args).toEqual([
      'view', '@yok-ui/core@0.1.0', 'dist.integrity', '--json', '--registry', registry
    ])
  })

  it('treats only an npm E404 for an absent exact version as absent', async () => {
    const result = await lookupRegistryIntegrity({
      packageName: '@yok-ui/core',
      version,
      registry,
      commandRunner: async () => {
        throw new Error(
          'npm view @yok-ui/core@0.1.0 failed (exit code 1):\n' +
          'npm error code E404\nnpm error No match found for version 0.1.0'
        )
      }
    })

    expect(result).toEqual({ status: 'absent' })
  })

  it('treats a 404 for the exact package spec as an absent package', async () => {
    await expect(lookupRegistryIntegrity({
      packageName: '@yok-ui/core',
      version,
      registry,
      commandRunner: async () => {
        throw new Error(
          'Query @yok-ui/core@0.1.0 registry integrity failed (exit code 1):\n' +
          "npm error code E404\nnpm error 404 '@yok-ui/core@0.1.0' is not in this registry."
        )
      }
    })).resolves.toEqual({ status: 'absent' })
  })

  it('recognizes the npm 11 missing scoped package response used before first publish', async () => {
    await expect(lookupRegistryIntegrity({
      packageName: '@yok-ui/themes',
      version,
      registry,
      commandRunner: async () => {
        throw new Error(
          'Query @yok-ui/themes@0.1.0 registry integrity failed (exit code 1):\n' +
          'npm error code E404\n' +
          'npm error 404 Not Found - GET https://registry.npmjs.org/@yok-ui%2fthemes - Not found\n' +
          "npm error 404 The requested resource '@yok-ui/themes@0.1.0' could not be found or you do not have permission to access it."
        )
      }
    })).resolves.toEqual({ status: 'absent' })
  })

  it.each([
    new Error('npm error code E401 npm error Incorrect or missing password'),
    new Error('npm error code E404 npm error is not in this registry: another-package'),
    new Error(
      'Query @yok-ui/core@0.1.0 registry integrity failed: npm error code E404\n' +
      'npm error No match found for version 0.1.0 of @other-scope/other-package'
    ),
    new Error(
      'Query @yok-ui/core@0.1.0 registry integrity failed: npm error code E404\n' +
      'npm error No match found for version 9.9.9'
    ),
    new Error('request timed out'),
    new Error('unexpected JSON')
  ])('does not convert registry, authentication, or unrelated errors into absence', async (error) => {
    await expect(lookupRegistryIntegrity({
      packageName: '@yok-ui/core',
      version,
      registry,
      commandRunner: async () => { throw error }
    })).rejects.toThrow()
  })

  it.each(['', 'null', '""'])('represents a successful response without integrity %s', async (stdout) => {
    await expect(lookupRegistryIntegrity({
      packageName: '@yok-ui/core',
      version,
      registry,
      commandRunner: async () => ({ stdout, stderr: '' })
    })).resolves.toEqual({ status: 'found', integrity: null })
  })

  it.each(['{}', 'not-json'])('rejects malformed integrity output %s', async (stdout) => {
    await expect(lookupRegistryIntegrity({
      packageName: '@yok-ui/core',
      version,
      registry,
      commandRunner: async () => ({ stdout, stderr: '' })
    })).rejects.toThrow()
  })
})

describe('publishRelease', () => {
  it('dry-runs all packages in dependency order without npm publish', async () => {
    const harness = createHarness()
    const result = await publishRelease({ version, adapters: harness.adapters })

    expect(harness.lookupCalls.map(({ packageName }) => packageName)).toEqual(releasePackageNames)
    expect(harness.commandCalls).toEqual([])
    expect(result.dryRun).toBe(true)
    expect(result.packages.map(({ name, status }: any) => [name, status])).toEqual(
      releasePackageNames.map((name) => [name, 'planned'])
    )
    expect(harness.receipts.at(-1)?.completedAt).toBeTruthy()
  })

  it('requires explicit confirmation before a mutating release', async () => {
    const harness = createHarness()

    await expect(publishRelease({
      version,
      dryRun: false,
      adapters: harness.adapters
    })).rejects.toThrow('confirm')
    expect(harness.lookupCalls).toEqual([])
    expect(harness.commandCalls).toEqual([])
  })

  it('fails a local confirmed release before artifact work when no interactive terminal exists', async () => {
    let built = false

    await expect(publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        terminal: {
          stdin: { isTTY: false },
          stdout: { isTTY: false },
          stderr: { isTTY: false }
        },
        buildArtifacts: async () => {
          built = true
          return createArtifacts()
        },
        registryLookup: async () => ({ status: 'absent' })
      }
    })).rejects.toThrow(/interactive terminal|2FA|npm login/i)

    expect(built).toBe(false)
  })

  it('publishes tarballs only in deterministic release-level order', async () => {
    const harness = createHarness()
    const result = await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: harness.adapters
    })

    expect(harness.commandCalls.map(({ args }) => args)).toEqual(
      releasePackageNames.map((packageName) => [
        'publish', `/safe/artifacts/${artifactName(packageName)}`,
        '--access', 'public',
        '--tag', 'latest',
        '--registry', registry
      ])
    )
    expect(harness.commandCalls.every(({ args }) => args[1].endsWith('.tgz'))).toBe(true)
    expect(result.packages.every(({ status }: any) => status === 'published')).toBe(true)
    expect(harness.lookupCalls).toHaveLength(releasePackageNames.length * 2)
  })

  it('does not report a package as published until registry integrity is confirmed', async () => {
    const harness = createHarness({ verification: 'absent' })

    await expect(publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        sleep: async () => undefined,
        verificationAttempts: 3
      }
    })).rejects.toThrow(/verify|integrity|registry/i)

    expect(harness.commandCalls).toHaveLength(1)
    expect(harness.lookupCalls).toHaveLength(4)
    expect(harness.receipts.at(-1)?.packages[0].status).toBe('failed')
    expect(harness.receipts.at(-1)?.failure.stage).toBe('verification')
  })

  it('fails when post-publish registry integrity differs from the tarball', async () => {
    const harness = createHarness({ verification: 'mismatch' })

    await expect(publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        sleep: async () => undefined
      }
    })).rejects.toThrow(/integrity/i)

    expect(harness.commandCalls).toHaveLength(1)
    expect(harness.receipts.at(-1)?.failure.stage).toBe('verification')
  })

  it('retries bounded registry propagation before confirming publication', async () => {
    const harness = createHarness()
    const firstArtifact = harness.artifacts[0]
    let postPublishLookups = 0
    const delays: number[] = []
    const registryLookup = harness.adapters.registryLookup

    harness.adapters.registryLookup = async (options: Record<string, any>) => {
      const published = harness.commandCalls.some(({ args }) => args?.[1] === firstArtifact.tarballPath)

      if (options.packageName === firstArtifact.packageName && published) {
        postPublishLookups += 1
        if (postPublishLookups === 1) return { status: 'absent' }
      }

      return await registryLookup(options)
    }

    const result = await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        sleep: async (delayMs: number) => { delays.push(delayMs) }
      }
    })

    expect(delays).toEqual([1_000])
    expect(result.packages[0].status).toBe('published')
  })

  it('retries when a newly published version is visible before its integrity metadata', async () => {
    const harness = createHarness()
    const firstArtifact = harness.artifacts[0]
    const registryLookup = harness.adapters.registryLookup
    const delays: number[] = []
    let emptyIntegrityInjected = false

    harness.adapters.registryLookup = async (options: Record<string, any>) => {
      const published = harness.commandCalls.some(({ args }) => args?.[1] === firstArtifact.tarballPath)

      if (
        options.packageName === firstArtifact.packageName &&
        published &&
        !emptyIntegrityInjected
      ) {
        emptyIntegrityInjected = true
        return { status: 'found', integrity: null }
      }

      return await registryLookup(options)
    }

    const result = await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        sleep: async (delayMs: number) => { delays.push(delayMs) }
      }
    })

    expect(delays).toEqual([1_000])
    expect(result.packages[0].status).toBe('published')
  })

  it('retries a transient post-publish registry lookup failure without republishing', async () => {
    const harness = createHarness()
    const firstArtifact = harness.artifacts[0]
    const registryLookup = harness.adapters.registryLookup
    const delays: number[] = []
    let transientFailureInjected = false

    harness.adapters.registryLookup = async (options: Record<string, any>) => {
      const published = harness.commandCalls.some(({ args }) => args?.[1] === firstArtifact.tarballPath)

      if (
        options.packageName === firstArtifact.packageName &&
        published &&
        !transientFailureInjected
      ) {
        transientFailureInjected = true
        throw new Error('registry request timed out')
      }

      return await registryLookup(options)
    }

    const result = await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        sleep: async (delayMs: number) => { delays.push(delayMs) }
      }
    })

    expect(delays).toEqual([1_000])
    expect(harness.commandCalls.filter(({ args }) => args[1] === firstArtifact.tarballPath)).toHaveLength(1)
    expect(result.packages[0].status).toBe('published')
  })

  it('uses the interactive publisher for a confirmed release and keeps lookups captured', async () => {
    const harness = createHarness()
    const publishCalls: Array<Record<string, any>> = []

    await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        publishCommand: async (options: Record<string, any>) => {
          publishCalls.push(options)
          await harness.adapters.commandRunner(options)
        },
        commandRunner: async (options: Record<string, any>) => {
          if (options.args[0] === 'publish') {
            throw new Error('lookup runner must not execute npm publish')
          }
          return { stdout: '', stderr: '' }
        }
      }
    })

    expect(publishCalls).toHaveLength(releasePackageNames.length)
    expect(publishCalls.every(({ requireTty }) => requireTty === true)).toBe(true)
  })

  it('allows non-interactive OIDC publication only when provenance is enabled', async () => {
    const harness = createHarness()
    const publishCalls: Array<Record<string, any>> = []

    await publishRelease({
      version,
      provenance: true,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        trustedPublisherEnvironment: true,
        publishCommand: async (options: Record<string, any>) => {
          publishCalls.push(options)
          await harness.adapters.commandRunner(options)
        }
      }
    })

    expect(publishCalls.every(({ requireTty }) => requireTty === false)).toBe(true)
  })

  it('does not let a local provenance flag bypass the interactive 2FA terminal', async () => {
    const harness = createHarness()
    const publishCalls: Array<Record<string, any>> = []

    await publishRelease({
      version,
      provenance: true,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: {
        ...harness.adapters,
        trustedPublisherEnvironment: false,
        publishCommand: async (options: Record<string, any>) => {
          publishCalls.push(options)
          await harness.adapters.commandRunner(options)
        }
      }
    })

    expect(publishCalls.every(({ requireTty }) => requireTty === true)).toBe(true)
  })

  it('adds provenance only when explicitly requested', async () => {
    const harness = createHarness()

    await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      provenance: true,
      adapters: harness.adapters
    })

    expect(harness.commandCalls.every(({ args }) => args.at(-1) === '--provenance')).toBe(true)
  })

  it('skips an exact existing integrity and publishes remaining packages', async () => {
    const artifacts = createArtifacts()
    const existing = artifacts[0]
    const harness = createHarness({
      published: new Map([[existing.packageName, existing.integrity]])
    })

    const result = await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: harness.adapters
    })

    expect(result.packages[0].status).toBe('skipped')
    expect(harness.commandCalls).toHaveLength(7)
  })

  it.each([null, 'sha512-different'])('fails on existing missing or mismatched integrity %s', async (integrity) => {
    const firstPackage = releasePackageNames[0]
    const harness = createHarness({ published: new Map([[firstPackage, integrity]]) })

    await expect(publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: harness.adapters
    })).rejects.toThrow('integrity')
    expect(harness.commandCalls).toEqual([])
    expect(harness.receipts.at(-1)?.packages[0].status).toBe('failed')
  })

  it('stops on failure, persists a redacted partial receipt, and leaves later packages planned', async () => {
    const failedPackage = releasePackageNames[2]
    const harness = createHarness({ publishFailure: failedPackage })

    await expect(publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: harness.adapters
    })).rejects.toThrow('[REDACTED]')

    expect(harness.commandCalls).toHaveLength(3)
    const receipt = harness.receipts.at(-1)!
    expect(receipt.packages.slice(0, 3).map(({ status }: any) => status)).toEqual([
      'published', 'published', 'failed'
    ])
    expect(receipt.packages.slice(3).every(({ status }: any) => status === 'planned')).toBe(true)
    expect(JSON.stringify(receipt)).not.toMatch(/SECRET|_authToken|Bearer|\/safe\/artifacts/)
    expect(receipt.failure).toEqual({
      packageName: failedPackage,
      stage: 'publish',
      summary: `Failed to publish ${failedPackage}@${version}`
    })
  })

  it('resumes naturally by skipping exact packages discovered on the next run', async () => {
    const artifacts = createArtifacts()
    const alreadyPublished = new Map(
      artifacts.slice(0, 3).map(({ packageName, integrity }) => [packageName, integrity])
    )
    const harness = createHarness({ published: alreadyPublished })

    const result = await publishRelease({
      version,
      dryRun: false,
      confirmPublicRelease: true,
      adapters: harness.adapters
    })

    expect(result.packages.slice(0, 3).every(({ status }: any) => status === 'skipped')).toBe(true)
    expect(harness.commandCalls).toHaveLength(5)
  })

  it('stores only a workspace-relative receipt path and no absolute artifact paths', async () => {
    const harness = createHarness()
    const result = await publishRelease({ version, adapters: harness.adapters })

    expect(result.receiptPath).toBe(`outputs/publish/${version}/publish-receipt.json`)
    expect(JSON.stringify(result)).not.toContain('/safe/artifacts/')
  })

  it('persists lookup failures without publishing or exposing registry output', async () => {
    const firstPackage = releasePackageNames[0]
    const harness = createHarness({
      lookupError: new Map([[
        firstPackage,
        new Error('Authorization: Bearer npm_SECRET12345678901234567890 request failed')
      ]])
    })

    await expect(publishRelease({ version, adapters: harness.adapters })).rejects.toThrow('[REDACTED]')
    expect(harness.commandCalls).toEqual([])
    expect(harness.receipts.at(-1)?.failure).toEqual({
      packageName: firstPackage,
      stage: 'registry',
      summary: `Failed to query ${firstPackage}@${version}`
    })
    expect(JSON.stringify(harness.receipts.at(-1))).not.toContain('SECRET')
  })

  it.each([
    { version: '^1.0.0' },
    { version, tag: '1.2.3' },
    { version, registry: 'http://example.test/' },
    { version, registry: 'https://token@example.test/' },
    { version, provenance: 'yes' as any },
    { version, dryRun: false, confirmPublicRelease: 'yes' as any }
  ])('rejects unsafe publish options %# before building artifacts', async (options) => {
    const harness = createHarness()

    await expect(publishRelease({ ...options, adapters: harness.adapters })).rejects.toThrow()
    expect(harness.lookupCalls).toEqual([])
    expect(harness.commandCalls).toEqual([])
  })

  it('rejects package directories and incomplete artifact sets', async () => {
    const harness = createHarness()
    harness.artifacts[0].tarballPath = '/safe/packages/themes'

    await expect(publishRelease({
      version,
      adapters: {
        ...harness.adapters,
        buildArtifacts: async () => harness.artifacts.slice(0, 7)
      }
    })).rejects.toThrow()

    await expect(publishRelease({ version, adapters: harness.adapters })).rejects.toThrow('.tgz')
  })
})

describe('writePublishReceiptAtomic', () => {
  it('atomically replaces the receipt and removes its temporary file', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'yok-ui-receipt-'))
    temporaryDirectories.push(root)
    const receiptPath = resolve(root, 'nested', 'publish-receipt.json')

    await writePublishReceiptAtomic(receiptPath, { version, dryRun: true })

    expect(JSON.parse(readFileSync(receiptPath, 'utf8'))).toEqual({ version, dryRun: true })
    expect(readdirSync(resolve(root, 'nested'))).toEqual(['publish-receipt.json'])
  })

  it('redacts OTP labels and URL credentials before persisting a receipt', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'yok-ui-receipt-redaction-'))
    temporaryDirectories.push(root)
    const receiptPath = resolve(root, 'publish-receipt.json')

    await writePublishReceiptAtomic(receiptPath, {
      version,
      note: 'otp=123456 one-time password: 654321',
      registry: 'https://user:password@example.test/npm/'
    })

    const contents = readFileSync(receiptPath, 'utf8')
    expect(contents).not.toMatch(/123456|654321|user:password/)
    expect(contents.match(/\[REDACTED\]/g)?.length).toBeGreaterThanOrEqual(3)
  })

  it('cleans up the temporary file when rename fails', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'yok-ui-receipt-failure-'))
    temporaryDirectories.push(root)
    const receiptPath = resolve(root, 'publish-receipt.json')
    const operations: string[] = []

    await expect(writePublishReceiptAtomic(receiptPath, { version }, {
      mkdir: async (path: string) => {
        operations.push(`mkdir:${basename(path)}`)
        mkdirSync(path, { recursive: true })
      },
      writeFile: async (path: string, contents: string) => {
        operations.push(`write:${basename(path)}`)
        writeFileSync(path, contents)
      },
      rename: async () => {
        operations.push('rename')
        throw new Error('rename failed')
      },
      rm: async (path: string) => {
        operations.push(`rm:${basename(path)}`)
        rmSync(path, { force: true })
      }
    })).rejects.toThrow('rename failed')

    expect(operations).toEqual([
      expect.stringMatching(/^mkdir:yok-ui-receipt-failure-/),
      expect.stringMatching(/^write:\.publish-receipt\.json\./),
      'rename',
      expect.stringMatching(/^rm:\.publish-receipt\.json\./)
    ])
    expect(readdirSync(root)).toEqual([])
  })
})

describe('runInteractiveNpmPublish', () => {
  function completedChild() {
    const child = new EventEmitter() as EventEmitter & { kill: () => void }
    child.kill = () => queueMicrotask(() => child.emit('close', null, 'SIGKILL'))
    queueMicrotask(() => child.emit('close', 0, null))
    return child
  }

  it('fails before spawning when local 2FA publication has no TTY', async () => {
    let spawned = false

    await expect(runInteractiveNpmPublish({
      command: 'npm',
      args: ['publish', 'package.tgz'],
      context: 'Publish package',
      requireTty: true,
      stdin: { isTTY: false },
      stdout: { isTTY: false },
      stderr: { isTTY: false },
      spawnImpl: () => {
        spawned = true
        return completedChild() as any
      }
    })).rejects.toThrow(/interactive terminal|2FA|npm login/i)

    expect(spawned).toBe(false)
  })

  it('inherits terminal stdio so npm can prompt for a 2FA code', async () => {
    const calls: Array<Record<string, any>> = []

    await runInteractiveNpmPublish({
      command: 'npm',
      args: ['publish', 'package.tgz'],
      context: 'Publish package',
      requireTty: true,
      stdin: { isTTY: true },
      stdout: { isTTY: true },
      stderr: { isTTY: true },
      spawnImpl: (command: string, args: string[], options: Record<string, any>) => {
        calls.push({ command, args, options })
        return completedChild() as any
      }
    })

    expect(calls[0]).toMatchObject({
      command: 'npm',
      args: ['publish', 'package.tgz'],
      options: { stdio: 'inherit', shell: false }
    })
  })

  it('uses the hardened Windows cmd invocation and enforces a timeout', async () => {
    const calls: Array<Record<string, any>> = []
    const child = new EventEmitter() as EventEmitter & { kill: () => void }
    child.kill = () => queueMicrotask(() => child.emit('close', null, 'SIGKILL'))

    await expect(runInteractiveNpmPublish({
      command: 'npm.cmd',
      args: ['publish', 'package.tgz'],
      context: 'Publish package',
      requireTty: false,
      platform: 'win32',
      env: { ComSpec: 'C:\\Windows\\System32\\cmd.exe' },
      timeoutMs: 1,
      spawnImpl: (command: string, args: string[], options: Record<string, any>) => {
        calls.push({ command, args, options })
        return child as any
      }
    })).rejects.toThrow(/timed out/i)

    expect(calls[0].command).toBe('C:\\Windows\\System32\\cmd.exe')
    expect(calls[0].args.slice(0, 3)).toEqual(['/d', '/s', '/c'])
    expect(calls[0].options).toMatchObject({ stdio: 'inherit', windowsVerbatimArguments: true })
  })
})
