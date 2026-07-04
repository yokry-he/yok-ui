<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { defaultColorPresets, isValidHexColor, normalizeColorPresets, normalizeHexColor } from './color-picker'

defineOptions({
  name: 'YColorPickerPanel'
})

interface Props {
  id?: string
  modelValue?: string
  label?: string
  ariaLabel?: string
  ariaDescribedby?: string
  presets?: string[]
  showAlpha?: boolean
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
  presets: () => defaultColorPresets,
  showAlpha: false,
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

const generatedId = useId()
const textValue = ref(props.modelValue)

const fieldId = computed(() => props.id || `yok-color-picker-panel-${generatedId}`)
const labelId = computed(() => props.label ? `${fieldId.value}-label` : undefined)
const nativeInputId = computed(() => `${fieldId.value}-native`)
const errorId = computed(() => `${fieldId.value}-error`)
const helpId = computed(() => `${fieldId.value}-help`)
const normalizedValue = computed(() => normalizeHexColor(props.modelValue, props.showAlpha))
const displayValue = computed(() => normalizedValue.value || 'No color selected')
const previewColorValue = computed(() => normalizedValue.value || '#14B8A6')
const colorInputValue = computed(() => previewColorValue.value.slice(0, 7))
const normalizedPresets = computed(() => normalizeColorPresets(props.presets, props.showAlpha))
const isTextInvalid = computed(() => Boolean(textValue.value.trim()) && !isValidHexColor(textValue.value, props.showAlpha))
const hasInvalidState = computed(() => props.invalid || Boolean(props.error) || isTextInvalid.value)
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

function commitValue(value: string, force = false) {
  if (props.disabled) {
    return
  }

  const nextValue = normalizeHexColor(value, props.showAlpha)

  if (!nextValue) {
    return
  }

  if (!force && normalizeHexColor(textValue.value, props.showAlpha) === nextValue) {
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
    commitValue(nextValue, true)
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
    class="yok-color-picker-panel"
    :class="{ 'yok-color-picker-panel--disabled': disabled }"
    role="group"
    :aria-labelledby="label ? labelId : undefined"
    :aria-label="label ? undefined : ariaLabel || 'Color picker panel'"
  >
    <div class="yok-color-picker-panel__header">
      <span v-if="label" :id="labelId" class="yok-color-picker-panel__label">{{ label }}</span>
      <output v-if="showValue" class="yok-color-picker-panel__value">{{ displayValue }}</output>
    </div>

    <div class="yok-color-picker-panel__preview">
      <label
        class="yok-color-picker-panel__swatch yok-focus-ring"
        :style="{ '--yok-color-picker-panel-value': previewColorValue }"
      >
        <span class="yok-color-picker-panel__swatch-inner" aria-hidden="true"></span>
        <input
          :id="nativeInputId"
          class="yok-color-picker-panel__native"
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
        class="yok-color-picker-panel__text yok-focus-ring"
        type="text"
        inputmode="text"
        spellcheck="false"
        :value="textValue"
        placeholder="#14B8A6"
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
        class="yok-color-picker-panel__clear yok-focus-ring"
        type="button"
        :disabled="disabled || !modelValue"
        aria-label="Clear color"
        @click="clearValue"
      >
        Clear
      </button>
    </div>

    <div v-if="normalizedPresets.length" class="yok-color-picker-panel__presets" role="group" aria-label="Preset colors">
      <button
        v-for="preset in normalizedPresets"
        :key="preset"
        class="yok-color-picker-panel__preset yok-focus-ring"
        type="button"
        :disabled="disabled"
        :style="{ '--yok-color-picker-panel-preset': preset }"
        :aria-label="`Select ${preset}`"
        :aria-pressed="normalizedValue === preset ? 'true' : 'false'"
        @click="commitValue(preset)"
      />
    </div>

    <span v-if="error" :id="errorId" class="yok-color-picker-panel__error" role="alert">{{ error }}</span>
    <span v-else-if="isTextInvalid" :id="helpId" class="yok-color-picker-panel__error" role="alert">
      Use a HEX color like #14B8A6
    </span>
  </div>
</template>

<style scoped>
.yok-color-picker-panel {
  display: grid;
  gap: var(--yok-space-3);
  min-width: 0;
  padding: var(--yok-space-4);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  box-shadow: var(--yok-shadow-soft);
}

.yok-color-picker-panel__header,
.yok-color-picker-panel__preview {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-color-picker-panel__header {
  justify-content: space-between;
}

.yok-color-picker-panel__label {
  font-size: 13px;
  font-weight: 750;
}

.yok-color-picker-panel__value,
.yok-color-picker-panel__text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  letter-spacing: 0;
}

.yok-color-picker-panel__value {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 750;
}

.yok-color-picker-panel__swatch {
  position: relative;
  display: inline-flex;
  width: 48px;
  height: 38px;
  flex: 0 0 48px;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background:
    linear-gradient(45deg, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 25%, transparent 25%),
    linear-gradient(-45deg, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 75%),
    linear-gradient(-45deg, transparent 75%, color-mix(in srgb, var(--yok-color-border) 42%, transparent) 75%);
  background-color: var(--yok-color-surfaceMuted);
  background-position:
    0 0,
    0 5px,
    5px -5px,
    -5px 0;
  background-size: 10px 10px;
  cursor: pointer;
}

.yok-color-picker-panel__swatch-inner {
  position: absolute;
  inset: 5px;
  border-radius: calc(var(--yok-radius-md) - 4px);
  background: var(--yok-color-picker-panel-value);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--yok-color-text) 14%, transparent);
}

.yok-color-picker-panel__native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  opacity: 0;
  cursor: pointer;
}

.yok-color-picker-panel__text {
  min-height: 38px;
  min-width: 0;
  flex: 1 1 auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font-size: 13px;
  font-weight: 650;
  padding: 0 var(--yok-space-3);
  text-transform: uppercase;
}

.yok-color-picker-panel__text[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-color-picker-panel__clear {
  min-height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-weight: 750;
  padding: 0 var(--yok-space-3);
}

.yok-color-picker-panel__presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-color-picker-panel__preset {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-picker-panel-preset);
  cursor: pointer;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--yok-color-text) 10%, transparent);
}

.yok-color-picker-panel__preset[aria-pressed='true'] {
  border-color: var(--yok-color-primary);
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--yok-color-primary) 18%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--yok-color-text) 12%, transparent);
}

.yok-color-picker-panel__clear:disabled,
.yok-color-picker-panel__native:disabled,
.yok-color-picker-panel__preset:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.yok-color-picker-panel__error {
  color: var(--yok-color-danger);
  font-size: 12px;
  font-weight: 750;
}

@media (max-width: 520px) {
  .yok-color-picker-panel__preview {
    align-items: stretch;
    flex-wrap: wrap;
  }

  .yok-color-picker-panel__text {
    flex-basis: calc(100% - 58px);
  }
}
</style>
