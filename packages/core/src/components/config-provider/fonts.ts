export type YokFontPresetName = 'system' | 'humanist' | 'rounded' | 'serif' | 'mono'

export interface YokFontPreset {
  name: YokFontPresetName
  label: string
  family: string
  description: string
}

export type YokFontInput = YokFontPresetName | string

export const builtinYokFonts: Readonly<Record<YokFontPresetName, YokFontPreset>> = Object.freeze({
  system: {
    name: 'system',
    label: 'System',
    family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    description: 'Balanced system UI stack for product interfaces.'
  },
  humanist: {
    name: 'humanist',
    label: 'Humanist',
    family: '"Avenir Next", Avenir, "Segoe UI", ui-sans-serif, system-ui, sans-serif',
    description: 'Friendly humanist forms for approachable product copy.'
  },
  rounded: {
    name: 'rounded',
    label: 'Rounded',
    family: 'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", system-ui, sans-serif',
    description: 'Soft rounded forms for cute, lightweight interfaces.'
  },
  serif: {
    name: 'serif',
    label: 'Serif',
    family: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
    description: 'Editorial serif stack for long-form and brand content.'
  },
  mono: {
    name: 'mono',
    label: 'Mono',
    family: 'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
    description: 'Monospace stack for technical tools and code-heavy views.'
  }
})

export function isYokFontPreset(value: string): value is YokFontPresetName {
  return value in builtinYokFonts
}

export function resolveYokFontFamily(font: YokFontInput = 'system') {
  const normalizedFont = font.trim()

  if (!normalizedFont) {
    return builtinYokFonts.system.family
  }

  return isYokFontPreset(normalizedFont)
    ? builtinYokFonts[normalizedFont].family
    : normalizedFont
}
