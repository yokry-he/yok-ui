<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YInputOtp'
})

export type YInputOtpMask = 'numeric' | 'alphanumeric' | 'all'
export type YInputOtpType = 'text' | 'password'

interface Props {
  id?: string
  modelValue?: string
  length?: number
  label?: string
  placeholder?: string
  mask?: YInputOtpMask
  type?: YInputOtpType
  disabled?: boolean
  invalid?: boolean
  error?: string
  ariaLabel?: string
  ariaDescribedby?: string
  size?: YokConfigSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  length: 6,
  label: '',
  placeholder: '',
  mask: 'numeric',
  type: 'text',
  disabled: false,
  invalid: false,
  error: '',
  ariaLabel: '',
  ariaDescribedby: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  complete: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const yokConfig = useYokConfig()
const inputElements = ref<HTMLInputElement[]>([])
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const hasInvalidState = computed(() => Boolean(props.error || props.invalid))
const normalizedLength = computed(() => Math.max(1, Math.min(12, Math.floor(props.length))))
const digits = computed(() => sanitizeValue(props.modelValue).slice(0, normalizedLength.value).split(''))
const describedby = computed(() => props.ariaDescribedby || undefined)
const groupAriaLabel = computed(() => props.ariaLabel || props.label || 'Verification code')

function sanitizeValue(value: string) {
  if (props.mask === 'numeric') {
    return value.replace(/\D/g, '')
  }

  if (props.mask === 'alphanumeric') {
    return value.replace(/[^a-zA-Z0-9]/g, '')
  }

  return value.replace(/\s/g, '')
}

function setInputRef(element: HTMLInputElement | null, index: number) {
  if (element) {
    inputElements.value[index] = element
  }
}

function focusInput(index: number) {
  const nextIndex = Math.max(0, Math.min(index, normalizedLength.value - 1))

  nextTick(() => {
    inputElements.value[nextIndex]?.focus()
    inputElements.value[nextIndex]?.select()
  })
}

function emitValue(nextValue: string, shouldCommit = false) {
  const sanitized = sanitizeValue(nextValue).slice(0, normalizedLength.value)

  emit('update:modelValue', sanitized)
  emit('input', sanitized)

  if (shouldCommit) {
    emit('change', sanitized)
  }

  if (sanitized.length === normalizedLength.value) {
    emit('complete', sanitized)
  }
}

function replaceFromIndex(index: number, rawValue: string) {
  if (props.disabled) {
    return
  }

  const incoming = sanitizeValue(rawValue)
  const current = digits.value

  if (!incoming) {
    current[index] = ''
    emitValue(current.join(''), true)
    return
  }

  incoming.split('').forEach((character, offset) => {
    const targetIndex = index + offset

    if (targetIndex < normalizedLength.value) {
      current[targetIndex] = character
    }
  })

  const nextValue = current.join('').slice(0, normalizedLength.value)
  emitValue(nextValue, true)
  focusInput(Math.min(index + incoming.length, normalizedLength.value - 1))
}

function handleInput(index: number, event: Event) {
  replaceFromIndex(index, (event.target as HTMLInputElement).value)
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusInput(index - 1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusInput(index + 1)
    return
  }

  if (event.key === 'Backspace' && digits.value[index]) {
    event.preventDefault()
    replaceFromIndex(index, '')
    focusInput(index - 1)
    return
  }

  if (event.key === 'Backspace') {
    event.preventDefault()
    replaceFromIndex(index - 1, '')
    focusInput(index - 1)
  }
}

function handlePaste(index: number, event: ClipboardEvent) {
  event.preventDefault()
  replaceFromIndex(index, event.clipboardData?.getData('text') ?? '')
}
</script>

<template>
  <div
    class="yok-input-otp"
    :class="[`yok-input-otp--${resolvedSize}`, { 'yok-input-otp--disabled': disabled }]"
  >
    <label v-if="label" class="yok-input-otp__label" :for="id || undefined">{{ label }}</label>
    <div
      class="yok-input-otp__group"
      :class="{ 'yok-input-otp__group--invalid': hasInvalidState }"
      role="group"
      :aria-label="groupAriaLabel"
      :aria-describedby="describedby"
    >
      <input
        v-for="index in normalizedLength"
        :id="id && index === 1 ? id : id ? `${id}-${index - 1}` : undefined"
        :key="index"
        :ref="(element) => setInputRef(element as HTMLInputElement | null, index - 1)"
        class="yok-input-otp__input yok-focus-ring"
        :type="type"
        inputmode="numeric"
        autocomplete="one-time-code"
        :value="digits[index - 1] || ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="`${groupAriaLabel} digit ${index}`"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        :aria-describedby="describedby"
        maxlength="1"
        @input="handleInput(index - 1, $event)"
        @keydown="handleKeydown(index - 1, $event)"
        @paste="handlePaste(index - 1, $event as ClipboardEvent)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <span v-if="error" class="yok-input-otp__error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.yok-input-otp {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-input-otp__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-input-otp__group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
}

.yok-input-otp__input {
  flex: 0 0 42px;
  width: 42px;
  height: 44px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font-size: 18px;
  font-weight: 750;
  text-align: center;
  transition:
    border-color var(--yok-motion-duration-fast) var(--yok-motion-ease),
    box-shadow var(--yok-motion-duration-fast) var(--yok-motion-ease),
    background var(--yok-motion-duration-fast) var(--yok-motion-ease);
}

.yok-input-otp__input:focus {
  border-color: color-mix(in srgb, var(--yok-color-primary) 65%, var(--yok-color-border));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--yok-color-primary) 14%, transparent);
}

.yok-input-otp__group--invalid .yok-input-otp__input {
  border-color: var(--yok-color-danger);
}

.yok-input-otp__input:disabled {
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-textMuted);
  cursor: not-allowed;
}

.yok-input-otp__error {
  color: var(--yok-color-danger);
  font-size: 12px;
  font-weight: 650;
}

.yok-input-otp--sm .yok-input-otp__input {
  flex-basis: 34px;
  width: 34px;
  height: 36px;
  font-size: 15px;
}

.yok-input-otp--lg .yok-input-otp__input {
  flex-basis: 50px;
  width: 50px;
  height: 52px;
  font-size: 20px;
}
</style>
