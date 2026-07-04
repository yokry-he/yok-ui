<script setup lang="ts">
import { computed } from 'vue'
import { useYokConfig } from '../config-provider'

defineOptions({
  name: 'YSegmented'
})

export type YSegmentedValue = string | number
export type YSegmentedSize = 'sm' | 'md' | 'lg'
export type YSegmentedOrientation = 'horizontal' | 'vertical'
export type YSegmentedShape = 'default' | 'round'

export interface YSegmentedOption {
  label: string
  value: YSegmentedValue
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue?: YSegmentedValue
  options: Array<YSegmentedOption | YSegmentedValue>
  name?: string
  label?: string
  ariaLabel?: string
  disabled?: boolean
  block?: boolean
  orientation?: YSegmentedOrientation
  shape?: YSegmentedShape
  size?: YSegmentedSize
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  name: '',
  label: '',
  ariaLabel: '',
  disabled: false,
  block: false,
  orientation: 'horizontal',
  shape: 'default',
  size: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: YSegmentedValue]
  change: [value: YSegmentedValue]
}>()

const yokConfig = useYokConfig()
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const normalizedOptions = computed<YSegmentedOption[]>(() =>
  props.options.map((option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        label: String(option),
        value: option
      }
    }

    return option
  })
)
const groupLabel = computed(() => props.ariaLabel || props.label || undefined)

function selectOption(option: YSegmentedOption) {
  if (props.disabled || option.disabled || option.value === props.modelValue) {
    return
  }

  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<template>
  <fieldset
    class="yok-segmented"
    :class="[
      `yok-segmented--${resolvedSize}`,
      `yok-segmented--${orientation}`,
      `yok-segmented--${shape}`,
      {
        'yok-segmented--block': block,
        'is-disabled': disabled
      }
    ]"
    :disabled="disabled"
    role="radiogroup"
    :aria-label="groupLabel"
  >
    <legend v-if="label" class="yok-segmented__legend">{{ label }}</legend>
    <label
      v-for="option in normalizedOptions"
      :key="option.value"
      class="yok-segmented__item"
      :class="{
        'is-selected': modelValue === option.value,
        'is-disabled': disabled || option.disabled
      }"
    >
      <input
        class="yok-segmented__input"
        type="radio"
        :name="name || undefined"
        :value="option.value"
        :checked="modelValue === option.value"
        :disabled="disabled || option.disabled"
        @change="selectOption(option)"
      />
      <span class="yok-segmented__content">
        <span class="yok-segmented__label">{{ option.label }}</span>
        <span v-if="option.description" class="yok-segmented__description">{{ option.description }}</span>
      </span>
    </label>
  </fieldset>
</template>

<style scoped>
.yok-segmented {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
  min-width: 0;
  margin: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-border) 82%, transparent);
  border-radius: var(--yok-radius-lg);
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 72%, var(--yok-color-surface));
  color: var(--yok-color-text);
  padding: 4px;
}

.yok-segmented--block {
  display: flex;
  width: 100%;
}

.yok-segmented--vertical {
  flex-direction: column;
}

.yok-segmented--round {
  border-radius: 999px;
}

.yok-segmented--round.yok-segmented--vertical {
  border-radius: var(--yok-radius-xl);
}

.yok-segmented__legend {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.yok-segmented__item {
  position: relative;
  display: inline-grid;
  flex: 0 0 auto;
  min-width: 0;
  place-items: center;
  border-radius: calc(var(--yok-radius-md) - 2px);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  transition:
    background var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast),
    color var(--yok-motion-fast),
    transform var(--yok-motion-fast);
}

.yok-segmented--block .yok-segmented__item {
  flex: 1 1 0;
}

.yok-segmented--round .yok-segmented__item {
  border-radius: 999px;
}

.yok-segmented__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: inherit;
  opacity: 0;
}

.yok-segmented__content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1px;
  min-width: 0;
  justify-items: center;
  pointer-events: none;
  text-align: center;
}

.yok-segmented__label {
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 750;
}

.yok-segmented__description {
  overflow: hidden;
  max-width: 100%;
  color: currentColor;
  font-size: 12px;
  line-height: 1.35;
  opacity: 0.72;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-segmented--sm .yok-segmented__item {
  min-height: 28px;
  padding: 4px 10px;
  font-size: 12px;
}

.yok-segmented--md .yok-segmented__item {
  min-height: 34px;
  padding: 5px 14px;
  font-size: 13px;
}

.yok-segmented--lg .yok-segmented__item {
  min-height: 40px;
  padding: 6px 18px;
  font-size: 14px;
}

.yok-segmented__item:hover:not(.is-disabled) {
  color: var(--yok-color-text);
  transform: translateY(-1px);
}

.yok-segmented__item.is-selected {
  background: var(--yok-color-surface);
  color: var(--yok-color-primary);
  box-shadow: var(--yok-shadow-soft);
}

.yok-segmented__item.is-disabled,
.yok-segmented.is-disabled .yok-segmented__item {
  cursor: not-allowed;
  opacity: 0.56;
}

.yok-segmented__input:focus-visible + .yok-segmented__content {
  outline: 3px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  outline-offset: 5px;
  border-radius: inherit;
}
</style>
