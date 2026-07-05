import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YDatePickerPanel from './YDatePickerPanel.vue'

describe('YDatePickerPanel', () => {
  it('renders an embedded controlled month grid with accessible metadata', () => {
    const wrapper = mount(YDatePickerPanel, {
      props: {
        id: 'release-panel',
        modelValue: '2026-06-13',
        label: 'Release calendar',
        today: new Date(2026, 5, 1),
        ariaDescribedby: 'release-panel-help',
        error: 'Choose a release date.'
      }
    })

    const label = wrapper.get('.yok-date-picker-panel__label')
    const grid = wrapper.get('[role="grid"]')

    expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(wrapper.get('[role="group"]').attributes('aria-describedby')).toBe('release-panel-help release-panel-error')
    expect(wrapper.get('[role="group"]').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="alert"]').text()).toBe('Choose a release date.')
    expect(wrapper.get('.yok-date-picker-panel__title').text()).toBe('June 2026')
    expect(grid.attributes('aria-label')).toBe('June 2026')
    expect(wrapper.findAll('.yok-date-picker-panel__day')).toHaveLength(42)
    expect(wrapper.get('button[aria-selected="true"]').attributes('aria-label')).toBe('Selected date, June 13, 2026')
  })

  it('emits selected values, shortcuts and panel change payloads', async () => {
    const wrapper = mount(YDatePickerPanel, {
      props: {
        modelValue: '2026-06-13',
        today: new Date(2026, 5, 1),
        shortcuts: [
          { label: 'Tomorrow', value: '2026-06-14', description: 'Next release slot' },
          { label: 'Blocked', value: '2026-06-21', disabled: true }
        ]
      }
    })

    await wrapper.get('button[data-date-panel-date="2026-06-20"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-20'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-06-20'])
    expect(wrapper.emitted('select')?.[0]).toEqual([
      expect.objectContaining({
        value: '2026-06-20',
        inCurrentMonth: true
      })
    ])

    await wrapper.get('[aria-label="Next month"]').trigger('click')

    expect(wrapper.emitted('panel-change')?.[0]).toEqual(['2026-07'])
    expect(wrapper.get('.yok-date-picker-panel__title').text()).toBe('July 2026')

    await wrapper.get('button[aria-label="Tomorrow, Next release slot"]').trigger('click')
    await wrapper.get('button[aria-label="Blocked"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-06-14'])
  })

  it('supports keyboard roving, disabled dates, borderless and disabled state', async () => {
    const wrapper = mount(YDatePickerPanel, {
      props: {
        modelValue: '2026-06-13',
        today: new Date(2026, 5, 1),
        border: false,
        disabledDate: (date: Date) => date.getDay() === 0
      }
    })

    expect(wrapper.classes()).toContain('yok-date-picker-panel--borderless')

    const disabledSunday = wrapper.get('button[data-date-panel-date="2026-06-14"]')

    expect(disabledSunday.attributes('disabled')).toBeDefined()
    await disabledSunday.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('[data-active-date="true"]').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.get('[data-active-date="true"]').attributes('data-date-panel-date')).toBe('2026-06-15')

    await wrapper.setProps({ disabled: true })
    await wrapper.get('button[data-date-panel-date="2026-06-16"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('[aria-label="Next month"]').attributes('disabled')).toBeDefined()
  })
})
