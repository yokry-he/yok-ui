import {
  computed,
  ref,
  type ComputedRef,
  type Ref
} from 'vue'

export interface UseControlledStateOptions<T> {
  value?: Ref<T> | ComputedRef<T>
  defaultValue?: T
  onChange?: (value: T) => void
}

export interface UseControlledStateReturn<T> {
  value: ComputedRef<T>
  isControlled: ComputedRef<boolean>
  setValue: (value: T) => void
}

export function useControlledState<T>(
  options: UseControlledStateOptions<T>
): UseControlledStateReturn<T> {
  const localValue = ref(options.defaultValue) as Ref<T>
  const isControlled = computed(() => options.value !== undefined)
  const value = computed(() => isControlled.value ? options.value!.value : localValue.value)

  function setValue(nextValue: T) {
    if (!isControlled.value) {
      localValue.value = nextValue
    }

    options.onChange?.(nextValue)
  }

  return {
    value,
    isControlled,
    setValue
  }
}
