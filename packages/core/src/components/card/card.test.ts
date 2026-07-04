import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCard from './YCard.vue'

describe('YCard', () => {
  it('renders header and body slots', () => {
    const wrapper = mount(YCard, {
      props: {
        title: 'Core package',
        description: 'Reusable base components.'
      },
      slots: {
        default: 'Card content',
        extra: 'Beta'
      }
    })

    expect(wrapper.text()).toContain('Core package')
    expect(wrapper.text()).toContain('Reusable base components.')
    expect(wrapper.text()).toContain('Card content')
    expect(wrapper.text()).toContain('Beta')
  })

  it('renders footer actions in a dedicated region', () => {
    const wrapper = mount(YCard, {
      props: {
        title: 'Release card'
      },
      slots: {
        default: 'Review docs before publishing.',
        footer: '<button type="button">Open review</button>'
      }
    })

    expect(wrapper.find('.yok-card__footer').exists()).toBe(true)
    expect(wrapper.find('.yok-card__footer button').text()).toBe('Open review')
    expect(wrapper.text()).toContain('Review docs before publishing.')
  })
})
