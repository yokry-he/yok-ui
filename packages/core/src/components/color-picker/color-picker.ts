export const defaultColorPresets = [
  '#14B8A6',
  '#38BDF8',
  '#A78BFA',
  '#F472B6',
  '#FBBF24',
  '#22C55E',
  '#F97316',
  '#64748B'
]

export type YColorPickerSize = 'small' | 'medium' | 'large'

export function isValidHexColor(value: string, allowAlpha = false) {
  return (allowAlpha
    ? /^#?([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i
    : /^#?([\da-f]{3}|[\da-f]{6})$/i
  ).test(value.trim())
}

export function normalizeHexColor(value: string, allowAlpha = false) {
  const trimmedValue = value.trim()

  if (!isValidHexColor(trimmedValue, allowAlpha)) {
    return ''
  }

  const hexValue = trimmedValue.replace('#', '')
  const normalizedValue = hexValue.length === 3 || hexValue.length === 4
    ? hexValue.split('').map((character) => character + character).join('')
    : hexValue

  return `#${normalizedValue.toUpperCase()}`
}

export function normalizeColorPresets(presets: string[], allowAlpha = false) {
  return Array.from(new Set(presets.map((preset) => normalizeHexColor(preset, allowAlpha)).filter(Boolean)))
}
