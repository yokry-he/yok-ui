import type { YTransferOption } from './types'

export function createTransferValueSet(value: string[]) {
  return new Set(value)
}

export function splitTransferOptions(options: YTransferOption[], value: string[]) {
  const valueSet = createTransferValueSet(value)

  return {
    source: options.filter((option) => !valueSet.has(option.value)),
    target: options.filter((option) => valueSet.has(option.value))
  }
}

export function filterTransferOptions(options: YTransferOption[], query: string) {
  const keyword = query.trim().toLowerCase()

  if (!keyword) {
    return options
  }

  return options.filter((option) => {
    const text = `${option.label} ${option.value} ${option.description ?? ''}`.toLowerCase()

    return text.includes(keyword)
  })
}

export function getEnabledTransferKeys(options: YTransferOption[]) {
  return options.filter((option) => !option.disabled).map((option) => option.value)
}

export function mergeTransferValues(current: string[], movedKeys: string[]) {
  const next = new Set(current)

  movedKeys.forEach((key) => next.add(key))

  return Array.from(next)
}

export function removeTransferValues(current: string[], movedKeys: string[]) {
  const movedSet = new Set(movedKeys)

  return current.filter((key) => !movedSet.has(key))
}
