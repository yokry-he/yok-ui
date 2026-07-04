import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import YCopyButton from './YCopyButton.vue'

describe('YCopyButton', () => {
  it('copies text and emits copied', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    })

    const wrapper = mount(YCopyButton, {
      props: {
        text: 'pnpm add @yok-ui/core'
      }
    })

    await wrapper.get('button').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('pnpm add @yok-ui/core')
    expect(wrapper.emitted('copied')).toHaveLength(1)
  })
})
