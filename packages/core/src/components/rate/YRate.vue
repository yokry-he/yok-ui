<script setup lang="ts">
import { computed, ref } from 'vue'
import { getNextRateValue, getRateItemState, normalizeRateValue } from './rate'
import type { YRateSize } from './rate'

defineOptions({
  name: 'YRate'
})

interface Props {
  modelValue?: number
  count?: number
  label?: string
  allowHalf?: boolean
  texts?: string[]
  size?: YRateSize
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  showValue?: boolean
  icon?: string
  voidIcon?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  count: 5,
  label: '',
  allowHalf: false,
  texts: () => [],
  size: 'medium',
  clearable: true,
  disabled: false,
  readonly: false,
  showValue: true,
  icon: '★',
  voidIcon: '☆',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const hoverValue = ref(0)
const activeValue = computed(() => hoverValue.value || normalizedValue.value)
const normalizedValue = computed(() => normalizeRateValue({
  value: props.modelValue,
  count: props.count,
  allowHalf: props.allowHalf
}))
const interactive = computed(() => !props.disabled && !props.readonly)
const items = computed(() => Array.from({ length: props.count }, (_, index) => index))
const activeText = computed(() => getRateText(normalizedValue.value))
const valueText = computed(() => activeText.value ? activeText.value : `${normalizedValue.value} of ${props.count}`)

function commitValue(value: number) {
  if (!interactive.value) {
    return
  }

  const nextValue = getNextRateValue({
    currentValue: normalizedValue.value,
    nextValue: value,
    count: props.count,
    allowHalf: props.allowHalf,
    clearable: props.clearable
  })

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

function previewValue(value: number) {
  if (!interactive.value) {
    return
  }

  hoverValue.value = normalizeRateValue({
    value,
    count: props.count,
    allowHalf: props.allowHalf
  })
}

function clearPreview() {
  hoverValue.value = 0
}

function handleKeydown(event: KeyboardEvent) {
  if (!interactive.value) {
    return
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    commitValue(normalizedValue.value + (props.allowHalf ? 0.5 : 1))
    return
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    commitValue(normalizedValue.value - (props.allowHalf ? 0.5 : 1))
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    commitValue(0)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    commitValue(props.count)
  }
}

function getItemValue(index: number, half = false) {
  return index + (half ? 0.5 : 1)
}

function getItemState(index: number) {
  return getRateItemState({
    value: activeValue.value,
    index
  })
}

function getRateText(value: number) {
  if (!props.texts.length || value <= 0) {
    return ''
  }

  return props.texts[Math.ceil(value) - 1] ?? ''
}

function getItemAriaLabel(value: number) {
  const text = getRateText(value)
  const baseLabel = `${value} of ${props.count}`

  return text ? `${baseLabel}, ${text}` : baseLabel
}
</script>

<template>
  <div
    class="yok-rate"
    :class="[
      `yok-rate--${size}`,
      {
        'yok-rate--disabled': disabled,
        'yok-rate--readonly': readonly
      }
    ]"
  >
    <span v-if="label" class="yok-rate__label">{{ label }}</span>
    <span class="yok-rate__control">
      <span
        class="yok-rate__group"
        :class="{ 'yok-rate__group--half': allowHalf }"
        role="radiogroup"
        :aria-label="label || 'Rating'"
        :aria-readonly="readonly ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-invalid="error ? 'true' : 'false'"
        @mouseleave="clearPreview"
        @keydown="handleKeydown"
      >
        <span v-for="index in items" :key="index" class="yok-rate__item">
          <button
            v-if="allowHalf"
            class="yok-rate__hit yok-rate__hit--half yok-focus-ring"
            type="button"
            role="radio"
            :disabled="disabled || readonly"
            :aria-label="getItemAriaLabel(getItemValue(index, true))"
            :aria-checked="normalizedValue === getItemValue(index, true) ? 'true' : 'false'"
            :tabindex="index === 0 ? 0 : -1"
            :title="getRateText(getItemValue(index, true))"
            @mouseenter="previewValue(getItemValue(index, true))"
            @focus="previewValue(getItemValue(index, true))"
            @click="commitValue(getItemValue(index, true))"
          />
          <button
            class="yok-rate__hit yok-rate__hit--full yok-focus-ring"
            type="button"
            role="radio"
            :disabled="disabled || readonly"
            :aria-label="getItemAriaLabel(getItemValue(index))"
            :aria-checked="normalizedValue === getItemValue(index) ? 'true' : 'false'"
            :tabindex="index === 0 && !allowHalf ? 0 : -1"
            :title="getRateText(getItemValue(index))"
            @mouseenter="previewValue(getItemValue(index))"
            @focus="previewValue(getItemValue(index))"
            @click="commitValue(getItemValue(index))"
          />
          <span
            class="yok-rate__icon"
            :class="{
              'yok-rate__icon--active': getItemState(index) === 'full',
              'yok-rate__icon--half': getItemState(index) === 'half'
            }"
            aria-hidden="true"
          >
            <span class="yok-rate__icon-empty">{{ voidIcon }}</span>
            <span class="yok-rate__icon-fill">{{ icon }}</span>
          </span>
        </span>
      </span>
      <output v-if="showValue" class="yok-rate__value">{{ valueText }}</output>
    </span>
    <span v-if="error" class="yok-rate__error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.yok-rate {
  --yok-rate-item-size: 28px;
  --yok-rate-icon-size: 24px;
  --yok-rate-font-size: 22px;
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-rate--small {
  --yok-rate-item-size: 24px;
  --yok-rate-icon-size: 20px;
  --yok-rate-font-size: 18px;
}

.yok-rate--large {
  --yok-rate-item-size: 34px;
  --yok-rate-icon-size: 30px;
  --yok-rate-font-size: 28px;
}

.yok-rate__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-rate__control {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-3);
}

.yok-rate__group {
  display: inline-flex;
  gap: 2px;
}

.yok-rate__item {
  position: relative;
  display: inline-grid;
  width: var(--yok-rate-item-size);
  height: var(--yok-rate-item-size);
  flex: 0 0 var(--yok-rate-item-size);
  place-items: center;
}

.yok-rate__hit {
  position: absolute;
  inset-block: 0;
  z-index: 1;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.yok-rate__hit--half {
  inset-inline-start: 0;
  width: 50%;
}

.yok-rate__hit--full {
  inset-inline-end: 0;
  width: 100%;
}

.yok-rate__group--half .yok-rate__hit--full {
  width: 50%;
}

.yok-rate__hit:disabled {
  cursor: not-allowed;
}

.yok-rate__icon {
  position: relative;
  display: inline-grid;
  width: var(--yok-rate-icon-size);
  height: var(--yok-rate-icon-size);
  flex: 0 0 var(--yok-rate-icon-size);
  place-items: center;
  color: var(--yok-color-border);
  font-size: var(--yok-rate-font-size);
  line-height: 1;
}

.yok-rate__icon-fill {
  position: absolute;
  inset: 0;
  display: grid;
  width: 0;
  overflow: hidden;
  place-items: center;
  color: var(--yok-color-warning);
}

.yok-rate__icon--active .yok-rate__icon-fill {
  width: 100%;
}

.yok-rate__icon--half .yok-rate__icon-fill {
  width: 50%;
}

.yok-rate__value {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 750;
}

.yok-rate__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-rate--disabled,
.yok-rate--readonly {
  opacity: 0.68;
}
</style>
