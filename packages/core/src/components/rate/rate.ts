import { clampNumber, roundToPrecision } from '../input-number'

export type YRateSize = 'small' | 'medium' | 'large'

export function normalizeRateValue(params: {
  value: number
  count: number
  allowHalf?: boolean
}) {
  const step = params.allowHalf ? 0.5 : 1
  const clamped = clampNumber(params.value, 0, params.count)

  return roundToPrecision(Math.round(clamped / step) * step, 1)
}

export function getRateItemState(params: {
  value: number
  index: number
}) {
  const itemValue = params.index + 1

  if (params.value >= itemValue) {
    return 'full'
  }

  if (params.value >= itemValue - 0.5) {
    return 'half'
  }

  return 'empty'
}

export function getNextRateValue(params: {
  currentValue: number
  nextValue: number
  count: number
  allowHalf?: boolean
  clearable?: boolean
}) {
  const normalized = normalizeRateValue({
    value: params.nextValue,
    count: params.count,
    allowHalf: params.allowHalf
  })

  return params.clearable && normalized === params.currentValue ? 0 : normalized
}
