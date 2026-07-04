import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YProfileCard from './YProfileCard.vue'

describe('YProfileCard', () => {
  it('renders profile information', () => {
    const wrapper = mount(YProfileCard, {
      props: {
        name: 'Yok',
        role: 'Component designer',
        bio: 'Building fresh cute Vue components.',
        tags: ['Vue 3', 'Design System']
      }
    })

    expect(wrapper.text()).toContain('Yok')
    expect(wrapper.text()).toContain('Component designer')
    expect(wrapper.text()).toContain('Vue 3')
  })
})
