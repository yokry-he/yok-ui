import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YBulkActionBar, { type YBulkActionItem } from './YBulkActionBar.vue'

const actions: YBulkActionItem[] = [
  { label: 'Archive', value: 'archive', tone: 'info' },
  { label: 'Approve', value: 'approve', tone: 'success' },
  { label: 'Delete', value: 'delete', tone: 'danger', disabled: true }
]

describe('YBulkActionBar', () => {
  it('renders selected count, actions and accessible status label', () => {
    const wrapper = mount(YBulkActionBar, {
      props: {
        selectedRowKeys: ['table', 'tree'],
        actions,
        ariaLabel: 'Selected component actions'
      }
    })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.attributes('aria-label')).toBe('Selected component actions')
    expect(wrapper.text()).toContain('2 selected')
    expect(wrapper.text()).toContain('Archive')
    expect(wrapper.text()).toContain('Approve')
  })

  it('emits action payload with selected row keys', async () => {
    const wrapper = mount(YBulkActionBar, {
      props: {
        selectedRowKeys: ['table', 'tree'],
        actions
      }
    })

    await wrapper.findAll('.yok-bulk-action-bar__action')[0].trigger('click')

    expect(wrapper.emitted('action')?.[0]).toEqual([
      {
        action: actions[0],
        selectedRowKeys: ['table', 'tree']
      }
    ])
  })

  it('emits clear when clear button is clicked', async () => {
    const wrapper = mount(YBulkActionBar, {
      props: {
        selectedRowKeys: ['table'],
        actions
      }
    })

    await wrapper.get('.yok-bulk-action-bar__clear').trigger('click')

    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('disables actions when no rows are selected', async () => {
    const wrapper = mount(YBulkActionBar, {
      props: {
        selectedRowKeys: [],
        actions
      }
    })

    const actionButtons = wrapper.findAll('.yok-bulk-action-bar__action')

    expect(wrapper.attributes('data-empty')).toBe('true')
    expect(actionButtons[0].attributes('disabled')).toBeDefined()
    expect(wrapper.get('.yok-bulk-action-bar__clear').attributes('disabled')).toBeDefined()

    await actionButtons[0].trigger('click')

    expect(wrapper.emitted('action')).toBeUndefined()
  })

  it('supports summary and actions slots', () => {
    const wrapper = mount(YBulkActionBar, {
      props: {
        selectedRowKeys: ['button'],
        actions
      },
      slots: {
        summary: '<strong>Custom selected summary</strong>',
        actions: '<button type="button">Custom action</button>'
      }
    })

    expect(wrapper.text()).toContain('Custom selected summary')
    expect(wrapper.text()).toContain('Custom action')
    expect(wrapper.text()).not.toContain('Archive')
  })
})
