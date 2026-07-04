import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleEventLog from './LiveExampleEventLog.vue'

const eventLogs = [
  {
    id: 1,
    component: 'YButton',
    event: 'click',
    payload: '{"label":"Create"}',
    rawPayloads: [{ label: 'Create' }]
  },
  {
    id: 2,
    component: 'YSelect',
    event: 'update:modelValue',
    payload: '"product"',
    rawPayloads: ['product']
  }
] as const

describe('LiveExampleEventLog', () => {
  it('renders captured events and emits copy and clear actions', async () => {
    const wrapper = mount(LiveExampleEventLog, {
      props: {
        eventLogs,
        copiedEventRepro: false
      }
    })

    expect(wrapper.get('#live-example-event-log').attributes('aria-live')).toBe('polite')
    expect(wrapper.text()).toContain('Event log')
    expect(wrapper.text()).toContain('2 captured')
    expect(wrapper.text()).toContain('YButton')
    expect(wrapper.text()).toContain('@click')
    expect(wrapper.text()).toContain('YSelect')
    expect(wrapper.text()).toContain('@update:modelValue')
    expect(wrapper.findAll('ol li')).toHaveLength(2)

    await wrapper.get('.live-example-runner__event-repro-copy').trigger('click')
    await wrapper.findAll('.live-example-runner__event-actions button')[1].trigger('click')

    expect(wrapper.emitted('copy-event-repro')).toHaveLength(1)
    expect(wrapper.emitted('clear-event-log')).toHaveLength(1)
  })

  it('renders waiting state and disables actions when no events are captured', () => {
    const wrapper = mount(LiveExampleEventLog, {
      props: {
        eventLogs: [],
        copiedEventRepro: true
      }
    })

    expect(wrapper.text()).toContain('Waiting')
    expect(wrapper.text()).toContain('点击按钮、切换输入、选择菜单或触发组件事件后')
    expect(wrapper.find('ol').exists()).toBe(false)
    expect(wrapper.findAll('.live-example-runner__event-actions button').every((button) => button.attributes('disabled') !== undefined)).toBe(true)
    expect(wrapper.get('.live-example-runner__event-repro-copy').text()).toBe('已复制复现')
  })
})
