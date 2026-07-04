<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YAutocomplete'
})

export interface YAutocompleteOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export type YAutocompleteSize = 'small' | 'medium' | 'large'

const autocompleteSizeByConfig: Record<YokConfigSize, YAutocompleteSize> = {
  sm: 'small',
  md: 'medium',
  lg: 'large'
}

interface Props {
  id?: string
  modelValue?: string
  options: YAutocompleteOption[]
  label?: string
  placeholder?: string
  error?: string
  invalid?: boolean
  ariaDescribedby?: string
  disabled?: boolean
  clearable?: boolean
  loading?: boolean
  loadingText?: string
  emptyText?: string
  size?: YAutocompleteSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  placeholder: 'Type to search',
  error: '',
  invalid: false,
  ariaDescribedby: '',
  disabled: false,
  clearable: false,
  loading: false,
  loadingText: 'Loading suggestions',
  emptyText: 'No suggestions'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  search: [query: string]
  select: [option: YAutocompleteOption]
  visibleChange: [open: boolean]
}>()

const generatedId = useId()
const yokConfig = useYokConfig()
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const searchText = ref(props.modelValue)

const fieldId = computed(() => props.id || `yok-autocomplete-${generatedId}`)
const labelId = computed(() => `${fieldId.value}-label`)
const listboxId = computed(() => `${fieldId.value}-listbox`)
const resolvedSize = computed(() => props.size ?? autocompleteSizeByConfig[yokConfig.size.value])
const resolvedDensity = computed(() => yokConfig.density.value)
const hasInvalidState = computed(() => Boolean(props.error || props.invalid))
const describedBy = computed(() => props.ariaDescribedby || undefined)
const inputAriaLabel = computed(() => props.label || 'Autocomplete')
const filteredOptions = computed(() => {
  const query = searchText.value.trim().toLowerCase()

  if (!query) {
    return props.options
  }

  return props.options.filter((option) =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  )
})
const enabledOptions = computed(() => filteredOptions.value.filter((option) => !option.disabled))
const hasSuggestions = computed(() => filteredOptions.value.length > 0)
const showClearButton = computed(() => props.clearable && !props.disabled && searchText.value.length > 0)
const activeOption = computed(() => filteredOptions.value[activeIndex.value])
const activeOptionId = computed(() =>
  open.value && activeOption.value
    ? `${fieldId.value}-option-${activeOption.value.value}`
    : undefined
)

const { floatingStyles } = useFloatingLayer(inputRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 6,
  matchReferenceWidth: true
})

useDismissableLayer({
  open,
  reference: inputRef,
  floating: panelRef,
  onDismiss: closeSuggestions
})

function setOpen(value: boolean) {
  if (open.value === value) {
    return
  }

  open.value = value
  emit('visibleChange', value)
}

function getFirstEnabledIndex() {
  return filteredOptions.value.findIndex((option) => !option.disabled)
}

function syncActiveToFirstEnabled() {
  activeIndex.value = getFirstEnabledIndex()
}

async function openSuggestions() {
  if (props.disabled) {
    return
  }

  setOpen(true)
  await nextTick()
  syncActiveToFirstEnabled()
}

function closeSuggestions() {
  setOpen(false)
  activeIndex.value = -1
}

function updateValue(event: Event) {
  const value = (event.target as HTMLInputElement).value

  searchText.value = value
  emit('update:modelValue', value)
  emit('search', value)
  void openSuggestions()
}

function commitValue() {
  emit('change', searchText.value)
}

function selectOption(option: YAutocompleteOption) {
  if (option.disabled) {
    return
  }

  searchText.value = option.value
  emit('update:modelValue', option.value)
  emit('change', option.value)
  emit('select', option)
  closeSuggestions()
}

function clearValue() {
  searchText.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  void openSuggestions()
}

function moveActive(step: 1 | -1) {
  if (!enabledOptions.value.length) {
    activeIndex.value = -1
    return
  }

  const currentOption = filteredOptions.value[activeIndex.value]
  const currentEnabledIndex = enabledOptions.value.findIndex((option) => option.value === currentOption?.value)
  const nextEnabledIndex = currentEnabledIndex === -1
    ? 0
    : (currentEnabledIndex + step + enabledOptions.value.length) % enabledOptions.value.length
  const nextOption = enabledOptions.value[nextEnabledIndex]

  activeIndex.value = filteredOptions.value.findIndex((option) => option.value === nextOption.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()

    if (!open.value) {
      void openSuggestions()
      return
    }

    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()

    if (!open.value) {
      void openSuggestions()
      return
    }

    moveActive(-1)
    return
  }

  if (event.key === 'Enter' && open.value && activeOption.value) {
    event.preventDefault()
    selectOption(activeOption.value)
    return
  }

  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    closeSuggestions()
  }
}

watch(filteredOptions, () => {
  if (!open.value) {
    return
  }

  syncActiveToFirstEnabled()
})

watch(
  () => props.modelValue,
  (value) => {
    searchText.value = value
  }
)
</script>

<template>
  <div
    class="yok-autocomplete"
    :class="[
      `yok-autocomplete--${resolvedSize}`,
      `yok-autocomplete--${resolvedDensity}`
    ]"
  >
    <label v-if="label" :id="labelId" class="yok-autocomplete__label" :for="fieldId">{{ label }}</label>
    <span class="yok-autocomplete__field" :class="{ 'yok-autocomplete__field--invalid': hasInvalidState }">
      <input
        :id="fieldId"
        ref="inputRef"
        class="yok-autocomplete__control yok-focus-ring"
        role="combobox"
        type="text"
        :value="searchText"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="inputAriaLabel"
        :aria-labelledby="label ? labelId : undefined"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="open ? listboxId : undefined"
        :aria-activedescendant="activeOptionId"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        :aria-describedby="describedBy"
        autocomplete="off"
        @focus="(event) => { emit('focus', event); openSuggestions() }"
        @blur="(event) => { emit('blur', event); commitValue() }"
        @input="updateValue"
        @keydown="handleKeydown"
      />
      <button
        v-if="showClearButton"
        class="yok-autocomplete__clear yok-focus-ring"
        type="button"
        aria-label="Clear input"
        @click="clearValue"
      >
        x
      </button>
    </span>
    <span v-if="error" class="yok-autocomplete__error" role="alert">{{ error }}</span>

    <div
      v-if="open"
      ref="panelRef"
      class="yok-autocomplete__panel"
      :style="floatingStyles"
    >
      <div v-if="loading" class="yok-autocomplete__empty" role="status">{{ loadingText }}</div>
      <div
        v-else-if="hasSuggestions"
        :id="listboxId"
        class="yok-autocomplete__listbox"
        role="listbox"
        :aria-label="`${inputAriaLabel} suggestions`"
      >
        <button
          v-for="(option, index) in filteredOptions"
          :id="`${fieldId}-option-${option.value}`"
          :key="option.value"
          class="yok-autocomplete__option yok-focus-ring"
          :class="{ 'yok-autocomplete__option--active': index === activeIndex }"
          type="button"
          role="option"
          :disabled="option.disabled"
          :aria-selected="index === activeIndex ? 'true' : 'false'"
          @mousedown.prevent
          @click="selectOption(option)"
        >
          <span class="yok-autocomplete__option-label">{{ option.label }}</span>
          <span v-if="option.description" class="yok-autocomplete__option-description">{{ option.description }}</span>
        </button>
      </div>
      <div v-else class="yok-autocomplete__empty" role="status">{{ emptyText }}</div>
    </div>
  </div>
</template>

<style scoped>
.yok-autocomplete {
  position: relative;
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-autocomplete__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-autocomplete__field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  overflow: hidden;
}

.yok-autocomplete__field:focus-within {
  outline: 2px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  outline-offset: 2px;
}

.yok-autocomplete__field--invalid {
  border-color: var(--yok-color-danger);
}

.yok-autocomplete__control {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--yok-color-text);
  padding: 0 var(--yok-space-3);
}

.yok-autocomplete__control:disabled {
  cursor: not-allowed;
  color: var(--yok-color-textMuted);
}

.yok-autocomplete__clear {
  width: 24px;
  height: 24px;
  margin-right: var(--yok-space-2);
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.yok-autocomplete__clear:hover {
  background: color-mix(in srgb, var(--yok-color-primary) 10%, transparent);
  color: var(--yok-color-primary);
}

.yok-autocomplete--small .yok-autocomplete__field {
  min-height: 32px;
}

.yok-autocomplete--small .yok-autocomplete__control {
  font-size: 13px;
}

.yok-autocomplete--medium .yok-autocomplete__field {
  min-height: 38px;
}

.yok-autocomplete--medium .yok-autocomplete__control {
  font-size: 14px;
}

.yok-autocomplete--large .yok-autocomplete__field {
  min-height: 44px;
}

.yok-autocomplete--large .yok-autocomplete__control {
  font-size: 15px;
}

.yok-autocomplete--compact .yok-autocomplete__field {
  min-height: 34px;
}

.yok-autocomplete:has(.yok-autocomplete__control:disabled) .yok-autocomplete__field {
  background: color-mix(in srgb, var(--yok-color-border) 28%, var(--yok-color-surface));
  opacity: 0.72;
}

.yok-autocomplete__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-autocomplete__panel {
  z-index: var(--yok-zIndex-popover, 1000);
  width: var(--yok-floating-reference-width, 240px);
  max-height: 260px;
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-2);
}

.yok-autocomplete__listbox {
  display: grid;
  gap: var(--yok-space-1);
}

.yok-autocomplete__option {
  display: grid;
  gap: 2px;
  width: 100%;
  min-height: 36px;
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  padding: var(--yok-space-2) var(--yok-space-3);
  text-align: left;
}

.yok-autocomplete__option:hover,
.yok-autocomplete__option--active {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-autocomplete__option:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.yok-autocomplete__option-label {
  font-weight: 650;
}

.yok-autocomplete__option-description,
.yok-autocomplete__empty {
  color: var(--yok-color-textMuted);
  font-size: 12px;
}

.yok-autocomplete__empty {
  padding: var(--yok-space-3);
}
</style>
