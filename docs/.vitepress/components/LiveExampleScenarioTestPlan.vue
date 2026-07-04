<script setup lang="ts">
interface ScenarioTestStep {
  title: string
  detail: string
}

defineProps<{
  title: string
  steps: readonly ScenarioTestStep[]
  copied: boolean
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <section id="live-example-test-plan" class="live-example-runner__test-plan" aria-label="Scenario verification plan">
    <header class="live-example-runner__test-plan-header">
      <div>
        <span class="live-example-runner__test-plan-eyebrow">Scenario test plan</span>
        <strong>{{ title }}</strong>
      </div>
      <button type="button" class="live-example-runner__test-plan-copy" @click="emit('copy')">
        {{ copied ? '已复制步骤' : '复制验收步骤' }}
      </button>
    </header>
    <ol class="live-example-runner__test-plan-list">
      <li v-for="step in steps" :key="step.title">
        <strong>{{ step.title }}</strong>
        <span>{{ step.detail }}</span>
      </li>
    </ol>
  </section>
</template>
