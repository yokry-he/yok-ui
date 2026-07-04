<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { useOverlayA11y } from '../../composables/useOverlayA11y'

defineOptions({
  name: 'YTour'
})

export type YTourPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center'
export type YTourTarget = string | HTMLElement | null

export interface YTourStep {
  title: string
  description?: string
  target?: YTourTarget
  placement?: YTourPlacement
  nextText?: string
  prevText?: string
}

interface Props {
  open: boolean
  steps: YTourStep[]
  current?: number
  closeOnEscape?: boolean
  nextText?: string
  prevText?: string
  finishText?: string
  skipText?: string
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  closeOnEscape: true,
  nextText: 'Next',
  prevText: 'Previous',
  finishText: 'Finish',
  skipText: 'Skip'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:current': [value: number]
  close: []
  finish: []
  change: [index: number, step: YTourStep]
}>()

const dialogRef = ref<HTMLElement | null>(null)
const activeTarget = ref<HTMLElement | null>(null)
const spotlightStyle = ref<Record<string, string>>({})
let syncFrame = 0

const activeIndex = computed(() => {
  if (!props.steps.length) {
    return 0
  }

  return Math.min(Math.max(props.current, 0), props.steps.length - 1)
})

const activeStep = computed<YTourStep>(() => props.steps[activeIndex.value] ?? {
  title: 'No tour steps',
  description: 'Add at least one tour step to guide users through this workflow.',
  placement: 'center'
})

const isFirst = computed(() => activeIndex.value === 0)
const isLast = computed(() => activeIndex.value >= props.steps.length - 1)
const progressText = computed(() => props.steps.length ? `${activeIndex.value + 1} / ${props.steps.length}` : '0 / 0')

function resolveTarget(target: YTourTarget | undefined) {
  if (typeof document === 'undefined') {
    return null
  }

  if (!target) {
    return null
  }

  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target)
  }

  return target
}

function clearTargetMarker() {
  if (activeTarget.value) {
    activeTarget.value.removeAttribute('data-yok-tour-active')
  }

  activeTarget.value = null
}

function syncTarget() {
  clearTargetMarker()

  if (typeof window === 'undefined') {
    spotlightStyle.value = {}
    return
  }

  const target = resolveTarget(activeStep.value.target)

  if (!target) {
    spotlightStyle.value = {}
    return
  }

  activeTarget.value = target
  target.setAttribute('data-yok-tour-active', 'true')

  const rect = target.getBoundingClientRect()
  const padding = 8

  spotlightStyle.value = {
    top: `${Math.max(rect.top - padding, 8)}px`,
    left: `${Math.max(rect.left - padding, 8)}px`,
    width: `${Math.max(rect.width + padding * 2, 24)}px`,
    height: `${Math.max(rect.height + padding * 2, 24)}px`
  }
}

async function queueSyncTarget() {
  await nextTick()

  if (props.open) {
    syncTarget()
  } else {
    clearTargetMarker()
  }

  if (syncFrame) {
    window.cancelAnimationFrame(syncFrame)
  }

  syncFrame = window.requestAnimationFrame(() => {
    syncFrame = 0

    if (props.open) {
      syncTarget()
    } else {
      clearTargetMarker()
    }
  })
}

function requestClose() {
  emit('update:open', false)
  emit('close')
}

function goTo(index: number) {
  const nextIndex = Math.min(Math.max(index, 0), props.steps.length - 1)
  const nextStep = props.steps[nextIndex]

  if (!nextStep || nextIndex === activeIndex.value) {
    return
  }

  emit('update:current', nextIndex)
  emit('change', nextIndex, nextStep)
}

function goPrevious() {
  goTo(activeIndex.value - 1)
}

function goNext() {
  if (isLast.value) {
    emit('finish')
    requestClose()
    return
  }

  goTo(activeIndex.value + 1)
}

const { layerStyle } = useOverlayA11y({
  open: toRef(props, 'open'),
  container: dialogRef,
  closeOnEscape: toRef(props, 'closeOnEscape'),
  onClose: requestClose
})

watch(
  () => [props.open, activeIndex.value, props.steps],
  async () => {
    if (typeof window === 'undefined') {
      clearTargetMarker()
      return
    }

    await queueSyncTarget()
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  if (props.open) {
    void queueSyncTarget()
  }
})

onBeforeUnmount(() => {
  if (syncFrame) {
    window.cancelAnimationFrame(syncFrame)
  }

  clearTargetMarker()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="yok-tour-layer">
      <div v-if="open" class="yok-tour" :style="layerStyle">
        <div class="yok-tour__overlay" aria-hidden="true" />
        <div v-if="activeTarget" class="yok-tour__spotlight" aria-hidden="true" :style="spotlightStyle" />
        <section
          ref="dialogRef"
          class="yok-tour__panel"
          :class="`yok-tour__panel--${activeStep.placement ?? 'bottom'}`"
          role="dialog"
          aria-modal="true"
          :aria-label="activeStep.title"
          tabindex="-1"
        >
          <header class="yok-tour__header">
            <span class="yok-tour__progress">{{ progressText }}</span>
            <button class="yok-tour__close yok-focus-ring" type="button" :aria-label="skipText" @click="requestClose">
              ×
            </button>
          </header>
          <div class="yok-tour__body">
            <h2>{{ activeStep.title }}</h2>
            <p v-if="activeStep.description">{{ activeStep.description }}</p>
            <slot :step="activeStep" :index="activeIndex" />
          </div>
          <footer class="yok-tour__footer">
            <button
              class="yok-tour__button yok-tour__button--ghost yok-focus-ring"
              type="button"
              :disabled="isFirst || !steps.length"
              @click="goPrevious"
            >
              {{ activeStep.prevText ?? prevText }}
            </button>
            <button
              v-if="steps.length"
              class="yok-tour__button yok-tour__button--primary yok-focus-ring"
              type="button"
              :data-tour-next="!isLast ? '' : undefined"
              :data-tour-finish="isLast ? '' : undefined"
              @click="goNext"
            >
              {{ isLast ? finishText : activeStep.nextText ?? nextText }}
            </button>
            <button
              v-else
              class="yok-tour__button yok-tour__button--primary yok-focus-ring"
              type="button"
              @click="requestClose"
            >
              {{ skipText }}
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.yok-tour {
  position: fixed;
  inset: 0;
  z-index: var(--yok-zIndex-modal, 2000);
  display: grid;
  place-items: center;
  padding: var(--yok-space-5);
  color: var(--yok-color-text);
}

.yok-tour__overlay {
  position: absolute;
  inset: 0;
  background: rgba(37, 48, 45, 0.42);
}

.yok-tour__spotlight {
  position: fixed;
  z-index: 1;
  border: 2px solid var(--yok-color-primary);
  border-radius: var(--yok-radius-lg);
  box-shadow: 0 0 0 9999px rgba(37, 48, 45, 0.18), var(--yok-shadow-pop);
  pointer-events: none;
}

.yok-tour__panel {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(380px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-xl);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
}

.yok-tour__header,
.yok-tour__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  padding: var(--yok-space-4);
}

.yok-tour__header {
  border-bottom: 1px solid var(--yok-color-border);
}

.yok-tour__progress {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: 999px;
  background: var(--yok-color-primarySoft);
  padding: 0 var(--yok-space-2);
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 700;
}

.yok-tour__close {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.yok-tour__body {
  display: grid;
  gap: var(--yok-space-2);
  padding: var(--yok-space-5);
}

.yok-tour__body h2,
.yok-tour__body p {
  margin: 0;
}

.yok-tour__body h2 {
  font-size: 20px;
  letter-spacing: 0;
}

.yok-tour__body p {
  color: var(--yok-color-textMuted);
}

.yok-tour__footer {
  border-top: 1px solid var(--yok-color-border);
}

.yok-tour__button {
  min-height: 34px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  padding: 0 var(--yok-space-3);
  cursor: pointer;
  font-weight: 700;
}

.yok-tour__button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-tour__button--ghost {
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
}

.yok-tour__button--primary {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primary);
  color: #fff;
}
</style>
