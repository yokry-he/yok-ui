<script setup lang="ts">
import { computed } from 'vue'
import { YSelect, type YSelectSize } from '../select'
import { createTimeSelectOptions, type YTimeSelectFormat } from './time-select'

defineOptions({
  name: 'YTimeSelect'
})

interface Props {
  id?: string
  modelValue?: string
  label?: string
  ariaLabel?: string
  ariaDescribedby?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  start?: string
  end?: string
  step?: string
  minTime?: string
  maxTime?: string
  format?: YTimeSelectFormat
  error?: string
  size?: YSelectSize
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  ariaLabel: '',
  ariaDescribedby: '',
  placeholder: 'Select time',
  disabled: false,
  clearable: true,
  start: '00:00',
  end: '23:59',
  step: '00:30',
  minTime: '',
  maxTime: '',
  format: 'HH:mm',
  error: '',
  invalid: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  visibleChange: [open: boolean]
}>()

const options = computed(() => createTimeSelectOptions(props))
</script>

<template>
  <div class="yok-time-select">
    <YSelect
      :id="id"
      :model-value="modelValue"
      :options="options"
      :label="label"
      :aria-label="ariaLabel"
      :placeholder="placeholder"
      :error="error"
      :invalid="invalid"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      @update:model-value="emit('update:modelValue', $event as string)"
      @change="emit('change', $event as string)"
      @clear="emit('clear')"
      @visible-change="emit('visibleChange', $event)"
    />
  </div>
</template>

<style scoped>
.yok-time-select {
  display: block;
  color: var(--yok-color-text);
  font-size: var(--yok-time-select-font-size, 14px);
}
</style>
