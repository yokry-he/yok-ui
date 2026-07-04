<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  name: 'YSplitter'
})

export type YSplitterLayout = 'horizontal' | 'vertical'

export interface YSplitterPanel {
  key: string
  label?: string
  size?: number
  min?: number
  max?: number
  resizable?: boolean
  collapsible?: boolean
  collapsedSize?: number
}

export type YSplitterSizes = Record<string, number>

export interface YSplitterResizePayload {
  index: number
  sizes: YSplitterSizes
}

export interface YSplitterCollapsePayload {
  key: string
  collapsed: boolean
  sizes: YSplitterSizes
}

interface Props {
  panels: YSplitterPanel[]
  modelValue?: YSplitterSizes
  layout?: YSplitterLayout
  height?: string
  handleSize?: number
  keyboardStep?: number
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  layout: 'horizontal',
  height: '280px',
  handleSize: 8,
  keyboardStep: 2,
  ariaLabel: 'Resizable panels'
})

const emit = defineEmits<{
  'update:modelValue': [sizes: YSplitterSizes]
  resizeStart: [payload: { index: number }]
  resize: [payload: YSplitterResizePayload]
  resizeEnd: [payload: YSplitterResizePayload]
  collapse: [payload: YSplitterCollapsePayload]
}>()

const splitterRef = ref<HTMLElement | null>(null)
const localSizes = ref<YSplitterSizes>(createInitialSizes())
const expandedSizes = ref<YSplitterSizes>({ ...localSizes.value })
const draggingIndex = ref<number | null>(null)

const resolvedSizes = computed(() => normalizeSizes(props.modelValue ?? localSizes.value))
const isVertical = computed(() => props.layout === 'vertical')
const separatorOrientation = computed(() => isVertical.value ? 'horizontal' : 'vertical')
const gridTemplate = computed(() => {
  const tracks: string[] = []

  props.panels.forEach((panel, index) => {
    tracks.push(`${resolvedSizes.value[panel.key] ?? 0}fr`)

    if (index < props.panels.length - 1) {
      tracks.push(`${props.handleSize}px`)
    }
  })

  return tracks.join(' ')
})
const splitterStyle = computed(() => ({
  '--yok-splitter-template': gridTemplate.value,
  '--yok-splitter-height': props.height,
  '--yok-splitter-handle-size': `${props.handleSize}px`
}))

watch(
  () => props.panels,
  () => {
    localSizes.value = createInitialSizes()
    expandedSizes.value = { ...localSizes.value }
  },
  { deep: true }
)

function createInitialSizes() {
  const fallback = props.panels.length > 0 ? 100 / props.panels.length : 100
  const sizes = Object.fromEntries(
    props.panels.map((panel) => [panel.key, panel.size ?? fallback])
  )

  return normalizeSizes(sizes)
}

function normalizeSizes(source: YSplitterSizes) {
  if (props.panels.length === 0) {
    return {}
  }

  const nextSizes = Object.fromEntries(
    props.panels.map((panel) => {
      const value = Number(source[panel.key] ?? panel.size ?? 100 / props.panels.length)

      return [panel.key, clampPanelSize(panel, Number.isFinite(value) ? value : 0, true)]
    })
  )
  const total = Object.values(nextSizes).reduce((sum, value) => sum + value, 0)

  if (total <= 0) {
    return Object.fromEntries(props.panels.map((panel) => [panel.key, 100 / props.panels.length]))
  }

  return Object.fromEntries(
    Object.entries(nextSizes).map(([key, value]) => [key, roundSize((value / total) * 100)])
  )
}

function clampPanelSize(panel: YSplitterPanel, size: number, allowCollapsed = false) {
  if (allowCollapsed && panel.collapsible && typeof panel.collapsedSize === 'number' && size <= panel.collapsedSize) {
    return panel.collapsedSize
  }

  const min = panel.min ?? 0
  const max = panel.max ?? 100

  return Math.min(Math.max(size, min), max)
}

function roundSize(size: number) {
  return Math.round(size * 100) / 100
}

function commitSizes(sizes: YSplitterSizes, index: number) {
  const normalized = normalizeSizes(sizes)

  localSizes.value = normalized
  emit('update:modelValue', normalized)
  emit('resize', {
    index,
    sizes: normalized
  })

  return normalized
}

function getPair(index: number) {
  const previous = props.panels[index]
  const next = props.panels[index + 1]

  if (!previous || !next) {
    return null
  }

  return { previous, next }
}

function resizePair(index: number, delta: number) {
  const pair = getPair(index)

  if (!pair) {
    return resolvedSizes.value
  }

  const currentSizes = resolvedSizes.value
  const previousSize = currentSizes[pair.previous.key] ?? 0
  const nextSize = currentSizes[pair.next.key] ?? 0
  const pairTotal = previousSize + nextSize
  const nextPreviousSize = clampPanelSize(pair.previous, previousSize + delta)
  const nextNextSize = clampPanelSize(pair.next, pairTotal - nextPreviousSize)
  const constrainedPreviousSize = pairTotal - nextNextSize
  const sizes = {
    ...currentSizes,
    [pair.previous.key]: roundSize(constrainedPreviousSize),
    [pair.next.key]: roundSize(nextNextSize)
  }

  return commitSizes(sizes, index)
}

function handleKeydown(event: KeyboardEvent, index: number) {
  const direction = isVertical.value
    ? { increase: 'ArrowDown', decrease: 'ArrowUp' }
    : { increase: 'ArrowRight', decrease: 'ArrowLeft' }

  if (event.key === direction.increase) {
    event.preventDefault()
    resizePair(index, props.keyboardStep)
  } else if (event.key === direction.decrease) {
    event.preventDefault()
    resizePair(index, -props.keyboardStep)
  } else if (event.key === 'Home') {
    event.preventDefault()
    resizePair(index, -100)
  } else if (event.key === 'End') {
    event.preventDefault()
    resizePair(index, 100)
  }
}

function handlePointerdown(event: PointerEvent, index: number) {
  const pair = getPair(index)

  if (!pair || pair.previous.resizable === false) {
    return
  }

  draggingIndex.value = index
  emit('resizeStart', { index })

  const rect = splitterRef.value?.getBoundingClientRect()
  const dimension = isVertical.value ? rect?.height : rect?.width

  if (!dimension) {
    return
  }

  const activePair = pair
  const activeDimension = dimension
  const startPosition = isVertical.value ? event.clientY : event.clientX
  const startSizes = { ...resolvedSizes.value }

  function handlePointermove(moveEvent: PointerEvent) {
    const currentPosition = isVertical.value ? moveEvent.clientY : moveEvent.clientX
    const delta = ((currentPosition - startPosition) / activeDimension) * 100
    const previousSize = startSizes[activePair.previous.key] ?? 0
    const nextSize = startSizes[activePair.next.key] ?? 0
    const pairTotal = previousSize + nextSize
    const nextPreviousSize = clampPanelSize(activePair.previous, previousSize + delta)
    const nextNextSize = clampPanelSize(activePair.next, pairTotal - nextPreviousSize)

    commitSizes(
      {
        ...startSizes,
        [activePair.previous.key]: roundSize(pairTotal - nextNextSize),
        [activePair.next.key]: roundSize(nextNextSize)
      },
      index
    )
  }

  function handlePointerup() {
    draggingIndex.value = null
    document.removeEventListener('pointermove', handlePointermove)
    document.removeEventListener('pointerup', handlePointerup)
    emit('resizeEnd', {
      index,
      sizes: resolvedSizes.value
    })
  }

  document.addEventListener('pointermove', handlePointermove)
  document.addEventListener('pointerup', handlePointerup)
}

function isCollapsed(panel: YSplitterPanel) {
  return (resolvedSizes.value[panel.key] ?? 0) <= (panel.collapsedSize ?? 0) + 0.01
}

function togglePanel(panel: YSplitterPanel, index: number) {
  if (!panel.collapsible) {
    return
  }

  const collapsed = !isCollapsed(panel)
  const currentSizes = resolvedSizes.value
  const targetSize = collapsed
    ? panel.collapsedSize ?? 0
    : expandedSizes.value[panel.key] ?? panel.size ?? panel.min ?? 100 / props.panels.length
  const currentSize = currentSizes[panel.key] ?? 0
  const delta = targetSize - currentSize
  const nextIndex = Math.min(index + 1, props.panels.length - 1)
  const nextPanel = props.panels[nextIndex]

  if (!nextPanel || nextPanel.key === panel.key) {
    return
  }

  if (collapsed) {
    expandedSizes.value = { ...expandedSizes.value, [panel.key]: currentSize }
  }

  const sizes = {
    ...currentSizes,
    [panel.key]: targetSize,
    [nextPanel.key]: (currentSizes[nextPanel.key] ?? 0) - delta
  }
  const normalized = commitSizes(sizes, Math.max(0, index - 1))

  emit('collapse', {
    key: panel.key,
    collapsed,
    sizes: normalized
  })
}

onBeforeUnmount(() => {
  draggingIndex.value = null
})
</script>

<template>
  <section
    ref="splitterRef"
    class="yok-splitter"
    :class="[
      `yok-splitter--${layout}`,
      { 'yok-splitter--dragging': draggingIndex !== null }
    ]"
    :style="splitterStyle"
    :aria-label="ariaLabel"
  >
    <template
      v-for="(panel, index) in panels"
      :key="panel.key"
    >
      <section
        class="yok-splitter__panel"
        :class="{ 'yok-splitter__panel--collapsed': isCollapsed(panel) }"
        :data-panel-key="panel.key"
        :aria-label="panel.label || panel.key"
      >
        <button
          v-if="panel.collapsible"
          class="yok-splitter__collapse yok-focus-ring"
          type="button"
          :aria-label="`${isCollapsed(panel) ? 'Expand' : 'Collapse'} ${panel.label || panel.key}`"
          :aria-pressed="isCollapsed(panel) ? 'true' : 'false'"
          @click="togglePanel(panel, index)"
        >
          {{ isCollapsed(panel) ? '+' : '-' }}
        </button>
        <slot :name="panel.key" :panel="panel" :size="resolvedSizes[panel.key]" />
      </section>

      <button
        v-if="index < panels.length - 1"
        :key="`${panel.key}-separator`"
        class="yok-splitter__separator yok-focus-ring"
        type="button"
        role="separator"
        :aria-label="`Resize ${panel.label || panel.key}`"
        :aria-orientation="separatorOrientation"
        :aria-valuemin="panel.min ?? 0"
        :aria-valuemax="panel.max ?? 100"
        :aria-valuenow="resolvedSizes[panel.key]"
        @pointerdown="handlePointerdown($event, index)"
        @keydown="handleKeydown($event, index)"
      >
        <span aria-hidden="true" />
      </button>
    </template>
  </section>
</template>

<style scoped>
.yok-splitter {
  display: grid;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  overflow: hidden;
  color: var(--yok-color-text);
  background: var(--yok-color-surface);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
}

.yok-splitter--horizontal {
  grid-template-columns: var(--yok-splitter-template);
  height: var(--yok-splitter-height);
}

.yok-splitter--vertical {
  grid-template-rows: var(--yok-splitter-template);
  height: var(--yok-splitter-height);
}

.yok-splitter__panel {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  background: color-mix(in srgb, var(--yok-color-surface) 92%, var(--yok-color-primary) 8%);
}

.yok-splitter__panel--collapsed {
  overflow: hidden;
}

.yok-splitter__separator {
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 0;
  padding: 0;
  color: var(--yok-color-text-muted);
  cursor: col-resize;
  background: color-mix(in srgb, var(--yok-color-border) 50%, transparent);
  border: 0;
}

.yok-splitter--vertical .yok-splitter__separator {
  cursor: row-resize;
}

.yok-splitter__separator:hover,
.yok-splitter__separator:focus-visible,
.yok-splitter--dragging .yok-splitter__separator {
  background: color-mix(in srgb, var(--yok-color-primary) 24%, transparent);
}

.yok-splitter__separator span {
  width: 2px;
  height: 28px;
  border-radius: var(--yok-radius-pill);
  background: currentcolor;
  opacity: 0.45;
}

.yok-splitter--vertical .yok-splitter__separator span {
  width: 28px;
  height: 2px;
}

.yok-splitter__collapse {
  position: absolute;
  z-index: 1;
  inset-block-start: var(--yok-space-2);
  inset-inline-end: var(--yok-space-2);
  display: inline-grid;
  width: 24px;
  height: 24px;
  place-items: center;
  padding: 0;
  color: var(--yok-color-primary);
  cursor: pointer;
  background: var(--yok-color-surface);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-full);
  box-shadow: var(--yok-shadow-xs);
}
</style>
