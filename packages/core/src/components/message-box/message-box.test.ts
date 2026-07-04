import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YMessageBox from './YMessageBox.vue'
import { closeAllMessageBoxes, messageBox, openMessageBox } from './service'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  closeAllMessageBoxes()
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('YMessageBox', () => {
  it('renders accessible confirm content and emits confirm/cancel actions', async () => {
    const wrapper = mount(YMessageBox, {
      props: {
        open: true,
        title: 'Publish release?',
        message: 'The selected release will become visible to all users.',
        variant: 'confirm',
        tone: 'warning',
        confirmText: 'Publish',
        cancelText: 'Review'
      }
    })

    const dialog = document.body.querySelector('[role="alertdialog"]')

    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.getAttribute('aria-labelledby')).toBeTruthy()
    expect(dialog?.getAttribute('aria-describedby')).toBeTruthy()
    expect(document.body.textContent).toContain('Publish release?')
    expect(document.body.textContent).toContain('The selected release will become visible to all users.')
    expect(document.body.textContent).toContain('Publish')
    expect(document.body.textContent).toContain('Review')

    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toEqual([[]])

    document.body.querySelector<HTMLButtonElement>('[data-message-box-cancel]')?.click()
    await nextTick()

    expect(wrapper.emitted('cancel')).toEqual([[]])
  })

  it('renders prompt input and emits the entered value', async () => {
    const wrapper = mount(YMessageBox, {
      props: {
        open: true,
        title: 'Name this preset',
        message: 'Use a clear name so it can be reused in docs.',
        variant: 'prompt',
        promptValue: 'compact table',
        promptLabel: 'Preset name'
      }
    })

    const input = document.body.querySelector<HTMLInputElement>('[data-message-box-prompt]')

    expect(input?.value).toBe('compact table')

    input!.value = 'admin compact table'
    input!.dispatchEvent(new Event('input'))
    await nextTick()

    expect(wrapper.emitted('update:promptValue')).toEqual([['admin compact table']])

    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toEqual([['admin compact table']])
  })
})

describe('messageBox service', () => {
  it('resolves confirm and rejects cancel with action payloads', async () => {
    const confirmPromise = messageBox.confirm({
      title: 'Delete draft?',
      message: 'This operation cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Keep editing'
    })

    expect(document.body.querySelector('[data-yok-message-box-id]')).not.toBeNull()
    expect(document.body.textContent).toContain('Delete draft?')

    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()

    await expect(confirmPromise).resolves.toEqual({ action: 'confirm' })
    expect(document.body.querySelector('[data-yok-message-box-id]')).toBeNull()

    const cancelPromise = messageBox.confirm('Leave this page?')

    document.body.querySelector<HTMLButtonElement>('[data-message-box-cancel]')?.click()

    await expect(cancelPromise).rejects.toEqual({ action: 'cancel' })
  })

  it('supports prompt values, validation messages and async confirm handlers', async () => {
    let finishAsyncConfirm!: () => void

    const promise = messageBox.prompt({
      title: 'Create branch',
      message: 'Branch names must be lowercase.',
      promptValue: 'feature/docs',
      inputPattern: /^feature\//,
      inputErrorMessage: 'Use a feature/ prefix.',
      onConfirm: () =>
        new Promise<void>((resolve) => {
          finishAsyncConfirm = resolve
        })
    })

    const input = document.body.querySelector<HTMLInputElement>('[data-message-box-prompt]')!
    input.value = 'bugfix/docs'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await nextTick()

    expect(document.body.textContent).toContain('Use a feature/ prefix.')

    input.value = 'feature/docs'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.click()
    await nextTick()

    expect(document.body.querySelector<HTMLButtonElement>('[data-message-box-confirm]')?.disabled).toBe(true)

    finishAsyncConfirm()

    await expect(promise).resolves.toEqual({ action: 'confirm', value: 'feature/docs' })
  })

  it('destroys all open boxes and rejects pending promises as close actions', async () => {
    const first = openMessageBox({ title: 'First', message: 'One' })
    const second = messageBox.alert({ title: 'Second', message: 'Two' })

    expect(document.body.querySelectorAll('[data-yok-message-box-id]')).toHaveLength(2)

    closeAllMessageBoxes()

    await expect(first).rejects.toEqual({ action: 'close' })
    await expect(second).rejects.toEqual({ action: 'close' })
    expect(document.body.querySelectorAll('[data-yok-message-box-id]')).toHaveLength(0)
  })

  it('returns a safe close result without a DOM', async () => {
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('window', undefined)

    await expect(messageBox.alert('Server render fallback')).resolves.toEqual({ action: 'close' })
  })
})
