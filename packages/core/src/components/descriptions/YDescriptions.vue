<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YDescriptions'
})

export type YDescriptionsLayout = 'horizontal' | 'vertical'
export type YDescriptionsSize = 'md' | 'sm'

export interface YDescriptionItem {
  label: string
  value?: string | number
  key?: string
  span?: number
  hidden?: boolean
}

interface Props {
  items: YDescriptionItem[]
  title?: string
  description?: string
  column?: number
  bordered?: boolean
  layout?: YDescriptionsLayout
  size?: YDescriptionsSize
  emptyText?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  column: 3,
  bordered: false,
  layout: 'horizontal',
  size: 'md',
  emptyText: 'No details yet',
  ariaLabel: 'Descriptions'
})

const visibleItems = computed(() => props.items.filter((item) => !item.hidden))
const normalizedColumn = computed(() => Math.max(1, Math.min(4, props.column)))

function getItemKey(item: YDescriptionItem, index: number) {
  return item.key || item.label || String(index)
}

function getSpan(item: YDescriptionItem) {
  return Math.max(1, Math.min(normalizedColumn.value, item.span ?? 1))
}
</script>

<template>
  <section
    class="yok-descriptions"
    :class="[
      `yok-descriptions--${layout}`,
      `yok-descriptions--${size}`,
      { 'yok-descriptions--bordered': bordered }
    ]"
    :aria-label="ariaLabel"
    :style="{ '--yok-descriptions-column': normalizedColumn }"
  >
    <header v-if="title || description || $slots.extra" class="yok-descriptions__header">
      <div class="yok-descriptions__copy">
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div v-if="$slots.extra" class="yok-descriptions__extra">
        <slot name="extra" />
      </div>
    </header>

    <dl v-if="visibleItems.length" class="yok-descriptions__list">
      <div
        v-for="(item, index) in visibleItems"
        :key="getItemKey(item, index)"
        class="yok-descriptions__item"
        :style="{ '--yok-descriptions-span': getSpan(item) }"
      >
        <dt class="yok-descriptions__label">{{ item.label }}</dt>
        <dd class="yok-descriptions__value">
          <slot
            :name="`item-${item.key || index}`"
            :item="item"
            :index="index"
          >
            {{ item.value ?? '-' }}
          </slot>
        </dd>
      </div>
    </dl>

    <p v-else class="yok-descriptions__empty" role="status">
      {{ emptyText }}
    </p>
  </section>
</template>

<style scoped>
.yok-descriptions {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-descriptions__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-descriptions__copy {
  min-width: 0;
}

.yok-descriptions h3,
.yok-descriptions p,
.yok-descriptions dl,
.yok-descriptions dd {
  margin: 0;
}

.yok-descriptions h3 {
  font-size: 18px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-descriptions__copy p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-descriptions__extra {
  flex: none;
}

.yok-descriptions__list {
  display: grid;
  grid-template-columns: repeat(var(--yok-descriptions-column), minmax(0, 1fr));
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-descriptions__item {
  grid-column: span min(var(--yok-descriptions-span), var(--yok-descriptions-column));
  display: grid;
  gap: var(--yok-space-1);
  min-width: 0;
  border-radius: var(--yok-radius-md);
}

.yok-descriptions__label {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
}

.yok-descriptions__value {
  min-width: 0;
  color: var(--yok-color-text);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.yok-descriptions--sm .yok-descriptions__list {
  gap: var(--yok-space-2);
}

.yok-descriptions--sm .yok-descriptions__label,
.yok-descriptions--sm .yok-descriptions__value {
  font-size: 13px;
}

.yok-descriptions--vertical .yok-descriptions__item {
  gap: var(--yok-space-2);
}

.yok-descriptions--bordered {
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-descriptions--bordered .yok-descriptions__header {
  border-bottom: 1px solid var(--yok-color-border);
  padding: var(--yok-space-4);
}

.yok-descriptions--bordered .yok-descriptions__list {
  gap: 0;
}

.yok-descriptions--bordered .yok-descriptions__item {
  border-right: 1px solid var(--yok-color-border);
  border-bottom: 1px solid var(--yok-color-border);
  border-radius: 0;
  background: var(--yok-color-surface);
  padding: var(--yok-space-3) var(--yok-space-4);
}

.yok-descriptions--bordered .yok-descriptions__label {
  color: var(--yok-color-primary);
}

.yok-descriptions__empty {
  border: 1px dashed var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-textMuted);
  padding: var(--yok-space-4);
}

@media (max-width: 820px) {
  .yok-descriptions__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .yok-descriptions__item {
    grid-column: span min(var(--yok-descriptions-span), 2);
  }
}

@media (max-width: 620px) {
  .yok-descriptions__header {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-descriptions__list {
    grid-template-columns: 1fr;
  }

  .yok-descriptions__item {
    grid-column: 1 / -1;
  }
}
</style>
