import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { createYokConfigContext } from './context'
import { builtinYokFonts } from './fonts'

describe('Yok UI config context', () => {
  it('creates complete backward-compatible defaults', () => {
    const config = createYokConfigContext()

    expect(config.size.value).toBe('md')
    expect(config.density.value).toBe('comfortable')
    expect(config.locale.value).toBe('en-US')
    expect(config.direction.value).toBe('ltr')
    expect(config.namespace.value).toBe('yok')
    expect(config.theme.value).toBe('yok-light')
    expect(config.fontFamily.value).toBe(builtinYokFonts.system.family)
    expect(config.zIndex.value).toBe(2000)
    expect(config.button.value).toEqual({})
  })

  it('normalizes locale objects and translates through the active locale', () => {
    const config = createYokConfigContext({ locale: 'zh-CN' })

    expect(config.locale.value).toBe('zh-CN')
    expect(config.localePack.value.name).toBe('zh-CN')
    expect(config.t('pagination.total', { total: 18 })).toBe('共 18 条')
  })

  it('reacts to option changes without rebuilding the context', () => {
    const options = reactive({
      size: 'sm' as const,
      locale: 'en-US'
    })
    const config = createYokConfigContext(options)

    expect(config.size.value).toBe('sm')
    expect(config.t('common.confirm')).toBe('Confirm')

    options.locale = 'ja-JP'
    expect(config.locale.value).toBe('ja-JP')
    expect(config.t('common.confirm')).toBe('確認')
  })

  it('merges nested component defaults without mutating the parent', () => {
    const parent = createYokConfigContext({
      button: {
        type: 'primary',
        variant: 'secondary',
        autoInsertSpace: true
      }
    })
    const child = createYokConfigContext({
      button: {
        variant: 'ghost'
      }
    }, parent)

    expect(child.button.value).toEqual({
      type: 'primary',
      variant: 'ghost',
      autoInsertSpace: true
    })
    expect(parent.button.value.variant).toBe('secondary')
  })
})
