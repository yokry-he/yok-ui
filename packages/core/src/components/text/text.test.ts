import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YText from './YText.vue'

describe('YText', () => {
  it('renders themed inline text with default semantics', () => {
    const wrapper = mount(YText, {
      slots: {
        default: 'Yok UI text'
      }
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'yok-text',
      'yok-text--neutral',
      'yok-text--md'
    ]))
    expect(wrapper.text()).toBe('Yok UI text')
  })

  it('supports custom tag, tone, size and emphasis states', () => {
    const wrapper = mount(YText, {
      props: {
        tag: 'p',
        tone: 'success',
        size: 'lg',
        strong: true,
        italic: true,
        underline: true
      },
      slots: {
        default: 'Stable release'
      }
    })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'yok-text--success',
      'yok-text--lg',
      'yok-text--strong',
      'yok-text--italic',
      'yok-text--underline'
    ]))
  })

  it('renders semantic code, mark and deleted styles', () => {
    const code = mount(YText, {
      props: {
        code: true
      },
      slots: {
        default: 'componentRegistry'
      }
    })
    const mark = mount(YText, {
      props: {
        mark: true,
        deleted: true
      },
      slots: {
        default: 'Deprecated'
      }
    })

    expect(code.element.tagName).toBe('CODE')
    expect(code.classes()).toContain('yok-text--code')
    expect(mark.classes()).toEqual(expect.arrayContaining(['yok-text--mark', 'yok-text--deleted']))
  })

  it('supports single-line truncation and multi-line line clamp styles', () => {
    const truncated = mount(YText, {
      props: {
        truncated: true
      },
      slots: {
        default: 'A very long line'
      }
    })
    const clamped = mount(YText, {
      props: {
        lineClamp: 2
      },
      slots: {
        default: 'A longer paragraph that should be clamped in layouts.'
      }
    })

    expect(truncated.classes()).toContain('yok-text--truncated')
    expect(clamped.classes()).toContain('yok-text--line-clamp')
    expect(clamped.attributes('style')).toContain('--yok-text-line-clamp: 2')
  })
})
