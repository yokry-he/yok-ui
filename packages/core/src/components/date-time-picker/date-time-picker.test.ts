import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YDateTimePicker from './YDateTimePicker.vue'
import {
  combineDateTimeValue,
  createDateTimeShortcut,
  parseDateTimeValue
} from './date-time'

describe('date-time helpers', () => {
  it('parses and combines YYYY-MM-DD HH:mm values', () => {
    expect(parseDateTimeValue('2026-07-04 20:30')).toEqual({
      date: '2026-07-04',
      time: '20:30',
      value: '2026-07-04 20:30'
    })
    expect(parseDateTimeValue('2026-02-31 20:30')).toBeNull()
    expect(parseDateTimeValue('2026-07-04 24:00')).toBeNull()
    expect(combineDateTimeValue('2026-07-04', '09:05')).toBe('2026-07-04 09:05')
    expect(combineDateTimeValue('', '09:05')).toBe('')
  })

  it('normalizes shortcut values with date and time metadata', () => {
    expect(createDateTimeShortcut({
      label: 'Launch',
      value: '2026-07-04 20:30',
      description: 'Deploy after peak traffic'
    })).toEqual({
      label: 'Launch',
      value: '2026-07-04 20:30',
      description: 'Deploy after peak traffic',
      disabled: false
    })
    expect(createDateTimeShortcut({ label: 'Invalid', value: '2026-07-04' })?.disabled).toBe(true)
  })
})

describe('YDateTimePicker', () => {
  it('opens a combined date and time dialog from the input', async () => {
    const wrapper = mount(YDateTimePicker, {
      props: {
        label: 'Release window',
        modelValue: '2026-07-04 20:30',
        minuteStep: 15
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toContain('Release window')
    expect(wrapper.get('[role="grid"]').attributes('aria-label')).toContain('July')
    expect(wrapper.findAll('[role="listbox"]')).toHaveLength(2)
    expect(wrapper.get('[aria-selected="true"]').attributes('aria-label')).toBe('2026-07-04')
  })

  it('selects date and time before committing one model value', async () => {
    const wrapper = mount(YDateTimePicker, {
      props: {
        modelValue: '2026-06-13 09:30',
        minuteStep: 15
      }
    })

    await wrapper.get('input').trigger('click')
    await wrapper.get('[aria-label="2026-06-20"]').trigger('click')
    await wrapper.findAll('[role="listbox"]')[0].findAll('button')[10].trigger('click')
    await wrapper.findAll('[role="listbox"]')[1].findAll('button')[3].trigger('click')
    await wrapper.get('.yok-date-time-picker__confirm').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-20 10:45'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-06-20 10:45'])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('clears a selected date-time value', async () => {
    const wrapper = mount(YDateTimePicker, {
      props: {
        modelValue: '2026-06-13 09:30',
        clearable: true
      }
    })

    await wrapper.get('[aria-label="Clear date and time"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('wires validation metadata and visibility events', async () => {
    const wrapper = mount(YDateTimePicker, {
      props: {
        id: 'release-at',
        ariaDescribedby: 'release-at-help',
        error: 'Release time is required.'
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('id')).toBe('release-at')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('release-at-help release-at-error')
    expect(wrapper.get('#release-at-error').attributes('role')).toBe('alert')

    await input.trigger('click')
    await wrapper.get('[aria-label="Close date and time picker"]').trigger('click')

    expect(wrapper.emitted('visibleChange')).toEqual([[true], [false]])
  })

  it('respects disabled state and inherits global size and density', async () => {
    const disabledWrapper = mount(YDateTimePicker, {
      props: {
        disabled: true
      }
    })

    await disabledWrapper.get('input').trigger('click')

    expect(disabledWrapper.find('[role="dialog"]').exists()).toBe(false)

    const providerWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm', density: 'compact' }, () => h(YDateTimePicker))
      }
    })

    expect(providerWrapper.get('.yok-date-time-picker').classes()).toEqual(expect.arrayContaining([
      'yok-date-time-picker--sm',
      'yok-date-time-picker--compact'
    ]))
  })
})
