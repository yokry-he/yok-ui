import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YDataView from './YDataView.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true, width: 160 },
  {
    key: 'status',
    label: 'Status',
    width: 120,
    filters: [
      { text: 'Stable', value: 'Stable' },
      { text: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner' }
]

const rows = [
  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core' },
  { id: 'popover', name: 'Popover', status: 'Beta', owner: 'Core' },
  { id: 'table', name: 'Table', status: 'Stable', owner: 'Admin' }
]

const views = [
  {
    label: 'Beta review',
    value: 'beta',
    description: 'Only beta components',
    count: 1,
    pinned: true,
    preference: {
      columnKeys: ['status', 'name', 'owner'],
      columnWidths: { status: 144, name: 188 },
      density: 'compact' as const,
      filters: { status: ['Beta'] }
    }
  },
  {
    label: 'Stable core',
    value: 'stable',
    count: 2,
    preference: {
      columnKeys: ['name', 'status', 'owner'],
      columnWidths: { name: 220 },
      density: 'comfortable' as const,
      filters: { status: ['Stable'] }
    }
  }
]

describe('YDataView', () => {
  it('applies the selected saved view preference to the data table', () => {
    const wrapper = mount(YDataView, {
      props: {
        views,
        defaultView: 'beta',
        columns,
        data: rows,
        tableTitle: 'Component queue',
        showColumnSettings: true,
        showDensitySettings: true,
        resizable: true
      }
    })

    const headings = wrapper
      .findAll('thead th')
      .map((heading) => heading.text().replace(/⌕.*$/, ''))

    expect(wrapper.text()).toContain('Beta review')
    expect(wrapper.get('.yok-saved-views__item[aria-pressed="true"]').text()).toContain('Beta review')
    expect(headings).toEqual(['Status', 'Name↕', 'Owner'])
    expect(wrapper.get('.yok-table').classes()).toContain('yok-table--compact')
    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 144px')
    expect(wrapper.text()).toContain('Status: Beta')
    expect(wrapper.text()).toContain('Popover')
    expect(wrapper.text()).not.toContain('Button')
  })

  it('switches saved views and emits the applied table preference', async () => {
    const wrapper = mount(YDataView, {
      props: {
        views,
        defaultView: 'beta',
        columns,
        data: rows,
        pagination: true,
        page: 1,
        pageSize: 10
      }
    })

    await wrapper.findAll('.yok-saved-views__item')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['stable'])
    expect(wrapper.emitted('change')?.[0]).toEqual([views[1]])
    expect(wrapper.emitted('update:viewPreference')?.[0]).toEqual([{
      columnKeys: ['name', 'status', 'owner'],
      columnWidths: { name: 220 },
      density: 'comfortable',
      filters: { status: ['Stable'] }
    }])
    expect(wrapper.findAll('thead th').map((heading) => heading.text().replace(/⌕.*$/, ''))).toEqual(['Name↕', 'Status', 'Owner'])
    expect(wrapper.text()).toContain('Button')
    expect(wrapper.text()).toContain('Table')
    expect(wrapper.text()).not.toContain('Popover')
  })

  it('updates the current view preference from table setting changes and saves it', async () => {
    const wrapper = mount(YDataView, {
      props: {
        views,
        defaultView: 'beta',
        columns,
        data: rows,
        showDensitySettings: true,
        saveText: 'Save view'
      }
    })

    await wrapper.findAll('.yok-data-table__density-button')[0].trigger('click')
    await wrapper.get('.yok-saved-views__save').trigger('click')

    expect(wrapper.emitted('viewPreferenceChange')?.[0]?.[0]).toMatchObject({
      reason: 'density',
      view: views[0],
      preference: {
        columnKeys: ['status', 'name', 'owner'],
        columnWidths: { status: 144, name: 188 },
        density: 'comfortable',
        filters: { status: ['Beta'] }
      }
    })
    expect(wrapper.emitted('save')?.[0]?.[0]).toMatchObject({
      view: views[0],
      preference: {
        density: 'comfortable',
        filters: { status: ['Beta'] }
      }
    })
  })
})
