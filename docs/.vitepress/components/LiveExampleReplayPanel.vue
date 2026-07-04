<script setup lang="ts">
interface ReplayEvidenceItem {
  key: string
  label: string
  value: string
  detail: string
  passed: boolean
}

interface ReplayStep {
  key: string
  label: string
  detail: string
  passed: boolean
}

defineProps<{
  eventCount: number
  copiedEventRepro: boolean
  evidenceItems: readonly ReplayEvidenceItem[]
  steps: readonly ReplayStep[]
}>()

defineEmits<{
  'copy-event-repro': []
}>()
</script>

<template>
  <section class="live-example-runner__replay" aria-label="Interaction replay evidence">
    <header class="live-example-runner__replay-header">
      <div>
        <span>Interaction replay</span>
        <strong>{{ eventCount ? `${eventCount} events ready` : 'Waiting for event' }}</strong>
      </div>
      <button
        type="button"
        class="live-example-runner__replay-copy"
        :disabled="eventCount === 0"
        @click="$emit('copy-event-repro')"
      >
        {{ copiedEventRepro ? '已复制复现' : '复制 replay manifest' }}
      </button>
    </header>
    <ul class="live-example-runner__replay-grid">
      <li
        v-for="item in evidenceItems"
        :key="item.key"
        :data-passed="item.passed ? 'true' : 'false'"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.detail }}</small>
      </li>
    </ul>
    <ol class="live-example-runner__replay-steps">
      <li
        v-for="step in steps"
        :key="step.key"
        :data-passed="step.passed ? 'true' : 'false'"
      >
        <strong>{{ step.label }}</strong>
        <span>{{ step.detail }}</span>
      </li>
    </ol>
  </section>
</template>
