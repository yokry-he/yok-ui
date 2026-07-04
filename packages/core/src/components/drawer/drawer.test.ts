import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import YDrawer from './YDrawer.vue'

enableAutoUnmount(afterEach)

describe('YDrawer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('renders in body and emits close', async () => {
    const wrapper = mount(YDrawer, {
      props: {
        open: true,
        title: 'Settings'
      },
      slots: {
        default: 'Drawer content'
      }
    })

    const dialog = document.body.querySelector('[role="dialog"]')

    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(document.body.textContent).toContain('Settings')
    expect(document.body.textContent).toContain('Drawer content')

    document.body.querySelector<HTMLButtonElement>('[data-drawer-close]')?.click()
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not render when closed', () => {
    mount(YDrawer, {
      props: {
        open: false,
        title: 'Hidden'
      }
    })

    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  })

  it('focuses the panel, locks scroll, closes on escape, and restores focus', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open drawer'
    document.body.append(trigger)
    trigger.focus()

    const wrapper = mount(YDrawer, {
      props: {
        open: true,
        title: 'Keyboard drawer'
      },
      slots: {
        default: '<button data-drawer-action>Save</button>'
      }
    })

    await nextTick()

    expect(document.activeElement).toBe(document.body.querySelector('[data-drawer-close]'))
    expect(document.body.style.overflow).toBe('hidden')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ open: false })
    await nextTick()

    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })

  it('keeps keyboard focus inside the drawer while tabbing', async () => {
    mount(YDrawer, {
      props: {
        open: true,
        title: 'Focus trap'
      },
      slots: {
        default: '<button data-drawer-action>Save</button>'
      }
    })

    await nextTick()

    const closeButton = document.body.querySelector<HTMLButtonElement>('[data-drawer-close]')
    const actionButton = document.body.querySelector<HTMLButtonElement>('[data-drawer-action]')

    actionButton?.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))

    expect(document.activeElement).toBe(closeButton)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }))

    expect(document.activeElement).toBe(actionButton)
  })
})
