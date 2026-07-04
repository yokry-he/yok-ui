export interface YTreeNode {
  key: string
  label: string
  disabled?: boolean
  isLeaf?: boolean
  children?: YTreeNode[]
  [key: string]: unknown
}

export interface YTreeFlatNode {
  node: YTreeNode
  key: string
  label: string
  level: number
  index: number
  parentKey?: string
  expanded: boolean
  selected: boolean
  disabled: boolean
  hasChildren: boolean
}

export interface YTreeCheckState {
  checked: boolean
  indeterminate: boolean
}

export type YTreeDropType = 'before' | 'inside' | 'after'

export type YTreeAllowDrop = (payload: {
  draggingNode: YTreeNode
  dropNode: YTreeNode
  type: YTreeDropType
}) => boolean

export type YTreeLoadChildren = (node: YTreeNode) => YTreeNode[] | Promise<YTreeNode[]>

export interface YTreeSelectPayload {
  node: YTreeNode
  key: string
}

export interface YTreeTogglePayload {
  node: YTreeNode
  key: string
  expanded: boolean
}

export interface YTreeCheckPayload {
  node: YTreeNode
  key: string
  checked: boolean
  checkedKeys: string[]
  halfCheckedKeys: string[]
}

export interface YTreeDropPayload {
  draggingNode: YTreeNode
  draggingKey: string
  dropNode: YTreeNode
  dropKey: string
  type: YTreeDropType
}

export interface YTreeLoadPayload {
  node: YTreeNode
  key: string
  children: YTreeNode[]
}

export interface YTreeLoadErrorPayload {
  node: YTreeNode
  key: string
  error: unknown
}
