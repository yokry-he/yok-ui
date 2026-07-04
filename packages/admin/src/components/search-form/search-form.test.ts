import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import YSearchForm, { type YSearchFormField } from './YSearchForm.vue'
import type { YDateRangeShortcut, YDateShortcut } from '@yok-ui/core'

const fields: YSearchFormField[] = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [{ label: 'Stable', value: 'stable' }]
  },
  { key: 'owner', label: 'Owner' },
  { key: 'package', label: 'Package' }
]

describe('YSearchForm', () => {
  it('renders visible fields and collapses extra filters by default', () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: { keyword: 'table' },
        fields,
        title: 'Advanced search',
        collapsedCount: 2
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Search form')
    expect(wrapper.text()).toContain('Advanced search')
    expect(wrapper.text()).toContain('1 filter applied')
    expect(wrapper.text()).toContain('Keyword')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).not.toContain('Owner')
  })

  it('expands and emits collapse changes', async () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: {},
        fields,
        collapsedCount: 2
      }
    })

    await wrapper.findAllComponents({ name: 'YButton' })[2].trigger('click')

    expect(wrapper.emitted('collapseChange')?.[0]).toEqual([false])
    expect(wrapper.text()).toContain('Owner')
  })

  it('updates fields and emits search payload', async () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: {},
        fields,
        collapsible: false
      }
    })

    await wrapper.get('input').setValue('table')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ keyword: 'table' }])

    await wrapper.setProps({ modelValue: { keyword: 'table', status: 'stable' } })
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('search')?.[0]).toEqual([
      {
        values: { keyword: 'table', status: 'stable' },
        activeFieldKeys: ['keyword', 'status']
      }
    ])
  })

  it('resets to field defaults', async () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: { keyword: 'table', status: 'stable' },
        fields: [
          { key: 'keyword', label: 'Keyword' },
          { key: 'status', label: 'Status', defaultValue: 'beta' }
        ]
      }
    })

    await wrapper.findAllComponents({ name: 'YButton' })[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ status: 'beta' }])
    expect(wrapper.emitted('reset')?.[0]).toEqual([{ status: 'beta' }])
  })

  it('supports custom field and action slots', () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: { keyword: 'table' },
        fields,
        collapsible: false
      },
      slots: {
        'field-keyword': '<label>Custom keyword<input value="table" /></label>',
        actions: '<button type="button">Save filter</button>'
      }
    })

    expect(wrapper.text()).toContain('Custom keyword')
    expect(wrapper.text()).toContain('Save filter')
    expect(wrapper.text()).not.toContain('Search component')
  })

  it('renders date and date range filters with shortcut presets', () => {
    const dateShortcuts: YDateShortcut[] = [
      { label: 'Today', value: '2026-06-13' },
      { label: 'Release day', value: '2026-07-01', time: '20:30', description: 'Launch window' }
    ]
    const rangeShortcuts: YDateRangeShortcut[] = [
      { label: 'Sprint', value: ['2026-06-13', '2026-06-20'] },
      { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00' }
    ]

    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: {},
        fields: [
          { key: 'releaseDate', label: 'Release date', type: 'date', shortcuts: dateShortcuts },
          { key: 'releaseWindow', label: 'Release window', type: 'dateRange', shortcuts: rangeShortcuts }
        ] as YSearchFormField[],
        collapsible: false
      }
    })

    const datePicker = wrapper.findComponent({ name: 'YDatePicker' })
    const dateRangePicker = wrapper.findComponent({ name: 'YDateRangePicker' })

    expect(datePicker.exists()).toBe(true)
    expect(datePicker.props('shortcuts')).toEqual(dateShortcuts)
    expect(dateRangePicker.exists()).toBe(true)
    expect(dateRangePicker.props('shortcuts')).toEqual(rangeShortcuts)
  })

  it('updates date range filters and includes non-empty arrays in the search payload', async () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: {
          keyword: 'table',
          releaseDate: '2026-07-01',
          releaseWindow: ['2026-07-01', '2026-07-07'],
          emptyWindow: []
        },
        fields: [
          { key: 'keyword', label: 'Keyword' },
          { key: 'releaseDate', label: 'Release date', type: 'date' },
          { key: 'releaseWindow', label: 'Release window', type: 'dateRange' },
          { key: 'emptyWindow', label: 'Empty window', type: 'dateRange' }
        ] as YSearchFormField[],
        collapsible: false
      }
    })

    await wrapper.findComponent({ name: 'YDateRangePicker' }).vm.$emit('update:modelValue', ['2026-08-01', '2026-08-07'])

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      {
        keyword: 'table',
        releaseDate: '2026-07-01',
        releaseWindow: ['2026-08-01', '2026-08-07'],
        emptyWindow: []
      }
    ])

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('search')?.[0]).toEqual([
      {
        values: {
          keyword: 'table',
          releaseDate: '2026-07-01',
          releaseWindow: ['2026-07-01', '2026-07-07'],
          emptyWindow: []
        },
        activeFieldKeys: ['keyword', 'releaseDate', 'releaseWindow']
      }
    ])
  })

  it('loads async select presets for remote filter dictionaries', async () => {
    const loadStatusOptions = vi.fn().mockResolvedValue([
      { label: 'Remote stable', value: 'stable' },
      { label: 'Remote beta', value: 'beta' }
    ])

    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: {},
        fields: [
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: loadStatusOptions
          }
        ] as YSearchFormField[],
        collapsible: false
      }
    })

    expect(loadStatusOptions).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Loading presets')

    await Promise.resolve()
    await nextTick()

    const select = wrapper.findComponent({ name: 'YSelect' })

    expect(select.props('options')).toEqual([
      { label: 'Remote stable', value: 'stable' },
      { label: 'Remote beta', value: 'beta' }
    ])
    expect(wrapper.text()).not.toContain('Loading presets')
  })
})
