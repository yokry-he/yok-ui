import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YDataTable from './YDataTable.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' }
]

const data = [
  { id: 'button', name: 'Button', status: 'Stable' },
  { id: 'table', name: 'Table', status: 'Stable' },
  { id: 'popover', name: 'Popover', status: 'Beta' }
]

describe('YDataTable', () => {
  it('renders toolbar, table and pagination', () => {
    const wrapper = mount(YDataTable, {
      props: {
        title: 'Components',
        description: 'Manage components.',
        columns,
        data,
        pagination: true,
        page: 1,
        pageSize: 2
      },
      slots: {
        actions: '<button>Create</button>'
      }
    })

    expect(wrapper.text()).toContain('Components')
    expect(wrapper.text()).toContain('Create')
    expect(wrapper.text()).toContain('Button')
    expect(wrapper.text()).toContain('Table')
    expect(wrapper.text()).not.toContain('Popover')
    expect(wrapper.text()).toContain('Page 1 · 3 items')
  })

  it('emits page changes from pagination', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        pagination: true,
        page: 1,
        pageSize: 1
      }
    })

    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1].trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
    expect(wrapper.emitted('pageChange')?.[0]).toEqual([{ page: 2, pageSize: 1 }])
  })

  it('emits selection and exposes bulk actions', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        selectable: true,
        selectedRowKeys: ['button']
      },
      slots: {
        bulkActions: '<template #bulkActions="{ selectedRowKeys, selectedRows }"><button>Archive {{ selectedRowKeys.length }} · {{ selectedRows[0].name }}</button></template>'
      }
    })

    expect(wrapper.text()).toContain('1 selected')
    expect(wrapper.text()).toContain('Archive 1 · Button')

    await wrapper.findAll('input[type="checkbox"]')[2].setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['button', 'table']])
    expect(wrapper.emitted('selectionChange')?.[0][0]).toMatchObject({
      selectedRowKeys: ['button', 'table']
    })
  })

  it('supports uncontrolled selection, built-in bulk actions and clear selection', async () => {
    const bulkActions = [
      { label: 'Archive', value: 'archive', tone: 'info' as const },
      { label: 'Delete', value: 'delete', tone: 'danger' as const }
    ]
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        selectable: true,
        bulkActions,
        bulkActionClearText: 'Clear selected',
        stickyBulkActions: true
      }
    })

    await wrapper.findAll('input[type="checkbox"]')[1].setValue(true)

    expect(wrapper.get('.yok-data-table__bulk').classes()).toContain('yok-data-table__bulk--sticky')
    expect(wrapper.text()).toContain('1 selected')
    expect(wrapper.text()).toContain('Archive')
    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['button']])

    await wrapper.get('.yok-bulk-action-bar__action').trigger('click')

    expect(wrapper.emitted('bulkAction')?.[0]).toEqual([{
      action: bulkActions[0],
      selectedRowKeys: ['button'],
      selectedRows: [{ id: 'button', name: 'Button', status: 'Stable' }]
    }])

    await wrapper.get('.yok-bulk-action-bar__clear').trigger('click')

    expect(wrapper.emitted('bulkClear')?.[0]).toEqual([{
      selectedRowKeys: ['button'],
      selectedRows: [{ id: 'button', name: 'Button', status: 'Stable' }]
    }])
    expect(wrapper.emitted('update:selectedRowKeys')?.[1]).toEqual([[]])
    expect(wrapper.find('.yok-data-table__bulk').exists()).toBe(false)
  })

  it('forwards sort changes from the inner table', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data
      }
    })

    await wrapper.get('button[aria-label="Name: Sort"]').trigger('click')

    expect(wrapper.emitted('update:sortKey')?.[0]).toEqual(['name'])
    expect(wrapper.emitted('update:sortOrder')?.[0]).toEqual(['asc'])
    expect(wrapper.emitted('sortChange')?.[0][0]).toMatchObject({
      key: 'name',
      order: 'asc'
    })
  })

  it('emits remote request changes when sorting', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        remote: true,
        pagination: true,
        page: 3,
        pageSize: 20
      }
    })

    await wrapper.get('button[aria-label="Name: Sort"]').trigger('click')

    expect(wrapper.emitted('requestChange')?.[0]).toEqual([{
      reason: 'sort',
      page: 1,
      pageSize: 20,
      sortKey: 'name',
      sortOrder: 'asc',
      columnKeys: ['name', 'status'],
      filters: {}
    }])
  })

  it('switches table density and emits density changes', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        showDensitySettings: true
      }
    })

    const buttons = wrapper.findAll('.yok-data-table__density-button')

    expect(buttons).toHaveLength(2)
    expect(buttons[0].attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('.yok-table').classes()).not.toContain('yok-table--compact')

    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:density')?.[0]).toEqual(['compact'])
    expect(wrapper.emitted('densityChange')?.[0]).toEqual(['compact'])
    expect(wrapper.get('.yok-table').classes()).toContain('yok-table--compact')
  })

  it('supports controlled density and keeps compact as a compatibility shortcut', () => {
    const controlled = mount(YDataTable, {
      props: {
        columns,
        data,
        density: 'compact'
      }
    })
    const compatibility = mount(YDataTable, {
      props: {
        columns,
        data,
        compact: true
      }
    })

    expect(controlled.get('.yok-table').classes()).toContain('yok-table--compact')
    expect(compatibility.get('.yok-table').classes()).toContain('yok-table--compact')
  })

  it('uses defaultViewPreference as one initial table view contract', () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name', width: 150, sortable: true },
          {
            key: 'status',
            label: 'Status',
            width: 120,
            filters: [
              { text: 'Stable', value: 'Stable' },
              { text: 'Beta', value: 'Beta' }
            ]
          }
        ],
        data,
        pagination: true,
        pageSize: 10,
        defaultViewPreference: {
          columnKeys: ['status', 'name'],
          columnWidths: { status: 168 },
          density: 'compact',
          filters: { status: ['Beta'] }
        }
      }
    })

    const headings = wrapper.findAll('thead th').map((heading) => heading.text().replace(/⌕.*$/, ''))

    expect(headings).toEqual(['Status', 'Name↕'])
    expect(wrapper.get('.yok-table').classes()).toContain('yok-table--compact')
    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 168px')
    expect(wrapper.text()).toContain('Popover')
    expect(wrapper.text()).not.toContain('Button')
    expect(wrapper.get('.yok-data-table__filter-chip').text()).toContain('Status: Beta')
  })

  it('emits unified view preference changes when table settings change', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name', width: 150 },
          { key: 'status', label: 'Status', width: 120 }
        ],
        data,
        showDensitySettings: true,
        resizable: true,
        viewPreference: {
          columnKeys: ['status', 'name'],
          columnWidths: { status: 168 },
          density: 'comfortable',
          filters: {}
        }
      }
    })

    await wrapper.findAll('.yok-data-table__density-button')[1].trigger('click')

    expect(wrapper.emitted('update:viewPreference')?.[0]).toEqual([{
      columnKeys: ['status', 'name'],
      columnWidths: { status: 168 },
      density: 'compact',
      filters: {}
    }])
    expect(wrapper.emitted('viewPreferenceChange')?.[0]).toEqual([{
      reason: 'density',
      preference: {
        columnKeys: ['status', 'name'],
        columnWidths: { status: 168 },
        density: 'compact',
        filters: {}
      }
    }])

    await wrapper.findAll('.yok-table__resize-handle')[0].trigger('pointerdown', { clientX: 168 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 216 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 216 }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:viewPreference')?.[1]).toEqual([{
      columnKeys: ['status', 'name'],
      columnWidths: { status: 216 },
      density: 'comfortable',
      filters: {}
    }])
    expect(wrapper.emitted('viewPreferenceChange')?.[1]?.[0]).toMatchObject({
      reason: 'columnResize',
      preference: {
        columnKeys: ['status', 'name'],
        columnWidths: { status: 216 },
        density: 'comfortable',
        filters: {}
      }
    })
  })

  it('passes max height to the inner table scroll container', () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        maxHeight: 260
      }
    })

    expect(wrapper.get('.yok-table').classes()).toContain('yok-table--scroll-y')
    expect(wrapper.get('.yok-table__scroll').attributes('style')).toContain('max-height: 260px')
  })

  it('passes virtualized row settings to the inner table for large datasets', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        title: 'Large release queue',
        columns,
        data: Array.from({ length: 80 }, (_, index) => ({
          id: `row-${index + 1}`,
          name: `Component ${index + 1}`,
          status: index % 2 ? 'Beta' : 'Stable'
        })),
        virtualized: true,
        virtualHeight: 120,
        virtualRowHeight: 40,
        virtualOverscan: 1
      }
    })

    expect(wrapper.get('.yok-table').classes()).toContain('yok-table--virtualized')
    expect(wrapper.get('.yok-table').attributes('data-virtualized')).toBe('true')
    expect(wrapper.findAll('tbody tr[data-row-key]')).toHaveLength(4)
    expect(wrapper.text()).toContain('Component 1')
    expect(wrapper.text()).not.toContain('Component 30')
    expect(wrapper.get('.yok-table__summary').text()).toBe('80 shown')

    const scroll = wrapper.get('.yok-table__scroll')
    scroll.element.scrollTop = 400
    await scroll.trigger('scroll')

    expect(wrapper.findAll('tbody tr[data-row-key]')[0].attributes('data-row-key')).toBe('row-10')
    expect(wrapper.text()).toContain('Component 10')
  })

  it('filters local rows before calculating visible data and total count', () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          {
            key: 'status',
            label: 'Status',
            filters: [
              { text: 'Stable', value: 'Stable' },
              { text: 'Beta', value: 'Beta' }
            ]
          }
        ],
        data,
        defaultFilters: { status: ['Stable'] },
        pagination: true,
        pageSize: 10
      }
    })

    expect(wrapper.text()).toContain('Button')
    expect(wrapper.text()).toContain('Table')
    expect(wrapper.text()).not.toContain('Popover')
    expect(wrapper.get('.yok-table__summary').text()).toBe('Page 1 · 2 shown of 2 items')
    expect(wrapper.get('.yok-data-table__summary').text()).toBe('Page 1 · 2 items')
    expect(wrapper.get('.yok-data-table__filter-chip').text()).toContain('Status: Stable')
  })

  it('clears active filter chips and updates local rows', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          {
            key: 'status',
            label: 'Status',
            filters: [
              { text: 'Stable', value: 'Stable' },
              { text: 'Beta', value: 'Beta' }
            ]
          }
        ],
        data,
        defaultFilters: { status: ['Stable'] },
        pagination: true,
        pageSize: 10
      }
    })

    await wrapper.get('.yok-data-table__filter-chip').trigger('click')

    expect(wrapper.text()).toContain('Popover')
    expect(wrapper.get('.yok-table__summary').text()).toBe('Page 1 · 3 shown of 3 items')
    expect(wrapper.find('.yok-data-table__filter-chip').exists()).toBe(false)
    expect(wrapper.emitted('update:filters')?.[0]).toEqual([{}])
    expect(wrapper.emitted('filterChange')?.[0][0]).toMatchObject({
      columnKey: 'status',
      values: [],
      filters: {}
    })
  })

  it('clears all active filters in remote mode and emits a request payload', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          {
            key: 'status',
            label: 'Status',
            filters: [
              { text: 'Stable', value: 'Stable' },
              { text: 'Beta', value: 'Beta' }
            ]
          }
        ],
        data,
        remote: true,
        defaultFilters: { status: ['Stable', 'Beta'] },
        page: 2,
        pageSize: 20
      }
    })

    expect(wrapper.findAll('.yok-data-table__filter-chip')).toHaveLength(2)

    await wrapper.get('.yok-data-table__filter-clear').trigger('click')

    expect(wrapper.find('.yok-data-table__filter-chip').exists()).toBe(false)
    expect(wrapper.emitted('update:filters')?.[0]).toEqual([{}])
    expect(wrapper.emitted('requestChange')?.[0]).toEqual([{
      reason: 'filters',
      page: 1,
      pageSize: 20,
      sortKey: '',
      sortOrder: null,
      columnKeys: ['name', 'status'],
      filters: {}
    }])
  })

  it('emits filter request changes in remote mode', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          {
            key: 'status',
            label: 'Status',
            filters: [
              { text: 'Stable', value: 'Stable' },
              { text: 'Beta', value: 'Beta' }
            ]
          }
        ],
        data,
        remote: true,
        page: 2,
        pageSize: 20
      }
    })

    const statusFilters = wrapper.findAll('.yok-table__filter-option input')
    await statusFilters[1].setValue(true)

    expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ status: ['Beta'] }])
    expect(wrapper.emitted('filterChange')?.[0][0]).toMatchObject({
      columnKey: 'status',
      values: ['Beta'],
      filters: { status: ['Beta'] }
    })
    expect(wrapper.emitted('requestChange')?.[0]).toEqual([{
      reason: 'filters',
      page: 1,
      pageSize: 20,
      sortKey: '',
      sortOrder: null,
      columnKeys: ['name', 'status'],
      filters: { status: ['Beta'] }
    }])
  })

  it('renders loading state with busy semantics', () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data: [],
        loading: true,
        loadingText: 'Refreshing components'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('.yok-table').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toContain('Refreshing components')
    expect(wrapper.find('.yok-data-table__loading').exists()).toBe(false)
  })

  it('forwards custom empty slot state and refresh action', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data: [],
        errorText: 'No rows matched the filter.',
        refreshable: true
      },
      slots: {
        empty: '<template #empty="{ emptyText, errorText, refresh }"><button type="button" @click="refresh">{{ errorText || emptyText }}</button></template>'
      }
    })

    expect(wrapper.get('[role="status"]').text()).toBe('No rows matched the filter.')

    await wrapper.get('[role="status"] button').trigger('click')

    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('renders caption, generated summary and error recovery action', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        title: 'Components',
        columns,
        data: [],
        pagination: true,
        page: 2,
        pageSize: 10,
        total: 12,
        caption: 'Component release data',
        errorText: 'Network timeout while loading rows.',
        refreshable: true
      }
    })

    expect(wrapper.get('caption').text()).toBe('Component release data')
    expect(wrapper.get('.yok-table__summary').text()).toBe('Page 2 · 0 shown of 12 items')
    expect(wrapper.get('[role="alert"]').text()).toContain('Network timeout while loading rows.')
    expect(wrapper.text()).toContain('Network timeout while loading rows.')

    await wrapper.get('.yok-data-table__tool-button--quiet').trigger('click')

    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('toggles visible columns and emits column changes', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        showColumnSettings: true
      }
    })

    expect(wrapper.text()).toContain('Status')

    const statusToggle = wrapper.findAll('.yok-data-table__column-option input')[1]
    await statusToggle.setValue(false)

    expect(wrapper.findAll('thead th').map((heading) => heading.text())).toEqual(['Name↕'])
    expect(wrapper.emitted('update:columnKeys')?.[0]).toEqual([['name']])
    expect(wrapper.emitted('columnChange')?.[0][0]).toMatchObject({
      columnKeys: ['name']
    })
  })

  it('uses columnKeys as the visible column order preference', () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        columnKeys: ['status', 'name']
      }
    })

    expect(wrapper.findAll('thead th').map((heading) => heading.text())).toEqual(['Status', 'Name↕'])
  })

  it('reorders visible columns from the column settings panel', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        remote: true,
        showColumnSettings: true,
        reorderableColumns: true,
        page: 2,
        pageSize: 20,
        sortKey: 'status',
        sortOrder: 'desc'
      }
    })

    const moveStatusBeforeName = wrapper.get('button[aria-label="Move Status column left"]')
    await moveStatusBeforeName.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('thead th').map((heading) => heading.text())).toEqual(['Status', 'Name↕'])
    expect(wrapper.emitted('update:columnKeys')?.[0]).toEqual([['status', 'name']])
    expect(wrapper.emitted('columnChange')?.[0][0]).toMatchObject({
      columnKeys: ['status', 'name']
    })
    expect(wrapper.emitted('requestChange')?.[0]).toEqual([{
      reason: 'columns',
      page: 2,
      pageSize: 20,
      sortKey: 'status',
      sortOrder: 'desc',
      columnKeys: ['status', 'name'],
      filters: {}
    }])
    expect(wrapper.findAll('.yok-data-table__column-option')[0].text()).toContain('Status')
  })

  it('resets visible columns to the configured default column set', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        showColumnSettings: true,
        defaultColumnKeys: ['name'],
        columnResetText: 'Restore default columns'
      }
    })

    expect(wrapper.findAll('thead th').map((heading) => heading.text())).toEqual(['Name↕'])

    await wrapper.findAll('.yok-data-table__column-option input')[1].setValue(true)
    expect(wrapper.findAll('thead th').map((heading) => heading.text())).toEqual(['Name↕', 'Status'])

    await wrapper.get('.yok-data-table__column-reset').trigger('click')

    expect(wrapper.findAll('thead th').map((heading) => heading.text())).toEqual(['Name↕'])
    expect(wrapper.emitted('update:columnKeys')?.at(-1)).toEqual([['name']])
    expect(wrapper.emitted('columnChange')?.at(-1)?.[0]).toMatchObject({
      columnKeys: ['name']
    })
    expect(wrapper.get('.yok-data-table__column-reset').text()).toBe('Restore default columns')
    expect(wrapper.get('.yok-data-table__column-reset').attributes('disabled')).toBeDefined()
  })

  it('passes resizable column settings to the inner table', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name', width: 150 },
          { key: 'status', label: 'Status', width: 120 }
        ],
        data,
        resizable: true,
        minColumnWidth: 110
      }
    })

    const handle = wrapper.get('.yok-table__resize-handle')
    await handle.trigger('pointerdown', { clientX: 150 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 215 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 215 }))
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 215px')
  })

  it('forwards controlled column width preferences and remote resize requests', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name', width: 150 },
          { key: 'status', label: 'Status', width: 120 }
        ],
        data,
        remote: true,
        resizable: true,
        columnWidths: { name: 188 },
        page: 2,
        pageSize: 20,
        sortKey: 'name',
        sortOrder: 'asc'
      }
    })

    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 188px')

    await wrapper.findAll('.yok-table__resize-handle')[0].trigger('pointerdown', { clientX: 188 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 244 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 244 }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:columnWidths')?.[0]).toEqual([{ name: 244 }])
    expect(wrapper.emitted('columnResize')?.[0][0]).toMatchObject({
      columnKey: 'name',
      width: 244,
      widths: { name: 244 }
    })
    expect(wrapper.emitted('requestChange')?.[0]).toEqual([{
      reason: 'columnResize',
      page: 2,
      pageSize: 20,
      sortKey: 'name',
      sortOrder: 'asc',
      columnKeys: ['name', 'status'],
      filters: {},
      columnWidths: { name: 244 }
    }])
  })

  it('emits remote request payloads when resetting visible columns', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        remote: true,
        showColumnSettings: true,
        defaultColumnKeys: ['name', 'status'],
        columnKeys: ['name'],
        page: 2,
        pageSize: 20,
        sortKey: 'name',
        sortOrder: 'desc'
      }
    })

    await wrapper.get('.yok-data-table__column-reset').trigger('click')

    expect(wrapper.emitted('update:columnKeys')?.[0]).toEqual([['name', 'status']])
    expect(wrapper.emitted('requestChange')?.[0]).toEqual([{
      reason: 'columns',
      page: 2,
      pageSize: 20,
      sortKey: 'name',
      sortOrder: 'desc',
      columnKeys: ['name', 'status'],
      filters: {}
    }])
  })

  it('supports controlled visible columns and refresh action', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        columnKeys: ['name'],
        refreshable: true
      }
    })

    expect(wrapper.text()).toContain('Refresh')
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.findAll('thead th').map((heading) => heading.text())).toEqual(['Name↕'])

    await wrapper.get('.yok-data-table__tool-button').trigger('click')

    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('keeps remote data unsliced and emits request changes', async () => {
    const wrapper = mount(YDataTable, {
      props: {
        columns,
        data,
        remote: true,
        pagination: true,
        page: 2,
        pageSize: 1,
        total: 12,
        showColumnSettings: true,
        refreshable: true,
        sortKey: 'name',
        sortOrder: 'asc'
      }
    })

    expect(wrapper.text()).toContain('Button')
    expect(wrapper.text()).toContain('Table')
    expect(wrapper.text()).toContain('Popover')

    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1].trigger('click')

    expect(wrapper.emitted('requestChange')?.[0]).toEqual([{
      reason: 'page',
      page: 3,
      pageSize: 1,
      sortKey: 'name',
      sortOrder: 'asc',
      columnKeys: ['name', 'status'],
      filters: {}
    }])

    await wrapper.get('.yok-data-table__tool-button').trigger('click')

    expect(wrapper.emitted('requestChange')?.[1]).toEqual([{
      reason: 'refresh',
      page: 2,
      pageSize: 1,
      sortKey: 'name',
      sortOrder: 'asc',
      columnKeys: ['name', 'status'],
      filters: {}
    }])

    const statusToggle = wrapper.findAll('.yok-data-table__column-option input')[1]
    await statusToggle.setValue(false)

    expect(wrapper.emitted('requestChange')?.[2]).toEqual([{
      reason: 'columns',
      page: 2,
      pageSize: 1,
      sortKey: 'name',
      sortOrder: 'asc',
      columnKeys: ['name'],
      filters: {}
    }])
  })
})
