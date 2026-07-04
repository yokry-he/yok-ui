<script setup lang="ts">
defineOptions({
  name: 'YFeatureGrid'
})

export interface YFeatureItem {
  title: string
  description: string
  meta?: string
}

interface Props {
  features: YFeatureItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="yok-feature-grid">
    <article v-for="feature in features" :key="feature.title" class="yok-feature-grid__item">
      <span v-if="feature.meta">{{ feature.meta }}</span>
      <h3>{{ feature.title }}</h3>
      <p>{{ feature.description }}</p>
    </article>
  </div>
</template>

<style scoped>
.yok-feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--yok-space-4);
}

.yok-feature-grid__item {
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-5);
}

.yok-feature-grid__item span {
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 850;
}

.yok-feature-grid__item h3,
.yok-feature-grid__item p {
  margin: 0;
}

.yok-feature-grid__item h3 {
  margin-top: var(--yok-space-3);
  color: var(--yok-color-text);
  font-size: 20px;
  letter-spacing: 0;
}

.yok-feature-grid__item p {
  margin-top: var(--yok-space-2);
  color: var(--yok-color-textMuted);
  line-height: 1.7;
}

@media (max-width: 860px) {
  .yok-feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
