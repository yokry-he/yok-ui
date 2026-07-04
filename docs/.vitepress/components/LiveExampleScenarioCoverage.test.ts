import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleScenarioCoverage from './LiveExampleScenarioCoverage.vue'

describe('LiveExampleScenarioCoverage', () => {
  it('renders scenario coverage summary, item states and copy event', async () => {
    const wrapper = mount(LiveExampleScenarioCoverage, {
      props: {
        summary: {
          coveredCount: 2,
          totalCount: 3,
          score: 67,
          scenarioCount: 5
        },
        items: [
          {
            kind: 'basic',
            label: 'Basic',
            count: 2,
            passed: true,
            detail: '2 states'
          },
          {
            kind: 'keyboard',
            label: 'Keyboard',
            count: 0,
            passed: false,
            detail: 'Missing keyboard flow'
          }
        ],
        copied: false
      }
    })

    expect(wrapper.get('#live-example-scenario-coverage').attributes('aria-label')).toBe('Live example scenario coverage')
    expect(wrapper.text()).toContain('67% scenario kind coverage')
    expect(wrapper.text()).toContain('2/3')
    expect(wrapper.text()).toContain('当前组件登记了 5 个示例状态')
    expect(wrapper.find('[data-covered="true"]').text()).toContain('Covered')
    expect(wrapper.find('[data-covered="false"]').text()).toContain('Gap')

    await wrapper.get('.live-example-runner__coverage-copy').trigger('click')

    expect(wrapper.emitted('copy')).toHaveLength(1)
  })
})
