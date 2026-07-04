import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YTimePicker from './YTimePicker.vue'
import {
  createMinuteOptions,
  createTimeOption,
  formatTimeValue,
  normalizeMinuteStep,
  parseTimeValue
} from './time'

describe('time helpers', () => {
  it('parses and formats HH:mm values', () => {
    expect(parseTimeValue('09:30')).toEqual({ hour: 9, minute: 30, value: '09:30' })
    expect(formatTimeValue(7, 5)).toBe('07:05')
    expect(parseTimeValue('24:00')).toBeNull()
    expect(parseTimeValue('9:30')).toBeNull()
  })

  it('normalizes minute steps and creates minute options', () => {
    expect(normalizeMinuteStep(0)).toBe(1)
    expect(normalizeMinuteStep(90)).toBe(60)
    expect(createMinuteOptions(15)).toEqual([0, 15, 30, 45])
  })

  it('marks disabled time options', () => {
    const option = createTimeOption(18, 0, (time) => time.hour >= 18)

    expect(option.disabled).toBe(true)
  })
})

describe('YTimePicker', () => {
  it('opens a time dialog from the input', async () => {
    const wrapper = mount(YTimePicker, {
      props: {
        label: 'Start time',
        modelValue: '09:30',
        minuteStep: 15
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('Choose time')
    expect(wrapper.get('[role="dialog"]').attributes('style')).toContain('position: fixed')
    expect(wrapper.findAll('[role="listbox"]')).toHaveLength(2)
    expect(wrapper.findAll('[role="option"]').some((option) => option.text() === '30')).toBe(true)
  })

  it('selects hour and minute before committing', async () => {
    const wrapper = mount(YTimePicker, {
      props: {
        modelValue: '09:30',
        minuteStep: 15
      }
    })

    await wrapper.get('input').trigger('click')
    await wrapper.findAll('[role="listbox"]')[0].findAll('button')[10].trigger('click')
    await wrapper.findAll('[role="listbox"]')[1].findAll('button')[3].trigger('click')
    await wrapper.get('.yok-time-picker__confirm').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:45'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['10:45'])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('clears a selected time', async () => {
    const wrapper = mount(YTimePicker, {
      props: {
        modelValue: '10:15',
        clearable: true
      }
    })

    await wrapper.get('[aria-label="Clear time"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('announces visibility changes and wires accessible validation metadata', async () => {
    const wrapper = mount(YTimePicker, {
      props: {
        id: 'release-time',
        ariaDescribedby: 'release-time-help',
        error: 'Release time is required.'
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('id')).toBe('release-time')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('release-time-help release-time-error')
    expect(wrapper.get('#release-time-error').attributes('role')).toBe('alert')

    await input.trigger('click')
    await wrapper.get('[aria-label="Close time picker"]').trigger('click')

    expect(wrapper.emitted('visibleChange')).toEqual([[true], [false]])
  })

  it('prevents committing disabled times', async () => {
    const wrapper = mount(YTimePicker, {
      props: {
        modelValue: '18:00',
        minuteStep: 30,
        disabledTime: (time) => time.hour >= 18
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('.yok-time-picker__confirm').attributes('disabled')).toBeDefined()
    await wrapper.get('.yok-time-picker__confirm').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports keyboard open, movement, commit, and escape close', async () => {
    const wrapper = mount(YTimePicker, {
      props: {
        modelValue: '09:00',
        minuteStep: 15
      },
      attachTo: document.body
    })

    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await wrapper.get('[data-active-time="true"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[data-active-time="true"]').trigger('keydown', { key: 'ArrowRight' })
    await wrapper.get('[data-active-time="true"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:15'])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[data-active-time="true"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(YTimePicker, {
      props: {
        disabled: true
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('inherits size and density from config provider while allowing local size overrides', () => {
    const providerWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm', density: 'compact' }, () => h(YTimePicker))
      }
    })

    expect(providerWrapper.get('.yok-time-picker').classes()).toEqual(expect.arrayContaining([
      'yok-time-picker--sm',
      'yok-time-picker--compact'
    ]))

    const overrideWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm' }, () => h(YTimePicker, { size: 'lg' }))
      }
    })

    expect(overrideWrapper.get('.yok-time-picker').classes()).toContain('yok-time-picker--lg')
  })
})
