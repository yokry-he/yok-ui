import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YRate from './YRate.vue'
import { getNextRateValue, getRateItemState, normalizeRateValue } from './rate'

function getRateButton(wrapper: ReturnType<typeof mount>, label: string) {
  const button = wrapper.findAll('button').find((item) => item.attributes('aria-label') === label)

  if (!button) {
    throw new Error(`Missing rate button: ${label}`)
  }

  return button
}

describe('rate helpers', () => {
  it('normalizes values and resolves item states', () => {
    expect(normalizeRateValue({ value: 3.6, count: 5 })).toBe(4)
    expect(normalizeRateValue({ value: 3.6, count: 5, allowHalf: true })).toBe(3.5)
    expect(normalizeRateValue({ value: 8, count: 5 })).toBe(5)
    expect(getRateItemState({ value: 2.5, index: 1 })).toBe('full')
    expect(getRateItemState({ value: 2.5, index: 2 })).toBe('half')
    expect(getRateItemState({ value: 2.5, index: 3 })).toBe('empty')
    expect(getNextRateValue({ currentValue: 3, nextValue: 3, count: 5, clearable: true })).toBe(0)
    expect(getNextRateValue({ currentValue: 3, nextValue: 3, count: 5, clearable: false })).toBe(3)
  })
})

describe('YRate', () => {
  it('renders label, value and radio semantics', () => {
    const wrapper = mount(YRate, {
      props: {
        modelValue: 3,
        label: 'Satisfaction'
      }
    })

    expect(wrapper.text()).toContain('Satisfaction')
    expect(wrapper.text()).toContain('3 of 5')
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-label')).toBe('Satisfaction')
    expect(getRateButton(wrapper, '3 of 5').attributes('aria-checked')).toBe('true')
  })

  it('commits full ratings and clears when clicking the same value', async () => {
    const wrapper = mount(YRate, {
      props: {
        modelValue: 2
      }
    })

    await getRateButton(wrapper, '4 of 5').trigger('click')
    await wrapper.setProps({ modelValue: 4 })
    await getRateButton(wrapper, '4 of 5').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('change')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
    expect(wrapper.emitted('change')?.[1]).toEqual([0])
  })

  it('supports half ratings', async () => {
    const wrapper = mount(YRate, {
      props: {
        modelValue: 0,
        allowHalf: true
      }
    })

    await getRateButton(wrapper, '2.5 of 5').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2.5])
  })

  it('supports keyboard adjustments', async () => {
    const wrapper = mount(YRate, {
      props: {
        modelValue: 2,
        allowHalf: true
      }
    })

    await getRateButton(wrapper, '0.5 of 5').trigger('keydown', { key: 'ArrowRight' })
    await getRateButton(wrapper, '0.5 of 5').trigger('keydown', { key: 'End' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2.5])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])
  })

  it('does not emit when readonly or disabled', async () => {
    const readonlyWrapper = mount(YRate, {
      props: {
        modelValue: 2,
        readonly: true
      }
    })
    const disabledWrapper = mount(YRate, {
      props: {
        modelValue: 2,
        disabled: true
      }
    })

    await getRateButton(readonlyWrapper, '4 of 5').trigger('click')
    await getRateButton(disabledWrapper, '4 of 5').trigger('click')

    expect(readonlyWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(disabledWrapper.get('[role="radiogroup"]').attributes('aria-disabled')).toBe('true')
  })

  it('renders custom icons and error state', () => {
    const wrapper = mount(YRate, {
      props: {
        modelValue: 1,
        icon: '❤',
        voidIcon: '♡',
        error: 'Rating required'
      }
    })

    expect(wrapper.text()).toContain('❤')
    expect(wrapper.text()).toContain('♡')
    expect(wrapper.get('[role="alert"]').text()).toBe('Rating required')
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-invalid')).toBe('true')
  })

  it('renders size variants and copywriting for the selected rating', () => {
    const wrapper = mount(YRate, {
      props: {
        modelValue: 4,
        size: 'large',
        texts: ['Poor', 'Fair', 'Good', 'Great', 'Excellent'],
        label: 'Service'
      }
    })

    expect(wrapper.classes()).toContain('yok-rate--large')
    expect(wrapper.text()).toContain('Great')
    expect(getRateButton(wrapper, '4 of 5, Great').attributes('title')).toBe('Great')
    expect(getRateButton(wrapper, '5 of 5, Excellent').attributes('title')).toBe('Excellent')
  })
})
