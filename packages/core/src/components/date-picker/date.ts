export type YDatePickerDisabledDate = (date: Date) => boolean
export type YDateRangeValue = [string, string] | []
export type YDateShortcutValue = string | (() => string)
export type YDateRangeShortcutValue = YDateRangeValue | (() => YDateRangeValue)

export interface YDatePickerCell {
  date: Date
  value: string
  day: number
  inCurrentMonth: boolean
  selected: boolean
  today: boolean
  disabled: boolean
}

export interface YDateRangePickerCell extends YDatePickerCell {
  rangeStart: boolean
  rangeEnd: boolean
  inRange: boolean
}

export interface YDateShortcut {
  label: string
  value: YDateShortcutValue
  time?: string
  description?: string
  disabled?: boolean
}

export interface YDateRangeShortcut {
  label: string
  value: YDateRangeShortcutValue
  time?: string
  description?: string
  disabled?: boolean
}

export function padDatePart(value: number) {
  return String(value).padStart(2, '0')
}

export function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
}

export function parseDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

export function isSameDate(first: Date, second: Date) {
  return formatDateValue(first) === formatDateValue(second)
}

export function normalizeDateRange(first: string, second: string): [string, string] {
  return first <= second ? [first, second] : [second, first]
}

export function resolveDateShortcut(shortcut: YDateShortcut) {
  const value = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value
  const date = parseDateValue(value)

  return date ? formatDateValue(date) : ''
}

export function resolveDateRangeShortcut(shortcut: YDateRangeShortcut): YDateRangeValue {
  const value = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value

  if (value.length !== 2) {
    return []
  }

  const [startValue, endValue] = value
  const startDate = parseDateValue(startValue)
  const endDate = parseDateValue(endValue)

  if (!startDate || !endDate) {
    return []
  }

  return normalizeDateRange(formatDateValue(startDate), formatDateValue(endDate))
}

export function getMonthLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function getWeekdayLabels(locale: string) {
  const baseSunday = new Date(2026, 5, 7)

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(baseSunday, index)

    return new Intl.DateTimeFormat(locale, {
      weekday: 'short'
    }).format(date)
  })
}

export function createCalendarCells(params: {
  month: Date
  selectedDate: Date | null
  today?: Date
  disabledDate?: YDatePickerDisabledDate
}) {
  const monthStart = startOfMonth(params.month)
  const gridStart = addDays(monthStart, -monthStart.getDay())
  const today = params.today ?? new Date()

  return Array.from({ length: 42 }, (_, index): YDatePickerCell => {
    const date = addDays(gridStart, index)
    const selected = params.selectedDate ? isSameDate(date, params.selectedDate) : false

    return {
      date,
      value: formatDateValue(date),
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === monthStart.getMonth(),
      selected,
      today: isSameDate(date, today),
      disabled: params.disabledDate?.(date) ?? false
    }
  })
}

export function createDateRangeCells(params: {
  month: Date
  range: string[]
  draftStart?: string
  today?: Date
  disabledDate?: YDatePickerDisabledDate
}) {
  const [startValue, endValue] = params.range
  const rangeStart = params.draftStart || startValue || ''
  const rangeEnd = params.draftStart ? '' : endValue || ''

  return createCalendarCells({
    month: params.month,
    selectedDate: null,
    today: params.today,
    disabledDate: params.disabledDate
  }).map((cell): YDateRangePickerCell => {
    const isStart = Boolean(rangeStart && cell.value === rangeStart)
    const isEnd = Boolean(rangeEnd && cell.value === rangeEnd)
    const inRange = Boolean(rangeStart && rangeEnd && cell.value > rangeStart && cell.value < rangeEnd)

    return {
      ...cell,
      selected: isStart || isEnd,
      rangeStart: isStart,
      rangeEnd: isEnd,
      inRange
    }
  })
}
