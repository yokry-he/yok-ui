<script setup lang="ts">
interface InteractionContractSummary {
  label: string
  value: string
  detail: string
}

interface InteractionContractCheck {
  label: string
  value: string
  detail: string
}

defineProps<{
  summary: InteractionContractSummary
  checks: readonly InteractionContractCheck[]
  hasContract: boolean
}>()
</script>

<template>
  <section
    class="live-example-runner__contract"
    id="live-example-interaction-contract"
    :data-has-contract="hasContract ? 'true' : 'false'"
    aria-label="Interaction contract evidence"
  >
    <header class="live-example-runner__contract-header">
      <div>
        <span class="live-example-runner__contract-eyebrow">Interaction contract</span>
        <strong>{{ summary.label }}</strong>
      </div>
      <span>{{ summary.value }}</span>
    </header>
    <p>{{ summary.detail }}</p>
    <div v-if="hasContract" class="live-example-runner__contract-grid">
      <article
        v-for="check in checks"
        :key="check.label"
        class="live-example-runner__contract-check"
      >
        <span>{{ check.label }}</span>
        <strong>{{ check.value }}</strong>
        <small>{{ check.detail }}</small>
      </article>
    </div>
    <p v-else class="live-example-runner__contract-empty">
      先在 interactionContracts 中登记键盘、焦点、语义、文档和测试证据，再把当前示例提升为可发布验收状态。
    </p>
  </section>
</template>
