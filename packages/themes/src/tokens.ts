export interface YokThemeTokens {
  color: Record<string, string>
  radius: Record<string, string>
  space: Record<string, string>
  shadow: Record<string, string>
  motion: Record<string, string>
  zIndex: Record<string, string>
}

export const yokLight: YokThemeTokens = {
  color: {
    primary: '#147a65',
    primarySoft: '#e8fbf5',
    accentPink: '#ff8fb3',
    accentBlue: '#7cc7ff',
    accentYellow: '#ffd76d',
    surface: '#fffdfa',
    surfaceMuted: '#f6f8f7',
    text: '#25302d',
    textMuted: '#68736f',
    border: '#dfe8e4',
    danger: '#b83a48',
    warning: '#956600',
    success: '#167a59'
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '22px'
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px'
  },
  shadow: {
    soft: '0 8px 24px rgba(37, 48, 45, 0.08)',
    pop: '0 14px 40px rgba(37, 48, 45, 0.12)'
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

export const yokClean: YokThemeTokens = {
  ...yokLight,
  color: {
    ...yokLight.color,
    primary: '#1f8190',
    primarySoft: '#e7f7fa',
    surface: '#ffffff',
    surfaceMuted: '#f5f7f8',
    text: '#243033',
    border: '#dce5e8'
  },
  radius: {
    ...yokLight.radius,
    md: '10px',
    lg: '14px'
  }
}

export const yokCandy: YokThemeTokens = {
  ...yokLight,
  color: {
    ...yokLight.color,
    primary: '#9f345f',
    primarySoft: '#fff0f6',
    accentPink: '#ff9fc4',
    accentBlue: '#8bcdf7',
    accentYellow: '#ffe08a',
    surface: '#fffaff',
    surfaceMuted: '#fff0f7',
    text: '#30272d',
    textMuted: '#6f5b66',
    border: '#ead7e2',
    warning: '#8a6400'
  },
  radius: {
    ...yokLight.radius,
    md: '14px',
    lg: '18px',
    xl: '26px'
  },
  shadow: {
    soft: '0 10px 28px rgba(159, 52, 95, 0.10)',
    pop: '0 18px 46px rgba(159, 52, 95, 0.14)'
  }
}

export type YokThemeName = 'yok-light' | 'yok-clean' | 'yok-candy'

export interface YokThemeMeta {
  name: YokThemeName
  label: string
  description: string
  primary: string
  surface: string
}

export const builtinThemes: YokThemeMeta[] = [
  {
    name: 'yok-light',
    label: 'Light',
    description: '清爽可爱的默认主题。',
    primary: yokLight.color.primary,
    surface: yokLight.color.surface
  },
  {
    name: 'yok-clean',
    label: 'Clean',
    description: '更克制、适合后台工作台的主题。',
    primary: yokClean.color.primary,
    surface: yokClean.color.surface
  },
  {
    name: 'yok-candy',
    label: 'Candy',
    description: '更柔和的糖果粉主题，保持 AA 对比度。',
    primary: yokCandy.color.primary,
    surface: yokCandy.color.surface
  }
]
