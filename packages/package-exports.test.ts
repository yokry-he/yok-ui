import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { components, type ComponentPackage } from '../docs/.vitepress/data/componentRegistry'

const workspaceRoot = resolve(__dirname, '..')

const packageEntries: Record<ComponentPackage, { importName: ComponentPackage; srcName: string }> = {
  '@yok-ui/core': {
    importName: '@yok-ui/core',
    srcName: 'core'
  },
  '@yok-ui/product': {
    importName: '@yok-ui/product',
    srcName: 'product'
  },
  '@yok-ui/admin': {
    importName: '@yok-ui/admin',
    srcName: 'admin'
  },
  '@yok-ui/brand': {
    importName: '@yok-ui/brand',
    srcName: 'brand'
  }
}

function componentDirsForPackage(srcName: string) {
  const componentsDir = resolve(workspaceRoot, 'packages', srcName, 'src/components')

  return readdirSync(componentsDir)
    .filter((dirName) => {
      const componentPath = resolve(componentsDir, dirName)
      const entryPath = resolve(componentPath, 'index.ts')

      if (dirName.startsWith('_')) {
        return false
      }

      return statSync(componentPath).isDirectory() && existsSync(entryPath) && statSync(entryPath).isFile()
    })
    .sort()
}

function packageIndexSource(srcName: string) {
  return readFileSync(resolve(workspaceRoot, 'packages', srcName, 'src/index.ts'), 'utf8')
}

describe('package export contract', () => {
  it('exports every component directory from its package root entry', () => {
    Object.values(packageEntries).forEach(({ srcName }) => {
      const source = packageIndexSource(srcName)

      componentDirsForPackage(srcName).forEach((dirName) => {
        expect(
          source.includes(`'./components/${dirName}'`) || source.includes(`"./components/${dirName}"`),
          `packages/${srcName}/src/index.ts should export ./components/${dirName}`
        ).toBe(true)
      })
    })
  })

  it('keeps docs registry component names importable from their package root', async () => {
    const packageModules = {
      '@yok-ui/core': await import('@yok-ui/core'),
      '@yok-ui/product': await import('@yok-ui/product'),
      '@yok-ui/admin': await import('@yok-ui/admin'),
      '@yok-ui/brand': await import('@yok-ui/brand')
    } satisfies Record<ComponentPackage, Record<string, unknown>>

    components.forEach((component) => {
      expect(
        packageModules[component.packageName],
        `${component.name} should be exported by ${component.packageName}`
      ).toHaveProperty(component.name)
    })
  }, 15000)
})
