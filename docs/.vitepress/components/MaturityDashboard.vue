<script setup lang="ts">
import { computed } from 'vue'
import {
  componentApis,
  componentFamilies,
  components,
  packageLabels
} from '../data/componentRegistry'
import {
  getComponentMaturitySummary
} from '../data/componentRouteContext'
import {
  accessibilityEvidenceProfiles,
  getAccessibilityEvidenceSummary,
  type AccessibilityEvidenceCategory,
  type AccessibilityEvidenceRisk
} from '../data/accessibilityEvidence'
import {
  docsA11yAuditTargets,
  getDocsA11yAuditSummary,
  type DocsA11yAuditCheck,
  type DocsA11yAuditPriority
} from '../data/docsA11yAuditTargets'
import {
  createDocsA11yRuntimeReport,
  getDocsA11yRuntimeReportView,
  type DocsA11yRuntimeReport
} from '../data/docsA11yRuntimeAudit'
import {
  hasInteractionContract,
  interactionContracts
} from '../data/interactionContracts'
import {
  defaultLiveExampleCapabilities,
  hasScenarioRichPreset,
  liveExampleDocs,
  liveExampleProfileByDocs,
  liveExampleProfiles,
  type LiveExampleScenarioKind
} from '../data/liveExamples'
import {
  getLiveExampleReadinessSummary,
  type LiveExampleReadinessStatus
} from '../data/liveExampleReadiness'
import {
  getLiveExampleSourceQualitySummary
} from '../data/liveExampleSourceQuality'
import {
  getDocDemoSourceQualitySummary
} from '../data/docDemoSourceQuality'
import {
  getSourcePanelExperienceSummary
} from '../data/sourcePanelExperienceQuality'
import {
  getApiLiveCoverageSummary
} from '../data/apiLiveCoverage'
import {
  getReleaseReadinessSummary
} from '../data/releaseReadiness'
import {
  getMainstreamParityItems,
  getMainstreamParitySummary
} from '../data/mainstreamParity'
import {
  adoptionReadinessGates,
  getAdoptionReadinessSummary
} from '../data/adoptionReadiness'
import {
  auditThemeLabRelease,
  defaultThemeLabState
} from '../data/themeLab'

const trackedComponents = computed(() => components)
const componentPageComponents = computed(() => components.filter((component) => component.docs.startsWith('/components/')))
const stableComponents = computed(() => trackedComponents.value.filter((component) => component.status === 'Stable'))
const apiComponents = computed(() =>
  trackedComponents.value.filter((component) => componentApis[component.name])
)
const liveExampleComponents = computed(() =>
  trackedComponents.value.filter((component) => liveExampleDocs.has(component.docs))
)
const guidedLiveExampleComponents = computed(() =>
  trackedComponents.value.filter((component) => liveExampleProfileByDocs.get(component.docs)?.mode === 'guided')
)
const scenarioRichLiveExampleComponents = computed(() =>
  trackedComponents.value.filter((component) => {
    const profile = liveExampleProfileByDocs.get(component.docs)

    return Boolean(profile && hasScenarioRichPreset(profile.preset) && profile.scenarios.length > 0)
  })
)
const reproBundleLiveExampleComponents = computed(() =>
  trackedComponents.value.filter((component) =>
    liveExampleProfileByDocs.get(component.docs)?.capabilities.includes('repro-bundle')
  )
)
const interactionContractComponents = computed(() =>
  trackedComponents.value.filter((component) => hasInteractionContract(component.name))
)
const apiCoverageRate = computed(() =>
  Math.round((apiComponents.value.length / Math.max(trackedComponents.value.length, 1)) * 100)
)
const liveCoverageRate = computed(() =>
  Math.round((liveExampleComponents.value.length / Math.max(trackedComponents.value.length, 1)) * 100)
)
const guidedCoverageRate = computed(() =>
  Math.round((guidedLiveExampleComponents.value.length / Math.max(liveExampleComponents.value.length, 1)) * 100)
)
const scenarioRichCoverageRate = computed(() =>
  Math.round((scenarioRichLiveExampleComponents.value.length / Math.max(liveExampleComponents.value.length, 1)) * 100)
)
const reproBundleCoverageRate = computed(() =>
  Math.round((reproBundleLiveExampleComponents.value.length / Math.max(liveExampleComponents.value.length, 1)) * 100)
)
const workflowScenarioCount = computed(() =>
  liveExampleProfiles.reduce((total, profile) => total + profile.scenarios.length, 0)
)
const interactionContractCoverageRate = computed(() =>
  Math.round((interactionContractComponents.value.length / Math.max(trackedComponents.value.length, 1)) * 100)
)
const verifiedInteractionContractCount = computed(() =>
  interactionContracts.filter((contract) => contract.maturity === 'verified').length
)
const interactionEvidenceFileCount = computed(() =>
  new Set(interactionContracts.flatMap((contract) => contract.evidence.tests)).size
)
const accessibilitySummary = computed(() => getAccessibilityEvidenceSummary())
const sourceQualitySummary = computed(() => getLiveExampleSourceQualitySummary())
const sourcePanelExperienceSummary = computed(() => getSourcePanelExperienceSummary())
const docsA11yAuditSummary = computed(() => getDocsA11yAuditSummary())
const runtimeAuditReportModules = import.meta.glob('../data/a11y-runtime-report.generated.json', {
  eager: true,
  import: 'default'
}) as Record<string, DocsA11yRuntimeReport>
const runtimeAuditReport =
  Object.values(runtimeAuditReportModules)[0] ??
  createDocsA11yRuntimeReport({
    baseUrl: '',
    generatedAt: '',
    results: []
  })
const docsA11yRuntimeReportView = computed(() =>
  getDocsA11yRuntimeReportView(runtimeAuditReport)
)
const themeReleaseAudit = computed(() => auditThemeLabRelease(defaultThemeLabState))
const highRiskAccessibilityCoverageRate = computed(() =>
  Math.round((accessibilitySummary.value.highRiskCovered / Math.max(accessibilitySummary.value.highRiskTotal, 1)) * 100)
)
const accessibilityRiskLabels: Record<AccessibilityEvidenceRisk, string> = {
  native: 'Native',
  standard: 'Standard',
  complex: 'Complex',
  critical: 'Critical'
}
const accessibilityRiskCards = computed(() => {
  const riskOrder: AccessibilityEvidenceRisk[] = ['critical', 'complex', 'standard', 'native']

  return riskOrder.map((risk) => {
    const count = accessibilityEvidenceProfiles.filter((profile) => profile.risk === risk).length

    return {
      risk,
      label: accessibilityRiskLabels[risk],
      count,
      rate: Math.round((count / Math.max(accessibilityEvidenceProfiles.length, 1)) * 100)
    }
  })
})
const accessibilityCategoryLabels: Record<AccessibilityEvidenceCategory, string> = {
  native: '原生语义',
  semantics: '结构语义',
  keyboard: '键盘路径',
  focus: '焦点管理',
  aria: 'ARIA',
  contrast: '对比度',
  motion: '动效降级',
  docs: '文档证据',
  tests: '测试证据'
}
const accessibilityCategoryCards = computed(() =>
  Object.entries(accessibilitySummary.value.categoryCoverage)
    .map(([category, count]) => ({
      category: category as AccessibilityEvidenceCategory,
      label: accessibilityCategoryLabels[category as AccessibilityEvidenceCategory],
      count,
      rate: Math.round((count / Math.max(accessibilityEvidenceProfiles.length, 1)) * 100)
    }))
    .sort((a, b) => b.count - a.count)
)
const criticalAccessibilityProfiles = computed(() =>
  accessibilityEvidenceProfiles
    .filter((profile) => profile.risk === 'critical')
    .slice(0, 9)
)
const docsA11yPriorityLabels: Record<DocsA11yAuditPriority, string> = {
  critical: 'Critical routes',
  high: 'High priority',
  standard: 'Standard routes'
}
const docsA11yPriorityCards = computed(() => {
  const priorities: DocsA11yAuditPriority[] = ['critical', 'high', 'standard']

  return priorities.map((priority) => {
    const count = docsA11yAuditTargets.filter((target) => target.priority === priority).length

    return {
      priority,
      label: docsA11yPriorityLabels[priority],
      count,
      rate: Math.round((count / Math.max(docsA11yAuditTargets.length, 1)) * 100)
    }
  })
})
const docsA11yCheckLabels: Record<DocsA11yAuditCheck, string> = {
  structure: '结构语义',
  routing: '真实路由',
  keyboard: '键盘路径',
  focus: '焦点管理',
  aria: 'ARIA',
  contrast: '对比度',
  motion: '动效降级',
  responsive: '响应式',
  'live-example': '在线示例'
}
const docsA11yCheckCards = computed(() =>
  Object.entries(docsA11yAuditSummary.value.checkCoverage)
    .map(([check, count]) => ({
      check: check as DocsA11yAuditCheck,
      label: docsA11yCheckLabels[check as DocsA11yAuditCheck],
      count,
      rate: Math.round((count / Math.max(docsA11yAuditTargets.length, 1)) * 100)
    }))
    .sort((a, b) => b.count - a.count)
)
const docsA11yLeadTargets = computed(() =>
  docsA11yAuditTargets
    .filter((target) => target.priority === 'critical')
    .slice(0, 8)
)
const qualityMetrics = computed(() => [
  {
    label: 'Tracked components',
    value: trackedComponents.value.length,
    detail: `${componentPageComponents.value.length} 个组件拥有独立组件页`
  },
  {
    label: 'Structured APIs',
    value: apiComponents.value.length,
    detail: `${apiCoverageRate.value}% 组件拥有 props/events/slots/types 数据`
  },
  {
    label: 'Live examples',
    value: liveExampleComponents.value.length,
    detail: `${liveCoverageRate.value}% 组件详情页拥有可编辑在线示例`
  },
  {
    label: 'Guided live examples',
    value: guidedLiveExampleComponents.value.length,
    detail: `${guidedCoverageRate.value}% 在线示例带可视化 props 面板`
  },
  {
    label: 'Workflow examples',
    value: scenarioRichLiveExampleComponents.value.length,
    detail: `${scenarioRichCoverageRate.value}% 在线示例覆盖真实场景，共 ${workflowScenarioCount.value} 个场景条目`
  },
  {
    label: 'Repro bundles',
    value: reproBundleLiveExampleComponents.value.length,
    detail: `${reproBundleCoverageRate.value}% 在线示例可复制 package.json、src/main.ts、src/App.vue 和场景状态`
  },
  {
    label: 'Source quality',
    value: `${sourceQualitySummary.value.averageScore}%`,
    detail: `${sourceQualitySummary.value.complete}/${sourceQualitySummary.value.total} 示例通过源码、安装、API map、场景链接和 Playground 交接门禁`
  },
  {
    label: 'Edited source share',
    value: sourceQualitySummary.value.playgroundEditShareReady,
    detail: 'Playground 中编辑后的源码会进入分享链接，不会继续复用旧 handoff payload'
  },
  {
    label: 'Source panel handoff',
    value: sourceQualitySummary.value.sourcePanelHandoffReady,
    detail: 'Live Example 进入 Playground 时保留 SFC、Install、Diff 或 Repro bundle 的源码面板来源'
  },
  {
    label: 'Interaction contracts',
    value: interactionContractComponents.value.length,
    detail: `${interactionContractCoverageRate.value}% 组件拥有键盘、焦点和 ARIA 契约`
  },
  {
    label: 'A11y evidence',
    value: accessibilitySummary.value.highRiskCovered,
    detail: `${highRiskAccessibilityCoverageRate.value}% 高风险组件拥有文档、键盘、焦点、ARIA 和测试证据`
  },
  {
    label: 'Audit targets',
    value: docsA11yAuditSummary.value.total,
    detail: `${docsA11yAuditSummary.value.mobileCoverageRate}% 审计目标覆盖移动端，${docsA11yAuditSummary.value.liveExampleTargets} 个目标覆盖在线示例`
  },
  {
    label: 'Stable components',
    value: stableComponents.value.length,
    detail: '标记为 Stable 的组件'
  }
])

const componentMaturitySummary = computed(() => getComponentMaturitySummary())
const componentMaturityCards = computed(() => [
  {
    label: 'average maturity',
    value: `${componentMaturitySummary.value.averageScore}%`,
    detail: `${componentMaturitySummary.value.complete} complete / ${componentMaturitySummary.value.needsAttention} need attention`
  },
  {
    label: 'API evidence',
    value: `${componentMaturitySummary.value.apiCoverageRate}%`,
    detail: '组件页、API Reference 和包页共用结构化 API 数据'
  },
  {
    label: 'Live evidence',
    value: `${componentMaturitySummary.value.liveCoverageRate}%`,
    detail: '组件页具备 live example、源码复制、复现材料或工作流场景'
  },
  {
    label: 'A11y contracts',
    value: `${componentMaturitySummary.value.a11yContractRate}%`,
    detail: '组件具备原生、文档化或 interaction contract 可访问性证据'
  },
  {
    label: 'Playground handoff',
    value: `${componentMaturitySummary.value.playgroundHandoffRate}%`,
    detail: '组件 live example 可携带源码、主题和状态进入 Playground'
  },
  {
    label: 'Theme evidence',
    value: `${componentMaturitySummary.value.themeCoverageRate}%`,
    detail: '组件页 Theme 项读取真实源码 token 引用，而不是静态标记'
  }
])

const exampleCapabilityCards = computed(() => {
  const capabilityLabels = {
    'safe-template': '安全模板解析',
    'editable-source': '源码编辑',
    'responsive-preview': '响应式预览',
    'source-copy': '源码复制',
    'repro-bundle': '复现包',
    'event-log': '事件日志',
    drafts: '本地草稿',
    'visual-props': '可视化属性',
    'scenario-switching': '场景切换',
    'workflow-states': '工作流状态'
  }
  const capabilities = [
    ...defaultLiveExampleCapabilities,
    'visual-props',
    'scenario-switching',
    'workflow-states'
  ] as const

  return capabilities.map((capability) => {
    const count = liveExampleProfiles.filter((profile) => profile.capabilities.includes(capability)).length

    return {
      key: capability,
      label: capabilityLabels[capability],
      count,
      rate: Math.round((count / Math.max(liveExampleProfiles.length, 1)) * 100)
    }
  })
})

const scenarioKindLabels: Record<LiveExampleScenarioKind, string> = {
  basic: '基础态',
  controlled: '受控回填',
  copy: '文案提示',
  disabled: '禁用态',
  empty: '空态',
  loading: '加载态',
  error: '错误态',
  multi: '多选/批量',
  keyboard: '键盘路径',
  responsive: '响应式',
  remote: '远程数据',
  filter: '筛选',
  search: '搜索',
  virtual: '虚拟滚动',
  summary: '汇总',
  layout: '布局方向',
  composition: '组合插槽'
}

const workflowScenarioCards = computed(() => {
  const allScenarios = liveExampleProfiles.flatMap((profile) => profile.scenarios)
  const counts = new Map<LiveExampleScenarioKind, number>()

  allScenarios.forEach((scenario) => {
    counts.set(scenario.kind, (counts.get(scenario.kind) ?? 0) + 1)
  })

  return Array.from(counts.entries())
    .map(([kind, count]) => ({
      kind,
      label: scenarioKindLabels[kind],
      count,
      rate: Math.round((count / Math.max(allScenarios.length, 1)) * 100)
    }))
    .sort((a, b) => b.count - a.count)
})
const liveExampleReadinessSummary = computed(() => getLiveExampleReadinessSummary())
const apiLiveCoverageSummary = computed(() => getApiLiveCoverageSummary())
const releaseReadinessSummary = computed(() => getReleaseReadinessSummary())
const mainstreamParitySummary = computed(() => getMainstreamParitySummary())
const mainstreamParityItems = computed(() => getMainstreamParityItems())
const adoptionReadinessSummary = computed(() => getAdoptionReadinessSummary())
const docDemoSourceQualitySummary = computed(() => getDocDemoSourceQualitySummary())
const readinessStatusLabels: Record<LiveExampleReadinessStatus, string> = {
  excellent: 'Excellent',
  ready: 'Ready',
  'needs-depth': 'Needs depth'
}
const liveExampleReadinessCards = computed(() => [
  {
    label: 'average readiness',
    value: `${liveExampleReadinessSummary.value.averageScore}%`,
    detail: `${liveExampleReadinessSummary.value.excellent} excellent / ${liveExampleReadinessSummary.value.ready} ready / ${liveExampleReadinessSummary.value.needsDepth} needs depth`
  },
  {
    label: 'workflow ready',
    value: liveExampleReadinessSummary.value.workflowReady,
    detail: `${Math.round((liveExampleReadinessSummary.value.workflowReady / Math.max(liveExampleReadinessSummary.value.total, 1)) * 100)}% live examples have workflow scenario depth`
  },
  {
    label: 'keyboard scenarios',
    value: `${liveExampleReadinessSummary.value.keyboardScenarioCoverage}%`,
    detail: '组件示例中已经登记键盘路径的比例'
  },
  {
    label: 'responsive scenarios',
    value: `${liveExampleReadinessSummary.value.responsiveScenarioCoverage}%`,
    detail: '组件示例中已经登记窄屏或移动端场景的比例'
  },
  {
    label: 'edge states',
    value: `${liveExampleReadinessSummary.value.edgeStateCoverage}%`,
    detail: '组件示例中已经覆盖错误、空态、加载或禁用状态的比例'
  }
])

const docDemoSourceQualityCards = computed(() => [
  {
    label: 'DocDemo source quality',
    value: `${docDemoSourceQualitySummary.value.completeRate}%`,
    detail: `${docDemoSourceQualitySummary.value.completeDocs}/${docDemoSourceQualitySummary.value.totalDocs} 个组件页使用统一 DocDemo 并具备完整 SFC handoff。`
  },
  {
    label: 'DocDemo pages',
    value: docDemoSourceQualitySummary.value.docsWithDocDemo,
    detail: `${docDemoSourceQualitySummary.value.needsDocDemo} 个组件页仍需从 demo-box 迁移到 DocDemo。`
  },
  {
    label: 'static demos',
    value: docDemoSourceQualitySummary.value.totalDemos,
    detail: '组件页中使用 DocDemo 的静态示例总数。'
  },
  {
    label: 'code demos',
    value: docDemoSourceQualitySummary.value.totalCodeDemos,
    detail: '可展开源码、复制代码并进入 Playground 的静态示例数量。'
  },
  {
    label: 'handoff queue',
    value: docDemoSourceQualitySummary.value.needsHandoff,
    detail: '仍需要补 setup 或完整 SFC 的静态示例文档。'
  }
])

const sourcePanelExperienceCards = computed(() => [
  {
    label: 'source experience',
    value: `${sourcePanelExperienceSummary.value.averageScore}%`,
    detail: `${sourcePanelExperienceSummary.value.complete}/${sourcePanelExperienceSummary.value.total} 个源码入口保持 Element Plus 式阅读结构。`
  },
  {
    label: 'Element Plus source panel',
    value: sourcePanelExperienceSummary.value.elementPlusPanels,
    detail: 'DocDemo、Live Example 和 Playground 都显式暴露 data-source-panel="element-plus"。'
  },
  {
    label: 'Top-right toolbar',
    value: sourcePanelExperienceSummary.value.topRightToolbars,
    detail: '源码工具条统一进入 data-source-placement="code-top-right" 区域。'
  },
  {
    label: 'Bottom collapse',
    value: sourcePanelExperienceSummary.value.bottomCollapseBars,
    detail: '源码面板底部统一使用整行 bottom-collapse 收起入口。'
  },
  {
    label: 'Shared action model',
    value: sourcePanelExperienceSummary.value.sharedActionModels,
    detail: 'DocDemo、Live Example 和 Playground 统一复用 ExampleSourceActions。'
  },
  {
    label: 'Playground edit',
    value: sourcePanelExperienceSummary.value.playgroundEditActions,
    detail: '每个源码入口都能把当前示例带入 Playground 编辑。'
  },
  {
    label: 'Copy source',
    value: sourcePanelExperienceSummary.value.copyActions,
    detail: '每个源码入口都提供复制当前源码的动作。'
  }
])

const adoptionReadinessCards = computed(() => [
  {
    label: 'adoption readiness',
    value: `${adoptionReadinessSummary.value.coverageRate}%`,
    detail: `${adoptionReadinessSummary.value.passed}/${adoptionReadinessSummary.value.total} installation and adoption gates passed.`
  },
  {
    label: 'surfaces',
    value: adoptionReadinessSummary.value.adoptionSurfaces.length,
    detail: adoptionReadinessSummary.value.adoptionSurfaces.join(' / ')
  },
  {
    label: 'auto import',
    value: adoptionReadinessGates.find((gate) => gate.key === 'auto-import-resolver')?.status ?? 'missing',
    detail: 'Resolver keeps template usage aligned with package roots and style.css side effects.'
  },
  {
    label: 'type contract',
    value: adoptionReadinessGates.find((gate) => gate.key === 'type-declarations')?.status ?? 'missing',
    detail: 'Package manifests, declaration output and workspace typecheck remain part of the adoption gate.'
  },
  {
    label: 'adoption queue',
    value: adoptionReadinessSummary.value.nextQueue.length,
    detail: 'Any warning or missing install path moves into this queue before release.'
  }
])

const apiLiveCoverageCards = computed(() => [
  {
    label: 'API live coverage',
    value: `${apiLiveCoverageSummary.value.coverageRate}%`,
    detail: `${apiLiveCoverageSummary.value.coveredRows}/${apiLiveCoverageSummary.value.totalRows} API rows 已关联到场景或可视化属性。`
  },
  {
    label: 'Scenario linked',
    value: apiLiveCoverageSummary.value.scenarioRows,
    detail: 'API 行可以直接跳回对应 workflow 场景。'
  },
  {
    label: 'Visual prop linked',
    value: apiLiveCoverageSummary.value.livePropRows,
    detail: 'API 行由 Live Example 属性面板或 API map 覆盖。'
  },
  {
    label: 'Section evidence',
    value: apiLiveCoverageSummary.value.eventLogRows +
      apiLiveCoverageSummary.value.methodPlanRows +
      apiLiveCoverageSummary.value.slotSourceRows +
      apiLiveCoverageSummary.value.typeMapRows,
    detail: `${apiLiveCoverageSummary.value.eventLogRows} events / ${apiLiveCoverageSummary.value.methodPlanRows} methods / ${apiLiveCoverageSummary.value.slotSourceRows} slots / ${apiLiveCoverageSummary.value.typeMapRows} types。`
  },
  {
    label: 'Needs API scene',
    value: apiLiveCoverageSummary.value.partialRows + apiLiveCoverageSummary.value.missingRows,
    detail: `${apiLiveCoverageSummary.value.sourceOnlyRows} 行只有源码覆盖，${apiLiveCoverageSummary.value.missingRows} 行需要补场景。`
  }
])

const apiReferenceHandoffCards = computed(() => [
  {
    label: 'Browse every API row',
    value: apiLiveCoverageSummary.value.totalRows,
    detail: '打开 API 数据中心，按组件、API 名、类型、说明和 Live evidence 搜索。',
    href: '/resources/api-reference'
  },
  {
    label: 'Covered evidence view',
    value: apiLiveCoverageSummary.value.coveredRows,
    detail: '只查看已关联到场景、属性面板、事件日志、slot source 或 type map 的 API 行。',
    href: '/resources/api-reference?api-coverage=covered'
  },
  {
    label: 'Props evidence view',
    value: trackedComponents.value.length,
    detail: '只查看 Props 行，适合复核组件页属性表、Live props 面板和 API map 是否同步。',
    href: '/resources/api-reference?api-kind=props'
  },
  {
    label: 'Search variant',
    value: 'query',
    detail: '用一个常见 prop 演示 API 数据中心的 row 级深链和组件页锚点跳转。',
    href: '/resources/api-reference?api-q=variant&api-kind=props'
  }
])

const mainstreamParityCards = computed(() => [
  {
    label: 'mainstream parity',
    value: `${mainstreamParitySummary.value.coverageRate}%`,
    detail: `${mainstreamParitySummary.value.covered}/${mainstreamParitySummary.value.total} external benchmarks covered`
  },
  {
    label: 'average score',
    value: `${mainstreamParitySummary.value.averageScore}%`,
    detail: '按外部基准逐项计算组件、文档、Live Example、源码体验和资源页证据。'
  },
  {
    label: 'external source',
    value: mainstreamParitySummary.value.externalSources,
    detail: '基准来自主流 Vue 组件库的官方文档、主题指南、组件页和资源体系。'
  },
  {
    label: 'benchmark queue',
    value: mainstreamParitySummary.value.nextQueue.length,
    detail: '当任一外部基准未覆盖时，会进入下一步追赶队列。'
  },
  {
    label: 'reference libraries',
    value: mainstreamParitySummary.value.libraryCount,
    detail: mainstreamParitySummary.value.libraryLabels.join(' / ')
  }
])

const workflowScenarioLeaders = computed(() =>
  liveExampleProfiles
    .filter((profile) => profile.scenarios.length > 0)
    .map((profile) => {
      const component = trackedComponents.value.find((item) => item.docs === profile.docs)

      return {
        docs: profile.docs,
        title: component?.title ?? profile.preset,
        packageName: component?.packageName,
        count: profile.scenarios.length,
        labels: profile.scenarios.slice(0, 3).map((scenario) => scenario.label).join(' / ')
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
)

const familyCoverage = computed(() =>
  componentFamilies
    .map((family) => {
      const familyComponents = trackedComponents.value.filter((component) => component.family === family.id)
      const apiCount = familyComponents.filter((component) => componentApis[component.name]).length
      const liveCount = familyComponents.filter((component) => liveExampleDocs.has(component.docs)).length
      const guidedCount = familyComponents.filter((component) => liveExampleProfileByDocs.get(component.docs)?.mode === 'guided').length
      const scenarioCount = familyComponents.filter((component) => {
        const profile = liveExampleProfileByDocs.get(component.docs)

        return Boolean(profile && hasScenarioRichPreset(profile.preset) && profile.scenarios.length > 0)
      }).length
      const interactionCount = familyComponents.filter((component) => hasInteractionContract(component.name)).length

      return {
        ...family,
        count: familyComponents.length,
        apiCount,
        liveCount,
        guidedCount,
        scenarioCount,
        interactionCount
      }
    })
    .filter((family) => family.count > 0)
)

const scenarioPriorityFamilies = new Set(['form', 'overlay', 'data', 'admin'])
const interactionPriorityFamilies = new Set(['form', 'overlay', 'data', 'admin', 'productivity'])

const interactionPriorityComponents = computed(() =>
  trackedComponents.value.filter((component) => interactionPriorityFamilies.has(component.family))
)
const interactionPriorityContractComponents = computed(() =>
  interactionPriorityComponents.value.filter((component) => hasInteractionContract(component.name))
)
const interactionContractGapComponents = computed(() =>
  interactionPriorityComponents.value.filter((component) => !hasInteractionContract(component.name))
)
const runtimeAuditActionTargets = computed(() => {
  if (docsA11yRuntimeReportView.value.status === 'failed') {
    return docsA11yRuntimeReportView.value.failedRoutes
      .slice(0, 4)
      .map((route) => {
        const target = docsA11yAuditTargets.find((item) => item.route === route)

        return {
          href: target?.scenarioRoute ?? target?.route ?? route,
          title: target?.title ?? route,
          detail: target
            ? `${target.priority} · ${target.checks.join(' / ')}`
            : 'runtime audit failure',
          action: '修复运行时审计失败'
        }
      })
  }

  return docsA11yLeadTargets.value.slice(0, 4).map((target) => ({
    href: target.scenarioRoute ?? target.route,
    title: target.title,
    detail: `${target.priority} · ${target.viewports.join(' / ')}`,
    action: docsA11yRuntimeReportView.value.status === 'passed'
      ? '保持运行时回归覆盖'
      : '运行 docs:a11y:runtime'
  }))
})
const mainstreamGapLanes = computed(() => [
  {
    key: 'interaction',
    title: 'Interaction contracts',
    value: `${interactionPriorityContractComponents.value.length}/${interactionPriorityComponents.value.length}`,
    detail: '优先补表单、弹层、数据、后台和效率组件的键盘、焦点、ARIA 契约。',
    status: interactionContractGapComponents.value.length
      ? `${interactionContractGapComponents.value.length} gaps`
      : 'complete',
    items: interactionContractGapComponents.value.slice(0, 4).map((component) => ({
      href: component.docs,
      title: component.title,
      detail: `${packageLabels[component.packageName]} · ${component.family}`,
      action: '补 interaction contract 与证据测试'
    }))
  },
  {
    key: 'runtime',
    title: 'Runtime audit',
    value: docsA11yRuntimeReportView.value.status,
    detail: '主流官网需要真实 URL、桌面/移动端、导航和在线示例锚点的持续验收。',
    status: docsA11yRuntimeReportView.value.label,
    items: runtimeAuditActionTargets.value
  },
  {
    key: 'release',
    title: 'Release stabilization',
    value: releaseReadinessSummary.value.candidateCount || releaseReadinessSummary.value.blockedCount,
    detail: `Release gate evidence: ${releaseReadinessSummary.value.gateLabels}。候选组件必须同时通过 API、源码复现、编辑后分享、主题、成熟度和可访问性门禁。`,
    status: releaseReadinessSummary.value.candidateCount
      ? `${releaseReadinessSummary.value.candidateCount} release candidates`
      : `${releaseReadinessSummary.value.blockedCount} blocked`,
    items: (releaseReadinessSummary.value.candidates.length ? releaseReadinessSummary.value.candidates : releaseReadinessSummary.value.blocked)
      .slice(0, 4)
      .map((item) => ({
        href: item.docs,
        title: item.title,
        detail: `${packageLabels[item.packageName]} · ${item.status} · ${item.score}%`,
        action: item.releaseCandidate
          ? '通过发布门禁，复核后提升 Stable'
          : `补齐发布门禁：${item.missingGates.slice(0, 3).map((gate) => gate.label).join(' / ')}`
      }))
  }
])

const nextPriorities = computed(() =>
  trackedComponents.value
    .filter((component) => {
      const liveProfile = liveExampleProfileByDocs.get(component.docs)
      const needsScenarioDepth = scenarioPriorityFamilies.has(component.family) && liveProfile
        ? !hasScenarioRichPreset(liveProfile.preset) || liveProfile.scenarios.length === 0
        : false
      const needsInteractionContract = interactionPriorityFamilies.has(component.family)
        ? !hasInteractionContract(component.name)
        : false

      return !componentApis[component.name] || !liveProfile || liveProfile.mode !== 'guided' || needsScenarioDepth || needsInteractionContract
    })
    .slice(0, 12)
    .map((component) => ({
      ...component,
      missingApi: !componentApis[component.name],
      missingLive: !liveExampleDocs.has(component.docs),
      missingGuided: liveExampleProfileByDocs.get(component.docs)?.mode !== 'guided',
      missingScenario: (() => {
        const liveProfile = liveExampleProfileByDocs.get(component.docs)

        return scenarioPriorityFamilies.has(component.family) && liveProfile
          ? !hasScenarioRichPreset(liveProfile.preset) || liveProfile.scenarios.length === 0
          : false
      })(),
      missingInteraction: interactionPriorityFamilies.has(component.family) && !hasInteractionContract(component.name)
    }))
)
</script>

<template>
  <section class="maturity-dashboard" aria-label="Yok UI maturity dashboard">
    <div class="maturity-dashboard__hero">
      <p class="docs-eyebrow">maturity dashboard</p>
      <h2>把“像 Element Plus 一样成熟”拆成可持续推进的质量指标</h2>
      <p>
        Yok UI 已经有多包结构、组件总览、API 数据中心、在线示例和主题实验室。
        下一阶段的关键不是盲目堆数量，而是提升复杂组件深度、示例覆盖率、API 完整度、键盘焦点契约和可访问性说明。
      </p>
    </div>

    <div class="maturity-dashboard__metrics">
      <article v-for="metric in qualityMetrics" :key="metric.label">
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
        <p>{{ metric.detail }}</p>
      </article>
    </div>

    <div class="maturity-dashboard__component-maturity">
      <div class="maturity-dashboard__component-maturity-copy">
        <p class="docs-eyebrow">component maturity evidence</p>
        <h3>把单组件成熟度清单汇总成全局发布视图</h3>
        <p>
          每个组件页底部的 API、Live、A11y、Playground、Theme 和 Route IA 证据会同步汇总到这里。
          这让组件库不只看“有多少组件”，还能持续追踪每个组件离可发布、可维护、可复现还有多远。
        </p>
      </div>

      <div class="maturity-dashboard__component-maturity-grid">
        <article
          v-for="card in componentMaturityCards"
          :key="card.label"
          class="maturity-dashboard__component-maturity-card"
        >
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="maturity-dashboard__component-maturity-queue">
        <header>
          <div>
            <p class="docs-eyebrow">Next maturity queue</p>
            <h4>下一批组件页成熟度缺口</h4>
          </div>
          <span>{{ componentMaturitySummary.nextQueue.length }} queued</span>
        </header>
        <div class="maturity-dashboard__component-maturity-links">
          <a v-for="item in componentMaturitySummary.nextQueue" :key="item.docs" :href="item.docs">
            <strong>{{ item.title }}</strong>
            <span>{{ packageLabels[item.packageName] }} · {{ item.family }} · {{ item.score }}%</span>
            <em>{{ item.missingItems.slice(0, 3).map((missing) => missing.label).join(' / ') }}</em>
          </a>
          <div v-if="componentMaturitySummary.nextQueue.length === 0" class="maturity-dashboard__complete">
            <strong>Component maturity complete</strong>
            <span>当前组件页成熟度证据没有警告项，继续保持回归检查。</span>
          </div>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__roadmap">
      <div class="maturity-dashboard__roadmap-copy">
        <p class="docs-eyebrow">mainstream gap lanes</p>
        <h3>示例深度达标后，继续按证据泳道推进</h3>
        <p>
          主流组件库的成熟度来自持续运营：交互契约、真实 URL 审计、稳定版本候选和证据测试要能被同一张表追踪。
          这里会把下一阶段从“补 live example”自动切换到更高阶的交付缺口。
        </p>
      </div>

      <div class="maturity-dashboard__roadmap-grid">
        <article
          v-for="lane in mainstreamGapLanes"
          :key="lane.key"
          class="maturity-dashboard__roadmap-lane"
          :data-lane="lane.key"
        >
          <header>
            <div>
              <span>{{ lane.title }}</span>
              <strong>{{ lane.value }}</strong>
            </div>
            <em>{{ lane.status }}</em>
          </header>
          <p>{{ lane.detail }}</p>
          <div class="maturity-dashboard__roadmap-items">
            <a v-for="item in lane.items" :key="`${lane.key}-${item.href}-${item.title}`" :href="item.href">
              <strong>{{ item.title }}</strong>
              <span>{{ item.detail }}</span>
              <em>{{ item.action }}</em>
            </a>
            <div v-if="lane.items.length === 0" class="maturity-dashboard__roadmap-complete">
              <strong>当前泳道暂无缺口</strong>
              <span>继续保留回归测试和文档证据。</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="maturity-dashboard__mainstream">
      <div class="maturity-dashboard__mainstream-copy">
        <p class="docs-eyebrow">mainstream parity benchmark</p>
        <h3>把“接近主流组件库”改成外部基准驱动</h3>
        <p>
          内部成熟度达标后，Yok UI 继续用 Element Plus、Ant Design Vue、Arco Design Vue、Naive UI 和 TDesign Vue Next
          的组件总览、示例源码操作、Playground 交接、主题 token、企业表单、后台模板和资源体系作为外部对标项。
          每个基准都必须能回到当前组件、文档路由、Live Example、API evidence 或资源页证据。
        </p>
      </div>

      <div class="maturity-dashboard__mainstream-grid">
        <article
          v-for="card in mainstreamParityCards"
          :key="card.label"
          class="maturity-dashboard__mainstream-card"
        >
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="maturity-dashboard__mainstream-list">
        <article
          v-for="item in mainstreamParityItems"
          :key="item.key"
          class="maturity-dashboard__mainstream-item"
          :data-status="item.status"
        >
          <header>
            <div>
              <span class="maturity-dashboard__mainstream-library">{{ item.source.library }}</span>
              <a class="maturity-dashboard__mainstream-link" :href="item.source.url">
                {{ item.source.label }}
              </a>
              <strong>{{ item.label }}</strong>
            </div>
            <span>{{ item.score }}% · {{ item.status }}</span>
          </header>
          <p>{{ item.source.note }}</p>
          <div class="maturity-dashboard__mainstream-evidence">
            <span>{{ item.matchedComponents.length }} components</span>
            <span>{{ item.evidence.docs.length }} docs</span>
            <span>{{ item.evidence.liveExamples.length }} live examples</span>
            <span>{{ item.evidence.resources.length }} resources</span>
          </div>
          <div class="maturity-dashboard__mainstream-tags">
            <span v-for="capability in item.evidence.capabilities.slice(0, 4)" :key="`${item.key}-${capability}`">
              {{ capability }}
            </span>
          </div>
          <em v-if="item.missing.length">
            待补齐：{{ item.missing.join(' / ') }}
          </em>
        </article>
      </div>
    </div>

    <div class="maturity-dashboard__coverage-queue">
      <div class="maturity-dashboard__coverage-queue-copy">
        <p class="docs-eyebrow">component coverage queue</p>
        <h3>把文档证据缺口排成可执行维护队列</h3>
        <p>
          这条队列会合并组件页的 API Live、Source、A11y、Theme、Replay 和 Playground handoff 证据，
          按 critical、high、medium 自动排序，避免每次补文档都靠人工翻页面。
        </p>
      </div>

      <div class="maturity-dashboard__coverage-queue-status">
        <span>{{ componentMaturitySummary.criticalCoverageCount }} critical</span>
        <span>{{ componentMaturitySummary.highCoverageCount }} high</span>
        <span>{{ componentMaturitySummary.coverageQueue.length }} queued</span>
      </div>

      <div class="maturity-dashboard__coverage-queue-list">
        <article
          v-for="item in componentMaturitySummary.coverageQueue"
          :key="item.docs"
          class="maturity-dashboard__coverage-queue-item"
          :data-priority="item.priority"
        >
          <header class="maturity-dashboard__coverage-card-header">
            <span class="maturity-dashboard__coverage-priority">{{ item.priority }}</span>
            <a class="maturity-dashboard__coverage-title-link" :href="item.targetHref">
              <strong>{{ item.title }}</strong>
              <span>Open {{ item.targetLabel }}</span>
            </a>
          </header>
          <span class="maturity-dashboard__coverage-meta">
            {{ packageLabels[item.packageName] }} · {{ item.familyTitle }} · {{ item.score }}%
          </span>
          <em>{{ item.actionLabel }}</em>
          <span class="maturity-dashboard__coverage-detail">{{ item.actionDetail }}</span>
          <ol class="maturity-dashboard__coverage-checklist" aria-label="Coverage repair checklist">
            <li v-for="step in item.checklist" :key="`${item.docs}-${step.label}`">
              <a :href="step.href">
                <strong>{{ step.label }}</strong>
                <span>{{ step.detail }}</span>
              </a>
            </li>
          </ol>
          <span class="maturity-dashboard__coverage-tags">
            <span v-for="label in item.missingLabels.slice(0, 4)" :key="`${item.docs}-${label}`">
              {{ label }}
            </span>
          </span>
        </article>
        <div v-if="componentMaturitySummary.coverageQueue.length === 0" class="maturity-dashboard__complete">
          <strong>Component coverage complete</strong>
          <span>当前组件页的 API Live、Source、A11y、Theme 和 Playground 证据都已达标。</span>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__grid">
      <article v-for="family in familyCoverage" :key="family.id">
        <header>
          <strong>{{ family.title }}</strong>
          <span>{{ family.count }} components</span>
        </header>
        <div class="maturity-dashboard__bars">
          <span :style="{ '--coverage': `${Math.round((family.apiCount / family.count) * 100)}%` }">
            API {{ family.apiCount }}/{{ family.count }}
          </span>
          <span :style="{ '--coverage': `${Math.round((family.liveCount / family.count) * 100)}%` }">
            Live {{ family.liveCount }}/{{ family.count }}
          </span>
          <span :style="{ '--coverage': `${Math.round((family.guidedCount / family.count) * 100)}%` }">
            Guided {{ family.guidedCount }}/{{ family.count }}
          </span>
          <span :style="{ '--coverage': `${Math.round((family.scenarioCount / family.count) * 100)}%` }">
            Scenario {{ family.scenarioCount }}/{{ family.count }}
          </span>
          <span :style="{ '--coverage': `${Math.round((family.interactionCount / family.count) * 100)}%` }">
            Interaction {{ family.interactionCount }}/{{ family.count }}
          </span>
        </div>
      </article>
    </div>

    <div class="maturity-dashboard__capabilities">
      <div>
        <p class="docs-eyebrow">live example cockpit</p>
        <h3>在线示例能力不只统计“有没有”</h3>
        <p>
          主流组件库的示例通常包含可运行预览、源码复制、状态切换和事件反馈。
          Yok UI 现在把这些能力登记成数据，并额外追踪复杂组件是否具备 workflow 示例，避免示例覆盖率只是一个空数字。
        </p>
      </div>
      <ul>
        <li v-for="capability in exampleCapabilityCards" :key="capability.key">
          <strong>{{ capability.count }}</strong>
          <span>{{ capability.label }}</span>
          <em>{{ capability.rate }}%</em>
        </li>
      </ul>
    </div>

    <div class="maturity-dashboard__readiness">
      <div class="maturity-dashboard__readiness-copy">
        <p class="docs-eyebrow">live example readiness</p>
        <h3>把 live example 深度拆成可补齐的质量清单</h3>
        <p>
          Readiness 会同时检查安全模板、源码编辑、响应式预览、复制、事件日志、草稿、可视化属性、场景切换、workflow 状态、
          基础场景、键盘路径、响应式场景和边界状态。这样每个组件示例离“主流组件库级文档”还差什么，可以直接看出来。
        </p>
      </div>

      <div class="maturity-dashboard__readiness-grid">
        <article
          v-for="card in liveExampleReadinessCards"
          :key="card.label"
          class="maturity-dashboard__readiness-card"
        >
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="maturity-dashboard__readiness-queue">
        <header>
          <div>
            <p class="docs-eyebrow">Next live depth queue</p>
            <h4>下一批需要补深度的在线示例</h4>
          </div>
          <span>{{ liveExampleReadinessSummary.nextQueue.length }} queued</span>
        </header>
        <div class="maturity-dashboard__readiness-links">
          <a v-for="item in liveExampleReadinessSummary.nextQueue" :key="item.preset" :href="item.docs">
            <strong>{{ item.title }}</strong>
            <span>{{ item.packageName.replace('@yok-ui/', '') }} · {{ item.familyTitle }} · {{ readinessStatusLabels[item.status] }}</span>
            <em>{{ item.score }}% · {{ item.missingChecks.slice(0, 3).map((check) => check.label).join(' / ') }}</em>
          </a>
        </div>
      </div>

      <div class="maturity-dashboard__readiness-detail-grid">
        <article class="maturity-dashboard__readiness-detail">
          <header>
            <div>
              <p class="docs-eyebrow">Workflow ready evidence</p>
              <h4>已达到 workflow 深度的在线示例</h4>
            </div>
            <span>{{ liveExampleReadinessSummary.workflowReadyItems.length }} ready</span>
          </header>
          <div class="maturity-dashboard__workflow-ready-links">
            <a
              v-for="item in liveExampleReadinessSummary.workflowReadyItems.slice(0, 8)"
              :key="`workflow-${item.preset}`"
              :href="item.docs"
            >
              <strong>{{ item.title }}</strong>
              <span>{{ item.packageName.replace('@yok-ui/', '') }} · {{ item.familyTitle }}</span>
              <em>{{ item.scenarioCount }} scenarios · {{ item.score }}%</em>
            </a>
          </div>
        </article>

        <article class="maturity-dashboard__readiness-detail">
          <header>
            <div>
              <p class="docs-eyebrow">Props-only queue</p>
              <h4>仍停留在属性示例的组件</h4>
            </div>
            <span>{{ liveExampleReadinessSummary.propsOnlyItems.length }} queued</span>
          </header>
          <div class="maturity-dashboard__props-only-links">
            <a
              v-for="item in liveExampleReadinessSummary.propsOnlyItems"
              :key="`props-only-${item.preset}`"
              :href="item.docs"
            >
              <strong>{{ item.title }}</strong>
              <span>{{ item.packageName.replace('@yok-ui/', '') }} · {{ item.familyTitle }}</span>
              <em>{{ item.missingChecks.slice(0, 3).map((check) => check.label).join(' / ') }}</em>
            </a>
            <div v-if="liveExampleReadinessSummary.propsOnlyItems.length === 0" class="maturity-dashboard__complete">
              <strong>当前没有 props-only 示例缺口</strong>
              <span>所有在线示例都已经升级到 workflow 级场景，可继续推进交互契约和发布稳定性。</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="maturity-dashboard__doc-demo">
      <div class="maturity-dashboard__doc-demo-copy">
        <p class="docs-eyebrow">static demo handoff</p>
        <h3>把静态示例也纳入 Playground 交接质量门禁</h3>
        <p>
          除了 Live Example，组件页里的静态示例也需要统一到 DocDemo：能展开源码、复制代码、查看源文件，并携带完整 SFC 进入 Playground。
          这组指标会扫描组件 markdown，先找出仍在使用 demo-box 的页面，再找出已迁移 DocDemo 但缺 setup handoff 的静态示例。
        </p>
      </div>

      <div class="maturity-dashboard__doc-demo-grid">
        <article
          v-for="card in docDemoSourceQualityCards"
          :key="card.label"
          class="maturity-dashboard__doc-demo-card"
        >
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="maturity-dashboard__doc-demo-queue">
        <header>
          <div>
            <p class="docs-eyebrow">DocDemo source queue</p>
            <h4>下一批需要迁移 DocDemo 或补 complete SFC handoff 的静态示例</h4>
          </div>
          <span>{{ docDemoSourceQualitySummary.nextQueue.length }} queued</span>
        </header>
        <div class="maturity-dashboard__doc-demo-links">
          <a
            v-for="item in docDemoSourceQualitySummary.nextQueue"
            :key="item.docs"
            :href="item.docs"
          >
            <strong>{{ item.title }}</strong>
            <span>{{ item.packageLabel }} · {{ item.familyTitle }} · {{ item.score }}%</span>
            <em>
              {{
                item.status === 'needs-doc-demo'
                  ? `${item.rawDemoBoxCount} raw demo-box，先迁移到 DocDemo`
                  : item.missingHandoffTitles.slice(0, 3).join(' / ') || '补 DocDemo setup handoff'
              }}
            </em>
          </a>
          <div v-if="docDemoSourceQualitySummary.nextQueue.length === 0" class="maturity-dashboard__complete">
            <strong>DocDemo source quality complete</strong>
            <span>当前静态示例都已经具备完整 SFC handoff，可继续保持新增示例的质量门禁。</span>
          </div>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__source-panel">
      <div class="maturity-dashboard__source-panel-copy">
        <p class="docs-eyebrow">source panel experience</p>
        <h3>把示例源码区统一成 Element Plus 式阅读体验</h3>
        <p>
          DocDemo、Live Example 和 Playground 都是用户查看、复制、编辑示例代码的入口。
          这组门禁会扫描源码结构，确保三者都保持浅色源码面板、右上角工具栏、底部收起条、语言切换、复制和 Playground 编辑动作。
        </p>
      </div>

      <div class="maturity-dashboard__source-panel-grid">
        <article
          v-for="card in sourcePanelExperienceCards"
          :key="card.label"
          class="maturity-dashboard__source-panel-card"
        >
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="maturity-dashboard__source-panel-queue">
        <header>
          <div>
            <p class="docs-eyebrow">source panel queue</p>
            <h4>下一批需要修复的源码阅读入口</h4>
          </div>
          <span>{{ sourcePanelExperienceSummary.nextQueue.length }} queued</span>
        </header>
        <div class="maturity-dashboard__source-panel-links">
          <a
            v-for="item in sourcePanelExperienceSummary.nextQueue"
            :key="item.key"
            :href="`/source/?file=docs/.vitepress/components/${item.file}`"
          >
            <strong>{{ item.label }}</strong>
            <span>{{ item.file }} · {{ item.score }}%</span>
            <em>{{ item.missingChecks.slice(0, 3).map((check) => check.label).join(' / ') }}</em>
          </a>
          <div v-if="sourcePanelExperienceSummary.nextQueue.length === 0" class="maturity-dashboard__complete">
            <strong>Source panel experience complete</strong>
            <span>当前 DocDemo、Live Example 和 Playground 的源码阅读结构保持一致。</span>
          </div>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__adoption">
      <div class="maturity-dashboard__adoption-copy">
        <p class="docs-eyebrow">adoption readiness</p>
        <h3>把安装、按需导入和自动导入纳入主流组件库门禁</h3>
        <p>
          主流组件库不只提供组件页，还要让业务项目能稳定安装、注册、按需导入、自动导入、加载样式并获得类型提示。
          Yok UI 现在把这些采用链路拆成门禁，和组件成熟度、Live Example、API evidence 一起进入成熟度看板。
        </p>
      </div>

      <div class="maturity-dashboard__adoption-grid">
        <article
          v-for="card in adoptionReadinessCards"
          :key="card.label"
          class="maturity-dashboard__adoption-card"
        >
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="maturity-dashboard__adoption-list">
        <article
          v-for="gate in adoptionReadinessGates"
          :key="gate.key"
          class="maturity-dashboard__adoption-gate"
          :data-status="gate.status"
        >
          <header>
            <div>
              <span>{{ gate.surface }}</span>
              <strong>{{ gate.title }}</strong>
            </div>
            <em>{{ gate.status }}</em>
          </header>
          <p>{{ gate.detail }}</p>
          <code v-if="gate.command">{{ gate.command }}</code>
          <div class="maturity-dashboard__adoption-links">
            <a v-for="link in gate.docs" :key="`${gate.key}-${link}`" :href="link">{{ link }}</a>
          </div>
          <div class="maturity-dashboard__adoption-evidence">
            <span v-for="item in gate.evidence.slice(0, 3)" :key="`${gate.key}-${item}`">{{ item }}</span>
          </div>
        </article>
      </div>
    </div>

    <div id="api-live-map" class="maturity-dashboard__api-live-map">
      <div class="maturity-dashboard__api-live-map-copy">
        <p class="docs-eyebrow">api to live example map</p>
        <h3>API 表不再只是说明文档，而是能回到可运行场景</h3>
        <p>
          每个 API row 会被标记为 Scenario、Live prop、Source only 或 Needs live。
          这张表把单页 API 徽标汇总成全局覆盖率，下一步补示例时可以优先处理只有源码覆盖或完全缺少场景的组件。
        </p>
      </div>

      <div class="maturity-dashboard__api-live-map-grid">
        <article
          v-for="card in apiLiveCoverageCards"
          :key="card.label"
          class="maturity-dashboard__api-live-map-card"
        >
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="maturity-dashboard__api-reference-handoff" aria-label="API reference handoff">
        <header>
          <div>
            <p class="docs-eyebrow">API Reference handoff</p>
            <h4>把全局成熟度指标带回可搜索的数据中心</h4>
          </div>
          <a href="/resources/api-reference">Open API Reference</a>
        </header>
        <div class="maturity-dashboard__api-reference-links">
          <a v-for="item in apiReferenceHandoffCards" :key="item.href" :href="item.href">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
            <em>{{ item.detail }}</em>
          </a>
        </div>
      </div>

      <div class="maturity-dashboard__api-live-map-queue">
        <header>
          <div>
            <p class="docs-eyebrow">Next API scene queue</p>
            <h4>下一批需要把 API 行补进 live example 的组件</h4>
          </div>
          <span>{{ apiLiveCoverageSummary.nextQueue.length }} queued</span>
        </header>
        <div class="maturity-dashboard__api-live-map-links">
          <a
            v-for="item in apiLiveCoverageSummary.nextQueue"
            :key="item.component.name"
            :href="`${item.component.docs}${item.gapRows[0]?.coverage.href ?? '#api'}`"
          >
            <strong>{{ item.component.title }}</strong>
            <span>{{ packageLabels[item.component.packageName] }} · {{ item.rate }}% API live coverage</span>
            <em>
              {{ item.gapRows.slice(0, 3).map((gap) => `${gap.kind}:${gap.row.name}`).join(' / ') }}
            </em>
          </a>
          <div v-if="apiLiveCoverageSummary.nextQueue.length === 0" class="maturity-dashboard__complete">
            <strong>API live map complete</strong>
            <span>当前 API 行均已关联在线示例或可视化属性。</span>
          </div>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__capabilities maturity-dashboard__capabilities--scenario">
      <div>
        <p class="docs-eyebrow">workflow scenario matrix</p>
        <h3>复杂组件示例要覆盖真实状态，而不是只有基础态</h3>
        <p>
          Yok UI 现在把 workflow 示例拆成基础态、受控回填、空/错/加载、多选批量、键盘路径和响应式场景。
          这让文档深度可以像 API 一样被持续追踪。
        </p>
      </div>
      <div class="maturity-dashboard__scenario-board">
        <ul>
          <li v-for="scenario in workflowScenarioCards" :key="scenario.kind">
            <strong>{{ scenario.count }}</strong>
            <span>{{ scenario.label }}</span>
            <em>{{ scenario.rate }}%</em>
          </li>
        </ul>
        <div class="maturity-dashboard__scenario-leaders">
          <a v-for="profile in workflowScenarioLeaders" :key="profile.docs" :href="profile.docs">
            <strong>{{ profile.title }}</strong>
            <span>{{ profile.packageName ? packageLabels[profile.packageName] : 'Docs' }} · {{ profile.count }} scenarios</span>
            <em>{{ profile.labels }}</em>
          </a>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__capabilities">
      <div>
        <p class="docs-eyebrow">interaction contracts</p>
        <h3>键盘、焦点和 ARIA 不再只靠散落文档记忆</h3>
        <p>
          复杂组件现在通过 interaction contract 登记模式、键盘路径、焦点恢复、ARIA 语义和测试证据。
          这层数据会驱动组件质量评分和后续补齐队列。
        </p>
      </div>
      <ul>
        <li>
          <strong>{{ interactionContracts.length }}</strong>
          <span>已登记契约</span>
          <em>{{ interactionContractCoverageRate }}%</em>
        </li>
        <li>
          <strong>{{ verifiedInteractionContractCount }}</strong>
          <span>测试验证</span>
          <em>verified</em>
        </li>
        <li>
          <strong>{{ interactionEvidenceFileCount }}</strong>
          <span>测试证据文件</span>
          <em>evidence</em>
        </li>
      </ul>
    </div>

    <div class="maturity-dashboard__theme-release">
      <div class="maturity-dashboard__theme-release-copy">
        <p class="docs-eyebrow">theme release gates</p>
        <h3>把主题定制从“好看”推进到可发布门禁</h3>
        <p>
          Theme Lab 现在会把 token coverage、WCAG contrast、selector scope、density、radius 和 semantic colors
          合成发布前检查。成熟度页同步读取这份数据，确保主题能力能像组件 API 和在线示例一样持续回归。
        </p>
      </div>

      <div class="maturity-dashboard__theme-release-board">
        <article class="maturity-dashboard__theme-release-score">
          <span>release score</span>
          <strong>{{ themeReleaseAudit.score }}</strong>
          <p>{{ themeReleaseAudit.passed }}/{{ themeReleaseAudit.total }} gates passed</p>
        </article>

        <div class="maturity-dashboard__theme-release-grid">
          <article
            v-for="check in themeReleaseAudit.checks"
            :key="check.key"
            class="maturity-dashboard__theme-release-card"
            :data-passed="check.passed"
          >
            <span>{{ check.passed ? 'Pass' : 'Review' }}</span>
            <strong>{{ check.label }}</strong>
            <p>{{ check.detail }}</p>
          </article>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__a11y">
      <div class="maturity-dashboard__a11y-copy">
        <p class="docs-eyebrow">accessibility evidence board</p>
        <h3>把高风险组件的可访问性证据显式化</h3>
        <p>
          Yok UI 现在会为每个注册组件生成可访问性证据档案，并把弹层、选择、表格、树、Transfer、命令面板等高风险组件提升为重点追踪对象。
          高风险组件必须同时具备键盘路径、焦点管理、ARIA 语义、文档和测试证据。
        </p>
      </div>

      <div class="maturity-dashboard__a11y-grid">
        <article class="maturity-dashboard__a11y-summary">
          <strong>{{ highRiskAccessibilityCoverageRate }}%</strong>
          <span class="maturity-dashboard__a11y-label">high-risk evidence coverage</span>
          <p>
            {{ accessibilitySummary.highRiskCovered }}/{{ accessibilitySummary.highRiskTotal }}
            个高风险组件已经拥有完整证据，当前缺口 {{ accessibilitySummary.highRiskGapCount }} 个。
          </p>
        </article>

        <article class="maturity-dashboard__a11y-summary">
          <strong>{{ accessibilitySummary.evidenceFileCount }}</strong>
          <span class="maturity-dashboard__a11y-label">linked evidence files</span>
          <p>成熟度页只展示真实存在的文档与测试路径，避免虚假覆盖。</p>
        </article>

        <div class="maturity-dashboard__a11y-risks">
          <div
            v-for="risk in accessibilityRiskCards"
            :key="risk.risk"
            class="maturity-dashboard__a11y-risk-card"
          >
            <strong>{{ risk.count }}</strong>
            <span class="maturity-dashboard__a11y-label">{{ risk.label }}</span>
            <em>{{ risk.rate }}%</em>
          </div>
        </div>
      </div>

      <div class="maturity-dashboard__a11y-evidence">
        <div class="maturity-dashboard__a11y-panel">
          <h4 class="maturity-dashboard__a11y-panel-title">Evidence categories</h4>
          <ul class="maturity-dashboard__a11y-list">
            <li
              v-for="category in accessibilityCategoryCards"
              :key="category.category"
              class="maturity-dashboard__a11y-list-item"
            >
              <span class="maturity-dashboard__a11y-category-label">{{ category.label }}</span>
              <strong>{{ category.count }}</strong>
              <em>{{ category.rate }}%</em>
            </li>
          </ul>
        </div>

        <div class="maturity-dashboard__a11y-panel">
          <h4 class="maturity-dashboard__a11y-panel-title">Critical surfaces</h4>
          <div class="maturity-dashboard__a11y-links">
            <a v-for="profile in criticalAccessibilityProfiles" :key="profile.componentName" :href="profile.docsRoute">
              <strong>{{ profile.title }}</strong>
              <span class="maturity-dashboard__a11y-link-meta">{{ packageLabels[profile.packageName] }} · {{ profile.contract?.pattern ?? 'documented' }}</span>
              <em>{{ profile.categories.join(' / ') }}</em>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__audit">
      <div class="maturity-dashboard__audit-copy">
        <p class="docs-eyebrow">docs accessibility audit matrix</p>
        <h3>把文档站验收变成可执行目标清单</h3>
        <p>
          组件库官网不只是展示页面，它本身也需要像产品一样被审计。
          Yok UI 现在为顶部导航、成熟度页和高风险组件页生成审计目标，后续可直接接入 Playwright 或 axe 跑自动化扫描。
        </p>
      </div>

      <div class="maturity-dashboard__audit-grid">
        <article class="maturity-dashboard__audit-summary">
          <strong>{{ docsA11yAuditSummary.total }}</strong>
          <span class="maturity-dashboard__audit-label">audit targets</span>
          <p>
            {{ docsA11yAuditSummary.critical }} 个 critical，
            {{ docsA11yAuditSummary.high }} 个 high，
            {{ docsA11yAuditSummary.standard }} 个 standard。
          </p>
        </article>

        <article class="maturity-dashboard__audit-summary">
          <strong>{{ docsA11yAuditSummary.mobileCoverageRate }}%</strong>
          <span class="maturity-dashboard__audit-label">mobile viewport coverage</span>
          <p>每个审计目标都必须同时进入桌面和移动端断点检查。</p>
        </article>

        <article
          class="maturity-dashboard__audit-summary"
          :data-runtime-status="docsA11yRuntimeReportView.status"
        >
          <strong>{{ runtimeAuditReport.summary.failed }}</strong>
          <span class="maturity-dashboard__audit-label">{{ docsA11yRuntimeReportView.label }}</span>
          <p>{{ docsA11yRuntimeReportView.detail }}</p>
        </article>

        <div class="maturity-dashboard__audit-priorities">
          <div
            v-for="priority in docsA11yPriorityCards"
            :key="priority.priority"
            class="maturity-dashboard__audit-priority-card"
          >
            <strong>{{ priority.count }}</strong>
            <span class="maturity-dashboard__audit-label">{{ priority.label }}</span>
            <em>{{ priority.rate }}%</em>
          </div>
        </div>
      </div>

      <div class="maturity-dashboard__audit-details">
        <div class="maturity-dashboard__audit-panel">
          <h4 class="maturity-dashboard__audit-panel-title">Checks tracked</h4>
          <ul class="maturity-dashboard__audit-list">
            <li
              v-for="check in docsA11yCheckCards"
              :key="check.check"
              class="maturity-dashboard__audit-list-item"
            >
              <span class="maturity-dashboard__audit-check-label">{{ check.label }}</span>
              <strong>{{ check.count }}</strong>
              <em>{{ check.rate }}%</em>
            </li>
          </ul>
        </div>

        <div class="maturity-dashboard__audit-panel">
          <h4 class="maturity-dashboard__audit-panel-title">Critical audit routes</h4>
          <div class="maturity-dashboard__audit-links">
            <a v-for="target in docsA11yLeadTargets" :key="target.id" :href="target.scenarioRoute ?? target.route">
              <strong>{{ target.title }}</strong>
              <span class="maturity-dashboard__audit-link-meta">
                {{ target.route }} · {{ target.viewports.join(' / ') }}
              </span>
              <em>{{ target.checks.join(' / ') }}</em>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="maturity-dashboard__queue">
      <div>
        <p class="docs-eyebrow">next coverage queue</p>
        <h3>下一批优先补齐对象</h3>
        <p>优先选择有文档页但缺少结构化 API 或在线示例的组件。</p>
      </div>
      <div class="maturity-dashboard__queue-grid">
        <a v-for="component in nextPriorities" :key="component.name" :href="component.docs">
          <strong>{{ component.title }}</strong>
          <span>{{ packageLabels[component.packageName] }} · {{ component.status }}</span>
          <em>
            {{ component.missingApi ? 'API' : '' }}
            {{ component.missingApi && (component.missingLive || component.missingGuided) ? ' + ' : '' }}
            {{ component.missingLive ? 'Live' : '' }}
            {{ !component.missingLive && component.missingGuided ? 'Guided live' : '' }}
            {{ !component.missingLive && !component.missingGuided && component.missingScenario ? 'Workflow scenario' : '' }}
            {{ !component.missingApi && !component.missingLive && !component.missingGuided && !component.missingScenario && component.missingInteraction ? 'Interaction contract' : '' }}
          </em>
        </a>
        <div v-if="nextPriorities.length === 0" class="maturity-dashboard__complete">
          <strong>Coverage complete</strong>
          <span>当前注册组件都已经拥有结构化 API 与在线示例。</span>
        </div>
      </div>
    </div>
  </section>
</template>
