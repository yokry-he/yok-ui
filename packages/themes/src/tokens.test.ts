import { describe, expect, it } from 'vitest'
import {
  auditContrastPairs,
  builtinThemes,
  createThemeVars,
  yokCandy,
  yokClean,
  yokForest,
  yokInk,
  yokLavender,
  yokLight,
  yokMint,
  yokOcean,
  yokPeach,
  yokSakura,
  yokSlate,
  yokSunrise,
  type YokThemeName,
  type YokThemeTokens
} from './index'

const expectedThemeNames: YokThemeName[] = [
  'yok-light',
  'yok-clean',
  'yok-candy',
  'yok-mint',
  'yok-ocean',
  'yok-sakura',
  'yok-lavender',
  'yok-sunrise',
  'yok-forest',
  'yok-ink',
  'yok-peach',
  'yok-slate'
]

const themesByName: Record<YokThemeName, YokThemeTokens> = {
  'yok-light': yokLight,
  'yok-clean': yokClean,
  'yok-candy': yokCandy,
  'yok-mint': yokMint,
  'yok-ocean': yokOcean,
  'yok-sakura': yokSakura,
  'yok-lavender': yokLavender,
  'yok-sunrise': yokSunrise,
  'yok-forest': yokForest,
  'yok-ink': yokInk,
  'yok-peach': yokPeach,
  'yok-slate': yokSlate
}

function getThemeContrastPairs(themeName: string, theme: YokThemeTokens) {
  return [
    {
      name: `${themeName}: text on surface`,
      foreground: theme.color.text,
      background: theme.color.surface,
      minimum: 4.5
    },
    {
      name: `${themeName}: muted text on surface`,
      foreground: theme.color.textMuted,
      background: theme.color.surface,
      minimum: 4.5
    },
    {
      name: `${themeName}: text on muted surface`,
      foreground: theme.color.text,
      background: theme.color.surfaceMuted,
      minimum: 4.5
    },
    {
      name: `${themeName}: muted text on muted surface`,
      foreground: theme.color.textMuted,
      background: theme.color.surfaceMuted,
      minimum: 4.5
    },
    {
      name: `${themeName}: primary button text`,
      foreground: '#ffffff',
      background: theme.color.primary,
      minimum: 4.5
    },
    {
      name: `${themeName}: danger text on surface`,
      foreground: theme.color.danger,
      background: theme.color.surface,
      minimum: 4.5
    },
    {
      name: `${themeName}: warning text on surface`,
      foreground: theme.color.warning,
      background: theme.color.surface,
      minimum: 4.5
    },
    {
      name: `${themeName}: success text on surface`,
      foreground: theme.color.success,
      background: theme.color.surface,
      minimum: 4.5
    }
  ]
}

describe('yok-ui themes', () => {
  it('exports a fresh cute default palette', () => {
    expect(yokLight.color.primary).toBe('#147a65')
    expect(yokLight.radius.md).toBe('12px')
  })

  it('exports a cleaner admin-friendly palette', () => {
    expect(yokClean.color.primary).toBe('#1f8190')
    expect(yokClean.color.surface).toBe('#ffffff')
  })

  it('exports a candy theme with discoverable metadata', () => {
    expect(yokCandy.color.primary).toBe('#9f345f')
    expect(yokCandy.radius.lg).toBe('18px')
    expect(builtinThemes.map((theme) => theme.name)).toEqual(expectedThemeNames)
  })

  it('exports twelve built-in themes for docs theme switching', () => {
    expect(builtinThemes).toHaveLength(12)
    expect(yokMint.color.primary).toBe('#0f766e')
    expect(yokInk.color.surface).toBe('#111827')
  })

  it('converts tokens to css variables', () => {
    const vars = createThemeVars(yokLight)

    expect(vars['--yok-color-primary']).toBe('#147a65')
    expect(vars['--yok-radius-md']).toBe('12px')
    expect(vars['--yok-motion-fast']).toBe('120ms ease')
    expect(vars['--yok-zIndex-floating']).toBe('1000')
    expect(vars['--yok-zIndex-modal']).toBe('2000')
  })

  it('keeps text and semantic color pairs at WCAG AA contrast', () => {
    const results = auditContrastPairs(
      expectedThemeNames.flatMap((themeName) => getThemeContrastPairs(themeName, themesByName[themeName]))
    )
    const failures = results.filter((result) => !result.passed)

    expect(failures).toEqual([])
  })
})
