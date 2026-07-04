import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YScrollbar from './YScrollbar.vue'

describe('YScrollbar', () => {
  it('renders a scrollable viewport with height and max height tokens', () => {
    const wrapper = mount(YScrollbar, {
      props: {
        height: 180,
        maxHeight: '240px'
      },
      slots: {
        default: '<p>Release notes</p>'
      }
    })

    const viewport = wrapper.get('.yok-scrollbar__viewport')

    expect(wrapper.classes()).toContain('yok-scrollbar')
    expect(viewport.attributes('style')).toContain('--yok-scrollbar-height: 180px')
    expect(viewport.attributes('style')).toContain('--yok-scrollbar-max-height: 240px')
    expect(viewport.attributes('tabindex')).toBe('0')
    expect(wrapper.text()).toContain('Release notes')
  })

  it('supports horizontal scrolling and native scrollbars', () => {
    const wrapper = mount(YScrollbar, {
      props: {
        horizontal: true,
        native: true,
        height: '120px'
      },
      slots: {
        default: '<div style="width: 600px">Wide content</div>'
      }
    })

    const viewport = wrapper.get('.yok-scrollbar__viewport')

    expect(wrapper.classes()).toContain('yok-scrollbar--horizontal')
    expect(wrapper.classes()).toContain('yok-scrollbar--native')
    expect(viewport.attributes('style')).toContain('--yok-scrollbar-height: 120px')
  })

  it('emits scroll metrics from the viewport', async () => {
    const wrapper = mount(YScrollbar, {
      slots: {
        default: '<div style="height: 400px">Scrollable content</div>'
      }
    })
    const viewport = wrapper.get('.yok-scrollbar__viewport')

    Object.defineProperty(viewport.element, 'scrollTop', {
      configurable: true,
      value: 36
    })
    Object.defineProperty(viewport.element, 'scrollLeft', {
      configurable: true,
      value: 12
    })

    await viewport.trigger('scroll')

    expect(wrapper.emitted('scroll')?.[0]).toEqual([
      expect.objectContaining({
        scrollTop: 36,
        scrollLeft: 12
      })
    ])
  })
})
