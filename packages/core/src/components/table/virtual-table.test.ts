import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YVirtualTable from './YVirtualTable.vue'

const columns = [
  { key: 'name', label: 'Name', width: 180 },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'owner', label: 'Owner' }
]

const rows = Array.from({ length: 100 }, (_, index) => ({
  id: `component-${index}`,
  name: `Component ${index}`,
  status: index % 2 ? 'Beta' : 'Stable',
  owner: index % 3 ? 'Core' : 'Admin'
}))

describe('YVirtualTable', () => {
  it('renders a virtualized table window with row count summary', () => {
    const wrapper = mount(YVirtualTable, {
      props: {
        columns,
        data: rows,
        height: 144,
        rowHeight: 36,
        overscan: 1,
        caption: 'Component inventory'
      }
    })

    expect(wrapper.classes()).toContain('yok-virtual-table')
    expect(wrapper.attributes('data-virtualized')).toBe('true')
    expect(wrapper.get('caption').text()).toBe('Component inventory')
    expect(wrapper.text()).toContain('Component 0')
    expect(wrapper.text()).not.toContain('Component 99')
    expect(wrapper.get('.yok-table__summary').text()).toBe('100 rows')
  })

  it('updates the rendered range when scrolled', async () => {
    const wrapper = mount(YVirtualTable, {
      props: {
        columns,
        data: rows,
        height: 120,
        rowHeight: 40,
        overscan: 1
      }
    })

    const viewport = wrapper.get<HTMLElement>('.yok-table__scroll')
    viewport.element.scrollTop = 400
    await viewport.trigger('scroll')

    expect(wrapper.text()).toContain('Component 9')
    expect(wrapper.text()).toContain('Component 12')
    expect(wrapper.text()).not.toContain('Component 13')
    expect(wrapper.text()).not.toContain('Component 0')
  })

  it('forwards cell slots and sortable events from the table engine', async () => {
    const wrapper = mount(YVirtualTable, {
      props: {
        columns,
        data: rows.slice(0, 4),
        height: 180,
        rowHeight: 40
      },
      slots: {
        'cell-status': '<template #cell-status="{ value }"><strong>{{ value }}</strong></template>'
      }
    })

    expect(wrapper.get('strong').text()).toBe('Stable')

    await wrapper.get('.yok-table__sort-button').trigger('click')

    expect(wrapper.emitted('update:sortKey')?.[0]).toEqual(['status'])
    expect(wrapper.emitted('update:sortOrder')?.[0]).toEqual(['asc'])
    expect(wrapper.emitted('sortChange')?.[0][0]).toMatchObject({
      key: 'status',
      order: 'asc'
    })
  })

  it('keeps empty and loading states accessible', () => {
    const wrapper = mount(YVirtualTable, {
      props: {
        columns,
        data: [],
        loading: true,
        loadingText: 'Loading large dataset'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toBe('Loading large dataset')
  })
})
