<script setup lang="ts">
import { computed } from 'vue'
import { YTag } from '@yok-ui/core'

defineOptions({
  name: 'YStatusTimeline'
})

export type YStatusTimelineTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
export type YStatusTimelineSize = 'md' | 'sm'

export interface YStatusTimelineItem {
  title: string
  value: string
  description?: string
  time?: string
  actor?: string
  tone?: YStatusTimelineTone
  status?: string
  disabled?: boolean
}

interface Props {
  items: YStatusTimelineItem[]
  activeValue?: string
  ariaLabel?: string
  size?: YStatusTimelineSize
  reverse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activeValue: '',
  ariaLabel: 'Status timeline',
  size: 'md',
  reverse: false
})

const orderedItems = computed(() => props.reverse ? [...props.items].reverse() : props.items)

function getTone(item: YStatusTimelineItem, index: number): YStatusTimelineTone {
  if (item.tone) {
    return item.tone
  }

  if (item.value === props.activeValue) {
    return 'info'
  }

  return index === 0 ? 'success' : 'neutral'
}
</script>

<template>
  <section class="yok-status-timeline" :class="`yok-status-timeline--${size}`" :aria-label="ariaLabel">
    <ol class="yok-status-timeline__list">
      <li
        v-for="(item, index) in orderedItems"
        :key="item.value"
        class="yok-status-timeline__item"
        :class="[
          `yok-status-timeline__item--${getTone(item, index)}`,
          {
            'is-active': item.value === activeValue,
            'is-disabled': item.disabled
          }
        ]"
        :aria-current="item.value === activeValue ? 'step' : undefined"
      >
        <span class="yok-status-timeline__rail" aria-hidden="true">
          <span class="yok-status-timeline__dot" />
        </span>
        <article class="yok-status-timeline__card">
          <div class="yok-status-timeline__topline">
            <div class="yok-status-timeline__title-group">
              <h3>{{ item.title }}</h3>
              <YTag v-if="item.status" :tone="getTone(item, index)">{{ item.status }}</YTag>
            </div>
            <time v-if="item.time" class="yok-status-timeline__time">{{ item.time }}</time>
          </div>
          <p v-if="item.description" class="yok-status-timeline__description">{{ item.description }}</p>
          <div v-if="item.actor || $slots.actions" class="yok-status-timeline__meta">
            <span v-if="item.actor">{{ item.actor }}</span>
            <div v-if="$slots.actions" class="yok-status-timeline__actions">
              <slot name="actions" :item="item" :index="index" />
            </div>
          </div>
          <slot name="item" :item="item" :index="index" />
        </article>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.yok-status-timeline {
  min-width: 0;
}

.yok-status-timeline__list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-status-timeline__item {
  --yok-status-timeline-accent: var(--yok-color-primary);
  --yok-status-timeline-soft: color-mix(in srgb, var(--yok-status-timeline-accent), transparent 88%);

  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: var(--yok-space-3);
  min-width: 0;
  padding-bottom: var(--yok-space-4);
}

.yok-status-timeline__item:last-child {
  padding-bottom: 0;
}

.yok-status-timeline__rail {
  position: relative;
  display: flex;
  justify-content: center;
}

.yok-status-timeline__rail::after {
  position: absolute;
  top: 24px;
  bottom: calc(-1 * var(--yok-space-4));
  width: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-color-border), transparent 16%);
  content: '';
}

.yok-status-timeline__item:last-child .yok-status-timeline__rail::after {
  display: none;
}

.yok-status-timeline__dot {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  margin-top: 10px;
  border: 3px solid var(--yok-color-surface);
  border-radius: 999px;
  background: var(--yok-status-timeline-accent);
  box-shadow:
    0 0 0 4px var(--yok-status-timeline-soft),
    var(--yok-shadow-soft);
}

.yok-status-timeline__card {
  display: grid;
  gap: var(--yok-space-2);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-border), transparent 18%);
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(135deg, var(--yok-status-timeline-soft), transparent 52%),
    var(--yok-color-surface);
  padding: var(--yok-space-4);
}

.yok-status-timeline__topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-status-timeline__title-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-status-timeline h3,
.yok-status-timeline p {
  margin: 0;
}

.yok-status-timeline h3 {
  color: var(--yok-color-text);
  font-size: 16px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-status-timeline__description,
.yok-status-timeline__meta,
.yok-status-timeline__time {
  color: var(--yok-color-textMuted);
}

.yok-status-timeline__description {
  line-height: 1.65;
}

.yok-status-timeline__time {
  flex: none;
  font-size: 13px;
  line-height: 1.5;
}

.yok-status-timeline__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
  font-size: 13px;
}

.yok-status-timeline__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--yok-space-2);
  margin-left: auto;
}

.yok-status-timeline__item.is-active .yok-status-timeline__card {
  border-color: color-mix(in srgb, var(--yok-status-timeline-accent), white 62%);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--yok-status-timeline-accent), transparent 90%);
}

.yok-status-timeline__item.is-disabled {
  opacity: 0.58;
}

.yok-status-timeline__item--success {
  --yok-status-timeline-accent: var(--yok-color-success);
}

.yok-status-timeline__item--warning {
  --yok-status-timeline-accent: var(--yok-color-warning);
}

.yok-status-timeline__item--danger {
  --yok-status-timeline-accent: var(--yok-color-danger);
}

.yok-status-timeline__item--info {
  --yok-status-timeline-accent: var(--yok-color-primary);
}

.yok-status-timeline__item--neutral {
  --yok-status-timeline-accent: var(--yok-color-textMuted);
}

.yok-status-timeline--sm .yok-status-timeline__item {
  grid-template-columns: 24px minmax(0, 1fr);
  gap: var(--yok-space-2);
  padding-bottom: var(--yok-space-3);
}

.yok-status-timeline--sm .yok-status-timeline__card {
  padding: var(--yok-space-3);
}

.yok-status-timeline--sm h3 {
  font-size: 14px;
}

@media (max-width: 640px) {
  .yok-status-timeline__topline,
  .yok-status-timeline__meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .yok-status-timeline__actions {
    justify-content: flex-start;
    margin-left: 0;
  }
}
</style>
