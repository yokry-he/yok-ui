<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YList'
})

export type YListSize = 'sm' | 'md' | 'lg'
export type YListLayout = 'horizontal' | 'vertical'
export type YListItemKey = string | ((item: YListItem, index: number) => string | number)

export interface YListItem {
  key?: string | number
  title?: string
  label?: string
  name?: string
  description?: string
  meta?: string
  disabled?: boolean
  [key: string]: unknown
}

interface Props {
  items: YListItem[]
  itemKey?: YListItemKey
  title?: string
  description?: string
  bordered?: boolean
  split?: boolean
  loading?: boolean
  emptyText?: string
  size?: YListSize
  layout?: YListLayout
  columns?: number
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: 'key',
  title: '',
  description: '',
  bordered: false,
  split: true,
  loading: false,
  emptyText: 'No items yet',
  size: 'md',
  layout: 'horizontal',
  columns: 1,
  ariaLabel: ''
})

const normalizedColumns = computed(() => Math.max(1, Math.min(4, props.columns)))
const accessibleName = computed(() => props.ariaLabel || props.title || 'List')
const isGrid = computed(() => normalizedColumns.value > 1)

function getItemKey(item: YListItem, index: number) {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }

  return String(item[props.itemKey] ?? item.key ?? item.title ?? item.label ?? index)
}

function getItemTitle(item: YListItem) {
  return item.title || item.label || item.name || ''
}
</script>

<template>
  <section
    class="yok-list"
    :class="[
      `yok-list--${size}`,
      `yok-list--${layout}`,
      {
        'yok-list--bordered': bordered,
        'yok-list--split': split,
        'yok-list--grid': isGrid,
        'is-loading': loading
      }
    ]"
    :aria-label="accessibleName"
    :aria-busy="loading ? 'true' : 'false'"
    :style="{ '--yok-list-columns': normalizedColumns }"
  >
    <header v-if="title || description || $slots.header || $slots.extra" class="yok-list__header">
      <slot name="header">
        <div class="yok-list__copy">
          <h3 v-if="title">{{ title }}</h3>
          <p v-if="description">{{ description }}</p>
        </div>
      </slot>
      <div v-if="$slots.extra" class="yok-list__extra">
        <slot name="extra" />
      </div>
    </header>

    <div v-if="loading" class="yok-list__loading" role="status" aria-live="polite">
      <span class="yok-list__skeleton yok-list__skeleton--title" />
      <span class="yok-list__skeleton yok-list__skeleton--description" />
      <span class="yok-list__loading-text">Loading list</span>
    </div>

    <ul v-else-if="items.length" class="yok-list__items">
      <li
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        class="yok-list__item"
        :class="{ 'is-disabled': item.disabled }"
        :aria-disabled="item.disabled ? 'true' : undefined"
      >
        <slot name="item" :item="item" :index="index">
          <div class="yok-list__main">
            <div class="yok-list__body">
              <div class="yok-list__topline">
                <strong v-if="getItemTitle(item) || $slots.title" class="yok-list__title">
                  <slot name="title" :item="item" :index="index">
                    {{ getItemTitle(item) }}
                  </slot>
                </strong>
                <span v-if="item.meta || $slots.meta" class="yok-list__meta">
                  <slot name="meta" :item="item" :index="index">
                    {{ item.meta }}
                  </slot>
                </span>
              </div>
              <p v-if="item.description || $slots.description" class="yok-list__description">
                <slot name="description" :item="item" :index="index">
                  {{ item.description }}
                </slot>
              </p>
            </div>
            <div v-if="$slots.actions" class="yok-list__actions">
              <slot name="actions" :item="item" :index="index" />
            </div>
          </div>
        </slot>
      </li>
    </ul>

    <p v-else class="yok-list__empty" role="status">
      <slot name="empty">{{ emptyText }}</slot>
    </p>

    <footer v-if="$slots.footer" class="yok-list__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.yok-list {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-list__copy {
  min-width: 0;
}

.yok-list h3,
.yok-list p,
.yok-list ul {
  margin: 0;
}

.yok-list h3 {
  font-size: 18px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-list__copy p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-list__extra {
  flex: none;
}

.yok-list__items {
  display: grid;
  grid-template-columns: repeat(var(--yok-list-columns), minmax(0, 1fr));
  gap: 0;
  min-width: 0;
  padding: 0;
  list-style: none;
}

.yok-list--grid .yok-list__items {
  gap: var(--yok-space-3);
}

.yok-list__item {
  min-width: 0;
  padding: var(--yok-space-4) 0;
}

.yok-list--split:not(.yok-list--grid) .yok-list__item {
  border-bottom: 1px solid color-mix(in srgb, var(--yok-color-border) 82%, transparent);
}

.yok-list--split:not(.yok-list--grid) .yok-list__item:last-child {
  border-bottom: 0;
}

.yok-list--grid .yok-list__item,
.yok-list--bordered .yok-list__item {
  border: 1px solid color-mix(in srgb, var(--yok-color-border) 88%, transparent);
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--yok-color-primary) 6%, transparent), transparent 46%),
    var(--yok-color-surface);
  padding: var(--yok-space-4);
}

.yok-list--bordered {
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-list--bordered .yok-list__header,
.yok-list--bordered .yok-list__footer,
.yok-list--bordered .yok-list__empty,
.yok-list--bordered .yok-list__loading {
  padding: var(--yok-space-4);
}

.yok-list--bordered .yok-list__header {
  border-bottom: 1px solid var(--yok-color-border);
}

.yok-list--bordered .yok-list__footer {
  border-top: 1px solid var(--yok-color-border);
}

.yok-list--bordered:not(.yok-list--grid) .yok-list__item {
  border: 0;
  border-bottom: 1px solid var(--yok-color-border);
  border-radius: 0;
  background: transparent;
}

.yok-list--bordered:not(.yok-list--grid) .yok-list__item:last-child {
  border-bottom: 0;
}

.yok-list__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-4);
  min-width: 0;
}

.yok-list--vertical .yok-list__main {
  display: grid;
}

.yok-list__body {
  display: grid;
  gap: var(--yok-space-1);
  min-width: 0;
}

.yok-list__topline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-list__title {
  min-width: 0;
  color: var(--yok-color-text);
  font-size: 15px;
  font-weight: 760;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.yok-list__meta {
  flex: none;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.45;
}

.yok-list__description {
  color: var(--yok-color-textMuted);
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.yok-list__actions {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--yok-space-2);
}

.yok-list__footer {
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-list__empty,
.yok-list__loading {
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-list__loading {
  display: grid;
  gap: var(--yok-space-2);
}

.yok-list__skeleton {
  display: block;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--yok-color-border) 66%, transparent),
    color-mix(in srgb, var(--yok-color-primary) 14%, var(--yok-color-surface)),
    color-mix(in srgb, var(--yok-color-border) 66%, transparent)
  );
  background-size: 200% 100%;
  animation: yok-list-shimmer 1.4s ease-in-out infinite;
}

.yok-list__skeleton--title {
  width: min(220px, 64vw);
  height: 18px;
}

.yok-list__skeleton--description {
  width: min(340px, 76vw);
}

.yok-list__loading-text {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.yok-list__item.is-disabled {
  opacity: 0.56;
}

.yok-list--sm {
  gap: var(--yok-space-3);
}

.yok-list--sm .yok-list__item {
  padding-block: var(--yok-space-3);
}

.yok-list--sm .yok-list__title {
  font-size: 14px;
}

.yok-list--lg .yok-list__item {
  padding-block: var(--yok-space-5);
}

.yok-list--lg .yok-list__title {
  font-size: 17px;
}

@keyframes yok-list-shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}

@media (max-width: 720px) {
  .yok-list {
    --yok-list-columns: 1 !important;
  }

  .yok-list__main,
  .yok-list__topline {
    display: grid;
  }

  .yok-list__actions {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yok-list__skeleton {
    animation: none;
  }
}
</style>
