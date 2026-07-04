<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  componentApis,
  components,
  packageLabels,
  type ApiRow,
  type ComponentApi,
  type ComponentPackage
} from '../data/componentRegistry'
import {
  getApiLiveCoverageForRow,
  type ApiKind,
  type ApiLiveCoverage,
  type ApiLiveCoverageStatus
} from '../data/apiLiveCoverage'

const apiKinds = ['props', 'events', 'slots', 'methods', 'types'] as const satisfies readonly ApiKind[]
const coverageStatuses = ['covered', 'partial', 'missing'] as const satisfies readonly ApiLiveCoverageStatus[]
const kindLabels: Record<ApiKind, string> = {
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  methods: 'Methods',
  types: 'Types'
}
const coverageLabels: Record<ApiLiveCoverageStatus, string> = {
  covered: 'Covered',
  partial: 'Source only',
  missing: 'Needs live'
}
const clipboardWriteTimeoutMs = 320
const componentPackages = Object.keys(packageLabels) as ComponentPackage[]

function getInitialSearchParam(name: string) {
  if (typeof window === 'undefined') {
    return ''
  }

  return new URLSearchParams(window.location.search).get(name) ?? ''
}

function getInitialKind(): 'all' | ApiKind {
  const value = getInitialSearchParam('api-kind')

  return apiKinds.includes(value as ApiKind) ? value as ApiKind : 'all'
}

function getInitialCoverage(): 'all' | ApiLiveCoverageStatus {
  const value = getInitialSearchParam('api-coverage')

  return coverageStatuses.includes(value as ApiLiveCoverageStatus) ? value as ApiLiveCoverageStatus : 'all'
}

function getInitialPackage(): 'all' | ComponentPackage {
  const value = getInitialSearchParam('api-package')

  return componentPackages.includes(value as ComponentPackage) ? value as ComponentPackage : 'all'
}

const query = ref(getInitialSearchParam('api-q'))
const selectedKind = ref<'all' | ApiKind>(getInitialKind())
const selectedCoverage = ref<'all' | ApiLiveCoverageStatus>(getInitialCoverage())
const selectedPackage = ref<'all' | ComponentPackage>(getInitialPackage())
const copiedFilterLink = ref(false)

interface ApiRowEntry {
  key: string
  name: string
  kind: ApiKind
  kindLabel: string
  row: ApiRow
  coverage: ApiLiveCoverage
  rowHref: string
  evidenceHref: string
}

interface ApiComponentEntry {
  name: string
  api: ComponentApi
  component: NonNullable<(typeof components)[number]>
  rows: ApiRowEntry[]
  coverageRate: number
}

const apiEntries = computed<ApiComponentEntry[]>(() =>
  Object.entries(componentApis)
    .map(([name, api]) => ({
      name,
      api,
      component: components.find((item) => item.name === name)
    }))
    .filter((entry) => entry.component)
    .map((entry) => {
      const component = entry.component!
      const rows = apiKinds.flatMap((kind) =>
        (entry.api[kind] ?? []).map((row) => createApiRowEntry(component.docs, kind, row))
      )
      const coveredRows = rows.filter((row) => row.coverage.status === 'covered').length

      return {
        ...entry,
        component,
        rows,
        coverageRate: Math.round((coveredRows / Math.max(rows.length, 1)) * 100)
      }
    })
)

const filteredEntries = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  return apiEntries.value
    .map((entry) => {
      const matchingRows = entry.rows.filter((row) => {
        const matchesPackage = selectedPackage.value === 'all' || entry.component.packageName === selectedPackage.value
        const matchesKind = selectedKind.value === 'all' || row.kind === selectedKind.value
        const matchesCoverage = selectedCoverage.value === 'all' || row.coverage.status === selectedCoverage.value
        const matchesQuery = !normalizedQuery || [
          entry.name,
          entry.component.title,
          entry.component.description,
          packageLabels[entry.component.packageName],
          row.name,
          row.kindLabel,
          row.row.type,
          row.row.defaultValue,
          row.row.description,
          row.coverage.label,
          row.coverage.detail
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery))

        return matchesPackage && matchesKind && matchesCoverage && matchesQuery
      })

      return {
        ...entry,
        rows: matchingRows
      }
    })
    .filter((entry) => entry.rows.length > 0)
})

function countRows(api: ComponentApi) {
  return apiKinds.reduce((total, key) => {
    return total + (api[key as keyof ComponentApi]?.length || 0)
  }, 0)
}

function normalizeAnchorToken(value: string) {
  return value
    .replace(/^@/, '')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function createApiRowEntry(docs: string, kind: ApiKind, row: ApiRow): ApiRowEntry {
  const coverage = getApiLiveCoverageForRow(docs, kind, row)
  const rowAnchor = `api-${kind}-${normalizeAnchorToken(row.name)}`

  return {
    key: `${docs}-${kind}-${row.name}`,
    name: row.name,
    kind,
    kindLabel: kindLabels[kind],
    row,
    coverage,
    rowHref: `${docs}#${rowAnchor}`,
    evidenceHref: `${docs}${coverage.href}`
  }
}

const totalRowCount = computed(() => apiEntries.value.reduce((total, entry) => total + entry.rows.length, 0))
const shownRowCount = computed(() => filteredEntries.value.reduce((total, entry) => total + entry.rows.length, 0))
const coveredRowCount = computed(() =>
  apiEntries.value.reduce((total, entry) => total + entry.rows.filter((row) => row.coverage.status === 'covered').length, 0)
)
const sourceOnlyRowCount = computed(() =>
  apiEntries.value.reduce((total, entry) => total + entry.rows.filter((row) => row.coverage.status === 'partial').length, 0)
)
const missingRowCount = computed(() =>
  apiEntries.value.reduce((total, entry) => total + entry.rows.filter((row) => row.coverage.status === 'missing').length, 0)
)
const coverageRate = computed(() => Math.round((coveredRowCount.value / Math.max(totalRowCount.value, 1)) * 100))
const packageOptions = computed(() => [
  {
    value: 'all' as const,
    label: 'All packages',
    count: totalRowCount.value
  },
  ...componentPackages.map((packageName) => ({
    value: packageName,
    label: packageLabels[packageName],
    count: apiEntries.value
      .filter((entry) => entry.component.packageName === packageName)
      .reduce((total, entry) => total + entry.rows.length, 0)
  }))
])
const activeFilterCount = computed(() => [
  query.value.trim(),
  selectedKind.value !== 'all',
  selectedCoverage.value !== 'all',
  selectedPackage.value !== 'all'
].filter(Boolean).length)
const hasActiveFilters = computed(() => activeFilterCount.value > 0)
const filterShareHref = computed(() => createFilterHref(true))

function createFilterParams() {
  const params = new URLSearchParams()
  const normalizedQuery = query.value.trim()

  if (normalizedQuery) {
    params.set('api-q', normalizedQuery)
  }

  if (selectedKind.value !== 'all') {
    params.set('api-kind', selectedKind.value)
  }

  if (selectedCoverage.value !== 'all') {
    params.set('api-coverage', selectedCoverage.value)
  }

  if (selectedPackage.value !== 'all') {
    params.set('api-package', selectedPackage.value)
  }

  return params
}

function createFilterHref(absolute = false) {
  const params = createFilterParams()
  const path = '/resources/api-reference'
  const queryString = params.toString()
  const href = queryString ? `${path}?${queryString}` : path

  if (!absolute || typeof window === 'undefined') {
    return href
  }

  return `${window.location.origin}${href}`
}

function syncFilterUrl() {
  if (typeof window === 'undefined') {
    return
  }

  const href = createFilterHref(false)
  const currentHref = `${window.location.pathname}${window.location.search}`

  if (currentHref !== href) {
    window.history.replaceState(null, '', href)
  }
}

function resetFilters() {
  query.value = ''
  selectedKind.value = 'all'
  selectedCoverage.value = 'all'
  selectedPackage.value = 'all'
}

async function copyCurrentFilterLink() {
  copiedFilterLink.value = true
  window.setTimeout(() => {
    copiedFilterLink.value = false
  }, 1200)

  await writeClipboardText(filterShareHref.value)
}

async function writeClipboardText(text: string) {
  const clipboard = globalThis.navigator?.clipboard

  if (clipboard?.writeText) {
    let clipboardWrite: Promise<void> | void

    try {
      clipboardWrite = clipboard.writeText(text)
    } catch {
      clipboardWrite = undefined
    }

    const wroteWithClipboard = await Promise.race([
      Promise.resolve(clipboardWrite).then(() => true).catch(() => false),
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), clipboardWriteTimeoutMs)
      })
    ])

    if (wroteWithClipboard) {
      return
    }
  }

  const textarea = document.createElement('textarea')

  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.inset = '0 auto auto 0'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    document.execCommand?.('copy')
  } finally {
    textarea.remove()
  }
}

watch([query, selectedKind, selectedCoverage, selectedPackage], syncFilterUrl)
</script>

<template>
  <section class="api-reference-explorer" aria-label="API reference explorer">
    <div class="api-reference-explorer__toolbar">
      <div>
        <p class="docs-eyebrow">api data center</p>
        <h2>结构化 API 数据中心</h2>
        <p>统一查看已迁移组件的 props、events、slots、methods 和 types，并把每一行 API 反链到组件页与 Live Example 证据。</p>
      </div>
      <label>
        <span>Search API rows</span>
        <input v-model="query" type="search" placeholder="Search prop, event, slot, type, component..." />
      </label>
      <div class="catalog-segments" aria-label="API kind filter">
        <button type="button" :class="{ active: selectedKind === 'all' }" @click="selectedKind = 'all'">All</button>
        <button v-for="kind in apiKinds" :key="kind" type="button" :class="{ active: selectedKind === kind }" @click="selectedKind = kind">
          {{ kindLabels[kind] }}
        </button>
      </div>
      <div class="api-reference-explorer__package-filter" aria-label="Package filter">
        <button
          v-for="item in packageOptions"
          :key="item.value"
          type="button"
          :class="{ active: selectedPackage === item.value }"
          @click="selectedPackage = item.value"
        >
          <span>{{ item.label }}</span>
          <small>{{ item.count }}</small>
        </button>
      </div>
      <div class="catalog-segments" aria-label="Live evidence filter">
        <button type="button" :class="{ active: selectedCoverage === 'all' }" @click="selectedCoverage = 'all'">All evidence</button>
        <button type="button" :class="{ active: selectedCoverage === 'covered' }" @click="selectedCoverage = 'covered'">Covered</button>
        <button type="button" :class="{ active: selectedCoverage === 'partial' }" @click="selectedCoverage = 'partial'">Source only</button>
        <button type="button" :class="{ active: selectedCoverage === 'missing' }" @click="selectedCoverage = 'missing'">Needs live</button>
      </div>
      <div class="api-reference-explorer__actions" aria-label="API filter actions">
        <a class="api-reference-explorer__share" :href="filterShareHref">打开当前筛选链接</a>
        <button type="button" class="api-reference-explorer__copy" @click="copyCurrentFilterLink">
          {{ copiedFilterLink ? '已复制链接' : '复制当前筛选链接' }}
        </button>
        <button
          type="button"
          class="api-reference-explorer__reset"
          :disabled="!hasActiveFilters"
          @click="resetFilters"
        >
          重置筛选<span v-if="activeFilterCount"> · {{ activeFilterCount }}</span>
        </button>
      </div>
    </div>

    <div class="api-reference-explorer__summary" aria-label="API reference summary">
      <span><strong>{{ totalRowCount }}</strong> API rows</span>
      <span><strong>{{ coverageRate }}%</strong> live covered</span>
      <span><strong>{{ coveredRowCount }}</strong> covered</span>
      <span><strong>{{ sourceOnlyRowCount }}</strong> source only</span>
      <span><strong>{{ missingRowCount }}</strong> needs live</span>
      <span><strong>{{ shownRowCount }}</strong> shown</span>
    </div>

    <div v-if="filteredEntries.length" class="api-reference-explorer__grid">
      <article v-for="entry in filteredEntries" :key="entry.name" class="docs-card">
        <div class="api-reference-explorer__card-heading">
          <div>
            <h3>{{ entry.component.title }}</h3>
            <p>{{ entry.component.description }}</p>
          </div>
          <span class="api-reference-explorer__rate">{{ entry.coverageRate }}%</span>
        </div>
        <div class="component-pills">
          <a :href="entry.component.docs">{{ entry.name }}</a>
          <span>{{ packageLabels[entry.component.packageName] }}</span>
          <span>{{ countRows(entry.api) }} rows</span>
          <span>{{ entry.rows.length }} shown</span>
        </div>
        <div class="api-reference-explorer__counts">
          <span>Props {{ entry.api.props?.length || 0 }}</span>
          <span>Events {{ entry.api.events?.length || 0 }}</span>
          <span>Slots {{ entry.api.slots?.length || 0 }}</span>
          <span>Methods {{ entry.api.methods?.length || 0 }}</span>
          <span>Types {{ entry.api.types?.length || 0 }}</span>
        </div>
        <div class="api-reference-explorer__rows" aria-label="API rows">
          <a
            v-for="row in entry.rows.slice(0, 8)"
            :key="row.key"
            class="api-reference-explorer__row"
            :href="row.rowHref"
          >
            <span>
              <em>{{ row.kindLabel }}</em>
              <code>{{ row.name }}</code>
            </span>
            <small>{{ row.row.description }}</small>
            <strong :data-status="row.coverage.status">{{ row.coverage.label }}</strong>
          </a>
          <a
            v-if="entry.rows.length > 8"
            class="api-reference-explorer__more"
            :href="entry.component.docs"
          >
            查看组件页其余 {{ entry.rows.length - 8 }} 行
          </a>
        </div>
        <div class="api-reference-explorer__evidence-links" aria-label="Live evidence links">
          <a
            v-for="row in entry.rows.slice(0, 3)"
            :key="`${row.key}-evidence`"
            :href="row.evidenceHref"
            :data-status="row.coverage.status"
          >
            {{ row.name }} · {{ coverageLabels[row.coverage.status] }}
          </a>
        </div>
      </article>
    </div>
    <div v-else class="component-empty-state" role="status">
      <strong>没有匹配的 API 行</strong>
      <span>换一个关键词，或切回 All evidence / All 分类继续浏览。</span>
    </div>
  </section>
</template>
