import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExamplePropsPanel from './LiveExamplePropsPanel.vue'

const controls = [
  {
    key: 'variant',
    label: 'Variant',
    type: 'select',
    defaultValue: 'primary',
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' }
    ]
  },
  {
    key: 'disabled',
    label: 'Disabled',
    type: 'boolean',
    defaultValue: false,
    helper: 'Disable action'
  },
  {
    key: 'count',
    label: 'Count',
    type: 'range',
    defaultValue: 4,
    min: 1,
    max: 8,
    step: 1
  },
  {
    key: 'label',
    label: 'Label',
    type: 'text',
    defaultValue: 'Create'
  }
] as const

describe('LiveExamplePropsPanel', () => {
  it('renders controls and emits panel actions and value updates', async () => {
    const wrapper = mount(LiveExamplePropsPanel, {
      props: {
        title: 'Button controls',
        description: 'Tune the live button example.',
        controls,
        controlState: {
          variant: 'primary',
          disabled: false,
          count: 4,
          label: 'Create'
        },
        copiedStateLink: false
      }
    })

    expect(wrapper.get('.live-example-runner__prop-panel').attributes('aria-label')).toBe('Live example props panel')
    expect(wrapper.text()).toContain('Button controls')
    expect(wrapper.text()).toContain('Tune the live button example.')
    expect(wrapper.findAll('.live-example-runner__control')).toHaveLength(4)

    await wrapper.get('select').setValue('secondary')
    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('input[type="range"]').setValue(6)
    await wrapper.get('input[type="text"]').setValue('Save')
    await wrapper.get('.live-example-runner__state-link-copy').trigger('click')
    await wrapper.findAll('.live-example-runner__prop-actions button')[1].trigger('click')

    expect(wrapper.emitted('update-control')?.map((event) => event[0])).toEqual([
      { control: controls[0], value: 'secondary' },
      { control: controls[1], value: true },
      { control: controls[2], value: 6 },
      { control: controls[3], value: 'Save' }
    ])
    expect(wrapper.emitted('copy-state-link')).toHaveLength(1)
    expect(wrapper.emitted('reset-controls')).toHaveLength(1)
  })

  it('renders the source-first empty state when no controls are registered', () => {
    const wrapper = mount(LiveExamplePropsPanel, {
      props: {
        title: 'Source first',
        description: '当前示例暂未登记可视化属性面板，仍可直接编辑 SFC 源码并运行预览。',
        controls: [],
        controlState: {},
        copiedStateLink: true
      }
    })

    expect(wrapper.get('.live-example-runner__prop-panel').classes()).toContain('live-example-runner__prop-panel--empty')
    expect(wrapper.text()).toContain('Source first')
    expect(wrapper.text()).toContain('当前示例暂未登记可视化属性面板')
    expect(wrapper.find('.live-example-runner__prop-actions').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__controls').exists()).toBe(false)
  })
})
