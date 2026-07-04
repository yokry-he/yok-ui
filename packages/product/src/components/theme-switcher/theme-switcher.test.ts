import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YThemeSwitcher from './YThemeSwitcher.vue'

describe('YThemeSwitcher', () => {
  it('emits selected theme', async () => {
    const wrapper = mount(YThemeSwitcher, {
      props: {
        modelValue: 'yok-light'
      }
    })

    await wrapper.get('[data-theme-option="yok-clean"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yok-clean'])
  })

  it('renders the candy theme from shared metadata', () => {
    const wrapper = mount(YThemeSwitcher, {
      props: {
        modelValue: 'yok-candy'
      }
    })

    expect(wrapper.get('[data-theme-option="yok-candy"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.text()).toContain('Candy')
  })
})
