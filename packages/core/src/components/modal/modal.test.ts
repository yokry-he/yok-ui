import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import YModal from './YModal.vue'

enableAutoUnmount(afterEach)

describe('YModal', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('renders when open and emits close', async () => {
    const wrapper = mount(YModal, {
      props: {
        open: true,
        title: 'Create component'
      },
      slots: {
        default: 'Modal content'
      }
    })

    const dialog = document.body.querySelector('[role="dialog"]')

    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(document.body.textContent).toContain('Create component')
    expect(document.body.textContent).toContain('Modal content')

    document.body.querySelector<HTMLButtonElement>('[data-modal-close]')?.click()
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not render when closed', () => {
    const wrapper = mount(YModal, {
      props: {
        open: false,
        title: 'Hidden'
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('focuses the dialog, locks scroll, closes on escape, and restores focus', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open modal'
    document.body.append(trigger)
    trigger.focus()

    const wrapper = mount(YModal, {
      props: {
        open: true,
        title: 'Keyboard modal'
      },
      slots: {
        default: '<button data-modal-action>Confirm</button>'
      }
    })

    await nextTick()

    expect(document.activeElement).toBe(document.body.querySelector('[data-modal-close]'))
    expect(document.body.style.overflow).toBe('hidden')
    expect(Number(document.body.querySelector<HTMLElement>('.yok-modal')?.style.zIndex)).toBeGreaterThan(2000)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ open: false })
    await nextTick()

    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })

  it('only lets the top modal handle escape when multiple overlays are open', async () => {
    const first = mount(YModal, {
      props: {
        open: true,
        title: 'First modal'
      }
    })
    const second = mount(YModal, {
      props: {
        open: true,
        title: 'Second modal'
      }
    })

    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(first.emitted('close')).toBeUndefined()
    expect(second.emitted('close')).toHaveLength(1)
  })

  it('keeps keyboard focus inside the modal while tabbing', async () => {
    mount(YModal, {
      props: {
        open: true,
        title: 'Focus trap'
      },
      slots: {
        default: '<button data-modal-action>Confirm</button>'
      }
    })

    await nextTick()

    const closeButton = document.body.querySelector<HTMLButtonElement>('[data-modal-close]')
    const actionButton = document.body.querySelector<HTMLButtonElement>('[data-modal-action]')

    actionButton?.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))

    expect(document.activeElement).toBe(closeButton)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }))

    expect(document.activeElement).toBe(actionButton)
  })
})
