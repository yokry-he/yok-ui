import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import YBacktop from './YBacktop.vue'

describe('YBacktop', () => {
  it('emits click and requests scroll to top', async () => {
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollY', { value: 10, configurable: true })
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })

    const wrapper = mount(YBacktop, {
      props: {
        visibilityHeight: 0
      }
    })

    await wrapper.get('button').trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
