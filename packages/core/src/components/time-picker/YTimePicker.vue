<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import {
  createMinuteOptions,
  createTimeOption,
  formatTimeValue,
  parseTimeValue,
  type YTimePickerDisabledTime,
  type YTimePickerOption
} from './time'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import YInternalIcon from '../_internal/YInternalIcon.vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YTimePicker'
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
  minuteStep?: number
  disabledTime?: YTimePickerDisabledTime
  error?: string
  size?: YokConfigSize
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
  minuteStep: 1,
  disabledTime: undefined,
  error: '',
  invalid: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  visibleChange: [open: boolean]
}>()

const open = ref(false)
const generatedId = useId()
const yokConfig = useYokConfig()
const controlRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)

const parsedValue = computed(() => parseTimeValue(props.modelValue))
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)
const activeHour = ref(parsedValue.value?.hour ?? 9)
const activeMinute = ref(parsedValue.value?.minute ?? 0)

const fieldId = computed(() => props.id || `yok-time-picker-${generatedId}`)
const panelId = computed(() => `${fieldId.value}-panel`)
const errorId = computed(() => `${fieldId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => [props.ariaDescribedby, props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined)
const hourOptions = computed(() => Array.from({ length: 24 }, (_, hour) => hour))
const minuteOptions = computed(() => createMinuteOptions(props.minuteStep))
const activeOption = computed(() => createTimeOption(activeHour.value, activeMinute.value, props.disabledTime))
const { floatingStyles } = useFloatingLayer(controlRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 8
})

watch(() => props.modelValue, (value) => {
  const parsed = parseTimeValue(value)

  if (parsed) {
    activeHour.value = parsed.hour
    activeMinute.value = parsed.minute
  }
})

watch(minuteOptions, (options) => {
  if (!options.includes(activeMinute.value)) {
    activeMinute.value = options[0] ?? 0
  }
})

watch(open, (isOpen) => {
  emit('visibleChange', isOpen)
})

function emitValue(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
}

function focusActiveMinute() {
  nextTick(() => {
    panelRef.value?.querySelector<HTMLButtonElement>('[data-active-time="true"]')?.focus()
  })
}

function openPanel() {
  if (props.disabled) {
    return
  }

  const parsed = parsedValue.value

  if (parsed) {
    activeHour.value = parsed.hour
    activeMinute.value = parsed.minute
  }

  open.value = true
  focusActiveMinute()
}

function closePanel() {
  open.value = false
  inputRef.value?.focus()
}

const { layerStyle } = useDismissableLayer({
  open,
  reference: controlRef,
  floating: panelRef,
  onDismiss: closePanel
})

function togglePanel() {
  if (open.value) {
    closePanel()
  } else {
    openPanel()
  }
}

function setHour(hour: number) {
  activeHour.value = hour
  focusActiveMinute()
}

function setMinute(minute: number) {
  activeMinute.value = minute
  focusActiveMinute()
}

function commitTime(option: YTimePickerOption = activeOption.value) {
  if (option.disabled) {
    return
  }

  activeHour.value = option.hour
  activeMinute.value = option.minute
  emitValue(option.value)
  closePanel()
}

function clearValue() {
  if (props.disabled || !props.modelValue) {
    return
  }

  emitValue('')
  emit('clear')
  inputRef.value?.focus()
}

function moveHour(amount: number) {
  activeHour.value = (activeHour.value + amount + 24) % 24
  focusActiveMinute()
}

function moveMinute(amount: number) {
  const options = minuteOptions.value
  const currentIndex = Math.max(0, options.indexOf(activeMinute.value))
  const nextIndex = Math.min(Math.max(0, currentIndex + amount), options.length - 1)

  activeMinute.value = options[nextIndex] ?? 0
  focusActiveMinute()
}

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPanel()
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    commitTime()
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveMinute(-1)
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveMinute(1)
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    moveHour(-1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    moveHour(1)
  }
}
</script>

<template>
  <div
    class="yok-time-picker"
    :class="[
      `yok-time-picker--${resolvedSize}`,
      `yok-time-picker--${resolvedDensity}`,
      {
        'yok-time-picker--open': open,
        'yok-time-picker--disabled': disabled
      }
    ]"
  >
    <label v-if="label" class="yok-time-picker__label" :for="fieldId">{{ label }}</label>
    <div ref="controlRef" class="yok-time-picker__control">
      <input
        :id="fieldId"
        ref="inputRef"
        class="yok-time-picker__input yok-focus-ring"
        type="text"
        readonly
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="ariaLabel || undefined"
        :aria-describedby="describedBy"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="panelId"
        aria-haspopup="dialog"
        :aria-invalid="isInvalid ? 'true' : 'false'"
        @click="openPanel"
        @keydown="handleInputKeydown"
      />
      <button
        class="yok-time-picker__trigger yok-focus-ring"
        type="button"
        :disabled="disabled"
        :aria-label="open ? 'Close time picker' : 'Open time picker'"
        @click="togglePanel"
      >
        <YInternalIcon name="clock" />
      </button>
      <button
        v-if="clearable && modelValue"
        class="yok-time-picker__clear yok-focus-ring"
        type="button"
        :disabled="disabled"
        aria-label="Clear time"
        @click="clearValue"
      >
        <YInternalIcon name="close" />
      </button>
    </div>
    <p v-if="error" :id="errorId" class="yok-time-picker__error" role="alert">{{ error }}</p>

    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        :id="panelId"
        ref="panelRef"
        class="yok-time-picker__panel"
        role="dialog"
        aria-label="Choose time"
        :style="[floatingStyles, layerStyle]"
        @keydown="handlePanelKeydown"
      >
        <div class="yok-time-picker__columns">
          <div class="yok-time-picker__column" role="listbox" aria-label="Hours">
            <button
              v-for="hour in hourOptions"
              :key="hour"
              class="yok-time-picker__option yok-focus-ring"
              :class="{ 'yok-time-picker__option--active': hour === activeHour }"
              type="button"
              role="option"
              :aria-selected="hour === activeHour ? 'true' : 'false'"
              @click="setHour(hour)"
            >
              {{ String(hour).padStart(2, '0') }}
            </button>
          </div>
          <div class="yok-time-picker__column" role="listbox" aria-label="Minutes">
            <button
              v-for="minute in minuteOptions"
              :key="minute"
              class="yok-time-picker__option yok-focus-ring"
              :class="{ 'yok-time-picker__option--active': minute === activeMinute }"
              type="button"
              role="option"
              :aria-selected="minute === activeMinute ? 'true' : 'false'"
              :data-active-time="minute === activeMinute ? 'true' : 'false'"
              @click="setMinute(minute)"
            >
              {{ String(minute).padStart(2, '0') }}
            </button>
          </div>
        </div>
        <div class="yok-time-picker__footer">
          <span>{{ formatTimeValue(activeHour, activeMinute) }}</span>
          <button
            class="yok-time-picker__confirm yok-focus-ring"
            type="button"
            :disabled="activeOption.disabled"
            @click="commitTime()"
          >
            Set time
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.yok-time-picker {
  --yok-time-picker-input-min-height: 38px;
  --yok-time-picker-input-font-size: 14px;
  --yok-time-picker-action-size: 30px;
  --yok-time-picker-action-inset: 4px;
  --yok-time-picker-input-padding-end: 72px;
  display: grid;
  min-width: 0;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-time-picker--sm {
  --yok-time-picker-input-min-height: 32px;
  --yok-time-picker-input-font-size: 13px;
  --yok-time-picker-action-size: 24px;
  --yok-time-picker-input-padding-end: 60px;
}

.yok-time-picker--lg {
  --yok-time-picker-input-min-height: 44px;
  --yok-time-picker-input-font-size: 15px;
  --yok-time-picker-action-size: 34px;
  --yok-time-picker-action-inset: 5px;
  --yok-time-picker-input-padding-end: 82px;
}

.yok-time-picker--compact {
  gap: var(--yok-space-1);
}

.yok-time-picker--compact.yok-time-picker--md {
  --yok-time-picker-input-min-height: 34px;
  --yok-time-picker-action-size: 26px;
  --yok-time-picker-input-padding-end: 64px;
}

.yok-time-picker--compact.yok-time-picker--lg {
  --yok-time-picker-input-min-height: 40px;
  --yok-time-picker-action-size: 30px;
  --yok-time-picker-action-inset: 5px;
  --yok-time-picker-input-padding-end: 74px;
}

.yok-time-picker__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-time-picker__control {
  position: relative;
  display: flex;
  min-width: 0;
}

.yok-time-picker__input {
  min-height: var(--yok-time-picker-input-min-height);
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: var(--yok-time-picker-input-font-size);
  padding: 0 var(--yok-time-picker-input-padding-end) 0 var(--yok-space-3);
}

.yok-time-picker__input[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-time-picker__trigger,
.yok-time-picker__clear {
  position: absolute;
  inset-block: var(--yok-time-picker-action-inset);
  display: inline-flex;
  width: var(--yok-time-picker-action-size);
  align-items: center;
  justify-content: center;
  place-items: center;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.yok-time-picker__trigger {
  inset-inline-end: var(--yok-time-picker-action-inset);
}

.yok-time-picker__clear {
  inset-inline-end: calc(var(--yok-time-picker-action-size) + var(--yok-time-picker-action-inset) + 2px);
  font-size: 18px;
}

.yok-time-picker__trigger:hover,
.yok-time-picker__clear:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-time-picker__error {
  margin: 0;
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-time-picker__panel {
  z-index: var(--yok-zIndex-floating, 1000);
  display: grid;
  width: min(280px, calc(100vw - 32px));
  gap: var(--yok-space-3);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-3);
}

.yok-time-picker__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--yok-space-2);
}

.yok-time-picker__column {
  display: grid;
  max-height: 180px;
  gap: var(--yok-space-1);
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  padding: var(--yok-space-1);
}

.yok-time-picker__option {
  min-height: 30px;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
}

.yok-time-picker__option:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-time-picker__option--active {
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
  font-weight: 800;
}

.yok-time-picker__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
}

.yok-time-picker__footer span {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 800;
}

.yok-time-picker__confirm {
  min-height: 32px;
  border: 0;
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
  cursor: pointer;
  font-weight: 800;
  padding: 0 var(--yok-space-3);
}

.yok-time-picker__confirm:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.yok-time-picker--disabled {
  opacity: 0.68;
}
</style>
