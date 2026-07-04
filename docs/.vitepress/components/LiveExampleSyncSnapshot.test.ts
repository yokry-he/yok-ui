import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleSyncSnapshot from './LiveExampleSyncSnapshot.vue'

describe('LiveExampleSyncSnapshot', () => {
  it('renders synchronized context and changed prop evidence', async () => {
    const wrapper = mount(LiveExampleSyncSnapshot, {
      props: {
        summaryItems: [
          { label: 'Component', value: 'YButton', detail: '/components/button' },
          { label: 'Scenario', value: 'Primary action', detail: 'Basic · primary' }
        ],
        controlItems: [
          {
            key: 'size',
            label: 'Size',
            valueText: 'large',
            defaultText: 'medium',
            changed: true
          },
          {
            key: 'disabled',
            label: 'Disabled',
            valueText: 'false',
            defaultText: 'false',
            changed: false
          }
        ],
        hasPropControls: true,
        changedControlCount: 1,
        copied: false
      }
    })

    expect(wrapper.get('#live-example-sync-snapshot').attributes('aria-label')).toBe('Live example synchronized context')
    expect(wrapper.text()).toContain('属性、场景、源码和复现包保持同源')
    expect(wrapper.text()).toContain('YButton')
    expect(wrapper.text()).toContain('1 changed')
    expect(wrapper.find('[data-changed="true"]').text()).toContain('Size')
    expect(wrapper.find('[data-changed="false"]').text()).toContain('Disabled')

    await wrapper.get('.live-example-runner__sync-snapshot-copy').trigger('click')

    expect(wrapper.emitted('copy')).toHaveLength(1)
  })

  it('renders the source-first empty state when no prop controls are registered', () => {
    const wrapper = mount(LiveExampleSyncSnapshot, {
      props: {
        summaryItems: [
          { label: 'Component', value: 'Custom source', detail: 'No docs route' }
        ],
        controlItems: [],
        hasPropControls: false,
        changedControlCount: 0,
        copied: true
      }
    })

    expect(wrapper.text()).toContain('Source first')
    expect(wrapper.text()).toContain('当前示例没有登记可视化 props 控件')
    expect(wrapper.get('.live-example-runner__sync-snapshot-copy').text()).toBe('已复制快照')
  })
})
