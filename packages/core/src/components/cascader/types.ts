export interface YCascaderOption {
  value: string
  label: string
  disabled?: boolean
  isLeaf?: boolean
  children?: YCascaderOption[]
  [key: string]: unknown
}

export type YCascaderValue = string[]
export type YCascaderMultipleValue = string[][]

export interface YCascaderColumn {
  level: number
  options: YCascaderOption[]
}

export interface YCascaderSelectPayload {
  value: YCascaderValue
  labels: string[]
  option: YCascaderOption
}

export interface YCascaderMultipleSelectPayload {
  value: YCascaderMultipleValue
  labels: string[][]
  option: YCascaderOption
  checked: boolean
  checkedValue: YCascaderValue
}

export type YCascaderLoadChildren = (
  option: YCascaderOption,
  path: YCascaderOption[]
) => YCascaderOption[] | Promise<YCascaderOption[]>

export interface YCascaderLoadPayload {
  option: YCascaderOption
  path: YCascaderOption[]
  children: YCascaderOption[]
}

export interface YCascaderLoadErrorPayload {
  option: YCascaderOption
  path: YCascaderOption[]
  error: unknown
}
