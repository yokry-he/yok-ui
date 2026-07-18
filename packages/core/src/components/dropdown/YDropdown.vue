<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import YInternalIcon from '../_internal/YInternalIcon.vue'

defineOptions({
  name: 'YDropdown'
})

export interface YDropdownItem {
  label: string
  value: string
  disabled?: boolean
}

export type YDropdownPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
export type YDropdownTrigger = 'click' | 'hover' | 'contextmenu' | 'manual'

interface Props {
  open?: boolean
  items: YDropdownItem[]
  label?: string
  align?: 'start' | 'end'
  placement?: YDropdownPlacement
  trigger?: YDropdownTrigger
  disabled?: boolean
  hideOnClick?: boolean
  closeOnEscape?: boolean
  closeOnOutsidePointer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: undefined,
  label: 'Open menu',
  align: 'start',
  placement: undefined,
  trigger: 'click',
  disabled: false,
  hideOnClick: true,
  closeOnEscape: true,
  closeOnOutsidePointer: true
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [item: YDropdownItem]
}>()

const generatedId = useId()
const internalOpen = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLButtonElement[]>([])
const pendingFocus = ref<'first' | 'last' | null>(null)

const isControlled = computed(() => props.open !== undefined)
const open = computed(() => props.disabled ? false : isControlled.value ? Boolean(props.open) : internalOpen.value)
const menuId = computed(() => `yok-dropdown-${generatedId}`)
const floatingPlacement = computed(() => props.placement ?? (props.align === 'end' ? 'bottom-end' : 'bottom-start'))
const rootClasses = computed(() => [
  `yok-dropdown--${props.align}`,
  `yok-dropdown--${floatingPlacement.value}`
])
const { floatingStyles } = useFloatingLayer(triggerRef, menuRef, {
  open,
  placement: floatingPlacement,
  offset: 8
})
const enabledItems = computed(() =>
  props.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.disabled)
)

function setItemRef(element: HTMLButtonElement | null, index: number) {
  if (element) {
    itemRefs.value[index] = element
  }
}

function focusItem(index: number) {
  itemRefs.value[index]?.focus()
}

function focusFirstItem() {
  const firstEnabledItem = enabledItems.value[0]

  if (firstEnabledItem) {
    focusItem(firstEnabledItem.index)
  }
}

function focusLastItem() {
  const lastEnabledItem = enabledItems.value[enabledItems.value.length - 1]

  if (lastEnabledItem) {
    focusItem(lastEnabledItem.index)
  }
}

function focusRelativeItem(direction: 1 | -1) {
  const focusableItems = enabledItems.value

  if (focusableItems.length === 0) {
    return
  }

  const activeIndex = itemRefs.value.findIndex((element) => element === document.activeElement)
  const enabledPosition = focusableItems.findIndex(({ index }) => index === activeIndex)
  const nextPosition =
    enabledPosition === -1
      ? direction === 1
        ? 0
        : focusableItems.length - 1
      : (enabledPosition + direction + focusableItems.length) % focusableItems.length

  focusItem(focusableItems[nextPosition].index)
}

function setOpen(value: boolean) {
  if (props.disabled || open.value === value) {
    return
  }

  if (!isControlled.value) {
    internalOpen.value = value
  }
  emit('update:open', value)
}

function toggle() {
  if (props.trigger === 'manual') {
    return
  }

  setOpen(!open.value)
}

function openAndFocusFirst() {
  if (props.disabled || props.trigger === 'manual') {
    return
  }

  pendingFocus.value = 'first'
  setOpen(true)
}

function selectItem(item: YDropdownItem) {
  if (item.disabled) {
    return
  }

  emit('select', item)
  if (props.hideOnClick) {
    setOpen(false)
    void nextTick(() => triggerRef.value?.focus())
  }
}

function closeAndFocusTrigger() {
  setOpen(false)
  void nextTick(() => triggerRef.value?.focus())
}

const { layerStyle } = useDismissableLayer({
  open,
  reference: triggerRef,
  floating: menuRef,
  onDismiss: closeAndFocusTrigger,
  closeOnEscape: computed(() => props.closeOnEscape),
  closeOnOutsidePointer: computed(() => props.closeOnOutsidePointer)
})

function handleRootMouseenter() {
  if (props.trigger === 'hover') {
    setOpen(true)
  }
}

function handleRootMouseleave() {
  if (props.trigger === 'hover') {
    setOpen(false)
  }
}

function handleTriggerClick() {
  if (props.trigger === 'click') {
    toggle()
  }
}

function handleTriggerContextmenu(event: MouseEvent) {
  if (props.trigger !== 'contextmenu') {
    return
  }

  event.preventDefault()
  toggle()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled || props.trigger === 'manual') {
    return
  }

  if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    openAndFocusFirst()
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    pendingFocus.value = 'last'
    setOpen(true)
  }
}

function handleMenuKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusRelativeItem(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusRelativeItem(-1)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    focusFirstItem()
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    focusLastItem()
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeAndFocusTrigger()
  }
}

watch(
  open,
  (open) => {
    if (!open) {
      itemRefs.value = []
      pendingFocus.value = null
      return
    }

    if (pendingFocus.value === 'first') {
      void nextTick(focusFirstItem)
      return
    }

    if (pendingFocus.value === 'last') {
      void nextTick(focusLastItem)
    }
  }
)
</script>

<template>
  <div
    class="yok-dropdown"
    :class="rootClasses"
    @mouseenter="handleRootMouseenter"
    @mouseleave="handleRootMouseleave"
  >
    <button
      ref="triggerRef"
      class="yok-dropdown__trigger yok-focus-ring"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="disabled ? undefined : menuId"
      :aria-disabled="disabled ? 'true' : undefined"
      :disabled="disabled"
      @click="handleTriggerClick"
      @contextmenu="handleTriggerContextmenu"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger">{{ label }}</slot>
      <span class="yok-dropdown__chevron" aria-hidden="true">
        <YInternalIcon name="chevronDown" />
      </span>
    </button>
    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        :id="menuId"
        ref="menuRef"
        class="yok-dropdown__menu"
        role="menu"
        :style="[floatingStyles, layerStyle]"
        @keydown="handleMenuKeydown"
      >
        <button
          v-for="item in items"
          :key="item.value"
          :ref="(element) => setItemRef(element as HTMLButtonElement | null, items.indexOf(item))"
          class="yok-dropdown__item yok-focus-ring"
          type="button"
          role="menuitem"
          :disabled="item.disabled"
          @click="selectItem(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.yok-dropdown {
  display: inline-flex;
}

.yok-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  min-height: 38px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-weight: 650;
  padding: 0 var(--yok-space-3);
}

.yok-dropdown__chevron {
  display: inline-flex;
  flex: 0 0 16px;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--yok-color-textMuted);
  font-size: 16px;
  line-height: 1;
}

.yok-dropdown__menu {
  z-index: var(--yok-zIndex-floating, 1000);
  display: grid;
  min-width: 180px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-2);
}

.yok-dropdown__item {
  min-height: 36px;
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font-weight: 600;
  padding: 0 var(--yok-space-3);
  text-align: left;
}

.yok-dropdown__item:hover:not(:disabled) {
  background: var(--yok-color-primarySoft);
}

.yok-dropdown__item:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
