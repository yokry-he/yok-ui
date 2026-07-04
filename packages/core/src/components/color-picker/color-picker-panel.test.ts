import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YColorPickerPanel from './YColorPickerPanel.vue'

describe('YColorPickerPanel', () => {
  it('renders an embedded color panel with normalized value and preset buttons', () => {
    const wrapper = mount(YColorPickerPanel, {
      props: {
        modelValue: '#14b8a6',
        label: 'Theme color',
        presets: ['#14b8a6', '#38bdf8']
      }
    })

    const label = wrapper.get('.yok-color-picker-panel__label')

    expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(wrapper.text()).toContain('Theme color')
    expect(wrapper.text()).toContain('#14B8A6')
    expect(wrapper.get('button[aria-label="Select #14B8A6"]').attributes('aria-pressed')).toBe('true')
  })

  it('emits normalized values from native input, text input and presets', async () => {
    const wrapper = mount(YColorPickerPanel, {
      props: {
        modelValue: '#14B8A6',
        presets: ['#14B8A6', '#38BDF8']
      }
    })

    await wrapper.get('input[type="color"]').setValue('#38bdf8')
    await wrapper.get('input[type="text"]').setValue('#f47')
    await wrapper.get('button[aria-label="Select #14B8A6"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      ['#38BDF8'],
      ['#FF4477'],
      ['#14B8A6']
    ])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['#14B8A6'])
  })

  it('supports alpha, clear, disabled and validation metadata', async () => {
    const wrapper = mount(YColorPickerPanel, {
      props: {
        id: 'brand-panel',
        modelValue: '#14b8a680',
        showAlpha: true,
        clearable: true,
        ariaDescribedby: 'brand-panel-help',
        error: 'Choose a brand color.'
      }
    })

    expect(wrapper.get('input[type="text"]').attributes('id')).toBe('brand-panel')
    expect(wrapper.get('input[type="text"]').attributes('aria-describedby')).toBe('brand-panel-help brand-panel-error')
    expect(wrapper.get('[role="alert"]').text()).toBe('Choose a brand color.')
    expect(wrapper.text()).toContain('#14B8A680')

    await wrapper.get('button[aria-label="Clear color"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)

    const disabledWrapper = mount(YColorPickerPanel, {
      props: {
        modelValue: '#14B8A6',
        disabled: true
      }
    })

    await disabledWrapper.get('button[aria-label="Select #38BDF8"]').trigger('click')

    expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(disabledWrapper.get('input[type="color"]').attributes('disabled')).toBeDefined()
  })
})
