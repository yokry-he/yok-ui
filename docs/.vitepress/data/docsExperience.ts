import { builtinThemes, type YokThemeName } from '@yok-ui/themes'

export const docsLocales = [
  {
    value: 'zh-CN',
    label: '中文',
    shortLabel: '中',
    previewLabel: '中文文案',
    description: '默认中文文档体验，适合国内团队阅读和交付。'
  },
  {
    value: 'en-US',
    label: 'English',
    shortLabel: 'EN',
    previewLabel: 'English copy',
    description: 'English labels for international component review.'
  },
  {
    value: 'ja-JP',
    label: '日本語',
    shortLabel: '日',
    previewLabel: '日本語コピー',
    description: '日本語のドキュメント確認に使う表示モード。'
  }
] as const

export type DocsLocale = (typeof docsLocales)[number]['value']

export const docsLocaleLabels: Record<DocsLocale, string> = docsLocales.reduce((labels, locale) => {
  labels[locale.value] = locale.label
  return labels
}, {} as Record<DocsLocale, string>)

export const docsFonts = [
  {
    value: 'system',
    label: 'System',
    previewLabel: '系统默认',
    stack: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    description: '默认系统字体，启动最快，适合组件库官网。'
  },
  {
    value: 'rounded',
    label: 'Rounded',
    previewLabel: '圆润可爱',
    stack: '"Nunito Sans", "Inter", ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
    description: '更圆润的阅读感，适合清爽可爱的品牌调性。'
  },
  {
    value: 'serif',
    label: 'Serif',
    previewLabel: '文档叙事',
    stack: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
    description: '偏文章化的说明页字体，用于设计指南和资源页。'
  },
  {
    value: 'mono',
    label: 'Mono',
    previewLabel: '代码优先',
    stack: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    description: '突出源码和 API 的工程阅读模式。'
  },
  {
    value: 'cjk',
    label: 'CJK',
    previewLabel: '中日友好',
    stack: '"PingFang SC", "Hiragino Sans", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif',
    description: '中、日、多语言文档更稳定的字体栈。'
  },
  {
    value: 'compact',
    label: 'Compact',
    previewLabel: '紧凑信息',
    stack: 'Arial, "Helvetica Neue", "PingFang SC", system-ui, sans-serif',
    description: '适合表格、后台、密集 API 文档阅读。'
  }
] as const

export type DocsFont = (typeof docsFonts)[number]['value']

export const docsFontLabels: Record<DocsFont, string> = docsFonts.reduce((labels, font) => {
  labels[font.value] = font.label
  return labels
}, {} as Record<DocsFont, string>)

export const docsThemeOptions = builtinThemes.map((theme) => ({
  ...theme,
  value: theme.name,
  previewStyle: {
    '--docs-theme-primary': theme.primary,
    '--docs-theme-surface': theme.surface
  }
}))

export type DocsTheme = YokThemeName
