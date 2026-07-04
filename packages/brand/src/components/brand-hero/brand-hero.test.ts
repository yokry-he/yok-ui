import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YBrandHero from './YBrandHero.vue'

describe('YBrandHero', () => {
  it('renders hero copy and emits actions', async () => {
    const wrapper = mount(YBrandHero, {
      props: {
        eyebrow: 'Yok UI',
        title: 'Fresh cute components',
        description: 'Build personal products with a lighter voice.',
        primaryText: 'Start',
        secondaryText: 'Docs'
      }
    })

    expect(wrapper.text()).toContain('Fresh cute components')
    expect(wrapper.text()).toContain('Build personal products')

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(2)

    await buttons[0].trigger('click')

    expect(wrapper.emitted('primary')).toHaveLength(1)
  })
})
