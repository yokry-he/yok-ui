<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  addMonths,
  createCalendarCells,
  formatDateValue,
  getMonthLabel,
  getWeekdayLabels,
  parseDateValue,
  type YDatePickerCell,
  type YDatePickerDisabledDate
} from '../date-picker/date'

defineOptions({
  name: 'YCalendar'
})

export type YCalendarValue = string
export type YCalendarPanelChangePayload = string
export type YCalendarCell = YDatePickerCell
export type YCalendarDisabledDate = YDatePickerDisabledDate

interface Props {
  modelValue?: YCalendarValue
  locale?: string
  disabledDate?: YCalendarDisabledDate
  showAdjacentMonths?: boolean
  today?: Date
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  locale: 'en-US',
  disabledDate: undefined,
  showAdjacentMonths: true,
  today: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: YCalendarValue]
  select: [cell: YCalendarCell]
  'panel-change': [panel: YCalendarPanelChangePayload]
}>()

const initialDate = computed(() => parseDateValue(props.modelValue) ?? props.today ?? new Date())
const panelDate = ref(new Date(initialDate.value.getFullYear(), initialDate.value.getMonth(), 1))
const selectedDate = computed(() => parseDateValue(props.modelValue))
const monthTitle = computed(() => getMonthLabel(panelDate.value, props.locale))
const weekdayLabels = computed(() => getWeekdayLabels(props.locale))
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

watch(
  () => props.modelValue,
  (value) => {
    const nextDate = parseDateValue(value)

    if (nextDate) {
      panelDate.value = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1)
    }
  }
)

function formatPanelValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function movePanel(months: number) {
  panelDate.value = addMonths(panelDate.value, months)
  emit('panel-change', formatPanelValue(panelDate.value))
}

function pickToday() {
  const today = props.today ?? new Date()
  const value = formatDateValue(today)

  panelDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
  emit('update:modelValue', value)
  emit('select', {
    date: today,
    value,
    day: today.getDate(),
    inCurrentMonth: true,
    selected: true,
    today: true,
    disabled: props.disabledDate?.(today) ?? false
  })
  emit('panel-change', formatPanelValue(panelDate.value))
}

function selectCell(cell: YCalendarCell & { hidden?: boolean }) {
  if (cell.disabled || cell.hidden) {
    return
  }

  emit('update:modelValue', cell.value)
  emit('select', cell)

  if (!cell.inCurrentMonth) {
    panelDate.value = new Date(cell.date.getFullYear(), cell.date.getMonth(), 1)
    emit('panel-change', formatPanelValue(panelDate.value))
  }
}

function getCellAriaLabel(cell: YCalendarCell) {
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
</script>

<template>
  <section class="yok-calendar" aria-label="Calendar">
    <header class="yok-calendar__header">
      <slot
        name="header"
        :date="panelDate"
        :title="monthTitle"
        :previous-month="() => movePanel(-1)"
        :next-month="() => movePanel(1)"
        :select-today="pickToday"
      >
        <h3 class="yok-calendar__title">{{ monthTitle }}</h3>
        <div class="yok-calendar__actions" aria-label="Calendar controls">
          <button
            class="yok-calendar__action yok-focus-ring"
            type="button"
            data-calendar-action="prev-month"
            @click="movePanel(-1)"
          >
            Previous
          </button>
          <button
            class="yok-calendar__action yok-focus-ring"
            type="button"
            data-calendar-action="today"
            @click="pickToday"
          >
            Today
          </button>
          <button
            class="yok-calendar__action yok-focus-ring"
            type="button"
            data-calendar-action="next-month"
            @click="movePanel(1)"
          >
            Next
          </button>
        </div>
      </slot>
    </header>

    <div class="yok-calendar__grid" role="grid" :aria-label="monthTitle">
      <div class="yok-calendar__weekdays" role="row">
        <span
          v-for="weekday in weekdayLabels"
          :key="weekday"
          class="yok-calendar__weekday"
          role="columnheader"
        >
          {{ weekday }}
        </span>
      </div>
      <div class="yok-calendar__days" role="rowgroup">
        <button
          v-for="cell in cells"
          :key="cell.value"
          class="yok-calendar__day yok-focus-ring"
          :class="{
            'yok-calendar__day--muted': !cell.inCurrentMonth,
            'yok-calendar__day--selected': cell.selected,
            'yok-calendar__day--today': cell.today,
            'yok-calendar__day--hidden': cell.hidden
          }"
          type="button"
          role="gridcell"
          :data-calendar-date="cell.value"
          :aria-label="getCellAriaLabel(cell)"
          :aria-selected="cell.selected ? 'true' : 'false'"
          :aria-pressed="cell.selected ? 'true' : 'false'"
          :disabled="cell.disabled || cell.hidden"
          @click="selectCell(cell)"
        >
          <slot name="dateCell" :cell="cell">
            <span class="yok-calendar__day-number">{{ cell.day }}</span>
          </slot>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.yok-calendar {
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  box-shadow: var(--yok-shadow-soft);
}

.yok-calendar__header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-3);
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--yok-color-border);
  padding: var(--yok-space-4);
}

.yok-calendar__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.3;
  letter-spacing: 0;
}

.yok-calendar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
}

.yok-calendar__action {
  min-height: 34px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 0 var(--yok-space-3);
  transition:
    border-color var(--yok-motion-fast),
    color var(--yok-motion-fast),
    background var(--yok-motion-fast);
}

.yok-calendar__action:hover {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-calendar__grid {
  padding: var(--yok-space-3);
}

.yok-calendar__weekdays,
.yok-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.yok-calendar__weekday {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  padding: var(--yok-space-2);
  text-align: center;
}

.yok-calendar__day {
  position: relative;
  min-height: 72px;
  border: 1px solid var(--yok-color-border);
  background: color-mix(in srgb, var(--yok-color-surface) 94%, var(--yok-color-primary) 6%);
  color: var(--yok-color-text);
  font: inherit;
  padding: var(--yok-space-2);
  text-align: left;
  transition:
    border-color var(--yok-motion-fast),
    background var(--yok-motion-fast),
    color var(--yok-motion-fast);
}

.yok-calendar__day:hover {
  border-color: var(--yok-color-primary);
  background: color-mix(in srgb, var(--yok-color-primary) 10%, var(--yok-color-surface));
}

.yok-calendar__day:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-calendar__day--muted {
  color: var(--yok-color-textMuted);
  background: color-mix(in srgb, var(--yok-color-muted) 58%, var(--yok-color-surface));
}

.yok-calendar__day--selected {
  border-color: var(--yok-color-primary);
  background: color-mix(in srgb, var(--yok-color-primary) 14%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-weight: 800;
}

.yok-calendar__day--today::after {
  position: absolute;
  right: var(--yok-space-2);
  bottom: var(--yok-space-2);
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--yok-color-primary);
  content: '';
}

.yok-calendar__day--hidden {
  visibility: hidden;
}

.yok-calendar__day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  min-height: 26px;
  border-radius: 999px;
  font-weight: 800;
}

@media (max-width: 720px) {
  .yok-calendar__header {
    align-items: stretch;
  }

  .yok-calendar__actions {
    width: 100%;
  }

  .yok-calendar__action {
    flex: 1 1 0;
  }

  .yok-calendar__day {
    min-height: 54px;
    padding: var(--yok-space-1);
  }
}
</style>
