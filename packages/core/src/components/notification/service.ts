import { createApp, h, reactive } from 'vue'
import YNotification, { type YNotificationRole, type YNotificationTone } from './YNotification.vue'

export type YNotificationPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface YNotificationOptions {
  id?: string
  tone?: YNotificationTone
  title?: string
  content: string
  duration?: number
  closable?: boolean
  closeLabel?: string
  placement?: YNotificationPlacement
  offset?: number
  container?: HTMLElement
  onClose?: () => void
  onClick?: () => void
}

export interface YNotificationHandle {
  id: string
  close: () => void
  update: (options: Partial<Omit<YNotificationOptions, 'id' | 'container'>>) => void
}

type NotificationInput = string | YNotificationOptions

interface NotificationInstance {
  id: string
  host: HTMLElement
  app: ReturnType<typeof createApp>
  close: () => void
  timer?: number
  container: HTMLElement
  stack: HTMLElement
}

const DEFAULT_DURATION = 4500
const DEFAULT_OFFSET = 24

let seed = 0
const defaultStacks = new Map<YNotificationPlacement, HTMLElement>()
const instances: NotificationInstance[] = []

function canUseDom() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function normalizeOptions(input: NotificationInput, tone?: YNotificationTone): Required<Pick<YNotificationOptions, 'id' | 'tone' | 'content' | 'duration' | 'closable' | 'closeLabel' | 'placement' | 'offset'>> &
  Omit<YNotificationOptions, 'id' | 'tone' | 'content' | 'duration' | 'closable' | 'closeLabel' | 'placement' | 'offset'> {
  const raw = typeof input === 'string' ? { content: input } : input

  return {
    ...raw,
    id: raw.id ?? `yok-notification-${++seed}`,
    tone: raw.tone ?? tone ?? 'info',
    content: raw.content,
    duration: raw.duration ?? DEFAULT_DURATION,
    closable: raw.closable ?? true,
    closeLabel: raw.closeLabel ?? 'Close notification',
    placement: raw.placement ?? 'top-right',
    offset: raw.offset ?? DEFAULT_OFFSET
  }
}

function applyStackStyle(stack: HTMLElement, placement: YNotificationPlacement, offset: number) {
  stack.style.position = 'fixed'
  stack.style.zIndex = 'var(--yok-zIndex-toast, 3000)'
  stack.style.display = 'grid'
  stack.style.gap = '12px'
  stack.style.pointerEvents = 'none'
  stack.style.maxWidth = 'calc(100vw - 32px)'

  if (placement.startsWith('top')) {
    stack.style.top = `${offset}px`
    stack.style.bottom = ''
  } else {
    stack.style.bottom = `${offset}px`
    stack.style.top = ''
  }

  if (placement.endsWith('right')) {
    stack.style.right = '24px'
    stack.style.left = ''
  } else {
    stack.style.left = '24px'
    stack.style.right = ''
  }
}

function ensureStack(placement: YNotificationPlacement, offset: number, container?: HTMLElement) {
  if (container) {
    const scopedStack = document.createElement('div')
    scopedStack.className = `yok-notification-stack yok-notification-stack--${placement}`
    scopedStack.setAttribute('data-yok-notification-stack', placement)
    applyStackStyle(scopedStack, placement, offset)
    container.append(scopedStack)

    return scopedStack
  }

  let stack = defaultStacks.get(placement)

  if (!stack) {
    stack = document.createElement('div')
    stack.className = `yok-notification-stack yok-notification-stack--${placement}`
    stack.setAttribute('data-yok-notification-stack', placement)
    document.body.append(stack)
    defaultStacks.set(placement, stack)
  }

  applyStackStyle(stack, placement, offset)

  return stack
}

function resolveRole(tone: YNotificationTone): YNotificationRole {
  return tone === 'danger' || tone === 'warning' ? 'alert' : 'status'
}

function cleanupStack(stack: HTMLElement, placement: YNotificationPlacement, scopedContainer?: HTMLElement) {
  if (stack.childElementCount > 0) {
    return
  }

  stack.remove()

  if (!scopedContainer) {
    defaultStacks.delete(placement)
  }
}

function createNoopHandle(options: ReturnType<typeof normalizeOptions>): YNotificationHandle {
  return {
    id: options.id,
    close: () => undefined,
    update: () => undefined
  }
}

export function openNotification(input: NotificationInput): YNotificationHandle {
  const options = normalizeOptions(input)

  if (!canUseDom()) {
    return createNoopHandle(options)
  }

  const state = reactive({ ...options })
  const stack = ensureStack(options.placement, options.offset, options.container)
  const host = document.createElement('div')
  host.className = 'yok-notification-stack__item'
  host.setAttribute('data-yok-notification-id', options.id)
  host.style.pointerEvents = 'auto'
  stack.append(host)

  let closed = false
  let timer: NotificationInstance['timer']

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
    cleanupStack(stack, options.placement, options.container)
  }

  const app = createApp({
    name: 'YNotificationServiceItem',
    render() {
      return h(
        YNotification,
        {
          tone: state.tone,
          title: state.title,
          closable: state.closable,
          closeLabel: state.closeLabel,
          role: resolveRole(state.tone),
          onClose: close,
          onClick: state.onClick
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
    container: options.container ?? document.body,
    stack
  })

  return {
    id: options.id,
    close,
    update(nextOptions) {
      Object.assign(state, nextOptions)
    }
  }
}

function openWithTone(tone: YNotificationTone, input: NotificationInput) {
  return openNotification(typeof input === 'string' ? { content: input, tone } : { ...input, tone })
}

export function closeAllNotifications() {
  ;[...instances].forEach((instance) => instance.close())
}

export const notification = Object.assign(openNotification, {
  open: openNotification,
  info: (input: NotificationInput) => openWithTone('info', input),
  success: (input: NotificationInput) => openWithTone('success', input),
  warning: (input: NotificationInput) => openWithTone('warning', input),
  danger: (input: NotificationInput) => openWithTone('danger', input),
  closeAll: closeAllNotifications
})
