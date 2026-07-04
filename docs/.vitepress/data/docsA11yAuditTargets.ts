import {
  accessibilityEvidenceProfiles,
  highRiskAccessibilityComponentNames,
  type AccessibilityEvidenceProfile,
  type AccessibilityEvidenceRisk
} from './accessibilityEvidence'
import { liveExampleDocs } from './liveExamples'

const docsA11yNavigationItems = [
  { text: '指南', link: '/guide/' },
  { text: '组件', link: '/components/' },
  { text: '资源', link: '/resources/' },
  { text: 'Playground', link: '/playground/' }
]

export type DocsA11yAuditPriority = 'critical' | 'high' | 'standard'

export type DocsA11yAuditCheck =
  | 'structure'
  | 'routing'
  | 'keyboard'
  | 'focus'
  | 'aria'
  | 'contrast'
  | 'motion'
  | 'responsive'
  | 'live-example'

export interface DocsA11yAuditViewport {
  id: 'desktop' | 'tablet' | 'mobile'
  width: number
  height: number
  reason: string
}

export interface DocsA11yAuditTargetEvidence {
  docs: string[]
  data: string[]
  tests: string[]
}

export interface DocsA11yAuditTarget {
  id: string
  title: string
  route: string
  scenarioRoute?: string
  source: 'navigation' | 'resource' | 'component'
  priority: DocsA11yAuditPriority
  checks: DocsA11yAuditCheck[]
  viewports: DocsA11yAuditViewport['id'][]
  evidence: DocsA11yAuditTargetEvidence
}

export const docsA11yAuditViewports: DocsA11yAuditViewport[] = [
  {
    id: 'desktop',
    width: 1280,
    height: 900,
    reason: '验证顶部导航、右侧目录、示例面板和宽屏文档阅读密度。'
  },
  {
    id: 'tablet',
    width: 768,
    height: 1024,
    reason: '验证侧栏收敛、卡片网格和 API 表格在中等宽度下可读。'
  },
  {
    id: 'mobile',
    width: 390,
    height: 844,
    reason: '验证移动端首屏、抽屉式导航、示例工具栏和横向溢出风险。'
  }
]

const routeTitleOverrides: Record<string, string> = {
  '/guide/': 'Guide overview',
  '/components/': 'Components overview',
  '/resources/': 'Resources overview',
  '/playground/': 'Playground overview',
  '/resources/maturity': 'Maturity dashboard',
  '/resources/support': 'Support Matrix',
  '/resources/live-examples': 'Live Example Matrix',
  '/resources/release': 'Release Center',
  '/resources/changelog': 'Changelog'
}

const resourceTargets: DocsA11yAuditTarget[] = [
  createStaticTarget({
    id: 'guide-installation',
    title: 'Installation and auto-import guide',
    route: '/guide/installation',
    priority: 'high',
    checks: ['structure', 'routing', 'contrast', 'responsive'],
    evidence: {
      docs: ['docs/guide/installation.md'],
      data: [
        'docs/.vitepress/data/adoptionReadiness.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.ts'
      ],
      tests: [
        'docs/.vitepress/data/adoptionReadiness.test.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts',
        'packages/package-manifest.test.ts',
        'packages/package-install.test.ts'
      ]
    }
  }),
  createStaticTarget({
    id: 'package-resolver',
    title: 'Resolver package docs',
    route: '/packages/resolver',
    priority: 'high',
    checks: ['structure', 'routing', 'contrast', 'responsive'],
    evidence: {
      docs: ['docs/packages/resolver.md', 'packages/resolver/README.md'],
      data: [
        'docs/.vitepress/data/adoptionReadiness.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.ts'
      ],
      tests: [
        'docs/.vitepress/data/adoptionReadiness.test.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts',
        'packages/resolver/src/resolver.test.ts'
      ]
    }
  }),
  createStaticTarget({
    id: 'resource-maturity',
    title: 'Maturity dashboard',
    route: '/resources/maturity',
    priority: 'critical',
    checks: ['structure', 'routing', 'contrast', 'responsive'],
    evidence: {
      docs: ['docs/resources/maturity.md'],
      data: [
        'docs/.vitepress/data/accessibilityEvidence.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.ts'
      ],
      tests: [
        'docs/.vitepress/data/accessibilityEvidence.test.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts'
      ]
    }
  }),
  createStaticTarget({
    id: 'resource-support',
    title: 'Support Matrix',
    route: '/resources/support',
    priority: 'high',
    checks: ['structure', 'routing', 'contrast', 'responsive'],
    evidence: {
      docs: ['docs/resources/support.md'],
      data: [
        'docs/.vitepress/data/supportMatrix.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.ts'
      ],
      tests: [
        'docs/.vitepress/data/supportMatrix.test.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts'
      ]
    }
  }),
  createStaticTarget({
    id: 'resource-live-examples',
    title: 'Live Example Matrix',
    route: '/resources/live-examples',
    priority: 'high',
    checks: ['structure', 'routing', 'contrast', 'responsive', 'live-example'],
    evidence: {
      docs: ['docs/resources/live-examples.md'],
      data: [
        'docs/.vitepress/data/liveExamples.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.ts'
      ],
      tests: [
        'docs/.vitepress/data/liveExamples.test.ts',
        'docs/.vitepress/components/LiveExampleMatrix.test.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts'
      ]
    }
  }),
  createStaticTarget({
    id: 'resource-release',
    title: 'Release Center',
    route: '/resources/release',
    priority: 'high',
    checks: ['structure', 'routing', 'contrast', 'responsive'],
    evidence: {
      docs: ['docs/resources/release.md'],
      data: [
        'docs/.vitepress/data/releaseReadiness.ts',
        'docs/.vitepress/data/releaseWorkflow.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.ts'
      ],
      tests: [
        'docs/.vitepress/data/releaseReadiness.test.ts',
        'docs/.vitepress/data/releaseWorkflow.test.ts',
        'docs/.vitepress/components/ReleaseDashboard.test.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts'
      ]
    }
  }),
  createStaticTarget({
    id: 'resource-changelog',
    title: 'Changelog',
    route: '/resources/changelog',
    priority: 'high',
    checks: ['structure', 'routing', 'contrast', 'responsive'],
    evidence: {
      docs: ['docs/resources/changelog.md'],
      data: [
        'docs/.vitepress/data/releaseHistory.ts',
        'docs/.vitepress/data/releaseWorkflow.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.ts'
      ],
      tests: [
        'docs/.vitepress/data/releaseHistory.test.ts',
        'docs/.vitepress/components/VersionHistory.test.ts',
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts'
      ]
    }
  })
]

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function routeToId(route: string) {
  const normalizedRoute = route.replace(/^\/|\/$/g, '') || 'home'

  return normalizedRoute.replace(/\//g, '-')
}

function routeToDocsPath(route: string) {
  const cleanRoute = route.replace(/\/$/, '')

  if (!cleanRoute || cleanRoute === '/guide') {
    return 'docs/guide/index.md'
  }

  if (cleanRoute === '/components') {
    return 'docs/components/index.md'
  }

  if (cleanRoute === '/resources') {
    return 'docs/resources/index.md'
  }

  if (cleanRoute === '/packages') {
    return 'docs/packages/index.md'
  }

  if (cleanRoute === '/playground') {
    return 'docs/playground/index.md'
  }

  return `docs${cleanRoute}.md`
}

function createStaticTarget(options: {
  id: string
  title: string
  route: string
  priority: DocsA11yAuditPriority
  checks: DocsA11yAuditCheck[]
  evidence: DocsA11yAuditTargetEvidence
}): DocsA11yAuditTarget {
  return {
    source: 'resource',
    viewports: ['desktop', 'mobile'],
    ...options,
    checks: unique([...options.checks, 'responsive'])
  }
}

function getPriority(risk: AccessibilityEvidenceRisk): DocsA11yAuditPriority {
  if (risk === 'critical') {
    return 'critical'
  }

  if (risk === 'complex') {
    return 'high'
  }

  return 'standard'
}

function getChecks(profile: AccessibilityEvidenceProfile): DocsA11yAuditCheck[] {
  const checks: DocsA11yAuditCheck[] = ['structure', 'responsive']

  if (profile.categories.includes('keyboard')) {
    checks.push('keyboard')
  }

  if (profile.categories.includes('focus')) {
    checks.push('focus')
  }

  if (profile.categories.includes('aria')) {
    checks.push('aria')
  }

  if (profile.categories.includes('contrast')) {
    checks.push('contrast')
  }

  if (profile.categories.includes('motion')) {
    checks.push('motion')
  }

  if (liveExampleDocs.has(profile.docsRoute)) {
    checks.push('live-example')
  }

  return unique(checks)
}

function createNavigationTarget(item: { text: string, link: string }): DocsA11yAuditTarget {
  return {
    id: `nav-${routeToId(item.link)}`,
    title: routeTitleOverrides[item.link] ?? item.text,
    route: item.link,
    source: 'navigation',
    priority: item.link === '/components/' ? 'high' : 'standard',
    checks: ['structure', 'routing', 'contrast', 'responsive'],
    viewports: ['desktop', 'mobile'],
    evidence: {
      docs: [routeToDocsPath(item.link)],
      data: ['docs/.vitepress/config.ts'],
      tests: ['docs/.vitepress/data/docsA11yAuditTargets.test.ts']
    }
  }
}

function createComponentTarget(profile: AccessibilityEvidenceProfile): DocsA11yAuditTarget {
  const priority = getPriority(profile.risk)

  return {
    id: `component-${routeToId(profile.docsRoute)}`,
    title: `${profile.title} component page`,
    route: profile.docsRoute,
    scenarioRoute: liveExampleDocs.has(profile.docsRoute) ? `${profile.docsRoute}#live-example` : undefined,
    source: 'component',
    priority,
    checks: getChecks(profile),
    viewports: priority === 'standard' ? ['desktop', 'mobile'] : ['desktop', 'tablet', 'mobile'],
    evidence: {
      docs: profile.evidence.docs,
      data: [
        'docs/.vitepress/data/componentRegistry.ts',
        'docs/.vitepress/data/accessibilityEvidence.ts',
        'docs/.vitepress/data/liveExamples.ts'
      ],
      tests: [
        ...profile.evidence.tests,
        'docs/.vitepress/data/docsA11yAuditTargets.test.ts'
      ]
    }
  }
}

const navigationTargets = docsA11yNavigationItems.map(createNavigationTarget)

const highRiskComponentNames = new Set(highRiskAccessibilityComponentNames)

const componentTargets = accessibilityEvidenceProfiles
  .filter((profile) => highRiskComponentNames.has(profile.componentName))
  .map(createComponentTarget)

export const docsA11yAuditTargets = Array.from(
  [...navigationTargets, ...resourceTargets, ...componentTargets]
    .reduce((targetMap, target) => {
      const previousTarget = targetMap.get(target.route)

      if (!previousTarget) {
        targetMap.set(target.route, target)

        return targetMap
      }

      targetMap.set(target.route, {
        ...previousTarget,
        priority: previousTarget.priority === 'critical' || target.priority === 'critical'
          ? 'critical'
          : previousTarget.priority === 'high' || target.priority === 'high'
            ? 'high'
            : 'standard',
        checks: unique([...previousTarget.checks, ...target.checks]),
        viewports: unique([...previousTarget.viewports, ...target.viewports]),
        evidence: {
          docs: unique([...previousTarget.evidence.docs, ...target.evidence.docs]),
          data: unique([...previousTarget.evidence.data, ...target.evidence.data]),
          tests: unique([...previousTarget.evidence.tests, ...target.evidence.tests])
        },
        scenarioRoute: previousTarget.scenarioRoute ?? target.scenarioRoute
      })

      return targetMap
    }, new Map<string, DocsA11yAuditTarget>())
    .values()
)

export const docsA11yAuditTargetByRoute = new Map(
  docsA11yAuditTargets.map((target) => [target.route.replace(/\/$/, ''), target])
)

export function getDocsA11yAuditTarget(route: string) {
  return docsA11yAuditTargetByRoute.get(route.replace(/\/$/, ''))
}

export function getDocsA11yAuditSummary() {
  const checkCoverage = docsA11yAuditTargets.reduce<Record<DocsA11yAuditCheck, number>>(
    (coverage, target) => {
      target.checks.forEach((check) => {
        coverage[check] += 1
      })

      return coverage
    },
    {
      structure: 0,
      routing: 0,
      keyboard: 0,
      focus: 0,
      aria: 0,
      contrast: 0,
      motion: 0,
      responsive: 0,
      'live-example': 0
    }
  )

  return {
    total: docsA11yAuditTargets.length,
    critical: docsA11yAuditTargets.filter((target) => target.priority === 'critical').length,
    high: docsA11yAuditTargets.filter((target) => target.priority === 'high').length,
    standard: docsA11yAuditTargets.filter((target) => target.priority === 'standard').length,
    mobileCoverageRate: Math.round(
      (docsA11yAuditTargets.filter((target) => target.viewports.includes('mobile')).length /
        Math.max(docsA11yAuditTargets.length, 1)) * 100
    ),
    liveExampleTargets: docsA11yAuditTargets.filter((target) => target.checks.includes('live-example')).length,
    checkCoverage
  }
}
