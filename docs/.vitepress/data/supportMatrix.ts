export type SupportMatrixCategory =
  | 'runtime'
  | 'browser'
  | 'bundler'
  | 'package-manager'
  | 'ssr'
  | 'css'
  | 'accessibility'
  | 'automation'

export type SupportMatrixStatus = 'supported' | 'documented' | 'guarded'

export interface SupportMatrixItem {
  key: string
  title: string
  category: SupportMatrixCategory
  status: SupportMatrixStatus
  minimum?: string
  docs: string[]
  evidence: string[]
  detail: string
}

export interface SupportMatrixSummary {
  total: number
  supported: number
  documented: number
  guarded: number
  supportRate: number
  categories: SupportMatrixCategory[]
  docsRoutes: string[]
  nextQueue: SupportMatrixItem[]
}

export const supportMatrixItems: SupportMatrixItem[] = [
  {
    key: 'vue-3-runtime',
    title: 'Vue 3 runtime',
    category: 'runtime',
    status: 'supported',
    minimum: 'Vue 3.4+',
    docs: ['/guide/installation', '/resources/support'],
    evidence: ['package.json', 'packages/package-install.test.ts', 'pnpm typecheck'],
    detail: 'Yok UI packages are Vue 3 libraries, built with script setup components and workspace Vue type checking.'
  },
  {
    key: 'modern-browser-baseline',
    title: 'Modern browser baseline',
    category: 'browser',
    status: 'documented',
    minimum: 'Chrome 85 / Edge 85 / Firefox 79 / Safari 14.1',
    docs: ['/resources/support', '/guide/installation'],
    evidence: ['docs/resources/support.md', 'docs/guide/installation.md'],
    detail: 'Yok UI follows the modern-browser baseline used by Vue 3 era component libraries and avoids IE-specific compatibility work.'
  },
  {
    key: 'no-ie-support',
    title: 'No IE support',
    category: 'browser',
    status: 'documented',
    docs: ['/resources/support', '/guide/installation'],
    evidence: ['docs/resources/support.md', 'docs/guide/installation.md'],
    detail: 'Vue 3 does not target IE11, so Yok UI documents IE as unsupported instead of carrying legacy polyfill behavior.'
  },
  {
    key: 'vite-library-build',
    title: 'Vite library build',
    category: 'bundler',
    status: 'guarded',
    minimum: 'Vite 6',
    docs: ['/resources/support', '/packages/'],
    evidence: ['packages/package-manifest.test.ts', 'pnpm build'],
    detail: 'Every publishable package has a Vite library build and package manifest checks for export and style contracts.'
  },
  {
    key: 'package-manager-install',
    title: 'Package manager install',
    category: 'package-manager',
    status: 'documented',
    minimum: 'pnpm / npm / yarn',
    docs: ['/guide/installation', '/resources/support'],
    evidence: ['docs/guide/installation.md', 'docs/.vitepress/data/adoptionReadiness.ts'],
    detail: 'Installation docs expose pnpm commands while the package contracts remain compatible with standard npm registry clients.'
  },
  {
    key: 'ssr-hydration-boundary',
    title: 'SSR hydration boundary',
    category: 'ssr',
    status: 'documented',
    minimum: 'Client-only floating state',
    docs: ['/resources/support', '/guide/installation', '/guide/floating-layer'],
    evidence: ['docs/guide/installation.md', 'packages/package-exports.test.ts'],
    detail: 'Docs call out that components can render in SSR apps, while floating layers, focus restore and browser-only APIs should initialize on the client.'
  },
  {
    key: 'css-variable-theme-runtime',
    title: 'CSS variable theme runtime',
    category: 'css',
    status: 'guarded',
    minimum: 'CSS custom properties',
    docs: ['/resources/support', '/guide/theming', '/guide/token-reference'],
    evidence: ['packages/themes/src/tokens.test.ts', 'docs/.vitepress/data/themeLab.ts'],
    detail: 'Themes are distributed as CSS variable files and validated through token, contrast and Theme Lab release gates.'
  },
  {
    key: 'a11y-baseline',
    title: 'A11y baseline',
    category: 'accessibility',
    status: 'guarded',
    minimum: 'WCAG AA-oriented docs checks',
    docs: ['/resources/support', '/guide/accessibility', '/resources/maturity'],
    evidence: ['docs/.vitepress/data/accessibilityEvidence.ts', 'pnpm docs:a11y'],
    detail: 'High-risk components and docs routes are tracked through accessibility evidence, interaction contracts and runtime audit targets.'
  },
  {
    key: 'auto-import-tooling',
    title: 'Auto-import tooling',
    category: 'automation',
    status: 'guarded',
    minimum: 'unplugin-vue-components',
    docs: ['/resources/support', '/guide/installation', '/packages/resolver'],
    evidence: ['packages/resolver/src/resolver.test.ts', 'docs/.vitepress/data/adoptionReadiness.ts'],
    detail: 'The resolver maps Yok UI components to package roots and package style side effects for automated template usage.'
  }
]

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

export function getSupportMatrixSummary(): SupportMatrixSummary {
  const documented = supportMatrixItems.filter((item) => item.status === 'documented').length
  const guarded = supportMatrixItems.filter((item) => item.status === 'guarded').length
  const nextQueue = supportMatrixItems.filter((item) => item.status !== 'supported' && item.status !== 'documented' && item.status !== 'guarded')
  const supported = supportMatrixItems.length - nextQueue.length

  return {
    total: supportMatrixItems.length,
    supported,
    documented,
    guarded,
    supportRate: Math.round((supported / Math.max(supportMatrixItems.length, 1)) * 100),
    categories: unique(supportMatrixItems.map((item) => item.category)),
    docsRoutes: unique(supportMatrixItems.flatMap((item) => item.docs)),
    nextQueue
  }
}
