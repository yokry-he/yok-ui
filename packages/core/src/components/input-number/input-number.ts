export type YInputNumberValue = number | null

export function getDecimalPrecision(value: number) {
  const text = String(value)
  const decimal = text.split('.')[1]

  return decimal?.length ?? 0
}

export function roundToPrecision(value: number, precision: number) {
  const factor = 10 ** precision

  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function clampNumber(value: number, min?: number, max?: number) {
  let nextValue = value

  if (typeof min === 'number') {
    nextValue = Math.max(min, nextValue)
  }

  if (typeof max === 'number') {
    nextValue = Math.min(max, nextValue)
  }

  return nextValue
}

export function parseInputNumberValue(value: string) {
  if (!value.trim()) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

export function normalizeInputNumberValue(params: {
  value: YInputNumberValue
  min?: number
  max?: number
  precision?: number
}) {
  if (params.value === null) {
    return null
  }

  const precision = params.precision ?? getDecimalPrecision(params.value)
  const clamped = clampNumber(params.value, params.min, params.max)

  return roundToPrecision(clamped, precision)
}

export function stepInputNumberValue(params: {
  value: YInputNumberValue
  step: number
  direction: 1 | -1
  min?: number
  max?: number
  precision?: number
}) {
  const base = params.value ?? 0
  const precision = params.precision ?? Math.max(getDecimalPrecision(base), getDecimalPrecision(params.step))
  const nextValue = base + params.step * params.direction

  return normalizeInputNumberValue({
    value: nextValue,
    min: params.min,
    max: params.max,
    precision
  })
}

export function formatInputNumberValue(value: YInputNumberValue, precision?: number) {
  if (value === null) {
    return ''
  }

  return typeof precision === 'number' ? value.toFixed(precision) : String(value)
}
