<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import YInternalIcon from '../_internal/YInternalIcon.vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YSelect'
})

export interface YSelectOption {
  label: string
  value: string
  group?: string
  disabled?: boolean
}

export type YSelectSize = 'small' | 'medium' | 'large'
export type YSelectValue = string | string[]
export type YSelectRemoteMethod = (query: string) => YSelectOption[] | Promise<YSelectOption[]>

const selectSizeByConfig: Record<YokConfigSize, YSelectSize> = {
  sm: 'small',
  md: 'medium',
  lg: 'large'
}

interface Props {
  id?: string
  modelValue?: YSelectValue
  options: YSelectOption[]
  label?: string
  ariaLabel?: string
  placeholder?: string
  error?: string
  invalid?: boolean
  ariaDescribedby?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  collapseTags?: boolean
  maxCollapseTags?: number
  filterable?: boolean
  allowCreate?: boolean
  virtualized?: boolean
  virtualHeight?: number
  virtualItemHeight?: number
  virtualOverscan?: number
  loading?: boolean
  loadingText?: string
  remoteMethod?: YSelectRemoteMethod
  remoteErrorText?: string
  searchPlaceholder?: string
  emptyText?: string
  size?: YSelectSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  ariaLabel: '',
  placeholder: 'Select an option',
  error: '',
  invalid: false,
  ariaDescribedby: '',
  disabled: false,
  clearable: false,
  multiple: false,
  collapseTags: false,
  maxCollapseTags: 1,
  filterable: false,
  allowCreate: false,
  virtualized: false,
  virtualHeight: 220,
  virtualItemHeight: 36,
  virtualOverscan: 4,
  loading: false,
  loadingText: 'Loading options',
  remoteErrorText: 'Failed to load options',
  searchPlaceholder: 'Search options',
  emptyText: 'No matching options'
})

const emit = defineEmits<{
  'update:modelValue': [value: YSelectValue]
  change: [value: YSelectValue]
  clear: []
  remove: [value: string]
  visibleChange: [open: boolean]
  search: [query: string]
}>()

const generatedId = useId()
const yokConfig = useYokConfig()
const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const listboxRef = ref<HTMLElement | null>(null)
const optionListboxRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const optionRefs = ref<HTMLButtonElement[]>([])
const pendingFocus = ref<'selected' | 'first' | 'last' | null>(null)
const query = ref('')
const listboxScrollTop = ref(0)
const remoteOptions = ref<YSelectOption[]>([])
const remoteLoading = ref(false)
const remoteError = ref('')
let remoteRequestId = 0
const createOptionIndex = -1

const fieldId = computed(() => props.id || `yok-select-${generatedId}`)
const resolvedSize = computed(() => props.size ?? selectSizeByConfig[yokConfig.size.value])
const resolvedDensity = computed(() => yokConfig.density.value)
const labelId = computed(() => `${fieldId.value}-label`)
const listboxId = computed(() => `${fieldId.value}-listbox`)
const selectedValues = computed(() =>
  props.multiple
    ? Array.isArray(props.modelValue)
      ? props.modelValue
      : props.modelValue
        ? [props.modelValue]
        : []
    : []
)
const hasActiveRemoteQuery = computed(() => Boolean(props.remoteMethod && query.value.trim()))
const sourceOptions = computed(() => hasActiveRemoteQuery.value ? remoteOptions.value : props.options)
const lookupOptions = computed(() => [...props.options, ...remoteOptions.value])
const isLoading = computed(() => props.loading || remoteLoading.value)
const emptyStatusText = computed(() => remoteError.value || props.emptyText)
const selectedOption = computed(() =>
  props.multiple
    ? lookupOptions.value.find((option) => selectedValues.value.includes(option.value))
    : lookupOptions.value.find((option) => option.value === props.modelValue) ||
      (props.allowCreate && typeof props.modelValue === 'string' && props.modelValue
        ? { label: props.modelValue, value: props.modelValue }
        : undefined)
)
const selectedOptions = computed(() =>
  selectedValues.value.map((value) =>
    lookupOptions.value.find((option) => option.value === value) ||
    (props.allowCreate ? { label: value, value } : undefined)
  ).filter((option): option is YSelectOption => Boolean(option))
)
const visibleSelectedOptions = computed(() => {
  if (!props.multiple || !props.collapseTags) {
    return selectedOptions.value
  }

  return selectedOptions.value.slice(0, Math.max(1, props.maxCollapseTags))
})
const collapsedSelectedCount = computed(() =>
  props.multiple && props.collapseTags
    ? Math.max(0, selectedOptions.value.length - visibleSelectedOptions.value.length)
    : 0
)
const filteredOptions = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  if (!props.filterable || !normalizedQuery || hasActiveRemoteQuery.value) {
    return sourceOptions.value.map((option, index) => ({ option, index }))
  }

  return sourceOptions.value
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.label.toLowerCase().includes(normalizedQuery))
})
const createOption = computed<YSelectOption | null>(() => {
  const normalizedQuery = query.value.trim()

  if (!props.filterable || !props.allowCreate || !normalizedQuery || isLoading.value || remoteError.value) {
    return null
  }

  const normalizedLower = normalizedQuery.toLowerCase()
  const hasExistingOption = sourceOptions.value.some((option) =>
    option.label.toLowerCase() === normalizedLower ||
    option.value.toLowerCase() === normalizedLower
  )

  if (hasExistingOption) {
    return null
  }

  return { label: normalizedQuery, value: normalizedQuery }
})
const filteredOptionGroups = computed(() => {
  const groups: Array<{ key: string; label: string; items: Array<{ option: YSelectOption; index: number }> }> = []
  const groupIndexes = new Map<string, number>()

  for (const item of filteredOptions.value) {
    const label = item.option.group || ''
    const key = label || '__ungrouped'
    const existingIndex = groupIndexes.get(key)

    if (existingIndex === undefined) {
      groupIndexes.set(key, groups.length)
      groups.push({ key, label, items: [item] })
      continue
    }

    groups[existingIndex].items.push(item)
  }

  return groups
})
const hasGroupedOptions = computed(() => filteredOptions.value.some(({ option }) => Boolean(option.group)))
const canVirtualizeOptions = computed(() =>
  props.virtualized &&
  !isLoading.value &&
  !hasGroupedOptions.value &&
  !createOption.value
)
const normalizedVirtualHeight = computed(() => Math.max(1, props.virtualHeight))
const normalizedVirtualItemHeight = computed(() => Math.max(1, props.virtualItemHeight))
const normalizedVirtualOverscan = computed(() => Math.max(0, props.virtualOverscan))
const virtualVisibleCount = computed(() => Math.ceil(normalizedVirtualHeight.value / normalizedVirtualItemHeight.value))
const virtualRange = computed(() => {
  const total = filteredOptions.value.length

  if (!canVirtualizeOptions.value || total === 0) {
    return { start: 0, end: total }
  }

  const baseStart = Math.floor(listboxScrollTop.value / normalizedVirtualItemHeight.value)
  const start = Math.max(0, baseStart - normalizedVirtualOverscan.value)
  const end = Math.min(total, baseStart + virtualVisibleCount.value + normalizedVirtualOverscan.value)

  return { start, end }
})
const renderedOptions = computed(() =>
  canVirtualizeOptions.value
    ? filteredOptions.value.slice(virtualRange.value.start, virtualRange.value.end)
    : filteredOptions.value
)
const virtualSpacerStyle = computed(() => ({
  height: `${filteredOptions.value.length * normalizedVirtualItemHeight.value}px`
}))
const virtualTrackStyle = computed(() => ({
  transform: `translateY(${virtualRange.value.start * normalizedVirtualItemHeight.value}px)`
}))
const virtualOptionStyle = computed(() => ({
  height: `${normalizedVirtualItemHeight.value}px`,
  minHeight: `${normalizedVirtualItemHeight.value}px`
}))
const listboxStyle = computed(() =>
  canVirtualizeOptions.value
    ? { height: `${normalizedVirtualHeight.value}px` }
    : undefined
)
const hasSelection = computed(() =>
  props.multiple ? selectedValues.value.length > 0 : Boolean(selectedOption.value)
)
const displayText = computed(() => selectedOption.value?.label || props.placeholder)
const hasInvalidState = computed(() => Boolean(props.error) || props.invalid)
const describedBy = computed(() => props.ariaDescribedby || undefined)
const enabledOptions = computed(() =>
  isLoading.value
    ? []
    : [
        ...filteredOptions.value.filter(({ option }) => !option.disabled),
        ...(createOption.value ? [{ option: createOption.value, index: createOptionIndex }] : [])
      ]
)
const activeOptionId = computed(() => selectedOption.value ? `${fieldId.value}-option-${selectedOption.value.value}` : undefined)
const { floatingStyles } = useFloatingLayer(triggerRef, listboxRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 6,
  matchReferenceWidth: true
})

function setOptionRef(element: HTMLButtonElement | null, index: number) {
  if (element) {
    optionRefs.value[index] = element
  }
}

function setOpen(value: boolean) {
  if (props.disabled) {
    return
  }

  open.value = value
}

function focusTrigger() {
  void nextTick(() => triggerRef.value?.focus())
}

function focusOption(index: number) {
  optionRefs.value[index]?.focus()
}

function focusSelectedOrFirst() {
  if (props.filterable) {
    searchRef.value?.focus()
    return
  }

  const selectedIndex = sourceOptions.value.findIndex((option) => option.value === props.modelValue && !option.disabled)

  if (selectedIndex >= 0) {
    focusOption(selectedIndex)
    return
  }

  const firstEnabled = enabledOptions.value[0]
  if (firstEnabled) {
    focusOption(firstEnabled.index)
  }
}

function focusFirst() {
  const firstEnabled = enabledOptions.value[0]
  if (firstEnabled) {
    focusOption(firstEnabled.index)
  }
}

function focusLast() {
  const lastEnabled = enabledOptions.value[enabledOptions.value.length - 1]
  if (lastEnabled) {
    focusOption(lastEnabled.index)
  }
}

function focusRelativeOption(direction: 1 | -1) {
  const focusableOptions = enabledOptions.value

  if (focusableOptions.length === 0) {
    return
  }

  const activeIndex = optionRefs.value.findIndex((element) => element === document.activeElement)
  const enabledPosition = focusableOptions.findIndex(({ index }) => index === activeIndex)
  const nextPosition =
    enabledPosition === -1
      ? direction === 1
        ? 0
        : focusableOptions.length - 1
      : (enabledPosition + direction + focusableOptions.length) % focusableOptions.length

  focusOption(focusableOptions[nextPosition].index)
}

function openAndFocus(target: 'selected' | 'first' | 'last' = 'selected') {
  pendingFocus.value = target
  setOpen(true)
}

function closeAndFocusTrigger() {
  setOpen(false)
  focusTrigger()
}

const { layerStyle } = useDismissableLayer({
  open,
  reference: triggerRef,
  floating: listboxRef,
  onDismiss: closeAndFocusTrigger
})

function isOptionSelected(option: YSelectOption) {
  return props.multiple ? selectedValues.value.includes(option.value) : option.value === props.modelValue
}

function emitClearedValue() {
  const nextValue = props.multiple ? [] : ''
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

function clearSelection(event?: MouseEvent) {
  event?.preventDefault()
  event?.stopPropagation()
  if (props.disabled || !hasSelection.value) {
    return
  }

  emitClearedValue()
  emit('clear')
  setOpen(false)
  focusTrigger()
}

function removeOption(option: YSelectOption, event?: MouseEvent) {
  event?.preventDefault()
  event?.stopPropagation()
  if (props.disabled || option.disabled || !props.multiple) {
    return
  }

  const nextValue = selectedValues.value.filter((value) => value !== option.value)
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
  emit('remove', option.value)
}

function selectOption(option: YSelectOption) {
  if (option.disabled) {
    return
  }

  if (props.multiple) {
    const nextValue = selectedValues.value.includes(option.value)
      ? selectedValues.value.filter((value) => value !== option.value)
      : [...selectedValues.value, option.value]
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
    if (selectedValues.value.includes(option.value)) {
      emit('remove', option.value)
    }
    query.value = ''
    void nextTick(() => focusOption(sourceOptions.value.findIndex((item) => item.value === option.value)))
    return
  }

  emit('update:modelValue', option.value)
  emit('change', option.value)
  setOpen(false)
  query.value = ''
  focusTrigger()
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    event.stopPropagation()
    focusFirst()
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    focusLast()
    return
  }

  if (event.key === 'Enter') {
    const firstEnabled = enabledOptions.value[0]
    if (firstEnabled) {
      event.preventDefault()
      event.stopPropagation()
      selectOption(firstEnabled.option)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeAndFocusTrigger()
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (['Enter', ' '].includes(event.key)) {
    event.preventDefault()
    open.value ? closeAndFocusTrigger() : openAndFocus('selected')
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openAndFocus('selected')
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    openAndFocus('last')
    return
  }

  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    closeAndFocusTrigger()
  }
}

function handleListboxKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusRelativeOption(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusRelativeOption(-1)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    focusFirst()
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    focusLast()
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeAndFocusTrigger()
  }
}

function handleListboxScroll(event: Event) {
  listboxScrollTop.value = (event.currentTarget as HTMLElement).scrollTop
}

function resetVirtualScroll() {
  listboxScrollTop.value = 0
  if (optionListboxRef.value) {
    optionListboxRef.value.scrollTop = 0
  }
}

async function loadRemoteOptions(value: string) {
  const remoteMethod = props.remoteMethod

  if (!remoteMethod) {
    return
  }

  const requestId = ++remoteRequestId
  remoteError.value = ''
  remoteLoading.value = true

  try {
    const nextOptions = await remoteMethod(value)

    if (requestId !== remoteRequestId) {
      return
    }

    remoteOptions.value = Array.isArray(nextOptions) ? nextOptions : []
  } catch {
    if (requestId !== remoteRequestId) {
      return
    }

    remoteOptions.value = []
    remoteError.value = props.remoteErrorText
  } finally {
    if (requestId === remoteRequestId) {
      remoteLoading.value = false
    }
  }
}

function resetRemoteOptions() {
  remoteRequestId += 1
  remoteLoading.value = false
  remoteError.value = ''
  remoteOptions.value = []
}

watch(open, (isOpen) => {
  emit('visibleChange', isOpen)

  if (!isOpen) {
    optionRefs.value = []
    pendingFocus.value = null
    query.value = ''
    resetVirtualScroll()
    return
  }

  void nextTick(() => {
    resetVirtualScroll()

    if (pendingFocus.value === 'first') {
      focusFirst()
      return
    }

    if (pendingFocus.value === 'last') {
      focusLast()
      return
    }

    focusSelectedOrFirst()
  })
})

watch(query, (value) => {
  emit('search', value)
  optionRefs.value = []
  resetVirtualScroll()

  if (!props.remoteMethod) {
    return
  }

  if (!value.trim()) {
    resetRemoteOptions()
    return
  }

  void loadRemoteOptions(value)
})
</script>

<template>
  <div
    class="yok-select"
    :class="[
      `yok-select--${resolvedSize}`,
      `yok-select--${resolvedDensity}`,
      { 'yok-select--disabled': disabled, 'yok-select--multiple': multiple }
    ]"
  >
    <span v-if="label" :id="labelId" class="yok-select__label">{{ label }}</span>
    <div class="yok-select__control-wrap">
      <div
        :id="fieldId"
        ref="triggerRef"
        class="yok-select__control yok-focus-ring"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        aria-haspopup="listbox"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="listboxId"
        :aria-activedescendant="open ? activeOptionId : undefined"
        :aria-labelledby="label ? `${labelId} ${fieldId}` : undefined"
        :aria-label="label ? undefined : (ariaLabel || placeholder)"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :aria-describedby="describedBy"
        @click="setOpen(!open)"
        @keydown="handleTriggerKeydown"
      >
        <span v-if="multiple && selectedOptions.length" class="yok-select__tags">
          <span v-for="option in visibleSelectedOptions" :key="option.value" class="yok-select__tag">
            <span class="yok-select__tag-label">{{ option.label }}</span>
            <button
              class="yok-select__tag-remove"
              type="button"
              tabindex="-1"
              :aria-label="`Remove ${option.label}`"
              @click="removeOption(option, $event)"
            >
              <YInternalIcon name="close" />
            </button>
          </span>
          <span
            v-if="collapsedSelectedCount"
            class="yok-select__tag yok-select__tag-summary"
            :aria-label="`${collapsedSelectedCount} more selected ${collapsedSelectedCount === 1 ? 'option' : 'options'}`"
          >
            +{{ collapsedSelectedCount }}
          </span>
        </span>
        <span v-else class="yok-select__value" :class="{ 'yok-select__value--placeholder': !selectedOption }">
          {{ displayText }}
        </span>
        <span class="yok-select__chevron" aria-hidden="true">
          <YInternalIcon name="chevronDown" />
        </span>
      </div>
      <button
        v-if="clearable && hasSelection && !disabled"
        class="yok-select__clear yok-focus-ring"
        type="button"
        aria-label="Clear selection"
        @click="clearSelection"
      >
        <YInternalIcon name="close" />
      </button>
    </div>
    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        ref="listboxRef"
        class="yok-select__panel"
        :style="[floatingStyles, layerStyle]"
        @keydown="handleListboxKeydown"
      >
        <label v-if="filterable" class="yok-select__search">
          <span class="yok-select__search-label">{{ searchPlaceholder }}</span>
          <input
            ref="searchRef"
            v-model="query"
            class="yok-select__search-input yok-focus-ring"
            type="search"
            role="searchbox"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            :aria-controls="listboxId"
            autocomplete="off"
            @keydown="handleSearchKeydown"
          >
        </label>
        <div
          :id="listboxId"
          ref="optionListboxRef"
          class="yok-select__listbox"
          :class="{
            'yok-select__listbox--with-search': filterable,
            'yok-select__listbox--virtualized': canVirtualizeOptions
          }"
          :style="listboxStyle"
          role="listbox"
          :data-virtualized="canVirtualizeOptions ? 'true' : undefined"
          :aria-setsize="canVirtualizeOptions ? filteredOptions.length : undefined"
          :aria-multiselectable="multiple ? 'true' : undefined"
          :aria-labelledby="label ? labelId : undefined"
          @scroll="handleListboxScroll"
        >
          <span v-if="isLoading" class="yok-select__empty yok-select__loading" role="status">{{ loadingText }}</span>
          <template v-else-if="canVirtualizeOptions">
            <div v-if="filteredOptions.length" class="yok-select__virtual-spacer" :style="virtualSpacerStyle">
              <div class="yok-select__virtual-track" :style="virtualTrackStyle">
                <button
                  v-for="{ option, index } in renderedOptions"
                  :id="`${fieldId}-option-${option.value}`"
                  :key="option.value"
                  :ref="(element) => setOptionRef(element as HTMLButtonElement | null, index)"
                  class="yok-select__option yok-focus-ring"
                  :class="{ 'yok-select__option--selected': isOptionSelected(option) }"
                  :style="virtualOptionStyle"
                  type="button"
                  role="option"
                  :aria-setsize="filteredOptions.length"
                  :aria-posinset="index + 1"
                  :aria-selected="isOptionSelected(option) ? 'true' : 'false'"
                  :aria-disabled="option.disabled ? 'true' : undefined"
                  :disabled="option.disabled"
                  @click="selectOption(option)"
                >
                  <span>{{ option.label }}</span>
                  <span v-if="isOptionSelected(option)" class="yok-select__check" aria-hidden="true">
                    <YInternalIcon name="check" />
                  </span>
                </button>
              </div>
            </div>
            <span v-else class="yok-select__empty" role="status">{{ emptyStatusText }}</span>
          </template>
          <template v-else>
            <template v-for="group in filteredOptionGroups" :key="group.key">
              <div
                v-if="group.label"
                class="yok-select__group"
                role="group"
                :aria-label="group.label"
              >
                <span class="yok-select__group-label">{{ group.label }}</span>
                <button
                  v-for="{ option, index } in group.items"
                  :id="`${fieldId}-option-${option.value}`"
                  :key="option.value"
                  :ref="(element) => setOptionRef(element as HTMLButtonElement | null, index)"
                  class="yok-select__option yok-focus-ring"
                  :class="{ 'yok-select__option--selected': isOptionSelected(option) }"
                  type="button"
                  role="option"
                  :aria-selected="isOptionSelected(option) ? 'true' : 'false'"
                  :aria-disabled="option.disabled ? 'true' : undefined"
                  :disabled="option.disabled"
                  @click="selectOption(option)"
                >
                  <span>{{ option.label }}</span>
                  <span v-if="isOptionSelected(option)" class="yok-select__check" aria-hidden="true">
                    <YInternalIcon name="check" />
                  </span>
                </button>
              </div>
              <template v-else>
                <button
                  v-for="{ option, index } in group.items"
                  :id="`${fieldId}-option-${option.value}`"
                  :key="option.value"
                  :ref="(element) => setOptionRef(element as HTMLButtonElement | null, index)"
                  class="yok-select__option yok-focus-ring"
                  :class="{ 'yok-select__option--selected': isOptionSelected(option) }"
                  type="button"
                  role="option"
                  :aria-selected="isOptionSelected(option) ? 'true' : 'false'"
                  :aria-disabled="option.disabled ? 'true' : undefined"
                  :disabled="option.disabled"
                  @click="selectOption(option)"
                >
                  <span>{{ option.label }}</span>
                  <span v-if="isOptionSelected(option)" class="yok-select__check" aria-hidden="true">
                    <YInternalIcon name="check" />
                  </span>
                </button>
              </template>
            </template>
            <button
              v-if="createOption"
              :id="`${fieldId}-option-create`"
              :ref="(element) => setOptionRef(element as HTMLButtonElement | null, createOptionIndex)"
              class="yok-select__option yok-select__option--create yok-focus-ring"
              type="button"
              role="option"
              aria-selected="false"
              data-create-option="true"
              @click="selectOption(createOption)"
            >
              <span>Create "{{ createOption.label }}"</span>
            </button>
            <span v-if="filteredOptions.length === 0 && !createOption" class="yok-select__empty" role="status">{{ emptyStatusText }}</span>
          </template>
        </div>
      </div>
    </Transition>
    <span v-if="error" class="yok-select__error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.yok-select {
  --yok-select-control-min-height: 38px;
  --yok-select-control-padding-block: 0px;
  --yok-select-control-padding-inline: var(--yok-space-3);
  --yok-select-font-size: 14px;
  --yok-select-option-min-height: 36px;

  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
  font-size: var(--yok-select-font-size);
}

.yok-select--small {
  --yok-select-control-min-height: 32px;
  --yok-select-control-padding-inline: var(--yok-space-2);
  --yok-select-font-size: 13px;
  --yok-select-option-min-height: 32px;
}

.yok-select--large {
  --yok-select-control-min-height: 44px;
  --yok-select-control-padding-inline: var(--yok-space-4);
  --yok-select-font-size: 15px;
  --yok-select-option-min-height: 40px;
}

.yok-select--compact {
  gap: var(--yok-space-1);
}

.yok-select--compact.yok-select--medium {
  --yok-select-control-min-height: 34px;
  --yok-select-option-min-height: 32px;
}

.yok-select--compact.yok-select--large {
  --yok-select-control-min-height: 40px;
  --yok-select-option-min-height: 36px;
}

.yok-select__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-select__control-wrap {
  position: relative;
  min-width: 0;
}

.yok-select__control {
  display: inline-flex;
  min-height: var(--yok-select-control-min-height);
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  padding: var(--yok-select-control-padding-block) calc(var(--yok-select-control-padding-inline) + 22px) var(--yok-select-control-padding-block) var(--yok-select-control-padding-inline);
  text-align: left;
}

.yok-select__control[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-select__control[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-select__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-select__tags {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
  padding-block: 4px;
}

.yok-select__tag {
  display: inline-flex;
  max-width: min(100%, 168px);
  align-items: center;
  gap: 4px;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 18%, var(--yok-color-border));
  border-radius: var(--yok-radius-sm);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 70%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 750;
  line-height: 1.4;
  padding: 2px 6px;
}

.yok-select__tag-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-select__tag-remove {
  display: inline-grid;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  line-height: 1;
  padding: 0;
}

.yok-select__tag-remove:hover {
  background: color-mix(in srgb, var(--yok-color-primary) 14%, transparent);
}

.yok-select__tag-summary {
  flex: 0 0 auto;
  background: color-mix(in srgb, var(--yok-color-surface) 82%, var(--yok-color-primarySoft));
  color: var(--yok-color-textMuted);
}

.yok-select__value--placeholder,
.yok-select__chevron {
  color: var(--yok-color-textMuted);
}

.yok-select__chevron {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: var(--yok-select-control-padding-inline);
  display: inline-flex;
  flex: 0 0 16px;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 16px;
  line-height: 1;
  pointer-events: none;
  transform: translateY(-50%);
}

.yok-select__clear {
  position: absolute;
  z-index: 1;
  inset-block-start: 50%;
  inset-inline-end: 28px;
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  line-height: 1;
  transform: translateY(-50%);
}

.yok-select__clear:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-select__panel {
  z-index: var(--yok-zIndex-floating, 1000);
  display: grid;
  width: max(180px, var(--yok-floating-reference-width, 180px));
  min-width: 180px;
  max-width: min(320px, calc(100vw - 32px));
  max-height: min(280px, calc(100vh - 32px));
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
}

.yok-select__search {
  display: grid;
  gap: 4px;
  padding: var(--yok-space-3);
}

.yok-select__search-label {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 700;
}

.yok-select__search-input {
  min-height: 32px;
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font: inherit;
  padding: 0 var(--yok-space-3);
}

.yok-select__listbox {
  display: grid;
  gap: 2px;
  max-height: 232px;
  overflow: auto;
  padding: var(--yok-space-2);
  scrollbar-gutter: stable;
}

.yok-select__listbox--with-search {
  border-top: 1px solid var(--yok-color-borderSoft, var(--yok-color-border));
}

.yok-select__listbox--virtualized {
  position: relative;
  display: block;
}

.yok-select__virtual-spacer {
  position: relative;
  min-width: 0;
}

.yok-select__virtual-track {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  display: grid;
  gap: 2px;
  will-change: transform;
}

.yok-select__option {
  display: flex;
  min-height: var(--yok-select-option-min-height);
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  padding: 0 var(--yok-space-3);
  text-align: left;
}

.yok-select__option:hover:not(:disabled),
.yok-select__option--selected {
  background: var(--yok-color-primarySoft);
}

.yok-select__option:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.yok-select__group {
  display: grid;
  gap: 2px;
  padding-block: 4px;
}

.yok-select__group + .yok-select__group {
  border-top: 1px solid var(--yok-color-borderSoft, var(--yok-color-border));
}

.yok-select__group-label {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  padding: 4px var(--yok-space-3);
  text-transform: uppercase;
}

.yok-select__check {
  display: inline-flex;
  flex: 0 0 16px;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--yok-color-primary);
  font-size: 16px;
  font-weight: 850;
}

.yok-select__empty {
  display: block;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 650;
  padding: var(--yok-space-3);
  text-align: center;
}

.yok-select__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}
</style>
