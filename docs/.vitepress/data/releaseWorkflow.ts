import {
  packageLabels,
  type ComponentPackage,
  type ComponentStatus
} from './componentRegistry'
import {
  getReleaseReadinessSummary,
  type ReleaseReadinessItem
} from './releaseReadiness'

export interface ReleaseWorkflowComponent {
  name: ReleaseReadinessItem['name']
  title: ReleaseReadinessItem['title']
  docs: ReleaseReadinessItem['docs']
  status: ComponentStatus
  score: number
  evidence: string[]
}

export interface ReleaseWorkflowPackage {
  packageName: ComponentPackage
  packageLabel: string
  currentVersion: string
  targetVersion: string
  components: ReleaseWorkflowComponent[]
  changelogLines: string[]
}

export interface ReleaseWorkflowChecklistItem {
  id: 'release-dry-run' | 'typecheck' | 'test' | 'build' | 'docs-build' | 'runtime-a11y'
  label: string
  command: string
  required: boolean
  evidence: string
}

export interface ReleaseWorkflowPromotionItem {
  name: ReleaseWorkflowComponent['name']
  title: ReleaseWorkflowComponent['title']
  docs: ReleaseWorkflowComponent['docs']
  packageName: ComponentPackage
  packageLabel: string
  fromStatus: ComponentStatus
  nextStatus: 'Stable'
  evidenceHref: string
}

export interface ReleaseWorkflowChangelogDraft {
  title: string
  markdown: string
}

export interface ReleaseWorkflowArtifact {
  label: string
  path: string
  format: 'markdown' | 'json'
  description: string
}

export interface ReleaseWorkflowSummary {
  currentVersion: string
  targetVersion: string
  candidateCount: number
  blockedCount: number
  releasePackages: ReleaseWorkflowPackage[]
  checklist: ReleaseWorkflowChecklistItem[]
  promotionQueue: ReleaseWorkflowPromotionItem[]
  changelogDraft: ReleaseWorkflowChangelogDraft
  artifacts: ReleaseWorkflowArtifact[]
}

const currentVersion = '0.1.0'
const targetVersion = '0.2.0'

const artifacts: ReleaseWorkflowArtifact[] = [
  {
    label: 'Markdown release plan',
    path: `outputs/release/yok-ui-${targetVersion}-release-plan.md`,
    format: 'markdown',
    description: '面向人工复核的包级发布计划、门禁命令和 changelog 草稿。'
  },
  {
    label: 'Machine-readable release plan',
    path: `outputs/release/yok-ui-${targetVersion}-release-plan.json`,
    format: 'json',
    description: '面向自动化流程的 dry-run 结构化数据，可供后续 Changesets 或发布脚本接入。'
  }
]

const packageOrder: ComponentPackage[] = [
  '@yok-ui/core',
  '@yok-ui/product',
  '@yok-ui/admin',
  '@yok-ui/brand'
]

const checklist: ReleaseWorkflowChecklistItem[] = [
  {
    id: 'release-dry-run',
    label: 'Release plan dry-run',
    command: 'pnpm release:dry-run',
    required: true,
    evidence: '先生成包级 release plan、changelog 草稿和发布门禁记录，确认不会改写 package version。'
  },
  {
    id: 'typecheck',
    label: 'TypeScript package contract',
    command: 'pnpm typecheck',
    required: true,
    evidence: '所有 workspace package 必须通过 vue-tsc。'
  },
  {
    id: 'test',
    label: 'Unit and docs data tests',
    command: 'pnpm test',
    required: true,
    evidence: '组件行为、文档数据、live example 和资源页测试必须全部通过。'
  },
  {
    id: 'build',
    label: 'Package build artifacts',
    command: 'pnpm build',
    required: true,
    evidence: '发布前必须生成每个 package 的 dist、CSS 和声明文件。'
  },
  {
    id: 'docs-build',
    label: 'Documentation production build',
    command: 'pnpm docs:build',
    required: true,
    evidence: '官网路由、组件页和资源页需要通过 VitePress SSR 构建。'
  },
  {
    id: 'runtime-a11y',
    label: 'Runtime docs accessibility audit',
    command: 'DOCS_A11Y_BASE_URL=http://127.0.0.1:5173 pnpm docs:a11y:runtime',
    required: true,
    evidence: '真实浏览器验收导航、页面结构、live example 锚点和响应式溢出。'
  }
]

function toWorkflowComponent(item: ReleaseReadinessItem): ReleaseWorkflowComponent {
  return {
    name: item.name,
    title: item.title,
    docs: item.docs,
    status: item.status,
    score: item.score,
    evidence: item.gates
      .filter((gate) => gate.passed)
      .map((gate) => gate.label)
  }
}

function createPackagePlan(packageName: ComponentPackage, components: ReleaseWorkflowComponent[]): ReleaseWorkflowPackage {
  return {
    packageName,
    packageLabel: packageLabels[packageName],
    currentVersion,
    targetVersion,
    components,
    changelogLines: components.map((component) =>
      `- ${component.title}: promote ${component.status} -> Stable after ${component.evidence.join(' / ')}.`
    )
  }
}

function createChangelogDraft(releasePackages: ReleaseWorkflowPackage[], gateLabels: string): ReleaseWorkflowChangelogDraft {
  const sections = releasePackages.flatMap((releasePackage) => [
    `### ${releasePackage.packageName}`,
    ...releasePackage.changelogLines,
    ''
  ])

  return {
    title: `Yok UI ${targetVersion} release candidate`,
    markdown: [
      `# Yok UI ${targetVersion} release candidate`,
      '',
      `Release gate evidence: ${gateLabels}`,
      '',
      '## Stable promotions',
      '',
      ...sections,
      '## Required verification',
      '',
      ...checklist.map((item) => `- [ ] ${item.label}: \`${item.command}\``)
    ].join('\n')
  }
}

export function getReleaseWorkflowSummary(): ReleaseWorkflowSummary {
  const readiness = getReleaseReadinessSummary()
  const candidatesByPackage = new Map<ComponentPackage, ReleaseWorkflowComponent[]>()

  readiness.candidates.forEach((item) => {
    const components = candidatesByPackage.get(item.packageName) ?? []
    candidatesByPackage.set(item.packageName, [...components, toWorkflowComponent(item)])
  })

  const releasePackages = packageOrder
    .map((packageName) => createPackagePlan(packageName, candidatesByPackage.get(packageName) ?? []))
    .filter((releasePackage) => releasePackage.components.length > 0)
  const promotionQueue = readiness.candidates.map((item) => ({
    name: item.name,
    title: item.title,
    docs: item.docs,
    packageName: item.packageName,
    packageLabel: packageLabels[item.packageName],
    fromStatus: item.status,
    nextStatus: 'Stable' as const,
    evidenceHref: '/resources/maturity'
  }))

  return {
    currentVersion,
    targetVersion,
    candidateCount: readiness.candidateCount,
    blockedCount: readiness.blockedCount,
    releasePackages,
    checklist,
    promotionQueue,
    changelogDraft: createChangelogDraft(releasePackages, readiness.gateLabels),
    artifacts
  }
}
