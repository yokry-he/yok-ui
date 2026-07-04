<script setup lang="ts">
import { computed } from 'vue'

interface RunEvidenceItem {
  key: string
  label: string
  value: string
  detail: string
  passed: boolean
}

const props = defineProps<{
  items: readonly RunEvidenceItem[]
}>()

const passedCount = computed(() => props.items.filter((item) => item.passed).length)
</script>

<template>
  <section class="live-example-runner__run-evidence" aria-label="Live example run evidence">
    <header class="live-example-runner__run-evidence-header">
      <div>
        <span class="live-example-runner__run-evidence-eyebrow">Run evidence</span>
        <strong>{{ passedCount }}/{{ items.length }} checks ready</strong>
      </div>
      <p>当前示例的运行状态、场景、API、覆盖度、可访问性和导出能力会随操作同步。</p>
    </header>
    <ul class="live-example-runner__run-evidence-grid">
      <li
        v-for="item in items"
        :key="item.key"
        class="live-example-runner__run-evidence-item"
        :data-passed="item.passed ? 'true' : 'false'"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.detail }}</small>
      </li>
    </ul>
  </section>
</template>
