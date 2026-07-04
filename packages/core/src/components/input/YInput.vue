<script setup lang="ts">
import { computed, ref } from 'vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YInput'
})

interface Props {
  id?: string
  modelValue?: string
  type?: 'text' | 'search' | 'password' | 'email' | 'url' | 'tel'
  label?: string
  placeholder?: string
  prefixText?: string
  suffixText?: string
  showPassword?: boolean
  clearable?: boolean
  showCount?: boolean
  maxlength?: number
  autocomplete?: string
  ariaLabel?: string
  error?: string
  invalid?: boolean
  ariaDescribedby?: string
  disabled?: boolean
  size?: YokConfigSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  type: 'text',
  label: '',
  placeholder: '',
  prefixText: '',
  suffixText: '',
  showPassword: false,
  clearable: false,
  showCount: false,
  maxlength: undefined,
  autocomplete: '',
  ariaLabel: '',
  error: '',
  invalid: false,
  ariaDescribedby: '',
  disabled: false
})

const yokConfig = useYokConfig()
const passwordVisible = ref(false)
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const hasInvalidState = computed(() => Boolean(props.error || props.invalid))
const currentLength = computed(() => props.modelValue.length)
const showClearButton = computed(() => props.clearable && !props.disabled && props.modelValue.length > 0)
const showPasswordButton = computed(() => props.type === 'password' && props.showPassword && !props.disabled)
const resolvedInputType = computed(() => showPasswordButton.value && passwordVisible.value ? 'text' : props.type)
const describedby = computed(() => props.ariaDescribedby || undefined)
const hasAffix = computed(() => Boolean(props.prefixText || props.suffixText || props.showCount || showClearButton.value || showPasswordButton.value))
const inputAriaLabel = computed(() => props.ariaLabel || (!props.id ? props.label : '') || undefined)
const passwordToggleLabel = computed(() => passwordVisible.value ? 'Hide password' : 'Show password')

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function commitValue(event: Event) {
  emit('change', (event.target as HTMLInputElement).value)
}

function clearValue() {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
  <div class="yok-input" :class="`yok-input--${resolvedSize}`">
    <label v-if="label" class="yok-input__label" :for="id || undefined">{{ label }}</label>
    <span class="yok-input__field" :class="{ 'yok-input__field--invalid': hasInvalidState, 'yok-input__field--affix': hasAffix }">
      <span v-if="prefixText" class="yok-input__prefix" aria-hidden="true">{{ prefixText }}</span>
      <input
        :id="id || undefined"
        class="yok-input__control yok-focus-ring"
        :type="resolvedInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :autocomplete="autocomplete || undefined"
        :disabled="disabled"
        :aria-label="inputAriaLabel"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        :aria-describedby="describedby"
        @input="updateValue"
        @change="commitValue"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <span v-if="showCount" class="yok-input__count" aria-live="polite">
        {{ currentLength }}<template v-if="maxlength">/{{ maxlength }}</template>
      </span>
      <button
        v-if="showPasswordButton"
        class="yok-input__password-toggle yok-focus-ring"
        type="button"
        :aria-label="passwordToggleLabel"
        :aria-pressed="passwordVisible ? 'true' : 'false'"
        @click="togglePasswordVisibility"
      >
        {{ passwordVisible ? 'Hide' : 'Show' }}
      </button>
      <button
        v-if="showClearButton"
        class="yok-input__clear yok-focus-ring"
        type="button"
        aria-label="Clear input"
        @click="clearValue"
      >
        x
      </button>
      <span v-if="suffixText" class="yok-input__suffix" aria-hidden="true">{{ suffixText }}</span>
    </span>
    <span v-if="error" class="yok-input__error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.yok-input {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-input__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-input__field {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  overflow: hidden;
}

.yok-input__field:focus-within {
  outline: 2px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  outline-offset: 2px;
}

.yok-input__field--invalid {
  border-color: var(--yok-color-danger);
}

.yok-input__control {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--yok-color-text);
  padding: 0 var(--yok-space-3);
}

.yok-input__control:disabled {
  cursor: not-allowed;
  color: var(--yok-color-textMuted);
}

.yok-input__prefix,
.yok-input__suffix,
.yok-input__count {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  white-space: nowrap;
}

.yok-input__prefix {
  padding-left: var(--yok-space-3);
}

.yok-input__suffix,
.yok-input__count {
  padding-right: var(--yok-space-3);
}

.yok-input__clear,
.yok-input__password-toggle {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
}

.yok-input__clear {
  font-size: 18px;
  line-height: 1;
}

.yok-input__password-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  padding: 0 var(--yok-space-2);
  font-size: 12px;
  font-weight: 700;
}

.yok-input__clear:hover,
.yok-input__password-toggle:hover {
  background: color-mix(in srgb, var(--yok-color-primary) 10%, transparent);
  color: var(--yok-color-primary);
}

.yok-input--sm .yok-input__field {
  min-height: 32px;
}

.yok-input--sm .yok-input__control {
  font-size: 13px;
}

.yok-input--md .yok-input__field {
  min-height: 38px;
}

.yok-input--md .yok-input__control {
  font-size: 14px;
}

.yok-input--lg .yok-input__field {
  min-height: 44px;
}

.yok-input--lg .yok-input__control {
  font-size: 15px;
}

.yok-input:has(.yok-input__control:disabled) .yok-input__field {
  background: color-mix(in srgb, var(--yok-color-border) 28%, var(--yok-color-surface));
  opacity: 0.72;
}

.yok-input__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}
</style>
