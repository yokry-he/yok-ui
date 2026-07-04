<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YInputTag'
})

export type YInputTagInvalidReason = 'empty' | 'duplicate' | 'max' | 'validator'

export interface YInputTagInvalidPayload {
  reason: YInputTagInvalidReason
  value: string
  message: string
}

interface Props {
  id?: string
  modelValue?: string[]
  inputValue?: string
  label?: string
  placeholder?: string
  max?: number
  allowDuplicate?: boolean
  validateTag?: (value: string, tags: string[]) => boolean | string
  disabled?: boolean
  invalid?: boolean
  error?: string
  ariaLabel?: string
  ariaDescribedby?: string
  size?: YokConfigSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: () => [],
  inputValue: '',
  label: '',
  placeholder: '',
  max: undefined,
  allowDuplicate: false,
  validateTag: undefined,
  disabled: false,
  invalid: false,
  error: '',
  ariaLabel: '',
  ariaDescribedby: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'update:inputValue': [value: string]
  add: [value: string]
  remove: [value: string]
  change: [value: string[]]
  invalid: [payload: YInputTagInvalidPayload]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const yokConfig = useYokConfig()
const draft = ref(props.inputValue)
const inputElement = ref<HTMLInputElement | null>(null)
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const hasInvalidState = computed(() => Boolean(props.invalid || props.error))
const inputAriaLabel = computed(() => props.ariaLabel || (!props.id ? props.label : '') || undefined)
const currentCount = computed(() => props.modelValue.length)
const maxReached = computed(() => typeof props.max === 'number' && currentCount.value >= props.max)
const helperText = computed(() => {
  if (props.error) {
    return props.error
  }

  return typeof props.max === 'number' ? `${currentCount.value}/${props.max}` : ''
})

watch(() => props.inputValue, (value) => {
  draft.value = value
})

function emitInvalid(reason: YInputTagInvalidReason, value: string, message: string) {
  emit('invalid', {
    reason,
    value,
    message
  })
}

function updateDraft(event: Event) {
  draft.value = (event.target as HTMLInputElement).value
  emit('update:inputValue', draft.value)
}

function commitTags(tags: string[]) {
  emit('update:modelValue', tags)
  emit('change', tags)
}

function clearDraft() {
  draft.value = ''
  emit('update:inputValue', '')
}

function validateNextTag(value: string) {
  if (!value) {
    return 'Tag cannot be empty.'
  }

  if (!props.allowDuplicate && props.modelValue.includes(value)) {
    return 'Tag already exists.'
  }

  if (maxReached.value) {
    return `Maximum ${props.max} tags.`
  }

  const validationResult = props.validateTag?.(value, props.modelValue)

  if (typeof validationResult === 'string') {
    return validationResult
  }

  if (validationResult === false) {
    return 'Tag is invalid.'
  }

  return ''
}

function addTag() {
  if (props.disabled) {
    return
  }

  const value = draft.value.trim()
  const message = validateNextTag(value)

  if (message) {
    const reason = !value
      ? 'empty'
      : !props.allowDuplicate && props.modelValue.includes(value)
        ? 'duplicate'
        : maxReached.value
          ? 'max'
          : 'validator'

    emitInvalid(reason, value, message)
    return
  }

  const nextTags = [...props.modelValue, value]
  commitTags(nextTags)
  emit('add', value)
  clearDraft()
}

function removeTag(index: number) {
  if (props.disabled) {
    return
  }

  const value = props.modelValue[index]
  const nextTags = props.modelValue.filter((_, itemIndex) => itemIndex !== index)

  commitTags(nextTags)
  emit('remove', value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
    return
  }

  if (event.key === 'Backspace' && draft.value.length === 0 && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}

function focusInput() {
  if (!props.disabled) {
    inputElement.value?.focus()
  }
}
</script>

<template>
  <div class="yok-input-tag" :class="[`yok-input-tag--${resolvedSize}`, { 'yok-input-tag--disabled': disabled }]">
    <label v-if="label" class="yok-input-tag__label" :for="id || undefined">{{ label }}</label>
    <div
      class="yok-input-tag__field"
      :class="{ 'yok-input-tag__field--invalid': hasInvalidState }"
      @click="focusInput"
    >
      <span v-for="(tag, index) in modelValue" :key="`${tag}-${index}`" class="yok-input-tag__tag">
        <span class="yok-input-tag__tag-text">{{ tag }}</span>
        <button
          class="yok-input-tag__remove yok-focus-ring"
          type="button"
          :aria-label="`Remove ${tag}`"
          :disabled="disabled"
          @click.stop="removeTag(index)"
        >
          x
        </button>
      </span>
      <input
        :id="id || undefined"
        ref="inputElement"
        class="yok-input-tag__control yok-focus-ring"
        :value="draft"
        :placeholder="modelValue.length ? '' : placeholder"
        :disabled="disabled"
        :aria-label="inputAriaLabel"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        :aria-describedby="ariaDescribedby || undefined"
        @input="updateDraft"
        @keydown="handleKeydown"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <span v-if="helperText" class="yok-input-tag__helper" :role="error ? 'alert' : undefined">
        {{ helperText }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.yok-input-tag {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-input-tag__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-input-tag__field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-2);
  min-height: 40px;
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  padding: var(--yok-space-1) var(--yok-space-2);
  transition:
    border-color var(--yok-motion-duration-fast) var(--yok-motion-ease),
    box-shadow var(--yok-motion-duration-fast) var(--yok-motion-ease);
}

.yok-input-tag__field:focus-within {
  border-color: color-mix(in srgb, var(--yok-color-primary) 55%, var(--yok-color-border));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--yok-color-primary) 12%, transparent);
}

.yok-input-tag__field--invalid {
  border-color: var(--yok-color-danger);
}

.yok-input-tag__tag {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-height: 26px;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 18%, var(--yok-color-border));
  border-radius: var(--yok-radius-sm);
  background: color-mix(in srgb, var(--yok-color-primary) 8%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-size: 13px;
  font-weight: 650;
}

.yok-input-tag__tag-text {
  min-width: 0;
  overflow: hidden;
  padding: 0 0 0 var(--yok-space-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-input-tag__remove {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.yok-input-tag__remove:hover {
  background: color-mix(in srgb, var(--yok-color-primary) 12%, transparent);
}

.yok-input-tag__control {
  flex: 1 1 96px;
  min-width: 80px;
  height: 30px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--yok-color-text);
  font: inherit;
}

.yok-input-tag__control::placeholder {
  color: var(--yok-color-textMuted);
}

.yok-input-tag__control:disabled {
  cursor: not-allowed;
  color: var(--yok-color-textMuted);
}

.yok-input-tag__helper {
  margin-left: auto;
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 650;
}

.yok-input-tag__field--invalid .yok-input-tag__helper {
  color: var(--yok-color-danger);
}

.yok-input-tag--disabled {
  color: var(--yok-color-textMuted);
}

.yok-input-tag--disabled .yok-input-tag__field {
  background: var(--yok-color-surfaceMuted);
  cursor: not-allowed;
}

.yok-input-tag--sm .yok-input-tag__field {
  min-height: 34px;
}

.yok-input-tag--sm .yok-input-tag__tag {
  min-height: 22px;
  font-size: 12px;
}

.yok-input-tag--lg .yok-input-tag__field {
  min-height: 46px;
}

.yok-input-tag--lg .yok-input-tag__tag {
  min-height: 30px;
}
</style>
