<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YMention'
})

export interface YMentionOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export interface YMentionSelectPayload {
  option: YMentionOption
  prefix: string
  value: string
}

export type YMentionSize = 'small' | 'medium' | 'large'
export type YMentionRemoteMethod = (query: string, prefix: string) => YMentionOption[] | Promise<YMentionOption[]>

const mentionSizeByConfig: Record<YokConfigSize, YMentionSize> = {
  sm: 'small',
  md: 'medium',
  lg: 'large'
}

interface MentionToken {
  prefix: string
  keyword: string
  start: number
  end: number
}

interface Props {
  id?: string
  modelValue?: string
  options: YMentionOption[]
  label?: string
  placeholder?: string
  error?: string
  invalid?: boolean
  ariaDescribedby?: string
  disabled?: boolean
  clearable?: boolean
  loading?: boolean
  loadingText?: string
  remoteMethod?: YMentionRemoteMethod
  remoteErrorText?: string
  emptyText?: string
  prefix?: string | string[]
  rows?: number
  size?: YMentionSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  placeholder: 'Type @ to mention',
  error: '',
  invalid: false,
  ariaDescribedby: '',
  disabled: false,
  clearable: false,
  loading: false,
  loadingText: 'Loading mentions',
  remoteErrorText: 'Failed to load mentions',
  emptyText: 'No mentions',
  prefix: '@',
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  search: [query: string, prefix: string]
  select: [option: YMentionOption, prefix: string]
  visibleChange: [open: boolean]
}>()

const generatedId = useId()
const yokConfig = useYokConfig()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const localValue = ref(props.modelValue)
const lastCaretIndex = ref(props.modelValue.length)
const remoteOptions = ref<YMentionOption[]>([])
const remoteLoading = ref(false)
const remoteError = ref('')
let remoteRequestId = 0

const fieldId = computed(() => props.id || `yok-mention-${generatedId}`)
const labelId = computed(() => `${fieldId.value}-label`)
const listboxId = computed(() => `${fieldId.value}-listbox`)
const resolvedSize = computed(() => props.size ?? mentionSizeByConfig[yokConfig.size.value])
const resolvedDensity = computed(() => yokConfig.density.value)
const hasInvalidState = computed(() => Boolean(props.error || props.invalid))
const describedBy = computed(() => props.ariaDescribedby || undefined)
const inputAriaLabel = computed(() => props.label || 'Mention')
const prefixes = computed(() => Array.isArray(props.prefix)
  ? props.prefix
  : props.prefix.split(',').map((item) => item.trim()).filter(Boolean)
)
const activeMention = computed(() => findMentionToken(localValue.value, lastCaretIndex.value))
const hasActiveRemoteQuery = computed(() => Boolean(props.remoteMethod && activeMention.value?.keyword.trim()))
const sourceOptions = computed(() => hasActiveRemoteQuery.value ? remoteOptions.value : props.options)
const isLoading = computed(() => props.loading || remoteLoading.value)
const emptyStatusText = computed(() => remoteError.value || props.emptyText)
const filteredOptions = computed(() => {
  const keyword = activeMention.value?.keyword.trim().toLowerCase() ?? ''

  if (!activeMention.value) {
    return []
  }

  if (!keyword || hasActiveRemoteQuery.value) {
    return sourceOptions.value
  }

  return sourceOptions.value.filter((option) =>
    option.label.toLowerCase().includes(keyword) ||
    option.value.toLowerCase().includes(keyword)
  )
})
const enabledOptions = computed(() => filteredOptions.value.filter((option) => !option.disabled))
const hasSuggestions = computed(() => filteredOptions.value.length > 0)
const showClearButton = computed(() => props.clearable && !props.disabled && localValue.value.length > 0)
const activeOption = computed(() => filteredOptions.value[activeIndex.value])
const activeOptionId = computed(() =>
  open.value && activeOption.value
    ? `${fieldId.value}-option-${activeOption.value.value}`
    : undefined
)

const { floatingStyles } = useFloatingLayer(textareaRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 6,
  matchReferenceWidth: true
})

useDismissableLayer({
  open,
  reference: textareaRef,
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

function findMentionToken(value: string, caretIndex: number): MentionToken | null {
  const beforeCaret = value.slice(0, caretIndex)
  let bestToken: MentionToken | null = null

  prefixes.value.forEach((prefix) => {
    if (!prefix) {
      return
    }

    const start = beforeCaret.lastIndexOf(prefix)

    if (start === -1) {
      return
    }

    const keyword = beforeCaret.slice(start + prefix.length)

    if (/\s/.test(keyword)) {
      return
    }

    if (!bestToken || start > bestToken.start) {
      bestToken = {
        prefix,
        keyword,
        start,
        end: caretIndex
      }
    }
  })

  return bestToken
}

function syncCaretFromTextarea() {
  const textarea = textareaRef.value

  lastCaretIndex.value = textarea?.selectionStart ?? localValue.value.length
}

function getFirstEnabledIndex() {
  return filteredOptions.value.findIndex((option) => !option.disabled)
}

function syncActiveToFirstEnabled() {
  activeIndex.value = getFirstEnabledIndex()
}

async function openSuggestions() {
  if (props.disabled || !activeMention.value) {
    closeSuggestions()
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
  const textarea = event.target as HTMLTextAreaElement
  const value = textarea.value

  localValue.value = value
  lastCaretIndex.value = textarea.selectionStart ?? value.length
  emit('update:modelValue', value)

  if (activeMention.value) {
    emit('search', activeMention.value.keyword, activeMention.value.prefix)
    updateRemoteOptions(activeMention.value.keyword, activeMention.value.prefix)
  } else {
    resetRemoteOptions()
  }

  void openSuggestions()
}

function commitValue() {
  emit('change', localValue.value)
}

function selectOption(option: YMentionOption) {
  if (option.disabled || !activeMention.value) {
    return
  }

  const token = activeMention.value
  const nextValue = `${localValue.value.slice(0, token.start)}${token.prefix}${option.value} ${localValue.value.slice(token.end)}`
  const nextCaret = token.start + token.prefix.length + option.value.length + 1

  localValue.value = nextValue
  lastCaretIndex.value = nextCaret
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
  emit('select', option, token.prefix)
  closeSuggestions()

  void nextTick(() => {
    textareaRef.value?.setSelectionRange(nextCaret, nextCaret)
  })
}

function clearValue() {
  localValue.value = ''
  lastCaretIndex.value = 0
  resetRemoteOptions()
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  closeSuggestions()
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

function handleFocus(event: FocusEvent) {
  emit('focus', event)
  void openSuggestions()
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
  commitValue()
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  syncCaretFromTextarea()

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

async function loadRemoteOptions(query: string, prefix: string) {
  const remoteMethod = props.remoteMethod

  if (!remoteMethod) {
    return
  }

  const requestId = ++remoteRequestId
  remoteError.value = ''
  remoteLoading.value = true

  try {
    const nextOptions = await remoteMethod(query, prefix)

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

function updateRemoteOptions(query: string, prefix: string) {
  if (!props.remoteMethod) {
    return
  }

  if (!query.trim()) {
    resetRemoteOptions()
    return
  }

  void loadRemoteOptions(query, prefix)
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
    localValue.value = value
    lastCaretIndex.value = Math.min(lastCaretIndex.value, value.length)
  }
)
</script>

<template>
  <div
    class="yok-mention"
    :class="[
      `yok-mention--${resolvedSize}`,
      `yok-mention--${resolvedDensity}`
    ]"
  >
    <label v-if="label" :id="labelId" class="yok-mention__label" :for="fieldId">{{ label }}</label>
    <span class="yok-mention__field" :class="{ 'yok-mention__field--invalid': hasInvalidState }">
      <textarea
        :id="fieldId"
        ref="textareaRef"
        class="yok-mention__control yok-focus-ring"
        role="combobox"
        :value="localValue"
        :placeholder="placeholder"
        :rows="rows"
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
        @focus="handleFocus"
        @blur="handleBlur"
        @input="updateValue"
        @click="() => { syncCaretFromTextarea(); openSuggestions() }"
        @keyup="() => { syncCaretFromTextarea(); openSuggestions() }"
        @keydown="handleKeydown"
      />
      <button
        v-if="showClearButton"
        class="yok-mention__clear yok-focus-ring"
        type="button"
        aria-label="Clear mention text"
        @click="clearValue"
      >
        x
      </button>
    </span>
    <span v-if="error" class="yok-mention__error" role="alert">{{ error }}</span>

    <div
      v-if="open"
      ref="panelRef"
      class="yok-mention__panel"
      :style="floatingStyles"
    >
      <div v-if="isLoading" class="yok-mention__empty" role="status">{{ loadingText }}</div>
      <div
        v-else-if="hasSuggestions"
        :id="listboxId"
        class="yok-mention__listbox"
        role="listbox"
        :aria-label="`${inputAriaLabel} suggestions`"
      >
        <button
          v-for="(option, index) in filteredOptions"
          :id="`${fieldId}-option-${option.value}`"
          :key="option.value"
          class="yok-mention__option yok-focus-ring"
          :class="{ 'yok-mention__option--active': index === activeIndex }"
          type="button"
          role="option"
          :disabled="option.disabled"
          :aria-selected="index === activeIndex ? 'true' : 'false'"
          @mousedown.prevent
          @click="selectOption(option)"
        >
          <span class="yok-mention__option-prefix">{{ activeMention?.prefix }}</span>
          <span class="yok-mention__option-content">
            <span class="yok-mention__option-label">{{ option.label }}</span>
            <span v-if="option.description" class="yok-mention__option-description">{{ option.description }}</span>
          </span>
        </button>
      </div>
      <div v-else class="yok-mention__empty" role="status">{{ emptyStatusText }}</div>
    </div>
  </div>
</template>

<style scoped>
.yok-mention {
  position: relative;
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-mention__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-mention__field {
  position: relative;
  display: block;
  width: 100%;
}

.yok-mention__control {
  width: 100%;
  resize: vertical;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  line-height: 1.6;
}

.yok-mention__control:focus {
  outline: 2px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  outline-offset: 2px;
}

.yok-mention__control:disabled {
  cursor: not-allowed;
  color: var(--yok-color-textMuted);
  background: color-mix(in srgb, var(--yok-color-border) 28%, var(--yok-color-surface));
  opacity: 0.72;
}

.yok-mention__field--invalid .yok-mention__control {
  border-color: var(--yok-color-danger);
}

.yok-mention__clear {
  position: absolute;
  top: var(--yok-space-2);
  right: var(--yok-space-2);
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-color-surface) 84%, transparent);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.yok-mention__clear:hover {
  background: color-mix(in srgb, var(--yok-color-primary) 10%, transparent);
  color: var(--yok-color-primary);
}

.yok-mention--small .yok-mention__control {
  min-height: 72px;
  padding: var(--yok-space-2);
  font-size: 13px;
}

.yok-mention--medium .yok-mention__control {
  min-height: 88px;
  padding: var(--yok-space-3);
  font-size: 14px;
}

.yok-mention--large .yok-mention__control {
  min-height: 104px;
  padding: var(--yok-space-4);
  font-size: 15px;
}

.yok-mention--compact .yok-mention__control {
  min-height: 76px;
}

.yok-mention__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-mention__panel {
  z-index: var(--yok-zIndex-popover, 1000);
  width: var(--yok-floating-reference-width, 280px);
  max-height: 260px;
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-2);
}

.yok-mention__listbox {
  display: grid;
  gap: var(--yok-space-1);
}

.yok-mention__option {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--yok-space-2);
  align-items: start;
  width: 100%;
  min-height: 38px;
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  padding: var(--yok-space-2) var(--yok-space-3);
  text-align: left;
}

.yok-mention__option:hover,
.yok-mention__option--active {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-mention__option:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.yok-mention__option-prefix {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-color-primary) 12%, transparent);
  color: var(--yok-color-primary);
  font-weight: 750;
}

.yok-mention__option-content {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.yok-mention__option-label {
  font-weight: 650;
}

.yok-mention__option-description,
.yok-mention__empty {
  color: var(--yok-color-textMuted);
  font-size: 12px;
}

.yok-mention__empty {
  padding: var(--yok-space-3);
}
</style>
