import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleScenarioTestPlan from './LiveExampleScenarioTestPlan.vue'

describe('LiveExampleScenarioTestPlan', () => {
  it('renders verification steps and emits copy action', async () => {
    const wrapper = mount(LiveExampleScenarioTestPlan, {
      props: {
        title: '主操作',
        steps: [
          {
            title: '1. 选择场景',
            detail: '切换到主操作场景并确认源码同步。'
          },
          {
            title: '2. 验证键盘路径',
            detail: 'Tab 到按钮后使用 Enter 触发。'
          }
        ],
        copied: false
      }
    })

    expect(wrapper.get('#live-example-test-plan').attributes('aria-label')).toBe('Scenario verification plan')
    expect(wrapper.text()).toContain('Scenario test plan')
    expect(wrapper.text()).toContain('主操作')
    expect(wrapper.findAll('.live-example-runner__test-plan-list li')).toHaveLength(2)
    expect(wrapper.text()).toContain('1. 选择场景')
    expect(wrapper.text()).toContain('Tab 到按钮后使用 Enter 触发。')

    await wrapper.get('.live-example-runner__test-plan-copy').trigger('click')

    expect(wrapper.emitted('copy')).toHaveLength(1)
  })

  it('shows copied state after the parent confirms copy completion', () => {
    const wrapper = mount(LiveExampleScenarioTestPlan, {
      props: {
        title: '当前模板',
        steps: [],
        copied: true
      }
    })

    expect(wrapper.get('.live-example-runner__test-plan-copy').text()).toBe('已复制步骤')
  })
})
