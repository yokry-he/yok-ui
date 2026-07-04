import { componentApis, components, type ComponentMeta } from './componentRegistry'
import { getApiLiveCoverageSummary } from './apiLiveCoverage'
import { getLiveExampleSourceQualitySummary } from './liveExampleSourceQuality'
import { liveExampleDocs } from './liveExamples'
import { getSourcePanelExperienceSummary } from './sourcePanelExperienceQuality'

export type MainstreamParityStatus = 'covered' | 'partial' | 'missing'

export type MainstreamBenchmarkKey =
  | 'element-plus-overview'
  | 'element-plus-source-actions'
  | 'element-plus-playground-flow'
  | 'element-plus-table'
  | 'element-plus-cascader'
  | 'element-plus-date-picker'
  | 'element-plus-config-provider-i18n'
  | 'element-plus-resource-system'

export interface MainstreamReferenceSource {
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
  sourceLabels: string[]
  nextQueue: MainstreamParityItem[]
}

export const mainstreamBenchmarks: MainstreamBenchmark[] = [
  {
    key: 'element-plus-overview',
    label: 'Component overview and category IA',
    source: {
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
      label: 'Element Plus Table',
      url: 'https://element-plus.org/en-US/component/table',
      note: 'Element Plus Table documents sorting, filtering and comparison-oriented data display patterns.'
    },
    componentNames: ['YTable', 'YDataTable'],
    docs: ['/components/table', '/components/data-table'],
    capabilities: ['structured-api', 'workflow-live-example', 'api-live-coverage']
  },
  {
    key: 'element-plus-cascader',
    label: 'Cascader and cascader-panel depth',
    source: {
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
      label: 'Element Plus Homepage',
      url: 'https://element-plus.org/',
      note: 'Element Plus separates Guide, Component and Resource entries instead of treating documentation as a flat page list.'
    },
    docs: ['/guide/introduction', '/components/', '/resources/maturity'],
    resources: ['/resources/api-reference', '/resources/release', '/resources/theme-lab'],
    capabilities: ['guide-component-resource-routing', 'api-reference', 'release-center', 'theme-lab']
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
    sourceLabels: unique(items.map((item) => item.source.label)),
    nextQueue: items
      .filter((item) => item.status !== 'covered')
      .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
  }
}
