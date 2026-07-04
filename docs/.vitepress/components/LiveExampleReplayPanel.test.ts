import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleReplayPanel from './LiveExampleReplayPanel.vue'

const evidenceItems = [
  {
    key: 'context',
    label: 'Context',
    value: '批量选择',
    detail: 'Light · 自适应',
    passed: true
  },
  {
    key: 'events',
    label: 'Events',
    value: '2 captured',
    detail: 'Data Table@bulkAction / Data Table@selectionChange',
    passed: true
  },
  {
    key: 'assertions',
    label: 'Assertions',
    value: 'Needs contract',
    detail: 'Preview renders, but the component still needs an interaction contract.',
    passed: false
  }
] as const

const replaySteps = [
  {
    key: 'hydrate',
    label: '1. Restore context',
    detail: 'Open the shared state or scenario link.',
    passed: true
  },
  {
    key: 'event',
    label: '4. Replay event',
    detail: '2 captured events: Data Table@bulkAction / Data Table@selectionChange.',
    passed: true
  },
  {
    key: 'assert',
    label: '5. Verify result',
    detail: 'Preview renders, but the component still needs an interaction contract.',
    passed: false
  }
] as const

describe('LiveExampleReplayPanel', () => {
  it('renders replay evidence, steps and emits copy action', async () => {
    const wrapper = mount(LiveExampleReplayPanel, {
      props: {
        eventCount: 2,
        copiedEventRepro: false,
        evidenceItems,
        steps: replaySteps
      }
    })

    const panel = wrapper.get('.live-example-runner__replay')

    expect(panel.attributes('aria-label')).toBe('Interaction replay evidence')
    expect(panel.text()).toContain('Interaction replay')
    expect(panel.text()).toContain('2 events ready')
    expect(panel.text()).toContain('Events')
    expect(panel.text()).toContain('Data Table@bulkAction')
    expect(panel.text()).toContain('Replay event')
    expect(wrapper.findAll('.live-example-runner__replay-grid li')).toHaveLength(3)
    expect(wrapper.findAll('.live-example-runner__replay-steps li')).toHaveLength(3)
    expect(wrapper.findAll('[data-passed="false"]')).toHaveLength(2)

    await wrapper.get('.live-example-runner__replay-copy').trigger('click')

    expect(wrapper.emitted('copy-event-repro')).toHaveLength(1)
  })

  it('renders waiting state and disables copy before events are captured', () => {
    const wrapper = mount(LiveExampleReplayPanel, {
      props: {
        eventCount: 0,
        copiedEventRepro: true,
        evidenceItems,
        steps: replaySteps
      }
    })

    expect(wrapper.text()).toContain('Waiting for event')
    expect(wrapper.get('.live-example-runner__replay-copy').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.live-example-runner__replay-copy').text()).toBe('已复制复现')
  })
})
