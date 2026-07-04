import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YDateRangePicker from './YDateRangePicker.vue'
import { createDateRangeCells, normalizeDateRange, resolveDateRangeShortcut } from './date'

function getButtonByText(wrapper: ReturnType<typeof mount>, text: string) {
  const button = wrapper.findAll('button').find((item) => item.text() === text)

  if (!button) {
    throw new Error(`Missing button: ${text}`)
  }

  return button
}

describe('date range helpers', () => {
  it('normalizes ranges and marks range cells', () => {
    expect(normalizeDateRange('2026-06-20', '2026-06-13')).toEqual(['2026-06-13', '2026-06-20'])

    const cells = createDateRangeCells({
      month: new Date(2026, 5, 1),
      range: ['2026-06-13', '2026-06-20'],
      today: new Date(2026, 5, 15)
    })

    expect(cells.find((cell) => cell.value === '2026-06-13')?.rangeStart).toBe(true)
    expect(cells.find((cell) => cell.value === '2026-06-20')?.rangeEnd).toBe(true)
    expect(cells.find((cell) => cell.value === '2026-06-16')?.inRange).toBe(true)
    expect(cells.find((cell) => cell.value === '2026-06-15')?.today).toBe(true)
  })

  it('resolves date range shortcuts', () => {
    expect(resolveDateRangeShortcut({
      label: 'Sprint',
      value: ['2026-06-20', '2026-06-13']
    })).toEqual(['2026-06-13', '2026-06-20'])
    expect(resolveDateRangeShortcut({
      label: 'Dynamic',
      value: () => ['2026-06-01', '2026-06-07']
    })).toEqual(['2026-06-01', '2026-06-07'])
    expect(resolveDateRangeShortcut({
      label: 'Invalid',
      value: ['2026-02-31', '2026-06-07']
    })).toEqual([])
  })
})

describe('YDateRangePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 12))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens a calendar dialog with a formatted range value', async () => {
    const wrapper = mount(YDateRangePicker, {
      props: {
        label: 'Sprint range',
        modelValue: ['2026-06-13', '2026-06-20']
      }
    })

    expect(wrapper.get('input').element.value).toBe('2026-06-13 to 2026-06-20')

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toContain('date range calendar')
    expect(wrapper.get('[role="dialog"]').attributes('style')).toContain('position: fixed')
    expect(wrapper.findAll('[aria-selected="true"]')).toHaveLength(2)
  })

  it('selects a start date first, then commits a complete range', async () => {
    const wrapper = mount(YDateRangePicker)

    await wrapper.get('input').trigger('click')
    await wrapper.get('[aria-label="2026-06-13"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('[aria-label="2026-06-13"]').classes()).toContain('yok-date-range__day--selected')

    await wrapper.get('[aria-label="2026-06-20"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-06-13', '2026-06-20']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['2026-06-13', '2026-06-20']])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('normalizes reversed selection order', async () => {
    const wrapper = mount(YDateRangePicker)

    await wrapper.get('input').trigger('click')
    await wrapper.get('[aria-label="2026-06-20"]').trigger('click')
    await wrapper.get('[aria-label="2026-06-13"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-06-13', '2026-06-20']])
  })

  it('clears a selected range', async () => {
    const wrapper = mount(YDateRangePicker, {
      props: {
        modelValue: ['2026-06-13', '2026-06-20'],
        clearable: true
      }
    })

    await wrapper.get('[aria-label="Clear date range"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('announces visibility changes and wires accessible validation metadata', async () => {
    const wrapper = mount(YDateRangePicker, {
      props: {
        id: 'booking-window',
        ariaDescribedby: 'booking-window-help',
        error: 'Booking window is required.'
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('id')).toBe('booking-window')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('booking-window-help booking-window-error')
    expect(wrapper.get('#booking-window-error').attributes('role')).toBe('alert')

    await input.trigger('click')
    await wrapper.get('[aria-label="Close date range calendar"]').trigger('click')

    expect(wrapper.emitted('visibleChange')).toEqual([[true], [false]])
  })

  it('selects range shortcuts and closes the panel', async () => {
    const wrapper = mount(YDateRangePicker, {
      props: {
        shortcuts: [
          { label: 'Sprint', value: ['2026-06-20', '2026-06-13'] },
          { label: 'Blocked', value: ['2026-06-14', '2026-06-20'] },
          { label: 'Disabled', value: ['2026-06-01', '2026-06-07'], disabled: true }
        ],
        disabledDate: (date: Date) => date.getDay() === 0
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('[aria-label="Date range shortcuts"]').exists()).toBe(true)
    expect(getButtonByText(wrapper, 'Blocked').attributes('disabled')).toBeDefined()
    expect(getButtonByText(wrapper, 'Disabled').attributes('disabled')).toBeDefined()

    await getButtonByText(wrapper, 'Sprint').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-06-13', '2026-06-20']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['2026-06-13', '2026-06-20']])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders range shortcut time presets with accessible descriptions', async () => {
    const wrapper = mount(YDateRangePicker, {
      props: {
        shortcuts: [
          {
            label: 'Launch freeze',
            value: ['2026-06-18', '2026-06-20'],
            time: '18:00-09:00',
            description: 'Hold release changes across the weekend'
          }
        ]
      }
    })

    await wrapper.get('input').trigger('click')

    const shortcut = wrapper.get('[aria-label="Launch freeze, 18:00-09:00, Hold release changes across the weekend"]')

    expect(shortcut.classes()).toContain('yok-date-range__shortcut--detailed')
    expect(shortcut.get('.yok-date-range__shortcut-time').text()).toBe('18:00-09:00')
    expect(shortcut.get('.yok-date-range__shortcut-description').text()).toBe('Hold release changes across the weekend')

    await shortcut.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-06-18', '2026-06-20']])
  })

  it('prevents selecting disabled dates', async () => {
    const wrapper = mount(YDateRangePicker, {
      props: {
        disabledDate: (date: Date) => date.getDay() === 0
      }
    })

    await wrapper.get('input').trigger('click')

    const disabledSunday = wrapper.get('[aria-label="2026-06-14"]')

    expect(disabledSunday.attributes('disabled')).toBeDefined()
    await disabledSunday.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports keyboard navigation and selection', async () => {
    const wrapper = mount(YDateRangePicker, {
      props: {
        modelValue: ['2026-06-13', '2026-06-20']
      },
      attachTo: document.body
    })

    await wrapper.get('input').trigger('click')
    await wrapper.get('[aria-label="Next month"]').trigger('click')

    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toContain('July')

    await wrapper.get('[data-active-date="true"]').trigger('keydown', { key: 'Enter' })
    await wrapper.get('[data-active-date="true"]').trigger('keydown', { key: 'ArrowRight' })
    await wrapper.get('[data-active-date="true"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-07-01', '2026-07-02']])
    wrapper.unmount()
  })

  it('opens from keyboard input shortcuts', async () => {
    const wrapper = mount(YDateRangePicker)
    const preventDefault = vi.fn()

    await wrapper.get('input').trigger('keydown', {
      key: 'ArrowDown',
      preventDefault
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('inherits size and density from config provider while allowing local size overrides', () => {
    const providerWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm', density: 'compact' }, () => h(YDateRangePicker))
      }
    })

    expect(providerWrapper.get('.yok-date-range').classes()).toEqual(expect.arrayContaining([
      'yok-date-range--sm',
      'yok-date-range--compact'
    ]))

    const overrideWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm' }, () => h(YDateRangePicker, { size: 'lg' }))
      }
    })

    expect(overrideWrapper.get('.yok-date-range').classes()).toContain('yok-date-range--lg')
  })
})
