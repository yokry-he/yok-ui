import { defineConfig } from 'vitepress'
import {
  componentFamilies,
  components
} from './data/componentRegistry'

export const componentSidebarGroups = componentFamilies
  .map((family) => ({
    text: `${family.title} (${components.filter((component) => component.family === family.id && component.docs.startsWith('/components/')).length})`,
    collapsed: family.id !== 'basic' && family.id !== 'form' && family.id !== 'data',
    items: Array.from(
      components
        .filter((component) => component.family === family.id && component.docs.startsWith('/components/'))
        .reduce((docsMap, component) => {
          const existing = docsMap.get(component.docs)

          docsMap.set(component.docs, {
            text: existing ? `${existing.text} / ${component.title}` : component.title,
            link: component.docs
          })

          return docsMap
        }, new Map<string, { text: string; link: string }>())
        .values()
    )
  }))
  .filter((group) => group.items.length > 0)

export const guideSidebar = [
  {
    text: 'Guide',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/guide/' },
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'Theming', link: '/guide/theming' },
      { text: 'Token Reference', link: '/guide/token-reference' },
      { text: 'Color Contrast', link: '/guide/color-contrast' },
      { text: 'Floating Layer', link: '/guide/floating-layer' },
      { text: 'API Conventions', link: '/guide/component-api' },
      { text: 'Accessibility', link: '/guide/accessibility' },
      { text: 'Roadmap', link: '/guide/roadmap' }
    ]
  }
]

export const packageSidebar = [
  {
    text: 'Packages',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/packages/' },
      { text: 'Core', link: '/packages/core' },
      { text: 'Product', link: '/packages/product' },
      { text: 'Admin', link: '/packages/admin' },
      { text: 'Brand', link: '/packages/brand' },
      { text: 'Hooks', link: '/packages/hooks' },
      { text: 'Icons', link: '/packages/icons' },
      { text: 'Themes', link: '/packages/themes' },
      { text: 'Resolver', link: '/packages/resolver' }
    ]
  }
]

export const resourceSidebar = [
  {
    text: 'Resources',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/resources/' },
      { text: 'API Reference', link: '/resources/api-reference' },
      { text: 'Design System', link: '/resources/design-system' },
      { text: 'Theme Lab', link: '/resources/theme-lab' },
      { text: 'Maturity', link: '/resources/maturity' },
      { text: 'Support Matrix', link: '/resources/support' },
      { text: 'Live Examples', link: '/resources/live-examples' },
      { text: 'Release Center', link: '/resources/release' },
      { text: 'Changelog', link: '/resources/changelog' },
      { text: 'Token Reference', link: '/guide/token-reference' },
      { text: 'Color Contrast', link: '/guide/color-contrast' },
      { text: 'Accessibility', link: '/guide/accessibility' },
      { text: 'Roadmap', link: '/guide/roadmap' }
    ]
  },
  ...packageSidebar
]

export const componentSidebar = [
  {
    text: '<span class="yok-sidebar-root-label">Components</span>',
    collapsed: false,
    items: [
      { text: 'Overview 组件总览', link: '/components/' },
      ...componentSidebarGroups
    ]
  }
]

export const blockSidebar = [
  {
    text: 'Blocks',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/blocks/' },
      { text: 'Command Center', link: '/blocks/command-center' },
      { text: 'Product Settings', link: '/blocks/product-settings' }
    ]
  }
]

export const sectionSidebars = {
  '/guide/': guideSidebar,
  '/components/': componentSidebar,
  '/packages/': packageSidebar,
  '/resources/': resourceSidebar,
  '/blocks/': blockSidebar
}

export const topNavItems = [
  { text: '指南', link: '/guide/' },
  { text: '组件', link: '/components/' },
  { text: '资源', link: '/resources/' }
]

export function docsManualChunks(id: string) {
  const moduleId = id.replace(/\\/g, '/')

  if (moduleId.includes('/docs/.vitepress/components/') && moduleId.includes('?raw')) {
    return 'docs-source-contracts'
  }

  if (moduleId.includes('/docs/.vitepress/data/liveExamples.ts')) {
    return 'docs-live-data'
  }

  if (moduleId.includes('/docs/.vitepress/components/VerificationDashboard.vue')) {
    return 'docs-verification'
  }

  if (moduleId.includes('/docs/.vitepress/components/SourceFileReference.vue')) {
    return 'docs-source'
  }

  if (moduleId.includes('/docs/.vitepress/components/ReleaseVerification.vue')) {
    return 'docs-release-verification'
  }

  if (moduleId.includes('/docs/.vitepress/components/LiveExampleMatrix.vue')) {
    return 'docs-live-example-matrix'
  }

  if (moduleId.includes('/docs/.vitepress/components/VersionHistory.vue')) {
    return 'docs-version-history'
  }

  if (moduleId.includes('/docs/.vitepress/components/ApiReferenceExplorer.vue')) {
    return 'docs-api-reference'
  }

  if (moduleId.includes('/docs/.vitepress/components/ComponentCatalog.vue')) {
    return 'docs-catalog'
  }

  if (moduleId.includes('/docs/.vitepress/components/IconGallery.vue')) {
    return 'docs-icons'
  }

  if (moduleId.includes('/docs/.vitepress/components/PackageComponents.vue')) {
    return 'docs-packages'
  }

  if (moduleId.includes('/docs/.vitepress/components/ThemeLab.vue')) {
    return 'docs-theme-lab'
  }
}

export default defineConfig({
  title: 'Yok UI',
  description: '清爽可爱的 Vue 3 组件系统',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    resolve: {
      alias: [
        {
          find: '@yok-ui/themes/yok-light.css',
          replacement: new URL('../../packages/themes/src/themes/yok-light.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-clean.css',
          replacement: new URL('../../packages/themes/src/themes/yok-clean.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-candy.css',
          replacement: new URL('../../packages/themes/src/themes/yok-candy.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-mint.css',
          replacement: new URL('../../packages/themes/src/themes/yok-mint.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-ocean.css',
          replacement: new URL('../../packages/themes/src/themes/yok-ocean.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-sakura.css',
          replacement: new URL('../../packages/themes/src/themes/yok-sakura.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-lavender.css',
          replacement: new URL('../../packages/themes/src/themes/yok-lavender.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-sunrise.css',
          replacement: new URL('../../packages/themes/src/themes/yok-sunrise.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-forest.css',
          replacement: new URL('../../packages/themes/src/themes/yok-forest.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-ink.css',
          replacement: new URL('../../packages/themes/src/themes/yok-ink.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-peach.css',
          replacement: new URL('../../packages/themes/src/themes/yok-peach.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes/yok-slate.css',
          replacement: new URL('../../packages/themes/src/themes/yok-slate.css', import.meta.url).pathname
        },
        {
          find: '@yok-ui/themes',
          replacement: new URL('../../packages/themes/src', import.meta.url).pathname
        },
        {
          find: '@yok-ui/core',
          replacement: new URL('../../packages/core/src', import.meta.url).pathname
        },
        {
          find: '@yok-ui/product',
          replacement: new URL('../../packages/product/src', import.meta.url).pathname
        },
        {
          find: '@yok-ui/hooks',
          replacement: new URL('../../packages/hooks/src', import.meta.url).pathname
        },
        {
          find: '@yok-ui/icons',
          replacement: new URL('../../packages/icons/src', import.meta.url).pathname
        },
        {
          find: '@yok-ui/admin',
          replacement: new URL('../../packages/admin/src', import.meta.url).pathname
        },
        {
          find: '@yok-ui/brand',
          replacement: new URL('../../packages/brand/src', import.meta.url).pathname
        }
      ]
    },
    build: {
      // VitePress checks both client and SSR chunks. Keep the docs budget explicit
      // while heavy interactive widgets stay in named async chunks.
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: docsManualChunks
        }
      }
    }
  },
  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo.svg'
    },
    nav: topNavItems,
    sidebar: sectionSidebars,
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    search: {
      provider: 'local'
    },
    // Yok UI renders its own Element Plus style component TOC through the theme
    // aside slot, so the built-in VitePress "On this page" outline is disabled
    // to avoid duplicate right-side navigation.
    outline: false,
    footer: {
      message: 'Built as a fresh-cute Vue 3 component system.',
      copyright: 'Yok UI phase one'
    }
  }
})
