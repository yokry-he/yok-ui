import { describe, expect, it } from 'vitest'
import {
  auditThemeLabRelease,
  auditThemeLabContrast,
  createThemeLabCss,
  createThemeLabReleaseChecklist,
  createThemeLabReport,
  createThemeLabTypeScriptConfig,
  createThemeLabTokens,
  defaultThemeLabState,
  mixHexColor,
  normalizeHexColor
} from './themeLab'

describe('theme lab utilities', () => {
  it('normalizes and mixes hex colors for generated tokens', () => {
    expect(normalizeHexColor('#abc')).toBe('#aabbcc')
    expect(normalizeHexColor('147a65')).toBe('#147a65')
    expect(mixHexColor('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('creates complete Yok UI token groups from editable theme state', () => {
    const tokens = createThemeLabTokens(defaultThemeLabState)

    expect(tokens.color.primary).toBe('#147a65')
    expect(tokens.color.primarySoft).toBe('#deece9')
    expect(tokens.color.border).toBe('#cbe2dd')
    expect(tokens.radius.md).toBe('12px')
    expect(tokens.space[4]).toBe('16px')
    expect(tokens.shadow.pop).toContain('rgba(20, 122, 101')
  })

  it('exports CSS variables under a custom selector', () => {
    const css = createThemeLabCss({
      ...defaultThemeLabState,
      selector: '.docs-preview-theme',
      density: 'compact',
      radius: 10
    })

    expect(css).toContain('.docs-preview-theme {')
    expect(css).toContain('  --yok-color-primary: #147a65;')
    expect(css).toContain('  --yok-space-4: 14px;')
    expect(css).toContain('  --yok-radius-md: 10px;')
  })

  it('audits key theme contrast pairs', () => {
    const passingResults = auditThemeLabContrast(defaultThemeLabState)
    const failingResults = auditThemeLabContrast({
      ...defaultThemeLabState,
      primary: '#e8fbf5',
      textMuted: '#dfe8e4'
    })

    expect(passingResults.every((result) => result.passed)).toBe(true)
    expect(failingResults.some((result) => !result.passed)).toBe(true)
  })

  it('creates a copyable theme review report with tokens, contrast and CSS', () => {
    const report = createThemeLabReport({
      ...defaultThemeLabState,
      selector: '.docs-preview-theme',
      density: 'compact',
      radius: 10
    })

    expect(report).toContain('# Yok UI theme review')
    expect(report).toContain('- Selector: `.docs-preview-theme`')
    expect(report).toContain('- Density: Compact')
    expect(report).toContain('- Radius: 10px')
    expect(report).toContain('- Contrast: 4/4 passed')
    expect(report).toContain('- Release gate: 6/6 passed (ready)')
    expect(report).toContain('## Token summary')
    expect(report).toContain('- Color: 13 tokens')
    expect(report).toContain('## Release gate')
    expect(report).toContain('- Token coverage: pass')
    expect(report).toContain('## Contrast audit')
    expect(report).toContain('- Text / Surface:')
    expect(report).toContain('## CSS variables')
    expect(report).toContain('```css')
    expect(report).toContain('.docs-preview-theme {')
    expect(report).toContain('--yok-color-primary: #147a65;')
  })

  it('exports a type-safe YokThemeTokens config for project usage', () => {
    const config = createThemeLabTypeScriptConfig({
      ...defaultThemeLabState,
      density: 'roomy',
      radius: 16
    })

    expect(config).toContain("import type { YokThemeTokens } from '@yok-ui/themes'")
    expect(config).toContain('export const yokCustomTheme = {')
    expect(config).toContain("primary: '#147a65'")
    expect(config).toContain("md: '16px'")
    expect(config).toContain("'4': '22px'")
    expect(config).toContain('} satisfies YokThemeTokens')
  })

  it('audits theme release gates beyond raw color contrast', () => {
    const readyAudit = auditThemeLabRelease(defaultThemeLabState)
    const reviewAudit = auditThemeLabRelease({
      ...defaultThemeLabState,
      selector: 'main div',
      primary: '#e8fbf5',
      textMuted: '#dfe8e4',
      radius: 30
    })

    expect(readyAudit.status).toBe('ready')
    expect(readyAudit.score).toBe(100)
    expect(readyAudit.checks.map((check) => check.key)).toEqual([
      'token-coverage',
      'contrast-aa',
      'selector-scope',
      'density-scale',
      'radius-bounds',
      'semantic-colors'
    ])
    expect(reviewAudit.status).toBe('needs-review')
    expect(reviewAudit.checks.find((check) => check.key === 'selector-scope')?.passed).toBe(false)
    expect(reviewAudit.checks.find((check) => check.key === 'radius-bounds')?.passed).toBe(false)
    expect(reviewAudit.checks.find((check) => check.key === 'contrast-aa')?.passed).toBe(false)
  })

  it('creates a copyable release checklist for theme review workflows', () => {
    const checklist = createThemeLabReleaseChecklist({
      ...defaultThemeLabState,
      selector: '[data-theme="custom"]'
    })

    expect(checklist).toContain('# Yok UI theme release checklist')
    expect(checklist).toContain('- Status: Ready')
    expect(checklist).toContain('- Gate: 6/6 checks passed')
    expect(checklist).toContain('- Selector: `[data-theme="custom"]`')
    expect(checklist).toContain('- [x] Token coverage:')
    expect(checklist).toContain('- [x] WCAG contrast:')
    expect(checklist).toContain('## Contrast pairs')
  })
})
