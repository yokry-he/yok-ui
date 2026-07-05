import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCol from './YCol.vue'
import YRow from './YRow.vue'

describe('YRow', () => {
  it('renders a 24-grid row with horizontal and vertical gutter variables', () => {
    const wrapper = mount(YRow, {
      props: {
        gutter: [16, 24],
        justify: 'between',
        align: 'middle',
        ariaLabel: 'Dashboard grid'
      },
      slots: {
        default: '<div>One</div><div>Two</div>'
      }
    })

    expect(wrapper.classes()).toContain('yok-row')
    expect(wrapper.classes()).toContain('yok-row--justify-between')
    expect(wrapper.classes()).toContain('yok-row--align-middle')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Dashboard grid')
    expect(wrapper.attributes('style')).toContain('--yok-row-gutter-x: 16px')
    expect(wrapper.attributes('style')).toContain('--yok-row-gutter-y: 24px')
  })

  it('supports responsive gutter objects and nowrap rows', () => {
    const wrapper = mount(YRow, {
      props: {
        gutter: [{ xs: 8, md: 24 }, { xs: 12, lg: 32 }],
        wrap: false
      }
    })

    expect(wrapper.classes()).toContain('yok-row--nowrap')
    expect(wrapper.attributes('style')).toContain('--yok-row-gutter-x-xs: 8px')
    expect(wrapper.attributes('style')).toContain('--yok-row-gutter-x-md: 24px')
    expect(wrapper.attributes('style')).toContain('--yok-row-gutter-y-xs: 12px')
    expect(wrapper.attributes('style')).toContain('--yok-row-gutter-y-lg: 32px')
  })
})

describe('YCol', () => {
  it('renders span, offset, order, push and pull as stable grid variables', () => {
    const wrapper = mount(YCol, {
      props: {
        span: 8,
        offset: 4,
        order: 2,
        push: 1,
        pull: 0
      },
      slots: {
        default: 'Column'
      }
    })

    expect(wrapper.classes()).toContain('yok-col')
    expect(wrapper.text()).toBe('Column')
    expect(wrapper.attributes('style')).toContain('--yok-col-span-base: 8')
    expect(wrapper.attributes('style')).toContain('--yok-col-offset-base: 4')
    expect(wrapper.attributes('style')).toContain('--yok-col-order-base: 2')
    expect(wrapper.attributes('style')).toContain('--yok-col-push-base: 1')
  })

  it('supports numeric and object breakpoint props', () => {
    const wrapper = mount(YCol, {
      props: {
        span: 24,
        xs: 24,
        sm: { span: 12, offset: 2 },
        lg: { span: 8, order: 3, push: 2 }
      }
    })

    expect(wrapper.attributes('style')).toContain('--yok-col-span-xs: 24')
    expect(wrapper.attributes('style')).toContain('--yok-col-span-sm: 12')
    expect(wrapper.attributes('style')).toContain('--yok-col-offset-sm: 2')
    expect(wrapper.attributes('style')).toContain('--yok-col-span-lg: 8')
    expect(wrapper.attributes('style')).toContain('--yok-col-order-lg: 3')
    expect(wrapper.attributes('style')).toContain('--yok-col-push-lg: 2')
  })
})
