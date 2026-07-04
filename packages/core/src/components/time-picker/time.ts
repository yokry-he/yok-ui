export type YTimePickerDisabledTime = (time: YTimePickerOption) => boolean

export interface YTimePickerOption {
  hour: number
  minute: number
  value: string
  label: string
  disabled: boolean
}

export function padTimePart(value: number) {
  return String(value).padStart(2, '0')
}

export function formatTimeValue(hour: number, minute: number) {
  return `${padTimePart(hour)}:${padTimePart(minute)}`
}

export function parseTimeValue(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null
  }

  return {
    hour,
    minute,
    value: formatTimeValue(hour, minute)
  }
}

export function normalizeMinuteStep(step: number) {
  if (!Number.isFinite(step) || step < 1) {
    return 1
  }

  return Math.min(60, Math.floor(step))
}

export function createMinuteOptions(step: number) {
  const normalizedStep = normalizeMinuteStep(step)
  const options: number[] = []

  for (let minute = 0; minute < 60; minute += normalizedStep) {
    options.push(minute)
  }

  return options
}

export function createTimeOption(hour: number, minute: number, disabledTime?: YTimePickerDisabledTime): YTimePickerOption {
  const value = formatTimeValue(hour, minute)
  const option: YTimePickerOption = {
    hour,
    minute,
    value,
    label: value,
    disabled: false
  }

  return {
    ...option,
    disabled: disabledTime?.(option) ?? false
  }
}
