export interface YTransferOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export type YTransferDirection = 'left' | 'right'

export interface YTransferChangePayload {
  value: string[]
  movedKeys: string[]
  direction: YTransferDirection
}

export interface YTransferCheckPayload {
  checkedKeys: string[]
  direction: YTransferDirection
}
