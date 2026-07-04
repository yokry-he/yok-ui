import { componentApis, components, type ComponentMeta } from './componentRegistry'
import { getApiLiveCoverageSummary } from './apiLiveCoverage'
import { getLiveExampleSourceQualitySummary } from './liveExampleSourceQuality'
import { liveExampleDocs } from './liveExamples'
import { getSourcePanelExperienceSummary } from './sourcePanelExperienceQuality'
import { getSupportMatrixSummary } from './supportMatrix'

export type MainstreamParityStatus = 'covered' | 'partial' | 'missing'

export type MainstreamBenchmarkKey =
  | 'element-plus-overview'
  | 'element-plus-source-actions'
  | 'element-plus-playground-flow'
  | 'element-plus-table'
  | 'element-plus-virtualized-tree'
  | 'element-plus-cascader'
  | 'element-plus-date-picker'
  | 'element-plus-config-provider-i18n'
  | 'element-plus-resource-system'
  | 'element-plus-compatibility-support'
  | 'ant-design-vue-theme-token'
  | 'ant-design-vue-select-form'
  | 'arco-design-vue-token-lab'
  | 'arco-design-vue-admin-pattern'
  | 'naive-ui-theme-system'
  | 'tdesign-vue-next-enterprise-shell'

export interface MainstreamReferenceSource {
  library: string
  label: string
  url: string
  note: string
}

export interface MainstreamBenchmark {
  key: MainstreamBenchmarkKey
  label: string
  source: MainstreamReferenceSource
  componentNames?: string[]
  minComponentCount?: number
  docs?: string[]
  resources?: string[]
  capabilities: string[]
}

export interface MainstreamParityEvidence {
  docs: string[]
  liveExamples: string[]
  resources: string[]
  capabilities: string[]
}

export interface MainstreamParityItem {
  key: MainstreamBenchmarkKey
  label: string
  source: MainstreamReferenceSource
  status: MainstreamParityStatus
  score: number
  matchedComponents: ComponentMeta[]
  evidence: MainstreamParityEvidence
  missing: string[]
}

export interface MainstreamParitySummary {
  total: number
  covered: number
  partial: number
  missing: number
  coverageRate: number
  averageScore: number
  externalSources: number
  libraryCount: number
  libraryLabels: string[]
  sourceLabels: string[]
  nextQueue: MainstreamParityItem[]
}

export const mainstreamBenchmarks: MainstreamBenchmark[] = [
  {
    key: 'element-plus-overview',
    label: 'Component overview and category IA',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Overview',
      url: 'https://element-plus.org/en-US/component/overview',
      note: 'Element Plus exposes component categories and an overview route as the primary component discovery surface.'
    },
    minComponentCount: 70,
    docs: ['/components/'],
    resources: ['/resources/maturity'],
    capabilities: ['category-navigation', 'package-aware-registry', 'maturity-dashboard']
  },
  {
    key: 'element-plus-source-actions',
    label: 'Example source actions',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Component demos',
      url: 'https://element-plus.org/en-US/component/select',
      note: 'Element Plus examples expose TS / JS, Playground editing, copy and source-reading actions around each demo.'
    },
    resources: ['/resources/maturity'],
    capabilities: ['source-panel', 'top-right-toolbar', 'bottom-collapse', 'copy-source']
  },
  {
    key: 'element-plus-playground-flow',
    label: 'Docs example to Playground handoff',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Playground',
      url: 'https://element-plus.org/en-US/component/select',
      note: 'Mainstream docs let examples move into an editable playground while preserving runnable source context.'
    },
    resources: ['/playground/'],
    capabilities: ['editable-source', 'playground-handoff', 'edited-source-share', 'source-panel-handoff']
  },
  {
    key: 'element-plus-table',
    label: 'Data table sorting, filtering and comparison',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Table',
      url: 'https://element-plus.org/en-US/component/table',
      note: 'Element Plus Table documents sorting, filtering and comparison-oriented data display patterns.'
    },
    componentNames: ['YTable', 'YDataTable'],
    docs: ['/components/table', '/components/data-table'],
    capabilities: ['structured-api', 'workflow-live-example', 'api-live-coverage']
  },
  {
    key: 'element-plus-virtualized-tree',
    label: 'Virtualized tree performance',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Virtualized Tree',
      url: 'https://element-plus.org/en-US/component/tree-v2',
      note: 'Element Plus exposes a virtualized Tree V2 for large trees that need fast scrolling with tree-node interaction.'
    },
    componentNames: ['YTree'],
    docs: ['/components/tree'],
    capabilities: ['virtualized-tree', 'structured-api', 'workflow-live-example', 'keyboard-scenario']
  },
  {
    key: 'element-plus-cascader',
    label: 'Cascader and cascader-panel depth',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Cascader',
      url: 'https://element-plus.org/en-US/component/cascader',
      note: 'Element Plus Cascader and CascaderPanel cover single selection, multiple selection and dynamic loading depth.'
    },
    componentNames: ['YCascader'],
    docs: ['/components/cascader'],
    capabilities: ['structured-api', 'workflow-live-example', 'keyboard-scenario']
  },
  {
    key: 'element-plus-date-picker',
    label: 'Date picker shortcuts and disabled dates',
    source: {
      library: 'Element Plus',
      label: 'Element Plus DatePicker',
      url: 'https://element-plus.org/en-US/component/date-picker',
      note: 'Element Plus DatePicker highlights shortcuts, disabled dates and calendar-panel usage states.'
    },
    componentNames: ['YDatePicker', 'YDateRangePicker'],
    docs: ['/components/date-picker', '/components/date-range-picker'],
    capabilities: ['structured-api', 'workflow-live-example', 'shortcut-scenario', 'disabled-date-scenario']
  },
  {
    key: 'element-plus-config-provider-i18n',
    label: 'ConfigProvider locale and global settings',
    source: {
      library: 'Element Plus',
      label: 'Element Plus ConfigProvider i18n',
      url: 'https://element-plus.org/en-US/guide/i18n',
      note: 'Element Plus uses ConfigProvider for locale and global configuration patterns.'
    },
    componentNames: ['YConfigProvider', 'YThemeProvider'],
    docs: ['/components/config-provider', '/guide/theming'],
    capabilities: ['locale-provider', 'global-size-density', 'theme-provider']
  },
  {
    key: 'element-plus-resource-system',
    label: 'Guide, Component and Resource information architecture',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Homepage',
      url: 'https://element-plus.org/',
      note: 'Element Plus separates Guide, Component and Resource entries instead of treating documentation as a flat page list.'
    },
    docs: ['/guide/introduction', '/components/', '/resources/maturity'],
    resources: ['/resources/api-reference', '/resources/release', '/resources/theme-lab'],
    capabilities: ['guide-component-resource-routing', 'api-reference', 'release-center', 'theme-lab']
  },
  {
    key: 'element-plus-compatibility-support',
    label: 'Compatibility and support matrix',
    source: {
      library: 'Element Plus',
      label: 'Element Plus Installation Compatibility',
      url: 'https://element-plus.org/en-US/guide/installation',
      note: 'Element Plus documents browser compatibility, Vue 3/IE boundaries, Sass version and package-manager installation on its installation page.'
    },
    docs: ['/guide/installation', '/resources/support'],
    resources: ['/resources/maturity'],
    capabilities: ['browser-baseline', 'vue-runtime-boundary', 'ssr-boundary', 'bundler-support', 'support-matrix']
  },
  {
    key: 'ant-design-vue-theme-token',
    label: 'Design token customization through ConfigProvider',
    source: {
      library: 'Ant Design Vue',
      label: 'Ant Design Vue Customize Theme',
      url: 'https://www.antdv.com/docs/vue/customize-theme',
      note: 'Ant Design Vue documents token-based customization through ConfigProvider for brand and product theme adaptation.'
    },
    componentNames: ['YThemeProvider', 'YConfigProvider'],
    docs: ['/guide/theming', '/components/config-provider'],
    resources: ['/resources/theme-lab'],
    capabilities: ['design-token', 'config-provider-theme', 'brand-customization', 'theme-lab']
  },
  {
    key: 'ant-design-vue-select-form',
    label: 'Enterprise form selection and validation workflow',
    source: {
      library: 'Ant Design Vue',
      label: 'Ant Design Vue Select',
      url: 'https://antdv.com/components/select',
      note: 'Ant Design Vue Select emphasizes enterprise form selection patterns including multiple select and remote search.'
    },
    componentNames: ['YSelect', 'YForm', 'YFormItem'],
    docs: ['/components/select', '/components/form', '/components/form-item'],
    capabilities: ['enterprise-form', 'remote-search-select', 'structured-api', 'workflow-live-example']
  },
  {
    key: 'arco-design-vue-token-lab',
    label: 'Design token inventory and visual theme lab',
    source: {
      library: 'Arco Design Vue',
      label: 'Arco Design Vue Design Token',
      url: 'https://arco.design/vue/en-US/docs/token',
      note: 'Arco Design Vue exposes global token inventory as an explicit documentation surface for design-system customization.'
    },
    componentNames: ['YThemeProvider', 'YColorPicker'],
    docs: ['/guide/theming', '/components/color-picker'],
    resources: ['/resources/theme-lab'],
    capabilities: ['design-token-inventory', 'theme-lab', 'visual-token-editing', 'brand-color-preview']
  },
  {
    key: 'arco-design-vue-admin-pattern',
    label: 'Admin page templates and data-workbench patterns',
    source: {
      library: 'Arco Design Vue',
      label: 'Arco Design Pro Vue',
      url: 'https://github.com/arco-design/arco-design-pro-vue',
      note: 'Arco Design Pro Vue packages common dashboard, table, list, form and visualization patterns into admin templates.'
    },
    componentNames: ['YPageHeader', 'YSearchForm', 'YCrudLayout', 'YDataTable'],
    docs: ['/components/page-header', '/components/search-form', '/components/crud-layout', '/components/data-table'],
    resources: ['/resources/maturity'],
    capabilities: ['admin-template', 'data-workbench', 'search-form', 'crud-layout']
  },
  {
    key: 'naive-ui-theme-system',
    label: 'TypeScript-first theme system and tree-shakable suite',
    source: {
      library: 'Naive UI',
      label: 'Naive UI Homepage',
      url: 'https://www.naiveui.com/',
      note: 'Naive UI positions itself around Vue 3, TypeScript, theme customization, speed and a fairly complete component suite.'
    },
    componentNames: ['YConfigProvider', 'YThemeProvider'],
    docs: ['/components/config-provider', '/guide/theming'],
    resources: ['/resources/theme-lab'],
    capabilities: ['typescript-first-theme', 'tree-shaking', 'theme-overrides', 'complete-suite']
  },
  {
    key: 'tdesign-vue-next-enterprise-shell',
    label: 'Enterprise desktop shell and starter workflow',
    source: {
      library: 'TDesign Vue Next',
      label: 'TDesign Vue Next Overview',
      url: 'https://tdesign.tencent.com/vue-next/overview',
      note: 'TDesign Vue Next targets Vue 3 desktop application interaction with dark mode, customizable theme and tree-shaking support.'
    },
    componentNames: ['YPageHeader', 'YDataTable', 'YSearchForm', 'YCrudLayout'],
    docs: ['/components/page-header', '/components/data-table', '/components/search-form', '/components/crud-layout'],
    resources: ['/resources/release', '/resources/maturity'],
    capabilities: ['desktop-application', 'enterprise-shell', 'dark-mode', 'tree-shaking']
  }
]

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function hasApi(component: ComponentMeta) {
  const api = componentApis[component.name]

  return Boolean(api?.props?.length || api?.events?.length || api?.slots?.length || api?.methods?.length || api?.types?.length)
}

function getBenchmarkComponents(benchmark: MainstreamBenchmark) {
  if (benchmark.componentNames?.length) {
    const names = new Set(benchmark.componentNames)

    return components.filter((component) => names.has(component.name))
  }

  return components
}

function getBenchmarkDocs(benchmark: MainstreamBenchmark, matchedComponents: ComponentMeta[]) {
  return unique([
    ...(benchmark.docs ?? []),
    ...matchedComponents.map((component) => component.docs)
  ])
}

function createChecks(benchmark: MainstreamBenchmark, matchedComponents: ComponentMeta[]) {
  const sourcePanel = getSourcePanelExperienceSummary()
  const sourceQuality = getLiveExampleSourceQualitySummary()
  const apiLiveCoverage = getApiLiveCoverageSummary()
  const supportMatrix = getSupportMatrixSummary()
  const docs = getBenchmarkDocs(benchmark, matchedComponents)
  const liveExamples = matchedComponents
    .filter((component) => liveExampleDocs.has(component.docs))
    .map((component) => `${component.docs}#live-example`)
  const resources = unique(benchmark.resources ?? [])
  const checks: Array<{ label: string, passed: boolean }> = [
    {
      label: 'external reference source',
      passed: Boolean(benchmark.source.url)
    },
    {
      label: 'matched Yok UI component or route',
      passed: benchmark.minComponentCount
        ? components.length >= benchmark.minComponentCount
        : matchedComponents.length > 0 || docs.length > 0 || resources.length > 0
    },
    {
      label: 'documented route evidence',
      passed: docs.length > 0
    }
  ]

  if (benchmark.componentNames?.length) {
    checks.push(
      {
        label: 'structured API evidence',
        passed: matchedComponents.some(hasApi)
      },
      {
        label: 'live example evidence',
        passed: liveExamples.length > 0
      }
    )
  }

  if (benchmark.key === 'element-plus-source-actions') {
    checks.push({
      label: 'Element Plus style source panel',
      passed: sourcePanel.averageScore === 100
    })
  }

  if (benchmark.key === 'element-plus-playground-flow') {
    checks.push({
      label: 'edited source share and source panel handoff',
      passed: sourceQuality.playgroundEditShareReady === sourceQuality.total &&
        sourceQuality.sourcePanelHandoffReady === sourceQuality.total
    })
  }

  if (benchmark.key === 'element-plus-overview') {
    checks.push({
      label: 'component registry breadth',
      passed: components.length >= (benchmark.minComponentCount ?? 0)
    })
  }

  if (benchmark.key === 'element-plus-resource-system') {
    checks.push({
      label: 'resource pages',
      passed: resources.length >= 3
    })
  }

  if (benchmark.key === 'element-plus-compatibility-support') {
    checks.push({
      label: 'support matrix coverage',
      passed: supportMatrix.supportRate === 100 && supportMatrix.total >= 9
    })
  }

  if (benchmark.key === 'element-plus-table') {
    checks.push({
      label: 'API to live coverage',
      passed: apiLiveCoverage.coverageRate === 100
    })
  }

  const passed = checks.filter((check) => check.passed).length
  const score = Math.round((passed / Math.max(checks.length, 1)) * 100)

  return {
    checks,
    score,
    status: score === 100 ? 'covered' : score > 0 ? 'partial' : 'missing',
    docs,
    liveExamples,
    resources,
    missing: checks.filter((check) => !check.passed).map((check) => check.label)
  } satisfies {
    checks: Array<{ label: string, passed: boolean }>
    score: number
    status: MainstreamParityStatus
    docs: string[]
    liveExamples: string[]
    resources: string[]
    missing: string[]
  }
}

export function getMainstreamParityItems(): MainstreamParityItem[] {
  return mainstreamBenchmarks.map((benchmark) => {
    const matchedComponents = getBenchmarkComponents(benchmark)
    const result = createChecks(benchmark, matchedComponents)

    return {
      key: benchmark.key,
      label: benchmark.label,
      source: benchmark.source,
      status: result.status,
      score: result.score,
      matchedComponents,
      evidence: {
        docs: result.docs,
        liveExamples: result.liveExamples,
        resources: result.resources,
        capabilities: benchmark.capabilities
      },
      missing: result.missing
    }
  })
}

export function getMainstreamParitySummary(): MainstreamParitySummary {
  const items = getMainstreamParityItems()
  const covered = items.filter((item) => item.status === 'covered').length
  const partial = items.filter((item) => item.status === 'partial').length
  const missing = items.filter((item) => item.status === 'missing').length

  return {
    total: items.length,
    covered,
    partial,
    missing,
    coverageRate: Math.round((covered / Math.max(items.length, 1)) * 100),
    averageScore: Math.round(items.reduce((total, item) => total + item.score, 0) / Math.max(items.length, 1)),
    externalSources: new Set(items.map((item) => item.source.url)).size,
    libraryCount: new Set(items.map((item) => item.source.library)).size,
    libraryLabels: unique(items.map((item) => item.source.library)),
    sourceLabels: unique(items.map((item) => item.source.label)),
    nextQueue: items
      .filter((item) => item.status !== 'covered')
      .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
  }
}
