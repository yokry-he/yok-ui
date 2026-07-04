<script setup lang="ts" generic="T extends YVirtualListItem = YVirtualListItem">
import { computed, ref } from 'vue'
import type {
  YVirtualListItem,
  YVirtualListProps,
  YVirtualListRange,
  YVirtualListScrollPayload
} from './types'

defineOptions({
  name: 'YVirtualList'
})

const props = withDefaults(defineProps<YVirtualListProps<T>>(), {
  itemKey: 'id',
  overscan: 4,
  ariaLabel: 'Virtual list',
  emptyText: 'No items yet'
})

const emit = defineEmits<{
  scroll: [payload: YVirtualListScrollPayload]
  rangeChange: [payload: YVirtualListRange]
}>()

const scrollTop = ref(0)
const viewportRef = ref<HTMLDivElement | null>(null)
const lastRangeKey = ref('')

const normalizedItemHeight = computed(() => Math.max(1, props.itemHeight))
const normalizedHeight = computed(() => Math.max(1, props.height))
const normalizedOverscan = computed(() => Math.max(0, props.overscan))
const visibleCount = computed(() => Math.ceil(normalizedHeight.value / normalizedItemHeight.value))
const totalHeight = computed(() => props.items.length * normalizedItemHeight.value)

const visibleRange = computed(() => {
  if (!props.items.length) {
    return {
      start: 0,
      end: 0
    }
  }

  const baseStart = Math.floor(scrollTop.value / normalizedItemHeight.value)
  const start = Math.max(0, baseStart - normalizedOverscan.value)
  const end = Math.min(props.items.length, baseStart + visibleCount.value + normalizedOverscan.value)

  return {
    start,
    end
  }
})

const visibleItems = computed(() => props.items.slice(visibleRange.value.start, visibleRange.value.end))
const offsetTop = computed(() => visibleRange.value.start * normalizedItemHeight.value)
const viewportStyle = computed(() => ({
  height: `${normalizedHeight.value}px`
}))
const spacerStyle = computed(() => ({
  height: `${totalHeight.value}px`
}))
const trackStyle = computed(() => ({
  transform: `translateY(${offsetTop.value}px)`
}))
const itemStyle = computed(() => ({
  height: `${normalizedItemHeight.value}px`
}))

function getItemKey(item: T, index: number) {
  const absoluteIndex = visibleRange.value.start + index

  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, absoluteIndex)
  }

  return String(item[props.itemKey] ?? absoluteIndex)
}

function emitRangeEvents() {
  const range = visibleRange.value
  const rangeKey = `${range.start}-${range.end}`

  emit('scroll', {
    scrollTop: scrollTop.value,
    start: range.start,
    end: range.end
  })

  if (rangeKey !== lastRangeKey.value) {
    lastRangeKey.value = rangeKey
    emit('rangeChange', range)
  }
}

function handleScroll(event: Event) {
  scrollTop.value = (event.target as HTMLElement).scrollTop
  emitRangeEvents()
}

function scrollToOffset(offset: number) {
  const viewport = viewportRef.value

  if (!viewport) {
    return
  }

  const maxOffset = Math.max(0, totalHeight.value - normalizedHeight.value)
  viewport.scrollTop = Math.min(Math.max(0, offset), maxOffset)
  scrollTop.value = viewport.scrollTop
  emitRangeEvents()
}

function scrollToIndex(index: number, align: 'start' | 'center' | 'end' = 'start') {
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, props.items.length - 1))
  const itemOffset = safeIndex * normalizedItemHeight.value
  const alignOffset = align === 'center'
    ? (normalizedHeight.value - normalizedItemHeight.value) / 2
    : align === 'end'
      ? normalizedHeight.value - normalizedItemHeight.value
      : 0

  scrollToOffset(itemOffset - alignOffset)
}

defineExpose({
  scrollToIndex,
  scrollToOffset
})
</script>

<template>
  <div class="yok-virtual-list">
    <div
      ref="viewportRef"
      class="yok-virtual-list__viewport yok-focus-ring"
      :style="viewportStyle"
      role="list"
      tabindex="0"
      :aria-label="ariaLabel"
      :aria-setsize="items.length"
      @scroll="handleScroll"
    >
      <div v-if="items.length" class="yok-virtual-list__spacer" :style="spacerStyle">
        <div class="yok-virtual-list__track" :style="trackStyle">
          <div
            v-for="(item, index) in visibleItems"
            :key="getItemKey(item, index)"
            class="yok-virtual-list__item"
            role="listitem"
            :style="itemStyle"
            :aria-posinset="visibleRange.start + index + 1"
          >
            <slot
              name="item"
              :item="item"
              :index="visibleRange.start + index"
            >
              <span class="yok-virtual-list__label">{{ item.label ?? getItemKey(item, index) }}</span>
            </slot>
          </div>
        </div>
      </div>
      <div v-else class="yok-virtual-list__empty" role="status">
        <slot name="empty">{{ emptyText }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.yok-virtual-list {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  color: var(--yok-color-text);
}

.yok-virtual-list__viewport {
  position: relative;
  overflow: auto;
  scrollbar-gutter: stable;
}

.yok-virtual-list__spacer {
  position: relative;
  min-width: 0;
}

.yok-virtual-list__track {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  will-change: transform;
}

.yok-virtual-list__item {
  display: flex;
  min-width: 0;
  align-items: center;
  border-bottom: 1px solid color-mix(in srgb, var(--yok-color-border) 70%, transparent);
  padding-inline: var(--yok-space-4);
}

.yok-virtual-list__item:last-child {
  border-bottom: 0;
}

.yok-virtual-list__item:nth-child(odd) {
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 42%, transparent);
}

.yok-virtual-list__label {
  min-width: 0;
  overflow: hidden;
  color: var(--yok-color-text);
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-virtual-list__empty {
  display: grid;
  min-height: 100%;
  place-items: center;
  color: var(--yok-color-textMuted);
  padding: var(--yok-space-6);
  text-align: center;
}
</style>
