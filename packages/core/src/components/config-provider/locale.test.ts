import { describe, expect, it } from 'vitest'
import {
  builtinYokLocales,
  resolveYokLocale,
  translateYokLocale,
  type YokLocale
} from './locale'

describe('Yok UI locale runtime', () => {
  it('ships English, Simplified Chinese, and Japanese locale packs', () => {
    expect(Object.keys(builtinYokLocales)).toEqual(['en-US', 'zh-CN', 'ja-JP'])
    expect(builtinYokLocales['zh-CN'].messages['select.placeholder']).toBe('请选择')
    expect(builtinYokLocales['ja-JP'].messages['common.loading']).toBe('読み込み中')
  })

  it('falls back to English for an unknown locale code', () => {
    expect(resolveYokLocale('fr-FR')).toBe(builtinYokLocales['en-US'])
  })

  it('accepts a custom locale and falls back per message key', () => {
    const customLocale: YokLocale = {
      name: 'en-GB',
      direction: 'ltr',
      messages: {
        'common.loading': 'Loading, please wait'
      }
    }

    expect(translateYokLocale(customLocale, 'common.loading')).toBe('Loading, please wait')
    expect(translateYokLocale(customLocale, 'select.placeholder')).toBe('Select')
  })

  it('interpolates named message parameters and returns the key when no message exists', () => {
    expect(translateYokLocale('zh-CN', 'pagination.total', { total: 24 })).toBe('共 24 条')
    expect(translateYokLocale('ja-JP', 'unknown.key')).toBe('unknown.key')
  })
})
