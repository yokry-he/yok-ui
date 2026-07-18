import { createFocusTrap, type FocusTrap } from 'focus-trap'
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

let scrollLockCount = 0
let previousBodyOverflow = ''
const overlayTrapStack: FocusTrap[] = []

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

export function useOverlayA11y(options: UseOverlayA11yOptions) {
  let isActive = false
  let focusTrap: FocusTrap | null = null
  const layer = useLayerStack({
    open: options.open,
    type: 'overlay',
    elements: [options.container]
  })

  const shouldRestoreFocus = () => unref(options.restoreFocus ?? true)
  const shouldLockScroll = () => unref(options.lockScroll ?? true)
  const shouldCloseOnEscape = () => unref(options.closeOnEscape ?? true)

  function createOverlayTrap(container: HTMLElement) {
    return createFocusTrap(container, {
      fallbackFocus: container,
      initialFocus: undefined,
      returnFocusOnDeactivate: shouldRestoreFocus(),
      delayInitialFocus: false,
      delayReturnFocus: false,
      escapeDeactivates: false,
      allowOutsideClick: true,
      trapStack: overlayTrapStack,
      tabbableOptions: {
        displayCheck: 'none'
      }
    })
  }

  function focusOverlay() {
    const container = options.container.value

    if (!container) {
      return
    }

    focusTrap?.updateContainerElements(container)
    container.focus()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && shouldCloseOnEscape() && layer.isTopLayer.value) {
      event.stopPropagation()
      options.onClose()
    }
  }

  function activate() {
    if (isActive || typeof document === 'undefined') {
      return
    }

    isActive = true
    document.addEventListener('keydown', handleKeydown)

    if (shouldLockScroll()) {
      lockBodyScroll()
    }

    void nextTick(() => {
      const container = options.container.value

      if (!options.open.value || !container) {
        return
      }

      // Focus trapping is delegated to focus-trap so nested overlays, dynamic
      // tabbables, and fallback focus behave like mature component libraries.
      focusTrap = createOverlayTrap(container)
      focusTrap.activate()

      if (!focusTrap.active) {
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
    focusTrap?.deactivate({ returnFocus: shouldRestoreFocus() })
    focusTrap = null

    if (shouldLockScroll()) {
      unlockBodyScroll()
    }
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
