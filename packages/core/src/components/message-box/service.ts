import { createApp, h, reactive } from 'vue'
import YMessageBox, { type YMessageBoxTone, type YMessageBoxVariant } from './YMessageBox.vue'

export type YMessageBoxAction = 'confirm' | 'cancel' | 'close'

export interface YMessageBoxResult {
  action: YMessageBoxAction
  value?: string
}

export interface YMessageBoxOptions {
  id?: string
  title?: string
  message?: string
  tone?: YMessageBoxTone
  variant?: YMessageBoxVariant
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  promptValue?: string
  promptLabel?: string
  promptPlaceholder?: string
  inputPattern?: RegExp
  inputValidator?: (value: string) => boolean | string
  inputErrorMessage?: string
  container?: HTMLElement
  onConfirm?: (value?: string) => boolean | void | Promise<boolean | void>
  onCancel?: () => void
  onClose?: () => void
}

type MessageBoxInput = string | YMessageBoxOptions

type NormalizedMessageBoxOptions = Required<
  Pick<
    YMessageBoxOptions,
    | 'id'
    | 'title'
    | 'message'
    | 'tone'
    | 'variant'
    | 'confirmText'
    | 'cancelText'
    | 'closeOnOverlay'
    | 'closeOnEscape'
    | 'promptValue'
    | 'promptLabel'
    | 'promptPlaceholder'
    | 'inputErrorMessage'
  >
> &
  Omit<
    YMessageBoxOptions,
    | 'id'
    | 'title'
    | 'message'
    | 'tone'
    | 'variant'
    | 'confirmText'
    | 'cancelText'
    | 'closeOnOverlay'
    | 'closeOnEscape'
    | 'promptValue'
    | 'promptLabel'
    | 'promptPlaceholder'
    | 'inputErrorMessage'
  >

interface MessageBoxState extends NormalizedMessageBoxOptions {
  open: boolean
  loading: boolean
  promptError: string
}

interface MessageBoxInstance {
  id: string
  host: HTMLElement
  app: ReturnType<typeof createApp>
  close: (action?: YMessageBoxAction) => void
  resolve: (result: YMessageBoxResult) => void
  reject: (result: YMessageBoxResult) => void
}

const DEFAULT_CONFIRM_TEXT: Record<YMessageBoxVariant, string> = {
  alert: 'OK',
  confirm: 'Confirm',
  prompt: 'Confirm'
}

let seed = 0
const instances: MessageBoxInstance[] = []

function canUseDom() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function normalizeOptions(input: MessageBoxInput, variant: YMessageBoxVariant = 'alert'): NormalizedMessageBoxOptions {
  const raw = typeof input === 'string' ? { message: input } : input

  return {
    ...raw,
    id: raw.id ?? `yok-message-box-${++seed}`,
    title: raw.title ?? (variant === 'prompt' ? 'Input required' : 'Notice'),
    message: raw.message ?? '',
    tone: raw.tone ?? (variant === 'confirm' ? 'warning' : 'info'),
    variant: raw.variant ?? variant,
    confirmText: raw.confirmText ?? DEFAULT_CONFIRM_TEXT[raw.variant ?? variant],
    cancelText: raw.cancelText ?? 'Cancel',
    closeOnOverlay: raw.closeOnOverlay ?? variant === 'alert' ? true : false,
    closeOnEscape: raw.closeOnEscape ?? true,
    promptValue: raw.promptValue ?? '',
    promptLabel: raw.promptLabel ?? 'Input',
    promptPlaceholder: raw.promptPlaceholder ?? '',
    inputErrorMessage: raw.inputErrorMessage ?? 'Please enter a valid value.'
  }
}

function removeInstance(id: string) {
  const index = instances.findIndex((instance) => instance.id === id)

  if (index >= 0) {
    instances.splice(index, 1)
  }
}

function validatePrompt(state: MessageBoxState, value: string) {
  if (state.variant !== 'prompt') {
    return ''
  }

  if (state.inputValidator) {
    const result = state.inputValidator(value)

    if (typeof result === 'string') {
      return result
    }

    if (!result) {
      return state.inputErrorMessage
    }
  }

  if (state.inputPattern && !state.inputPattern.test(value)) {
    return state.inputErrorMessage
  }

  return ''
}

export function openMessageBox(input: MessageBoxInput): Promise<YMessageBoxResult> {
  const options = normalizeOptions(input, typeof input === 'string' ? 'alert' : input.variant ?? 'alert')

  if (!canUseDom()) {
    return Promise.resolve({ action: 'close' })
  }

  const state = reactive<MessageBoxState>({
    ...options,
    open: true,
    loading: false,
    promptError: ''
  })
  const container = options.container ?? document.body
  const host = document.createElement('div')
  host.className = 'yok-message-box-host'
  host.setAttribute('data-yok-message-box-id', options.id)
  container.append(host)

  let settled = false
  let resolvePromise!: (result: YMessageBoxResult) => void
  let rejectPromise!: (result: YMessageBoxResult) => void

  const promise = new Promise<YMessageBoxResult>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })

  const settle = (action: YMessageBoxAction, value?: string) => {
    if (settled) {
      return
    }

    settled = true
    state.open = false
    app.unmount()
    host.remove()
    removeInstance(options.id)

    const result = value === undefined ? { action } : { action, value }

    if (action === 'confirm') {
      resolvePromise(result)
      return
    }

    rejectPromise(result)
  }

  async function confirm(value?: string) {
    const error = validatePrompt(state, value ?? '')

    if (error) {
      state.promptError = error
      return
    }

    state.promptError = ''

    try {
      const beforeClose = options.onConfirm?.(value)

      if (beforeClose && typeof (beforeClose as Promise<boolean | void>).then === 'function') {
        state.loading = true
        const next = await beforeClose
        state.loading = false

        if (next === false) {
          return
        }
      } else if (beforeClose === false) {
        return
      }

      settle('confirm', state.variant === 'prompt' ? value : undefined)
    } catch {
      state.loading = false
    }
  }

  const app = createApp({
    name: 'YMessageBoxServiceItem',
    render() {
      return h(YMessageBox, {
        open: state.open,
        title: state.title,
        message: state.message,
        tone: state.tone,
        variant: state.variant,
        confirmText: state.confirmText,
        cancelText: state.cancelText,
        showCancel: state.showCancel,
        closeOnOverlay: state.closeOnOverlay,
        closeOnEscape: state.closeOnEscape,
        promptValue: state.promptValue,
        promptLabel: state.promptLabel,
        promptPlaceholder: state.promptPlaceholder,
        promptError: state.promptError,
        loading: state.loading,
        onConfirm: confirm,
        onCancel: () => {
          options.onCancel?.()
          settle('cancel')
        },
        onClose: () => {
          options.onClose?.()
          settle('close')
        },
        'onUpdate:promptValue': (value: string) => {
          state.promptValue = value
          state.promptError = ''
        }
      })
    }
  })

  app.mount(host)

  instances.push({
    id: options.id,
    host,
    app,
    close: (action = 'close') => settle(action),
    resolve: resolvePromise,
    reject: rejectPromise
  })

  return promise
}

function openWithVariant(variant: YMessageBoxVariant, input: MessageBoxInput, title?: string) {
  const options = typeof input === 'string' ? { title, message: input, variant } : { ...input, variant }

  return openMessageBox(options)
}

export function closeAllMessageBoxes() {
  ;[...instances].forEach((instance) => instance.close('close'))
}

export const messageBox = Object.assign(openMessageBox, {
  open: openMessageBox,
  alert: (input: MessageBoxInput, title?: string) => openWithVariant('alert', input, title),
  confirm: (input: MessageBoxInput, title?: string) => openWithVariant('confirm', input, title),
  prompt: (input: MessageBoxInput, title?: string) => openWithVariant('prompt', input, title),
  closeAll: closeAllMessageBoxes,
  destroyAll: closeAllMessageBoxes
})
