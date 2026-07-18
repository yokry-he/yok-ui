import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  buildReleaseArtifacts,
  inspectPackageTarball,
  inspectPackedManifest
} from './package-artifacts.mjs'
import * as packageArtifactModule from './package-artifacts.mjs'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const publishRoot = resolve(workspaceRoot, 'outputs/publish')
const iconsPackageDir = resolve(workspaceRoot, 'packages/icons')
const dependencyFields = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
  'devDependencies'
] as const

const expectedPackage = {
  name: '@yok-ui/example',
  version: '1.2.3'
}

function createPackedFixture() {
  return {
    expectedPackage,
    manifest: {
      name: expectedPackage.name,
      version: expectedPackage.version,
      files: ['dist', 'README.md'],
      main: './dist/index.cjs',
      module: './dist/index.js',
      types: './dist/index.d.ts',
      exports: {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.js'
        },
        './style.css': './dist/style.css'
      }
    },
    entries: [
      'package/package.json',
      'package/README.md',
      'package/dist/index.cjs',
      'package/dist/index.js',
      'package/dist/index.d.ts',
      'package/dist/style.css'
    ]
  }
}

function withoutEntry(entries: string[], target: string) {
  return entries.filter((entry) => entry !== `package/${target.replace(/^\.\//, '')}`)
}

function createPublishDirectory(prefix: string) {
  mkdirSync(publishRoot, { recursive: true })

  return mkdtempSync(resolve(publishRoot, prefix))
}

function createBuildHarness({ failPackage = '' } = {}) {
  const releasePackages = [
    {
      name: '@yok-ui/first',
      directory: 'first',
      level: 0,
      manifest: { version: '1.2.3' }
    },
    {
      name: '@yok-ui/second',
      directory: 'second',
      level: 1,
      manifest: { version: '1.2.3' }
    },
    {
      name: '@yok-ui/third',
      directory: 'third',
      level: 2,
      manifest: { version: '1.2.3' }
    }
  ]
  const commands: Array<Record<string, any>> = []

  return {
    releasePackages,
    commands,
    adapters: {
      loadReleasePackages: async () => releasePackages,
      inspectPackageTarball: async () => ({ manifest: {}, entries: [] }),
      commandRunner: async (options: Record<string, any>) => {
        commands.push(options)

        if (options.context === `${failPackage} pack`) {
          throw new Error(`${options.context} failed (exit code 9): intentional failure`)
        }

        if (options.args.includes('pack')) {
          const packageDirectory = options.args[options.args.indexOf('--dir') + 1]
          const outputDir = options.args[options.args.indexOf('--pack-destination') + 1]
          const releasePackage = releasePackages.find(
            ({ directory }) => packageDirectory === `packages/${directory}`
          )
          const tarballName = releasePackage?.name.replace('@', '').replace('/', '-')

          writeFileSync(
            resolve(outputDir, `${tarballName}-1.2.3.tgz`),
            `packed:${releasePackage?.name}`
          )
        }

        return { stdout: '', stderr: '' }
      }
    }
  }
}

describe('inspectPackedManifest', () => {
  it.each(dependencyFields)('rejects workspace protocols in %s', (field) => {
    const fixture = createPackedFixture()
    fixture.manifest[field] = {
      '@yok-ui/internal': 'workspace:^'
    }

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field dependencies'.replace('dependencies', field) +
      ' dependency @yok-ui/internal uses forbidden workspace protocol workspace:^'
    )
  })

  it('rejects a package without README.md', () => {
    const fixture = createPackedFixture()
    fixture.entries = fixture.entries.filter((entry) => entry !== 'package/README.md')

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field README.md target package/README.md is missing from the tarball'
    )
  })

  it.each([
    ['main', './dist/index.cjs'],
    ['module', './dist/index.js'],
    ['types', './dist/index.d.ts']
  ] as const)('rejects a missing %s target', (field, target) => {
    const fixture = createPackedFixture()
    fixture.entries = withoutEntry(fixture.entries, target)

    expect(() => inspectPackedManifest(fixture)).toThrow(
      `@yok-ui/example field ${field} target ${target} is missing from the tarball`
    )
  })

  it('rejects a missing string export target', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./feature'] = './dist/feature.js'

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./feature"] target ./dist/feature.js is missing from the tarball'
    )
  })

  it('rejects a missing conditional export target', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./feature'] = {
      types: './dist/feature.d.ts',
      import: './dist/feature.js'
    }

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./feature"].types target ./dist/feature.d.ts is missing from the tarball'
    )
  })

  it('rejects a missing CSS export target with export context', () => {
    const fixture = createPackedFixture()
    fixture.entries = withoutEntry(fixture.entries, './dist/style.css')

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./style.css"] target ./dist/style.css is missing from the tarball'
    )
  })

  it.each([
    ['./dist/./index.js', '.'],
    ['./dist/../index.js', '..'],
    ['./node_modules/dependency/index.js', 'node_modules']
  ] as const)('rejects forbidden path segments in target %s', (target, segment) => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./unsafe'] = target

    expect(() => inspectPackedManifest(fixture)).toThrow(
      `@yok-ui/example field exports["./unsafe"] target ${target} contains forbidden path segment ${segment}`
    )
  })

  it.each([
    ['./dist/%2e%2e/index.js', '%2e%2e', '..'],
    ['./dist/%2E/index.js', '%2E', '.'],
    ['./dist/%6eode_modules/index.js', '%6eode_modules', 'node_modules']
  ] as const)(
    'rejects percent-encoded forbidden path segments in target %s',
    (target, segment, decodedSegment) => {
      const fixture = createPackedFixture()
      fixture.manifest.exports['./unsafe'] = target

      expect(() => inspectPackedManifest(fixture)).toThrow(
        `@yok-ui/example field exports["./unsafe"] target ${target} contains forbidden path segment ${segment} ` +
        `(decoded as ${decodedSegment})`
      )
    }
  )

  it('rejects empty export target path segments', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./unsafe'] = './dist//index.js'

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./unsafe"] target ./dist//index.js contains an empty path segment'
    )
  })

  it('rejects malformed percent encoding with target and segment context', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./unsafe'] = './dist/%2/index.js'

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./unsafe"] target ./dist/%2/index.js contains malformed percent encoding in segment %2'
    )
  })

  it.each([
    ['./dist%2Findex.js', 'dist%2Findex.js', '/'],
    ['./dist%5Cindex.js', 'dist%5Cindex.js', '\\']
  ] as const)(
    'rejects encoded path separators in target %s',
    (target, segment, separator) => {
      const fixture = createPackedFixture()
      fixture.manifest.exports['./unsafe'] = target

      expect(() => inspectPackedManifest(fixture)).toThrow(
        `@yok-ui/example field exports["./unsafe"] target ${target} segment ${segment} ` +
        `decodes to forbidden path separator ${JSON.stringify(separator)}`
      )
    }
  )

  it.each(['../dist/index.js', '/dist/index.js', 'dist/index.js'])(
    'rejects non-package-relative target %s',
    (target) => {
      const fixture = createPackedFixture()
      fixture.manifest.exports['./unsafe'] = target

      expect(() => inspectPackedManifest(fixture)).toThrow(
        `@yok-ui/example field exports["./unsafe"] target ${target} must be a package-relative path`
      )
    }
  )

  it('accepts nested condition objects and validates every concrete target', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./feature'] = {
      types: './dist/feature.d.ts',
      import: {
        node: './dist/feature.node.js',
        default: './dist/feature.js'
      }
    }
    fixture.entries.push(
      'package/dist/feature.d.ts',
      'package/dist/feature.node.js',
      'package/dist/feature.js'
    )

    expect(inspectPackedManifest(fixture)).toBe(fixture.manifest)

    fixture.entries = withoutEntry(fixture.entries, './dist/feature.node.js')

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./feature"].import.node target ./dist/feature.node.js is missing from the tarball'
    )
  })

  it('accepts fallback arrays and null export targets', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./feature'] = [
      './dist/feature.js',
      {
        node: './dist/feature.node.js',
        default: null
      }
    ]
    fixture.manifest.exports['./disabled'] = null
    fixture.entries.push('package/dist/feature.js', 'package/dist/feature.node.js')

    expect(inspectPackedManifest(fixture)).toBe(fixture.manifest)
  })

  it('reports a missing target inside an export fallback array', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./feature'] = [
      './dist/feature.js',
      { default: './dist/feature.fallback.js' }
    ]
    fixture.entries.push('package/dist/feature.js')

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./feature"][1].default target ./dist/feature.fallback.js is missing from the tarball'
    )
  })

  it.each([42, true, [], {}])('rejects invalid export target shape %#', (target) => {
    const fixture = createPackedFixture()
    fixture.manifest.exports['./invalid'] = target

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports["./invalid"] must be a string, null, condition object, or non-empty fallback array'
    )
  })

  it('rejects exports objects that mix subpath and condition keys', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports = {
      '.': './dist/index.js',
      default: './dist/index.cjs'
    }

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports cannot mix subpath and condition keys'
    )
  })

  it.each(['.bad', '..'])(
    'rejects malformed export subpath key %s',
    (exportPath) => {
      const fixture = createPackedFixture()
      fixture.manifest.exports = {
        [exportPath]: './dist/index.js'
      }

      expect(() => inspectPackedManifest(fixture)).toThrow(
        `@yok-ui/example field exports contains invalid subpath key ${JSON.stringify(exportPath)}`
      )
    }
  )

  it.each([
    ['./feature/../secret', 'contains forbidden path segment ..'],
    ['./feature//secret', 'contains an empty path segment'],
    ['./%2e%2e/secret', 'contains forbidden path segment %2e%2e (decoded as ..)'],
    ['./node_modules/secret', 'contains forbidden path segment node_modules'],
    ['./feature%2Fsecret', 'segment feature%2Fsecret decodes to forbidden path separator "/"'],
    ['./feature%5Csecret', 'segment feature%5Csecret decodes to forbidden path separator "\\\\"'],
    ['./feature\\secret', 'contains a literal backslash'],
    ['./feature/%2/secret', 'contains malformed percent encoding in segment %2'],
    ['./', 'contains an empty path segment']
  ] as const)(
    'rejects invalid package export subpath key %s',
    (exportPath, reason) => {
      const fixture = createPackedFixture()
      fixture.manifest.exports = {
        [exportPath]: './dist/index.js'
      }

      expect(() => inspectPackedManifest(fixture)).toThrow(
        `@yok-ui/example field exports subpath key ${JSON.stringify(exportPath)} ${reason}`
      )
    }
  )

  it('rejects an empty exports condition key', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports = {
      '': './dist/index.js'
    }

    expect(() => inspectPackedManifest(fixture)).toThrow(
      '@yok-ui/example field exports contains invalid condition key ""'
    )
  })

  it('accepts exact root and package-relative subpath export keys', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports = {
      '.': './dist/index.js',
      './feature': './dist/feature.js'
    }
    fixture.entries.push('package/dist/feature.js')

    expect(inspectPackedManifest(fixture)).toBe(fixture.manifest)
  })

  it('accepts dotted, scoped-looking, and nested package paths', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports = {
      '.': './dist/index.js',
      './feature': './dist/feature.js',
      './feature/file.min.js': './dist/file.min.js',
      './@scope/name': './dist/@scope/name.js',
      './feature/nested/path': './dist/nested/path.js'
    }
    fixture.entries.push(
      'package/dist/feature.js',
      'package/dist/file.min.js',
      'package/dist/@scope/name.js',
      'package/dist/nested/path.js'
    )

    expect(inspectPackedManifest(fixture)).toBe(fixture.manifest)
  })

  it('accepts a package-level string export', () => {
    const fixture = createPackedFixture()
    fixture.manifest.exports = './dist/index.js'

    expect(inspectPackedManifest(fixture)).toBe(fixture.manifest)
  })

  it('accepts conditional import and types targets', () => {
    const fixture = createPackedFixture()

    expect(inspectPackedManifest(fixture)).toBe(fixture.manifest)
  })

  it.each([
    ['name', '@yok-ui/unexpected'],
    ['version', '9.9.9']
  ] as const)('validates the expected package %s', (field, value) => {
    const fixture = createPackedFixture()
    fixture.manifest[field] = value

    expect(() => inspectPackedManifest(fixture)).toThrow(
      `@yok-ui/example field ${field} expected ${expectedPackage[field]} but found ${value}`
    )
  })
})

describe('portable command runner', () => {
  it('routes Windows cmd shims through cmd.exe with escaped arguments', () => {
    const createCommandInvocation = (
      packageArtifactModule as typeof packageArtifactModule & {
        createCommandInvocation: (...args: any[]) => {
          command: string
          args: string[]
          windowsVerbatimArguments?: boolean
        }
      }
    ).createCommandInvocation
    const invocation = createCommandInvocation(
      'pnpm.cmd',
      ['--pack-destination', 'C:\\publish dir\\artifact & echo unsafe'],
      {
        platform: 'win32',
        env: { ComSpec: 'C:\\Windows\\System32\\cmd.exe' }
      }
    )

    expect(invocation.command).toBe('C:\\Windows\\System32\\cmd.exe')
    expect(invocation.args.slice(0, 3)).toEqual(['/d', '/s', '/c'])
    expect(invocation.args).toHaveLength(4)
    expect(invocation.args[3]).toContain('^&')
    expect(invocation.args[3]).not.toContain(' & ')
    expect(invocation.windowsVerbatimArguments).toBe(true)
  })

  it('uses direct command execution outside Windows cmd shims', () => {
    const createCommandInvocation = (
      packageArtifactModule as typeof packageArtifactModule & {
        createCommandInvocation: (...args: any[]) => {
          command: string
          args: string[]
          windowsVerbatimArguments?: boolean
        }
      }
    ).createCommandInvocation

    expect(
      createCommandInvocation('pnpm', ['build'], { platform: 'linux', env: {} })
    ).toEqual({
      command: 'pnpm',
      args: ['build'],
      windowsVerbatimArguments: false
    })
  })

  it('rejects command arguments containing line breaks', () => {
    const createCommandInvocation = (
      packageArtifactModule as typeof packageArtifactModule & {
        createCommandInvocation: (...args: any[]) => unknown
      }
    ).createCommandInvocation

    expect(() =>
      createCommandInvocation('pnpm.cmd', ['safe\nunsafe'], {
        platform: 'win32',
        env: { ComSpec: 'cmd.exe' }
      })
    ).toThrow('Windows command arguments must not contain NUL or line break characters')
  })

  it('reports command failure context without including unrelated environment values', async () => {
    const runCommand = (
      packageArtifactModule as typeof packageArtifactModule & {
        runCommand: (options: Record<string, unknown>) => Promise<unknown>
      }
    ).runCommand
    const secret = 'must-not-appear-in-command-error'
    let caughtError: unknown

    try {
      await runCommand({
        command: process.execPath,
        args: ['--eval', "process.stderr.write('intentional failure'); process.exit(7)"],
        context: '@yok-ui/example pack',
        cwd: workspaceRoot,
        timeoutMs: 5_000,
        env: { ...process.env, ARTIFACT_TEST_SECRET: secret }
      })
    } catch (error) {
      caughtError = error
    }

    expect(caughtError).toBeInstanceOf(Error)
    expect((caughtError as Error).message).toContain('@yok-ui/example pack failed')
    expect((caughtError as Error).message).toContain('intentional failure')
    expect((caughtError as Error).message).not.toContain(secret)
  })

  it('terminates a command after the configured timeout with context', async () => {
    const runCommand = (
      packageArtifactModule as typeof packageArtifactModule & {
        runCommand: (options: Record<string, unknown>) => Promise<unknown>
      }
    ).runCommand

    await expect(
      runCommand({
        command: process.execPath,
        args: ['--eval', 'setTimeout(() => {}, 10_000)'],
        context: 'slow tar inspection',
        cwd: workspaceRoot,
        timeoutMs: 30
      })
    ).rejects.toThrow('slow tar inspection timed out after 30ms')
  })
})

describe('buildReleaseArtifacts', () => {
  it('cleans stale output, builds once, packs in graph order, and writes deterministic records', async () => {
    const outputDir = createPublishDirectory('package-artifacts-build-')
    const harness = createBuildHarness()

    writeFileSync(resolve(outputDir, 'stale-package.tgz'), 'stale')
    writeFileSync(resolve(outputDir, 'release-artifacts.json'), 'stale manifest')

    try {
      const artifacts = await buildReleaseArtifacts({
        outputDir,
        commandTimeoutMs: 1_234,
        adapters: harness.adapters
      })

      expect(harness.commands.map(({ context }) => context)).toEqual([
        'Yok UI workspace build',
        '@yok-ui/first pack',
        '@yok-ui/second pack',
        '@yok-ui/third pack'
      ])
      expect(harness.commands.every(({ timeoutMs }) => timeoutMs === 1_234)).toBe(true)
      expect(existsSync(resolve(outputDir, 'stale-package.tgz'))).toBe(false)
      expect(artifacts.map(({ packageName, level }) => ({ packageName, level }))).toEqual([
        { packageName: '@yok-ui/first', level: 0 },
        { packageName: '@yok-ui/second', level: 1 },
        { packageName: '@yok-ui/third', level: 2 }
      ])

      for (const artifact of artifacts) {
        const bytes = readFileSync(artifact.tarballPath)
        const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`

        expect(artifact.bytes).toBe(bytes.length)
        expect(artifact.integrity).toBe(integrity)
      }

      expect(
        JSON.parse(readFileSync(resolve(outputDir, 'release-artifacts.json'), 'utf8'))
      ).toEqual(artifacts)
    } finally {
      rmSync(outputDir, { recursive: true, force: true })
    }
  })

  it('rejects output outside outputs/publish before running commands', async () => {
    const harness = createBuildHarness()
    const outputDir = resolve(workspaceRoot, 'outputs/outside-publish')

    await expect(
      buildReleaseArtifacts({ outputDir, adapters: harness.adapters })
    ).rejects.toThrow(`Release artifact outputDir ${outputDir} must be a child of ${publishRoot}`)
    expect(harness.commands).toHaveLength(0)
    expect(existsSync(outputDir)).toBe(false)
  })

  it.skipIf(process.platform === 'win32')(
    'rejects an output path containing a symlink without touching its destination',
    async () => {
      const symlinkContainer = createPublishDirectory('package-artifacts-symlink-')
      const outsideDirectory = mkdtempSync(resolve(tmpdir(), 'package-artifacts-outside-'))
      const symlinkPath = resolve(symlinkContainer, 'escape')
      const sentinelPath = resolve(outsideDirectory, 'sentinel.txt')
      const harness = createBuildHarness()

      writeFileSync(sentinelPath, 'preserve me')
      symlinkSync(outsideDirectory, symlinkPath, 'dir')

      try {
        await expect(
          buildReleaseArtifacts({
            outputDir: resolve(symlinkPath, 'artifacts'),
            adapters: harness.adapters
          })
        ).rejects.toThrow(`Release artifact output path must not contain symlink ${symlinkPath}`)
        expect(readFileSync(sentinelPath, 'utf8')).toBe('preserve me')
        expect(harness.commands).toHaveLength(0)
      } finally {
        rmSync(symlinkContainer, { recursive: true, force: true })
        rmSync(outsideDirectory, { recursive: true, force: true })
      }
    }
  )

  it('removes all partial artifacts when a package command fails', async () => {
    const outputDir = createPublishDirectory('package-artifacts-failure-')
    const harness = createBuildHarness({ failPackage: '@yok-ui/second' })

    await expect(
      buildReleaseArtifacts({ outputDir, adapters: harness.adapters })
    ).rejects.toThrow('@yok-ui/second pack failed (exit code 9): intentional failure')

    expect(existsSync(outputDir)).toBe(false)
    expect(harness.commands.map(({ context }) => context)).toEqual([
      'Yok UI workspace build',
      '@yok-ui/first pack',
      '@yok-ui/second pack'
    ])
  })
})

describe('buildReleaseArtifacts real package integration', () => {
  const outputDir = createPublishDirectory('package-artifacts-icons-')
  const sourceManifest = JSON.parse(
    readFileSync(resolve(iconsPackageDir, 'package.json'), 'utf8')
  )
  let artifacts: Awaited<ReturnType<typeof buildReleaseArtifacts>> = []

  beforeAll(async () => {
    const portableRunCommand = (
      packageArtifactModule as typeof packageArtifactModule & {
        runCommand: (options: Record<string, any>) => Promise<{ stdout: string; stderr: string }>
      }
    ).runCommand

    artifacts = await buildReleaseArtifacts({
      outputDir,
      adapters: {
        loadReleasePackages: async () => [
          {
            name: sourceManifest.name,
            directory: 'icons',
            packageDir: iconsPackageDir,
            manifest: sourceManifest,
            level: 0
          }
        ],
        commandRunner: async (options: Record<string, any>) => {
          if (options.context === 'Yok UI workspace build') {
            return await portableRunCommand({
              ...options,
              args: ['--dir', iconsPackageDir, 'build']
            })
          }

          return await portableRunCommand(options)
        }
      }
    })
  }, 120_000)

  afterAll(() => {
    rmSync(outputDir, { recursive: true, force: true })
  })

  it('builds and accepts real @yok-ui/icons packed content and its rewritten manifest', async () => {
    expect(artifacts).toHaveLength(1)

    const inspection = await inspectPackageTarball({
      expectedPackage: {
        name: sourceManifest.name,
        version: sourceManifest.version
      },
      tarballPath: artifacts[0].tarballPath
    })

    expect(inspection.manifest.name).toBe('@yok-ui/icons')
    expect(inspection.manifest.version).toBe('0.1.0')
    expect(inspection.entries).toContain('package/README.md')
    expect(inspection.entries).toContain('package/dist/index.js')

    for (const field of dependencyFields) {
      for (const value of Object.values(inspection.manifest[field] ?? {})) {
        expect(value).not.toMatch(/^workspace:/)
      }
    }

    expect(
      JSON.parse(readFileSync(resolve(outputDir, 'release-artifacts.json'), 'utf8'))
    ).toEqual(artifacts)
  })
})
