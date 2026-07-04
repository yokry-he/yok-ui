<script setup lang="ts">
import { computed } from 'vue'
import YCheckbox from './YCheckbox.vue'

defineOptions({
  name: 'YCheckboxGroup'
})

export type YCheckboxGroupValue = string | number

export interface YCheckboxGroupOption {
  label: string
  value: YCheckboxGroupValue
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue?: YCheckboxGroupValue[]
  id?: string
  label?: string
  description?: string
  options?: YCheckboxGroupOption[]
  disabled?: boolean
  invalid?: boolean
  error?: string
  ariaDescribedby?: string
  direction?: 'horizontal' | 'vertical'
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  id: '',
  label: '',
  description: '',
  options: () => [],
  disabled: false,
  invalid: false,
  error: '',
  ariaDescribedby: '',
  direction: 'vertical',
  min: 0,
  max: Number.POSITIVE_INFINITY
})

const emit = defineEmits<{
  'update:modelValue': [value: YCheckboxGroupValue[]]
  change: [value: YCheckboxGroupValue[]]
}>()

const valueSet = computed(() => new Set(props.modelValue))
const describedby = computed(() => [props.ariaDescribedby].filter(Boolean).join(' ') || undefined)

function isSelected(value: YCheckboxGroupValue) {
  return valueSet.value.has(value)
}

function isOptionDisabled(option: YCheckboxGroupOption) {
  if (props.disabled || option.disabled) {
    return true
  }

  const selected = isSelected(option.value)
  const selectedCount = props.modelValue.length

  if (selected && selectedCount <= props.min) {
    return true
  }

  return !selected && selectedCount >= props.max
}

function updateOption(option: YCheckboxGroupOption, checked: boolean) {
  if (isOptionDisabled(option)) {
    return
  }

  const nextValue = checked
    ? Array.from(new Set([...props.modelValue, option.value]))
    : props.modelValue.filter((value) => value !== option.value)

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<template>
  <fieldset
    :id="id || undefined"
    class="yok-checkbox-group"
    :class="[`yok-checkbox-group--${direction}`, { 'yok-checkbox-group--invalid': invalid || error }]"
    :disabled="disabled"
    :aria-invalid="invalid || error ? 'true' : undefined"
    :aria-describedby="describedby"
  >
    <legend v-if="label" class="yok-checkbox-group__label">{{ label }}</legend>
    <p v-if="description" class="yok-checkbox-group__description">{{ description }}</p>
    <div class="yok-checkbox-group__options">
      <YCheckbox
        v-for="option in options"
        :key="option.value"
        :model-value="isSelected(option.value)"
        :label="option.label"
        :description="option.description"
        :disabled="isOptionDisabled(option)"
        @update:model-value="updateOption(option, $event)"
      />
    </div>
    <p v-if="error" class="yok-checkbox-group__error" role="alert">{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.yok-checkbox-group {
  min-width: 0;
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--yok-color-text);
}

.yok-checkbox-group__label {
  margin-bottom: var(--yok-space-1);
  font-size: 14px;
  font-weight: 700;
}

.yok-checkbox-group__description {
  margin: 0 0 var(--yok-space-3);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.5;
}

.yok-checkbox-group__options {
  display: flex;
  gap: var(--yok-space-3);
}

.yok-checkbox-group__error {
  margin: var(--yok-space-2) 0 0;
  color: var(--yok-color-danger);
  font-size: 12px;
  line-height: 1.5;
}

.yok-checkbox-group--vertical .yok-checkbox-group__options {
  flex-direction: column;
}

.yok-checkbox-group--horizontal .yok-checkbox-group__options {
  flex-flow: row wrap;
  align-items: flex-start;
}

.yok-checkbox-group--invalid :deep(.yok-checkbox__box) {
  border-color: var(--yok-color-danger);
}
</style>
