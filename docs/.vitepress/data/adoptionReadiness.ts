export type AdoptionReadinessSurface =
  | 'install'
  | 'plugin'
  | 'on-demand'
  | 'auto-import'
  | 'style'
  | 'types'
  | 'theme'
  | 'audit'

export type AdoptionReadinessStatus = 'passed' | 'warning' | 'missing'

export interface AdoptionReadinessGate {
  key: string
  title: string
  surface: AdoptionReadinessSurface
  status: AdoptionReadinessStatus
  packageName?: string
  command?: string
  docs: string[]
  evidence: string[]
  detail: string
}

export interface AdoptionReadinessSummary {
  total: number
  passed: number
  warning: number
  missing: number
  coverageRate: number
  adoptionSurfaces: AdoptionReadinessSurface[]
  evidenceLinks: string[]
  nextQueue: AdoptionReadinessGate[]
}

export const adoptionReadinessGates: AdoptionReadinessGate[] = [
  {
    key: 'package-presets',
    title: 'Package preset install commands',
    surface: 'install',
    status: 'passed',
    command: 'pnpm add @yok-ui/core @yok-ui/themes',
    docs: ['/guide/installation', '/packages/'],
    evidence: ['docs/guide/installation.md', 'docs/packages/index.md'],
    detail: 'Installation docs expose minimal, product, admin, brand and full-system package presets.'
  },
  {
    key: 'full-plugin-install',
    title: 'Full and package plugin registration',
    surface: 'plugin',
    status: 'passed',
    docs: ['/guide/installation'],
    evidence: ['packages/package-install.test.ts', 'docs/guide/installation.md'],
    detail: 'Every component package provides a Vue plugin and package-level install tests register documented components.'
  },
  {
    key: 'named-on-demand-import',
    title: 'Named exports for on-demand import',
    surface: 'on-demand',
    status: 'passed',
    docs: ['/guide/installation'],
    evidence: ['packages/package-exports.test.ts', 'docs/guide/installation.md'],
    detail: 'Documented components must remain importable from their package root so product pages can tree-shake named imports.'
  },
  {
    key: 'auto-import-resolver',
    title: 'unplugin-vue-components resolver',
    surface: 'auto-import',
    status: 'passed',
    packageName: '@yok-ui/resolver',
    command: 'pnpm add -D unplugin-vue-components @yok-ui/resolver',
    docs: ['/guide/installation', '/packages/resolver'],
    evidence: ['packages/resolver/src/resolver.test.ts', 'packages/resolver/README.md', 'docs/packages/resolver.md'],
    detail: 'YokUiResolver maps every documented component to the correct package root and returns package style side effects by default.'
  },
  {
    key: 'style-side-effects',
    title: 'Style side effects and CSS exports',
    surface: 'style',
    status: 'passed',
    docs: ['/guide/installation', '/packages/core', '/packages/product', '/packages/admin', '/packages/brand'],
    evidence: ['packages/package-manifest.test.ts', 'packages/resolver/src/resolver.test.ts'],
    detail: 'Component packages expose ./style.css, preserve CSS side effects for bundlers and let the resolver inject package styles.'
  },
  {
    key: 'type-declarations',
    title: 'Type declarations and package exports',
    surface: 'types',
    status: 'passed',
    docs: ['/guide/installation'],
    evidence: ['packages/package-manifest.test.ts', 'pnpm typecheck'],
    detail: 'Publishable packages point types to dist/index.d.ts and the workspace typecheck keeps declaration output valid.'
  },
  {
    key: 'theme-css-exports',
    title: 'Theme CSS export contract',
    surface: 'theme',
    status: 'passed',
    packageName: '@yok-ui/themes',
    command: 'pnpm add @yok-ui/themes',
    docs: ['/guide/theming', '/guide/token-reference', '/resources/theme-lab', '/packages/themes'],
    evidence: ['packages/package-manifest.test.ts', 'packages/themes/src/tokens.test.ts'],
    detail: 'Theme package exports built-in theme CSS files and tests keep token contrast and manifest exports aligned.'
  },
  {
    key: 'docs-runtime-audit',
    title: 'Docs adoption routes in runtime audit',
    surface: 'audit',
    status: 'passed',
    docs: ['/resources/maturity', '/guide/installation', '/packages/resolver'],
    evidence: ['docs/.vitepress/data/docsA11yAuditTargets.test.ts', 'pnpm docs:a11y'],
    detail: 'Docs audit targets keep the adoption entry points tied to real routes, responsive checks and maturity reporting.'
  }
]

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

export function getAdoptionReadinessSummary(): AdoptionReadinessSummary {
  const passed = adoptionReadinessGates.filter((gate) => gate.status === 'passed').length
  const warning = adoptionReadinessGates.filter((gate) => gate.status === 'warning').length
  const missing = adoptionReadinessGates.filter((gate) => gate.status === 'missing').length

  return {
    total: adoptionReadinessGates.length,
    passed,
    warning,
    missing,
    coverageRate: Math.round((passed / Math.max(adoptionReadinessGates.length, 1)) * 100),
    adoptionSurfaces: unique(adoptionReadinessGates.map((gate) => gate.surface)),
    evidenceLinks: unique(adoptionReadinessGates.flatMap((gate) => gate.docs)),
    nextQueue: adoptionReadinessGates.filter((gate) => gate.status !== 'passed')
  }
}
