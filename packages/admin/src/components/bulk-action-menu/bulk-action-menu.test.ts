import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YBulkActionMenu, { type YBulkActionMenuItem } from './YBulkActionMenu.vue'

const actions: YBulkActionMenuItem[] = [
  { label: 'Publish', value: 'publish', group: 'Workflow', tone: 'success', description: 'Move selected rows to stable.' },
  { label: 'Assign owner', value: 'assign', group: 'Workflow', tone: 'info' },
  { label: 'Export CSV', value: 'export', group: 'Export' },
  { label: 'Delete', value: 'delete', group: 'Danger zone', tone: 'danger', requiresConfirm: true, confirmText: 'Confirm delete' },
  { label: 'Archive disabled', value: 'archive', group: 'Danger zone', disabled: true }
]

describe('YBulkActionMenu', () => {
  it('renders selected count and grouped actions after opening the menu', async () => {
    const wrapper = mount(YBulkActionMenu, {
      props: {
        selectedRowKeys: ['button', 'table', 'select'],
        actions,
        label: 'Batch actions'
      }
    })

    expect(wrapper.text()).toContain('3 selected')
    expect(wrapper.get('button[aria-haspopup="menu"]').attributes('aria-expanded')).toBe('false')

    await wrapper.get('button[aria-haspopup="menu"]').trigger('click')

    expect(wrapper.get('button[aria-haspopup="menu"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[role="menu"]').attributes('aria-label')).toBe('Batch actions')
    expect(wrapper.text()).toContain('Workflow')
    expect(wrapper.text()).toContain('Export')
    expect(wrapper.text()).toContain('Danger zone')
    expect(wrapper.text()).toContain('Move selected rows to stable.')
  })

  it('emits an action payload with a copy of selected row keys and closes the menu', async () => {
    const wrapper = mount(YBulkActionMenu, {
      props: {
        selectedRowKeys: ['button', 'table'],
        actions
      }
    })

    await wrapper.get('button[aria-haspopup="menu"]').trigger('click')
    await wrapper.findAll('[role="menuitem"]')[1].trigger('click')

    expect(wrapper.emitted('action')?.[0]).toEqual([
      {
        action: actions[1],
        selectedRowKeys: ['button', 'table']
      }
    ])
    expect(wrapper.get('button[aria-haspopup="menu"]').attributes('aria-expanded')).toBe('false')
  })

  it('keeps the menu disabled when no rows are selected', async () => {
    const wrapper = mount(YBulkActionMenu, {
      props: {
        selectedRowKeys: [],
        actions
      }
    })

    const trigger = wrapper.get('button[aria-haspopup="menu"]')

    expect(trigger.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('0 selected')

    await trigger.trigger('click')

    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    expect(wrapper.emitted('action')).toBeUndefined()
  })

  it('requires a second click before emitting dangerous confirmed actions', async () => {
    const wrapper = mount(YBulkActionMenu, {
      props: {
        selectedRowKeys: ['button'],
        actions
      }
    })

    await wrapper.get('button[aria-haspopup="menu"]').trigger('click')

    const deleteButton = wrapper.findAll('[role="menuitem"]')[3]
    await deleteButton.trigger('click')

    expect(wrapper.emitted('action')).toBeUndefined()
    expect(wrapper.text()).toContain('Confirm delete')

    await deleteButton.trigger('click')

    expect(wrapper.emitted('action')?.[0]).toEqual([
      {
        action: actions[3],
        selectedRowKeys: ['button']
      }
    ])
  })

  it('emits clear and closes when Escape is pressed', async () => {
    const wrapper = mount(YBulkActionMenu, {
      props: {
        selectedRowKeys: ['button'],
        actions,
        clearText: 'Clear selected'
      }
    })

    await wrapper.get('button[aria-haspopup="menu"]').trigger('click')
    await wrapper.get('.yok-bulk-action-menu__clear').trigger('click')

    expect(wrapper.emitted('clear')).toHaveLength(1)

    await wrapper.get('button[aria-haspopup="menu"]').trigger('click')
    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.get('button[aria-haspopup="menu"]').attributes('aria-expanded')).toBe('false')
  })
})
