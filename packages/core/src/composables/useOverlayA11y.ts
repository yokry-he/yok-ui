import { nextTick, onBeforeUnmount, unref, watch, type MaybeRef, type Ref } from 'vue'
import { useLayerStack } from './useLayerStack'

interface UseOverlayA11yOptions {
  open: Ref<boolean>
  container: Ref<HTMLElement | null>
  onClose: () => void
  closeOnEscape?: MaybeRef<boolean>
  lockScroll?: MaybeRef<boolean>
  restoreFocus?: MaybeRef<boolean>
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

let scrollLockCount = 0
let previousBodyOverflow = ''

function lockBodyScroll() {
  if (typeof document === 'undefined') {
    return
  }

  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  scrollLockCount += 1
}

function unlockBodyScroll() {
  if (typeof document === 'undefined' || scrollLockCount === 0) {
    return
  }

  scrollLockCount -= 1

  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = ''
  }
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    return element.getAttribute('aria-hidden') !== 'true' && element.tabIndex !== -1
  })
}

export function useOverlayA11y(options: UseOverlayA11yOptions) {
  let previouslyFocusedElement: HTMLElement | null = null
  let isActive = false
  const layer = useLayerStack({
    open: options.open,
    type: 'overlay',
    elements: [options.container]
  })

  const shouldRestoreFocus = () => unref(options.restoreFocus ?? true)
  const shouldLockScroll = () => unref(options.lockScroll ?? true)
  const shouldCloseOnEscape = () => unref(options.closeOnEscape ?? true)

  function focusOverlay() {
    const container = options.container.value

    if (!container) {
      return
    }

    const focusableElements = getFocusableElements(container)
    const initialFocusTarget = focusableElements[0] ?? container
    initialFocusTarget.focus()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!options.open.value) {
      return
    }

    const container = options.container.value

    if (!container) {
      return
    }

    if (event.key === 'Escape' && shouldCloseOnEscape() && layer.isTopLayer.value) {
      event.stopPropagation()
      options.onClose()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const focusableElements = getFocusableElements(container)

    if (focusableElements.length === 0) {
      event.preventDefault()
      container.focus()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement

    if (event.shiftKey && (activeElement === firstElement || !container.contains(activeElement))) {
      event.preventDefault()
      lastElement.focus()
      return
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  function activate() {
    if (isActive || typeof document === 'undefined') {
      return
    }

    isActive = true
    previouslyFocusedElement = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', handleKeydown)

    if (shouldLockScroll()) {
      lockBodyScroll()
    }

    void nextTick(() => {
      if (options.open.value) {
        focusOverlay()
      }
    })
  }

  function deactivate() {
    if (!isActive || typeof document === 'undefined') {
      return
    }

    isActive = false
    document.removeEventListener('keydown', handleKeydown)

    if (shouldLockScroll()) {
      unlockBodyScroll()
    }

    if (shouldRestoreFocus() && previouslyFocusedElement?.isConnected) {
      previouslyFocusedElement.focus()
    }

    previouslyFocusedElement = null
  }

  watch(
    options.open,
    (open) => {
      if (open) {
        activate()
        return
      }

      deactivate()
    },
    { immediate: true }
  )

  onBeforeUnmount(deactivate)

  return {
    focusOverlay,
    layerStyle: layer.layerStyle,
    zIndex: layer.zIndex,
    isTopLayer: layer.isTopLayer
  }
}
