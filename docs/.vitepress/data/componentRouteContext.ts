import {
  componentApis,
  componentFamilies,
  components,
  packageLabels,
  type ComponentApi,
  type ComponentMeta,
  type ComponentPackage
} from './componentRegistry'
import {
  getComponentQualityItems,
  getComponentQualityScore,
  type ComponentQualityItem
} from './componentQuality'
import { getComponentThemeEvidence } from './componentThemeEvidence'
import { getInteractionContract, type InteractionContract } from './interactionContracts'
import { liveExampleProfileByDocs, type LiveExampleProfile } from './liveExamples'

export type ComponentMaturityTone = 'success' | 'warning' | 'info'

export interface ComponentMaturityItem {
  key: 'api' | 'live' | 'a11y' | 'source' | 'theme' | 'route'
  label: string
  value: string
  detail: string
  tone: ComponentMaturityTone
}

export interface ComponentEvidenceMatrixItem {
  key: 'api' | 'live' | 'source' | 'a11y' | 'theme' | 'route'
  label: string
  value: string
  detail: string
  tone: ComponentMaturityTone
  qualityItems: ComponentQualityItem[]
  maturityItems: ComponentMaturityItem[]
}

export interface ComponentMaturityQueueItem {
  docs: string
  title: string
  packageName: ComponentPackage
  family: ComponentMeta['family']
  score: number
  missingItems: ComponentMaturityItem[]
}

export type ComponentCoveragePriority = 'critical' | 'high' | 'medium' | 'low'

export interface ComponentCoverageQueueItem {
  docs: string
  title: string
  componentName: string
  packageName: ComponentPackage
  family: ComponentMeta['family']
  familyTitle: string
  priority: ComponentCoveragePriority
  score: number
  missingCount: number
  warningCount: number
  infoCount: number
  actionLabel: string
  actionDetail: string
  targetHref: string
  targetLabel: string
  missingLabels: string[]
  evidenceLabels: string[]
  checklist: ComponentCoverageChecklistItem[]
}

export interface ComponentCoverageChecklistItem {
  label: string
  detail: string
  href: string
}

export interface ComponentMaturitySummary {
  total: number
  complete: number
  needsAttention: number
  averageScore: number
  apiCoverageRate: number
  liveCoverageRate: number
  a11yContractRate: number
  sourceReproRate: number
  themeCoverageRate: number
  nextQueue: ComponentMaturityQueueItem[]
  coverageQueue: ComponentCoverageQueueItem[]
  criticalCoverageCount: number
  highCoverageCount: number
}

const packageRouteMap: Record<ComponentPackage, string> = {
  '@yok-ui/core': '/packages/core',
  '@yok-ui/product': '/packages/product',
  '@yok-ui/admin': '/packages/admin',
  '@yok-ui/brand': '/packages/brand'
}

export const orderedComponentPages = components.filter((component) => component.docs.startsWith('/components/'))

export function getComponentRouteContext(path: string) {
  const currentIndex = orderedComponentPages.findIndex((component) => component.docs === path)

  if (currentIndex < 0) {
    return undefined
  }

  const component = orderedComponentPages[currentIndex]
  const api = componentApis[component.name]
  const liveProfile = liveExampleProfileByDocs.get(component.docs)
  const qualityItems = getComponentQualityItems(
    component,
    api,
    liveProfile
  )
  const previousComponent = currentIndex > 0 ? orderedComponentPages[currentIndex - 1] : undefined
  const nextComponent = currentIndex < orderedComponentPages.length - 1 ? orderedComponentPages[currentIndex + 1] : undefined
  const relatedComponents = getRelatedComponents(component)
  const interactionContract = getInteractionContract(component.name)
  const maturityItems = getComponentMaturityItems({
    api,
    component,
    interactionContract,
    liveProfile,
    nextComponent,
    previousComponent,
    relatedComponents
  })

  return {
    component,
    previousComponent,
    nextComponent,
    family: componentFamilies.find((family) => family.id === component.family),
    packageLabel: packageLabels[component.packageName],
    packageRoute: packageRouteMap[component.packageName],
    relatedComponents,
    liveProfile,
    interactionContract,
    qualityItems,
    qualityScore: getComponentQualityScore(qualityItems),
    maturityItems,
    evidenceMatrix: getComponentEvidenceMatrix(qualityItems, maturityItems),
    scenarios: liveProfile?.scenarios ?? []
  }
}

function getRelatedComponents(component: ComponentMeta) {
  return orderedComponentPages
    .filter((item) => item.name !== component.name && item.family === component.family)
    .slice(0, 4)
}

function getComponentMaturityScore(items: ComponentMaturityItem[]) {
  const passed = items.filter((item) => item.tone !== 'warning').length

  return Math.round((passed / Math.max(items.length, 1)) * 100)
}

function uniqueLabels(labels: string[]) {
  return Array.from(new Set(labels.filter(Boolean)))
}

function getComponentFamilyTitle(family: ComponentMeta['family']) {
  return componentFamilies.find((item) => item.id === family)?.title ?? family
}

function getCoverageAction(labels: string[]) {
  const joined = labels.join(' / ')

  if (labels.some((label) => label === 'API Live' || label === 'API')) {
    return {
      actionLabel: '补齐 API ↔ Live 证据',
      actionDetail: joined || '结构化 API、可运行示例和 API row 反链需要保持同步。'
    }
  }

  if (labels.some((label) => label === 'Source' || label === 'Repro' || label === 'Source Repro')) {
    return {
      actionLabel: '补齐源码复现链路',
      actionDetail: joined || '源码复制、复现包和场景状态需要形成闭环。'
    }
  }

  if (labels.some((label) => label === 'A11y' || label === 'Keyboard' || label === 'A11y Contract')) {
    return {
      actionLabel: '补齐可访问性交互契约',
      actionDetail: joined || '补齐键盘路径、焦点管理、ARIA 语义和测试证据。'
    }
  }

  if (labels.some((label) => label === 'Theme' || label === 'Theme & Package')) {
    return {
      actionLabel: '补齐主题 token 证据',
      actionDetail: joined || '组件源码需要可追踪的 token、包归属和主题证据。'
    }
  }

  if (labels.some((label) => label === 'Live' || label === 'Live Example')) {
    return {
      actionLabel: '补齐 Live Example 场景',
      actionDetail: joined || '把静态文档推进到可编辑、可复制、可复现的在线示例。'
    }
  }

  return {
    actionLabel: '复查文档证据',
    actionDetail: joined || '复查组件页成熟度、证据矩阵和发布门禁。'
  }
}

function getCoverageLabelHref(
  label: string,
  context: NonNullable<ReturnType<typeof getComponentRouteContext>>
) {
  const docs = context.component.docs

  if (label === 'API Live') {
    return `${docs}#live-example-api-map`
  }

  if (label === 'API' || label === 'API Reference') {
    return `${docs}#api`
  }

  if (label === 'Source') {
    return `${docs}#live-example-source-panel`
  }

  if (label === 'Repro') {
    return `${docs}#live-example-source-panel`
  }

  if (label === 'Live' || label === 'Live Example') {
    return `${docs}#live-example`
  }

  if (label === 'A11y' || label === 'A11y Contract') {
    return `${docs}#accessibility`
  }

  if (label === 'Keyboard') {
    return `${docs}#live-example-interaction-contract`
  }

  if (label === 'Source Repro') {
    return `${docs}#live-example-source-panel`
  }

  if (label === 'Theme' || label === 'Theme & Package') {
    return `${docs}#component-maturity-theme`
  }

  return `${docs}#component-evidence-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function getCoverageChecklistItem(
  label: string,
  context: NonNullable<ReturnType<typeof getComponentRouteContext>>
): ComponentCoverageChecklistItem {
  const href = getCoverageLabelHref(label, context)

  if (label === 'API Live') {
    return {
      label: '补 API row 反链',
      detail: '把缺口 API 行接到场景、可视化 prop、事件日志、插槽源码或类型映射。',
      href
    }
  }

  if (label === 'API' || label === 'API Reference') {
    return {
      label: '补结构化 API',
      detail: '先更新 componentApis，再让组件页、API Reference 和包页共用同一份数据。',
      href
    }
  }

  if (label === 'Source') {
    return {
      label: '补源码质量证据',
      detail: '补齐源码复制、安装命令、API map、场景链接和复现检查。',
      href
    }
  }

  if (label === 'Repro') {
    return {
      label: '补复现包',
      detail: '让 live example 能复制 package.json、入口文件、组件源码和当前场景状态。',
      href
    }
  }

  if (label === 'Live' || label === 'Live Example') {
    return {
      label: '补在线示例',
      detail: '登记 LiveExampleRunner profile，并覆盖基础态、边界态和真实 workflow 场景。',
      href
    }
  }

  if (label === 'A11y' || label === 'A11y Contract') {
    return {
      label: '补可访问性契约',
      detail: '补语义、键盘路径、焦点恢复、ARIA 说明和测试证据。',
      href
    }
  }

  if (label === 'Keyboard') {
    return {
      label: '补键盘路径',
      detail: '把 Tab、Enter、Space、Esc、方向键等路径沉淀到 interaction contract 和 live 场景。',
      href
    }
  }

  if (label === 'Source Repro') {
    return {
      label: '补源码复现链路',
      detail: '让 live example 可复制源码、复现包、场景和属性状态。',
      href
    }
  }

  if (label === 'Theme' || label === 'Theme & Package') {
    return {
      label: '补主题 token 证据',
      detail: '从组件源码提取 token 引用、包归属和主题分类，避免只靠静态文案标记。',
      href
    }
  }

  return {
    label: `复查 ${label}`,
    detail: '回到组件页证据矩阵，确认缺口来源和下一步维护动作。',
    href
  }
}

function getCoverageTarget(
  labels: string[],
  context: NonNullable<ReturnType<typeof getComponentRouteContext>>
) {
  const labelPriority = [
    'API Live',
    'Source',
    'A11y',
    'Keyboard',
    'API',
    'API Reference',
    'Live',
    'Live Example',
    'Repro',
    'Source Repro',
    'Theme',
    'Theme & Package'
  ]
  const leadingLabel = labelPriority.find((label) => labels.includes(label)) ?? labels[0]

  return {
    targetHref: getCoverageLabelHref(leadingLabel, context),
    targetLabel: leadingLabel
  }
}

function getCoveragePriority(options: {
  warningLabels: string[]
  infoLabels: string[]
  score: number
}): ComponentCoveragePriority {
  const criticalLabels = new Set(['API Live', 'Source', 'A11y', 'Keyboard'])
  const highLabels = new Set(['API', 'API Reference', 'Live', 'Live Example', 'Repro', 'Theme', 'Theme & Package'])

  if (options.warningLabels.some((label) => criticalLabels.has(label))) {
    return 'critical'
  }

  if (options.warningLabels.some((label) => highLabels.has(label)) || options.warningLabels.length > 0) {
    return 'high'
  }

  if (options.infoLabels.length > 0 || options.score < 100) {
    return 'medium'
  }

  return 'low'
}

function getCoveragePriorityRank(priority: ComponentCoveragePriority) {
  const priorityRanks: Record<ComponentCoveragePriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3
  }

  return priorityRanks[priority]
}

function getActionableInfoItems(items: ComponentMaturityItem[]) {
  return items.filter((item) => item.tone === 'info' && item.key === 'source')
}

function buildComponentCoverageQueueItem(
  context: NonNullable<ReturnType<typeof getComponentRouteContext>>
): ComponentCoverageQueueItem | undefined {
  const warningQualityItems = context.qualityItems.filter((item) => item.tone === 'warning')
  const warningMaturityItems = context.maturityItems.filter((item) => item.tone === 'warning')
  const warningEvidenceItems = context.evidenceMatrix.filter((item) => item.key !== 'route' && item.tone === 'warning')
  const infoMaturityItems = getActionableInfoItems(context.maturityItems)
  const warningLabels = uniqueLabels([
    ...warningQualityItems.map((item) => item.label),
    ...warningMaturityItems.map((item) => item.label),
    ...warningEvidenceItems.map((item) => item.label)
  ])
  const infoLabels = uniqueLabels(infoMaturityItems.map((item) => item.label))
  const missingLabels = uniqueLabels([...warningLabels, ...infoLabels])
  const evidenceLabels = uniqueLabels(warningEvidenceItems.map((item) => item.label))

  if (missingLabels.length === 0) {
    return undefined
  }

  const score = Math.round((context.qualityScore + getComponentMaturityScore(context.maturityItems)) / 2)
  const priority = getCoveragePriority({
    warningLabels,
    infoLabels,
    score
  })
  const action = getCoverageAction(missingLabels)
  const target = getCoverageTarget(missingLabels, context)
  const checklist = missingLabels
    .map((label) => getCoverageChecklistItem(label, context))
    .slice(0, 5)

  return {
    docs: context.component.docs,
    title: context.component.title,
    componentName: context.component.name,
    packageName: context.component.packageName,
    family: context.component.family,
    familyTitle: getComponentFamilyTitle(context.component.family),
    priority,
    score,
    missingCount: missingLabels.length,
    warningCount: warningLabels.length,
    infoCount: infoLabels.length,
    actionLabel: action.actionLabel,
    actionDetail: action.actionDetail,
    targetHref: target.targetHref,
    targetLabel: target.targetLabel,
    missingLabels,
    evidenceLabels,
    checklist
  }
}

export function getComponentCoverageQueue(limit = 12): ComponentCoverageQueueItem[] {
  return orderedComponentPages
    .map((component) => getComponentRouteContext(component.docs))
    .filter((context): context is NonNullable<ReturnType<typeof getComponentRouteContext>> => Boolean(context))
    .map((context) => buildComponentCoverageQueueItem(context))
    .filter((item): item is ComponentCoverageQueueItem => Boolean(item))
    .sort((a, b) =>
      getCoveragePriorityRank(a.priority) - getCoveragePriorityRank(b.priority) ||
      a.score - b.score ||
      b.warningCount - a.warningCount ||
      a.title.localeCompare(b.title)
    )
    .slice(0, limit)
}

export function getComponentCoverageQueueItem(path: string) {
  const context = getComponentRouteContext(path)

  return context ? buildComponentCoverageQueueItem(context) : undefined
}

function getToneFromEvidence(
  qualityItems: ComponentQualityItem[],
  maturityItems: ComponentMaturityItem[]
): ComponentMaturityTone {
  const tones = [
    ...qualityItems.map((item) => item.tone),
    ...maturityItems.map((item) => item.tone)
  ]

  if (tones.includes('warning')) {
    return 'warning'
  }

  return tones.includes('success') ? 'success' : 'info'
}

function buildEvidenceItem(options: {
  key: ComponentEvidenceMatrixItem['key']
  label: string
  qualityItems: ComponentQualityItem[]
  maturityItems: ComponentMaturityItem[]
  fallbackValue: string
  fallbackDetail: string
}): ComponentEvidenceMatrixItem {
  const visibleItems = [...options.qualityItems, ...options.maturityItems]
  const leadingItem = visibleItems[0]

  return {
    key: options.key,
    label: options.label,
    value: leadingItem?.value ?? options.fallbackValue,
    detail: leadingItem?.detail ?? options.fallbackDetail,
    tone: getToneFromEvidence(options.qualityItems, options.maturityItems),
    qualityItems: options.qualityItems,
    maturityItems: options.maturityItems
  }
}

function getComponentEvidenceMatrix(
  qualityItems: ComponentQualityItem[],
  maturityItems: ComponentMaturityItem[]
): ComponentEvidenceMatrixItem[] {
  const getQualityItems = (keys: ComponentQualityItem['key'][]) =>
    qualityItems.filter((item) => keys.includes(item.key))
  const getMaturityItems = (keys: ComponentMaturityItem['key'][]) =>
    maturityItems.filter((item) => keys.includes(item.key))

  return [
    buildEvidenceItem({
      key: 'api',
      label: 'API',
      qualityItems: getQualityItems(['api', 'api-live']),
      maturityItems: getMaturityItems(['api']),
      fallbackValue: 'Missing',
      fallbackDetail: '需要结构化 API、Live 反链和组件页 API 表保持一致。'
    }),
    buildEvidenceItem({
      key: 'live',
      label: 'Live',
      qualityItems: getQualityItems(['live', 'repro']),
      maturityItems: getMaturityItems(['live', 'source']),
      fallbackValue: 'Needed',
      fallbackDetail: '需要在线示例、复现包和源码复现链路。'
    }),
    buildEvidenceItem({
      key: 'source',
      label: 'Source',
      qualityItems: getQualityItems(['source']),
      maturityItems: getMaturityItems(['source']),
      fallbackValue: 'Needed',
      fallbackDetail: '需要源码复制、安装命令、API map、场景链接和可复现工程证据。'
    }),
    buildEvidenceItem({
      key: 'a11y',
      label: 'A11y',
      qualityItems: getQualityItems(['accessibility', 'keyboard']),
      maturityItems: getMaturityItems(['a11y']),
      fallbackValue: 'Review',
      fallbackDetail: '需要语义、键盘、焦点和测试证据。'
    }),
    buildEvidenceItem({
      key: 'theme',
      label: 'Theme',
      qualityItems: getQualityItems(['theme']),
      maturityItems: getMaturityItems(['theme']),
      fallbackValue: 'Needed',
      fallbackDetail: '需要主题 token、包归属和源码证据。'
    }),
    buildEvidenceItem({
      key: 'route',
      label: 'Route',
      qualityItems: [],
      maturityItems: getMaturityItems(['route']),
      fallbackValue: 'Needed',
      fallbackDetail: '需要前后组件、相关组件和包路由信息。'
    })
  ]
}

export function getComponentMaturitySummary(): ComponentMaturitySummary {
  const contexts = orderedComponentPages
    .map((component) => getComponentRouteContext(component.docs))
    .filter((context): context is NonNullable<ReturnType<typeof getComponentRouteContext>> => Boolean(context))
  const queue = contexts
    .map((context) => ({
      docs: context.component.docs,
      title: context.component.title,
      packageName: context.component.packageName,
      family: context.component.family,
      score: getComponentMaturityScore(context.maturityItems),
      missingItems: context.maturityItems.filter((item) => item.tone === 'warning')
    }))
  const countWithPassedItem = (key: ComponentMaturityItem['key']) =>
    contexts.filter((context) =>
      context.maturityItems.some((item) => item.key === key && item.tone !== 'warning')
    ).length
  const coverageQueue = getComponentCoverageQueue(12)

  return {
    total: contexts.length,
    complete: queue.filter((item) => item.missingItems.length === 0).length,
    needsAttention: queue.filter((item) => item.missingItems.length > 0).length,
    averageScore: Math.round(queue.reduce((total, item) => total + item.score, 0) / Math.max(queue.length, 1)),
    apiCoverageRate: Math.round((countWithPassedItem('api') / Math.max(contexts.length, 1)) * 100),
    liveCoverageRate: Math.round((countWithPassedItem('live') / Math.max(contexts.length, 1)) * 100),
    a11yContractRate: Math.round((countWithPassedItem('a11y') / Math.max(contexts.length, 1)) * 100),
    sourceReproRate: Math.round((countWithPassedItem('source') / Math.max(contexts.length, 1)) * 100),
    themeCoverageRate: Math.round((countWithPassedItem('theme') / Math.max(contexts.length, 1)) * 100),
    nextQueue: queue
      .filter((item) => item.missingItems.length > 0)
      .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title))
      .slice(0, 8),
    coverageQueue,
    criticalCoverageCount: coverageQueue.filter((item) => item.priority === 'critical').length,
    highCoverageCount: coverageQueue.filter((item) => item.priority === 'high').length
  }
}

function countApiRows(api: ComponentApi | undefined) {
  return (api?.props?.length ?? 0) +
    (api?.events?.length ?? 0) +
    (api?.slots?.length ?? 0) +
    (api?.methods?.length ?? 0) +
    (api?.types?.length ?? 0)
}

function getApiSections(api: ComponentApi | undefined) {
  return [
    api?.props?.length ? 'props' : '',
    api?.events?.length ? 'events' : '',
    api?.slots?.length ? 'slots' : '',
    api?.methods?.length ? 'methods' : '',
    api?.types?.length ? 'types' : ''
  ].filter(Boolean)
}

function getComponentMaturityItems(options: {
  api: ComponentApi | undefined
  component: ComponentMeta
  interactionContract?: InteractionContract
  liveProfile?: LiveExampleProfile
  nextComponent?: ComponentMeta
  previousComponent?: ComponentMeta
  relatedComponents: ComponentMeta[]
}): ComponentMaturityItem[] {
  const apiRows = countApiRows(options.api)
  const apiSections = getApiSections(options.api)
  const scenarioCount = options.liveProfile?.scenarios.length ?? 0
  const capabilityCount = options.liveProfile?.capabilities.length ?? 0
  const hasSourceRepro = Boolean(options.liveProfile?.capabilities.includes('source-copy') && options.liveProfile?.capabilities.includes('repro-bundle'))
  const themeEvidence = getComponentThemeEvidence(options.component.name)
  const themeCategories = themeEvidence?.categories.slice(0, 4).join(' / ')

  return [
    {
      key: 'api',
      label: 'API Reference',
      value: apiRows ? `${apiRows} rows` : 'Missing',
      detail: apiRows
        ? `${apiSections.join(' / ')} 已结构化，可供组件页、API Reference 和包页共用。`
        : '缺少结构化 props、events、slots、methods 或 types 数据。',
      tone: apiRows ? 'success' : 'warning'
    },
    {
      key: 'live',
      label: 'Live Example',
      value: options.liveProfile ? `${scenarioCount} scenarios` : 'Needed',
      detail: options.liveProfile
        ? `${options.liveProfile.mode} · ${options.liveProfile.scenarioDepth} · ${capabilityCount} capabilities。`
        : '缺少 LiveExampleRunner profile，无法提供源码运行、复制和复现包。',
      tone: options.liveProfile ? 'success' : 'warning'
    },
    {
      key: 'a11y',
      label: 'A11y Contract',
      value: options.interactionContract?.maturity ?? options.component.accessibility,
      detail: options.interactionContract
        ? `${options.interactionContract.pattern} · ${options.interactionContract.keyboard.length} keyboard paths · ${options.interactionContract.evidence.tests.length} tests。`
        : `${options.component.accessibility} 级别，需要继续沉淀键盘、焦点、语义和测试证据。`,
      tone: options.interactionContract || options.component.accessibility !== 'needs-review' ? 'success' : 'warning'
    },
    {
      key: 'source',
      label: 'Source Repro',
      value: hasSourceRepro ? 'Ready' : 'Manual',
      detail: hasSourceRepro
        ? 'Live example 可复制源码、主题、场景、控件状态和复现包。'
        : '当前组件仍需补齐源码复制或 Repro bundle。',
      tone: hasSourceRepro ? 'success' : 'info'
    },
    {
      key: 'theme',
      label: 'Theme & Package',
      value: packageLabels[options.component.packageName],
      detail: themeEvidence && themeEvidence.tokenCount > 0
        ? `${options.component.packageName} · ${themeEvidence.tokenCount} token refs · ${themeCategories || 'component'} · ${themeEvidence.sourcePath}。`
        : `${options.component.packageName} · since ${options.component.since} · 需要补充组件源码 token 证据。`,
      tone: themeEvidence && themeEvidence.tokenCount > 0 ? 'success' : 'warning'
    },
    {
      key: 'route',
      label: 'Route IA',
      value: `${options.relatedComponents.length} related`,
      detail: [
        options.previousComponent ? `Prev ${options.previousComponent.title}` : 'No previous component',
        options.nextComponent ? `Next ${options.nextComponent.title}` : 'No next component'
      ].join(' · '),
      tone: 'info'
    }
  ]
}
