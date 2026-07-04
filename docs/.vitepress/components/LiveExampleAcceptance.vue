<script setup lang="ts">
import type { LiveExampleValidationSummary } from '../data/liveExamples'

defineProps<{
  summary: LiveExampleValidationSummary
}>()
</script>

<template>
  <section id="live-example-acceptance" class="live-example-runner__acceptance" aria-label="Live example acceptance checks">
    <header class="live-example-runner__acceptance-header">
      <div>
        <span class="live-example-runner__acceptance-eyebrow">Live acceptance</span>
        <strong>{{ summary.modeLabel }}</strong>
      </div>
      <div class="live-example-runner__acceptance-meta">
        <span>{{ summary.capabilityCount }} capabilities</span>
        <span>{{ summary.scenarioCount }} scenes</span>
      </div>
    </header>
    <ul class="live-example-runner__acceptance-list">
      <li
        v-for="check in summary.checks"
        :key="check.key"
        class="live-example-runner__acceptance-check"
        :data-check-key="check.key"
        :data-passed="check.passed ? 'true' : 'false'"
      >
        <span class="live-example-runner__acceptance-state">
          {{ check.passed ? 'Pass' : 'Gap' }}
        </span>
        <strong>{{ check.label }}</strong>
        <small>{{ check.detail }}</small>
      </li>
    </ul>
  </section>
</template>
