<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'
import { getApiLiveCoverageForRow, type ApiLiveCoverage } from '../data/apiLiveCoverage'
import type { ApiRow } from '../data/componentRegistry'

type ApiKind = 'props' | 'slots' | 'events' | 'methods' | 'types'

const props = withDefaults(defineProps<{
  rows?: ApiRow[]
  kind?: ApiKind
  title?: string
  searchable?: boolean
  anchorId?: string
  aliases?: string[]
  liveExampleHref?: string
}>(), {
  rows: () => [],
  kind: 'props',
  title: '',
  searchable: true,
  anchorId: '',
  aliases: () => [],
  liveExampleHref: '#live-example'
})

const query = ref('')
const copiedMarkdown = ref(false)
const copyFailed = ref(false)
const route = useRoute()

const kindLabels: Record<ApiKind, { title: string; firstColumn: string; empty: string }> = {
  props: {
    title: 'Props',
    firstColumn: 'Prop',
    empty: '当前组件暂未登记 props。'
  },
  events: {
    title: 'Events',
    firstColumn: 'Event',
    empty: '当前组件暂未登记 events。'
  },
  methods: {
    title: 'Methods',
    firstColumn: 'Method',
    empty: '当前组件暂未登记 methods。'
  },
  slots: {
    title: 'Slots',
    firstColumn: 'Slot',
    empty: '当前组件暂未登记 slots。'
  },
  types: {
    title: 'Types',
    firstColumn: 'Name',
    empty: '当前组件暂未登记 types。'
  }
}

const apiTitle = computed(() => props.title || kindLabels[props.kind].title)
const apiAnchorId = computed(() => props.anchorId || `api-${props.kind}`)
const normalizedQuery = computed(() => query.value.trim().toLowerCase())
const filteredRows = computed(() => {
  if (!normalizedQuery.value) {
    return props.rows
  }

  return props.rows.filter((row) => {
    return [row.name, row.type, row.defaultValue, row.description]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedQuery.value))
    })
})
const markdownColumns = computed(() => {
  const columns = [kindLabels[props.kind].firstColumn, 'Type']

  if (props.kind === 'props') {
    columns.push('Default')
  }

  columns.push('Description')
  return columns
})
const apiMarkdown = computed(() => {
  const heading = `### ${apiTitle.value} API`

  if (!filteredRows.value.length) {
    return `${heading}\n\nNo API rows.`
  }

  const header = `| ${markdownColumns.value.join(' | ')} |`
  const divider = `| ${markdownColumns.value.map(() => '---').join(' | ')} |`
  const body = filteredRows.value.map((row) => {
    const cells = [
      formatMarkdownCode(row.name),
      formatMarkdownCode(row.type)
    ]

    if (props.kind === 'props') {
      cells.push(formatMarkdownCode(row.defaultValue ?? '-'))
    }

    cells.push(escapeMarkdownCell(row.description))
    return `| ${cells.join(' | ')} |`
  })

  return [heading, '', header, divider, ...body].join('\n')
})

function normalizeAnchorToken(value: string) {
  return value
    .replace(/^@/, '')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function getRowAnchorId(row: ApiRow) {
  return `${apiAnchorId.value}-${normalizeAnchorToken(row.name)}`
}

function getRowAnchorAliases(row: ApiRow) {
  const rowToken = normalizeAnchorToken(row.name)

  return props.aliases.map((alias) => `${alias}-${rowToken}`)
}

function getRowCoverage(row: ApiRow) {
  return getApiLiveCoverageForRow(route.path, props.kind, row)
}

function escapeMarkdownCell(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>')
}

function formatMarkdownCode(value: string) {
  return `\`${escapeMarkdownCell(value)}\``
}

async function writeClipboardText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Some embedded browsers expose Clipboard API but block writes without
      // a native permission prompt. Fall back to the legacy selection flow.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'readonly')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus({ preventScroll: true })
  textarea.select()

  try {
    document.execCommand('copy')
    return true
  } finally {
    document.body.removeChild(textarea)
  }
}

async function copyMarkdown() {
  copyFailed.value = false
  try {
    copiedMarkdown.value = await writeClipboardText(apiMarkdown.value)
    copyFailed.value = !copiedMarkdown.value
  } catch {
    copiedMarkdown.value = false
    copyFailed.value = true
  }

  window.setTimeout(() => {
    copiedMarkdown.value = false
    copyFailed.value = false
  }, 1400)
}

function openCoverageEvidence(coverage: ApiLiveCoverage, event: MouseEvent) {
  if (!coverage.scenario || typeof window === 'undefined') {
    return
  }

  event.preventDefault()
  window.history.replaceState(null, '', coverage.href)
  window.dispatchEvent(new CustomEvent('yok-ui:live-example-scenario', {
    detail: {
      scenarioKey: coverage.scenario.key
    }
  }))
  document.getElementById('live-example')?.scrollIntoView?.({ block: 'start' })
}
</script>

<template>
  <section class="api-table" :id="apiAnchorId" :aria-label="apiTitle">
    <span
      v-for="alias in aliases"
      :id="alias"
      :key="alias"
      class="api-table__anchor-alias"
      aria-hidden="true"
    />
    <div class="api-table__header">
      <div>
        <p class="api-table__eyebrow">API {{ kind }}</p>
        <h3>{{ apiTitle }}</h3>
      </div>
      <div class="api-table__meta" aria-label="API rows">
        <span>{{ rows.length }} total</span>
        <span v-if="query">{{ filteredRows.length }} shown</span>
        <button type="button" class="api-table__copy-markdown" @click="copyMarkdown">
          {{ copiedMarkdown ? '已复制 Markdown' : copyFailed ? '复制失败' : '复制 Markdown' }}
        </button>
        <a v-if="liveExampleHref" class="api-table__live-link" :href="liveExampleHref">Live example</a>
      </div>
      <label v-if="searchable && rows.length > 4" class="api-table__search">
        <span>Search {{ apiTitle }}</span>
        <input v-model="query" type="search" :placeholder="`Search ${apiTitle.toLowerCase()}...`" />
      </label>
    </div>

    <div v-if="rows.length && filteredRows.length" class="docs-table-wrap api-table__wrap">
    <table>
      <thead>
        <tr>
          <th>{{ kindLabels[kind].firstColumn }}</th>
          <th>Type</th>
          <th v-if="kind === 'props'">Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredRows" :id="getRowAnchorId(row)" :key="row.name" class="api-table__row">
          <td class="api-table__name">
            <span
              v-for="alias in getRowAnchorAliases(row)"
              :id="alias"
              :key="alias"
              class="api-table__anchor-alias"
              aria-hidden="true"
            />
            <code>{{ row.name }}</code>
            <span v-if="row.required" class="docs-required">required</span>
            <a class="api-table__row-anchor" :href="`#${getRowAnchorId(row)}`" :aria-label="`Link to ${row.name}`">#</a>
            <a
              class="api-table__coverage"
              :data-status="getRowCoverage(row).status"
              :data-scenario="getRowCoverage(row).scenario?.key"
              :href="getRowCoverage(row).href"
              :title="getRowCoverage(row).detail"
              :aria-label="`${row.name}: ${getRowCoverage(row).detail}`"
              @click="openCoverageEvidence(getRowCoverage(row), $event)"
            >
              {{ getRowCoverage(row).label }}
            </a>
          </td>
          <td class="api-table__type"><code>{{ row.type }}</code></td>
          <td v-if="kind === 'props'" class="api-table__default">
            <code>{{ row.defaultValue ?? '-' }}</code>
          </td>
          <td class="api-table__description">{{ row.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
    <div v-else class="api-table__empty" role="status">
      <strong>{{ rows.length ? '没有匹配的 API 行' : kindLabels[kind].empty }}</strong>
      <span>{{ rows.length ? '换一个关键词，或清空搜索继续查看。' : '后续补充结构化 API 数据后会自动显示。' }}</span>
    </div>
  </section>
</template>
