import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YTable from './YTable.vue'

describe('YTable', () => {
  it('renders columns, rows and cell slots', () => {
    const wrapper = mount(YTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' }
        ],
        data: [
          { id: 1, name: 'Button', status: 'Stable' }
        ]
      },
      slots: {
        'cell-status': '<template #cell-status="{ value }"><strong>{{ value }}</strong></template>'
      }
    })

    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Button')
    expect(wrapper.get('strong').text()).toBe('Stable')
  })

  it('renders empty state', () => {
    const wrapper = mount(YTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        data: [],
        emptyText: 'No components'
      }
    })

    expect(wrapper.get('[role="status"]').text()).toBe('No components')
  })

  it('renders loading text for empty data', () => {
    const wrapper = mount(YTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        data: [],
        loading: true,
        loadingText: 'Loading components'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toBe('Loading components')
  })

  it('renders custom empty slot with table state', () => {
    const wrapper = mount(YTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        data: [],
        emptyText: 'No components',
        loadingText: 'Loading components'
      },
      slots: {
        empty: '<template #empty="{ loading, emptyText, loadingText, columns }"><button>{{ loading ? loadingText : emptyText }} · {{ columns.length }}</button></template>'
      }
    })

    expect(wrapper.get('[role="status"]').text()).toBe('No components · 1')
    expect(wrapper.get('button').text()).toBe('No components · 1')
  })

  it('renders caption, loading overlay and custom summary', () => {
    const wrapper = mount(YTable, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        data: [{ id: 'button', name: 'Button' }],
        caption: 'Component maturity',
        loading: true,
        loadingText: 'Refreshing rows',
        summary: '1 component · remote refresh pending'
      }
    })

    expect(wrapper.get('caption').text()).toBe('Component maturity')
    expect(wrapper.get('.yok-table__loading').text()).toContain('Refreshing rows')
    expect(wrapper.get('.yok-table__summary').text()).toBe('1 component · remote refresh pending')
  })

  it('renders fixed columns with calculated sticky offsets', () => {
    const wrapper = mount(YTable, {
      props: {
        selectable: true,
        columns: [
          { key: 'name', label: 'Name', width: '180px', fixed: 'left' },
          { key: 'status', label: 'Status', width: 120 },
          { key: 'owner', label: 'Owner', width: '140px', fixed: 'right' }
        ],
        data: [
          { id: 'button', name: 'Button', status: 'Stable', owner: 'Core' }
        ]
      }
    })

    const headings = wrapper.findAll('thead th')
    expect(headings[0].classes()).toContain('yok-table__selection-cell--fixed')
    expect(headings[0].attributes('style')).toContain('left: 0px')
    expect(headings[1].classes()).toContain('yok-table__cell--fixed-left')
    expect(headings[1].attributes('style')).toContain('left: 44px')
    expect(headings[1].attributes('style')).toContain('width: 180px')
    expect(headings[3].classes()).toContain('yok-table__cell--fixed-right')
    expect(headings[3].attributes('style')).toContain('right: 0px')
    expect(headings[3].attributes('style')).toContain('width: 140px')

    const firstRowCells = wrapper.findAll('tbody td')
    expect(firstRowCells[0].classes()).toContain('yok-table__selection-cell--fixed')
    expect(firstRowCells[1].classes()).toContain('yok-table__cell--fixed-left')
    expect(firstRowCells[3].classes()).toContain('yok-table__cell--fixed-right')
  })

  it('resizes columns with pointer handles and emits final width', async () => {
    const wrapper = mount(YTable, {
      props: {
        resizable: true,
        minColumnWidth: 120,
        columns: [
          { key: 'name', label: 'Name', width: 160 },
          { key: 'status', label: 'Status', width: 120, resizable: false }
        ],
        data: [
          { id: 'button', name: 'Button', status: 'Stable' }
        ]
      }
    })

    const handles = wrapper.findAll('.yok-table__resize-handle')
    expect(handles).toHaveLength(1)
    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 160px')

    await handles[0].trigger('pointerdown', { clientX: 160 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 230 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 230 }))
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 230px')
    expect(wrapper.findAll('tbody td')[0].attributes('style')).toContain('width: 230px')
    expect(wrapper.emitted('columnResize')?.[0][0]).toMatchObject({
      columnKey: 'name',
      width: 230,
      widths: { name: 230 }
    })

    await handles[0].trigger('pointerdown', { clientX: 230 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 20 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 20 }))
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 120px')
    expect(wrapper.emitted('columnResize')?.at(-1)?.[0]).toMatchObject({
      columnKey: 'name',
      width: 120
    })
  })

  it('supports controlled column widths for persisted table preferences', async () => {
    const wrapper = mount(YTable, {
      props: {
        resizable: true,
        columnWidths: { name: 180 },
        columns: [
          { key: 'name', label: 'Name', width: 140 },
          { key: 'status', label: 'Status', width: 120 }
        ],
        data: [
          { id: 'button', name: 'Button', status: 'Stable' }
        ]
      }
    })

    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 180px')

    await wrapper.findAll('.yok-table__resize-handle')[0].trigger('pointerdown', { clientX: 180 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 230 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 230 }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:columnWidths')?.[0]).toEqual([{ name: 230 }])
    expect(wrapper.emitted('columnResize')?.[0][0]).toMatchObject({
      columnKey: 'name',
      width: 230,
      widths: { name: 230 }
    })

    await wrapper.setProps({
      columnWidths: { name: 210, status: 144 }
    })

    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 210px')
    expect(wrapper.findAll('thead th')[1].attributes('style')).toContain('width: 144px')
  })

  it('renders a vertical scroll container when max height is provided', () => {
    const wrapper = mount(YTable, {
      props: {
        maxHeight: 240,
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' }
        ],
        data: Array.from({ length: 8 }, (_, index) => ({
          id: `row-${index + 1}`,
          name: `Component ${index + 1}`,
          status: 'Stable'
        }))
      }
    })

    expect(wrapper.classes()).toContain('yok-table--scroll-y')
    expect(wrapper.get('.yok-table__scroll').attributes('style')).toContain('max-height: 240px')
  })

  it('virtualizes large row sets while preserving total row semantics', async () => {
    const wrapper = mount(YTable, {
      props: {
        virtualized: true,
        virtualHeight: 120,
        virtualRowHeight: 40,
        virtualOverscan: 1,
        columns: [{ key: 'name', label: 'Name' }],
        data: Array.from({ length: 100 }, (_, index) => ({
          id: `row-${index + 1}`,
          name: `Component ${index + 1}`
        }))
      }
    })

    expect(wrapper.classes()).toContain('yok-table--virtualized')
    expect(wrapper.attributes('data-virtualized')).toBe('true')
    expect(wrapper.findAll('tbody tr[data-row-key]')).toHaveLength(4)
    expect(wrapper.text()).toContain('Component 1')
    expect(wrapper.text()).toContain('Component 4')
    expect(wrapper.text()).not.toContain('Component 20')
    expect(wrapper.get('.yok-table__virtual-spacer--bottom td').attributes('style')).toContain('3840px')
    expect(wrapper.get('.yok-table__summary').text()).toBe('100 rows')

    const scroll = wrapper.get('.yok-table__scroll')
    scroll.element.scrollTop = 400
    await scroll.trigger('scroll')

    expect(wrapper.findAll('tbody tr[data-row-key]')[0].attributes('data-row-key')).toBe('row-10')
    expect(wrapper.text()).toContain('Component 10')
    expect(wrapper.text()).toContain('Component 13')
    expect(wrapper.findAll('tbody tr[data-row-key]').map((row) => row.text())).not.toContain('Component 1')
  })

  it('keeps string max height values unchanged', () => {
    const wrapper = mount(YTable, {
      props: {
        maxHeight: '18rem',
        columns: [{ key: 'name', label: 'Name' }],
        data: [{ id: 'button', name: 'Button' }]
      }
    })

    expect(wrapper.get('.yok-table__scroll').attributes('style')).toContain('max-height: 18rem')
  })

  it('filters rows with column filters and emits filter changes', async () => {
    const wrapper = mount(YTable, {
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
        data: [
          { id: 'button', name: 'Button', status: 'Stable' },
          { id: 'table', name: 'Table', status: 'Stable' },
          { id: 'popover', name: 'Popover', status: 'Beta' }
        ]
      }
    })

    const statusFilters = wrapper.findAll('.yok-table__filter-option input')
    await statusFilters[0].setValue(true)

    expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual([
      'ButtonStable',
      'TableStable'
    ])
    expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ status: ['Stable'] }])
    expect(wrapper.emitted('filterChange')?.[0][0]).toMatchObject({
      columnKey: 'status',
      values: ['Stable'],
      filters: { status: ['Stable'] }
    })
  })

  it('keeps rows unfiltered in manual filter mode while still exposing active filters', () => {
    const wrapper = mount(YTable, {
      props: {
        filterMode: 'manual',
        filters: { status: ['Beta'] },
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
        data: [
          { id: 'button', name: 'Button', status: 'Stable' },
          { id: 'popover', name: 'Popover', status: 'Beta' }
        ]
      }
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.get('.yok-table__filter-count').text()).toBe('1')
  })

  it('sorts rows and emits sort state changes', async () => {
    const wrapper = mount(YTable, {
      props: {
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'stars', label: 'Stars', sortable: (a, b) => Number(a.stars) - Number(b.stars) }
        ],
        data: [
          { id: 'table', name: 'Table', stars: 9 },
          { id: 'button', name: 'Button', stars: 12 },
          { id: 'alert', name: 'Alert', stars: 5 }
        ]
      }
    })

    const nameSort = wrapper.get('button[aria-label="Name: Sort"]')
    await nameSort.trigger('click')

    expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual([
      'Alert5',
      'Button12',
      'Table9'
    ])
    expect(wrapper.get('th[aria-sort="ascending"]').text()).toContain('Name')
    expect(wrapper.emitted('update:sortKey')?.[0]).toEqual(['name'])
    expect(wrapper.emitted('update:sortOrder')?.[0]).toEqual(['asc'])
    expect(wrapper.emitted('sortChange')?.[0][0]).toMatchObject({
      key: 'name',
      order: 'asc'
    })

    await wrapper.get('button[aria-label="Name: Ascending"]').trigger('click')

    expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual([
      'Table9',
      'Button12',
      'Alert5'
    ])
    expect(wrapper.get('th[aria-sort="descending"]').text()).toContain('Name')

    await wrapper.get('button[aria-label="Name: Descending"]').trigger('click')

    expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual([
      'Table9',
      'Button12',
      'Alert5'
    ])
    expect(wrapper.findAll('th[aria-sort="none"]').length).toBe(2)
  })

  it('selects rows and all visible rows', async () => {
    const wrapper = mount(YTable, {
      props: {
        selectable: true,
        columns: [
          { key: 'name', label: 'Name' }
        ],
        data: [
          { id: 'button', name: 'Button' },
          { id: 'table', name: 'Table' }
        ]
      }
    })

    expect(wrapper.get('.yok-table__summary').text()).toBe('2 rows')

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1].setValue(true)

    expect(wrapper.get('.yok-table__summary').text()).toBe('1 selected · 2 rows')
    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['button']])
    expect(wrapper.emitted('selectionChange')?.[0][0]).toEqual({
      selectedRowKeys: ['button'],
      selectedRows: [{ id: 'button', name: 'Button' }]
    })

    await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)

    expect(wrapper.get('.yok-table__summary').text()).toBe('2 selected · 2 rows')
    expect(wrapper.emitted('update:selectedRowKeys')?.[1]).toEqual([['button', 'table']])
  })

  it('expands rows with default, controlled and slot-driven details', async () => {
    const wrapper = mount(YTable, {
      props: {
        expandable: true,
        defaultExpandedRowKeys: ['button'],
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' }
        ],
        data: [
          { id: 'button', name: 'Button', status: 'Stable', detail: 'Primary actions' },
          { id: 'table', name: 'Table', status: 'Beta', detail: 'Data views' }
        ]
      },
      slots: {
        expand: '<template #expand="{ row, rowKey, expanded }"><section class="detail">{{ rowKey }} · {{ row.detail }} · {{ expanded }}</section></template>'
      }
    })

    expect(wrapper.get('[aria-label="Collapse Button details"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.text()).toContain('button · Primary actions · true')
    expect(wrapper.get('.yok-table__expanded-cell').attributes('colspan')).toBe('3')

    await wrapper.get('[aria-label="Expand Table details"]').trigger('click')

    expect(wrapper.emitted('update:expandedRowKeys')?.[0]).toEqual([['button', 'table']])
    expect(wrapper.emitted('expandChange')?.[0][0]).toEqual({
      rowKey: 'table',
      expanded: true,
      expandedRowKeys: ['button', 'table'],
      row: { id: 'table', name: 'Table', status: 'Beta', detail: 'Data views' }
    })
    expect(wrapper.text()).toContain('table · Data views · true')

    await wrapper.setProps({
      expandedRowKeys: ['table']
    })

    expect(wrapper.find('[aria-label="Expand Button details"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Collapse Table details"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('button · Primary actions')

    await wrapper.get('[aria-label="Collapse Table details"]').trigger('click')

    expect(wrapper.emitted('update:expandedRowKeys')?.at(-1)).toEqual([[]])
    expect(wrapper.emitted('expandChange')?.at(-1)?.[0]).toMatchObject({
      rowKey: 'table',
      expanded: false,
      expandedRowKeys: []
    })
  })

  it('exposes clear methods for controlled table toolbars', async () => {
    const wrapper = mount(YTable, {
      props: {
        defaultSortKey: 'name',
        defaultSortOrder: 'asc',
        defaultFilters: { status: ['Stable'], package: ['Core'] },
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          {
            key: 'status',
            label: 'Status',
            filters: [
              { text: 'Stable', value: 'Stable' },
              { text: 'Beta', value: 'Beta' }
            ]
          },
          {
            key: 'package',
            label: 'Package',
            filters: [
              { text: 'Core', value: 'Core' },
              { text: 'Admin', value: 'Admin' }
            ]
          }
        ],
        data: [
          { id: 'button', name: 'Button', status: 'Stable', package: 'Core' },
          { id: 'table', name: 'Table', status: 'Stable', package: 'Core' },
          { id: 'data-table', name: 'Data Table', status: 'Beta', package: 'Admin' }
        ]
      }
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.findAll('.yok-table__filter-count').map((item) => item.text())).toEqual(['1', '1'])
    expect(wrapper.get('th[aria-sort="ascending"]').text()).toContain('Name')

    wrapper.vm.clearFilter(['status'])
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ package: ['Core'] }])
    expect(wrapper.emitted('filterChange')?.[0][0]).toMatchObject({
      columnKey: 'status',
      values: [],
      filters: { package: ['Core'] }
    })

    wrapper.vm.clearFilter()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:filters')?.[1]).toEqual([{}])
    expect(wrapper.emitted('filterChange')?.[1][0]).toMatchObject({
      columnKey: '',
      values: [],
      filters: {}
    })

    wrapper.vm.clearSort()
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('th[aria-sort="none"]').length).toBe(1)
    expect(wrapper.emitted('update:sortKey')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('update:sortOrder')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('sortChange')?.at(-1)?.[0]).toMatchObject({
      key: '',
      order: null
    })
  })
})
