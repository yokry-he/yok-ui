import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Middleware,
  type Placement,
  type Strategy
} from '@floating-ui/vue'
import { computed, type Ref } from 'vue'

export type YFloatingPlacement = Placement

interface UseFloatingLayerOptions {
  open?: Ref<boolean>
  placement?: Ref<Placement>
  offset?: number
  shiftPadding?: number
  strategy?: Strategy
  middleware?: Ref<Middleware[]>
  matchReferenceWidth?: boolean
}

export function useFloatingLayer(
  reference: Ref<HTMLElement | null>,
  floating: Ref<HTMLElement | null>,
  options: UseFloatingLayerOptions = {}
) {
  const middleware = computed(() => {
    const middlewareList: Middleware[] = [
      offset(options.offset ?? 8),
      flip({ padding: options.shiftPadding ?? 8 }),
      shift({ padding: options.shiftPadding ?? 8 })
    ]

    if (options.matchReferenceWidth) {
      middlewareList.push(size({
        apply({ elements, rects }) {
          elements.floating.style.setProperty('--yok-floating-reference-width', `${rects.reference.width}px`)
        }
      }))
    }

    return [
      ...middlewareList,
      ...(options.middleware?.value ?? [])
    ]
  })

  return useFloating(reference, floating, {
    open: options.open,
    placement: options.placement,
    strategy: options.strategy ?? 'fixed',
    middleware,
    transform: false,
    whileElementsMounted: autoUpdate
  })
}
