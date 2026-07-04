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
  YCascaderLoadChildren,
  YCascaderLoadErrorPayload,
  YCascaderLoadPayload,
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
  lazy?: boolean
  load?: YCascaderLoadChildren
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
  lazy: false,
  separator: ' / ',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: YCascaderValue | YCascaderMultipleValue]
  change: [payload: YCascaderSelectPayload | YCascaderMultipleSelectPayload]
  clear: []
  load: [payload: YCascaderLoadPayload]
  loadError: [payload: YCascaderLoadErrorPayload]
}>()

function getSingleModelValue() {
  return props.multiple ? [] : props.modelValue as YCascaderValue
}

const open = ref(false)
const yokConfig = useYokConfig()
const controlRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)
const loadedChildrenByPath = ref(new Map<string, YCascaderOption[]>())
const loadingPathKeys = ref(new Set<string>())
const loadErrorByPath = ref(new Map<string, unknown>())

function getCascaderPathKey(path: YCascaderOption[]) {
  return getPathValue(path).join('\u0000')
}

function replaceLoadedChildren(path: YCascaderOption[], children: YCascaderOption[]) {
  const nextLoadedChildren = new Map(loadedChildrenByPath.value)

  nextLoadedChildren.set(getCascaderPathKey(path), children)
  loadedChildrenByPath.value = nextLoadedChildren
}

function setLoadingPath(path: YCascaderOption[], loading: boolean) {
  const nextLoadingPathKeys = new Set(loadingPathKeys.value)
  const pathKey = getCascaderPathKey(path)

  if (loading) {
    nextLoadingPathKeys.add(pathKey)
  } else {
    nextLoadingPathKeys.delete(pathKey)
  }
  loadingPathKeys.value = nextLoadingPathKeys
}

function setLoadError(path: YCascaderOption[], error: unknown | null) {
  const nextLoadErrorByPath = new Map(loadErrorByPath.value)
  const pathKey = getCascaderPathKey(path)

  if (error) {
    nextLoadErrorByPath.set(pathKey, error)
  } else {
    nextLoadErrorByPath.delete(pathKey)
  }
  loadErrorByPath.value = nextLoadErrorByPath
}

function mergeLoadedChildren(options: YCascaderOption[], parentPath: YCascaderOption[] = []): YCascaderOption[] {
  return options.map((option) => {
    const path = [...parentPath, option]
    const loadedChildren = loadedChildrenByPath.value.get(getCascaderPathKey(path))
    const children = loadedChildren ?? getOptionChildren(option)

    if (!children.length && !loadedChildren) {
      return option
    }

    return {
      ...option,
      children: mergeLoadedChildren(children, path)
    }
  })
}

const cascaderOptions = computed(() => mergeLoadedChildren(props.options))
const activePath = ref<YCascaderOption[]>(findOptionPath(cascaderOptions.value, getSingleModelValue()))
const activeColumn = ref(0)
const activeIndexes = ref<number[]>([])

const panelId = computed(() => `yok-cascader-${props.label || 'panel'}`.replace(/\s+/g, '-').toLowerCase())
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)
const singleValue = computed(() => props.multiple ? [] : props.modelValue as YCascaderValue)
const multipleValue = computed(() => props.multiple ? props.modelValue as YCascaderMultipleValue : [])
const selectedPath = computed(() => findOptionPath(cascaderOptions.value, singleValue.value))
const selectedMultipleValues = computed(() => getValidMultipleCascaderValue(cascaderOptions.value, multipleValue.value))
const selectedMultipleLabels = computed(() => getMultiplePathLabels(cascaderOptions.value, selectedMultipleValues.value))
const displayValue = computed(() => props.multiple ? '' : getPathLabels(selectedPath.value).join(props.separator))
const hasSelection = computed(() => props.multiple ? selectedMultipleValues.value.length > 0 : singleValue.value.length > 0)
const multipleSummary = computed(() => {
  const count = selectedMultipleValues.value.length

  return count ? `${count} selected` : ''
})
const columns = computed(() => createCascaderColumns(cascaderOptions.value, activePath.value))
const { floatingStyles } = useFloatingLayer(controlRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 8
})

watch(() => props.modelValue, (value) => {
  activePath.value = props.multiple ? activePath.value : findOptionPath(cascaderOptions.value, value as YCascaderValue)
})

watch(() => props.options, () => {
  loadedChildrenByPath.value = new Map()
  loadingPathKeys.value = new Set()
  loadErrorByPath.value = new Map()
  activePath.value = props.multiple ? activePath.value : findOptionPath(cascaderOptions.value, singleValue.value)
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
    labels: getMultiplePathLabels(cascaderOptions.value, value),
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
    activePath.value = findOptionPath(cascaderOptions.value, selectedMultipleValues.value[0])
  }
  activeColumn.value = Math.max(0, activePath.value.length - 1)
  if (!activePath.value.length && cascaderOptions.value[0]) {
    activePath.value = [cascaderOptions.value[0]]
    activeColumn.value = 0
  }
  activeIndexes.value = activePath.value.map((option, index) => {
    const columnOptions = index === 0 ? cascaderOptions.value : getOptionChildren(activePath.value[index - 1])

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

function getOptionPath(columnIndex: number, option: YCascaderOption) {
  return [
    ...activePath.value.slice(0, columnIndex),
    option
  ]
}

function isOptionLoading(path: YCascaderOption[]) {
  return loadingPathKeys.value.has(getCascaderPathKey(path))
}

function getOptionLoadError(path: YCascaderOption[]) {
  return loadErrorByPath.value.get(getCascaderPathKey(path))
}

function canLazyLoadOption(option: YCascaderOption, path: YCascaderOption[]) {
  return Boolean(
    props.lazy &&
    props.load &&
    option.isLeaf !== true &&
    getOptionChildren(option).length === 0 &&
    !loadedChildrenByPath.value.has(getCascaderPathKey(path))
  )
}

function hasOptionChildren(option: YCascaderOption, path: YCascaderOption[]) {
  return getOptionChildren(option).length > 0 || canLazyLoadOption(option, path)
}

function isOptionSelectable(option: YCascaderOption, path: YCascaderOption[]) {
  return !canLazyLoadOption(option, path) && isLeafOption(option)
}

async function loadLazyOption(option: YCascaderOption, path: YCascaderOption[]) {
  if (!props.load || isOptionLoading(path)) {
    return
  }

  try {
    setLoadingPath(path, true)
    setLoadError(path, null)

    const children = await props.load(option, path)

    replaceLoadedChildren(path, children)
    await nextTick()
    activePath.value = findOptionPath(cascaderOptions.value, getPathValue(path))
    activeColumn.value = Math.min(path.length, columns.value.length - 1)
    activeIndexes.value[activeColumn.value] = activeIndexes.value[activeColumn.value] ?? 0
    emit('load', {
      option,
      path,
      children
    })
  } catch (error) {
    setLoadError(path, error)
    emit('loadError', {
      option,
      path,
      error
    })
  } finally {
    setLoadingPath(path, false)
    focusActiveOption()
  }
}

function selectOption(option: YCascaderOption, columnIndex: number, optionIndex: number) {
  setActiveOption(option, columnIndex, optionIndex)

  if (option.disabled) {
    return
  }

  const path = getOptionPath(columnIndex, option)

  if (canLazyLoadOption(option, path)) {
    void loadLazyOption(option, path)
    return
  }

  if (isOptionSelectable(option, path)) {
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

    if (option) {
      const path = getOptionPath(activeColumn.value, option)

      setActiveOption(option, activeColumn.value, optionIndex)

      if (canLazyLoadOption(option, path)) {
        void loadLazyOption(option, path)
        return
      }
    }

    if (option && getOptionChildren(option).length) {
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
  const path = getOptionPath(columnIndex, option)

  if (!props.multiple || !isOptionSelectable(option, path)) {
    return false
  }

  return isCascaderValueSelected(
    getPathValue(path),
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
              'yok-cascader__option--disabled': option.disabled,
              'yok-cascader__option--loading': isOptionLoading(getOptionPath(columnIndex, option)),
              'yok-cascader__option--error': getOptionLoadError(getOptionPath(columnIndex, option))
            }"
            type="button"
            role="option"
            :disabled="option.disabled"
            :aria-selected="multiple ? (isOptionChecked(option, columnIndex) ? 'true' : 'false') : (activePath[columnIndex]?.value === option.value ? 'true' : 'false')"
            :aria-disabled="option.disabled ? 'true' : undefined"
            :aria-busy="isOptionLoading(getOptionPath(columnIndex, option)) ? 'true' : undefined"
            :data-active-cascader-option="isOptionActive(columnIndex, optionIndex) ? 'true' : 'false'"
            @mouseenter="setActiveOption(option, columnIndex, optionIndex)"
            @click="selectOption(option, columnIndex, optionIndex)"
          >
            <span v-if="multiple" class="yok-cascader__check" aria-hidden="true">
              {{ isOptionChecked(option, columnIndex) ? '✓' : '' }}
            </span>
            <span class="yok-cascader__option-label">
              <slot name="option" :option="option" :level="column.level">
                {{ option.label }}
              </slot>
            </span>
            <span
              v-if="isOptionLoading(getOptionPath(columnIndex, option))"
              class="yok-cascader__option-status"
              role="status"
              aria-live="polite"
            >
              Loading {{ option.label }}
            </span>
            <span
              v-else-if="getOptionLoadError(getOptionPath(columnIndex, option))"
              class="yok-cascader__option-error"
              role="alert"
            >
              Failed to load {{ option.label }}
            </span>
            <span
              v-if="hasOptionChildren(option, getOptionPath(columnIndex, option))"
              class="yok-cascader__option-arrow"
              aria-hidden="true"
            >
              ›
            </span>
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

.yok-cascader__option--loading {
  color: var(--yok-color-primary);
}

.yok-cascader__option--error {
  color: var(--yok-color-danger);
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

.yok-cascader__option-status,
.yok-cascader__option-error {
  grid-column: 1 / -1;
  overflow: hidden;
  color: currentcolor;
  font-size: 12px;
  font-weight: 650;
  opacity: 0.78;
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
