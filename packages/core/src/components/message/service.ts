import { createApp, h, reactive } from 'vue'
import YMessage from './YMessage.vue'

export type YMessageTone = 'info' | 'success' | 'warning' | 'danger'

export interface YMessageOptions {
  id?: string
  tone?: YMessageTone
  title?: string
  content: string
  duration?: number
  closable?: boolean
  closeLabel?: string
  container?: HTMLElement
  onClose?: () => void
}

export interface YMessageHandle {
  id: string
  close: () => void
  update: (options: Partial<Omit<YMessageOptions, 'id' | 'container'>>) => void
}

type MessageInput = string | YMessageOptions

interface MessageInstance {
  id: string
  host: HTMLElement
  app: ReturnType<typeof createApp>
  close: () => void
  timer?: number
  container: HTMLElement
}

const DEFAULT_DURATION = 3000

let seed = 0
let defaultContainer: HTMLElement | null = null
const instances: MessageInstance[] = []

function canUseDom() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function normalizeOptions(input: MessageInput, tone?: YMessageTone): Required<Pick<YMessageOptions, 'id' | 'tone' | 'content' | 'duration' | 'closable' | 'closeLabel'>> &
  Omit<YMessageOptions, 'id' | 'tone' | 'content' | 'duration' | 'closable' | 'closeLabel'> {
  const raw = typeof input === 'string' ? { content: input } : input

  return {
    ...raw,
    id: raw.id ?? `yok-message-${++seed}`,
    tone: raw.tone ?? tone ?? 'info',
    content: raw.content,
    duration: raw.duration ?? DEFAULT_DURATION,
    closable: raw.closable ?? true,
    closeLabel: raw.closeLabel ?? 'Close message'
  }
}

function ensureDefaultContainer() {
  if (!defaultContainer) {
    defaultContainer = document.createElement('div')
    defaultContainer.className = 'yok-message-stack'
    defaultContainer.setAttribute('data-yok-message-stack', '')
    document.body.append(defaultContainer)
  }

  return defaultContainer
}

function resolveRole(tone: YMessageTone): 'status' | 'alert' {
  return tone === 'danger' || tone === 'warning' ? 'alert' : 'status'
}

function cleanupDefaultContainer(container: HTMLElement) {
  if (container === defaultContainer && defaultContainer.childElementCount === 0) {
    defaultContainer.remove()
    defaultContainer = null
  }
}

function createNoopHandle(options: ReturnType<typeof normalizeOptions>): YMessageHandle {
  return {
    id: options.id,
    close: () => undefined,
    update: () => undefined
  }
}

export function openMessage(input: MessageInput): YMessageHandle {
  const options = normalizeOptions(input)

  if (!canUseDom()) {
    return createNoopHandle(options)
  }

  const state = reactive({ ...options })
  const container = options.container ?? ensureDefaultContainer()
  const host = document.createElement('div')
  host.className = 'yok-message-stack__item'
  host.setAttribute('data-yok-message-id', options.id)
  container.append(host)

  let closed = false
  let timer: MessageInstance['timer']

  const close = () => {
    if (closed) {
      return
    }

    closed = true

    if (timer) {
      window.clearTimeout(timer)
    }

    app.unmount()
    host.remove()

    const index = instances.findIndex((instance) => instance.id === options.id)
    if (index >= 0) {
      instances.splice(index, 1)
    }

    options.onClose?.()
    cleanupDefaultContainer(container)
  }

  const app = createApp({
    name: 'YMessageServiceItem',
    render() {
      return h(
        YMessage,
        {
          tone: state.tone,
          title: state.title,
          closable: state.closable,
          closeLabel: state.closeLabel,
          role: resolveRole(state.tone),
          onClose: close
        },
        {
          default: () => state.content
        }
      )
    }
  })

  app.mount(host)

  if (options.duration > 0) {
    timer = window.setTimeout(close, options.duration)
  }

  instances.push({
    id: options.id,
    host,
    app,
    close,
    timer,
    container
  })

  return {
    id: options.id,
    close,
    update(nextOptions) {
      Object.assign(state, nextOptions)
    }
  }
}

function openWithTone(tone: YMessageTone, input: MessageInput) {
  return openMessage(typeof input === 'string' ? { content: input, tone } : { ...input, tone })
}

export function closeAllMessages() {
  ;[...instances].forEach((instance) => instance.close())
}

export const message = Object.assign(openMessage, {
  open: openMessage,
  info: (input: MessageInput) => openWithTone('info', input),
  success: (input: MessageInput) => openWithTone('success', input),
  warning: (input: MessageInput) => openWithTone('warning', input),
  danger: (input: MessageInput) => openWithTone('danger', input),
  closeAll: closeAllMessages
})
