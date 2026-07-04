<script setup lang="ts">
import { computed } from 'vue'
import {
  getSliderPercent,
  normalizeSliderRangeValue,
  normalizeSliderValue,
  sortSliderMarks,
  type YSliderMark,
  type YSliderTooltipPlacement,
  type YSliderValue
} from './slider'

defineOptions({
  name: 'YSlider'
})

interface Props {
  modelValue?: YSliderValue
  label?: string
  min?: number
  max?: number
  step?: number
  precision?: number
  range?: boolean
  vertical?: boolean
  height?: string
  showTooltip?: boolean
  tooltipPlacement?: YSliderTooltipPlacement
  disabled?: boolean
  showValue?: boolean
  marks?: YSliderMark[]
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  label: '',
  min: 0,
  max: 100,
  step: 1,
  precision: undefined,
  range: false,
  vertical: false,
  height: '160px',
  showTooltip: false,
  tooltipPlacement: 'top',
  disabled: false,
  showValue: true,
  marks: () => [],
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: YSliderValue]
  change: [value: YSliderValue]
}>()

const normalizedValue = computed(() => normalizeSliderValue({
  value: Array.isArray(props.modelValue) ? props.modelValue[1] ?? props.max : props.modelValue,
  min: props.min,
  max: props.max,
  step: props.step,
  precision: props.precision
}))
const normalizedRangeValue = computed(() => normalizeSliderRangeValue({
  value: props.modelValue,
  min: props.min,
  max: props.max,
  step: props.step,
  precision: props.precision
}))
const fillStartPercent = computed(() => props.range ? getSliderPercent(normalizedRangeValue.value[0], props.min, props.max) : 0)
const fillEndPercent = computed(() => getSliderPercent(props.range ? normalizedRangeValue.value[1] : normalizedValue.value, props.min, props.max))
const sortedMarks = computed(() => sortSliderMarks(props.marks))
const formattedValue = computed(() => {
  if (!props.range) {
    return formatValue(normalizedValue.value)
  }

  return `${formatValue(normalizedRangeValue.value[0])} - ${formatValue(normalizedRangeValue.value[1])}`
})

function formatValue(value: number) {
  return typeof props.precision === 'number' ? value.toFixed(props.precision) : String(value)
}

function getMarkPercent(value: number) {
  return getSliderPercent(value, props.min, props.max)
}

function getMarkStyle(value: number) {
  const percent = getMarkPercent(value)

  return props.vertical
    ? { insetBlockEnd: `${percent}%` }
    : { insetInlineStart: `${percent}%` }
}

function parseValue(event: Event) {
  return Number((event.target as HTMLInputElement).value)
}

function getSingleValue(event: Event) {
  return normalizeSliderValue({
    value: parseValue(event),
    min: props.min,
    max: props.max,
    step: props.step,
    precision: props.precision
  })
}

function getRangeValue(event: Event, thumb: 'start' | 'end') {
  const nextValue = parseValue(event)
  const [start, end] = normalizedRangeValue.value

  return normalizeSliderRangeValue({
    value: thumb === 'start' ? [nextValue, end] : [start, nextValue],
    min: props.min,
    max: props.max,
    step: props.step,
    precision: props.precision
  })
}

function updateValue(event: Event, thumb?: 'start' | 'end') {
  emit('update:modelValue', props.range && thumb ? getRangeValue(event, thumb) : getSingleValue(event))
}

function commitValue(event: Event, thumb?: 'start' | 'end') {
  emit('change', props.range && thumb ? getRangeValue(event, thumb) : getSingleValue(event))
}
</script>

<template>
  <label
    class="yok-slider"
    :class="{
      'yok-slider--disabled': disabled,
      'yok-slider--range': range,
      'yok-slider--vertical': vertical
    }"
  >
    <span v-if="label || showValue" class="yok-slider__header">
      <span v-if="label" class="yok-slider__label">{{ label }}</span>
      <output v-if="showValue" class="yok-slider__value">{{ formattedValue }}</output>
    </span>

    <span
      class="yok-slider__control"
      :class="{
        'yok-slider__control--range': range,
        'yok-slider__control--vertical': vertical
      }"
      :style="{
        '--yok-slider-fill-start': `${fillStartPercent}%`,
        '--yok-slider-fill-end': `${fillEndPercent}%`,
        '--yok-slider-height': height
      }"
    >
      <span
        v-if="showTooltip"
        class="yok-slider__tooltip"
        :data-placement="tooltipPlacement"
        aria-hidden="true"
      >
        {{ formattedValue }}
      </span>
      <input
        v-if="!range"
        class="yok-slider__input yok-focus-ring"
        type="range"
        :value="normalizedValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="normalizedValue"
        :aria-valuetext="formattedValue"
        @input="updateValue"
        @change="commitValue"
      />
      <template v-else>
        <input
          class="yok-slider__input yok-slider__input--range yok-focus-ring"
          type="range"
          :value="normalizedRangeValue[0]"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :aria-label="`${label || 'Slider'} minimum`"
          :aria-invalid="error ? 'true' : 'false'"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="normalizedRangeValue[0]"
          :aria-valuetext="formatValue(normalizedRangeValue[0])"
          @input="updateValue($event, 'start')"
          @change="commitValue($event, 'start')"
        />
        <input
          class="yok-slider__input yok-slider__input--range yok-focus-ring"
          type="range"
          :value="normalizedRangeValue[1]"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :aria-label="`${label || 'Slider'} maximum`"
          :aria-invalid="error ? 'true' : 'false'"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="normalizedRangeValue[1]"
          :aria-valuetext="formatValue(normalizedRangeValue[1])"
          @input="updateValue($event, 'end')"
          @change="commitValue($event, 'end')"
        />
      </template>
    </span>

    <span v-if="sortedMarks.length" class="yok-slider__marks" aria-hidden="true">
      <span
        v-for="mark in sortedMarks"
        :key="mark.value"
        class="yok-slider__mark"
        :style="{ ...getMarkStyle(mark.value), '--yok-slider-height': height }"
      >
        <span class="yok-slider__dot" />
        <span class="yok-slider__mark-label">{{ mark.label }}</span>
      </span>
    </span>

    <span v-if="error" class="yok-slider__error" role="alert">{{ error }}</span>
  </label>
</template>

<style scoped>
.yok-slider {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-slider--vertical {
  width: max-content;
  justify-items: start;
}

.yok-slider__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
}

.yok-slider__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-slider__value {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 750;
}

.yok-slider__control {
  --yok-slider-fill-start: 0%;
  --yok-slider-fill-end: 0%;
  --yok-slider-height: 160px;
  position: relative;
  display: grid;
  min-height: 28px;
  align-items: center;
  border-radius: 999px;
  background:
    linear-gradient(
      90deg,
      var(--yok-color-primarySoft) 0 var(--yok-slider-fill-start),
      var(--yok-color-primary) var(--yok-slider-fill-start) var(--yok-slider-fill-end),
      var(--yok-color-primarySoft) var(--yok-slider-fill-end) 100%
    );
}

.yok-slider__control--vertical {
  width: 28px;
  min-height: var(--yok-slider-height);
  justify-items: center;
  background:
    linear-gradient(
      0deg,
      var(--yok-color-primarySoft) 0 var(--yok-slider-fill-start),
      var(--yok-color-primary) var(--yok-slider-fill-start) var(--yok-slider-fill-end),
      var(--yok-color-primarySoft) var(--yok-slider-fill-end) 100%
    );
}

.yok-slider__input {
  width: 100%;
  height: 8px;
  margin: 0;
  border-radius: 999px;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.yok-slider__control--vertical .yok-slider__input {
  width: 8px;
  height: var(--yok-slider-height);
  writing-mode: vertical-lr;
  direction: rtl;
}

.yok-slider__tooltip {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  min-width: 28px;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border: 1px solid var(--yok-color-border);
  border-radius: 999px;
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  color: var(--yok-color-text);
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}

.yok-slider__tooltip[data-placement='top'] {
  inset-block-end: calc(100% + 8px);
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.yok-slider__tooltip[data-placement='bottom'] {
  inset-block-start: calc(100% + 8px);
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.yok-slider__tooltip[data-placement='left'] {
  inset-block-start: 50%;
  inset-inline-end: calc(100% + 8px);
  transform: translateY(-50%);
}

.yok-slider__tooltip[data-placement='right'] {
  inset-block-start: 50%;
  inset-inline-start: calc(100% + 8px);
  transform: translateY(-50%);
}

.yok-slider__control--range {
  position: relative;
  min-height: 28px;
}

.yok-slider__input--range {
  position: absolute;
  inset-inline: 0;
  inset-block-start: 50%;
  transform: translateY(-50%);
}

.yok-slider__control--vertical .yok-slider__input--range {
  inset-block: 0;
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.yok-slider__input::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 999px;
  background: transparent;
}

.yok-slider__input::-moz-range-track {
  height: 8px;
  border-radius: 999px;
  background: transparent;
}

.yok-slider__input::-webkit-slider-thumb {
  position: relative;
  width: 20px;
  height: 20px;
  border: 3px solid var(--yok-color-primary);
  border-radius: 999px;
  appearance: none;
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  z-index: 1;
}

.yok-slider__input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: 3px solid var(--yok-color-primary);
  border-radius: 999px;
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-slider__input:hover:not(:disabled)::-webkit-slider-thumb {
  border-color: color-mix(in srgb, var(--yok-color-primary) 78%, var(--yok-color-text));
}

.yok-slider__input:disabled {
  cursor: not-allowed;
  opacity: 0.54;
}

.yok-slider__marks {
  position: relative;
  min-height: 30px;
  margin-inline: 10px;
}

.yok-slider--vertical .yok-slider__marks {
  min-width: 54px;
  min-height: var(--yok-slider-height);
  margin-block-start: calc(-1 * var(--yok-slider-height));
  margin-inline-start: 34px;
}

.yok-slider__mark {
  position: absolute;
  inset-block-start: 0;
  display: grid;
  justify-items: center;
  gap: 2px;
  transform: translateX(-50%);
}

.yok-slider--vertical .yok-slider__mark {
  inset-block-start: auto;
  inset-inline-start: 0;
  grid-auto-flow: column;
  align-items: center;
  justify-items: start;
  transform: translateY(50%);
}

.yok-slider__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--yok-color-border);
}

.yok-slider__mark-label {
  color: var(--yok-color-textMuted);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.yok-slider__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-slider--disabled {
  opacity: 0.68;
}
</style>
