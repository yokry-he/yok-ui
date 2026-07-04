import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YMetricCard from './YMetricCard.vue'

describe('YMetricCard', () => {
  it('renders metric information', () => {
    const wrapper = mount(YMetricCard, {
      props: {
        label: 'Components',
        value: 29,
        trend: '+4',
        description: 'Core coverage expanded.'
      }
    })

    expect(wrapper.text()).toContain('Components')
    expect(wrapper.text()).toContain('29')
    expect(wrapper.text()).toContain('+4')
  })
})
