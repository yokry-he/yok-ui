<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  formatInputNumberValue,
  normalizeInputNumberValue,
  parseInputNumberValue,
  stepInputNumberValue,
  type YInputNumberValue
} from './input-number'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YInputNumber'
})

interface Props {
  modelValue?: YInputNumberValue
  label?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  controls?: boolean
  error?: string
  size?: YokConfigSize
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  placeholder: '',
  min: undefined,
  max: undefined,
  step: 1,
  precision: undefined,
  disabled: false,
  controls: true,
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: YInputNumberValue]
  change: [value: YInputNumberValue]
}>()

const yokConfig = useYokConfig()
const inputText = ref(formatInputNumberValue(props.modelValue, props.precision))
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)
const normalizedValue = computed(() => normalizeInputNumberValue({
  value: props.modelValue,
  min: props.min,
  max: props.max,
  precision: props.precision
}))
const canDecrease = computed(() => !props.disabled && (typeof props.min !== 'number' || (props.modelValue ?? 0) > props.min))
const canIncrease = computed(() => !props.disabled && (typeof props.max !== 'number' || (props.modelValue ?? 0) < props.max))

watch(() => [props.modelValue, props.precision] as const, () => {
  inputText.value = formatInputNumberValue(props.modelValue, props.precision)
})

function commitValue(value: YInputNumberValue) {
  const nextValue = normalizeInputNumberValue({
    value,
    min: props.min,
    max: props.max,
    precision: props.precision
  })

  inputText.value = formatInputNumberValue(nextValue, props.precision)
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  inputText.value = target.value
  emit('update:modelValue', parseInputNumberValue(target.value))
}

function handleBlur() {
  commitValue(parseInputNumberValue(inputText.value))
}

function stepValue(direction: 1 | -1) {
  if (props.disabled) {
    return
  }

  commitValue(stepInputNumberValue({
    value: normalizedValue.value,
    step: props.step,
    direction,
    min: props.min,
    max: props.max,
    precision: props.precision
  }))
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    stepValue(1)
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    stepValue(-1)
  }
}
</script>

<template>
  <label
    class="yok-input-number"
    :class="[
      `yok-input-number--${resolvedSize}`,
      `yok-input-number--${resolvedDensity}`,
      { 'yok-input-number--disabled': disabled }
    ]"
  >
    <span v-if="label" class="yok-input-number__label">{{ label }}</span>
    <span class="yok-input-number__control">
      <input
        class="yok-input-number__input yok-focus-ring"
        type="number"
        inputmode="decimal"
        :value="inputText"
        :placeholder="placeholder"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue ?? undefined"
        :aria-invalid="error ? 'true' : 'false'"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      <span v-if="controls" class="yok-input-number__buttons">
        <button
          class="yok-input-number__button yok-focus-ring"
          type="button"
          :disabled="!canIncrease"
          aria-label="Increase value"
          @click="stepValue(1)"
        >
          <span aria-hidden="true">+</span>
        </button>
        <button
          class="yok-input-number__button yok-focus-ring"
          type="button"
          :disabled="!canDecrease"
          aria-label="Decrease value"
          @click="stepValue(-1)"
        >
          <span aria-hidden="true">−</span>
        </button>
      </span>
    </span>
    <span v-if="error" class="yok-input-number__error" role="alert">{{ error }}</span>
  </label>
</template>

<style scoped>
.yok-input-number {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-input-number__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-input-number__control {
  position: relative;
  display: flex;
  min-width: 0;
}

.yok-input-number__input {
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  padding: 0 72px 0 var(--yok-space-3);
}

.yok-input-number--sm .yok-input-number__input {
  min-height: 32px;
  font-size: 13px;
}

.yok-input-number--md .yok-input-number__input {
  min-height: 38px;
  font-size: 14px;
}

.yok-input-number--lg .yok-input-number__input {
  min-height: 44px;
  font-size: 15px;
}

.yok-input-number--compact {
  gap: var(--yok-space-1);
}

.yok-input-number--compact.yok-input-number--md .yok-input-number__input {
  min-height: 34px;
}

.yok-input-number--compact.yok-input-number--lg .yok-input-number__input {
  min-height: 40px;
}

.yok-input-number__input[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-input-number__input::-webkit-outer-spin-button,
.yok-input-number__input::-webkit-inner-spin-button {
  margin: 0;
  appearance: none;
}

.yok-input-number__buttons {
  position: absolute;
  inset-block: 4px;
  inset-inline-end: 4px;
  display: grid;
  width: 60px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
}

.yok-input-number__button {
  display: grid;
  min-width: 0;
  place-items: center;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.yok-input-number__button:hover:not(:disabled) {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-input-number__button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.yok-input-number__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-input-number--disabled {
  opacity: 0.68;
}
</style>
