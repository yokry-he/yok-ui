import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'
import type { YokThemeName, YokThemeTokens } from '@yok-ui/themes'
import type {
  YButtonNativeType,
  YButtonType,
  YButtonVariant
} from '../button/types'
import {
  resolveYokFontFamily,
  type YokFontInput
} from './fonts'
import {
  resolveYokLocale,
  translateYokLocale,
  type YokLocale,
  type YokLocaleDirection,
  type YokLocaleInput,
  type YokLocaleParams
} from './locale'

export type YokConfigSize = 'sm' | 'md' | 'lg'
export type YokConfigDensity = 'comfortable' | 'compact'
export type YokConfigDirection = YokLocaleDirection | 'auto'

export interface YokButtonConfig {
  type?: YButtonType
  variant?: YButtonVariant
  nativeType?: YButtonNativeType
  plain?: boolean
  text?: boolean
  round?: boolean
  dashed?: boolean
  autoInsertSpace?: boolean
}

export interface YokConfigContext {
  size: ComputedRef<YokConfigSize>
  density: ComputedRef<YokConfigDensity>
  locale: ComputedRef<string>
  localePack: ComputedRef<YokLocale>
  directionMode: ComputedRef<YokConfigDirection>
  direction: ComputedRef<YokLocaleDirection>
  namespace: ComputedRef<string>
  theme: ComputedRef<YokThemeName>
  font: ComputedRef<YokFontInput>
  fontFamily: ComputedRef<string>
  zIndex: ComputedRef<number>
  tokens: ComputedRef<YokThemeTokens | undefined>
  button: ComputedRef<Readonly<YokButtonConfig>>
  t: (key: string, params?: YokLocaleParams) => string
}

export interface YokConfigProviderProps {
  size?: YokConfigSize
  density?: YokConfigDensity
  locale?: YokLocaleInput
  direction?: YokConfigDirection
  namespace?: string
  theme?: YokThemeName
  font?: YokFontInput
  zIndex?: number
  tokens?: YokThemeTokens
  button?: YokButtonConfig
}

export type YokConfigOptions = YokConfigProviderProps

export const defaultYokConfig = Object.freeze({
  size: 'md',
  density: 'comfortable',
  locale: 'en-US',
  direction: 'auto',
  namespace: 'yok',
  theme: 'yok-light',
  font: 'system',
  zIndex: 2000,
  button: Object.freeze({})
} satisfies Omit<Required<YokConfigProviderProps>, 'tokens'>)

export const yokConfigInjectionKey: InjectionKey<YokConfigContext> = Symbol('yok-config')

export function createYokConfigContext(
  options: YokConfigOptions = {},
  parent?: YokConfigContext
): YokConfigContext {
  const size = computed(() => options.size ?? parent?.size.value ?? defaultYokConfig.size)
  const density = computed(() => options.density ?? parent?.density.value ?? defaultYokConfig.density)
  const localePack = computed(() =>
    options.locale === undefined
      ? parent?.localePack.value ?? resolveYokLocale(defaultYokConfig.locale)
      : resolveYokLocale(options.locale)
  )
  const locale = computed(() => localePack.value.name)
  const directionMode = computed(() =>
    options.direction ?? parent?.directionMode.value ?? defaultYokConfig.direction
  )
  const direction = computed<YokLocaleDirection>(() =>
    directionMode.value === 'auto' ? localePack.value.direction : directionMode.value
  )
  const namespace = computed(() =>
    options.namespace ?? parent?.namespace.value ?? defaultYokConfig.namespace
  )
  const theme = computed(() => options.theme ?? parent?.theme.value ?? defaultYokConfig.theme)
  const font = computed(() => options.font ?? parent?.font.value ?? defaultYokConfig.font)
  const fontFamily = computed(() => resolveYokFontFamily(font.value))
  const zIndex = computed(() => options.zIndex ?? parent?.zIndex.value ?? defaultYokConfig.zIndex)
  const tokens = computed(() => options.tokens ?? parent?.tokens.value)
  const button = computed<Readonly<YokButtonConfig>>(() => Object.freeze({
    ...parent?.button.value,
    ...options.button
  }))

  return {
    size,
    density,
    locale,
    localePack,
    directionMode,
    direction,
    namespace,
    theme,
    font,
    fontFamily,
    zIndex,
    tokens,
    button,
    t: (key, params) => translateYokLocale(localePack.value, key, params)
  }
}

export function createDefaultYokConfig(): YokConfigContext {
  return createYokConfigContext()
}

export function useYokConfig() {
  return inject(yokConfigInjectionKey, createDefaultYokConfig())
}
