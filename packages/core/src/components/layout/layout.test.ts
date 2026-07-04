import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import YAside from './YAside.vue'
import YFooter from './YFooter.vue'
import YHeader from './YHeader.vue'
import YLayout from './YLayout.vue'
import YMain from './YMain.vue'

describe('YLayout', () => {
  it('auto-detects vertical layout when direct children include header or footer', () => {
    const wrapper = mount(YLayout, {
      props: {
        ariaLabel: 'Application shell'
      },
      slots: {
        default: () => [
          h(YHeader, { height: '56px' }, () => 'Header'),
          h(YMain, () => 'Main'),
          h(YFooter, { height: '48px' }, () => 'Footer')
        ]
      }
    })

    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Application shell')
    expect(wrapper.classes()).toContain('yok-layout--vertical')
    expect(wrapper.getComponent(YHeader).attributes('style')).toContain('--yok-layout-header-height: 56px')
    expect(wrapper.getComponent(YFooter).attributes('style')).toContain('--yok-layout-footer-height: 48px')
  })

  it('renders horizontal application shells with aside and main regions', () => {
    const wrapper = mount(YLayout, {
      props: {
        direction: 'horizontal',
        fullHeight: true
      },
      slots: {
        default: () => [
          h(YAside, { width: '220px', ariaLabel: 'Primary navigation' }, () => 'Navigation'),
          h(YMain, { padded: false, scrollable: true }, () => 'Content')
        ]
      }
    })

    const aside = wrapper.getComponent(YAside)
    const main = wrapper.getComponent(YMain)

    expect(wrapper.classes()).toContain('yok-layout--horizontal')
    expect(wrapper.classes()).toContain('yok-layout--full-height')
    expect(aside.attributes('aria-label')).toBe('Primary navigation')
    expect(aside.attributes('style')).toContain('--yok-layout-aside-width: 220px')
    expect(main.classes()).toContain('yok-layout-main--scrollable')
    expect(main.classes()).toContain('yok-layout-main--unpadded')
  })

  it('supports nested admin shells with sticky chrome and collapsed sidebars', () => {
    const wrapper = mount(YLayout, {
      props: {
        fullHeight: true
      },
      slots: {
        default: () => [
          h(YHeader, { sticky: true, bordered: true }, () => 'Top navigation'),
          h(YLayout, { direction: 'horizontal' }, () => [
            h(YAside, { collapsed: true, width: '232px', collapsedWidth: '72px', bordered: true }, () => 'Side navigation'),
            h(YMain, () => 'Workspace')
          ])
        ]
      }
    })

    const headers = wrapper.findAll('.yok-layout-header')
    const asides = wrapper.findAll('.yok-layout-aside')

    expect(headers[0].classes()).toContain('yok-layout-header--sticky')
    expect(headers[0].classes()).toContain('yok-layout-header--bordered')
    expect(asides[0].classes()).toContain('yok-layout-aside--collapsed')
    expect(asides[0].attributes('style')).toContain('--yok-layout-aside-width: 72px')
    expect(asides[0].attributes('style')).toContain('--yok-layout-aside-expanded-width: 232px')
  })
})
