import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleInteractionContract from './LiveExampleInteractionContract.vue'

describe('LiveExampleInteractionContract', () => {
  it('renders verified interaction evidence when a contract exists', () => {
    const wrapper = mount(LiveExampleInteractionContract, {
      props: {
        summary: {
          label: 'Verified contract',
          value: '1/1 verified',
          detail: 'button action / keyboard trigger'
        },
        checks: [
          {
            label: 'Keyboard',
            value: '2 paths',
            detail: 'Tab reaches trigger；Enter activates trigger'
          },
          {
            label: 'Semantics',
            value: '3 tokens',
            detail: 'button / aria-disabled / focus-ring'
          }
        ],
        hasContract: true
      }
    })

    expect(wrapper.get('#live-example-interaction-contract').attributes('aria-label')).toBe('Interaction contract evidence')
    expect(wrapper.get('#live-example-interaction-contract').attributes('data-has-contract')).toBe('true')
    expect(wrapper.text()).toContain('Verified contract')
    expect(wrapper.text()).toContain('1/1 verified')
    expect(wrapper.findAll('.live-example-runner__contract-check')).toHaveLength(2)
    expect(wrapper.text()).toContain('Tab reaches trigger')
    expect(wrapper.text()).toContain('button / aria-disabled / focus-ring')
  })

  it('renders the pending contract guidance when no contract is linked', () => {
    const wrapper = mount(LiveExampleInteractionContract, {
      props: {
        summary: {
          label: 'Contract pending',
          value: 'No contract',
          detail: '当前示例还没有登记交互契约。'
        },
        checks: [],
        hasContract: false
      }
    })

    expect(wrapper.get('#live-example-interaction-contract').attributes('data-has-contract')).toBe('false')
    expect(wrapper.find('.live-example-runner__contract-grid').exists()).toBe(false)
    expect(wrapper.text()).toContain('Contract pending')
    expect(wrapper.text()).toContain('先在 interactionContracts 中登记键盘、焦点、语义、文档和测试证据')
  })
})
