import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YLogoCloud from './YLogoCloud.vue'

describe('YLogoCloud', () => {
  it('renders logos', () => {
    const wrapper = mount(YLogoCloud, {
      props: {
        title: 'Trusted by',
        logos: ['Core', 'Product', 'Admin']
      }
    })

    expect(wrapper.text()).toContain('Trusted by')
    expect(wrapper.text()).toContain('Product')
  })
})
