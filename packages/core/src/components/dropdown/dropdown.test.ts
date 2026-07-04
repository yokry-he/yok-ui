import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import YDropdown from './YDropdown.vue'

describe('YDropdown', () => {
  it('toggles and emits selected item', async () => {
    const items = [
      { label: 'Edit', value: 'edit' },
      { label: 'Delete', value: 'delete' }
    ]
    const wrapper = mount(YDropdown, {
      props: {
        open: false,
        label: 'Actions',
        items
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])

    await wrapper.setProps({ open: true })
    const menuItems = wrapper.findAll('[role="menuitem"]')

    expect(menuItems).toHaveLength(2)

    await menuItems[0].trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    expect(wrapper.emitted('update:open')?.[1]).toEqual([false])
  })

  it('opens from keyboard and roves focus across enabled menu items', async () => {
    const wrapper = mount(YDropdown, {
      props: {
        open: false,
        label: 'Actions',
        items: [
          { label: 'Edit', value: 'edit' },
          { label: 'Archive', value: 'archive', disabled: true },
          { label: 'Delete', value: 'delete' }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('.yok-dropdown__trigger').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])

    await wrapper.setProps({ open: true })
    await wrapper.vm.$nextTick()

    const menuItems = wrapper.findAll('[role="menuitem"]')
    expect(document.activeElement).toBe(menuItems[0].element)

    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(menuItems[2].element)

    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(menuItems[0].element)

    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(menuItems[2].element)

    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(menuItems[0].element)
  })

  it('closes from escape and restores focus to trigger', async () => {
    const wrapper = mount(YDropdown, {
      props: {
        open: true,
        label: 'Actions',
        items: [{ label: 'Edit', value: 'edit' }]
      },
      attachTo: document.body
    })

    const trigger = wrapper.get<HTMLButtonElement>('.yok-dropdown__trigger')

    await wrapper.get('[role="menuitem"]').trigger('focus')
    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])

    await wrapper.setProps({ open: false })
    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(trigger.element)
  })

  it('emits close when pointer starts outside the trigger and menu', async () => {
    const wrapper = mount(YDropdown, {
      props: {
        open: true,
        label: 'Actions',
        items: [{ label: 'Edit', value: 'edit' }]
      },
      attachTo: document.body
    })

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('only lets the top dropdown handle escape when multiple menus are open', async () => {
    const first = mount(YDropdown, {
      props: {
        open: true,
        label: 'First actions',
        items: [{ label: 'Edit', value: 'edit' }]
      },
      attachTo: document.body
    })
    const second = mount(YDropdown, {
      props: {
        open: true,
        label: 'Second actions',
        items: [{ label: 'Delete', value: 'delete' }]
      },
      attachTo: document.body
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(first.emitted('update:open')).toBeUndefined()
    expect(second.emitted('update:open')?.[0]).toEqual([false])

    first.unmount()
    second.unmount()
  })

  it('supports uncontrolled click opening and item closing by default', async () => {
    const wrapper = mount(YDropdown, {
      props: {
        label: 'Actions',
        items: [
          { label: 'Edit', value: 'edit' },
          { label: 'Archive', value: 'archive' }
        ]
      }
    })

    await wrapper.get('.yok-dropdown__trigger').trigger('click')

    expect(wrapper.get('[role="menu"]').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])

    await wrapper.findAll('[role="menuitem"]')[0].trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual([{ label: 'Edit', value: 'edit' }])
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[1]).toEqual([false])
  })

  it('keeps the menu open when hideOnClick is disabled', async () => {
    const wrapper = mount(YDropdown, {
      props: {
        hideOnClick: false,
        label: 'Actions',
        items: [{ label: 'Edit', value: 'edit' }]
      }
    })

    await wrapper.get('.yok-dropdown__trigger').trigger('click')
    await wrapper.get('[role="menuitem"]').trigger('click')

    expect(wrapper.get('[role="menu"]').exists()).toBe(true)
    expect(wrapper.emitted('select')?.[0]).toEqual([{ label: 'Edit', value: 'edit' }])
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('supports hover and contextmenu triggers', async () => {
    const hover = mount(YDropdown, {
      props: {
        trigger: 'hover',
        label: 'Hover actions',
        items: [{ label: 'Edit', value: 'edit' }]
      }
    })

    await hover.get('.yok-dropdown').trigger('mouseenter')
    expect(hover.get('[role="menu"]').exists()).toBe(true)

    await hover.get('.yok-dropdown').trigger('mouseleave')
    expect(hover.find('[role="menu"]').exists()).toBe(false)

    const context = mount(YDropdown, {
      props: {
        trigger: 'contextmenu',
        label: 'Context actions',
        items: [{ label: 'Edit', value: 'edit' }]
      }
    })

    await context.get('.yok-dropdown__trigger').trigger('contextmenu')

    expect(context.get('[role="menu"]').exists()).toBe(true)
    expect(context.emitted('update:open')?.[0]).toEqual([true])
  })

  it('supports manual control and rich placement classes', async () => {
    const wrapper = mount(YDropdown, {
      props: {
        open: true,
        trigger: 'manual',
        placement: 'top-end',
        label: 'Manual actions',
        items: [{ label: 'Edit', value: 'edit' }]
      }
    })

    expect(wrapper.get('.yok-dropdown').classes()).toContain('yok-dropdown--top-end')
    expect(wrapper.get('[role="menu"]').exists()).toBe(true)

    await wrapper.get('.yok-dropdown__trigger').trigger('click')

    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('ignores trigger events when disabled', async () => {
    const wrapper = mount(YDropdown, {
      props: {
        disabled: true,
        label: 'Disabled actions',
        items: [{ label: 'Edit', value: 'edit' }]
      }
    })

    await wrapper.get('.yok-dropdown__trigger').trigger('click')
    await wrapper.get('.yok-dropdown__trigger').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(wrapper.get('.yok-dropdown__trigger').attributes('aria-disabled')).toBe('true')
  })
})
