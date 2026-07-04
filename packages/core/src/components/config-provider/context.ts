import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

export type YokConfigSize = 'sm' | 'md' | 'lg'
export type YokConfigDensity = 'comfortable' | 'compact'

export interface YokConfigContext {
  size: ComputedRef<YokConfigSize>
  density: ComputedRef<YokConfigDensity>
  locale: ComputedRef<string>
  namespace: ComputedRef<string>
}

export interface YokConfigProviderProps {
  size?: YokConfigSize
  density?: YokConfigDensity
  locale?: string
  namespace?: string
}

export const defaultYokConfig = {
  size: 'md',
  density: 'comfortable',
  locale: 'en-US',
  namespace: 'yok'
} satisfies Required<YokConfigProviderProps>

export const yokConfigInjectionKey: InjectionKey<YokConfigContext> = Symbol('yok-config')

export function createDefaultYokConfig(): YokConfigContext {
  return {
    size: computed(() => defaultYokConfig.size),
    density: computed(() => defaultYokConfig.density),
    locale: computed(() => defaultYokConfig.locale),
    namespace: computed(() => defaultYokConfig.namespace)
  }
}

export function useYokConfig() {
  return inject(yokConfigInjectionKey, createDefaultYokConfig())
}
