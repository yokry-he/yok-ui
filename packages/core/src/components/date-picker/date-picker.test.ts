import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YDatePicker from './YDatePicker.vue'
import { createCalendarCells, formatDateValue, parseDateValue, resolveDateShortcut } from './date'

function getButtonByText(wrapper: ReturnType<typeof mount>, text: string) {
  const button = wrapper.findAll('button').find((item) => item.text() === text)

  if (!button) {
    throw new Error(`Missing button: ${text}`)
  }

  return button
}

describe('date helpers', () => {
  it('parses and formats valid date values', () => {
    const date = parseDateValue('2026-06-13')

    expect(date?.getFullYear()).toBe(2026)
    expect(date?.getMonth()).toBe(5)
    expect(date?.getDate()).toBe(13)
    expect(formatDateValue(date as Date)).toBe('2026-06-13')
    expect(parseDateValue('2026-02-31')).toBeNull()
    expect(parseDateValue('06/13/2026')).toBeNull()
  })

  it('creates a 42-cell calendar grid', () => {
    const cells = createCalendarCells({
      month: new Date(2026, 5, 1),
      selectedDate: new Date(2026, 5, 13),
      today: new Date(2026, 5, 13)
    })

    expect(cells).toHaveLength(42)
    expect(cells[0].value).toBe('2026-05-31')
    expect(cells.find((cell) => cell.value === '2026-06-13')?.selected).toBe(true)
    expect(cells.find((cell) => cell.value === '2026-06-13')?.today).toBe(true)
  })

  it('resolves date shortcut values', () => {
    expect(resolveDateShortcut({ label: 'Today', value: '2026-06-13' })).toBe('2026-06-13')
    expect(resolveDateShortcut({ label: 'Dynamic', value: () => '2026-06-14' })).toBe('2026-06-14')
    expect(resolveDateShortcut({ label: 'Invalid', value: '2026-02-31' })).toBe('')
  })
})

describe('YDatePicker', () => {
  it('opens a calendar dialog from the input', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        label: 'Release date',
        modelValue: '2026-06-13'
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toContain('June')
    expect(wrapper.get('[role="dialog"]').attributes('style')).toContain('position: fixed')
    expect(wrapper.get('[aria-selected="true"]').attributes('aria-label')).toBe('2026-06-13')
  })

  it('selects a date and closes the panel', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        modelValue: '2026-06-13'
      }
    })

    await wrapper.get('input').trigger('click')
    await wrapper.find('[aria-label="2026-06-20"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-20'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-06-20'])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('clears a selected date', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        modelValue: '2026-06-13',
        clearable: true
      }
    })

    await wrapper.get('[aria-label="Clear date"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('announces visibility changes and wires accessible validation metadata', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        id: 'release-date',
        ariaDescribedby: 'release-date-help',
        error: 'Release date is required.'
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('id')).toBe('release-date')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('release-date-help release-date-error')
    expect(wrapper.get('#release-date-error').attributes('role')).toBe('alert')

    await input.trigger('click')
    await wrapper.get('[aria-label="Close calendar"]').trigger('click')

    expect(wrapper.emitted('visibleChange')).toEqual([[true], [false]])
  })

  it('selects date shortcuts and closes the panel', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        modelValue: '2026-06-13',
        shortcuts: [
          { label: 'Today', value: '2026-06-15' },
          { label: 'Disabled', value: '2026-06-15', disabled: true },
          { label: 'Weekend', value: '2026-06-14' }
        ],
        disabledDate: (date: Date) => date.getDay() === 0
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('[aria-label="Date shortcuts"]').exists()).toBe(true)
    expect(getButtonByText(wrapper, 'Disabled').attributes('disabled')).toBeDefined()
    expect(getButtonByText(wrapper, 'Weekend').attributes('disabled')).toBeDefined()

    await getButtonByText(wrapper, 'Today').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-15'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-06-15'])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders shortcut time presets with accessible descriptions', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        shortcuts: [
          {
            label: 'Release window',
            value: '2026-06-18',
            time: '20:30',
            description: 'Deploy after traffic drops'
          }
        ]
      }
    })

    await wrapper.get('input').trigger('click')

    const shortcut = wrapper.get('[aria-label="Release window, 20:30, Deploy after traffic drops"]')

    expect(shortcut.classes()).toContain('yok-date-picker__shortcut--detailed')
    expect(shortcut.get('.yok-date-picker__shortcut-time').text()).toBe('20:30')
    expect(shortcut.get('.yok-date-picker__shortcut-description').text()).toBe('Deploy after traffic drops')

    await shortcut.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-18'])
  })

  it('prevents selecting disabled dates', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        modelValue: '2026-06-13',
        disabledDate: (date: Date) => date.getDay() === 0
      }
    })

    await wrapper.get('input').trigger('click')

    const disabledSunday = wrapper.get('[aria-label="2026-06-14"]')

    expect(disabledSunday.attributes('disabled')).toBeDefined()
    await disabledSunday.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('switches months and supports keyboard navigation', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        modelValue: '2026-06-13'
      },
      attachTo: document.body
    })

    await wrapper.get('input').trigger('click')
    await wrapper.get('[aria-label="Next month"]').trigger('click')

    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toContain('July')

    await wrapper.get('[data-active-date="true"]').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.get('[data-active-date="true"]').attributes('aria-label')).toBe('2026-07-02')

    await wrapper.get('[data-active-date="true"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        disabled: true
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('opens from keyboard input shortcuts', async () => {
    const wrapper = mount(YDatePicker)
    const preventDefault = vi.fn()

    await wrapper.get('input').trigger('keydown', {
      key: 'ArrowDown',
      preventDefault
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('dismisses the calendar from outside pointer without treating the trigger as outside', async () => {
    const wrapper = mount(YDatePicker, {
      props: {
        modelValue: '2026-06-13'
      },
      attachTo: document.body
    })

    await wrapper.get('[aria-label="Open calendar"]').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Close calendar"]').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await wrapper.get('[aria-label="Open calendar"]').trigger('click')
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('inherits size and density from config provider while allowing local size overrides', () => {
    const providerWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm', density: 'compact' }, () => h(YDatePicker))
      }
    })

    expect(providerWrapper.get('.yok-date-picker').classes()).toEqual(expect.arrayContaining([
      'yok-date-picker--sm',
      'yok-date-picker--compact'
    ]))

    const overrideWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm' }, () => h(YDatePicker, { size: 'lg' }))
      }
    })

    expect(overrideWrapper.get('.yok-date-picker').classes()).toContain('yok-date-picker--lg')
  })
})
