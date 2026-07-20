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

function createTheme(overrides: Partial<YokThemeTokens> & { color: Partial<YokThemeTokens['color']> }): YokThemeTokens {
  return {
    color: {
      ...yokLight.color,
      ...overrides.color
    },
    radius: {
      ...yokLight.radius,
      ...overrides.radius
    },
    space: {
      ...yokLight.space,
      ...overrides.space
    },
    shadow: {
      ...yokLight.shadow,
      ...overrides.shadow
    },
    motion: {
      ...yokLight.motion,
      ...overrides.motion
    },
    zIndex: {
      ...yokLight.zIndex,
      ...overrides.zIndex
    }
  }
}

export const yokMint = createTheme({
  color: {
    primary: '#0f766e',
    primarySoft: '#dcfdf5',
    accentPink: '#fb7185',
    accentBlue: '#38bdf8',
    accentYellow: '#facc15',
    surface: '#fbfffd',
    surfaceMuted: '#eefbf6',
    text: '#20302b',
    textMuted: '#5d6f69',
    border: '#cfe7df',
    warning: '#875f00'
  },
  shadow: {
    soft: '0 8px 24px rgba(15, 118, 110, 0.09)',
    pop: '0 14px 40px rgba(15, 118, 110, 0.13)'
  }
})

export const yokOcean = createTheme({
  color: {
    primary: '#0b6f92',
    primarySoft: '#e3f6fc',
    accentPink: '#f472b6',
    accentBlue: '#38bdf8',
    accentYellow: '#f8c85c',
    surface: '#fbfdff',
    surfaceMuted: '#eef8fc',
    text: '#22303a',
    textMuted: '#5f6f78',
    border: '#d3e6ee',
    warning: '#875f00',
    success: '#13795b'
  },
  radius: {
    ...yokLight.radius,
    lg: '18px',
    xl: '24px'
  }
})

export const yokSakura = createTheme({
  color: {
    primary: '#a73561',
    primarySoft: '#fff0f6',
    accentPink: '#fb8fbc',
    accentBlue: '#8ccdf2',
    accentYellow: '#ffd580',
    surface: '#fffbfd',
    surfaceMuted: '#fff2f7',
    text: '#332930',
    textMuted: '#705f68',
    border: '#ead7e0',
    warning: '#875f00'
  },
  shadow: {
    soft: '0 8px 24px rgba(167, 53, 97, 0.09)',
    pop: '0 14px 40px rgba(167, 53, 97, 0.13)'
  }
})

export const yokLavender = createTheme({
  color: {
    primary: '#6d4db7',
    primarySoft: '#f2edff',
    accentPink: '#e879f9',
    accentBlue: '#7dd3fc',
    accentYellow: '#fde68a',
    surface: '#fefcff',
    surfaceMuted: '#f6f1ff',
    text: '#2f2b3a',
    textMuted: '#665f75',
    border: '#ded6ef',
    warning: '#875f00'
  }
})

export const yokSunrise = createTheme({
  color: {
    primary: '#9b4d10',
    primarySoft: '#fff4df',
    accentPink: '#fb7185',
    accentBlue: '#60a5fa',
    accentYellow: '#fbbf24',
    surface: '#fffdf8',
    surfaceMuted: '#fff5e6',
    text: '#332d25',
    textMuted: '#6f6557',
    border: '#eadcc6',
    warning: '#7a5600',
    success: '#11765a'
  }
})

export const yokForest = createTheme({
  color: {
    primary: '#166534',
    primarySoft: '#e8f8ee',
    accentPink: '#f472b6',
    accentBlue: '#67e8f9',
    accentYellow: '#eab308',
    surface: '#fcfffb',
    surfaceMuted: '#f0f8ef',
    text: '#243026',
    textMuted: '#63705f',
    border: '#d8e8d5',
    warning: '#875f00'
  }
})

export const yokInk = createTheme({
  color: {
    primary: '#147a65',
    primarySoft: '#123b35',
    accentPink: '#f0a3bf',
    accentBlue: '#8bd3ff',
    accentYellow: '#ffe08a',
    surface: '#111827',
    surfaceMuted: '#1f2937',
    text: '#f8fafc',
    textMuted: '#cbd5e1',
    border: '#334155',
    danger: '#fda4af',
    warning: '#fde68a',
    success: '#86efac'
  },
  shadow: {
    soft: '0 10px 28px rgba(2, 6, 23, 0.28)',
    pop: '0 18px 46px rgba(2, 6, 23, 0.36)'
  }
})

export const yokPeach = createTheme({
  color: {
    primary: '#a34234',
    primarySoft: '#fff0eb',
    accentPink: '#fb7185',
    accentBlue: '#7dd3fc',
    accentYellow: '#fbd38d',
    surface: '#fffaf7',
    surfaceMuted: '#fff0ea',
    text: '#342c28',
    textMuted: '#725f58',
    border: '#ead8d0',
    warning: '#875f00'
  }
})

export const yokSlate = createTheme({
  color: {
    primary: '#315b80',
    primarySoft: '#edf5fb',
    accentPink: '#f472b6',
    accentBlue: '#93c5fd',
    accentYellow: '#fde68a',
    surface: '#fdfefe',
    surfaceMuted: '#f3f6f8',
    text: '#27313a',
    textMuted: '#626f78',
    border: '#d8e2e8',
    warning: '#875f00'
  },
  radius: {
    ...yokLight.radius,
    md: '9px',
    lg: '12px',
    xl: '18px'
  }
})

export type YokThemeName =
  | 'yok-light'
  | 'yok-clean'
  | 'yok-candy'
  | 'yok-mint'
  | 'yok-ocean'
  | 'yok-sakura'
  | 'yok-lavender'
  | 'yok-sunrise'
  | 'yok-forest'
  | 'yok-ink'
  | 'yok-peach'
  | 'yok-slate'

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
  },
  {
    name: 'yok-mint',
    label: 'Mint',
    description: '薄荷绿色主题，适合清爽可爱的默认延展。',
    primary: yokMint.color.primary,
    surface: yokMint.color.surface
  },
  {
    name: 'yok-ocean',
    label: 'Ocean',
    description: '偏蓝绿的产品文档主题，适合技术站点。',
    primary: yokOcean.color.primary,
    surface: yokOcean.color.surface
  },
  {
    name: 'yok-sakura',
    label: 'Sakura',
    description: '樱花粉主题，适合品牌页和轻量组件展示。',
    primary: yokSakura.color.primary,
    surface: yokSakura.color.surface
  },
  {
    name: 'yok-lavender',
    label: 'Lavender',
    description: '薰衣草紫主题，保持柔和但避免低对比。',
    primary: yokLavender.color.primary,
    surface: yokLavender.color.surface
  },
  {
    name: 'yok-sunrise',
    label: 'Sunrise',
    description: '暖日出主题，用于营销感更强的页面。',
    primary: yokSunrise.color.primary,
    surface: yokSunrise.color.surface
  },
  {
    name: 'yok-forest',
    label: 'Forest',
    description: '深绿工作台主题，适合数据和后台页面。',
    primary: yokForest.color.primary,
    surface: yokForest.color.surface
  },
  {
    name: 'yok-ink',
    label: 'Ink',
    description: '深色阅读主题，用于夜间和代码优先场景。',
    primary: yokInk.color.primary,
    surface: yokInk.color.surface
  },
  {
    name: 'yok-peach',
    label: 'Peach',
    description: '蜜桃暖色主题，适合轻量产品页。',
    primary: yokPeach.color.primary,
    surface: yokPeach.color.surface
  },
  {
    name: 'yok-slate',
    label: 'Slate',
    description: '冷静灰蓝主题，适合企业后台和 API 文档。',
    primary: yokSlate.color.primary,
    surface: yokSlate.color.surface
  }
]
