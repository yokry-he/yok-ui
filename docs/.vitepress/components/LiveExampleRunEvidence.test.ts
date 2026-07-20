import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleRunEvidence from './LiveExampleRunEvidence.vue'

describe('LiveExampleRunEvidence', () => {
  it('renders ready count and evidence states', () => {
    const wrapper = mount(LiveExampleRunEvidence, {
      props: {
        items: [
          {
            key: 'preview',
            label: 'Preview',
            value: 'Stable',
            detail: '12 lines',
            passed: true
          },
          {
            key: 'a11y',
            label: 'A11y',
            value: 'Needs contract',
            detail: '当前示例还没有登记交互契约。',
            passed: false
          },
          {
            key: 'export',
            label: 'Export',
            value: 'Repro ready',
            detail: 'Report and source repro are aligned.',
            passed: true
          }
        ]
      }
    })

    expect(wrapper.get('.live-example-runner__run-evidence').attributes('aria-label')).toBe('Live example run evidence')
    expect(wrapper.text()).toContain('Run evidence')
    expect(wrapper.text()).toContain('2/3 checks ready')
    expect(wrapper.findAll('.live-example-runner__run-evidence-item')).toHaveLength(3)
    expect(wrapper.findAll('[data-passed="true"]')).toHaveLength(2)
    expect(wrapper.find('[data-passed="false"]').text()).toContain('Needs contract')
  })
})
