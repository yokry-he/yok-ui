import {
  formatDateValue,
  parseDateValue,
  type YDatePickerDisabledDate
} from '../date-picker/date'
import {
  formatTimeValue,
  parseTimeValue,
  type YTimePickerDisabledTime
} from '../time-picker/time'

export type YDateTimePickerDisabledDate = YDatePickerDisabledDate
export type YDateTimePickerDisabledTime = YTimePickerDisabledTime
export type YDateTimeShortcutValue = string | (() => string)

export interface YDateTimeValue {
  date: string
  time: string
  value: string
}

export interface YDateTimeShortcut {
  label: string
  value: YDateTimeShortcutValue
  description?: string
  disabled?: boolean
}

export interface YResolvedDateTimeShortcut {
  label: string
  value: string
  description?: string
  disabled: boolean
}

export function parseDateTimeValue(value: string): YDateTimeValue | null {
  const match = /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const date = parseDateValue(match[1])
  const time = parseTimeValue(match[2])

  if (!date || !time) {
    return null
  }

  return {
    date: formatDateValue(date),
    time: time.value,
    value: `${formatDateValue(date)} ${time.value}`
  }
}

export function combineDateTimeValue(date: string, time: string) {
  const parsedDate = parseDateValue(date)
  const parsedTime = parseTimeValue(time)

  if (!parsedDate || !parsedTime) {
    return ''
  }

  return `${formatDateValue(parsedDate)} ${formatTimeValue(parsedTime.hour, parsedTime.minute)}`
}

export function createDateTimeShortcut(shortcut: YDateTimeShortcut): YResolvedDateTimeShortcut {
  const rawValue = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value
  const parsed = parseDateTimeValue(rawValue)

  return {
    label: shortcut.label,
    value: parsed?.value ?? '',
    description: shortcut.description,
    disabled: Boolean(shortcut.disabled || !parsed)
  }
}
