import {
  type ComponentPackage
} from './componentRegistry'
import {
  getReleaseWorkflowSummary,
  type ReleaseWorkflowComponent
} from './releaseWorkflow'

export type ReleaseHistoryItemType =
  | 'stable-promotions'
  | 'documentation'
  | 'accessibility'
  | 'build'

export interface ReleaseHistoryFilter {
  key: 'all' | ReleaseHistoryItemType
  label: string
}

export interface ReleaseHistoryItem {
  type: ReleaseHistoryItemType
  label: string
  title: string
  detail: string
  href: string
}

export interface ReleaseHistoryEvidenceLink {
  label: string
  href: string
}

export interface ReleaseHistoryPackageSection {
  packageName: ComponentPackage
  packageLabel: string
  items: ReleaseWorkflowComponent[]
}

export interface ReleaseHistoryEntry {
  version: string
  status: 'release-candidate' | 'current-baseline'
  statusLabel: string
  title: string
  summary: string
  items: ReleaseHistoryItem[]
  packageSections: ReleaseHistoryPackageSection[]
  evidenceLinks: ReleaseHistoryEvidenceLink[]
}

export interface ReleaseHistorySummary {
  filters: ReleaseHistoryFilter[]
  entries: ReleaseHistoryEntry[]
}

export const releaseHistoryFilters: ReleaseHistoryFilter[] = [
  { key: 'all', label: 'All' },
  { key: 'stable-promotions', label: 'Stable promotions' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'build', label: 'Build' }
]

function createCandidateEntry(): ReleaseHistoryEntry {
  const workflow = getReleaseWorkflowSummary()

  return {
    version: workflow.targetVersion,
    status: 'release-candidate',
    statusLabel: 'Release candidate',
    title: `Yok UI ${workflow.targetVersion}`,
    summary: `${workflow.candidateCount} components are grouped into ${workflow.releasePackages.length} package release plans with shared readiness evidence.`,
    items: [
      {
        type: 'stable-promotions',
        label: 'Stable promotions',
        title: 'Promote release-ready components',
        detail: `${workflow.candidateCount} non-stable components pass API, live example, source, theme, maturity, accessibility and interaction gates.`,
        href: '/resources/release'
      },
      {
        type: 'documentation',
        label: 'Documentation',
        title: 'Publish Release Center and Version History',
        detail: 'Resources now include package-scoped release planning, changelog material and version-history navigation.',
        href: '/resources/changelog'
      },
      {
        type: 'accessibility',
        label: 'Accessibility',
        title: 'Track release pages in docs audit targets',
        detail: 'Release and changelog routes are treated as resource pages that must pass structure, routing, contrast and responsive checks.',
        href: '/resources/maturity'
      },
      {
        type: 'build',
        label: 'Build',
        title: 'Require package and documentation verification',
        detail: workflow.checklist.map((item) => item.command).join(' · '),
        href: '/resources/release'
      }
    ],
    packageSections: workflow.releasePackages.map((releasePackage) => ({
      packageName: releasePackage.packageName,
      packageLabel: releasePackage.packageLabel,
      items: releasePackage.components
    })),
    evidenceLinks: [
      { label: 'Release workflow', href: '/resources/release' },
      { label: 'Maturity evidence', href: '/resources/maturity' },
      { label: 'API reference', href: '/resources/api-reference' }
    ]
  }
}

function createBaselineEntry(): ReleaseHistoryEntry {
  return {
    version: '0.1.0',
    status: 'current-baseline',
    statusLabel: 'Current baseline',
    title: 'Yok UI 0.1.0',
    summary: 'Initial multi-package workspace baseline with component docs, theme tokens, live examples and resource pages.',
    items: [
      {
        type: 'documentation',
        label: 'Documentation',
        title: 'Establish docs, components and resources routes',
        detail: 'The baseline version records the current docs architecture before the 0.2.0 release-candidate promotion flow.',
        href: '/resources/'
      },
      {
        type: 'build',
        label: 'Build',
        title: 'Package workspace baseline',
        detail: '@yok-ui/core, @yok-ui/product, @yok-ui/admin, @yok-ui/brand and @yok-ui/themes share one pnpm workspace.',
        href: '/packages/'
      }
    ],
    packageSections: [],
    evidenceLinks: [
      { label: 'Package map', href: '/packages/' },
      { label: 'Design system', href: '/resources/design-system' }
    ]
  }
}

export function getReleaseHistorySummary(): ReleaseHistorySummary {
  return {
    filters: releaseHistoryFilters,
    entries: [
      createCandidateEntry(),
      createBaselineEntry()
    ]
  }
}
