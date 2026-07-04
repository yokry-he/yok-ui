import type { YCascaderColumn, YCascaderMultipleValue, YCascaderOption, YCascaderValue } from './types'

export function getOptionChildren(option: YCascaderOption) {
  return option.children ?? []
}

export function isLeafOption(option: YCascaderOption) {
  return getOptionChildren(option).length === 0
}

export function findOptionPath(options: YCascaderOption[], value: string[]): YCascaderOption[] {
  const path: YCascaderOption[] = []
  let currentOptions = options

  for (const segment of value) {
    const option = currentOptions.find((item) => item.value === segment)

    if (!option) {
      return []
    }

    path.push(option)
    currentOptions = getOptionChildren(option)
  }

  return path
}

export function isSameCascaderValue(first: YCascaderValue, second: YCascaderValue) {
  return first.length === second.length && first.every((segment, index) => segment === second[index])
}

export function isCascaderValueSelected(value: YCascaderValue, selectedValues: YCascaderMultipleValue) {
  return selectedValues.some((selectedValue) => isSameCascaderValue(selectedValue, value))
}

export function getValidMultipleCascaderValue(options: YCascaderOption[], values: YCascaderMultipleValue) {
  return values.filter((value) => findOptionPath(options, value).length > 0)
}

export function getPathLabels(path: YCascaderOption[]) {
  return path.map((option) => option.label)
}

export function getPathValue(path: YCascaderOption[]) {
  return path.map((option) => option.value)
}

export function getMultiplePathLabels(options: YCascaderOption[], values: YCascaderMultipleValue) {
  return getValidMultipleCascaderValue(options, values)
    .map((value) => getPathLabels(findOptionPath(options, value)))
}

export function toggleCascaderValue(selectedValues: YCascaderMultipleValue, value: YCascaderValue) {
  const selected = isCascaderValueSelected(value, selectedValues)

  return selected
    ? selectedValues.filter((selectedValue) => !isSameCascaderValue(selectedValue, value))
    : [...selectedValues, value]
}

export function createCascaderColumns(options: YCascaderOption[], activePath: YCascaderOption[]): YCascaderColumn[] {
  const columns: YCascaderColumn[] = [
    {
      level: 0,
      options
    }
  ]

  activePath.forEach((option, index) => {
    const children = getOptionChildren(option)

    if (children.length) {
      columns.push({
        level: index + 1,
        options: children
      })
    }
  })

  return columns
}
