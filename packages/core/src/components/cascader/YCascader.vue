<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  createCascaderColumns,
  findOptionPath,
  getOptionChildren,
  getMultiplePathLabels,
  getPathLabels,
  getPathValue,
  getValidMultipleCascaderValue,
  isCascaderValueSelected,
  isLeafOption
} from './cascader'
import type {
  YCascaderMultipleSelectPayload,
  YCascaderMultipleValue,
  YCascaderOption,
  YCascaderSelectPayload,
  YCascaderValue
} from './types'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YCascader'
})

interface Props {
  modelValue?: YCascaderValue | YCascaderMultipleValue
  options: YCascaderOption[]
  multiple?: boolean
  label?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  separator?: string
  error?: string
  size?: YokConfigSize
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  multiple: false,
  label: '',
  placeholder: 'Select option',
  disabled: false,
  clearable: true,
  separator: ' / ',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: YCascaderValue | YCascaderMultipleValue]
  change: [payload: YCascaderSelectPayload | YCascaderMultipleSelectPayload]
  clear: []
}>()

function getSingleModelValue() {
  return props.multiple ? [] : props.modelValue as YCascaderValue
}

const open = ref(false)
const yokConfig = useYokConfig()
const controlRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)
const activePath = ref<YCascaderOption[]>(findOptionPath(props.options, getSingleModelValue()))
const activeColumn = ref(0)
const activeIndexes = ref<number[]>([])

const panelId = computed(() => `yok-cascader-${props.label || 'panel'}`.replace(/\s+/g, '-').toLowerCase())
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)
const singleValue = computed(() => props.multiple ? [] : props.modelValue as YCascaderValue)
const multipleValue = computed(() => props.multiple ? props.modelValue as YCascaderMultipleValue : [])
const selectedPath = computed(() => findOptionPath(props.options, singleValue.value))
const selectedMultipleValues = computed(() => getValidMultipleCascaderValue(props.options, multipleValue.value))
const selectedMultipleLabels = computed(() => getMultiplePathLabels(props.options, selectedMultipleValues.value))
const displayValue = computed(() => props.multiple ? '' : getPathLabels(selectedPath.value).join(props.separator))
const hasSelection = computed(() => props.multiple ? selectedMultipleValues.value.length > 0 : singleValue.value.length > 0)
const multipleSummary = computed(() => {
  const count = selectedMultipleValues.value.length

  return count ? `${count} selected` : ''
})
const columns = computed(() => createCascaderColumns(props.options, activePath.value))
const { floatingStyles } = useFloatingLayer(controlRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 8
})

watch(() => props.modelValue, (value) => {
  activePath.value = props.multiple ? activePath.value : findOptionPath(props.options, value as YCascaderValue)
})

watch(() => props.options, () => {
  activePath.value = props.multiple ? activePath.value : findOptionPath(props.options, singleValue.value)
})

function emitSelection(option: YCascaderOption) {
  const value = getPathValue(activePath.value)
  const labels = getPathLabels(activePath.value)

  emit('update:modelValue', value)
  emit('change', {
    value,
    labels,
    option
  })
}

function emitMultipleSelection(option: YCascaderOption) {
  const checkedValue = getPathValue(activePath.value)
  const checked = !isCascaderValueSelected(checkedValue, selectedMultipleValues.value)
  const value = checked
    ? [...selectedMultipleValues.value, checkedValue]
    : selectedMultipleValues.value.filter((selectedValue) => selectedValue.join('\u0000') !== checkedValue.join('\u0000'))

  emit('update:modelValue', value)
  emit('change', {
    value,
    labels: getMultiplePathLabels(props.options, value),
    option,
    checked,
    checkedValue
  })
}

function focusActiveOption() {
  nextTick(() => {
    panelRef.value?.querySelector<HTMLButtonElement>('[data-active-cascader-option="true"]')?.focus()
  })
}

function openPanel() {
  if (props.disabled) {
    return
  }

  activePath.value = selectedPath.value
  if (props.multiple && !activePath.value.length && selectedMultipleValues.value[0]) {
    activePath.value = findOptionPath(props.options, selectedMultipleValues.value[0])
  }
  activeColumn.value = Math.max(0, activePath.value.length - 1)
  if (!activePath.value.length && props.options[0]) {
    activePath.value = [props.options[0]]
    activeColumn.value = 0
  }
  activeIndexes.value = activePath.value.map((option, index) => {
    const columnOptions = index === 0 ? props.options : getOptionChildren(activePath.value[index - 1])

    return Math.max(0, columnOptions.findIndex((item) => item.value === option.value))
  })
  open.value = true
  focusActiveOption()
}

function closePanel() {
  open.value = false
  inputRef.value?.focus()
}

const { layerStyle } = useDismissableLayer({
  open,
  reference: controlRef,
  floating: panelRef,
  onDismiss: closePanel
})

function togglePanel() {
  if (open.value) {
    closePanel()
  } else {
    openPanel()
  }
}

function setActiveOption(option: YCascaderOption, columnIndex: number, optionIndex: number) {
  activeColumn.value = columnIndex
  activeIndexes.value[columnIndex] = optionIndex

  if (option.disabled) {
    focusActiveOption()
    return
  }

  activePath.value = [
    ...activePath.value.slice(0, columnIndex),
    option
  ]
  focusActiveOption()
}

function selectOption(option: YCascaderOption, columnIndex: number, optionIndex: number) {
  setActiveOption(option, columnIndex, optionIndex)

  if (!option.disabled && isLeafOption(option)) {
    if (props.multiple) {
      emitMultipleSelection(option)
    } else {
      emitSelection(option)
      closePanel()
    }
  }
}

function clearValue() {
  if (props.disabled || !hasSelection.value) {
    return
  }

  activePath.value = []
  emit('update:modelValue', [])
  emit('clear')
  inputRef.value?.focus()
}

function moveActive(amount: number) {
  const currentOptions = columns.value[activeColumn.value]?.options ?? []

  if (!currentOptions.length) {
    return
  }

  const currentIndex = activeIndexes.value[activeColumn.value] ?? 0
  const nextIndex = Math.min(Math.max(0, currentIndex + amount), currentOptions.length - 1)
  const option = currentOptions[nextIndex]

  if (option) {
    setActiveOption(option, activeColumn.value, nextIndex)
  }
}

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPanel()
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
  const column = columns.value[activeColumn.value]
  const optionIndex = activeIndexes.value[activeColumn.value] ?? 0
  const option = column?.options[optionIndex]

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()

    if (option && getOptionChildren(option).length) {
      setActiveOption(option, activeColumn.value, optionIndex)
      activeColumn.value = Math.min(activeColumn.value + 1, columns.value.length - 1)
      activeIndexes.value[activeColumn.value] = activeIndexes.value[activeColumn.value] ?? 0
      focusActiveOption()
    }

    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    activeColumn.value = Math.max(0, activeColumn.value - 1)
    focusActiveOption()
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && option) {
    event.preventDefault()
    selectOption(option, activeColumn.value, optionIndex)
  }
}

function isOptionActive(columnIndex: number, optionIndex: number) {
  return activeColumn.value === columnIndex && (activeIndexes.value[columnIndex] ?? 0) === optionIndex
}

function isOptionChecked(option: YCascaderOption, columnIndex: number) {
  if (!props.multiple || !isLeafOption(option)) {
    return false
  }

  return isCascaderValueSelected(
    getPathValue([...activePath.value.slice(0, columnIndex), option]),
    selectedMultipleValues.value
  )
}
</script>

<template>
  <div
    class="yok-cascader"
    :class="[
      `yok-cascader--${resolvedSize}`,
      `yok-cascader--${resolvedDensity}`,
      {
        'yok-cascader--open': open,
        'yok-cascader--disabled': disabled
      }
    ]"
  >
    <label v-if="label" class="yok-cascader__label" :for="`${panelId}-input`">{{ label }}</label>
    <div ref="controlRef" class="yok-cascader__control">
      <input
        :id="`${panelId}-input`"
        ref="inputRef"
        class="yok-cascader__input yok-focus-ring"
        type="text"
        readonly
        :value="displayValue"
        :placeholder="multipleSummary || placeholder"
        :disabled="disabled"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="panelId"
        aria-haspopup="dialog"
        :aria-invalid="error ? 'true' : 'false'"
        @click="openPanel"
        @keydown="handleInputKeydown"
      />
      <button
        class="yok-cascader__trigger yok-focus-ring"
        type="button"
        :disabled="disabled"
        :aria-label="open ? 'Close cascader' : 'Open cascader'"
        @click="togglePanel"
      >
        <span aria-hidden="true">›</span>
      </button>
      <button
        v-if="clearable && hasSelection"
        class="yok-cascader__clear yok-focus-ring"
        type="button"
        :disabled="disabled"
        aria-label="Clear selection"
        @click="clearValue"
      >
        ×
      </button>
    </div>
    <div v-if="multiple && selectedMultipleLabels.length" class="yok-cascader__tags" aria-label="Selected options">
      <span
        v-for="labels in selectedMultipleLabels"
        :key="labels.join(separator)"
        class="yok-cascader__tag"
      >
        {{ labels.join(separator) }}
      </span>
    </div>
    <p v-if="error" class="yok-cascader__error" role="alert">{{ error }}</p>

    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        :id="panelId"
        ref="panelRef"
        class="yok-cascader__panel"
        role="dialog"
        aria-label="Choose option"
        :style="[floatingStyles, layerStyle]"
        @keydown="handlePanelKeydown"
      >
        <div
          v-for="(column, columnIndex) in columns"
          :key="column.level"
          class="yok-cascader__column"
          role="listbox"
          :aria-multiselectable="multiple ? 'true' : undefined"
          :aria-label="`Level ${column.level + 1}`"
        >
          <button
            v-for="(option, optionIndex) in column.options"
            :key="option.value"
            class="yok-cascader__option yok-focus-ring"
            :class="{
              'yok-cascader__option--multiple': multiple,
              'yok-cascader__option--active': activePath[columnIndex]?.value === option.value,
              'yok-cascader__option--checked': isOptionChecked(option, columnIndex),
              'yok-cascader__option--disabled': option.disabled
            }"
            type="button"
            role="option"
            :disabled="option.disabled"
            :aria-selected="multiple ? (isOptionChecked(option, columnIndex) ? 'true' : 'false') : (activePath[columnIndex]?.value === option.value ? 'true' : 'false')"
            :aria-disabled="option.disabled ? 'true' : undefined"
            :data-active-cascader-option="isOptionActive(columnIndex, optionIndex) ? 'true' : 'false'"
            @mouseenter="setActiveOption(option, columnIndex, optionIndex)"
            @click="selectOption(option, columnIndex, optionIndex)"
          >
            <span v-if="multiple" class="yok-cascader__check" aria-hidden="true">
              {{ isLeafOption(option) && isOptionChecked(option, columnIndex) ? '✓' : '' }}
            </span>
            <span class="yok-cascader__option-label">
              <slot name="option" :option="option" :level="column.level">
                {{ option.label }}
              </slot>
            </span>
            <span v-if="option.children?.length" class="yok-cascader__option-arrow" aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.yok-cascader {
  --yok-cascader-input-min-height: 38px;
  --yok-cascader-input-font-size: 14px;
  --yok-cascader-action-size: 30px;
  --yok-cascader-action-inset: 4px;
  --yok-cascader-input-padding-end: 72px;
  --yok-cascader-option-min-height: 34px;
  display: grid;
  min-width: 0;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-cascader--sm {
  --yok-cascader-input-min-height: 32px;
  --yok-cascader-input-font-size: 13px;
  --yok-cascader-action-size: 24px;
  --yok-cascader-input-padding-end: 60px;
  --yok-cascader-option-min-height: 30px;
}

.yok-cascader--lg {
  --yok-cascader-input-min-height: 44px;
  --yok-cascader-input-font-size: 15px;
  --yok-cascader-action-size: 34px;
  --yok-cascader-action-inset: 5px;
  --yok-cascader-input-padding-end: 82px;
  --yok-cascader-option-min-height: 38px;
}

.yok-cascader--compact {
  gap: var(--yok-space-1);
}

.yok-cascader--compact.yok-cascader--md {
  --yok-cascader-input-min-height: 34px;
  --yok-cascader-action-size: 26px;
  --yok-cascader-input-padding-end: 64px;
  --yok-cascader-option-min-height: 32px;
}

.yok-cascader--compact.yok-cascader--lg {
  --yok-cascader-input-min-height: 40px;
  --yok-cascader-action-size: 30px;
  --yok-cascader-action-inset: 5px;
  --yok-cascader-input-padding-end: 74px;
  --yok-cascader-option-min-height: 34px;
}

.yok-cascader__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-cascader__control {
  position: relative;
  display: flex;
  min-width: 0;
}

.yok-cascader__input {
  min-height: var(--yok-cascader-input-min-height);
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: var(--yok-cascader-input-font-size);
  padding: 0 var(--yok-cascader-input-padding-end) 0 var(--yok-space-3);
}

.yok-cascader__input[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-cascader__trigger,
.yok-cascader__clear {
  position: absolute;
  inset-block: var(--yok-cascader-action-inset);
  display: grid;
  width: var(--yok-cascader-action-size);
  place-items: center;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 18px;
}

.yok-cascader__trigger {
  inset-inline-end: var(--yok-cascader-action-inset);
}

.yok-cascader__clear {
  inset-inline-end: calc(var(--yok-cascader-action-size) + var(--yok-cascader-action-inset) + 2px);
}

.yok-cascader__trigger:hover,
.yok-cascader__clear:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-cascader__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-cascader--compact .yok-cascader__tags {
  gap: var(--yok-space-1);
}

.yok-cascader__tag {
  max-width: 100%;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 18%, var(--yok-color-border));
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 62%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 750;
  padding: 3px var(--yok-space-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-cascader__error {
  margin: 0;
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-cascader__panel {
  z-index: var(--yok-zIndex-floating, 1000);
  display: flex;
  max-width: min(720px, calc(100vw - 32px));
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-2);
}

.yok-cascader__column {
  display: grid;
  min-width: 160px;
  max-height: 240px;
  align-content: start;
  gap: var(--yok-space-1);
  overflow: auto;
  border-inline-end: 1px solid var(--yok-color-border);
  padding-inline-end: var(--yok-space-2);
}

.yok-cascader__column + .yok-cascader__column {
  padding-inline-start: var(--yok-space-2);
}

.yok-cascader__column:last-child {
  border-inline-end: 0;
}

.yok-cascader__option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  min-height: var(--yok-cascader-option-min-height);
  align-items: center;
  gap: var(--yok-space-2);
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  padding: 0 var(--yok-space-2);
  text-align: start;
}

.yok-cascader__option--multiple {
  grid-template-columns: 18px minmax(0, 1fr) auto;
}

.yok-cascader__option:hover:not(:disabled),
.yok-cascader__option--active {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-cascader__option--checked {
  color: var(--yok-color-primary);
  font-weight: 750;
}

.yok-cascader__option--disabled {
  cursor: not-allowed;
  opacity: 0.44;
}

.yok-cascader__check {
  display: grid;
  width: 16px;
  height: 16px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 34%, var(--yok-color-border));
  border-radius: var(--yok-radius-sm);
  color: var(--yok-color-primary);
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
}

.yok-cascader__option--checked .yok-cascader__check {
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
}

.yok-cascader__option-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-cascader__option-arrow {
  color: var(--yok-color-textMuted);
  font-weight: 800;
}

.yok-cascader--disabled {
  opacity: 0.68;
}
</style>
