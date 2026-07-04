export interface UseNamespaceReturn {
  namespace: string
  block: string
  b: (suffix?: string) => string
  e: (element?: string) => string
  m: (modifier?: string) => string
  be: (suffix?: string, element?: string) => string
  bm: (suffix?: string, modifier?: string) => string
  em: (element?: string, modifier?: string) => string
  bem: (suffix?: string, element?: string, modifier?: string) => string
  is: (name: string, state?: boolean) => string
}

export function useNamespace(block: string, namespace = 'yok'): UseNamespaceReturn {
  const prefixedBlock = `${namespace}-${block}`
  const b = (suffix = '') => suffix ? `${prefixedBlock}-${suffix}` : prefixedBlock
  const e = (element = '') => element ? `${prefixedBlock}__${element}` : ''
  const m = (modifier = '') => modifier ? `${prefixedBlock}--${modifier}` : ''
  const be = (suffix = '', element = '') => suffix && element ? `${b(suffix)}__${element}` : ''
  const bm = (suffix = '', modifier = '') => suffix && modifier ? `${b(suffix)}--${modifier}` : ''
  const em = (element = '', modifier = '') => element && modifier ? `${e(element)}--${modifier}` : ''
  const bem = (suffix = '', element = '', modifier = '') =>
    suffix && element && modifier ? `${b(suffix)}__${element}--${modifier}` : ''
  const is = (name: string, state = true) => state ? `is-${name}` : ''

  return {
    namespace,
    block,
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is
  }
}
