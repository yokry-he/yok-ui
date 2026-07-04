import {
  isRef,
  onScopeDispose,
  watchEffect,
  type Ref
} from 'vue'

export type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)

function resolveMaybeRefOrGetter<T>(value: MaybeRefOrGetter<T>): T {
  if (typeof value === 'function') {
    return (value as () => T)()
  }

  return isRef(value) ? value.value : value
}

export function useEventListener<K extends keyof WindowEventMap>(
  target: MaybeRefOrGetter<Window | null | undefined>,
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void
export function useEventListener(
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): () => void
export function useEventListener(
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
) {
  const stop = watchEffect((onCleanup) => {
    const resolvedTarget = resolveMaybeRefOrGetter(target)

    if (!resolvedTarget) {
      return
    }

    resolvedTarget.addEventListener(type, listener, options)
    onCleanup(() => {
      resolvedTarget.removeEventListener(type, listener, options)
    })
  })

  onScopeDispose(stop)

  return stop
}
