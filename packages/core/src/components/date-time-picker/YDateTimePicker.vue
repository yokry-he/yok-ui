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
  startOfMonth,
  type YDatePickerCell
} from '../date-picker/date'
import {
  createMinuteOptions,
  createTimeOption,
  formatTimeValue,
  parseTimeValue
} from '../time-picker/time'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import YInternalIcon from '../_internal/YInternalIcon.vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'
import {
  combineDateTimeValue,
  createDateTimeShortcut,
  parseDateTimeValue,
  type YDateTimePickerDisabledDate,
  type YDateTimePickerDisabledTime,
  type YDateTimeShortcut
} from './date-time'

defineOptions({
  name: 'YDateTimePicker'
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
  minuteStep?: number
  disabledDate?: YDateTimePickerDisabledDate
  disabledTime?: YDateTimePickerDisabledTime
  shortcuts?: YDateTimeShortcut[]
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
  placeholder: 'Select date and time',
  disabled: false,
  clearable: true,
  locale: '',
  minuteStep: 1,
  disabledDate: undefined,
  disabledTime: undefined,
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

const parsedValue = computed(() => parseDateTimeValue(props.modelValue))
const initialDate = computed(() => parseDateValue(parsedValue.value?.date ?? '') ?? new Date())
const draftDate = ref(formatDateValue(initialDate.value))
const draftHour = ref(parseTimeValue(parsedValue.value?.time ?? '')?.hour ?? 9)
const draftMinute = ref(parseTimeValue(parsedValue.value?.time ?? '')?.minute ?? 0)
const visibleMonth = ref(startOfMonth(initialDate.value))

const fieldId = computed(() => props.id || `yok-date-time-picker-${generatedId}`)
const panelId = computed(() => `${fieldId.value}-panel`)
const errorId = computed(() => `${fieldId.value}-error`)
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)
const resolvedLocale = computed(() => props.locale || yokConfig.locale.value)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => [props.ariaDescribedby, props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined)
const monthLabel = computed(() => getMonthLabel(visibleMonth.value, resolvedLocale.value))
const weekdayLabels = computed(() => getWeekdayLabels(resolvedLocale.value))
const selectedDate = computed(() => parseDateValue(draftDate.value))
const cells = computed(() => createCalendarCells({
  month: visibleMonth.value,
  selectedDate: selectedDate.value,
  disabledDate: props.disabledDate
}))
const hourOptions = computed(() => Array.from({ length: 24 }, (_, hour) => hour))
const minuteOptions = computed(() => createMinuteOptions(props.minuteStep))
const activeOption = computed(() => createTimeOption(draftHour.value, draftMinute.value, props.disabledTime))
const draftValue = computed(() => combineDateTimeValue(draftDate.value, formatTimeValue(draftHour.value, draftMinute.value)))
const resolvedShortcuts = computed(() => props.shortcuts.map((shortcut) => createDateTimeShortcut(shortcut)))
const dialogLabel = computed(() => props.label ? `${props.label} date and time` : 'Choose date and time')

const { floatingStyles } = useFloatingLayer(controlRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 8
})

const { layerStyle } = useDismissableLayer({
  open,
  reference: controlRef,
  floating: panelRef,
  onDismiss: closePanel
})

watch(() => props.modelValue, (value) => {
  const parsed = parseDateTimeValue(value)

  if (!parsed || open.value) {
    return
  }

  draftDate.value = parsed.date
  const parsedTime = parseTimeValue(parsed.time)

  draftHour.value = parsedTime?.hour ?? 9
  draftMinute.value = parsedTime?.minute ?? 0
  visibleMonth.value = startOfMonth(parseDateValue(parsed.date) ?? new Date())
})

watch(minuteOptions, (options) => {
  if (!options.includes(draftMinute.value)) {
    draftMinute.value = options[0] ?? 0
  }
})

watch(open, (isOpen) => {
  emit('visibleChange', isOpen)
})

function syncDraftFromModel() {
  const parsed = parsedValue.value

  if (parsed) {
    draftDate.value = parsed.date
    const parsedTime = parseTimeValue(parsed.time)

    draftHour.value = parsedTime?.hour ?? 9
    draftMinute.value = parsedTime?.minute ?? 0
    visibleMonth.value = startOfMonth(parseDateValue(parsed.date) ?? new Date())
    return
  }

  const today = new Date()

  draftDate.value = formatDateValue(today)
  draftHour.value = 9
  draftMinute.value = minuteOptions.value[0] ?? 0
  visibleMonth.value = startOfMonth(today)
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

  syncDraftFromModel()
  open.value = true
}

function closePanel() {
  open.value = false
  inputRef.value?.focus()
}

function togglePanel() {
  if (open.value) {
    closePanel()
    return
  }

  openPanel()
}

function emitValue(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
}

function selectCell(cell: YDatePickerCell) {
  if (cell.disabled) {
    return
  }

  draftDate.value = cell.value
  visibleMonth.value = startOfMonth(cell.date)
}

function selectShortcut(shortcut: { value: string; disabled: boolean }) {
  if (shortcut.disabled) {
    return
  }

  const parsed = parseDateTimeValue(shortcut.value)

  if (!parsed) {
    return
  }

  draftDate.value = parsed.date
  const parsedTime = parseTimeValue(parsed.time)

  draftHour.value = parsedTime?.hour ?? 9
  draftMinute.value = parsedTime?.minute ?? 0
  visibleMonth.value = startOfMonth(parseDateValue(parsed.date) ?? new Date())
  emitValue(parsed.value)
  closePanel()
}

function setHour(hour: number) {
  draftHour.value = hour
}

function setMinute(minute: number) {
  draftMinute.value = minute
}

function moveMonth(amount: number) {
  visibleMonth.value = addMonths(visibleMonth.value, amount)
  draftDate.value = formatDateValue(startOfMonth(visibleMonth.value))
  focusActiveCell()
}

function moveActiveDate(amount: number) {
  const currentDate = parseDateValue(draftDate.value) ?? new Date()
  const nextDate = addDays(currentDate, amount)

  draftDate.value = formatDateValue(nextDate)
  visibleMonth.value = startOfMonth(nextDate)
  focusActiveCell()
}

function commitValue() {
  if (!draftValue.value || activeOption.value.disabled) {
    return
  }

  emitValue(draftValue.value)
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

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPanel()
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
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

  if (event.key === 'Enter') {
    event.preventDefault()
    commitValue()
  }
}
</script>

<template>
  <div
    class="yok-date-time-picker"
    :class="[
      `yok-date-time-picker--${resolvedSize}`,
      `yok-date-time-picker--${resolvedDensity}`,
      {
        'yok-date-time-picker--open': open,
        'yok-date-time-picker--disabled': disabled
      }
    ]"
  >
    <label v-if="label" class="yok-date-time-picker__label" :for="fieldId">{{ label }}</label>
    <div ref="controlRef" class="yok-date-time-picker__control">
      <input
        :id="fieldId"
        ref="inputRef"
        class="yok-date-time-picker__input yok-focus-ring"
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
        class="yok-date-time-picker__trigger yok-focus-ring"
        type="button"
        :disabled="disabled"
        :aria-label="open ? 'Close date and time picker' : 'Open date and time picker'"
        @click="togglePanel"
      >
        <YInternalIcon name="clock" />
      </button>
      <button
        v-if="clearable && modelValue"
        class="yok-date-time-picker__clear yok-focus-ring"
        type="button"
        :disabled="disabled"
        aria-label="Clear date and time"
        @click="clearValue"
      >
        <YInternalIcon name="close" />
      </button>
    </div>
    <p v-if="error" :id="errorId" class="yok-date-time-picker__error" role="alert">{{ error }}</p>

    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        :id="panelId"
        ref="panelRef"
        class="yok-date-time-picker__panel"
        role="dialog"
        :aria-label="dialogLabel"
        :style="[floatingStyles, layerStyle]"
        @keydown="handlePanelKeydown"
      >
        <div v-if="resolvedShortcuts.length" class="yok-date-time-picker__shortcuts" role="group" aria-label="Date time shortcuts">
          <button
            v-for="shortcut in resolvedShortcuts"
            :key="`${shortcut.label}-${shortcut.value}`"
            class="yok-date-time-picker__shortcut yok-focus-ring"
            type="button"
            :disabled="shortcut.disabled"
            :aria-label="[shortcut.label, shortcut.description].filter(Boolean).join(', ')"
            @click="selectShortcut(shortcut)"
          >
            <span>{{ shortcut.label }}</span>
            <small v-if="shortcut.description">{{ shortcut.description }}</small>
          </button>
        </div>

        <div class="yok-date-time-picker__body">
          <section class="yok-date-time-picker__calendar" aria-label="Date">
            <div class="yok-date-time-picker__panel-header">
              <button class="yok-date-time-picker__nav yok-focus-ring" type="button" aria-label="Previous month" @click="moveMonth(-1)">
                <YInternalIcon name="chevronLeft" />
              </button>
              <strong>{{ monthLabel }}</strong>
              <button class="yok-date-time-picker__nav yok-focus-ring" type="button" aria-label="Next month" @click="moveMonth(1)">
                <YInternalIcon name="chevronRight" />
              </button>
            </div>
            <div class="yok-date-time-picker__grid" role="grid" :aria-label="monthLabel">
              <div class="yok-date-time-picker__weekdays" role="row">
                <span v-for="weekday in weekdayLabels" :key="weekday" role="columnheader">{{ weekday }}</span>
              </div>
              <div class="yok-date-time-picker__days">
                <button
                  v-for="cell in cells"
                  :key="cell.value"
                  class="yok-date-time-picker__day yok-focus-ring"
                  :class="{
                    'yok-date-time-picker__day--muted': !cell.inCurrentMonth,
                    'yok-date-time-picker__day--selected': cell.selected,
                    'yok-date-time-picker__day--today': cell.today
                  }"
                  type="button"
                  role="gridcell"
                  :disabled="cell.disabled"
                  :aria-selected="cell.selected ? 'true' : 'false'"
                  :aria-label="cell.value"
                  :data-active-date="draftDate === cell.value ? 'true' : 'false'"
                  :tabindex="draftDate === cell.value ? 0 : -1"
                  @click="selectCell(cell)"
                >
                  {{ cell.day }}
                </button>
              </div>
            </div>
          </section>

          <section class="yok-date-time-picker__time" aria-label="Time">
            <div class="yok-date-time-picker__time-columns">
              <div class="yok-date-time-picker__time-column" role="listbox" aria-label="Hours">
                <button
                  v-for="hour in hourOptions"
                  :key="hour"
                  class="yok-date-time-picker__time-option yok-focus-ring"
                  :class="{ 'yok-date-time-picker__time-option--active': hour === draftHour }"
                  type="button"
                  role="option"
                  :aria-selected="hour === draftHour ? 'true' : 'false'"
                  @click="setHour(hour)"
                >
                  {{ String(hour).padStart(2, '0') }}
                </button>
              </div>
              <div class="yok-date-time-picker__time-column" role="listbox" aria-label="Minutes">
                <button
                  v-for="minute in minuteOptions"
                  :key="minute"
                  class="yok-date-time-picker__time-option yok-focus-ring"
                  :class="{ 'yok-date-time-picker__time-option--active': minute === draftMinute }"
                  type="button"
                  role="option"
                  :aria-selected="minute === draftMinute ? 'true' : 'false'"
                  @click="setMinute(minute)"
                >
                  {{ String(minute).padStart(2, '0') }}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div class="yok-date-time-picker__footer">
          <span>{{ draftValue || placeholder }}</span>
          <button
            class="yok-date-time-picker__confirm yok-focus-ring"
            type="button"
            :disabled="!draftValue || activeOption.disabled"
            @click="commitValue"
          >
            Set date time
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.yok-date-time-picker {
  --yok-date-time-picker-input-min-height: 38px;
  --yok-date-time-picker-input-font-size: 14px;
  --yok-date-time-picker-action-size: 30px;
  --yok-date-time-picker-action-inset: 4px;
  --yok-date-time-picker-input-padding-end: 72px;
  display: grid;
  min-width: 0;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-date-time-picker--sm {
  --yok-date-time-picker-input-min-height: 32px;
  --yok-date-time-picker-input-font-size: 13px;
  --yok-date-time-picker-action-size: 24px;
  --yok-date-time-picker-input-padding-end: 60px;
}

.yok-date-time-picker--lg {
  --yok-date-time-picker-input-min-height: 44px;
  --yok-date-time-picker-input-font-size: 15px;
  --yok-date-time-picker-action-size: 34px;
  --yok-date-time-picker-action-inset: 5px;
  --yok-date-time-picker-input-padding-end: 82px;
}

.yok-date-time-picker--compact {
  gap: var(--yok-space-1);
}

.yok-date-time-picker__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-date-time-picker__control {
  position: relative;
  display: flex;
  min-width: 0;
}

.yok-date-time-picker__input {
  min-height: var(--yok-date-time-picker-input-min-height);
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: var(--yok-date-time-picker-input-font-size);
  padding: 0 var(--yok-date-time-picker-input-padding-end) 0 var(--yok-space-3);
}

.yok-date-time-picker__input[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-date-time-picker__trigger,
.yok-date-time-picker__clear {
  position: absolute;
  inset-block: var(--yok-date-time-picker-action-inset);
  display: inline-flex;
  width: var(--yok-date-time-picker-action-size);
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

.yok-date-time-picker__trigger {
  inset-inline-end: var(--yok-date-time-picker-action-inset);
}

.yok-date-time-picker__clear {
  inset-inline-end: calc(var(--yok-date-time-picker-action-size) + var(--yok-date-time-picker-action-inset) + 2px);
  font-size: 18px;
}

.yok-date-time-picker__trigger:hover,
.yok-date-time-picker__clear:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-date-time-picker__error {
  margin: 0;
  color: var(--yok-color-danger);
  font-size: 12px;
}

.yok-date-time-picker__panel {
  z-index: var(--yok-zIndex-floating, 1000);
  display: grid;
  width: min(560px, calc(100vw - 32px));
  gap: var(--yok-space-3);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-3);
}

.yok-date-time-picker__shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
}

.yok-date-time-picker__shortcut {
  display: inline-grid;
  gap: 2px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  padding: var(--yok-space-1) var(--yok-space-2);
  text-align: start;
}

.yok-date-time-picker__shortcut small {
  color: var(--yok-color-textMuted);
  font-size: 11px;
}

.yok-date-time-picker__body {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 180px;
  gap: var(--yok-space-3);
}

.yok-date-time-picker__calendar,
.yok-date-time-picker__time {
  min-width: 0;
}

.yok-date-time-picker__panel-header {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: var(--yok-space-2);
  margin-bottom: var(--yok-space-2);
  text-align: center;
}

.yok-date-time-picker__nav {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  place-items: center;
}

.yok-date-time-picker__grid {
  display: grid;
  gap: var(--yok-space-1);
}

.yok-date-time-picker__weekdays,
.yok-date-time-picker__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
}

.yok-date-time-picker__weekdays {
  color: var(--yok-color-textMuted);
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}

.yok-date-time-picker__day {
  aspect-ratio: 1;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}

.yok-date-time-picker__day:hover,
.yok-date-time-picker__time-option:hover,
.yok-date-time-picker__nav:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-date-time-picker__day--muted {
  color: var(--yok-color-textMuted);
  opacity: 0.58;
}

.yok-date-time-picker__day--today {
  box-shadow: inset 0 0 0 1px var(--yok-color-primary);
}

.yok-date-time-picker__day--selected,
.yok-date-time-picker__time-option--active {
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
  font-weight: 800;
}

.yok-date-time-picker__time-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--yok-space-2);
}

.yok-date-time-picker__time-column {
  display: grid;
  max-height: 236px;
  gap: var(--yok-space-1);
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  padding: var(--yok-space-1);
}

.yok-date-time-picker__time-option {
  min-height: 28px;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}

.yok-date-time-picker__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  border-top: 1px solid var(--yok-color-border);
  padding-top: var(--yok-space-3);
}

.yok-date-time-picker__footer span {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 800;
}

.yok-date-time-picker__confirm {
  min-height: 32px;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  padding: 0 var(--yok-space-3);
}

.yok-date-time-picker__confirm:disabled,
.yok-date-time-picker__day:disabled,
.yok-date-time-picker__shortcut:disabled {
  cursor: not-allowed;
  opacity: 0.52;
}

@media (max-width: 520px) {
  .yok-date-time-picker__body {
    grid-template-columns: 1fr;
  }

  .yok-date-time-picker__time-column {
    max-height: 128px;
  }
}
</style>
