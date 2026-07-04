import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YInputNumber from './YInputNumber.vue'
import {
  clampNumber,
  formatInputNumberValue,
  normalizeInputNumberValue,
  parseInputNumberValue,
  stepInputNumberValue
} from './input-number'

describe('input number helpers', () => {
  it('parses, clamps, formats and steps values', () => {
    expect(parseInputNumberValue('12.5')).toBe(12.5)
    expect(parseInputNumberValue('')).toBeNull()
    expect(parseInputNumberValue('abc')).toBeNull()
    expect(clampNumber(12, 1, 10)).toBe(10)
    expect(normalizeInputNumberValue({ value: 1.239, precision: 2 })).toBe(1.24)
    expect(stepInputNumberValue({ value: 0.2, step: 0.1, direction: 1 })).toBe(0.3)
    expect(formatInputNumberValue(1.2, 2)).toBe('1.20')
  })
})

describe('YInputNumber', () => {
  it('renders label, value and error state', () => {
    const wrapper = mount(YInputNumber, {
      props: {
        modelValue: 4,
        label: 'Quantity',
        error: 'Too low'
      }
    })

    const input = wrapper.get('input')

    expect(wrapper.text()).toContain('Quantity')
    expect(input.element.value).toBe('4')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="alert"]').text()).toBe('Too low')
  })

  it('emits transient input values and normalizes on blur', async () => {
    const wrapper = mount(YInputNumber, {
      props: {
        modelValue: 1,
        min: 0,
        max: 10,
        precision: 1
      }
    })

    const input = wrapper.get('input')

    await input.setValue('2.26')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2.26])

    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2.3])
    expect(wrapper.emitted('change')?.[0]).toEqual([2.3])
  })

  it('steps with buttons and respects max/min', async () => {
    const wrapper = mount(YInputNumber, {
      props: {
        modelValue: 9,
        min: 0,
        max: 10,
        step: 2
      }
    })

    await wrapper.get('[aria-label="Increase value"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])

    await wrapper.setProps({ modelValue: 0 })
    expect(wrapper.get('[aria-label="Decrease value"]').attributes('disabled')).toBeDefined()
  })

  it('supports keyboard stepping', async () => {
    const wrapper = mount(YInputNumber, {
      props: {
        modelValue: 2,
        step: 0.5,
        precision: 1
      }
    })

    await wrapper.get('input').trigger('keydown', { key: 'ArrowUp' })
    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2.5])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([1.5])
  })

  it('can hide controls and disable interaction', () => {
    const wrapper = mount(YInputNumber, {
      props: {
        modelValue: 2,
        controls: false,
        disabled: true
      }
    })

    expect(wrapper.find('[aria-label="Increase value"]').exists()).toBe(false)
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('uses config provider size and density when no local size is provided', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg',
        density: 'compact'
      },
      slots: {
        default: () => h(YInputNumber, { modelValue: 6, label: 'Quantity' })
      }
    })

    const inputNumber = wrapper.getComponent(YInputNumber)

    expect(inputNumber.classes()).toContain('yok-input-number--lg')
    expect(inputNumber.classes()).toContain('yok-input-number--compact')
  })

  it('lets local size override config provider size', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg'
      },
      slots: {
        default: () => h(YInputNumber, { modelValue: 2, size: 'sm' })
      }
    })

    expect(wrapper.getComponent(YInputNumber).classes()).toContain('yok-input-number--sm')
  })
})
