import {
  auditContrastPairs,
  createThemeVars,
  type ContrastAuditResult,
  type YokThemeTokens
} from '@yok-ui/themes'

export type ThemeLabDensity = 'compact' | 'comfortable' | 'roomy'
export type ThemeLabPreviewMode = 'product' | 'admin' | 'brand'

export interface ThemeLabState {
  primary: string
  surface: string
  text: string
  textMuted: string
  radius: number
  density: ThemeLabDensity
  selector: string
}

export type ThemeLabReleaseAuditLevel = 'pass' | 'review'

export interface ThemeLabReleaseAuditCheck {
  key: string
  label: string
  level: ThemeLabReleaseAuditLevel
  passed: boolean
  detail: string
}

export interface ThemeLabReleaseAudit {
  score: number
  passed: number
  total: number
  status: 'ready' | 'needs-review'
  checks: ThemeLabReleaseAuditCheck[]
}

export const themeLabDensityPresets: Record<ThemeLabDensity, {
  label: string
  space2: string
  space3: string
  space4: string
  space5: string
  space6: string
}> = {
  compact: {
    label: 'Compact',
    space2: '6px',
    space3: '10px',
    space4: '14px',
    space5: '18px',
    space6: '22px'
  },
  comfortable: {
    label: 'Comfortable',
    space2: '8px',
    space3: '12px',
    space4: '16px',
    space5: '20px',
    space6: '24px'
  },
  roomy: {
    label: 'Roomy',
    space2: '10px',
    space3: '16px',
    space4: '22px',
    space5: '28px',
    space6: '34px'
  }
}

export const defaultThemeLabState: ThemeLabState = {
  primary: '#147a65',
  surface: '#fffdfa',
  text: '#25302d',
  textMuted: '#68736f',
  radius: 12,
  density: 'comfortable',
  selector: '.my-yok-theme'
}

function clamp(value: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value))
}

export function normalizeHexColor(hex: string) {
  const cleaned = hex.replace('#', '').trim()

  if (cleaned.length === 3) {
    return `#${cleaned
      .split('')
      .map((char) => char + char)
      .join('')}`.toLowerCase()
  }

  return `#${cleaned.padEnd(6, '0').slice(0, 6)}`.toLowerCase()
}

function hexToRgb(hex: string) {
  const normalized = normalizeHexColor(hex).replace('#', '')

  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16)
  }
}

function rgbToHex(red: number, green: number, blue: number) {
  return [red, green, blue]
    .map((value) => clamp(Math.round(value)).toString(16).padStart(2, '0'))
    .join('')
}

export function mixHexColor(color: string, target: string, weight: number) {
  const sourceRgb = hexToRgb(color)
  const targetRgb = hexToRgb(target)

  return `#${rgbToHex(
    sourceRgb.red * (1 - weight) + targetRgb.red * weight,
    sourceRgb.green * (1 - weight) + targetRgb.green * weight,
    sourceRgb.blue * (1 - weight) + targetRgb.blue * weight
  )}`
}

function shadowColor(primary: string, opacity: number) {
  const { red, green, blue } = hexToRgb(primary)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

export function createThemeLabTokens(state: ThemeLabState): YokThemeTokens {
  const density = themeLabDensityPresets[state.density]
  const radius = Math.max(6, state.radius)
  const primary = normalizeHexColor(state.primary)
  const surface = normalizeHexColor(state.surface)
  const text = normalizeHexColor(state.text)
  const textMuted = normalizeHexColor(state.textMuted)

  return {
    color: {
      primary,
      primarySoft: mixHexColor(primary, '#ffffff', 0.86),
      accentPink: mixHexColor(primary, '#ff8fb3', 0.28),
      accentBlue: mixHexColor(primary, '#7cc7ff', 0.28),
      accentYellow: '#ffd76d',
      surface,
      surfaceMuted: mixHexColor(surface, primary, 0.04),
      text,
      textMuted,
      border: mixHexColor(primary, '#ffffff', 0.78),
      danger: '#b83a48',
      warning: '#956600',
      success: '#167a59'
    },
    radius: {
      xs: `${Math.max(4, radius - 6)}px`,
      sm: `${Math.max(6, radius - 4)}px`,
      md: `${radius}px`,
      lg: `${radius + 4}px`,
      xl: `${radius + 10}px`
    },
    space: {
      1: '4px',
      2: density.space2,
      3: density.space3,
      4: density.space4,
      5: density.space5,
      6: density.space6
    },
    shadow: {
      soft: `0 8px 24px ${shadowColor(primary, 0.1)}`,
      pop: `0 18px 46px ${shadowColor(primary, 0.16)}`
    },
    motion: {
      fast: '120ms ease',
      normal: '180ms ease'
    },
    zIndex: {
      tooltip: '900',
      floating: '1000',
      drawer: '1900',
      modal: '2000',
      toast: '3000'
    }
  }
}

export function createThemeLabCss(state: ThemeLabState) {
  const selector = state.selector.trim() || ':root'
  const vars = createThemeVars(createThemeLabTokens(state))

  return [
    `${selector} {`,
    ...Object.entries(vars).map(([name, value]) => `  ${name}: ${value};`),
    '}'
  ].join('\n')
}

function formatTokenKey(key: string) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`
}

function formatTokenGroup(name: keyof YokThemeTokens, tokens: Record<string, string>) {
  return [
    `  ${name}: {`,
    ...Object.entries(tokens).map(([key, value]) => `    ${formatTokenKey(key)}: '${value}'`),
    '  }'
  ].join('\n')
}

export function createThemeLabTypeScriptConfig(state: ThemeLabState) {
  const tokens = createThemeLabTokens(state)

  return [
    "import type { YokThemeTokens } from '@yok-ui/themes'",
    '',
    'export const yokCustomTheme = {',
    [
      formatTokenGroup('color', tokens.color),
      formatTokenGroup('radius', tokens.radius),
      formatTokenGroup('space', tokens.space),
      formatTokenGroup('shadow', tokens.shadow),
      formatTokenGroup('motion', tokens.motion),
      formatTokenGroup('zIndex', tokens.zIndex)
    ].join(',\n'),
    '} satisfies YokThemeTokens'
  ].join('\n')
}

export function auditThemeLabContrast(state: ThemeLabState): ContrastAuditResult[] {
  const tokens = createThemeLabTokens(state)

  return auditContrastPairs([
    {
      name: 'Text / Surface',
      foreground: tokens.color.text,
      background: tokens.color.surface,
      minimum: 4.5
    },
    {
      name: 'Muted text / Surface',
      foreground: tokens.color.textMuted,
      background: tokens.color.surface,
      minimum: 4.5
    },
    {
      name: 'Primary / Surface',
      foreground: tokens.color.primary,
      background: tokens.color.surface,
      minimum: 3
    },
    {
      name: 'Button text / Primary',
      foreground: '#ffffff',
      background: tokens.color.primary,
      minimum: 4.5
    }
  ])
}

function getTokenCount(tokens: YokThemeTokens) {
  return Object.values(tokens).reduce((total, group) => total + Object.keys(group).length, 0)
}

function hasSafeSelector(selector: string) {
  const normalizedSelector = selector.trim() || ':root'

  return normalizedSelector === ':root' ||
    /^(\.[a-zA-Z][\w-]*|\[data-theme=['"]?[a-zA-Z][\w-]*['"]?\])$/.test(normalizedSelector)
}

export function auditThemeLabRelease(state: ThemeLabState): ThemeLabReleaseAudit {
  const tokens = createThemeLabTokens(state)
  const contrastResults = auditThemeLabContrast(state)
  const tokenCount = getTokenCount(tokens)
  const passedContrastCount = contrastResults.filter((result) => result.passed).length
  const requiredContrastCount = contrastResults.length
  const checks: ThemeLabReleaseAuditCheck[] = [
    {
      key: 'token-coverage',
      label: 'Token coverage',
      level: tokenCount >= 30 ? 'pass' : 'review',
      passed: tokenCount >= 30,
      detail: `${tokenCount} tokens across color, radius, space, shadow, motion and z-index groups.`
    },
    {
      key: 'contrast-aa',
      label: 'WCAG contrast',
      level: passedContrastCount === requiredContrastCount ? 'pass' : 'review',
      passed: passedContrastCount === requiredContrastCount,
      detail: `${passedContrastCount}/${requiredContrastCount} key contrast pairs pass the configured AA thresholds.`
    },
    {
      key: 'selector-scope',
      label: 'Scoped selector',
      level: hasSafeSelector(state.selector) ? 'pass' : 'review',
      passed: hasSafeSelector(state.selector),
      detail: `Exports to \`${state.selector.trim() || ':root'}\`; prefer :root, a single class, or a data-theme selector.`
    },
    {
      key: 'density-scale',
      label: 'Density scale',
      level: state.density ? 'pass' : 'review',
      passed: Boolean(state.density),
      detail: `${themeLabDensityPresets[state.density].label} spacing keeps product, admin and brand previews on the same token contract.`
    },
    {
      key: 'radius-bounds',
      label: 'Radius bounds',
      level: state.radius >= 8 && state.radius <= 24 ? 'pass' : 'review',
      passed: state.radius >= 8 && state.radius <= 24,
      detail: `${Math.max(6, state.radius)}px base radius; release themes should stay between 8px and 24px.`
    },
    {
      key: 'semantic-colors',
      label: 'Semantic colors',
      level: ['danger', 'warning', 'success'].every((key) => Boolean(tokens.color[key])) ? 'pass' : 'review',
      passed: ['danger', 'warning', 'success'].every((key) => Boolean(tokens.color[key])),
      detail: 'Danger, warning and success tokens remain available for feedback components.'
    }
  ]
  const passed = checks.filter((check) => check.passed).length

  return {
    score: Math.round((passed / checks.length) * 100),
    passed,
    total: checks.length,
    status: passed === checks.length ? 'ready' : 'needs-review',
    checks
  }
}

export function createThemeLabReleaseChecklist(state: ThemeLabState) {
  const audit = auditThemeLabRelease(state)

  return [
    '# Yok UI theme release checklist',
    '',
    `- Status: ${audit.status === 'ready' ? 'Ready' : 'Needs review'}`,
    `- Score: ${audit.score}`,
    `- Gate: ${audit.passed}/${audit.total} checks passed`,
    `- Selector: \`${state.selector.trim() || ':root'}\``,
    `- Density: ${themeLabDensityPresets[state.density].label}`,
    '',
    '## Release gates',
    ...audit.checks.map((check) =>
      `- [${check.passed ? 'x' : ' '}] ${check.label}: ${check.detail}`
    ),
    '',
    '## Contrast pairs',
    ...auditThemeLabContrast(state).map((result) =>
      `- ${result.name}: ${result.ratio}:1, minimum ${result.minimum}:1, ${result.passed ? 'pass' : 'review'}`
    )
  ].join('\n')
}

export function createThemeLabReport(state: ThemeLabState) {
  const selector = state.selector.trim() || ':root'
  const tokens = createThemeLabTokens(state)
  const contrastResults = auditThemeLabContrast(state)
  const releaseAudit = auditThemeLabRelease(state)
  const passedContrastCount = contrastResults.filter((result) => result.passed).length
  const tokenGroups = [
    ['Color', tokens.color],
    ['Radius', tokens.radius],
    ['Space', tokens.space],
    ['Shadow', tokens.shadow],
    ['Motion', tokens.motion],
    ['Z-index', tokens.zIndex]
  ] as const

  return [
    '# Yok UI theme review',
    '',
    `- Selector: \`${selector}\``,
    `- Primary: ${tokens.color.primary}`,
    `- Surface: ${tokens.color.surface}`,
    `- Text: ${tokens.color.text}`,
    `- Muted text: ${tokens.color.textMuted}`,
    `- Density: ${themeLabDensityPresets[state.density].label}`,
    `- Radius: ${Math.max(6, state.radius)}px`,
    `- Contrast: ${passedContrastCount}/${contrastResults.length} passed`,
    `- Release gate: ${releaseAudit.passed}/${releaseAudit.total} passed (${releaseAudit.status})`,
    '',
    '## Token summary',
    ...tokenGroups.map(([group, groupTokens]) => `- ${group}: ${Object.keys(groupTokens).length} tokens`),
    '',
    '## Release gate',
    ...releaseAudit.checks.map((check) =>
      `- ${check.label}: ${check.passed ? 'pass' : 'review'} - ${check.detail}`
    ),
    '',
    '## Contrast audit',
    ...contrastResults.map((result) =>
      `- ${result.name}: ${result.ratio}:1, minimum ${result.minimum}:1, ${result.passed ? 'AA pass' : 'needs review'}`
    ),
    '',
    '## CSS variables',
    '```css',
    createThemeLabCss(state),
    '```'
  ].join('\n')
}
