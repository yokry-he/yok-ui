import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  inspectPackageTarball,
  inspectPackedManifest
} from './package-artifacts.mjs'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const iconsPackageDir = resolve(workspaceRoot, 'packages/icons')
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
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

describe('inspectPackageTarball', () => {
  const packDirectory = mkdtempSync(resolve(tmpdir(), 'yok-ui-icons-pack-'))
  const sourceManifest = JSON.parse(
    readFileSync(resolve(iconsPackageDir, 'package.json'), 'utf8')
  )
  let tarballPath = ''

  beforeAll(() => {
    execFileSync(pnpmCommand, ['--dir', iconsPackageDir, 'build'], {
      cwd: workspaceRoot,
      encoding: 'utf8'
    })
    execFileSync(
      pnpmCommand,
      ['--dir', iconsPackageDir, 'pack', '--pack-destination', packDirectory],
      {
        cwd: workspaceRoot,
        encoding: 'utf8'
      }
    )

    const tarballs = readdirSync(packDirectory).filter((entry) => entry.endsWith('.tgz'))

    expect(tarballs).toHaveLength(1)
    tarballPath = resolve(packDirectory, tarballs[0])
  }, 120_000)

  afterAll(() => {
    rmSync(packDirectory, { recursive: true, force: true })
  })

  it('accepts real @yok-ui/icons packed content and its rewritten manifest', async () => {
    const inspection = await inspectPackageTarball({
      expectedPackage: {
        name: sourceManifest.name,
        version: sourceManifest.version
      },
      tarballPath
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
  })
})
