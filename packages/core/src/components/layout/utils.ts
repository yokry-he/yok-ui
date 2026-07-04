export type YLayoutSize = string | number

export function resolveLayoutSize(value: YLayoutSize) {
  return typeof value === 'number' ? `${value}px` : value
}
