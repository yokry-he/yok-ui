import type { ComponentMeta } from './componentRegistry'
import { components } from './componentRegistry'
import {
  getInteractionContract,
  interactionContracts,
  type InteractionContract
} from './interactionContracts'

export type AccessibilityEvidenceRisk = 'native' | 'standard' | 'complex' | 'critical'

export type AccessibilityEvidenceCategory =
  | 'native'
  | 'semantics'
  | 'keyboard'
  | 'focus'
  | 'aria'
  | 'contrast'
  | 'motion'
  | 'docs'
  | 'tests'

export interface AccessibilityEvidencePaths {
  docs: string[]
  tests: string[]
}

export interface AccessibilityEvidenceProfile {
  componentName: ComponentMeta['name']
  title: ComponentMeta['title']
  docsRoute: ComponentMeta['docs']
  packageName: ComponentMeta['packageName']
  family: ComponentMeta['family']
  risk: AccessibilityEvidenceRisk
  categories: AccessibilityEvidenceCategory[]
  summary: string
  evidence: AccessibilityEvidencePaths
  contract?: InteractionContract
}

const criticalComponentNames = new Set([
  'YCommandPalette',
  'YDataTable',
  'YDatePicker',
  'YDateRangePicker',
  'YDateTimePicker',
  'YDrawer',
  'YModal',
  'YTable',
  'YTransfer',
  'YTree'
])

export const highRiskAccessibilityComponentNames = interactionContracts.map(
  (contract) => contract.componentName
)

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function routeToDocsPath(route: string) {
  const normalizedRoute = route.replace(/^\//, '')

  return `docs/${normalizedRoute}.md`
}

function componentNameToSlug(componentName: string) {
  return componentName
    .replace(/^Y/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

function packageNameToFolder(packageName: ComponentMeta['packageName']) {
  return packageName.replace('@yok-ui/', '')
}

const componentTestEvidenceOverrides: Record<string, string[]> = {
  YThemeProvider: ['packages/core/src/components/theme-provider/theme-provider.test.ts'],
  YIconButton: ['packages/core/src/components/button/button.test.ts'],
  YDatePickerPanel: ['packages/core/src/components/date-picker/date-picker-panel.test.ts'],
  YDateRangePicker: ['packages/core/src/components/date-picker/date-range-picker.test.ts'],
  YDateTimePicker: ['packages/core/src/components/date-time-picker/date-time-picker.test.ts'],
  YTimeSelect: ['packages/core/src/components/time-select/time-select.test.ts'],
  YVirtualizedSelect: ['packages/core/src/components/virtualized-select/virtualized-select.test.ts'],
  YColorPickerPanel: ['packages/core/src/components/color-picker/color-picker-panel.test.ts'],
  YAvatarGroup: ['packages/core/src/components/avatar/avatar.test.ts'],
  YRadioGroup: ['packages/core/src/components/radio/radio.test.ts'],
  YCountdown: ['packages/core/src/components/statistic/countdown.test.ts'],
  YFloatButtonGroup: ['packages/core/src/components/float-button/float-button.test.ts'],
  YQRCode: ['packages/core/src/components/qr-code/qr-code.test.ts'],
  YTag: ['packages/core/src/components/tag/tag.test.ts'],
  YCheckTag: ['packages/core/src/components/tag/tag.test.ts'],
  YBadge: ['packages/core/src/components/tag/tag.test.ts'],
  YVirtualTree: ['packages/core/src/components/tree/virtual-tree.test.ts'],
  YRow: ['packages/core/src/components/grid/grid.test.ts'],
  YCol: ['packages/core/src/components/grid/grid.test.ts'],
  YVirtualTable: ['packages/core/src/components/table/virtual-table.test.ts'],
  YSavedViewManager: ['packages/admin/src/components/saved-views/saved-view-manager.test.ts']
}

function getLikelyTestPaths(component: ComponentMeta) {
  if (componentTestEvidenceOverrides[component.name]) {
    return componentTestEvidenceOverrides[component.name]
  }

  const packageFolder = packageNameToFolder(component.packageName)
  const componentSlug = componentNameToSlug(component.name)
  const candidates = [
    `packages/${packageFolder}/src/components/${componentSlug}/${componentSlug}.test.ts`
  ]

  return unique(candidates)
}

function getRisk(component: ComponentMeta, contract?: InteractionContract): AccessibilityEvidenceRisk {
  if (criticalComponentNames.has(component.name)) {
    return 'critical'
  }

  if (contract) {
    return 'complex'
  }

  return component.accessibility === 'native' ? 'native' : 'standard'
}

function getCategories(
  component: ComponentMeta,
  risk: AccessibilityEvidenceRisk,
  contract?: InteractionContract
): AccessibilityEvidenceCategory[] {
  if (contract) {
    return ['semantics', 'keyboard', 'focus', 'aria', 'docs', 'tests']
  }

  const categories: AccessibilityEvidenceCategory[] = component.accessibility === 'native'
    ? ['native', 'semantics', 'docs']
    : ['semantics', 'aria', 'docs']

  if (risk === 'standard' && ['feedback', 'data', 'brand'].includes(component.family)) {
    categories.push('contrast')
  }

  if (['overlay', 'feedback', 'theme'].includes(component.family)) {
    categories.push('motion')
  }

  return unique(categories)
}

function getSummary(
  component: ComponentMeta,
  risk: AccessibilityEvidenceRisk,
  contract?: InteractionContract
) {
  if (contract) {
    return `${component.title} 已登记 ${contract.pattern} 的键盘路径、焦点行为、ARIA 语义、文档和测试证据。`
  }

  if (risk === 'native') {
    return `${component.title} 主要依赖原生语义，文档侧继续跟踪 label、状态和焦点可见性。`
  }

  return `${component.title} 已进入组件级可访问性说明池，后续按风险补充交互契约和自动化证据。`
}

function createEvidence(component: ComponentMeta): AccessibilityEvidenceProfile {
  const contract = getInteractionContract(component.name)
  const risk = getRisk(component, contract)
  const docs = unique([
    'docs/guide/accessibility.md',
    routeToDocsPath(component.docs),
    ...(contract?.evidence.docs ?? [])
  ])
  const tests = unique([
    ...(contract?.evidence.tests ?? []),
    ...getLikelyTestPaths(component)
  ])

  return {
    componentName: component.name,
    title: component.title,
    docsRoute: component.docs,
    packageName: component.packageName,
    family: component.family,
    risk,
    categories: getCategories(component, risk, contract),
    summary: getSummary(component, risk, contract),
    evidence: {
      docs,
      tests
    },
    contract
  }
}

export const accessibilityEvidenceProfiles = components.map(createEvidence)

export const accessibilityEvidenceByComponent = new Map(
  accessibilityEvidenceProfiles.map((profile) => [profile.componentName, profile])
)

export function getAccessibilityEvidence(componentName: ComponentMeta['name']) {
  return accessibilityEvidenceByComponent.get(componentName)
}

export function getAccessibilityEvidenceSummary() {
  const highRiskProfiles = highRiskAccessibilityComponentNames
    .map((componentName) => getAccessibilityEvidence(componentName))
    .filter(Boolean) as AccessibilityEvidenceProfile[]
  const highRiskCovered = highRiskProfiles.filter((profile) =>
    ['keyboard', 'focus', 'aria', 'docs', 'tests'].every((category) =>
      profile.categories.includes(category as AccessibilityEvidenceCategory)
    )
  )
  const categoryCoverage = accessibilityEvidenceProfiles.reduce<Record<AccessibilityEvidenceCategory, number>>(
    (coverage, profile) => {
      profile.categories.forEach((category) => {
        coverage[category] += 1
      })

      return coverage
    },
    {
      native: 0,
      semantics: 0,
      keyboard: 0,
      focus: 0,
      aria: 0,
      contrast: 0,
      motion: 0,
      docs: 0,
      tests: 0
    }
  )
  const evidenceFileCount = new Set(
    accessibilityEvidenceProfiles.flatMap((profile) => [
      ...profile.evidence.docs,
      ...profile.evidence.tests
    ])
  ).size

  return {
    total: accessibilityEvidenceProfiles.length,
    highRiskTotal: highRiskAccessibilityComponentNames.length,
    highRiskCovered: highRiskCovered.length,
    highRiskGapCount: highRiskAccessibilityComponentNames.length - highRiskCovered.length,
    criticalCount: accessibilityEvidenceProfiles.filter((profile) => profile.risk === 'critical').length,
    complexCount: accessibilityEvidenceProfiles.filter((profile) => profile.risk === 'complex').length,
    nativeCount: accessibilityEvidenceProfiles.filter((profile) => profile.risk === 'native').length,
    categoryCoverage,
    evidenceFileCount
  }
}
