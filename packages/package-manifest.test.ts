import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, normalize, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const workspaceRoot = resolve(__dirname, '..')

const packageNames = ['core', 'product', 'admin', 'brand', 'hooks', 'icons', 'themes', 'resolver'] as const

interface PackageManifest {
  name: string
  description?: string
  license?: string
  keywords?: string[]
  files?: string[]
  main?: string
  module?: string
  types?: string
  exports?: Record<string, unknown>
  sideEffects?: string[] | boolean
}

function readPackageManifest(packageName: (typeof packageNames)[number]) {
  const packageDir = resolve(workspaceRoot, 'packages', packageName)
  const source = readFileSync(resolve(packageDir, 'package.json'), 'utf8')

  return {
    packageDir,
    manifest: JSON.parse(source) as PackageManifest
  }
}

function readMarkdownFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entryName) => {
    const entryPath = resolve(dir, entryName)
    const entryStat = statSync(entryPath)

    if (entryStat.isDirectory()) {
      return readMarkdownFiles(entryPath)
    }

    return entryName.endsWith('.md') ? [readFileSync(entryPath, 'utf8')] : []
  })
}

function exportTarget(exportValue: unknown) {
  if (typeof exportValue === 'string') {
    return exportValue
  }

  if (exportValue && typeof exportValue === 'object' && 'import' in exportValue) {
    return String((exportValue as { import: string }).import)
  }

  return ''
}

describe('package manifests', () => {
  it('keeps every publishable package documented and packable', () => {
    packageNames.forEach((packageName) => {
      const { packageDir, manifest } = readPackageManifest(packageName)

      expect(manifest.description, `${manifest.name} should describe its npm purpose`).toBeTruthy()
      expect(manifest.license, `${manifest.name} should declare a license`).toBe('MIT')
      expect(manifest.keywords?.length, `${manifest.name} should expose npm search keywords`).toBeGreaterThan(0)
      expect(manifest.files, `${manifest.name} should whitelist published files`).toContain('dist')
      expect(manifest.files, `${manifest.name} should publish README.md`).toContain('README.md')
      expect(existsSync(resolve(packageDir, 'README.md')), `${manifest.name} should include README.md`).toBe(true)
      expect(manifest.main).toBe('./dist/index.js')
      expect(manifest.module).toBe('./dist/index.js')
      expect(manifest.types).toBe('./dist/index.d.ts')
    })
  })

  it('points package exports at files that exist after build', () => {
    packageNames.forEach((packageName) => {
      const { packageDir, manifest } = readPackageManifest(packageName)

      Object.entries(manifest.exports ?? {}).forEach(([exportPath, exportValue]) => {
        const target = exportTarget(exportValue)

        expect(target, `${manifest.name} ${exportPath} should resolve to an importable file`).toBeTruthy()
        expect(
          existsSync(resolve(packageDir, target)),
          `${manifest.name} export ${exportPath} should point to ${target}`
        ).toBe(true)
      })
    })
  })

  it('exposes stable CSS entries for component packages and theme files', () => {
    ;(['core', 'product', 'admin', 'brand'] as const).forEach((packageName) => {
      const { manifest } = readPackageManifest(packageName)

      expect(manifest.exports?.['./style.css'], `${manifest.name} should expose ./style.css`).toBe('./dist/index.css')
      expect(manifest.sideEffects, `${manifest.name} should preserve CSS in bundlers`).toContain('**/*.css')
    })

    const { packageDir, manifest } = readPackageManifest('themes')
    const themeExports = [
      './yok-light.css',
      './yok-clean.css',
      './yok-candy.css',
      './yok-mint.css',
      './yok-ocean.css',
      './yok-sakura.css',
      './yok-lavender.css',
      './yok-sunrise.css',
      './yok-forest.css',
      './yok-ink.css',
      './yok-peach.css',
      './yok-slate.css'
    ]

    themeExports.forEach((exportPath) => {
      const target = exportTarget(manifest.exports?.[exportPath])

      expect(target, `${manifest.name} should export ${exportPath}`).toBeTruthy()
      expect(existsSync(resolve(packageDir, target)), `${exportPath} should point to an existing CSS file`).toBe(true)
      expect(normalize(dirname(target)).replace(/^\.\//, '')).toBe('src/themes')
    })
  })

  it('keeps documented package CSS imports backed by package exports', () => {
    const packageByName = Object.fromEntries(
      packageNames.map((packageName) => {
        const { manifest } = readPackageManifest(packageName)

        return [manifest.name, manifest]
      })
    ) as Record<string, PackageManifest>

    const markdownSources = [
      ...readMarkdownFiles(resolve(workspaceRoot, 'docs')),
      ...packageNames.map((packageName) => readFileSync(resolve(workspaceRoot, 'packages', packageName, 'README.md'), 'utf8'))
    ]
    const cssImports = new Set<string>()

    markdownSources.forEach((source) => {
      source.match(/@yok-ui\/[^'"\s]+\.css/g)?.forEach((importPath) => cssImports.add(importPath))
    })

    expect(cssImports.size).toBeGreaterThan(0)

    cssImports.forEach((importPath) => {
      if (importPath.includes('<')) {
        return
      }

      const [, packageSlug, exportPath] = importPath.match(/^@yok-ui\/([^/]+)\/(.+)$/) ?? []
      const packageName = `@yok-ui/${packageSlug}`
      const manifest = packageByName[packageName]

      expect(manifest, `${importPath} should reference a known Yok UI package`).toBeTruthy()
      expect(
        manifest.exports?.[`./${exportPath}`],
        `${importPath} should be exposed through ${packageName} exports`
      ).toBeTruthy()
    })
  })

  it('documents every workspace package in the package docs section', () => {
    const packageIndexSource = readFileSync(resolve(workspaceRoot, 'docs', 'packages', 'index.md'), 'utf8')
    const docsConfigSource = readFileSync(resolve(workspaceRoot, 'docs', '.vitepress', 'config.ts'), 'utf8')
    const docsManifestSource = readFileSync(resolve(workspaceRoot, 'docs', 'package.json'), 'utf8')

    packageNames.forEach((packageName) => {
      const { manifest } = readPackageManifest(packageName)
      const docsRoute = `/packages/${packageName}`

      expect(
        existsSync(resolve(workspaceRoot, 'docs', 'packages', `${packageName}.md`)),
        `${manifest.name} should have a package docs page`
      ).toBe(true)
      expect(packageIndexSource, `docs/packages/index.md should link ${manifest.name}`).toContain(manifest.name)
      expect(packageIndexSource, `docs/packages/index.md should link ${docsRoute}`).toContain(docsRoute)
      expect(docsConfigSource, `package sidebar should include ${docsRoute}`).toContain(docsRoute)

      if (!['resolver'].includes(packageName)) {
        expect(docsManifestSource, `docs should depend on ${manifest.name}`).toContain(`"${manifest.name}": "workspace:*"`)
      }
    })
  })
})
