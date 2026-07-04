import type { YSelectOption } from '../select'

export type YTimeSelectFormat = 'HH:mm' | 'hh:mm A'

export interface YTimeSelectOption extends YSelectOption {
  value: string
}

export interface YTimeSelectOptionsConfig {
  start?: string
  end?: string
  step?: string
  minTime?: string
  maxTime?: string
  format?: YTimeSelectFormat
}

export function timeSelectValueToMinutes(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null
  }

  return hour * 60 + minute
}

export function parseTimeSelectStep(step: string) {
  const parsed = timeSelectValueToMinutes(step)

  if (!parsed || parsed < 1) {
    return 30
  }

  return parsed
}

function formatTimeSelectValue(minutes: number) {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function formatTimeSelectLabel(value: string, format: YTimeSelectFormat = 'HH:mm') {
  if (format === 'HH:mm') {
    return value
  }

  const parsed = timeSelectValueToMinutes(value)

  if (parsed === null) {
    return value
  }

  const hour = Math.floor(parsed / 60)
  const minute = parsed % 60
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12

  return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`
}

export function createTimeSelectOptions(config: YTimeSelectOptionsConfig = {}): YTimeSelectOption[] {
  const start = timeSelectValueToMinutes(config.start ?? '00:00') ?? 0
  const end = timeSelectValueToMinutes(config.end ?? '23:59') ?? 1439
  const step = parseTimeSelectStep(config.step ?? '00:30')
  const min = config.minTime ? timeSelectValueToMinutes(config.minTime) : null
  const max = config.maxTime ? timeSelectValueToMinutes(config.maxTime) : null
  const format = config.format ?? 'HH:mm'
  const options: YTimeSelectOption[] = []

  if (end < start) {
    return options
  }

  for (let minutes = start; minutes <= end; minutes += step) {
    const value = formatTimeSelectValue(minutes)
    const disabled = (min !== null && minutes <= min) || (max !== null && minutes >= max)

    options.push({
      label: formatTimeSelectLabel(value, format),
      value,
      disabled
    })
  }

  return options
}
