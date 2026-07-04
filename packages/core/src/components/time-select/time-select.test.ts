import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YTimeSelect from './YTimeSelect.vue'
import {
  createTimeSelectOptions,
  formatTimeSelectLabel,
  parseTimeSelectStep,
  timeSelectValueToMinutes
} from './time-select'

describe('time select helpers', () => {
  it('creates fixed time options from start, end and step', () => {
    expect(parseTimeSelectStep('00:15')).toBe(15)
    expect(timeSelectValueToMinutes('08:30')).toBe(510)
    expect(createTimeSelectOptions({ start: '08:30', end: '09:15', step: '00:15' }).map((option) => option.value))
      .toEqual(['08:30', '08:45', '09:00', '09:15'])
  })

  it('formats labels and disables options outside linked range bounds', () => {
    const options = createTimeSelectOptions({
      start: '08:30',
      end: '10:00',
      step: '00:30',
      minTime: '09:00',
      maxTime: '10:00',
      format: 'hh:mm A'
    })

    expect(formatTimeSelectLabel('13:05', 'hh:mm A')).toBe('01:05 PM')
    expect(options.map((option) => ({ value: option.value, label: option.label, disabled: option.disabled }))).toEqual([
      { value: '08:30', label: '08:30 AM', disabled: true },
      { value: '09:00', label: '09:00 AM', disabled: true },
      { value: '09:30', label: '09:30 AM', disabled: false },
      { value: '10:00', label: '10:00 AM', disabled: true }
    ])
  })
})

describe('YTimeSelect', () => {
  it('renders fixed time options and emits selected HH:mm value', async () => {
    const wrapper = mount(YTimeSelect, {
      props: {
        label: 'Start time',
        modelValue: '',
        start: '08:30',
        end: '09:00',
        step: '00:15'
      }
    })

    await wrapper.get('[role="combobox"]').trigger('click')

    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['08:30', '08:45', '09:00'])

    await wrapper.findAll('[role="option"]')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['08:45'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['08:45'])
  })

  it('passes validation, clear, visibility and disabled range behavior through the select contract', async () => {
    const wrapper = mount(YTimeSelect, {
      props: {
        id: 'release-start',
        modelValue: '09:00',
        clearable: true,
        ariaDescribedby: 'release-start-help',
        error: 'Start time is required.',
        start: '08:30',
        end: '10:00',
        step: '00:30',
        minTime: '09:00'
      }
    })

    const combobox = wrapper.get('[role="combobox"]')

    expect(combobox.attributes('id')).toBe('release-start')
    expect(combobox.attributes('aria-invalid')).toBe('true')
    expect(combobox.attributes('aria-describedby')).toBe('release-start-help')

    await combobox.trigger('click')

    expect(wrapper.emitted('visibleChange')).toEqual([[true]])
    expect(wrapper.findAll('[role="option"]')[0].attributes('aria-disabled')).toBe('true')
    expect(wrapper.findAll('[role="option"]')[1].attributes('aria-disabled')).toBe('true')

    await wrapper.get('[aria-label="Clear selection"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
