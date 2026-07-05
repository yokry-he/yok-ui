export type YGridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type YGridGutterSize = number | string
export type YGridResponsiveGutter = Partial<Record<YGridBreakpoint, YGridGutterSize>>
export type YGridGutter = YGridGutterSize | YGridResponsiveGutter | [YGridGutterSize | YGridResponsiveGutter, YGridGutterSize | YGridResponsiveGutter]
export type YGridJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type YGridAlign = 'top' | 'middle' | 'bottom' | 'stretch'
export type YGridElement = 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav' | 'ul' | 'ol' | 'li'

export interface YColBreakpointConfig {
  span?: number
  offset?: number
  order?: number
  push?: number
  pull?: number
}

export type YColResponsiveValue = number | YColBreakpointConfig

export const gridBreakpoints: YGridBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

export function toGridSize(value: YGridGutterSize) {
  return typeof value === 'number' ? `${value}px` : value
}

export function normalizeGridNumber(value: number | undefined, min = 0, max = 24) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return undefined
  }

  return Math.min(max, Math.max(min, Math.round(value)))
}

export function resolveResponsiveConfig(value: YColResponsiveValue | undefined): YColBreakpointConfig | undefined {
  if (typeof value === 'number') {
    return { span: normalizeGridNumber(value) }
  }

  return value
}

export function createColVariableStyles(prefix: string, config: YColBreakpointConfig, styles: Record<string, string | number>) {
  const span = normalizeGridNumber(config.span)
  const offset = normalizeGridNumber(config.offset)
  const order = typeof config.order === 'number' && !Number.isNaN(config.order) ? Math.round(config.order) : undefined
  const push = normalizeGridNumber(config.push)
  const pull = normalizeGridNumber(config.pull)

  if (span !== undefined) {
    styles[`--yok-col-span-${prefix}`] = span
  }

  if (offset !== undefined) {
    styles[`--yok-col-offset-${prefix}`] = offset
  }

  if (order !== undefined) {
    styles[`--yok-col-order-${prefix}`] = order
  }

  if (push !== undefined) {
    styles[`--yok-col-push-${prefix}`] = push
  }

  if (pull !== undefined) {
    styles[`--yok-col-pull-${prefix}`] = pull
  }
}
