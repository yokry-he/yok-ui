import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleScenarioStrip from './LiveExampleScenarioStrip.vue'
import type { LiveExampleScenario, LiveExampleScenarioKind } from '../data/liveExamples'

const scenarioKindLabels: Record<LiveExampleScenarioKind, string> = {
  basic: '基础态',
  controlled: '受控',
  copy: '复制',
  disabled: '禁用',
  empty: '空态',
  loading: '加载',
  error: '错误',
  multi: '多选/批量',
  keyboard: '键盘',
  responsive: '响应式',
  remote: '远程',
  filter: '筛选',
  search: '搜索',
  virtual: '虚拟',
  summary: '摘要',
  layout: '布局',
  composition: '组合'
}

const scenarios: LiveExampleScenario[] = [
  {
    key: 'primary-action-button',
    label: '主操作',
    kind: 'basic',
    description: 'Primary action with stable copy.'
  },
  {
    key: 'keyboard-button',
    label: '键盘触发',
    kind: 'keyboard',
    description: 'Keyboard users can submit with Enter.'
  }
]

describe('LiveExampleScenarioStrip', () => {
  it('renders scenario matrix and emits copy/apply actions', async () => {
    const wrapper = mount(LiveExampleScenarioStrip, {
      props: {
        scenarios,
        activeScenarioKey: 'keyboard-button',
        activeScenarioLabel: '键盘触发',
        scenarioKindLabels,
        copiedScenarioLink: false
      }
    })

    expect(wrapper.get('#live-example-scenarios').attributes('aria-label')).toBe('Workflow scenario switcher')
    expect(wrapper.text()).toContain('2 个真实场景')
    expect(wrapper.text()).toContain('当前：键盘触发')
    expect(wrapper.findAll('.live-example-runner__scenario-grid button')).toHaveLength(2)
    expect(wrapper.findAll('.live-example-runner__scenario-grid button')[0].attributes('aria-pressed')).toBe('false')
    expect(wrapper.findAll('.live-example-runner__scenario-grid button')[1].attributes('aria-pressed')).toBe('true')

    await wrapper.findAll('.live-example-runner__scenario-grid button')[0].trigger('click')
    await wrapper.get('.live-example-runner__scenario-copy').trigger('click')

    expect(wrapper.emitted('apply-scenario')).toEqual([[scenarios[0]]])
    expect(wrapper.emitted('copy-scenario-link')).toHaveLength(1)
  })

  it('shows share prompt and disables copy before a scenario is active', () => {
    const wrapper = mount(LiveExampleScenarioStrip, {
      props: {
        scenarios,
        activeScenarioKey: '',
        activeScenarioLabel: '',
        scenarioKindLabels,
        copiedScenarioLink: true
      }
    })

    expect(wrapper.text()).toContain('选择场景后可分享')
    expect(wrapper.get('.live-example-runner__scenario-copy').attributes('disabled')).toBe('')
    expect(wrapper.get('.live-example-runner__scenario-copy').text()).toBe('已复制链接')
  })
})
