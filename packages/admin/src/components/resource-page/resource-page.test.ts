import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YResourcePage from './YResourcePage.vue'
import type { YSearchFormField } from '../search-form'

const fields: YSearchFormField[] = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Stable', value: 'Stable' },
      { label: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner' }
]

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  {
    key: 'status',
    label: 'Status',
    filters: [
      { text: 'Stable', value: 'Stable' },
      { text: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner' }
]

const rows = [
  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core' },
  { id: 'data-view', name: 'Data View', status: 'Beta', owner: 'Admin' },
  { id: 'table', name: 'Table', status: 'Stable', owner: 'Core' }
]

const views = [
  {
    label: 'Beta review',
    value: 'beta',
    count: 1,
    pinned: true,
    preference: {
      columnKeys: ['status', 'name', 'owner'],
      columnWidths: { status: 128 },
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
      columnWidths: {},
      density: 'comfortable' as const,
      filters: { status: ['Stable'] }
    }
  }
]

describe('YResourcePage', () => {
  it('composes header, search form, data view, actions and aside into a resource workflow', () => {
    const wrapper = mount(YResourcePage, {
      props: {
        title: 'Component resources',
        description: 'Manage component docs, owners and release state.',
        eyebrow: 'Admin',
        status: 'Live',
        searchModel: { keyword: 'data' },
        searchFields: fields,
        views,
        defaultView: 'beta',
        columns,
        data: rows,
        tableTitle: 'Component queue',
        pagination: true,
        pageSize: 2,
        selectable: true
      },
      slots: {
        actions: '<button>Create component</button>',
        toolbar: '<button>Export CSV</button>',
        aside: '<section aria-label="Release summary">Release summary</section>',
        footer: '<button>Save workspace</button>'
      }
    })

    expect(wrapper.get('.yok-crud-layout').attributes('aria-label')).toBe('Component resources')
    expect(wrapper.text()).toContain('Component resources')
    expect(wrapper.text()).toContain('Manage component docs, owners and release state.')
    expect(wrapper.text()).toContain('Create component')
    expect(wrapper.text()).toContain('Export CSV')
    expect(wrapper.text()).toContain('Release summary')
    expect(wrapper.text()).toContain('Save workspace')
    expect(wrapper.text()).toContain('Keyword')
    expect(wrapper.text()).toContain('Beta review')
    expect(wrapper.text()).toContain('Component queue')
    expect(wrapper.text()).toContain('Status: Beta')
    expect(wrapper.text()).toContain('Data View')
    expect(wrapper.text()).not.toContain('Button')
  })

  it('proxies search, saved view and table preference events with resource page names', async () => {
    const wrapper = mount(YResourcePage, {
      props: {
        title: 'Components',
        searchModel: {},
        searchFields: fields,
        views,
        defaultView: 'beta',
        columns,
        data: rows,
        showDensitySettings: true
      }
    })

    await wrapper.get('input').setValue('table')

    expect(wrapper.emitted('update:searchModel')?.[0]).toEqual([{ keyword: 'table' }])

    await wrapper.setProps({ searchModel: { keyword: 'table', status: 'Stable' } })
    await wrapper.get('form').trigger('submit')
    await wrapper.findAll('.yok-saved-views__item')[1].trigger('click')
    await wrapper.findAll('.yok-data-table__density-button')[1].trigger('click')

    expect(wrapper.emitted('search')?.[0]?.[0]).toEqual({
      values: { keyword: 'table', status: 'Stable' },
      activeFieldKeys: ['keyword', 'status']
    })
    expect(wrapper.emitted('update:viewValue')?.[0]).toEqual(['stable'])
    expect(wrapper.emitted('viewChange')?.[0]).toEqual([views[1]])
    expect(wrapper.emitted('viewPreferenceChange')?.at(-1)?.[0]).toMatchObject({
      reason: 'density',
      view: views[1],
      preference: {
        density: 'compact',
        filters: { status: ['Stable'] }
      }
    })
  })

  it('renders a detail drawer and exposes close and footer slots', async () => {
    const wrapper = mount(YResourcePage, {
      attachTo: document.body,
      props: {
        title: 'Components',
        searchModel: {},
        searchFields: fields,
        views,
        columns,
        data: rows,
        detailOpen: true,
        detailTitle: 'Component detail',
        detailDescription: 'Review selected component metadata.'
      },
      slots: {
        detail: '<p>YDataView detail body</p>',
        detailFooter: '<button>Approve</button>'
      }
    })

    expect(document.body.textContent).toContain('Component detail')
    expect(document.body.textContent).toContain('YDataView detail body')
    expect(document.body.textContent).toContain('Approve')

    await document.body.querySelector<HTMLButtonElement>('[data-drawer-close]')?.click()

    expect(wrapper.emitted('closeDetail')).toHaveLength(1)
    wrapper.unmount()
  })
})
