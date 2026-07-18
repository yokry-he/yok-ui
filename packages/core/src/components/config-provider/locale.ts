export type YokLocaleDirection = 'ltr' | 'rtl'
export type YokLocaleMessages = Readonly<Record<string, string>>
export type YokLocaleParams = Readonly<Record<string, string | number>>

export interface YokLocale {
  name: string
  direction: YokLocaleDirection
  messages: YokLocaleMessages
}

export type YokLocaleInput = string | YokLocale

export const enUS: YokLocale = Object.freeze({
  name: 'en-US',
  direction: 'ltr',
  messages: Object.freeze({
    'common.cancel': 'Cancel',
    'common.clear': 'Clear',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading',
    'common.noData': 'No data',
    'date.today': 'Today',
    'pagination.total': '{total} items',
    'select.empty': 'No matching options',
    'select.placeholder': 'Select',
    'upload.selectFile': 'Select file'
  })
})

export const zhCN: YokLocale = Object.freeze({
  name: 'zh-CN',
  direction: 'ltr',
  messages: Object.freeze({
    'common.cancel': '取消',
    'common.clear': '清空',
    'common.close': '关闭',
    'common.confirm': '确认',
    'common.loading': '加载中',
    'common.noData': '暂无数据',
    'date.today': '今天',
    'pagination.total': '共 {total} 条',
    'select.empty': '无匹配选项',
    'select.placeholder': '请选择',
    'upload.selectFile': '选择文件'
  })
})

export const jaJP: YokLocale = Object.freeze({
  name: 'ja-JP',
  direction: 'ltr',
  messages: Object.freeze({
    'common.cancel': 'キャンセル',
    'common.clear': 'クリア',
    'common.close': '閉じる',
    'common.confirm': '確認',
    'common.loading': '読み込み中',
    'common.noData': 'データがありません',
    'date.today': '今日',
    'pagination.total': '全 {total} 件',
    'select.empty': '一致するオプションがありません',
    'select.placeholder': '選択してください',
    'upload.selectFile': 'ファイルを選択'
  })
})

export const builtinYokLocales = Object.freeze({
  'en-US': enUS,
  'zh-CN': zhCN,
  'ja-JP': jaJP
})

const localeAliases: Readonly<Record<string, keyof typeof builtinYokLocales>> = Object.freeze({
  en: 'en-US',
  'en-us': 'en-US',
  ja: 'ja-JP',
  'ja-jp': 'ja-JP',
  zh: 'zh-CN',
  'zh-cn': 'zh-CN'
})

export function resolveYokLocale(locale: YokLocaleInput = enUS): YokLocale {
  if (typeof locale !== 'string') {
    return locale
  }

  const normalizedName = localeAliases[locale.trim().toLowerCase()]
  return normalizedName ? builtinYokLocales[normalizedName] : enUS
}

export function translateYokLocale(
  locale: YokLocaleInput,
  key: string,
  params: YokLocaleParams = {}
) {
  const resolvedLocale = resolveYokLocale(locale)
  const message = resolvedLocale.messages[key] ?? enUS.messages[key] ?? key

  return message.replace(/\{([\w-]+)\}/g, (token, name: string) => {
    const value = params[name]
    return value === undefined ? token : String(value)
  })
}
