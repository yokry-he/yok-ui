import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import docsConfig from '../config'
import { components } from '../data/componentRegistry'
import { yokComponentPackages } from './yokAsyncComponents'

const heavyDocsComponents = [
  'ApiReferenceExplorer',
  'ComponentCatalog',
  'IconGallery',
  'PackageComponents',
  'SourceFileReference',
  'ThemeLab',
  'VerificationDashboard'
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

  it('keeps development evidence panels out of final component docs', () => {
    const themeEntry = readFileSync('docs/.vitepress/theme/index.ts', 'utf8')
    const layout = readFileSync('docs/.vitepress/theme/Layout.vue', 'utf8')

    expect(themeEntry).not.toContain('ComponentAccessibilityEvidence')
    expect(layout).not.toContain('DocRouteNavigator')
    expect(layout).not.toContain('#doc-after')
  })

  it('splits heavy docs widgets into named build chunks without forcing package cycles', () => {
    const manualChunks = docsConfig.vite?.build?.rollupOptions?.output?.manualChunks

    expect(docsConfig.vite?.build?.chunkSizeWarningLimit).toBeLessThanOrEqual(1000)
    expect(typeof manualChunks).toBe('function')

    if (typeof manualChunks !== 'function') {
      throw new TypeError('manualChunks must be a function')
    }

    expect(manualChunks('/repo/docs/.vitepress/components/LiveExampleRunner.vue')).toBeUndefined()
    expect(manualChunks('/repo/docs/.vitepress/data/liveExamples.ts')).toBe('docs-live-data')
    expect(manualChunks('/repo/docs/.vitepress/components/SourceFileReference.vue')).toBe('docs-source')
    expect(manualChunks('/repo/docs/.vitepress/components/VerificationDashboard.vue')).toBe('docs-verification')
    expect(manualChunks('/repo/docs/.vitepress/components/ReleaseVerification.vue')).toBe('docs-release-verification')
    expect(manualChunks('/repo/docs/.vitepress/components/SourceFileReference.vue?raw')).toBe('docs-source-contracts')
    expect(manualChunks('/repo/docs/.vitepress/components/ApiReferenceExplorer.vue')).toBe('docs-api-reference')
    expect(manualChunks('/repo/docs/.vitepress/components/ComponentCatalog.vue')).toBe('docs-catalog')
    expect(manualChunks('/repo/docs/.vitepress/components/IconGallery.vue')).toBe('docs-icons')
    expect(manualChunks('/repo/docs/.vitepress/components/PackageComponents.vue')).toBe('docs-packages')
    expect(manualChunks('/repo/docs/.vitepress/components/ThemeLab.vue')).toBe('docs-theme-lab')
    expect(manualChunks('/repo/packages/core/src/components/button/Button.vue')).toBeUndefined()
    expect(manualChunks('/repo/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js')).toBeUndefined()
  })
})
