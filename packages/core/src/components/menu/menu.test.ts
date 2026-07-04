import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YMenu from './YMenu.vue'

const items = [
  { label: 'Overview', value: 'overview' },
  {
    label: 'Components',
    value: 'components',
    children: [
      { label: 'Button', value: 'button' },
      { label: 'Menu', value: 'menu' }
    ]
  },
  { label: 'Disabled', value: 'disabled', disabled: true },
  { label: 'Resources', value: 'resources' }
]

describe('YMenu', () => {
  it('renders a vertical navigation menu with active and disabled states', () => {
    const wrapper = mount(YMenu, {
      props: {
        items,
        modelValue: 'button',
        defaultOpenKeys: ['components'],
        ariaLabel: 'Docs navigation'
      }
    })

    expect(wrapper.attributes('role')).toBe('navigation')
    expect(wrapper.attributes('aria-label')).toBe('Docs navigation')
    expect(wrapper.classes()).toContain('yok-menu--vertical')
    expect(wrapper.get('[data-menu-value="button"]').attributes('aria-current')).toBe('page')
    expect(wrapper.get('[data-menu-value="disabled"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-menu-submenu="components"]').attributes('aria-expanded')).toBe('true')
  })

  it('emits updates and select payloads for leaf items', async () => {
    const wrapper = mount(YMenu, {
      props: {
        items,
        defaultOpenKeys: ['components']
      }
    })

    await wrapper.get('[data-menu-value="menu"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['menu'])
    expect(wrapper.emitted('select')?.[0]).toEqual([{ item: items[1].children?.[1], keyPath: ['components', 'menu'] }])
    expect(wrapper.get('[data-menu-value="menu"]').attributes('aria-current')).toBe('page')
  })

  it('toggles submenus and supports accordion mode', async () => {
    const wrapper = mount(YMenu, {
      props: {
        items: [
          ...items,
          {
            label: 'Admin',
            value: 'admin',
            children: [{ label: 'Users', value: 'users' }]
          }
        ],
        accordion: true
      }
    })

    await wrapper.get('[data-menu-submenu="components"]').trigger('click')
    expect(wrapper.get('[data-menu-submenu="components"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('open-change')?.[0]).toEqual([['components']])

    await wrapper.get('[data-menu-submenu="admin"]').trigger('click')
    expect(wrapper.get('[data-menu-submenu="components"]').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('[data-menu-submenu="admin"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('open-change')?.at(-1)).toEqual([['admin']])
  })

  it('emits open and close events when submenu state changes', async () => {
    const wrapper = mount(YMenu, {
      props: {
        items
      }
    })

    await wrapper.get('[data-menu-submenu="components"]').trigger('click')

    expect(wrapper.emitted('open')?.[0]).toEqual(['components', ['components'], ['components']])

    await wrapper.get('[data-menu-submenu="components"]').trigger('click')

    expect(wrapper.emitted('close')?.[0]).toEqual(['components', ['components'], []])
  })

  it('renders horizontal mode and can collapse labels', () => {
    const wrapper = mount(YMenu, {
      props: {
        items,
        mode: 'horizontal',
        collapsed: true
      }
    })

    expect(wrapper.classes()).toContain('yok-menu--horizontal')
    expect(wrapper.classes()).toContain('yok-menu--collapsed')
    expect(wrapper.get('[data-menu-value="overview"]').attributes('title')).toBe('Overview')
  })

  it('uses keyboard navigation for focus and activation', async () => {
    const wrapper = mount(YMenu, {
      props: {
        items,
        defaultOpenKeys: ['components']
      },
      attachTo: document.body
    })

    const firstItem = wrapper.get('[data-menu-value="overview"]')
    firstItem.element.focus()

    await firstItem.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(wrapper.get('[data-menu-submenu="components"]').element)

    await wrapper.get('[data-menu-submenu="components"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(wrapper.get('[data-menu-value="button"]').element)

    await wrapper.get('[data-menu-value="button"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['button'])
  })

  it('keeps keyboard focus scoped to the active menu instance', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const first = mount(YMenu, {
      props: {
        items,
        defaultOpenKeys: ['components'],
        ariaLabel: 'First navigation'
      },
      attachTo: host
    })
    const second = mount(YMenu, {
      props: {
        items,
        defaultOpenKeys: ['components'],
        ariaLabel: 'Second navigation'
      },
      attachTo: host
    })

    const secondOverview = second.get('[data-menu-value="overview"]')
    secondOverview.element.focus()

    await secondOverview.trigger('keydown', { key: 'ArrowDown' })

    expect(document.activeElement).toBe(second.get('[data-menu-submenu="components"]').element)
    expect(document.activeElement).not.toBe(first.get('[data-menu-submenu="components"]').element)

    first.unmount()
    second.unmount()
    host.remove()
  })
})
