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
import YInternalIcon from '../_internal/YInternalIcon.vue'

defineOptions({
  name: 'YDatePickerPanel'
})

interface Props {
  id?: string
  modelValue?: string
  label?: string
  ariaLabel?: string
  ariaDescribedby?: string
  locale?: string
  disabled?: boolean
  disabledDate?: YDatePickerDisabledDate
  shortcuts?: YDateShortcut[]
  border?: boolean
  showAdjacentMonths?: boolean
  today?: Date
  error?: string
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  ariaLabel: '',
  ariaDescribedby: '',
  locale: 'en-US',
  disabled: false,
  disabledDate: undefined,
  shortcuts: () => [],
  border: true,
  showAdjacentMonths: true,
  today: undefined,
  error: '',
  invalid: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  select: [cell: YDatePickerCell]
  'panel-change': [value: string]
}>()

const generatedId = useId()
const selectedDate = computed(() => parseDateValue(props.modelValue))
const initialDate = computed(() => selectedDate.value ?? props.today ?? new Date())
const panelDate = ref(startOfMonth(initialDate.value))
const activeDate = ref(initialDate.value)

const panelId = computed(() => props.id || `yok-date-picker-panel-${generatedId}`)
const labelId = computed(() => props.label ? `${panelId.value}-label` : undefined)
const errorId = computed(() => `${panelId.value}-error`)
const monthLabel = computed(() => getMonthLabel(panelDate.value, props.locale))
const weekdayLabels = computed(() => getWeekdayLabels(props.locale))
const hasInvalidState = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => {
  const ids = [props.ariaDescribedby, props.error ? errorId.value : '']

  return ids.filter(Boolean).join(' ') || undefined
})
const cells = computed(() =>
  createCalendarCells({
    month: panelDate.value,
    selectedDate: selectedDate.value,
    today: props.today,
    disabledDate: props.disabledDate
  }).map((cell) => ({
    ...cell,
    hidden: !props.showAdjacentMonths && !cell.inCurrentMonth
  }))
)
const resolvedShortcuts = computed(() =>
  props.shortcuts.map((shortcut) => {
    const value = resolveDateShortcut(shortcut)
    const date = parseDateValue(value)

    return {
      label: shortcut.label,
      value,
      time: shortcut.time,
      description: shortcut.description,
      disabled: props.disabled || shortcut.disabled || !date || (props.disabledDate?.(date) ?? false)
    }
  })
)

watch(
  () => props.modelValue,
  (value) => {
    const nextDate = parseDateValue(value)

    if (nextDate) {
      activeDate.value = nextDate
      panelDate.value = startOfMonth(nextDate)
    }
  }
)

function formatPanelValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function focusActiveCell() {
  nextTick(() => {
    document.getElementById(panelId.value)?.querySelector<HTMLButtonElement>('[data-active-date="true"]')?.focus()
  })
}

function emitPanelChange() {
  emit('panel-change', formatPanelValue(panelDate.value))
}

function movePanel(months: number) {
  if (props.disabled) {
    return
  }

  panelDate.value = addMonths(panelDate.value, months)
  activeDate.value = findEnabledDate(startOfMonth(panelDate.value), months >= 0 ? 1 : -1)
  emitPanelChange()
  focusActiveCell()
}

function findEnabledDate(candidate: Date, direction: number) {
  let nextDate = candidate

  for (let attempts = 0; attempts < 42; attempts += 1) {
    if (!(props.disabledDate?.(nextDate) ?? false)) {
      return nextDate
    }

    nextDate = addDays(nextDate, direction)
  }

  return candidate
}

function moveActiveDate(days: number) {
  if (props.disabled) {
    return
  }

  const direction = days >= 0 ? 1 : -1
  const nextDate = findEnabledDate(addDays(activeDate.value, days), direction)

  activeDate.value = nextDate
  panelDate.value = startOfMonth(nextDate)
  focusActiveCell()
}

function selectCell(cell: YDatePickerCell & { hidden?: boolean }) {
  if (props.disabled || cell.disabled || cell.hidden) {
    return
  }

  activeDate.value = cell.date
  panelDate.value = startOfMonth(cell.date)
  emit('update:modelValue', cell.value)
  emit('change', cell.value)
  emit('select', cell)
}

function selectShortcut(shortcut: { value: string; disabled?: boolean }) {
  if (shortcut.disabled) {
    return
  }

  const date = parseDateValue(shortcut.value)

  if (!date) {
    return
  }

  const cell = createCalendarCells({
    month: date,
    selectedDate: date,
    today: props.today,
    disabledDate: props.disabledDate
  }).find((item) => item.value === shortcut.value)

  if (cell) {
    selectCell(cell)
  }
}

function getShortcutAriaLabel(shortcut: { label: string; time?: string; description?: string }) {
  return [shortcut.label, shortcut.time, shortcut.description].filter(Boolean).join(', ')
}

function getCellAriaLabel(cell: YDatePickerCell) {
  const dateLabel = new Intl.DateTimeFormat(props.locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(cell.date)

  if (cell.selected) {
    return `Selected date, ${dateLabel}`
  }

  if (cell.today) {
    return `Today, ${dateLabel}`
  }

  return dateLabel
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
    activeDate.value = findEnabledDate(addDays(activeDate.value, -activeDate.value.getDay()), 1)
    panelDate.value = startOfMonth(activeDate.value)
    focusActiveCell()
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    activeDate.value = findEnabledDate(addDays(activeDate.value, 6 - activeDate.value.getDay()), -1)
    panelDate.value = startOfMonth(activeDate.value)
    focusActiveCell()
    return
  }

  if (event.key === 'PageUp') {
    event.preventDefault()
    movePanel(-1)
    return
  }

  if (event.key === 'PageDown') {
    event.preventDefault()
    movePanel(1)
  }
}
</script>

<template>
  <section
    :id="panelId"
    class="yok-date-picker-panel"
    :class="{
      'yok-date-picker-panel--borderless': !border,
      'yok-date-picker-panel--disabled': disabled
    }"
    role="group"
    :aria-labelledby="label ? labelId : undefined"
    :aria-label="label ? undefined : ariaLabel || 'Date picker panel'"
    :aria-describedby="describedBy"
    :aria-invalid="hasInvalidState ? 'true' : 'false'"
    @keydown="handleCalendarKeydown"
  >
    <header class="yok-date-picker-panel__header">
      <div class="yok-date-picker-panel__heading">
        <span v-if="label" :id="labelId" class="yok-date-picker-panel__label">{{ label }}</span>
        <strong class="yok-date-picker-panel__title">{{ monthLabel }}</strong>
      </div>
      <div class="yok-date-picker-panel__actions" aria-label="Calendar controls">
        <button
          class="yok-date-picker-panel__nav yok-focus-ring"
          type="button"
          aria-label="Previous month"
          :disabled="disabled"
          @click="movePanel(-1)"
        >
          <YInternalIcon name="chevronLeft" />
        </button>
        <button
          class="yok-date-picker-panel__nav yok-focus-ring"
          type="button"
          aria-label="Next month"
          :disabled="disabled"
          @click="movePanel(1)"
        >
          <YInternalIcon name="chevronRight" />
        </button>
      </div>
    </header>

    <div v-if="resolvedShortcuts.length" class="yok-date-picker-panel__shortcuts" role="group" aria-label="Date shortcuts">
      <button
        v-for="shortcut in resolvedShortcuts"
        :key="`${shortcut.label}-${shortcut.value}`"
        class="yok-date-picker-panel__shortcut yok-focus-ring"
        :class="{ 'yok-date-picker-panel__shortcut--detailed': shortcut.time || shortcut.description }"
        type="button"
        :disabled="shortcut.disabled"
        :aria-label="getShortcutAriaLabel(shortcut)"
        @click="selectShortcut(shortcut)"
      >
        <span class="yok-date-picker-panel__shortcut-main">
          <span class="yok-date-picker-panel__shortcut-label">{{ shortcut.label }}</span>
          <span v-if="shortcut.time" class="yok-date-picker-panel__shortcut-time">{{ shortcut.time }}</span>
        </span>
        <span v-if="shortcut.description" class="yok-date-picker-panel__shortcut-description">{{ shortcut.description }}</span>
      </button>
    </div>

    <div class="yok-date-picker-panel__grid" role="grid" :aria-label="monthLabel">
      <div class="yok-date-picker-panel__weekdays" role="row">
        <span
          v-for="weekday in weekdayLabels"
          :key="weekday"
          class="yok-date-picker-panel__weekday"
          role="columnheader"
        >
          {{ weekday }}
        </span>
      </div>
      <div class="yok-date-picker-panel__days" role="rowgroup">
        <button
          v-for="cell in cells"
          :key="cell.value"
          class="yok-date-picker-panel__day yok-focus-ring"
          :class="{
            'yok-date-picker-panel__day--muted': !cell.inCurrentMonth,
            'yok-date-picker-panel__day--selected': cell.selected,
            'yok-date-picker-panel__day--today': cell.today,
            'yok-date-picker-panel__day--hidden': cell.hidden
          }"
          type="button"
          role="gridcell"
          :disabled="disabled || cell.disabled || cell.hidden"
          :aria-selected="cell.selected ? 'true' : 'false'"
          :aria-label="getCellAriaLabel(cell)"
          :data-active-date="formatDateValue(activeDate) === cell.value ? 'true' : 'false'"
          :data-date-panel-date="cell.value"
          :tabindex="formatDateValue(activeDate) === cell.value ? 0 : -1"
          @click="selectCell(cell)"
        >
          <slot name="dateCell" :cell="cell">
            <span class="yok-date-picker-panel__day-number">{{ cell.day }}</span>
          </slot>
        </button>
      </div>
    </div>

    <span v-if="error" :id="errorId" class="yok-date-picker-panel__error" role="alert">{{ error }}</span>
  </section>
</template>

<style scoped>
.yok-date-picker-panel {
  display: grid;
  gap: var(--yok-space-3);
  width: min(100%, 360px);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-4);
}

.yok-date-picker-panel--borderless {
  border-color: transparent;
  box-shadow: none;
}

.yok-date-picker-panel--disabled {
  opacity: 0.68;
}

.yok-date-picker-panel__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
}

.yok-date-picker-panel__heading {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.yok-date-picker-panel__label {
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 800;
}

.yok-date-picker-panel__title {
  overflow: hidden;
  font-size: 18px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-date-picker-panel__actions {
  display: flex;
  flex: 0 0 auto;
  gap: var(--yok-space-2);
}

.yok-date-picker-panel__nav {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  line-height: 1;
}

.yok-date-picker-panel__nav:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-date-picker-panel__shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
}

.yok-date-picker-panel__shortcut {
  min-height: 30px;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 22%, var(--yok-color-border));
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 58%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  padding: 0 var(--yok-space-2);
}

.yok-date-picker-panel__shortcut--detailed {
  display: grid;
  min-height: 46px;
  min-width: min(100%, 136px);
  align-content: center;
  gap: 2px;
  padding-block: var(--yok-space-1);
  text-align: start;
}

.yok-date-picker-panel__shortcut-main {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
}

.yok-date-picker-panel__shortcut-label,
.yok-date-picker-panel__shortcut-description {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-date-picker-panel__shortcut-time {
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font-size: 11px;
  font-weight: 800;
  line-height: 1.45;
  padding: 0 var(--yok-space-1);
}

.yok-date-picker-panel__shortcut-description {
  color: var(--yok-color-textMuted);
  font-size: 11px;
  font-weight: 650;
  line-height: 1.35;
}

.yok-date-picker-panel__shortcut:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primarySoft);
}

.yok-date-picker-panel__grid {
  display: grid;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-date-picker-panel__weekdays,
.yok-date-picker-panel__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
}

.yok-date-picker-panel__weekday {
  color: var(--yok-color-textMuted);
  font-size: 11px;
  font-weight: 800;
  line-height: 24px;
  text-align: center;
}

.yok-date-picker-panel__day {
  position: relative;
  display: grid;
  aspect-ratio: 1;
  min-width: 0;
  min-height: 34px;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
}

.yok-date-picker-panel__day:hover:not(:disabled) {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-date-picker-panel__day--muted {
  color: var(--yok-color-textMuted);
}

.yok-date-picker-panel__day--today {
  border-color: color-mix(in srgb, var(--yok-color-primary) 30%, transparent);
}

.yok-date-picker-panel__day--selected {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primary);
  color: var(--yok-color-primaryText);
}

.yok-date-picker-panel__day--hidden {
  visibility: hidden;
}

.yok-date-picker-panel__day:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.yok-date-picker-panel__day-number {
  pointer-events: none;
}

.yok-date-picker-panel__error {
  color: var(--yok-color-danger);
  font-size: 12px;
  font-weight: 650;
}

@media (max-width: 480px) {
  .yok-date-picker-panel {
    width: 100%;
    padding: var(--yok-space-3);
  }

  .yok-date-picker-panel__day {
    min-height: 30px;
    font-size: 12px;
  }
}
</style>
