import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSpace from './YSpace.vue'

describe('YSpace', () => {
  it('renders children in a horizontal spacing group by default', () => {
    const wrapper = mount(YSpace, {
      slots: {
        default: '<button>Save</button><button>Cancel</button>'
      }
    })

    expect(wrapper.classes()).toContain('yok-space')
    expect(wrapper.classes()).toContain('yok-space--horizontal')
    expect(wrapper.attributes('style')).toContain('--yok-space-gap-row: 12px')
    expect(wrapper.attributes('style')).toContain('--yok-space-gap-column: 12px')
    expect(wrapper.findAll('.yok-space__item')).toHaveLength(2)
  })

  it('supports vertical, wrap, fill and align settings', () => {
    const wrapper = mount(YSpace, {
      props: {
        direction: 'vertical',
        size: ['sm', 20],
        align: 'stretch',
        wrap: true,
        fill: true
      },
      slots: {
        default: '<span>Title</span><span>Description</span>'
      }
    })

    expect(wrapper.classes()).toContain('yok-space--vertical')
    expect(wrapper.classes()).toContain('yok-space--wrap')
    expect(wrapper.classes()).toContain('yok-space--fill')
    expect(wrapper.classes()).toContain('yok-space--align-stretch')
    expect(wrapper.attributes('style')).toContain('--yok-space-gap-row: 8px')
    expect(wrapper.attributes('style')).toContain('--yok-space-gap-column: 20px')
  })

  it('inserts a separator slot between rendered items', () => {
    const wrapper = mount(YSpace, {
      slots: {
        default: '<span>Core</span><span>Product</span><span>Admin</span>',
        separator: '<i aria-hidden="true">/</i>'
      }
    })

    expect(wrapper.findAll('.yok-space__item')).toHaveLength(3)
    expect(wrapper.findAll('.yok-space__separator')).toHaveLength(2)
    expect(wrapper.text()).toContain('Core/Product/Admin')
  })
})
