import type { ComputedRef, InjectionKey } from 'vue'
import type { YButtonSize, YButtonType } from './types'

export interface YButtonGroupContext {
  size: ComputedRef<YButtonSize | undefined>
  type: ComputedRef<YButtonType | undefined>
}

export const yokButtonGroupInjectionKey: InjectionKey<YButtonGroupContext> = Symbol('yok-button-group')
