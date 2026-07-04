<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'

defineOptions({
  name: 'YPopover'
})

export type YPopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'
export type YPopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'

interface Props {
  open?: boolean
  title?: string
  content?: string
  placement?: YPopoverPlacement
  trigger?: YPopoverTrigger
  disabled?: boolean
  showDelay?: number | string
  hideDelay?: number | string
  closeOnEscape?: boolean
  closeOnOutsidePointer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: undefined,
  title: '',
  content: '',
  placement: 'bottom',
  trigger: 'click',
  disabled: false,
  showDelay: 0,
  hideDelay: 0,
  closeOnEscape: true,
  closeOnOutsidePointer: true
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const generatedId = useId()
const internalOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
let openTimer: ReturnType<typeof setTimeout> | undefined

const isControlled = computed(() => props.open !== undefined)
const open = computed(() => props.disabled ? false : isControlled.value ? Boolean(props.open) : internalOpen.value)
const popoverId = computed(() => `yok-popover-${generatedId}`)
const floatingPlacement = computed(() => props.placement)
const { floatingStyles } = useFloatingLayer(triggerRef, panelRef, {
  open,
  placement: floatingPlacement,
  offset: 8
})

function delayToMs(delay: number | string) {
  if (typeof delay === 'number') {
    return delay
  }

  if (delay.endsWith('ms')) {
    return Number.parseFloat(delay)
  }

  if (delay.endsWith('s')) {
    return Number.parseFloat(delay) * 1000
  }

  const parsed = Number.parseFloat(delay)

  return Number.isNaN(parsed) ? 0 : parsed
}

function clearOpenTimer() {
  if (openTimer) {
    clearTimeout(openTimer)
    openTimer = undefined
  }
}

function commitOpen(value: boolean) {
  if (props.disabled || open.value === value) {
    return
  }

  if (!isControlled.value) {
    internalOpen.value = value
  }
  emit('update:open', value)
}

function requestOpen(value: boolean, delayed = false) {
  if (props.disabled) {
    return
  }

  clearOpenTimer()
  const delay = delayed ? delayToMs(value ? props.showDelay : props.hideDelay) : 0

  if (delay > 0) {
    openTimer = setTimeout(() => commitOpen(value), delay)
    return
  }

  commitOpen(value)
}

function toggle() {
  requestOpen(!open.value)
}

function closeAndFocusTrigger() {
  requestOpen(false)
  triggerRef.value?.focus()
}

const { layerStyle } = useDismissableLayer({
  open,
  reference: triggerRef,
  floating: panelRef,
  onDismiss: closeAndFocusTrigger,
  closeOnEscape: computed(() => props.closeOnEscape),
  closeOnOutsidePointer: computed(() => props.closeOnOutsidePointer)
})

function handleClick() {
  if (props.trigger === 'click') {
    toggle()
  }
}

function handleMouseenter() {
  if (props.trigger === 'hover') {
    requestOpen(true, true)
  }
}

function handleMouseleave() {
  if (props.trigger === 'hover') {
    requestOpen(false, true)
  }
}

function handleFocusin() {
  if (props.trigger === 'hover' || props.trigger === 'focus') {
    requestOpen(true, true)
  }
}

function handleFocusout() {
  if (props.trigger === 'hover' || props.trigger === 'focus') {
    requestOpen(false, true)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeAndFocusTrigger()
    return
  }

  if (props.trigger === 'manual' || props.disabled) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  }
}

onBeforeUnmount(clearOpenTimer)
</script>

<template>
  <span class="yok-popover" :class="`yok-popover--${placement}`">
    <span
      ref="triggerRef"
      class="yok-popover__trigger yok-focus-ring"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="disabled ? undefined : popoverId"
      :aria-disabled="disabled ? 'true' : undefined"
      @click="handleClick"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      @focusin="handleFocusin"
      @focusout="handleFocusout"
      @keydown="handleKeydown"
    >
      <slot name="trigger">Open popover</slot>
    </span>
    <Transition name="yok-floating-layer">
      <span
        v-if="open"
        :id="popoverId"
        ref="panelRef"
        class="yok-popover__panel"
        role="dialog"
        :aria-label="title || 'Popover'"
        :style="[floatingStyles, layerStyle]"
      >
        <strong v-if="title" class="yok-popover__title">{{ title }}</strong>
        <span v-if="content" class="yok-popover__content">{{ content }}</span>
        <slot />
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.yok-popover {
  display: inline-flex;
  justify-self: start;
  max-width: 100%;
  min-width: 0;
}

.yok-popover__trigger {
  display: inline-flex;
  border-radius: var(--yok-radius-md);
  cursor: pointer;
}

.yok-popover__panel {
  position: fixed;
  inset: auto;
  z-index: var(--yok-zIndex-floating, 1000);
  display: grid;
  width: max-content;
  max-width: min(280px, calc(100vw - 32px));
  gap: var(--yok-space-2);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-text);
  overflow-wrap: anywhere;
  padding: var(--yok-space-4);
  word-break: break-word;
}

.yok-popover__title {
  font-size: 14px;
}

.yok-popover__content {
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}
</style>
