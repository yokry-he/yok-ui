import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  loadReleasePackages,
  releaseLevels,
  releasePackageNames,
  validateInternalDependencies
} from './package-graph.mjs'

const expectedReleaseLevels = [
  ['@yok-ui/themes', '@yok-ui/hooks', '@yok-ui/icons', '@yok-ui/resolver'],
  ['@yok-ui/core'],
  ['@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand']
]

const dependencyFields = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
] as const

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function expectedReleasePackages() {
  return expectedReleaseLevels.flatMap((packageNames, level) =>
    packageNames.map((name) => {
      const directory = name.replace('@yok-ui/', '')
      const packageDir = resolve(workspaceRoot, 'packages', directory)
      const manifestPath = resolve(packageDir, 'package.json')

      return {
        name,
        directory,
        packageDir,
        manifestPath,
        manifest: JSON.parse(readFileSync(manifestPath, 'utf8')),
        level
      }
    })
  )
}

function createInternalDependencyRecord({
  name,
  level,
  field,
  dependencyName
}: {
  name: string
  level: number
  field: (typeof dependencyFields)[number]
  dependencyName: string
}) {
  return {
    name,
    level,
    manifest: {
      name,
      [field]: {
        [dependencyName]: 'workspace:*'
      }
    }
  }
}

function expectDependencyValidationError(
  releasePackage: ReturnType<typeof createInternalDependencyRecord>,
  message: string
) {
  let caughtError: unknown

  try {
    validateInternalDependencies([releasePackage])
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(Error)
  expect((caughtError as Error).message).toBe(message)
}

describe('release package graph', () => {
  it('contains the exact public package set in dependency-safe levels', async () => {
    const packages = await loadReleasePackages()
    const expectedPackageNames = expectedReleaseLevels.flat()

    expect(releaseLevels).toEqual(expectedReleaseLevels)
    expect(releasePackageNames).toEqual(expectedPackageNames)
    expect(packages).toStrictEqual(expectedReleasePackages())
  })

  it('resolves package manifests independently from the current working directory', async () => {
    const originalCwd = process.cwd()
    const temporaryCwd = mkdtempSync(resolve(tmpdir(), 'yok-ui-package-graph-'))

    try {
      process.chdir(temporaryCwd)

      expect(await loadReleasePackages()).toStrictEqual(expectedReleasePackages())
    } finally {
      process.chdir(originalCwd)
      rmSync(temporaryCwd, { recursive: true, force: true })
    }
  })

  it('exposes complete public npm metadata', async () => {
    const packages = await loadReleasePackages()

    for (const releasePackage of packages) {
      const { directory, manifest } = releasePackage

      expect(manifest.version, `${manifest.name} should start at the public baseline version`).toBe('0.1.0')
      expect(manifest.publishConfig?.access, `${manifest.name} should publish publicly`).toBe('public')
      expect(manifest.repository).toEqual({
        type: 'git',
        url: 'git+https://github.com/yokry-he/yok-ui.git',
        directory: `packages/${directory}`
      })
      expect(manifest.bugs).toEqual({
        url: 'https://github.com/yokry-he/yok-ui/issues'
      })
      expect(manifest.homepage).toBe(
        `https://github.com/yokry-he/yok-ui/tree/main/packages/${directory}#readme`
      )
      expect(manifest.license).toBe('MIT')
      expect(manifest.files).toContain('README.md')
    }
  })

  it('uses supported string or import/types conditional export targets', async () => {
    const packages = await loadReleasePackages()

    for (const { manifest } of packages) {
      expect(manifest.exports, `${manifest.name} should define package exports`).toBeTruthy()
      expect(manifest.exports, `${manifest.name} should define package exports`).toBeTypeOf('object')
      expect(Object.keys(manifest.exports ?? {}), `${manifest.name} should expose at least one entry`).not.toHaveLength(0)

      for (const [exportPath, target] of Object.entries(manifest.exports ?? {})) {
        if (typeof target === 'string') {
          expect(target, `${manifest.name} ${exportPath} should have a package-relative target`).toMatch(/^\.\/.+/)
          continue
        }

        expect(target, `${manifest.name} ${exportPath} should use conditional exports`).toEqual(
          expect.objectContaining({
            import: expect.any(String),
            types: expect.any(String)
          })
        )

        if (target && typeof target === 'object' && 'import' in target && 'types' in target) {
          expect(target.import, `${manifest.name} ${exportPath} should have a package-relative import target`).toMatch(
            /^\.\/.+/
          )
          expect(target.types, `${manifest.name} ${exportPath} should have a package-relative types target`).toMatch(
            /^\.\/.+/
          )
        }
      }
    }
  })

  it('only depends on known Yok UI packages from previous release levels', async () => {
    const packages = await loadReleasePackages()
    const levelByPackageName = new Map(packages.map(({ name, level }) => [name, level]))

    for (const { level, manifest } of packages) {
      for (const field of dependencyFields) {
        for (const dependencyName of Object.keys(manifest[field] ?? {})) {
          if (!dependencyName.startsWith('@yok-ui/')) {
            continue
          }

          expect(
            levelByPackageName.has(dependencyName),
            `${manifest.name} ${field} references unknown package ${dependencyName}`
          ).toBe(true)
          expect(
            levelByPackageName.get(dependencyName),
            `${manifest.name} ${field} dependency ${dependencyName} must be in a previous release level`
          ).toBeLessThan(level)
        }
      }
    }
  })

  it('reports unknown internal dependencies with the dependent package context', () => {
    const releasePackage = createInternalDependencyRecord({
      name: '@yok-ui/admin',
      level: 2,
      field: 'devDependencies',
      dependencyName: '@yok-ui/private'
    })

    expectDependencyValidationError(
      releasePackage,
      '@yok-ui/admin devDependencies references unknown internal package @yok-ui/private from release level 2'
    )
  })

  it('reports same-level internal dependencies with both release levels', () => {
    const releasePackage = createInternalDependencyRecord({
      name: '@yok-ui/themes',
      level: 0,
      field: 'peerDependencies',
      dependencyName: '@yok-ui/hooks'
    })

    expectDependencyValidationError(
      releasePackage,
      '@yok-ui/themes peerDependencies dependency @yok-ui/hooks must be in a previous release level ' +
      '(package level 0, dependency level 0)'
    )
  })

  it('reports later-level internal dependencies with both release levels', () => {
    const releasePackage = createInternalDependencyRecord({
      name: '@yok-ui/core',
      level: 1,
      field: 'optionalDependencies',
      dependencyName: '@yok-ui/product'
    })

    expectDependencyValidationError(
      releasePackage,
      '@yok-ui/core optionalDependencies dependency @yok-ui/product must be in a previous release level ' +
      '(package level 1, dependency level 2)'
    )
  })
})
