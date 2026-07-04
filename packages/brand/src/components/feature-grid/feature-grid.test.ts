import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YFeatureGrid from './YFeatureGrid.vue'

describe('YFeatureGrid', () => {
  it('renders feature cards', () => {
    const wrapper = mount(YFeatureGrid, {
      props: {
        features: [
          { title: 'Multi-package', description: 'Core, Product, Admin and Brand.', meta: '01' },
          { title: 'Theme first', description: 'Token based styling.' }
        ]
      }
    })

    expect(wrapper.text()).toContain('Multi-package')
    expect(wrapper.text()).toContain('Theme first')
  })
})
