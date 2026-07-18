import { describe, expect, it } from 'vitest'
import { loadReleasePackages, releaseLevels, releasePackageNames } from './package-graph.mjs'

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

describe('release package graph', () => {
  it('contains the exact public package set in dependency-safe levels', async () => {
    const packages = await loadReleasePackages()
    const expectedPackageNames = expectedReleaseLevels.flat()

    expect(releaseLevels).toEqual(expectedReleaseLevels)
    expect(releasePackageNames).toEqual(expectedPackageNames)
    expect(packages.map((releasePackage) => releasePackage.name)).toEqual(expectedPackageNames)
    expect(new Set(packages.map((releasePackage) => releasePackage.manifest.name))).toEqual(
      new Set(expectedPackageNames)
    )
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
      expect(manifest.homepage).toContain(
        `github.com/yokry-he/yok-ui/tree/main/packages/${directory}`
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
          expect(target, `${manifest.name} ${exportPath} should have a string target`).not.toBe('')
          continue
        }

        expect(target, `${manifest.name} ${exportPath} should use conditional exports`).toEqual(
          expect.objectContaining({
            import: expect.any(String),
            types: expect.any(String)
          })
        )

        if (target && typeof target === 'object' && 'import' in target && 'types' in target) {
          expect(target.import, `${manifest.name} ${exportPath} should have an import target`).not.toBe('')
          expect(target.types, `${manifest.name} ${exportPath} should have a types target`).not.toBe('')
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
})
