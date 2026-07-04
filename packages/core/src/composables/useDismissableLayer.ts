import { onBeforeUnmount, unref, watch, type MaybeRef, type Ref } from 'vue'
import { isTargetInsideHigherLayer, useLayerStack, type YLayerType } from './useLayerStack'

interface UseDismissableLayerOptions {
  open: Ref<boolean>
  reference: Ref<HTMLElement | null>
  floating: Ref<HTMLElement | null>
  onDismiss: (event: Event) => void
  closeOnEscape?: MaybeRef<boolean>
  closeOnOutsidePointer?: MaybeRef<boolean>
  layerType?: MaybeRef<YLayerType>
  baseZIndex?: MaybeRef<number>
}

function containsEventTarget(element: HTMLElement | null, target: EventTarget | null) {
  return Boolean(element && target instanceof Node && element.contains(target))
}

export function useDismissableLayer(options: UseDismissableLayerOptions) {
  let isActive = false
  const layer = useLayerStack({
    open: options.open,
    type: options.layerType ?? 'floating',
    elements: [options.reference, options.floating],
    baseZIndex: options.baseZIndex
  })

  const shouldCloseOnEscape = () => unref(options.closeOnEscape ?? true)
  const shouldCloseOnOutsidePointer = () => unref(options.closeOnOutsidePointer ?? true)

  function handlePointerDown(event: Event) {
    if (!options.open.value || !shouldCloseOnOutsidePointer()) {
      return
    }

    if (
      containsEventTarget(options.reference.value, event.target) ||
      containsEventTarget(options.floating.value, event.target) ||
      isTargetInsideHigherLayer(layer.layerId, event.target)
    ) {
      return
    }

    options.onDismiss(event)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!options.open.value || !shouldCloseOnEscape() || event.key !== 'Escape' || !layer.isTopLayer.value) {
      return
    }

    event.stopPropagation()
    options.onDismiss(event)
  }

  function activate() {
    if (isActive || typeof document === 'undefined') {
      return
    }

    isActive = true
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeydown, true)
  }

  function deactivate() {
    if (!isActive || typeof document === 'undefined') {
      return
    }

    isActive = false
    document.removeEventListener('pointerdown', handlePointerDown, true)
    document.removeEventListener('keydown', handleKeydown, true)
  }

  watch(options.open, (open) => {
    if (open) {
      activate()
      return
    }

    deactivate()
  }, { immediate: true })

  onBeforeUnmount(deactivate)

  return {
    layerStyle: layer.layerStyle,
    zIndex: layer.zIndex,
    isTopLayer: layer.isTopLayer
  }
}
