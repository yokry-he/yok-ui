<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import {
  addDays,
  addMonths,
  createDateRangeCells,
  formatDateValue,
  getMonthLabel,
  getWeekdayLabels,
  normalizeDateRange,
  parseDateValue,
  resolveDateRangeShortcut,
  startOfMonth,
  type YDatePickerDisabledDate,
  type YDateRangeShortcut,
  type YDateRangePickerCell,
  type YDateRangeValue
} from './date'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YDateRangePicker'
})

interface Props {
  id?: string
  modelValue?: string[]
  label?: string
  ariaLabel?: string
  ariaDescribedby?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  locale?: string
  disabledDate?: YDatePickerDisabledDate
  shortcuts?: YDateRangeShortcut[]
  separator?: string
  error?: string
  size?: YokConfigSize
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: () => [],
  label: '',
  ariaLabel: '',
  ariaDescribedby: '',
  placeholder: 'Select date range',
  disabled: false,
  clearable: true,
  disabledDate: undefined,
  shortcuts: () => [],
  separator: ' to ',
  error: '',
  invalid: false
})

const emit = defineEmits<{
  'update:modelValue': [value: YDateRangeValue]
  change: [value: YDateRangeValue]
  clear: []
  visibleChange: [open: boolean]
}>()

const open = ref(false)
const generatedId = useId()
const yokConfig = useYokConfig()
const controlRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)
const draftStart = ref('')
const activeDate = ref<Date>(parseDateValue(props.modelValue[0] ?? '') ?? new Date())
const visibleMonth = ref<Date>(startOfMonth(activeDate.value))

const fieldId = computed(() => props.id || `yok-date-range-${generatedId}`)
const panelId = computed(() => `${fieldId.value}-panel`)
const errorId = computed(() => `${fieldId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => [props.ariaDescribedby, props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined)
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)
const resolvedLocale = computed(() => props.locale ?? yokConfig.locale.value)
const monthLabel = computed(() => getMonthLabel(visibleMonth.value, resolvedLocale.value))
const weekdayLabels = computed(() => getWeekdayLabels(resolvedLocale.value))
const hasValue = computed(() => props.modelValue.length === 2)
const formattedValue = computed(() => hasValue.value ? `${props.modelValue[0]}${props.separator}${props.modelValue[1]}` : '')
const { floatingStyles } = useFloatingLayer(controlRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 8
})
const cells = computed(() => createDateRangeCells({
  month: visibleMonth.value,
  range: props.modelValue,
  draftStart: draftStart.value,
  disabledDate: props.disabledDate
}))
const resolvedShortcuts = computed(() => props.shortcuts.map((shortcut) => {
  const value = resolveDateRangeShortcut(shortcut)
  const [startValue, endValue] = value
  const startDate = parseDateValue(startValue ?? '')
  const endDate = parseDateValue(endValue ?? '')

  return {
    label: shortcut.label,
    value,
    disabled: props.disabled ||
      shortcut.disabled ||
      value.length !== 2 ||
      !startDate ||
      !endDate ||
      (props.disabledDate?.(startDate) ?? false) ||
      (props.disabledDate?.(endDate) ?? false)
  }
}))

watch(() => props.modelValue, (value) => {
  const startDate = parseDateValue(value[0] ?? '')

  draftStart.value = value.length === 1 ? value[0] : ''

  if (startDate) {
    activeDate.value = startDate
    visibleMonth.value = startOfMonth(startDate)
  }
})

watch(open, (isOpen) => {
  emit('visibleChange', isOpen)
})

function emitValue(value: YDateRangeValue) {
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

  const startDate = parseDateValue(props.modelValue[0] ?? '')

  open.value = true
  draftStart.value = props.modelValue.length === 1 ? props.modelValue[0] : ''
  activeDate.value = startDate ?? activeDate.value
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

function selectCell(cell: YDateRangePickerCell) {
  if (cell.disabled) {
    return
  }

  activeDate.value = cell.date
  visibleMonth.value = startOfMonth(cell.date)

  if (!draftStart.value) {
    draftStart.value = cell.value
    focusActiveCell()
    return
  }

  const nextValue = normalizeDateRange(draftStart.value, cell.value)

  draftStart.value = ''
  emitValue(nextValue)
  closePanel()
}

function selectShortcut(shortcut: { value: YDateRangeValue; disabled?: boolean }) {
  if (shortcut.disabled || shortcut.value.length !== 2) {
    return
  }

  const [startValue] = shortcut.value
  const startDate = parseDateValue(startValue)

  draftStart.value = ''

  if (startDate) {
    activeDate.value = startDate
    visibleMonth.value = startOfMonth(startDate)
  }

  emitValue(shortcut.value)
  closePanel()
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
  if (props.disabled || !props.modelValue.length) {
    return
  }

  draftStart.value = ''
  emitValue([])
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
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    const activeCell = cells.value.find((cell) => formatDateValue(activeDate.value) === cell.value)

    event.preventDefault()
    if (activeCell) {
      selectCell(activeCell)
    }
  }
}
</script>

<template>
  <div
    class="yok-date-range"
    :class="[
      `yok-date-range--${resolvedSize}`,
      `yok-date-range--${resolvedDensity}`,
      {
        'yok-date-range--open': open,
        'yok-date-range--disabled': disabled
      }
    ]"
  >
    <label v-if="label" class="yok-date-range__label" :for="fieldId">{{ label }}</label>
    <div ref="controlRef" class="yok-date-range__control">
      <input
        :id="fieldId"
        ref="inputRef"
        class="yok-date-range__input yok-focus-ring"
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
        class="yok-date-range__trigger yok-focus-ring"
        type="button"
        :disabled="disabled"
        :aria-label="open ? 'Close date range calendar' : 'Open date range calendar'"
        @click="togglePanel"
      >
        <span aria-hidden="true">▦</span>
      </button>
      <button
        v-if="clearable && modelValue.length"
        class="yok-date-range__clear yok-focus-ring"
        type="button"
        :disabled="disabled"
        aria-label="Clear date range"
        @click="clearValue"
      >
        ×
      </button>
    </div>
    <p v-if="error" :id="errorId" class="yok-date-range__error" role="alert">{{ error }}</p>

    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        :id="panelId"
        ref="panelRef"
        class="yok-date-range__panel"
        role="dialog"
        :aria-label="`${monthLabel} date range calendar`"
        :style="[floatingStyles, layerStyle]"
        @keydown="handleCalendarKeydown"
      >
        <div class="yok-date-range__panel-header">
          <button class="yok-date-range__nav yok-focus-ring" type="button" aria-label="Previous month" @click="moveMonth(-1)">‹</button>
          <strong>{{ monthLabel }}</strong>
          <button class="yok-date-range__nav yok-focus-ring" type="button" aria-label="Next month" @click="moveMonth(1)">›</button>
        </div>

        <div v-if="resolvedShortcuts.length" class="yok-date-range__shortcuts" role="group" aria-label="Date range shortcuts">
          <button
            v-for="shortcut in resolvedShortcuts"
            :key="`${shortcut.label}-${shortcut.value.join('-')}`"
            class="yok-date-range__shortcut yok-focus-ring"
            type="button"
            :disabled="shortcut.disabled"
            @click="selectShortcut(shortcut)"
          >
            {{ shortcut.label }}
          </button>
        </div>

        <div class="yok-date-range__grid" role="grid" :aria-label="monthLabel">
          <div class="yok-date-range__weekdays" role="row">
            <span v-for="weekday in weekdayLabels" :key="weekday" role="columnheader">{{ weekday }}</span>
          </div>
          <div class="yok-date-range__days">
            <button
              v-for="cell in cells"
              :key="cell.value"
              class="yok-date-range__day yok-focus-ring"
              :class="{
                'yok-date-range__day--muted': !cell.inCurrentMonth,
                'yok-date-range__day--selected': cell.selected,
                'yok-date-range__day--range-start': cell.rangeStart,
                'yok-date-range__day--range-end': cell.rangeEnd,
                'yok-date-range__day--in-range': cell.inRange,
                'yok-date-range__day--today': cell.today
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
.yok-date-range {
  --yok-date-range-input-min-height: 38px;
  --yok-date-range-input-font-size: 14px;
  --yok-date-range-action-size: 30px;
  --yok-date-range-action-inset: 4px;
  --yok-date-range-input-padding-end: 72px;
  display: grid;
  min-width: 0;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-date-range--sm {
  --yok-date-range-input-min-height: 32px;
  --yok-date-range-input-font-size: 13px;
  --yok-date-range-action-size: 24px;
  --yok-date-range-input-padding-end: 60px;
}

.yok-date-range--lg {
  --yok-date-range-input-min-height: 44px;
  --yok-date-range-input-font-size: 15px;
  --yok-date-range-action-size: 34px;
  --yok-date-range-action-inset: 5px;
  --yok-date-range-input-padding-end: 82px;
}

.yok-date-range--compact {
  gap: var(--yok-space-1);
}

.yok-date-range--compact.yok-date-range--md {
  --yok-date-range-input-min-height: 34px;
  --yok-date-range-action-size: 26px;
  --yok-date-range-input-padding-end: 64px;
}

.yok-date-range--compact.yok-date-range--lg {
  --yok-date-range-input-min-height: 40px;
  --yok-date-range-action-size: 30px;
  --yok-date-range-action-inset: 5px;
  --yok-date-range-input-padding-end: 74px;
}

.yok-date-range__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-date-range__control {
  position: relative;
  display: flex;
  min-width: 0;
}

.yok-date-range__input {
  min-height: var(--yok-date-range-input-min-height);
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: var(--yok-date-range-input-font-size);
  padding: 0 var(--yok-date-range-input-padding-end) 0 var(--yok-space-3);
}

.yok-date-range__input[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-date-range__trigger,
.yok-date-range__clear {
  position: absolute;
  inset-block: var(--yok-date-range-action-inset);
  display: grid;
  width: var(--yok-date-range-action-size);
  place-items: center;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 16px;
}

.yok-date-range__trigger {
  inset-inline-end: var(--yok-date-range-action-inset);
}

.yok-date-range__clear {
  inset-inline-end: calc(var(--yok-date-range-action-size) + var(--yok-date-range-action-inset) + 2px);
  font-size: 18px;
}

.yok-date-range__trigger:hover,
.yok-date-range__clear:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-date-range__error {
  margin: 0;
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-date-range__panel {
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

.yok-date-range__panel-header {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-date-range__panel-header strong {
  overflow: hidden;
  font-size: 14px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-date-range__nav {
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

.yok-date-range__nav:hover {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-date-range__shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  padding-block-end: var(--yok-space-1);
}

.yok-date-range__shortcut {
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

.yok-date-range__shortcut:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primarySoft);
}

.yok-date-range__shortcut:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-date-range__grid {
  display: grid;
  gap: var(--yok-space-2);
}

.yok-date-range__weekdays,
.yok-date-range__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--yok-space-1);
}

.yok-date-range__weekdays span {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 750;
  text-align: center;
}

.yok-date-range__day {
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

.yok-date-range__day:hover:not(:disabled) {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-date-range__day--muted {
  color: color-mix(in srgb, var(--yok-color-textMuted) 66%, transparent);
}

.yok-date-range__day--today {
  border-color: color-mix(in srgb, var(--yok-color-primary) 48%, transparent);
}

.yok-date-range__day--in-range {
  background: color-mix(in srgb, var(--yok-color-primarySoft) 72%, transparent);
  color: var(--yok-color-primary);
}

.yok-date-range__day--selected {
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
  font-weight: 800;
}

.yok-date-range__day:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.yok-date-range--disabled {
  opacity: 0.68;
}
</style>
