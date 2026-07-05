import {
  componentApis,
  components,
  type ApiRow,
  type ComponentMeta
} from './componentRegistry'
import {
  liveExampleProfileByDocs,
  type LiveExampleProfile,
  type LiveExampleScenario
} from './liveExamples'

export type ApiLiveCoverageStatus = 'covered' | 'partial' | 'missing'

export interface ApiLiveCoverage {
  status: ApiLiveCoverageStatus
  label: string
  href: string
  detail: string
  scenario?: LiveExampleScenario
  docDemo?: ApiLiveDocDemoEvidence
}

export type ApiKind = 'props' | 'slots' | 'events' | 'methods' | 'types'

export interface ApiLiveDocDemoEvidence {
  id: string
  title: string
}

export interface ApiLiveCoverageRowItem {
  component: ComponentMeta
  kind: ApiKind
  row: ApiRow
  coverage: ApiLiveCoverage
}

export interface ApiLiveCoverageComponentItem {
  component: ComponentMeta
  total: number
  covered: number
  partial: number
  missing: number
  rate: number
  rows: ApiLiveCoverageRowItem[]
  gapRows: ApiLiveCoverageRowItem[]
}

export interface ApiLiveCoverageSummary {
  totalRows: number
  coveredRows: number
  partialRows: number
  missingRows: number
  coverageRate: number
  scenarioRows: number
  livePropRows: number
  eventLogRows: number
  methodPlanRows: number
  slotSourceRows: number
  typeMapRows: number
  sourceOnlyRows: number
  nextQueue: ApiLiveCoverageComponentItem[]
}

const guidedPropCoverageHints = new Set([
  'active-value',
  'activation-mode',
  'allow-create',
  'allow-duplicate',
  'animated',
  'auto-upload',
  'autocomplete',
  'before-upload',
  'bordered',
  'block',
  'bulk-actions',
  'checkable',
  'checked',
  'clearable',
  'close',
  'close-label',
  'close-text',
  'close-on-overlay',
  'closable',
  'collapse-tags',
  'column-keys',
  'column-widths',
  'columns',
  'compact',
  'confirm-text',
  'content',
  'cancel-text',
  'container',
  'current',
  'count',
  'custom-request',
  'dot',
  'close-on-outside-pointer',
  'color',
  'data',
  'decimal-separator',
  'default-view-preference',
  'density',
  'decision',
  'disabled',
  'downloadable',
  'download-name',
  'download-text',
  'default-expanded-row-keys',
  'error-text',
  'empty-text',
  'expired-text',
  'expandable',
  'expanded-row-keys',
  'filterable',
  'fit',
  'format',
  'filters',
  'alt',
  'align',
  'aria-label',
  'arrow',
  'attachments',
  'autoplay',
  'avatar-text',
  'background',
  'banner',
  'bio',
  'bottom',
  'bound',
  'description',
  'disabled-date',
  'disabled-time',
  'deleted',
  'direction',
  'duration',
  'error',
  'eyebrow',
  'features',
  'fields',
  'fill',
  'finish-text',
  'focus-on-click',
  'font-size',
  'foreground',
  'formatter',
  'full-height',
  'fullscreen',
  'gap',
  'group-separator',
  'height',
  'hide-delay',
  'hidden',
  'hint',
  'icon',
  'id',
  'inline',
  'items',
  'item-height',
  'italic',
  'justify',
  'label',
  'language',
  'line-clamp',
  'level',
  'length',
  'logo-alt',
  'logo-size',
  'logo-src',
  'logos',
  'locale',
  'lazy',
  'loading',
  'loading-text',
  'loop',
  'list-type',
  'mask',
  'max',
  'max-collapse-tags',
  'max-length',
  'max-height',
  'max-size',
  'maxlength',
  'mark',
  'message',
  'marker',
  'margin',
  'minute-step',
  'model-value',
  'min-time',
  'multiple',
  'name',
  'next-text',
  'nodes',
  'offset',
  'opacity',
  'open',
  'open-change',
  'options',
  'orientation',
  'overscan',
  'overlay',
  'panels',
  'pagination',
  'pause-on-hover',
  'placeholder',
  'prompt-error',
  'prompt-label',
  'prompt-placeholder',
  'prompt-value',
  'refresh-text',
  'placement',
  'position',
  'precision',
  'preview',
  'preview-open',
  'preview-src-list',
  'previewable',
  'prefix',
  'prefix-text',
  'previous-text',
  'prev-text',
  'primary-text',
  'prop',
  'radius',
  'readonly',
  'remote',
  'required',
  'resizable',
  'reset-text',
  'rejected-files',
  'right',
  'role',
  'rotate',
  'rows',
  'running',
  'secondary-text',
  'selected-suggestions',
  'search-placeholder',
  'shape',
  'show-delay',
  'show-count',
  'show-cancel',
  'show-icon',
  'show-zero',
  'show-value',
  'show-column-settings',
  'show-adjacent-months',
  'show-density-settings',
  'show-filter-summary',
  'show-summary',
  'skip-text',
  'sibling-count',
  'size',
  'src',
  'src-set',
  'spacing',
  'start',
  'sortable',
  'sticky-bulk-actions',
  'sticky-header',
  'striped',
  'strong',
  'steps',
  'status',
  'submit-text',
  'surplus-label',
  'suggestions',
  'shortcuts',
  'subtitle',
  'suffix',
  'suffix-text',
  'tag',
  'target',
  'select-scroll-top',
  'text',
  'texts',
  'today',
  'title',
  'tone',
  'end',
  'max-time',
  'tooltip',
  'total',
  'trend',
  'trigger',
  'truncated',
  'type',
  'underline',
  'active-text',
  'aria-describedby',
  'accordion',
  'collapsed',
  'collapsed-width',
  'default-open-keys',
  'default-expanded-keys',
  'expanded-keys',
  'inactive-text',
  'initial-index',
  'indicator-position',
  'input-value',
  'invalid',
  'interval',
  'mode',
  'padded',
  'scrollable',
  'sticky',
  'value',
  'variant',
  'validate-tag',
  'view-preference',
  'virtualized',
  'visibility-height',
  'void-icon',
  'z-index',
  'width'
])

const componentDocModules = import.meta.glob('../../components/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const docDemoCoverageHints: Record<string, string[]> = {
  '/components/button': ['variant', 'size'],
  '/components/input': ['type', 'show-password'],
  '/components/input-otp': ['length', 'mask', 'type'],
  '/components/upload': ['downloadable', 'sortable'],
  '/components/table': ['striped'],
  '/components/select': ['label'],
  '/components/virtualized-select': ['height', 'item-height', 'overscan', 'filterable', 'multiple']
}

function normalizeToken(value: string) {
  return value
    .replace(/^@/, '')
    .replace(/^update:/, 'update-')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function normalizeDocsRoute(path: string) {
  return path
    .replace(/^.*?\/components\//, '/components/')
    .replace(/\.md$/, '')
}

function getComponentDocSource(docsPath: string) {
  const modulePath = Object.keys(componentDocModules).find((path) => normalizeDocsRoute(path) === docsPath)

  return modulePath ? componentDocModules[modulePath] : ''
}

function createDocDemoSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function getDocDemoBlocks(source: string) {
  return Array.from(source.matchAll(/<DocDemo[\s\S]*?>/g)).map((match) => match[0])
}

function getDocDemoAttribute(block: string, name: string) {
  return block.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1] ?? ''
}

function getDocDemoTitle(block: string) {
  return getDocDemoAttribute(block, 'title') || 'untitled'
}

function getDocDemoId(block: string, title: string) {
  const explicitId = createDocDemoSlug(getDocDemoAttribute(block, 'id'))
  const titleSlug = createDocDemoSlug(title)

  if (explicitId) {
    return explicitId
  }

  return titleSlug ? `demo-${titleSlug}` : ''
}

function getBoundTemplateSource(source: string, bindingName: string) {
  if (!bindingName) {
    return ''
  }

  const escapedBindingName = bindingName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const templateMatch = source.match(new RegExp(`const\\s+${escapedBindingName}\\s*=\\s*\`([\\s\\S]*?)\``))

  if (templateMatch) {
    return templateMatch[1]
  }

  const arrayMatch = source.match(new RegExp(`const\\s+${escapedBindingName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*\\.join\\(`))

  if (!arrayMatch) {
    return ''
  }

  return Array.from(arrayMatch[1].matchAll(/'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`/g))
    .map((match) => decodeDocStringLiteral(match[1] ?? match[2] ?? match[3] ?? ''))
    .join('\n')
}

function decodeDocStringLiteral(value: string) {
  return value
    .replace(/\\`/g, '`')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}

function getDocDemoSearchText(source: string, block: string) {
  const codeBinding = block.match(/:code="([^"]+)"/)?.[1] ?? ''
  const setupBinding = block.match(/:setup="([^"]+)"/)?.[1] ?? ''
  const directCode = getDocDemoAttribute(block, 'code')
  const directSetup = getDocDemoAttribute(block, 'setup')

  return [
    block,
    directCode,
    directSetup,
    getBoundTemplateSource(source, codeBinding),
    getBoundTemplateSource(source, setupBinding)
  ].join('\n').toLowerCase()
}

function docDemoMentionsRow(source: string, block: string, row: ApiRow, options: { exactOnly?: boolean } = {}) {
  const rowToken = normalizeToken(row.name)
  const rowTokens = splitToken(row.name)
  const searchText = getDocDemoSearchText(source, block)

  if (!rowToken) {
    return false
  }

  if (searchText.includes(rowToken) || searchText.includes(row.name.toLowerCase())) {
    return true
  }

  if (options.exactOnly) {
    return false
  }

  return rowTokens.some((token) => searchText.includes(token))
}

function hasDocDemoCoverageHint(docsPath: string, row: ApiRow) {
  const rowToken = normalizeToken(row.name)

  return Boolean(rowToken && docDemoCoverageHints[docsPath]?.includes(rowToken))
}

function findDocDemoEvidence(docsPath: string, row: ApiRow): ApiLiveDocDemoEvidence | undefined {
  if (!hasDocDemoCoverageHint(docsPath, row)) {
    return undefined
  }

  const source = getComponentDocSource(docsPath)

  if (!source) {
    return undefined
  }

  const blocks = getDocDemoBlocks(source)
  const block = blocks.find((demoBlock) => docDemoMentionsRow(source, demoBlock, row, { exactOnly: true }))
    ?? blocks.find((demoBlock) => docDemoMentionsRow(source, demoBlock, row))

  if (!block) {
    return undefined
  }

  const title = getDocDemoTitle(block)
  const id = getDocDemoId(block, title)

  return id ? { id, title } : undefined
}

function splitToken(value: string) {
  return normalizeToken(value)
    .split('-')
    .filter((token) => token.length > 2)
}

function getScenarioSearchText(scenario: LiveExampleScenario) {
  return [
    scenario.key,
    scenario.label,
    scenario.kind,
    scenario.description,
    scenario.controlKey,
    scenario.controlValue
  ].filter(Boolean).join(' ').toLowerCase()
}

function findScenarioEvidence(profile: LiveExampleProfile, row: ApiRow) {
  const rowToken = normalizeToken(row.name)
  const rowTokens = splitToken(row.name)

  const exactScenario = profile.scenarios.find((scenario) => getScenarioSearchText(scenario).includes(rowToken))

  if (exactScenario) {
    return exactScenario
  }

  return profile.scenarios.find((scenario) => {
    const scenarioText = getScenarioSearchText(scenario)

    return rowTokens.some((token) => scenarioText.includes(token))
  })
}

function getLiveExampleHash(scenario?: LiveExampleScenario) {
  return scenario ? `#live-example?scenario=${encodeURIComponent(scenario.key)}` : '#live-example'
}

export function getApiLiveCoverageForRow(
  docsPath: string,
  kind: ApiKind,
  row: ApiRow
): ApiLiveCoverage {
  const profile = liveExampleProfileByDocs.get(docsPath)

  if (!profile) {
    return {
      status: 'missing',
      label: 'Needs live',
      href: '#live-example',
      detail: '当前组件页还没有可关联的 Live Example。'
    }
  }

  const rowToken = normalizeToken(row.name)

  if (kind === 'slots' && profile.capabilities.includes('source-copy')) {
    return {
      status: 'covered',
      label: 'Slot source',
      href: '#live-example-api-map',
      detail: '由 Live Example 的源码示例、复制面板和 API map 覆盖。'
    }
  }

  if (kind === 'types' && profile.capabilities.includes('repro-bundle')) {
    return {
      status: 'covered',
      label: 'Type map',
      href: '#live-example-api-map',
      detail: '由 Live Example 的 API map 和复现包上下文覆盖。'
    }
  }

  if (kind === 'methods' && profile.capabilities.includes('scenario-switching')) {
    return {
      status: 'covered',
      label: 'Method plan',
      href: '#live-example-test-plan',
      detail: '由 Live Example 的场景验收步骤和调试摘要覆盖。'
    }
  }

  if (kind === 'events' && profile.capabilities.includes('event-log')) {
    return {
      status: 'covered',
      label: 'Event log',
      href: '#live-example-event-log',
      detail: '由 Live Example 的事件日志和交互复现材料覆盖。'
    }
  }

  const scenario = findScenarioEvidence(profile, row)

  if (scenario) {
    return {
      status: 'covered',
      label: 'Scenario',
      href: getLiveExampleHash(scenario),
      detail: `由「${scenario.label}」场景覆盖。`,
      scenario
    }
  }

  const docDemo = findDocDemoEvidence(docsPath, row)

  if (docDemo) {
    return {
      status: 'covered',
      label: 'Example',
      href: `#${docDemo.id}`,
      detail: `由「${docDemo.title}」静态示例源码覆盖。`,
      docDemo
    }
  }

  if (
    kind === 'props' &&
    profile.capabilities.includes('visual-props') &&
    guidedPropCoverageHints.has(rowToken)
  ) {
    return {
      status: 'covered',
      label: 'Live prop',
      href: '#live-example-api-map',
      detail: '由 Live Example 的可视化属性面板或 API map 覆盖。'
    }
  }

  if (profile.capabilities.includes('editable-source')) {
    return {
      status: 'partial',
      label: 'Source only',
      href: '#live-example-api-map',
      detail: 'Live Example 可编辑源码，但尚未登记专门场景。'
    }
  }

  return {
    status: 'missing',
    label: 'Add example',
    href: '#live-example-api-map',
    detail: '需要补充场景或可视化属性控件。'
  }
}

function getApiRowsForComponent(component: ComponentMeta): ApiLiveCoverageRowItem[] {
  const api = componentApis[component.name]

  if (!api) {
    return []
  }

  const kinds: ApiKind[] = ['props', 'events', 'slots', 'methods', 'types']

  return kinds.flatMap((kind) => {
    const rows = api[kind] ?? []

    return rows.map((row) => ({
      component,
      kind,
      row,
      coverage: getApiLiveCoverageForRow(component.docs, kind, row)
    }))
  })
}

export function getApiLiveCoverageItems(): ApiLiveCoverageComponentItem[] {
  return components
    .map((component) => {
      const rows = getApiRowsForComponent(component)
      const covered = rows.filter((item) => item.coverage.status === 'covered').length
      const partial = rows.filter((item) => item.coverage.status === 'partial').length
      const missing = rows.filter((item) => item.coverage.status === 'missing').length
      const total = rows.length

      return {
        component,
        total,
        covered,
        partial,
        missing,
        rate: Math.round((covered / Math.max(total, 1)) * 100),
        rows,
        gapRows: rows.filter((item) => item.coverage.status !== 'covered')
      }
    })
    .filter((item) => item.total > 0)
}

export function getApiLiveCoverageSummary(): ApiLiveCoverageSummary {
  const items = getApiLiveCoverageItems()
  const rows = items.flatMap((item) => item.rows)
  const coveredRows = rows.filter((item) => item.coverage.status === 'covered').length
  const partialRows = rows.filter((item) => item.coverage.status === 'partial').length
  const missingRows = rows.filter((item) => item.coverage.status === 'missing').length
  const scenarioRows = rows.filter((item) => item.coverage.label === 'Scenario').length
  const livePropRows = rows.filter((item) => item.coverage.label === 'Live prop').length
  const eventLogRows = rows.filter((item) => item.coverage.label === 'Event log').length
  const methodPlanRows = rows.filter((item) => item.coverage.label === 'Method plan').length
  const slotSourceRows = rows.filter((item) => item.coverage.label === 'Slot source').length
  const typeMapRows = rows.filter((item) => item.coverage.label === 'Type map').length
  const sourceOnlyRows = rows.filter((item) => item.coverage.label === 'Source only').length

  return {
    totalRows: rows.length,
    coveredRows,
    partialRows,
    missingRows,
    coverageRate: Math.round((coveredRows / Math.max(rows.length, 1)) * 100),
    scenarioRows,
    livePropRows,
    eventLogRows,
    methodPlanRows,
    slotSourceRows,
    typeMapRows,
    sourceOnlyRows,
    nextQueue: items
      .filter((item) => item.gapRows.length > 0)
      .sort((a, b) => a.rate - b.rate || b.gapRows.length - a.gapRows.length || a.component.title.localeCompare(b.component.title))
      .slice(0, 8)
  }
}
