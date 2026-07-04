<script setup lang="ts">
import { YBadge } from '@yok-ui/core'

defineOptions({
  name: 'YDataToolbar'
})

interface Props {
  title?: string
  description?: string
  count?: number
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  count: undefined
})
</script>

<template>
  <section class="yok-data-toolbar">
    <div class="yok-data-toolbar__copy">
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
    <YBadge v-if="typeof count === 'number'" :value="count" />
    <div v-if="$slots.default" class="yok-data-toolbar__actions">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.yok-data-toolbar {
  display: flex;
  align-items: center;
  gap: var(--yok-space-3);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  padding: var(--yok-space-4);
}

.yok-data-toolbar__copy {
  min-width: 0;
  margin-right: auto;
}

.yok-data-toolbar h2,
.yok-data-toolbar p {
  margin: 0;
}

.yok-data-toolbar h2 {
  color: var(--yok-color-text);
  font-size: 18px;
  letter-spacing: 0;
}

.yok-data-toolbar p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-data-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--yok-space-2);
}

@media (max-width: 720px) {
  .yok-data-toolbar {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .yok-data-toolbar__actions {
    justify-content: flex-start;
    width: 100%;
  }
}
</style>
