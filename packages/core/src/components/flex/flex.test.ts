import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YFlex from './YFlex.vue'

describe('YFlex', () => {
  it('renders a block-level flex container without wrapping slot children', () => {
    const wrapper = mount(YFlex, {
      slots: {
        default: '<button>Save</button><button>Cancel</button>'
      }
    })

    expect(wrapper.classes()).toContain('yok-flex')
    expect(wrapper.classes()).toContain('yok-flex--direction-row')
    expect(wrapper.attributes('style')).toContain('--yok-flex-gap-row: 12px')
    expect(wrapper.attributes('style')).toContain('--yok-flex-gap-column: 12px')
    expect(wrapper.findAll('button')).toHaveLength(2)
    expect(wrapper.find('.yok-flex__item').exists()).toBe(false)
  })

  it('supports vertical shortcut, alignment, justification and reverse wrapping', () => {
    const wrapper = mount(YFlex, {
      props: {
        vertical: true,
        align: 'stretch',
        justify: 'between',
        wrap: 'reverse',
        gap: ['sm', 18]
      },
      slots: {
        default: '<span>Title</span><span>Description</span>'
      }
    })

    expect(wrapper.classes()).toContain('yok-flex--direction-column')
    expect(wrapper.classes()).toContain('yok-flex--align-stretch')
    expect(wrapper.classes()).toContain('yok-flex--justify-between')
    expect(wrapper.classes()).toContain('yok-flex--wrap-reverse')
    expect(wrapper.attributes('style')).toContain('--yok-flex-gap-row: 8px')
    expect(wrapper.attributes('style')).toContain('--yok-flex-gap-column: 18px')
  })

  it('supports semantic elements, inline rendering, flex shorthand and accessible names', () => {
    const wrapper = mount(YFlex, {
      props: {
        as: 'nav',
        inline: true,
        flex: '1 1 240px',
        ariaLabel: 'Primary links'
      },
      slots: {
        default: '<a href="/guide/">Guide</a><a href="/components/">Components</a>'
      }
    })

    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.classes()).toContain('yok-flex--inline')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Primary links')
    expect(wrapper.attributes('style')).toContain('flex-grow: 1')
    expect(wrapper.attributes('style')).toContain('flex-shrink: 1')
    expect(wrapper.attributes('style')).toContain('flex-basis: 240px')
  })
})
