import { computed, onBeforeUnmount, readonly, ref, unref, watch, type CSSProperties, type MaybeRef, type Ref } from 'vue'

export type YLayerType = 'floating' | 'overlay' | 'toast'

interface UseLayerStackOptions {
  open: Ref<boolean>
  type?: MaybeRef<YLayerType>
  elements?: Array<Ref<HTMLElement | null>>
  baseZIndex?: MaybeRef<number>
}

interface LayerStackEntry {
  id: number
  order: number
  type: YLayerType
  elements: Array<Ref<HTMLElement | null>>
  zIndex: number
}

const layerBaseZIndex: Record<YLayerType, number> = {
  floating: 1000,
  overlay: 2000,
  toast: 3000
}

const activeLayers = ref<LayerStackEntry[]>([])
let layerIdSeed = 0
let layerOrderSeed = 0

function containsEventTarget(element: HTMLElement | null, target: EventTarget | null) {
  return Boolean(element && target instanceof Node && element.contains(target))
}

function isTargetInsideLayer(entry: LayerStackEntry, target: EventTarget | null) {
  return entry.elements.some((element) => containsEventTarget(element.value, target))
}

export function isTargetInsideHigherLayer(layerId: number, target: EventTarget | null) {
  const currentLayer = activeLayers.value.find((entry) => entry.id === layerId)

  if (!currentLayer) {
    return false
  }

  return activeLayers.value.some((entry) => {
    return entry.order > currentLayer.order && isTargetInsideLayer(entry, target)
  })
}

export function useLayerStack(options: UseLayerStackOptions) {
  const layerId = layerIdSeed += 1
  const zIndex = ref<number>()
  const type = computed(() => unref(options.type ?? 'floating'))
  const baseZIndex = computed(() => unref(options.baseZIndex ?? layerBaseZIndex[type.value]))

  function activate() {
    if (activeLayers.value.some((entry) => entry.id === layerId)) {
      return
    }

    const order = layerOrderSeed += 1
    const entry: LayerStackEntry = {
      id: layerId,
      order,
      type: type.value,
      elements: options.elements ?? [],
      zIndex: baseZIndex.value + order
    }

    activeLayers.value = [...activeLayers.value, entry]
    zIndex.value = entry.zIndex
  }

  function deactivate() {
    if (!activeLayers.value.some((entry) => entry.id === layerId)) {
      return
    }

    activeLayers.value = activeLayers.value.filter((entry) => entry.id !== layerId)
    zIndex.value = undefined
  }

  watch(options.open, (open) => {
    if (open) {
      activate()
      return
    }

    deactivate()
  }, { immediate: true })

  onBeforeUnmount(deactivate)

  const isTopLayer = computed(() => {
    const sortedLayers = [...activeLayers.value].sort((left, right) => left.order - right.order)

    return sortedLayers[sortedLayers.length - 1]?.id === layerId
  })
  const layerStyle = computed<CSSProperties>(() => zIndex.value ? { zIndex: zIndex.value } : {})

  return {
    layerId,
    zIndex: readonly(zIndex),
    isTopLayer,
    layerStyle
  }
}
