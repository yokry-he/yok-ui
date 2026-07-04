import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import docsConfig from '../config'
import { components } from '../data/componentRegistry'
import { yokComponentPackages } from './yokAsyncComponents'

const heavyDocsComponents = [
  'ApiReferenceExplorer',
  'ComponentCatalog',
  'LiveExampleRunner',
  'MaturityDashboard',
  'PackageComponents',
  'PlaygroundWorkbench',
  'ThemeLab'
]

describe('docs theme performance', () => {
  it('keeps heavy docs widgets async so the theme entry chunk stays small', () => {
    const themeEntry = readFileSync('docs/.vitepress/theme/index.ts', 'utf8')

    expect(themeEntry).toContain("import { defineAsyncComponent } from 'vue'")
    expect(themeEntry).not.toContain("import ApiTable from '../components/ApiTable.vue'")
    expect(themeEntry).not.toContain("app.component('ApiTable', ApiTable)")

    heavyDocsComponents.forEach((componentName) => {
      expect(themeEntry, `${componentName} should not be statically imported`).not.toMatch(
        new RegExp(`import\\s+${componentName}\\s+from\\s+['"]\\.\\./components/${componentName}\\.vue['"]`)
      )
      expect(themeEntry, `${componentName} should be registered with defineAsyncComponent`).toContain(
        `app.component('${componentName}', defineAsyncComponent(() => import('../components/${componentName}.vue')))`
      )
    })
  })

  it('keeps Yok UI packages registered through async package loaders', () => {
    const themeEntry = readFileSync('docs/.vitepress/theme/index.ts', 'utf8')
    const asyncRegistry = readFileSync('docs/.vitepress/theme/yokAsyncComponents.ts', 'utf8')

    expect(themeEntry).toContain("import { registerAsyncYokComponents } from './yokAsyncComponents'")
    expect(themeEntry).toContain('registerAsyncYokComponents(app)')
    expect(themeEntry).not.toMatch(/import\s+\*\s+as\s+\w+Components\s+from\s+['"]@yok-ui\//)

    ;['@yok-ui/core', '@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand'].forEach((packageName) => {
      expect(asyncRegistry).toContain(`'${packageName}': () => import('${packageName}')`)
    })

    components.forEach((componentMeta) => {
      expect(yokComponentPackages[componentMeta.name]).toBe(componentMeta.packageName)
    })
    ;['YCheckboxGroup', 'YHeader', 'YAside', 'YMain', 'YFooter'].forEach((componentName) => {
      expect(yokComponentPackages[componentName]).toBe('@yok-ui/core')
    })
  })

  it('registers every Yok UI component tag rendered by the playground workbench', () => {
    const playgroundSource = readFileSync('docs/.vitepress/components/PlaygroundWorkbench.vue', 'utf8')
    const playgroundTags = Array.from(
      new Set(
        Array.from(playgroundSource.matchAll(/<\s*(Y[A-Z][A-Za-z0-9]*)\b/g)).map((match) => match[1])
      )
    ).sort()

    expect(playgroundTags.length).toBeGreaterThan(80)

    playgroundTags.forEach((componentName) => {
      expect(yokComponentPackages[componentName], `${componentName} must be async registered for docs runtime`).toBeTruthy()
    })
  })

  it('keeps component route evidence cards from overflowing narrow screens', () => {
    const customCss = readFileSync('docs/.vitepress/theme/custom.css', 'utf8')

    expect(customCss).toContain('.doc-route-navigator__evidence-item p,')
    expect(customCss).toContain('.doc-route-navigator__maturity-item p')
    expect(customCss).toContain('overflow-wrap: anywhere;')
    expect(customCss).toContain('word-break: break-word;')
  })

  it('splits heavy docs widgets into named build chunks without forcing package cycles', () => {
    const manualChunks = docsConfig.vite?.build?.rollupOptions?.output?.manualChunks

    expect(docsConfig.vite?.build?.chunkSizeWarningLimit).toBeLessThanOrEqual(1000)
    expect(typeof manualChunks).toBe('function')

    if (typeof manualChunks !== 'function') {
      throw new TypeError('manualChunks must be a function')
    }

    expect(manualChunks('/repo/docs/.vitepress/components/LiveExampleRunner.vue')).toBe('docs-live-example')
    expect(manualChunks('/repo/docs/.vitepress/data/liveExamples.ts')).toBe('docs-live-data')
    expect(manualChunks('/repo/docs/.vitepress/components/PlaygroundWorkbench.vue')).toBe('docs-playground')
    expect(manualChunks('/repo/docs/.vitepress/components/MaturityDashboard.vue')).toBe('docs-maturity')
    expect(manualChunks('/repo/docs/.vitepress/components/PlaygroundWorkbench.vue?raw')).toBe('docs-source-contracts')
    expect(manualChunks('/repo/docs/.vitepress/components/ApiReferenceExplorer.vue')).toBe('docs-api-reference')
    expect(manualChunks('/repo/docs/.vitepress/components/ComponentCatalog.vue')).toBe('docs-catalog')
    expect(manualChunks('/repo/docs/.vitepress/components/PackageComponents.vue')).toBe('docs-packages')
    expect(manualChunks('/repo/docs/.vitepress/components/ThemeLab.vue')).toBe('docs-theme-lab')
    expect(manualChunks('/repo/packages/core/src/components/button/Button.vue')).toBeUndefined()
    expect(manualChunks('/repo/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js')).toBeUndefined()
  })
})
