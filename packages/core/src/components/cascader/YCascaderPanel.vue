<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  createCascaderColumns,
  findOptionPath,
  getMultiplePathLabels,
  getOptionChildren,
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

defineOptions({
  name: 'YCascaderPanel'
})

interface Props {
  modelValue?: YCascaderValue | YCascaderMultipleValue
  options: YCascaderOption[]
  multiple?: boolean
  disabled?: boolean
  lazy?: boolean
  load?: YCascaderLoadChildren
  separator?: string
  ariaLabel?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  multiple: false,
  disabled: false,
  lazy: false,
  separator: ' / ',
  ariaLabel: 'Cascader panel',
  emptyText: 'No options'
})

const emit = defineEmits<{
  'update:modelValue': [value: YCascaderValue | YCascaderMultipleValue]
  change: [payload: YCascaderSelectPayload | YCascaderMultipleSelectPayload]
  load: [payload: YCascaderLoadPayload]
  loadError: [payload: YCascaderLoadErrorPayload]
}>()

const panelRef = ref<HTMLDivElement | null>(null)
const loadedChildrenByPath = ref(new Map<string, YCascaderOption[]>())
const loadingPathKeys = ref(new Set<string>())
const loadErrorByPath = ref(new Map<string, unknown>())
const activePath = ref<YCascaderOption[]>([])
const activeColumn = ref(0)
const activeIndexes = ref<number[]>([])

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
const singleValue = computed(() => props.multiple ? [] : props.modelValue as YCascaderValue)
const multipleValue = computed(() => props.multiple ? props.modelValue as YCascaderMultipleValue : [])
const selectedPath = computed(() => findOptionPath(cascaderOptions.value, singleValue.value))
const selectedMultipleValues = computed(() => getValidMultipleCascaderValue(cascaderOptions.value, multipleValue.value))
const selectedMultipleLabels = computed(() => getMultiplePathLabels(cascaderOptions.value, selectedMultipleValues.value))
const columns = computed(() => createCascaderColumns(cascaderOptions.value, activePath.value))
const hasOptions = computed(() => cascaderOptions.value.length > 0)
const selectedLabel = computed(() => {
  if (props.multiple) {
    return selectedMultipleLabels.value.map((labels) => labels.join(props.separator)).join(', ')
  }

  return getPathLabels(selectedPath.value).join(props.separator)
})

function focusActiveOption() {
  nextTick(() => {
    panelRef.value?.querySelector<HTMLButtonElement>('[data-active-cascader-option="true"]')?.focus()
  })
}

function syncActiveFromValue() {
  const nextPath = props.multiple
    ? findOptionPath(cascaderOptions.value, selectedMultipleValues.value[0] ?? [])
    : selectedPath.value

  activePath.value = nextPath.length ? nextPath : (cascaderOptions.value[0] ? [cascaderOptions.value[0]] : [])
  activeColumn.value = Math.max(0, activePath.value.length - 1)
  activeIndexes.value = activePath.value.map((option, index) => {
    const columnOptions = index === 0 ? cascaderOptions.value : getOptionChildren(activePath.value[index - 1])

    return Math.max(0, columnOptions.findIndex((item) => item.value === option.value))
  })
}

watch(() => props.modelValue, syncActiveFromValue, { immediate: true })

watch(() => props.options, () => {
  loadedChildrenByPath.value = new Map()
  loadingPathKeys.value = new Set()
  loadErrorByPath.value = new Map()
  syncActiveFromValue()
}, { deep: true })

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

function setActiveOption(option: YCascaderOption, columnIndex: number, optionIndex: number) {
  activeColumn.value = columnIndex
  activeIndexes.value[columnIndex] = optionIndex
  activePath.value = [
    ...activePath.value.slice(0, columnIndex),
    option
  ]
  focusActiveOption()
}

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
  if (props.disabled || option.disabled) {
    return
  }

  setActiveOption(option, columnIndex, optionIndex)

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
    }
  }
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

function handlePanelKeydown(event: KeyboardEvent) {
  const column = columns.value[activeColumn.value]
  const optionIndex = activeIndexes.value[activeColumn.value] ?? 0
  const option = column?.options[optionIndex]

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
    ref="panelRef"
    class="yok-cascader-panel"
    :class="{
      'yok-cascader-panel--disabled': disabled,
      'yok-cascader-panel--empty': !hasOptions
    }"
    role="group"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
    @keydown="handlePanelKeydown"
  >
    <div v-if="hasOptions" class="yok-cascader-panel__body">
      <div
        v-for="(column, columnIndex) in columns"
        :key="column.level"
        class="yok-cascader-panel__column"
        role="listbox"
        :aria-multiselectable="multiple ? 'true' : undefined"
        :aria-label="`Level ${column.level + 1}`"
      >
        <button
          v-for="(option, optionIndex) in column.options"
          :key="option.value"
          class="yok-cascader-panel__option yok-focus-ring"
          :class="{
            'yok-cascader-panel__option--multiple': multiple,
            'yok-cascader-panel__option--active': activePath[columnIndex]?.value === option.value,
            'yok-cascader-panel__option--checked': isOptionChecked(option, columnIndex),
            'yok-cascader-panel__option--disabled': option.disabled,
            'yok-cascader-panel__option--loading': isOptionLoading(getOptionPath(columnIndex, option)),
            'yok-cascader-panel__option--error': getOptionLoadError(getOptionPath(columnIndex, option))
          }"
          type="button"
          role="option"
          :disabled="disabled || option.disabled"
          :aria-selected="multiple ? (isOptionChecked(option, columnIndex) ? 'true' : 'false') : (activePath[columnIndex]?.value === option.value ? 'true' : 'false')"
          :aria-disabled="option.disabled ? 'true' : undefined"
          :aria-busy="isOptionLoading(getOptionPath(columnIndex, option)) ? 'true' : undefined"
          :data-active-cascader-option="isOptionActive(columnIndex, optionIndex) ? 'true' : 'false'"
          @mouseenter="setActiveOption(option, columnIndex, optionIndex)"
          @click="selectOption(option, columnIndex, optionIndex)"
        >
          <span v-if="multiple" class="yok-cascader-panel__check" aria-hidden="true">
            {{ isOptionChecked(option, columnIndex) ? '✓' : '' }}
          </span>
          <span class="yok-cascader-panel__option-label">
            <slot name="option" :option="option" :level="column.level">
              {{ option.label }}
            </slot>
          </span>
          <span
            v-if="isOptionLoading(getOptionPath(columnIndex, option))"
            class="yok-cascader-panel__option-status"
            role="status"
            aria-live="polite"
          >
            Loading {{ option.label }}
          </span>
          <span
            v-else-if="getOptionLoadError(getOptionPath(columnIndex, option))"
            class="yok-cascader-panel__option-error"
            role="alert"
          >
            Failed to load {{ option.label }}
          </span>
          <span
            v-if="hasOptionChildren(option, getOptionPath(columnIndex, option))"
            class="yok-cascader-panel__option-arrow"
            aria-hidden="true"
          >
            ›
          </span>
        </button>
      </div>
    </div>
    <p v-else class="yok-cascader-panel__empty" role="status">{{ emptyText }}</p>
    <p v-if="selectedLabel" class="yok-cascader-panel__summary" aria-live="polite">
      Selected: {{ selectedLabel }}
    </p>
  </div>
</template>

<style scoped>
.yok-cascader-panel {
  --yok-cascader-panel-column-min-width: 168px;
  --yok-cascader-panel-column-max-height: 280px;
  --yok-cascader-panel-option-min-height: 34px;
  display: grid;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-sm);
  color: var(--yok-color-text);
}

.yok-cascader-panel__body {
  display: flex;
  min-width: 0;
  overflow: auto;
  padding: var(--yok-space-2);
}

.yok-cascader-panel__column {
  display: grid;
  min-width: var(--yok-cascader-panel-column-min-width);
  max-height: var(--yok-cascader-panel-column-max-height);
  align-content: start;
  gap: var(--yok-space-1);
  overflow: auto;
  border-inline-end: 1px solid var(--yok-color-border);
  padding-inline-end: var(--yok-space-2);
}

.yok-cascader-panel__column + .yok-cascader-panel__column {
  padding-inline-start: var(--yok-space-2);
}

.yok-cascader-panel__column:last-child {
  border-inline-end: 0;
}

.yok-cascader-panel__option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  min-height: var(--yok-cascader-panel-option-min-height);
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

.yok-cascader-panel__option--multiple {
  grid-template-columns: 18px minmax(0, 1fr) auto;
}

.yok-cascader-panel__option:hover:not(:disabled),
.yok-cascader-panel__option--active {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-cascader-panel__option--checked {
  color: var(--yok-color-primary);
  font-weight: 750;
}

.yok-cascader-panel__option--loading {
  color: var(--yok-color-primary);
}

.yok-cascader-panel__option--error {
  color: var(--yok-color-danger);
}

.yok-cascader-panel__option--disabled,
.yok-cascader-panel--disabled .yok-cascader-panel__option {
  cursor: not-allowed;
  opacity: 0.52;
}

.yok-cascader-panel__check {
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

.yok-cascader-panel__option--checked .yok-cascader-panel__check {
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
}

.yok-cascader-panel__option-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-cascader-panel__option-status,
.yok-cascader-panel__option-error {
  grid-column: 1 / -1;
  overflow: hidden;
  color: currentcolor;
  font-size: 12px;
  font-weight: 650;
  opacity: 0.78;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-cascader-panel__option-arrow {
  color: var(--yok-color-textMuted);
  font-weight: 800;
}

.yok-cascader-panel__empty {
  margin: 0;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  padding: var(--yok-space-4);
}

.yok-cascader-panel__summary {
  margin: 0;
  border-block-start: 1px solid var(--yok-color-border);
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 650;
  padding: var(--yok-space-2) var(--yok-space-3);
}

@media (max-width: 640px) {
  .yok-cascader-panel__body {
    display: grid;
  }

  .yok-cascader-panel__column,
  .yok-cascader-panel__column + .yok-cascader-panel__column {
    min-width: 100%;
    max-height: 220px;
    border-inline-end: 0;
    border-block-end: 1px solid var(--yok-color-border);
    padding-inline: 0;
    padding-block: var(--yok-space-2);
  }

  .yok-cascader-panel__column:last-child {
    border-block-end: 0;
  }
}
</style>
