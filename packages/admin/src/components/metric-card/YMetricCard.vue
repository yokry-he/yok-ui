<script setup lang="ts">
import { YTag } from '@yok-ui/core'

defineOptions({
  name: 'YMetricCard'
})

interface Props {
  label: string
  value: string | number
  description?: string
  trend?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  description: '',
  trend: '',
  tone: 'info'
})
</script>

<template>
  <article class="yok-metric-card">
    <div class="yok-metric-card__top">
      <span>{{ label }}</span>
      <YTag v-if="trend" :tone="tone">{{ trend }}</YTag>
    </div>
    <strong>{{ value }}</strong>
    <p v-if="description">{{ description }}</p>
  </article>
</template>

<style scoped>
.yok-metric-card {
  display: grid;
  gap: var(--yok-space-3);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-4);
}

.yok-metric-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
}

.yok-metric-card__top > span {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 750;
}

.yok-metric-card strong {
  color: var(--yok-color-text);
  font-size: 34px;
  line-height: 1;
  letter-spacing: 0;
}

.yok-metric-card p {
  margin: 0;
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}
</style>
