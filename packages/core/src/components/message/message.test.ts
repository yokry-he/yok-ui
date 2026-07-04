import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YMessage from './YMessage.vue'
import { closeAllMessages, message, openMessage } from './service'

afterEach(() => {
  vi.unstubAllGlobals()
  closeAllMessages()
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('YMessage', () => {
  it('renders content and emits close', async () => {
    const wrapper = mount(YMessage, {
      props: {
        title: 'Saved',
        closable: true
      },
      slots: {
        default: 'Settings updated.'
      }
    })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-atomic')).toBe('true')
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('Settings updated.')

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('allows alert role for urgent feedback', () => {
    const wrapper = mount(YMessage, {
      props: {
        tone: 'danger',
        role: 'alert'
      },
      slots: {
        default: 'Unable to save.'
      }
    })

    expect(wrapper.attributes('role')).toBe('alert')
  })
})

describe('message service', () => {
  it('renders a global success message and closes it manually', async () => {
    const handle = message.success({
      title: 'Saved',
      content: 'Theme tokens updated.',
      duration: 0
    })

    expect(handle.id).toMatch(/^yok-message-/)
    expect(document.body.querySelector('[data-yok-message-stack]')).not.toBeNull()
    expect(document.body.textContent).toContain('Saved')
    expect(document.body.textContent).toContain('Theme tokens updated.')

    handle.close()

    expect(document.body.textContent).not.toContain('Theme tokens updated.')
    expect(document.body.querySelector('[data-yok-message-stack]')).toBeNull()
  })

  it('auto closes after duration and calls onClose once', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    openMessage({
      content: 'Copied',
      duration: 1200,
      onClose
    })

    expect(document.body.textContent).toContain('Copied')

    vi.advanceTimersByTime(1200)

    expect(document.body.textContent).not.toContain('Copied')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('updates content and closes all messages', async () => {
    const first = message.info({ content: 'Saving', duration: 0 })
    message.warning({ content: 'Needs review', tone: 'success', duration: 0 })

    first.update({
      title: 'Saved',
      content: 'Ready now',
      tone: 'success'
    })
    await nextTick()

    expect(document.body.textContent).toContain('Saved')
    expect(document.body.textContent).toContain('Ready now')
    expect(document.body.querySelector('[role="alert"]')?.textContent).toContain('Needs review')

    message.closeAll()

    expect(document.body.querySelector('[data-yok-message-stack]')).toBeNull()
  })

  it('supports custom containers', () => {
    const container = document.createElement('section')
    document.body.append(container)

    openMessage({
      content: 'Scoped feedback',
      container,
      duration: 0
    })

    expect(container.textContent).toContain('Scoped feedback')
    expect(document.body.querySelector('[data-yok-message-stack]')).toBeNull()
  })

  it('returns a no-op handle without a DOM', () => {
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('window', undefined)

    const handle = message.danger('Server render fallback')

    expect(handle.id).toMatch(/^yok-message-/)
    expect(() => handle.close()).not.toThrow()
    expect(() => handle.update({ content: 'Still safe' })).not.toThrow()
  })
})
