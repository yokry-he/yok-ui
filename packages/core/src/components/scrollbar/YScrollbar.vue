<script setup lang="ts">
import { computed, ref } from 'vue'

export interface YScrollbarScrollPayload {
  scrollTop: number
  scrollLeft: number
  scrollHeight: number
  scrollWidth: number
  clientHeight: number
  clientWidth: number
}

defineOptions({
  name: 'YScrollbar'
})

const props = withDefaults(defineProps<{
  height?: string | number
  maxHeight?: string | number
  minHeight?: string | number
  horizontal?: boolean
  native?: boolean
  ariaLabel?: string
}>(), {
  height: '',
  maxHeight: '',
  minHeight: '',
  horizontal: false,
  native: false,
  ariaLabel: 'Scrollable content'
})

const emit = defineEmits<{
  scroll: [payload: YScrollbarScrollPayload]
}>()

const viewportRef = ref<HTMLDivElement | null>(null)

function resolveCssSize(value: string | number) {
  return typeof value === 'number' ? `${value}px` : value
}

const viewportStyle = computed(() => ({
  '--yok-scrollbar-height': resolveCssSize(props.height),
  '--yok-scrollbar-max-height': resolveCssSize(props.maxHeight),
  '--yok-scrollbar-min-height': resolveCssSize(props.minHeight)
}))

function getScrollPayload(element: HTMLElement): YScrollbarScrollPayload {
  return {
    scrollTop: element.scrollTop,
    scrollLeft: element.scrollLeft,
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
    clientHeight: element.clientHeight,
    clientWidth: element.clientWidth
  }
}

function handleScroll(event: Event) {
  emit('scroll', getScrollPayload(event.target as HTMLElement))
}

function scrollTo(options: ScrollToOptions) {
  viewportRef.value?.scrollTo(options)
}

function setScrollTop(value: number) {
  if (viewportRef.value) {
    viewportRef.value.scrollTop = value
  }
}

function setScrollLeft(value: number) {
  if (viewportRef.value) {
    viewportRef.value.scrollLeft = value
  }
}

defineExpose({
  scrollTo,
  setScrollTop,
  setScrollLeft,
  viewportRef
})
</script>

<template>
  <div
    class="yok-scrollbar"
    :class="{
      'yok-scrollbar--horizontal': horizontal,
      'yok-scrollbar--native': native
    }"
  >
    <div
      ref="viewportRef"
      class="yok-scrollbar__viewport yok-focus-ring"
      :style="viewportStyle"
      tabindex="0"
      role="region"
      :aria-label="ariaLabel"
      @scroll="handleScroll"
    >
      <div class="yok-scrollbar__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.yok-scrollbar {
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  color: var(--yok-color-text);
}

.yok-scrollbar__viewport {
  height: var(--yok-scrollbar-height, auto);
  min-height: var(--yok-scrollbar-min-height, 0);
  max-height: var(--yok-scrollbar-max-height, none);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: color-mix(in srgb, var(--yok-color-primary) 45%, transparent) transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.yok-scrollbar--horizontal .yok-scrollbar__viewport {
  overflow-x: auto;
}

.yok-scrollbar:not(.yok-scrollbar--native) .yok-scrollbar__viewport::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.yok-scrollbar:not(.yok-scrollbar--native) .yok-scrollbar__viewport::-webkit-scrollbar-track {
  background: transparent;
}

.yok-scrollbar:not(.yok-scrollbar--native) .yok-scrollbar__viewport::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-color-primary) 42%, transparent);
  background-clip: content-box;
}

.yok-scrollbar:not(.yok-scrollbar--native) .yok-scrollbar__viewport::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--yok-color-primary) 64%, transparent);
  background-clip: content-box;
}

.yok-scrollbar--native .yok-scrollbar__viewport {
  scrollbar-color: auto;
  scrollbar-width: auto;
}

.yok-scrollbar__content {
  min-width: 0;
  padding: var(--yok-space-3);
}

.yok-scrollbar--horizontal .yok-scrollbar__content {
  width: max-content;
  min-width: 100%;
}
</style>
