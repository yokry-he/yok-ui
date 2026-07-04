import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YDataToolbar from './YDataToolbar.vue'

describe('YDataToolbar', () => {
  it('renders title, count and actions', () => {
    const wrapper = mount(YDataToolbar, {
      props: {
        title: 'Component list',
        count: 29
      },
      slots: {
        default: '<button>Export</button>'
      }
    })

    expect(wrapper.text()).toContain('Component list')
    expect(wrapper.text()).toContain('29')
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
