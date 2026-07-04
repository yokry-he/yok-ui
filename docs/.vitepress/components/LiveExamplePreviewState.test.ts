import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExamplePreviewState from './LiveExamplePreviewState.vue'

describe('LiveExamplePreviewState', () => {
  it('renders a serialised state snapshot and emits copy action', async () => {
    const wrapper = mount(LiveExamplePreviewState, {
      props: {
        snapshot: '{\\n  "input": "Yok UI Docs"\\n}',
        copied: false
      }
    })

    expect(wrapper.get('.live-example-runner__state-panel').attributes('aria-label')).toBe('Preview state')
    expect(wrapper.text()).toContain('Preview state')
    expect(wrapper.text()).toContain('modelValue')
    expect(wrapper.get('code').text()).toContain('"input": "Yok UI Docs"')

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('copy-preview-state')).toHaveLength(1)
  })

  it('shows copied state in the action label', () => {
    const wrapper = mount(LiveExamplePreviewState, {
      props: {
        snapshot: '{"switch":true}',
        copied: true
      }
    })

    expect(wrapper.get('button').text()).toBe('已复制状态')
  })
})
