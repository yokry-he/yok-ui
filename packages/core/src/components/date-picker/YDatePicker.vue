<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import {
  addDays,
  addMonths,
  createCalendarCells,
  formatDateValue,
  getMonthLabel,
  getWeekdayLabels,
  parseDateValue,
  resolveDateShortcut,
  startOfMonth,
  type YDatePickerCell,
  type YDatePickerDisabledDate,
  type YDateShortcut
} from './date'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YDatePicker'
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
  locale?: string
  disabledDate?: YDatePickerDisabledDate
  shortcuts?: YDateShortcut[]
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
  placeholder: 'Select date',
  disabled: false,
  clearable: true,
  disabledDate: undefined,
  shortcuts: () => [],
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
const activeDate = ref<Date>(parseDateValue(props.modelValue) ?? new Date())
const visibleMonth = ref<Date>(startOfMonth(activeDate.value))

const selectedDate = computed(() => parseDateValue(props.modelValue))
const fieldId = computed(() => props.id || `yok-date-picker-${generatedId}`)
const panelId = computed(() => `${fieldId.value}-panel`)
const errorId = computed(() => `${fieldId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => [props.ariaDescribedby, props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined)
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)
const resolvedLocale = computed(() => props.locale ?? yokConfig.locale.value)
const monthLabel = computed(() => getMonthLabel(visibleMonth.value, resolvedLocale.value))
const weekdayLabels = computed(() => getWeekdayLabels(resolvedLocale.value))
const cells = computed(() => createCalendarCells({
  month: visibleMonth.value,
  selectedDate: selectedDate.value,
  disabledDate: props.disabledDate
}))
const formattedValue = computed(() => props.modelValue)
const { floatingStyles } = useFloatingLayer(controlRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 8
})
const resolvedShortcuts = computed(() => props.shortcuts.map((shortcut) => {
  const value = resolveDateShortcut(shortcut)
  const date = parseDateValue(value)

  return {
    label: shortcut.label,
    value,
    time: shortcut.time,
    description: shortcut.description,
    disabled: props.disabled || shortcut.disabled || !date || (props.disabledDate?.(date) ?? false)
  }
}))

watch(() => props.modelValue, (value) => {
  const nextDate = parseDateValue(value)

  if (nextDate) {
    activeDate.value = nextDate
    visibleMonth.value = startOfMonth(nextDate)
  }
})

watch(open, (isOpen) => {
  emit('visibleChange', isOpen)
})

function emitValue(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
}

function focusActiveCell() {
  nextTick(() => {
    panelRef.value?.querySelector<HTMLButtonElement>('[data-active-date="true"]')?.focus()
  })
}

function openPanel() {
  if (props.disabled) {
    return
  }

  open.value = true
  activeDate.value = selectedDate.value ?? activeDate.value
  visibleMonth.value = startOfMonth(activeDate.value)
  focusActiveCell()
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

function selectCell(cell: YDatePickerCell) {
  if (cell.disabled) {
    return
  }

  activeDate.value = cell.date
  visibleMonth.value = startOfMonth(cell.date)
  emitValue(cell.value)
  closePanel()
}

function selectShortcut(shortcut: { value: string; disabled?: boolean }) {
  if (shortcut.disabled) {
    return
  }

  const date = parseDateValue(shortcut.value)

  if (!date) {
    return
  }

  activeDate.value = date
  visibleMonth.value = startOfMonth(date)
  emitValue(shortcut.value)
  closePanel()
}

function getShortcutAriaLabel(shortcut: { label: string; time?: string; description?: string }) {
  return [shortcut.label, shortcut.time, shortcut.description].filter(Boolean).join(', ')
}

function moveMonth(amount: number) {
  visibleMonth.value = addMonths(visibleMonth.value, amount)
  activeDate.value = startOfMonth(visibleMonth.value)
  focusActiveCell()
}

function moveActiveDate(amount: number) {
  const nextDate = addDays(activeDate.value, amount)

  activeDate.value = nextDate
  visibleMonth.value = startOfMonth(nextDate)
  focusActiveCell()
}

function clearValue() {
  if (props.disabled || !props.modelValue) {
    return
  }

  emitValue('')
  emit('clear')
  inputRef.value?.focus()
}

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPanel()
  }
}

function handleCalendarKeydown(event: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7
  }

  if (event.key in keyMap) {
    event.preventDefault()
    moveActiveDate(keyMap[event.key])
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    activeDate.value = addDays(activeDate.value, -activeDate.value.getDay())
    visibleMonth.value = startOfMonth(activeDate.value)
    focusActiveCell()
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    activeDate.value = addDays(activeDate.value, 6 - activeDate.value.getDay())
    visibleMonth.value = startOfMonth(activeDate.value)
    focusActiveCell()
    return
  }

  if (event.key === 'PageUp') {
    event.preventDefault()
    moveMonth(-1)
    return
  }

  if (event.key === 'PageDown') {
    event.preventDefault()
    moveMonth(1)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
  }
}
</script>

<template>
  <div
    class="yok-date-picker"
    :class="[
      `yok-date-picker--${resolvedSize}`,
      `yok-date-picker--${resolvedDensity}`,
      {
        'yok-date-picker--open': open,
        'yok-date-picker--disabled': disabled
      }
    ]"
  >
    <label v-if="label" class="yok-date-picker__label" :for="fieldId">{{ label }}</label>
    <div ref="controlRef" class="yok-date-picker__control">
      <input
        :id="fieldId"
        ref="inputRef"
        class="yok-date-picker__input yok-focus-ring"
        type="text"
        readonly
        :value="formattedValue"
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
        class="yok-date-picker__trigger yok-focus-ring"
        type="button"
        :disabled="disabled"
        :aria-label="open ? 'Close calendar' : 'Open calendar'"
        @click="togglePanel"
      >
        <span aria-hidden="true">▦</span>
      </button>
      <button
        v-if="clearable && modelValue"
        class="yok-date-picker__clear yok-focus-ring"
        type="button"
        :disabled="disabled"
        aria-label="Clear date"
        @click="clearValue"
      >
        ×
      </button>
    </div>
    <p v-if="error" :id="errorId" class="yok-date-picker__error" role="alert">{{ error }}</p>

    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        :id="panelId"
        ref="panelRef"
        class="yok-date-picker__panel"
        role="dialog"
        :aria-label="`${monthLabel} calendar`"
        :style="[floatingStyles, layerStyle]"
        @keydown="handleCalendarKeydown"
      >
        <div class="yok-date-picker__panel-header">
          <button class="yok-date-picker__nav yok-focus-ring" type="button" aria-label="Previous month" @click="moveMonth(-1)">‹</button>
          <strong>{{ monthLabel }}</strong>
          <button class="yok-date-picker__nav yok-focus-ring" type="button" aria-label="Next month" @click="moveMonth(1)">›</button>
        </div>

        <div v-if="resolvedShortcuts.length" class="yok-date-picker__shortcuts" role="group" aria-label="Date shortcuts">
          <button
            v-for="shortcut in resolvedShortcuts"
            :key="`${shortcut.label}-${shortcut.value}`"
            class="yok-date-picker__shortcut yok-focus-ring"
            :class="{ 'yok-date-picker__shortcut--detailed': shortcut.time || shortcut.description }"
            type="button"
            :disabled="shortcut.disabled"
            :aria-label="getShortcutAriaLabel(shortcut)"
            @click="selectShortcut(shortcut)"
          >
            <span class="yok-date-picker__shortcut-main">
              <span class="yok-date-picker__shortcut-label">{{ shortcut.label }}</span>
              <span v-if="shortcut.time" class="yok-date-picker__shortcut-time">{{ shortcut.time }}</span>
            </span>
            <span v-if="shortcut.description" class="yok-date-picker__shortcut-description">{{ shortcut.description }}</span>
          </button>
        </div>

        <div class="yok-date-picker__grid" role="grid" :aria-label="monthLabel">
          <div class="yok-date-picker__weekdays" role="row">
            <span v-for="weekday in weekdayLabels" :key="weekday" role="columnheader">{{ weekday }}</span>
          </div>
          <div class="yok-date-picker__days">
            <button
              v-for="cell in cells"
              :key="cell.value"
              class="yok-date-picker__day yok-focus-ring"
              :class="{
                'yok-date-picker__day--muted': !cell.inCurrentMonth,
                'yok-date-picker__day--selected': cell.selected,
                'yok-date-picker__day--today': cell.today
              }"
              type="button"
              role="gridcell"
              :disabled="cell.disabled"
              :aria-selected="cell.selected ? 'true' : 'false'"
              :aria-label="cell.value"
              :data-active-date="formatDateValue(activeDate) === cell.value ? 'true' : 'false'"
              :tabindex="formatDateValue(activeDate) === cell.value ? 0 : -1"
              @click="selectCell(cell)"
            >
              {{ cell.day }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.yok-date-picker {
  --yok-date-picker-input-min-height: 38px;
  --yok-date-picker-input-font-size: 14px;
  --yok-date-picker-action-size: 30px;
  --yok-date-picker-action-inset: 4px;
  --yok-date-picker-input-padding-end: 72px;
  display: grid;
  min-width: 0;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-date-picker--sm {
  --yok-date-picker-input-min-height: 32px;
  --yok-date-picker-input-font-size: 13px;
  --yok-date-picker-action-size: 24px;
  --yok-date-picker-input-padding-end: 60px;
}

.yok-date-picker--lg {
  --yok-date-picker-input-min-height: 44px;
  --yok-date-picker-input-font-size: 15px;
  --yok-date-picker-action-size: 34px;
  --yok-date-picker-action-inset: 5px;
  --yok-date-picker-input-padding-end: 82px;
}

.yok-date-picker--compact {
  gap: var(--yok-space-1);
}

.yok-date-picker--compact.yok-date-picker--md {
  --yok-date-picker-input-min-height: 34px;
  --yok-date-picker-action-size: 26px;
  --yok-date-picker-input-padding-end: 64px;
}

.yok-date-picker--compact.yok-date-picker--lg {
  --yok-date-picker-input-min-height: 40px;
  --yok-date-picker-action-size: 30px;
  --yok-date-picker-action-inset: 5px;
  --yok-date-picker-input-padding-end: 74px;
}

.yok-date-picker__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-date-picker__control {
  position: relative;
  display: flex;
  min-width: 0;
}

.yok-date-picker__input {
  min-height: var(--yok-date-picker-input-min-height);
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: var(--yok-date-picker-input-font-size);
  padding: 0 var(--yok-date-picker-input-padding-end) 0 var(--yok-space-3);
}

.yok-date-picker__input[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-date-picker__trigger,
.yok-date-picker__clear {
  position: absolute;
  inset-block: var(--yok-date-picker-action-inset);
  display: grid;
  width: var(--yok-date-picker-action-size);
  place-items: center;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 16px;
}

.yok-date-picker__trigger {
  inset-inline-end: var(--yok-date-picker-action-inset);
}

.yok-date-picker__clear {
  inset-inline-end: calc(var(--yok-date-picker-action-size) + var(--yok-date-picker-action-inset) + 2px);
  font-size: 18px;
}

.yok-date-picker__trigger:hover,
.yok-date-picker__clear:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-date-picker__error {
  margin: 0;
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-date-picker__panel {
  z-index: var(--yok-zIndex-floating, 1000);
  display: grid;
  width: min(312px, calc(100vw - 32px));
  gap: var(--yok-space-3);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-3);
}

.yok-date-picker__panel-header {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-date-picker__panel-header strong {
  overflow: hidden;
  font-size: 14px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-date-picker__nav {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: 20px;
}

.yok-date-picker__nav:hover {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-date-picker__shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  padding-block-end: var(--yok-space-1);
}

.yok-date-picker__shortcut {
  min-height: 28px;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 22%, var(--yok-color-border));
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 58%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  cursor: pointer;
  font-size: 12px;
  font-weight: 750;
  padding: 0 var(--yok-space-2);
}

.yok-date-picker__shortcut--detailed {
  display: grid;
  min-height: 44px;
  min-width: min(100%, 132px);
  align-content: center;
  gap: 2px;
  padding-block: var(--yok-space-1);
  text-align: start;
}

.yok-date-picker__shortcut-main {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
}

.yok-date-picker__shortcut-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-date-picker__shortcut-time {
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font-size: 11px;
  font-weight: 800;
  line-height: 1.45;
  padding: 0 var(--yok-space-1);
}

.yok-date-picker__shortcut-description {
  min-width: 0;
  overflow: hidden;
  color: var(--yok-color-textMuted);
  font-size: 11px;
  font-weight: 650;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-date-picker__shortcut:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primarySoft);
}

.yok-date-picker__shortcut:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-date-picker__grid {
  display: grid;
  gap: var(--yok-space-2);
}

.yok-date-picker__weekdays,
.yok-date-picker__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--yok-space-1);
}

.yok-date-picker__weekdays span {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 750;
  text-align: center;
}

.yok-date-picker__day {
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}

.yok-date-picker__day:hover:not(:disabled) {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-date-picker__day--muted {
  color: color-mix(in srgb, var(--yok-color-textMuted) 66%, transparent);
}

.yok-date-picker__day--today {
  border-color: color-mix(in srgb, var(--yok-color-primary) 48%, transparent);
}

.yok-date-picker__day--selected {
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
  font-weight: 800;
}

.yok-date-picker__day:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.yok-date-picker--disabled {
  opacity: 0.68;
}
</style>
