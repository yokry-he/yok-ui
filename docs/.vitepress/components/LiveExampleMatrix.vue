<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getLiveExampleMatrixSummary,
  type LiveExampleMatrixRow
} from '../data/liveExamples'

const matrix = computed(() => getLiveExampleMatrixSummary())
const activePackage = ref('all')

const packageFilters = computed(() => [
  {
    label: 'All packages',
    value: 'all',
    count: matrix.value.total
  },
  ...matrix.value.packageGroups.map((group) => ({
    label: group.packageName,
    value: group.packageName,
    count: group.count
  }))
])

const activePackageLabel = computed(() =>
  packageFilters.value.find((filter) => filter.value === activePackage.value)?.label ?? 'All packages'
)

const visibleRows = computed(() => {
  if (activePackage.value === 'all') {
    return matrix.value.rows
  }

  return matrix.value.rows.filter((row) => row.packageName === activePackage.value)
})

const visibleAttentionRows = computed(() => {
  if (activePackage.value === 'all') {
    return matrix.value.attentionRows.slice(0, 8)
  }

  return matrix.value.attentionRows
    .filter((row) => row.packageName === activePackage.value)
    .slice(0, 8)
})

const visibleStats = computed(() => {
  const rows = visibleRows.value
  const scenarioCount = rows.reduce((sum, row) => sum + row.scenarioCount, 0)
  const averageScore = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length)
    : 0

  return [
    {
      label: 'examples',
      value: String(rows.length),
      detail: `${matrix.value.guidedCount}/${matrix.value.total} guided examples`
    },
    {
      label: 'workflow ready',
      value: String(rows.filter((row) => row.workflowReady).length),
      detail: 'Scenario matrix and workflow states are connected.'
    },
    {
      label: 'scenario states',
      value: String(scenarioCount),
      detail: 'Registered live example states across visible rows.'
    },
    {
      label: 'avg score',
      value: `${averageScore}%`,
      detail: 'Passed live example gates across visible rows.'
    }
  ]
})

function formatScenarioKinds(row: LiveExampleMatrixRow) {
  return row.scenarioKinds.length ? row.scenarioKinds.join(' / ') : 'props only'
}
</script>

<template>
  <section id="live-example" class="live-example-matrix" aria-label="Live example matrix">
    <div class="live-example-matrix__hero docs-panel">
      <div>
        <p class="docs-eyebrow">live example quality</p>
        <h2>Live Example Matrix</h2>
        <p>
          按 package 汇总每个组件示例的 props 控件、workflow 场景、复现导出、响应式和键盘路径，
          让组件文档不只“能展示”，还可以被持续验收。
        </p>
      </div>
      <div class="live-example-matrix__score">
        <strong>{{ matrix.averageScore }}%</strong>
        <span>overall gate score</span>
      </div>
    </div>

    <ul class="live-example-matrix__metrics" aria-label="Live example metrics">
      <li v-for="stat in visibleStats" :key="stat.label">
        <span>{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
        <small>{{ stat.detail }}</small>
      </li>
    </ul>

    <nav class="live-example-matrix__filters" aria-label="Live example package filters">
      <button
        v-for="filter in packageFilters"
        :key="filter.value"
        type="button"
        class="live-example-matrix__package-filter"
        :aria-pressed="activePackage === filter.value ? 'true' : 'false'"
        @click="activePackage = filter.value"
      >
        <span>{{ filter.label }}</span>
        <strong>{{ filter.count }}</strong>
      </button>
    </nav>

    <div class="live-example-matrix__layout">
      <section class="live-example-matrix__table docs-card" :aria-label="`Live example table filtered by ${activePackageLabel}`">
        <header class="live-example-matrix__section-header">
          <div>
            <p class="docs-eyebrow">coverage table</p>
            <h3>{{ activePackageLabel }}</h3>
          </div>
          <span>{{ visibleRows.length }} rows</span>
        </header>
        <div class="live-example-matrix__rows">
          <article v-for="row in visibleRows" :key="row.preset" class="live-example-matrix__row">
            <div class="live-example-matrix__row-main">
              <strong>{{ row.title }}</strong>
              <span>{{ row.componentName }} · {{ row.packageName }}</span>
              <small>{{ row.familyTitle }} · {{ row.modeLabel }}</small>
            </div>
            <div class="live-example-matrix__row-score">
              <strong>{{ row.score }}%</strong>
              <span>{{ row.passedCheckCount }}/{{ row.totalCheckCount }} gates</span>
            </div>
            <div class="live-example-matrix__row-scenarios">
              <strong>{{ row.scenarioCount }} scenarios</strong>
              <span>{{ formatScenarioKinds(row) }}</span>
            </div>
            <a class="live-example-matrix__row-link" :href="row.handoffHref">
              {{ row.docs }}#live-example
            </a>
          </article>
        </div>
      </section>

      <aside class="live-example-matrix__queue docs-card" aria-label="Live example review queue">
        <header class="live-example-matrix__section-header">
          <div>
            <p class="docs-eyebrow">Needs review</p>
            <h3>Lowest-scoring examples</h3>
          </div>
        </header>
        <ol class="live-example-matrix__queue-list">
          <li v-for="row in visibleAttentionRows" :key="row.preset">
            <a :href="row.handoffHref">{{ row.componentName }}</a>
            <strong>{{ row.score }}%</strong>
            <span>{{ row.missingChecks.slice(0, 3).join(' / ') || 'Workflow review' }}</span>
          </li>
        </ol>
      </aside>
    </div>
  </section>
</template>
