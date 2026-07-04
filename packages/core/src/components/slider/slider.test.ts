import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSlider from './YSlider.vue'
import { getSliderPercent, normalizeSliderRangeValue, normalizeSliderValue, sortSliderMarks } from './slider'

describe('slider helpers', () => {
  it('normalizes values, calculates percent and sorts marks', () => {
    expect(normalizeSliderValue({ value: 13, min: 0, max: 100, step: 5 })).toBe(15)
    expect(normalizeSliderValue({ value: 1.26, min: 0, max: 2, step: 0.1, precision: 1 })).toBe(1.3)
    expect(normalizeSliderValue({ value: -4, min: 0, max: 10, step: 1 })).toBe(0)
    expect(getSliderPercent(25, 0, 100)).toBe(25)
    expect(getSliderPercent(30, 20, 20)).toBe(0)
    expect(sortSliderMarks([
      { value: 100, label: 'Max' },
      { value: 0, label: 'Min' }
    ]).map((mark) => mark.value)).toEqual([0, 100])
  })

  it('normalizes range values with sorting, clamping and step alignment', () => {
    expect(normalizeSliderRangeValue({
      value: [82, 18],
      min: 0,
      max: 100,
      step: 10
    })).toEqual([20, 80])

    expect(normalizeSliderRangeValue({
      value: [-10, 126],
      min: 0,
      max: 100,
      step: 5
    })).toEqual([0, 100])
  })
})

describe('YSlider', () => {
  it('renders label, formatted value and aria attributes', () => {
    const wrapper = mount(YSlider, {
      props: {
        modelValue: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        precision: 1,
        label: 'Opacity'
      }
    })

    const input = wrapper.get('input[type="range"]')

    expect(wrapper.text()).toContain('Opacity')
    expect(wrapper.text()).toContain('0.5')
    expect(input.attributes('aria-valuemin')).toBe('0')
    expect(input.attributes('aria-valuemax')).toBe('1')
    expect(input.attributes('aria-valuenow')).toBe('0.5')
  })

  it('emits input and change values', async () => {
    const wrapper = mount(YSlider, {
      props: {
        modelValue: 10,
        min: 0,
        max: 100,
        step: 5
      }
    })

    const input = wrapper.get('input[type="range"]')

    await input.setValue('24')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([25])
    expect(wrapper.emitted('change')?.[0]).toEqual([25])
  })

  it('supports range mode with two thumbs and ordered tuple emissions', async () => {
    const wrapper = mount(YSlider, {
      props: {
        modelValue: [30, 70],
        range: true,
        min: 0,
        max: 100,
        step: 10,
        label: 'Budget range'
      }
    })

    const inputs = wrapper.findAll('input[type="range"]')

    expect(inputs).toHaveLength(2)
    expect(wrapper.text()).toContain('30 - 70')
    expect(inputs[0].attributes('aria-label')).toBe('Budget range minimum')
    expect(inputs[1].attributes('aria-label')).toBe('Budget range maximum')

    await inputs[0].setValue('86')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[70, 90]])

    await wrapper.setProps({ modelValue: [70, 90] })

    const updatedInputs = wrapper.findAll('input[type="range"]')

    await updatedInputs[1].setValue('14')
    await updatedInputs[1].trigger('change')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[10, 70]])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[10, 70]])
  })

  it('supports vertical orientation with a fixed height and tooltip placement', () => {
    const wrapper = mount(YSlider, {
      props: {
        modelValue: 65,
        vertical: true,
        height: '180px',
        showTooltip: true,
        tooltipPlacement: 'right',
        label: 'Temperature'
      }
    })

    const control = wrapper.get('.yok-slider__control')
    const tooltip = wrapper.get('.yok-slider__tooltip')

    expect(wrapper.classes()).toContain('yok-slider--vertical')
    expect(control.classes()).toContain('yok-slider__control--vertical')
    expect(control.attributes('style')).toContain('--yok-slider-height: 180px')
    expect(tooltip.text()).toBe('65')
    expect(tooltip.attributes('data-placement')).toBe('right')
    expect(tooltip.attributes('aria-hidden')).toBe('true')
  })

  it('renders marks and error state', () => {
    const wrapper = mount(YSlider, {
      props: {
        modelValue: 50,
        marks: [
          { value: 0, label: 'Low' },
          { value: 100, label: 'High' }
        ],
        error: 'Out of range'
      }
    })

    expect(wrapper.text()).toContain('Low')
    expect(wrapper.text()).toContain('High')
    expect(wrapper.get('[role="alert"]').text()).toBe('Out of range')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('supports hidden value and disabled state', () => {
    const wrapper = mount(YSlider, {
      props: {
        modelValue: 20,
        showValue: false,
        disabled: true
      }
    })

    expect(wrapper.text()).not.toContain('20')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })
})
