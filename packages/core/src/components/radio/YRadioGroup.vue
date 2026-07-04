<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YRadioGroup'
})

export type YRadioValue = string | number

export interface YRadioOption {
  label: string
  value: YRadioValue
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue?: YRadioValue
  id?: string
  label?: string
  description?: string
  options: YRadioOption[]
  disabled?: boolean
  invalid?: boolean
  error?: string
  ariaDescribedby?: string
  direction?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  id: '',
  label: '',
  description: '',
  disabled: false,
  invalid: false,
  error: '',
  ariaDescribedby: '',
  direction: 'horizontal'
})

const emit = defineEmits<{
  'update:modelValue': [value: YRadioValue]
  change: [value: YRadioValue]
}>()

const describedby = computed(() => props.ariaDescribedby || undefined)

function selectOption(option: YRadioOption) {
  if (props.disabled || option.disabled) {
    return
  }

  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<template>
  <fieldset
    :id="id || undefined"
    class="yok-radio-group"
    :class="[`yok-radio-group--${direction}`, { 'yok-radio-group--invalid': invalid || error }]"
    :disabled="disabled"
    :aria-invalid="invalid || error ? 'true' : undefined"
    :aria-describedby="describedby"
  >
    <legend v-if="label" class="yok-radio-group__label">{{ label }}</legend>
    <p v-if="description" class="yok-radio-group__description">{{ description }}</p>
    <label
      v-for="option in options"
      :key="option.value"
      class="yok-radio"
      :class="{ 'yok-radio--disabled': disabled || option.disabled }"
    >
      <input
        class="yok-radio__input"
        type="radio"
        :value="option.value"
        :checked="modelValue === option.value"
        :disabled="disabled || option.disabled"
        @change="selectOption(option)"
      />
      <span class="yok-radio__circle" aria-hidden="true" />
      <span class="yok-radio__content">
        <span class="yok-radio__label">{{ option.label }}</span>
        <span v-if="option.description" class="yok-radio__description">{{ option.description }}</span>
      </span>
    </label>
    <p v-if="error" class="yok-radio-group__error" role="alert">{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.yok-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-3);
  min-width: 0;
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--yok-color-text);
}

.yok-radio-group--vertical {
  flex-direction: column;
}

.yok-radio-group--horizontal {
  flex-direction: row;
}

.yok-radio-group__label {
  width: 100%;
  margin-bottom: var(--yok-space-1);
  font-size: 13px;
  font-weight: 650;
}

.yok-radio-group__description {
  width: 100%;
  margin: 0;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.5;
}

.yok-radio {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  gap: var(--yok-space-2);
  cursor: pointer;
}

.yok-radio__input {
  position: absolute;
  width: 18px;
  height: 18px;
  opacity: 0;
}

.yok-radio__circle {
  width: 18px;
  height: 18px;
  border: 1px solid var(--yok-color-border);
  border-radius: 999px;
  background: var(--yok-color-surface);
}

.yok-radio__content {
  display: grid;
  gap: 2px;
}

.yok-radio__label {
  font-weight: 650;
}

.yok-radio__description {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.4;
}

.yok-radio__input:checked + .yok-radio__circle {
  border: 5px solid var(--yok-color-primary);
}

.yok-radio__input:focus-visible + .yok-radio__circle {
  outline: 3px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  outline-offset: 2px;
}

.yok-radio--disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-radio-group__error {
  width: 100%;
  margin: 0;
  color: var(--yok-color-danger);
  font-size: 12px;
  line-height: 1.5;
}

.yok-radio-group--invalid .yok-radio__circle {
  border-color: var(--yok-color-danger);
}
</style>
