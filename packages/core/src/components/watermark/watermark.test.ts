import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YWatermark from './YWatermark.vue'

describe('YWatermark', () => {
  it('renders content with a watermark overlay', () => {
    const wrapper = mount(YWatermark, {
      props: {
        content: 'Yok UI'
      },
      slots: {
        default: '<div>Protected content</div>'
      }
    })

    expect(wrapper.text()).toContain('Protected content')
    expect(wrapper.get('.yok-watermark__overlay').attributes('aria-hidden')).toBe('true')
  })
})
