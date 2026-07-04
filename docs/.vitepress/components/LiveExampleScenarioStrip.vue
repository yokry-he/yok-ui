<script setup lang="ts">
import type { LiveExampleScenario, LiveExampleScenarioKind } from '../data/liveExamples'

interface Props {
  scenarios: readonly LiveExampleScenario[]
  activeScenarioKey?: string
  activeScenarioLabel?: string
  scenarioKindLabels: Record<LiveExampleScenarioKind, string>
  copiedScenarioLink: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activeScenarioKey: '',
  activeScenarioLabel: ''
})

const emit = defineEmits<{
  'copy-scenario-link': []
  'apply-scenario': [scenario: LiveExampleScenario]
}>()

function isScenarioActive(scenario: LiveExampleScenario) {
  return scenario.key === props.activeScenarioKey
}
</script>

<template>
  <section
    id="live-example-scenarios"
    class="live-example-runner__scenario-strip"
    aria-label="Workflow scenario switcher"
  >
    <header>
      <div class="live-example-runner__scenario-heading">
        <span class="live-example-runner__scenario-eyebrow">Scenario matrix</span>
        <strong class="live-example-runner__scenario-title">{{ scenarios.length }} 个真实场景</strong>
      </div>
      <p class="live-example-runner__scenario-description">
        点击场景会同步更新属性面板、源码和预览，便于像主流组件库一样对比边界状态。
      </p>
      <div class="live-example-runner__scenario-actions" aria-live="polite">
        <span v-if="activeScenarioLabel" class="live-example-runner__scenario-current">当前：{{ activeScenarioLabel }}</span>
        <span v-else class="live-example-runner__scenario-current">选择场景后可分享</span>
        <button
          type="button"
          class="live-example-runner__scenario-copy"
          :disabled="!activeScenarioLabel"
          @click="emit('copy-scenario-link')"
        >
          {{ copiedScenarioLink ? '已复制链接' : '复制场景链接' }}
        </button>
      </div>
    </header>
    <div class="live-example-runner__scenario-grid">
      <button
        v-for="scenario in scenarios"
        :key="scenario.key"
        type="button"
        :aria-pressed="isScenarioActive(scenario) ? 'true' : 'false'"
        @click="emit('apply-scenario', scenario)"
      >
        <em>{{ scenarioKindLabels[scenario.kind] }}</em>
        <strong>{{ scenario.label }}</strong>
        <span>{{ scenario.description }}</span>
      </button>
    </div>
  </section>
</template>
