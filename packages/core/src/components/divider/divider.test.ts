import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YDivider from './YDivider.vue'

describe('YDivider', () => {
  it('renders optional label', () => {
    const wrapper = mount(YDivider, {
      props: {
        label: 'Basics'
      }
    })

    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.text()).toContain('Basics')
  })
})
