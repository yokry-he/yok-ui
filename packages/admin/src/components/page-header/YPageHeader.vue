<script setup lang="ts">
import { YTag } from '@yok-ui/core'

defineOptions({
  name: 'YPageHeader'
})

interface Props {
  title: string
  description?: string
  eyebrow?: string
  status?: string
  headingLevel?: 1 | 2 | 3
}

withDefaults(defineProps<Props>(), {
  description: '',
  eyebrow: '',
  status: '',
  headingLevel: 1
})
</script>

<template>
  <header class="yok-page-header">
    <div class="yok-page-header__copy">
      <p v-if="eyebrow" class="yok-page-header__eyebrow">{{ eyebrow }}</p>
      <div class="yok-page-header__title-row">
        <component
          :is="`h${headingLevel}`"
          class="yok-page-header__title"
        >
          {{ title }}
        </component>
        <YTag v-if="status" tone="info">{{ status }}</YTag>
      </div>
      <p v-if="description" class="yok-page-header__description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="yok-page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.yok-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-5);
  min-width: 0;
}

.yok-page-header__copy {
  min-width: 0;
}

.yok-page-header__eyebrow,
.yok-page-header__description,
.yok-page-header__title {
  margin: 0;
}

.yok-page-header__eyebrow {
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.yok-page-header__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-3);
  margin-top: var(--yok-space-2);
}

.yok-page-header__title {
  color: var(--yok-color-text);
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.08;
  letter-spacing: 0;
}

.yok-page-header__description {
  max-width: 720px;
  margin-top: var(--yok-space-3);
  color: var(--yok-color-textMuted);
  line-height: 1.75;
}

.yok-page-header__actions {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--yok-space-2);
}

@media (max-width: 720px) {
  .yok-page-header {
    display: grid;
  }

  .yok-page-header__actions {
    justify-content: flex-start;
  }
}
</style>
