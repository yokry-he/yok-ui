<script setup lang="ts">
interface ScenarioCoverageSummary {
  coveredCount: number
  totalCount: number
  score: number
  scenarioCount: number
}

interface ScenarioCoverageItem {
  kind: string
  label: string
  count: number
  passed: boolean
  detail: string
}

defineProps<{
  summary: ScenarioCoverageSummary
  items: readonly ScenarioCoverageItem[]
  copied: boolean
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <section id="live-example-scenario-coverage" class="live-example-runner__coverage" aria-label="Live example scenario coverage">
    <header class="live-example-runner__coverage-header">
      <div>
        <span class="live-example-runner__coverage-eyebrow">Example coverage</span>
        <strong>{{ summary.score }}% scenario kind coverage</strong>
        <p>
          {{ summary.coveredCount }}/{{ summary.totalCount }}
          个场景类型已覆盖，当前组件登记了 {{ summary.scenarioCount }} 个示例状态。
        </p>
      </div>
      <button type="button" class="live-example-runner__coverage-copy" @click="emit('copy')">
        {{ copied ? '已复制清单' : '复制覆盖清单' }}
      </button>
    </header>
    <ul class="live-example-runner__coverage-grid">
      <li
        v-for="item in items"
        :key="item.kind"
        class="live-example-runner__coverage-item"
        :data-covered="item.passed ? 'true' : 'false'"
      >
        <span class="live-example-runner__coverage-state">
          {{ item.passed ? 'Covered' : 'Gap' }}
        </span>
        <strong>{{ item.label }}</strong>
        <small>{{ item.count ? `${item.count} · ${item.detail}` : item.detail }}</small>
      </li>
    </ul>
  </section>
</template>
