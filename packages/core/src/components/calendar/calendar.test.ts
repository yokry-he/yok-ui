import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCalendar from './YCalendar.vue'

describe('YCalendar', () => {
  it('renders a controlled month grid and emits the selected date', async () => {
    const wrapper = mount(YCalendar, {
      props: {
        modelValue: '2026-06-18',
        today: new Date(2026, 5, 1)
      }
    })

    expect(wrapper.get('.yok-calendar__title').text()).toBe('June 2026')
    expect(wrapper.findAll('.yok-calendar__weekday')).toHaveLength(7)
    expect(wrapper.findAll('.yok-calendar__day')).toHaveLength(42)
    expect(wrapper.get('button[aria-pressed="true"]').attributes('aria-label')).toBe('Selected date, June 18, 2026')

    await wrapper.get('button[data-calendar-date="2026-06-24"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-24'])
    expect(wrapper.emitted('select')?.[0]).toEqual([
      expect.objectContaining({
        value: '2026-06-24',
        inCurrentMonth: true
      })
    ])
  })

  it('navigates between months without losing the selected value', async () => {
    const wrapper = mount(YCalendar, {
      props: {
        modelValue: '2026-06-18',
        today: new Date(2026, 5, 1)
      }
    })

    await wrapper.get('[data-calendar-action="next-month"]').trigger('click')

    expect(wrapper.get('.yok-calendar__title').text()).toBe('July 2026')
    expect(wrapper.emitted('panel-change')?.[0]).toEqual(['2026-07'])

    await wrapper.get('[data-calendar-action="today"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-06-01'])
    expect(wrapper.emitted('select')?.at(-1)).toEqual([
      expect.objectContaining({
        value: '2026-06-01',
        today: true
      })
    ])
  })

  it('prevents disabled dates from being selected', async () => {
    const wrapper = mount(YCalendar, {
      props: {
        modelValue: '2026-06-18',
        disabledDate: (date: Date) => date.getDay() === 0,
        today: new Date(2026, 5, 1)
      }
    })

    const disabledSunday = wrapper.get('button[data-calendar-date="2026-06-21"]')

    expect(disabledSunday.attributes('disabled')).toBeDefined()

    await disabledSunday.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('exposes date cell data to the default slot', () => {
    const wrapper = mount(YCalendar, {
      props: {
        modelValue: '2026-06-18',
        today: new Date(2026, 5, 1)
      },
      slots: {
        dateCell: `<template #dateCell="{ cell }">
          <span class="custom-cell">{{ cell.value }} {{ cell.selected ? 'selected' : 'idle' }}</span>
        </template>`
      }
    })

    expect(wrapper.findAll('.custom-cell')).toHaveLength(42)
    expect(wrapper.text()).toContain('2026-06-18 selected')
  })
})
