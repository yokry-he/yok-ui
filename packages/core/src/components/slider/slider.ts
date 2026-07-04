import { clampNumber, getDecimalPrecision, roundToPrecision } from '../input-number'

export interface YSliderMark {
  value: number
  label: string
}

export type YSliderRangeValue = [number, number]
export type YSliderValue = number | YSliderRangeValue
export type YSliderTooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

export function normalizeSliderValue(params: {
  value: number
  min: number
  max: number
  step: number
  precision?: number
}) {
  const precision = params.precision ?? Math.max(getDecimalPrecision(params.value), getDecimalPrecision(params.step))
  const clamped = clampNumber(params.value, params.min, params.max)
  const stepped = Math.round((clamped - params.min) / params.step) * params.step + params.min

  return roundToPrecision(clampNumber(stepped, params.min, params.max), precision)
}

export function normalizeSliderRangeValue(params: {
  value: YSliderValue
  min: number
  max: number
  step: number
  precision?: number
}): YSliderRangeValue {
  const rawValue = Array.isArray(params.value)
    ? params.value
    : [params.min, params.value]
  const firstValue = normalizeSliderValue({
    value: rawValue[0] ?? params.min,
    min: params.min,
    max: params.max,
    step: params.step,
    precision: params.precision
  })
  const secondValue = normalizeSliderValue({
    value: rawValue[1] ?? params.max,
    min: params.min,
    max: params.max,
    step: params.step,
    precision: params.precision
  })

  return firstValue <= secondValue
    ? [firstValue, secondValue]
    : [secondValue, firstValue]
}

export function getSliderPercent(value: number, min: number, max: number) {
  if (max === min) {
    return 0
  }

  return clampNumber(((value - min) / (max - min)) * 100, 0, 100)
}

export function sortSliderMarks(marks: YSliderMark[]) {
  return [...marks].sort((first, second) => first.value - second.value)
}
