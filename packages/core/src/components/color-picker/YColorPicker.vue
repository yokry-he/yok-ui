<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'
import { defaultColorPresets, isValidHexColor, normalizeColorPresets, normalizeHexColor } from './color-picker'
import type { YColorPickerSize } from './color-picker'

defineOptions({
  name: 'YColorPicker'
})

interface Props {
  id?: string
  modelValue?: string
  label?: string
  ariaLabel?: string
  ariaDescribedby?: string
  placeholder?: string
  presets?: string[]
  showAlpha?: boolean
  showText?: boolean
  size?: YColorPickerSize
  clearable?: boolean
  disabled?: boolean
  showValue?: boolean
  error?: string
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  ariaLabel: '',
  ariaDescribedby: '',
  placeholder: '#14B8A6',
  presets: () => defaultColorPresets,
  showAlpha: false,
  showText: false,
  clearable: true,
  disabled: false,
  showValue: true,
  error: '',
  invalid: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
}>()

const colorPickerSizeByConfig: Record<YokConfigSize, YColorPickerSize> = {
  sm: 'small',
  md: 'medium',
  lg: 'large'
}

const yokConfig = useYokConfig()
const colorPickerId = useId()
const textValue = ref(props.modelValue)

const fieldId = computed(() => props.id || `yok-color-picker-${colorPickerId}`)
const nativeInputId = computed(() => `${fieldId.value}-native`)
const resolvedSize = computed(() => props.size ?? colorPickerSizeByConfig[yokConfig.size.value])
const resolvedDensity = computed(() => yokConfig.density.value)
const normalizedValue = computed(() => normalizeHexColor(props.modelValue, props.showAlpha))
const previewColorValue = computed(() => normalizedValue.value || normalizeHexColor(props.placeholder, props.showAlpha) || '#14B8A6')
const colorInputValue = computed(() => {
  return previewColorValue.value.slice(0, 7)
})
const normalizedPresets = computed(() => normalizeColorPresets(props.presets, props.showAlpha))
const isTextInvalid = computed(() => Boolean(textValue.value.trim()) && !isValidHexColor(textValue.value, props.showAlpha))
const hasInvalidState = computed(() => props.invalid || Boolean(props.error) || isTextInvalid.value)
const labelId = computed(() => `${fieldId.value}-label`)
const helpId = computed(() => `${fieldId.value}-help`)
const errorId = computed(() => `${fieldId.value}-error`)
const describedBy = computed(() => {
  const ids = [props.ariaDescribedby]

  if (props.error) {
    ids.push(errorId.value)
  } else if (isTextInvalid.value) {
    ids.push(helpId.value)
  }

  return ids.filter(Boolean).join(' ') || undefined
})

watch(() => props.modelValue, (value) => {
  textValue.value = value
})

function commitValue(value: string) {
  if (props.disabled) {
    return
  }

  const nextValue = normalizeHexColor(value, props.showAlpha)

  if (!nextValue) {
    return
  }

  textValue.value = nextValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

function handleColorInput(event: Event) {
  commitValue((event.target as HTMLInputElement).value)
}

function handleTextInput(event: Event) {
  const nextValue = (event.target as HTMLInputElement).value

  textValue.value = nextValue

  if (isValidHexColor(nextValue, props.showAlpha)) {
    commitValue(nextValue)
  }
}

function normalizeTextInput() {
  if (!textValue.value.trim()) {
    textValue.value = normalizedValue.value
    return
  }

  if (isValidHexColor(textValue.value, props.showAlpha)) {
    textValue.value = normalizeHexColor(textValue.value, props.showAlpha)
    return
  }

  textValue.value = props.modelValue
}

function clearValue() {
  if (props.disabled) {
    return
  }

  textValue.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}
</script>

<template>
  <div
    class="yok-color-picker"
    :class="[
      `yok-color-picker--${resolvedSize}`,
      `yok-color-picker--${resolvedDensity}`,
      {
        'yok-color-picker--disabled': disabled
      }
    ]"
  >
    <span v-if="label" :id="labelId" class="yok-color-picker__label">{{ label }}</span>

    <div class="yok-color-picker__control">
      <label
        class="yok-color-picker__swatch yok-focus-ring"
        :style="{ '--yok-color-picker-value': previewColorValue }"
      >
        <span class="yok-color-picker__swatch-text" aria-hidden="true"></span>
        <span v-if="showText" class="yok-color-picker__trigger-text">{{ normalizedValue || 'No color' }}</span>
        <input
          :id="nativeInputId"
          class="yok-color-picker__native"
          type="color"
          :value="colorInputValue"
          :disabled="disabled"
          :aria-labelledby="label ? labelId : undefined"
          :aria-label="label ? undefined : ariaLabel || 'Choose color'"
          :aria-invalid="hasInvalidState ? 'true' : 'false'"
          :aria-describedby="describedBy"
          @input="handleColorInput"
          @change="handleColorInput"
        />
      </label>

      <input
        :id="fieldId"
        class="yok-color-picker__text yok-focus-ring"
        type="text"
        inputmode="text"
        spellcheck="false"
        :value="textValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-labelledby="label ? labelId : undefined"
        :aria-label="label ? undefined : ariaLabel || 'Color value'"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        :aria-describedby="describedBy"
        @input="handleTextInput"
        @blur="normalizeTextInput"
      />

      <button
        v-if="clearable"
        class="yok-color-picker__clear yok-focus-ring"
        type="button"
        :disabled="disabled || !modelValue"
        aria-label="Clear color"
        @click="clearValue"
      >
        Clear
      </button>
    </div>

    <div v-if="normalizedPresets.length" class="yok-color-picker__presets" role="group" aria-label="Preset colors">
      <button
        v-for="preset in normalizedPresets"
        :key="preset"
        class="yok-color-picker__preset yok-focus-ring"
        type="button"
        :disabled="disabled"
        :style="{ '--yok-color-picker-preset': preset }"
        :aria-label="`Select ${preset}`"
        :aria-pressed="normalizedValue === preset ? 'true' : 'false'"
        @click="commitValue(preset)"
      />
    </div>

    <output v-if="showValue" class="yok-color-picker__value">{{ normalizedValue || 'No color selected' }}</output>
    <span v-if="error" :id="errorId" class="yok-color-picker__error" role="alert">{{ error }}</span>
    <span v-else-if="isTextInvalid" :id="helpId" class="yok-color-picker__error" role="alert">
      Use a HEX color like #14B8A6
    </span>
  </div>
</template>

<style scoped>
.yok-color-picker {
  --yok-color-picker-trigger-height: 38px;
  --yok-color-picker-swatch-width: 42px;
  --yok-color-picker-text-min-height: 38px;
  --yok-color-picker-font-size: 13px;
  display: grid;
  gap: var(--yok-space-2);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-color-picker--small {
  --yok-color-picker-trigger-height: 32px;
  --yok-color-picker-swatch-width: 34px;
  --yok-color-picker-text-min-height: 32px;
  --yok-color-picker-font-size: 12px;
}

.yok-color-picker--large {
  --yok-color-picker-trigger-height: 44px;
  --yok-color-picker-swatch-width: 50px;
  --yok-color-picker-text-min-height: 44px;
  --yok-color-picker-font-size: 14px;
}

.yok-color-picker--compact {
  gap: var(--yok-space-1);
}

.yok-color-picker--compact.yok-color-picker--medium {
  --yok-color-picker-trigger-height: 34px;
  --yok-color-picker-swatch-width: 38px;
  --yok-color-picker-text-min-height: 34px;
}

.yok-color-picker--compact.yok-color-picker--large {
  --yok-color-picker-trigger-height: 40px;
  --yok-color-picker-swatch-width: 44px;
  --yok-color-picker-text-min-height: 40px;
}

.yok-color-picker__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-color-picker__control {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-color-picker--compact .yok-color-picker__control,
.yok-color-picker--compact .yok-color-picker__presets {
  gap: var(--yok-space-1);
}

.yok-color-picker__swatch {
  position: relative;
  display: inline-flex;
  width: auto;
  min-width: var(--yok-color-picker-swatch-width);
  height: var(--yok-color-picker-trigger-height);
  flex: 0 0 auto;
  align-items: center;
  gap: var(--yok-space-2);
  justify-content: flex-start;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background:
    linear-gradient(45deg, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 25%, transparent 25%),
    linear-gradient(-45deg, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 75%),
    linear-gradient(-45deg, transparent 75%, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 75%);
  background-color: var(--yok-color-surface);
  background-position:
    0 0,
    0 5px,
    5px -5px,
    -5px 0;
  background-size: 10px 10px;
  cursor: pointer;
}

.yok-color-picker__swatch-text {
  width: calc(var(--yok-color-picker-swatch-width) - 10px);
  height: calc(var(--yok-color-picker-trigger-height) - 10px);
  flex: 0 0 calc(var(--yok-color-picker-swatch-width) - 10px);
  margin-inline-start: 5px;
  border-radius: calc(var(--yok-radius-md) - 4px);
  background: var(--yok-color-picker-value);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--yok-color-text) 14%, transparent);
}

.yok-color-picker__trigger-text {
  padding-inline-end: var(--yok-space-3);
  color: var(--yok-color-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: var(--yok-color-picker-font-size);
  font-weight: 750;
  letter-spacing: 0;
  white-space: nowrap;
}

.yok-color-picker__native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  opacity: 0;
  cursor: pointer;
}

.yok-color-picker__text {
  min-height: var(--yok-color-picker-text-min-height);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: var(--yok-color-picker-font-size);
  font-weight: 650;
  letter-spacing: 0;
  padding: 0 var(--yok-space-3);
  text-transform: uppercase;
}

.yok-color-picker__text[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-color-picker__clear {
  min-height: var(--yok-color-picker-text-min-height);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-weight: 750;
  padding: 0 var(--yok-space-3);
}

.yok-color-picker__clear:disabled,
.yok-color-picker__native:disabled,
.yok-color-picker__preset:disabled {
  cursor: not-allowed;
}

.yok-color-picker__presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-color-picker__preset {
  width: 26px;
  height: 26px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-picker-preset);
  cursor: pointer;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--yok-color-text) 10%, transparent);
}

.yok-color-picker__preset[aria-pressed='true'] {
  border-color: var(--yok-color-primary);
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--yok-color-primary) 18%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--yok-color-text) 12%, transparent);
}

.yok-color-picker__value {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 750;
}

.yok-color-picker__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-color-picker--disabled {
  opacity: 0.68;
}

@media (max-width: 480px) {
  .yok-color-picker__control {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .yok-color-picker__clear {
    grid-column: 1 / -1;
  }
}
</style>
