import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YNotification from './YNotification.vue'
import { closeAllNotifications, notification, openNotification } from './service'

afterEach(() => {
  vi.unstubAllGlobals()
  closeAllNotifications()
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('YNotification', () => {
  it('renders title content tone and emits close', async () => {
    const wrapper = mount(YNotification, {
      props: {
        title: 'Build complete',
        tone: 'success',
        closable: true
      },
      slots: {
        default: 'Docs build finished.'
      }
    })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-atomic')).toBe('true')
    expect(wrapper.classes()).toContain('yok-notification--success')
    expect(wrapper.text()).toContain('Build complete')
    expect(wrapper.text()).toContain('Docs build finished.')

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('allows alert role for urgent notifications', () => {
    const wrapper = mount(YNotification, {
      props: {
        title: 'Deploy failed',
        tone: 'danger',
        role: 'alert'
      },
      slots: {
        default: 'Rollback required.'
      }
    })

    expect(wrapper.attributes('role')).toBe('alert')
  })
})

describe('notification service', () => {
  it('renders a global notification in the requested placement and closes it manually', () => {
    const handle = notification.success({
      title: 'Published',
      content: 'Calendar docs are live.',
      placement: 'bottom-left',
      duration: 0
    })

    const stack = document.body.querySelector('[data-yok-notification-stack="bottom-left"]')

    expect(handle.id).toMatch(/^yok-notification-/)
    expect(stack).not.toBeNull()
    expect(stack?.textContent).toContain('Published')
    expect(stack?.textContent).toContain('Calendar docs are live.')

    handle.close()

    expect(document.body.textContent).not.toContain('Calendar docs are live.')
    expect(document.body.querySelector('[data-yok-notification-stack="bottom-left"]')).toBeNull()
  })

  it('auto closes after duration and calls onClose once', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    openNotification({
      title: 'Saved view',
      content: 'The current filter set was saved.',
      duration: 1200,
      onClose
    })

    expect(document.body.textContent).toContain('Saved view')

    vi.advanceTimersByTime(1200)

    expect(document.body.textContent).not.toContain('Saved view')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('updates content, supports click handlers and closes all notifications', async () => {
    const onClick = vi.fn()
    const first = notification.info({
      title: 'Syncing',
      content: 'Preparing release notes.',
      duration: 0,
      onClick
    })
    notification.warning({
      title: 'Review required',
      content: 'A11y evidence is missing.',
      duration: 0
    })

    first.update({
      title: 'Synced',
      content: 'Release notes are ready.',
      tone: 'success'
    })
    await nextTick()

    expect(document.body.textContent).toContain('Synced')
    expect(document.body.textContent).toContain('Release notes are ready.')

    document.body.querySelector<HTMLElement>('[data-yok-notification-id] .yok-notification')?.click()

    expect(onClick).toHaveBeenCalledTimes(1)

    notification.closeAll()

    expect(document.body.querySelector('[data-yok-notification-stack="top-right"]')).toBeNull()
  })

  it('supports custom containers and offset styles', () => {
    const container = document.createElement('section')
    document.body.append(container)

    openNotification({
      title: 'Scoped',
      content: 'Rendered inside a local container.',
      container,
      placement: 'top-left',
      offset: 80,
      duration: 0
    })

    const stack = container.querySelector<HTMLElement>('[data-yok-notification-stack="top-left"]')

    expect(stack?.textContent).toContain('Scoped')
    expect(stack?.style.top).toBe('80px')
    expect(Array.from(document.body.children).some((child) =>
      child.getAttribute('data-yok-notification-stack') === 'top-left'
    )).toBe(false)
  })

  it('returns a no-op handle without a DOM', () => {
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('window', undefined)

    const handle = notification.danger('Server render fallback')

    expect(handle.id).toMatch(/^yok-notification-/)
    expect(() => handle.close()).not.toThrow()
    expect(() => handle.update({ content: 'Still safe' })).not.toThrow()
  })
})
