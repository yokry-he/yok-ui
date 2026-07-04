<script setup lang="ts">
import { computed, ref } from 'vue'
import YFloatButton, { type YFloatButtonShape, type YFloatButtonType } from './YFloatButton.vue'

defineOptions({
  name: 'YFloatButtonGroup'
})

export type YFloatButtonGroupTrigger = 'click' | 'hover'

export interface YFloatButtonItem {
  key: string
  label: string
  icon?: string
  type?: YFloatButtonType
  disabled?: boolean
}

interface Props {
  label: string
  items?: YFloatButtonItem[]
  open?: boolean
  trigger?: YFloatButtonGroupTrigger
  type?: YFloatButtonType
  shape?: YFloatButtonShape
  icon?: string
  right?: number
  bottom?: number
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  open: undefined,
  trigger: 'click',
  type: 'default',
  shape: 'circle',
  icon: '+',
  right: 24,
  bottom: 24,
  gap: 12
})

const emit = defineEmits<{
  'update:open': [open: boolean]
  openChange: [open: boolean]
  select: [item: YFloatButtonItem]
}>()

const internalOpen = ref(false)
const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() => (isControlled.value ? Boolean(props.open) : internalOpen.value))
const rootStyle = computed(() => ({
  '--yok-float-button-right': `${props.right}px`,
  '--yok-float-button-bottom': `${props.bottom}px`,
  '--yok-float-button-gap': `${props.gap}px`
}))

function setOpen(open: boolean) {
  if (!isControlled.value) {
    internalOpen.value = open
  }

  emit('update:open', open)
  emit('openChange', open)
}

function toggleOpen() {
  setOpen(!isOpen.value)
}

function handleMouseEnter() {
  if (props.trigger === 'hover') {
    setOpen(true)
  }
}

function handleMouseLeave() {
  if (props.trigger === 'hover') {
    setOpen(false)
  }
}

function handleTriggerClick() {
  if (props.trigger === 'click') {
    toggleOpen()
  }
}

function handleItemClick(item: YFloatButtonItem) {
  if (item.disabled) {
    return
  }

  emit('select', item)
}
</script>

<template>
  <div
    class="yok-float-button-group"
    :class="[`yok-float-button-group--${shape}`, { 'is-open': isOpen }]"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div v-if="isOpen" class="yok-float-button-group__items" role="menu" :aria-label="`${label} actions`">
      <button
        v-for="item in items"
        :key="item.key"
        class="yok-float-button-group__item yok-focus-ring"
        :class="[`yok-float-button-group__item--${item.type || type}`]"
        type="button"
        role="menuitem"
        data-yok-float-button-group-item
        :aria-label="item.label"
        :disabled="item.disabled"
        @click="handleItemClick(item)"
      >
        <span class="yok-float-button-group__item-icon" aria-hidden="true">{{ item.icon || '•' }}</span>
        <span class="yok-float-button-group__item-label">{{ item.label }}</span>
      </button>
      <slot />
    </div>

    <YFloatButton
      class="yok-float-button-group__trigger"
      data-yok-float-button-group-trigger
      :label="label"
      :icon="icon"
      :type="type"
      :shape="shape"
      :right="right"
      :bottom="bottom"
      :aria-expanded="String(isOpen)"
      aria-haspopup="menu"
      @click="handleTriggerClick"
    />
  </div>
</template>

<style scoped>
.yok-float-button-group {
  position: fixed;
  right: var(--yok-float-button-right);
  bottom: var(--yok-float-button-bottom);
  z-index: var(--yok-zIndex-popover);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--yok-float-button-gap);
}

.yok-float-button-group__trigger {
  position: static;
}

.yok-float-button-group__items {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--yok-space-2);
}

.yok-float-button-group__item {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  max-width: min(260px, calc(100vw - 48px));
  min-height: 40px;
  padding: 0 14px 0 10px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-pill);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.yok-float-button-group--square .yok-float-button-group__item {
  border-radius: var(--yok-radius-xl);
}

.yok-float-button-group__item:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--yok-color-primary) 36%, var(--yok-color-border));
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-float-button-group__item:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-float-button-group__item--primary {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primary);
  color: var(--yok-color-primaryContrast);
}

.yok-float-button-group__item-icon {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: 0.875rem;
  line-height: 1;
}

.yok-float-button-group__item-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
