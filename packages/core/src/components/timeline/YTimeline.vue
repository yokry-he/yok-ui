<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YTimeline'
})

export type YTimelineTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
export type YTimelinePlacement = 'left' | 'right' | 'alternate'
export type YTimelineSize = 'md' | 'sm'

export interface YTimelineItem {
  title: string
  value?: string
  description?: string
  time?: string
  tone?: YTimelineTone
  disabled?: boolean
  loading?: boolean
}

interface Props {
  items: YTimelineItem[]
  title?: string
  description?: string
  ariaLabel?: string
  placement?: YTimelinePlacement
  size?: YTimelineSize
  reverse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  ariaLabel: 'Timeline',
  placement: 'right',
  size: 'md',
  reverse: false
})

const orderedItems = computed(() => props.reverse ? [...props.items].reverse() : props.items)

function getKey(item: YTimelineItem, index: number) {
  return item.value || `${item.title}-${index}`
}

function getTone(item: YTimelineItem): YTimelineTone {
  return item.tone || 'neutral'
}
</script>

<template>
  <section
    class="yok-timeline"
    :class="[`yok-timeline--${placement}`, `yok-timeline--${size}`]"
    :aria-label="ariaLabel"
  >
    <header v-if="title || description || $slots.header" class="yok-timeline__header">
      <slot name="header">
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </slot>
    </header>

    <ol class="yok-timeline__list">
      <li
        v-for="(item, index) in orderedItems"
        :key="getKey(item, index)"
        class="yok-timeline__item"
        :class="[
          `yok-timeline__item--${getTone(item)}`,
          {
            'is-disabled': item.disabled,
            'is-loading': item.loading,
            'is-left': placement === 'left' || (placement === 'alternate' && index % 2 === 1),
            'is-right': placement === 'right' || (placement === 'alternate' && index % 2 === 0)
          }
        ]"
        :aria-disabled="item.disabled ? 'true' : undefined"
        :aria-busy="item.loading ? 'true' : undefined"
      >
        <div class="yok-timeline__axis" aria-hidden="true">
          <span class="yok-timeline__dot">
            <slot name="dot" :item="item" :index="index" />
          </span>
        </div>
        <article class="yok-timeline__card">
          <div class="yok-timeline__topline">
            <h4>{{ item.title }}</h4>
            <time v-if="item.time">{{ item.time }}</time>
          </div>
          <p v-if="item.description">{{ item.description }}</p>
          <div v-if="$slots.actions" class="yok-timeline__actions">
            <slot name="actions" :item="item" :index="index" />
          </div>
          <slot name="item" :item="item" :index="index" />
        </article>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.yok-timeline {
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-timeline__header {
  margin-bottom: var(--yok-space-4);
}

.yok-timeline__header h3,
.yok-timeline__header p,
.yok-timeline h4,
.yok-timeline p {
  margin: 0;
}

.yok-timeline__header h3 {
  font-size: 18px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-timeline__header p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.65;
}

.yok-timeline__list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-timeline__item {
  --yok-timeline-accent: var(--yok-color-textMuted);
  --yok-timeline-soft: color-mix(in srgb, var(--yok-timeline-accent) 10%, var(--yok-color-surface));

  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: var(--yok-space-3);
  min-width: 0;
  padding-bottom: var(--yok-space-4);
}

.yok-timeline__item:last-child {
  padding-bottom: 0;
}

.yok-timeline__axis {
  position: relative;
  display: flex;
  justify-content: center;
}

.yok-timeline__axis::after {
  position: absolute;
  top: 25px;
  bottom: calc(-1 * var(--yok-space-4));
  width: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-color-border) 84%, transparent);
  content: '';
}

.yok-timeline__item:last-child .yok-timeline__axis::after {
  display: none;
}

.yok-timeline__dot {
  position: relative;
  z-index: 1;
  display: grid;
  width: 14px;
  height: 14px;
  margin-top: 8px;
  place-items: center;
  border: 3px solid var(--yok-color-surface);
  border-radius: 999px;
  background: var(--yok-timeline-accent);
  color: var(--yok-color-surface);
  box-shadow:
    0 0 0 4px var(--yok-timeline-soft),
    var(--yok-shadow-soft);
}

.yok-timeline__card {
  display: grid;
  gap: var(--yok-space-2);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-border) 82%, transparent);
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(135deg, var(--yok-timeline-soft), transparent 52%),
    var(--yok-color-surface);
  padding: var(--yok-space-4);
}

.yok-timeline__topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-timeline h4 {
  color: var(--yok-color-text);
  font-size: 16px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-timeline time,
.yok-timeline p {
  color: var(--yok-color-textMuted);
}

.yok-timeline time {
  flex: none;
  font-size: 13px;
  line-height: 1.5;
}

.yok-timeline p {
  line-height: 1.65;
}

.yok-timeline__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
}

.yok-timeline__item--success {
  --yok-timeline-accent: var(--yok-color-success);
}

.yok-timeline__item--warning {
  --yok-timeline-accent: var(--yok-color-warning);
}

.yok-timeline__item--danger {
  --yok-timeline-accent: var(--yok-color-danger);
}

.yok-timeline__item--info {
  --yok-timeline-accent: var(--yok-color-primary);
}

.yok-timeline__item.is-disabled {
  opacity: 0.58;
}

.yok-timeline__item.is-loading .yok-timeline__dot {
  animation: yok-timeline-pulse 1.4s ease-in-out infinite;
}

.yok-timeline--sm .yok-timeline__item {
  grid-template-columns: 24px minmax(0, 1fr);
  gap: var(--yok-space-2);
  padding-bottom: var(--yok-space-3);
}

.yok-timeline--sm .yok-timeline__card {
  padding: var(--yok-space-3);
}

.yok-timeline--sm h4 {
  font-size: 14px;
}

@media (min-width: 780px) {
  .yok-timeline--left .yok-timeline__item,
  .yok-timeline--alternate .yok-timeline__item {
    grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1fr);
  }

  .yok-timeline--left .yok-timeline__axis,
  .yok-timeline--alternate .yok-timeline__axis {
    grid-column: 2;
  }

  .yok-timeline--left .yok-timeline__card,
  .yok-timeline--alternate .is-left .yok-timeline__card {
    grid-column: 1;
    text-align: right;
  }

  .yok-timeline--alternate .is-right .yok-timeline__card {
    grid-column: 3;
  }

  .yok-timeline--left .yok-timeline__topline,
  .yok-timeline--alternate .is-left .yok-timeline__topline {
    flex-direction: row-reverse;
  }

  .yok-timeline--left .yok-timeline__actions,
  .yok-timeline--alternate .is-left .yok-timeline__actions {
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .yok-timeline__topline {
    align-items: flex-start;
    flex-direction: column;
  }
}

@keyframes yok-timeline-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.78);
  }
}
</style>
