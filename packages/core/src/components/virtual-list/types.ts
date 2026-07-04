export interface YVirtualListItem {
  id?: string | number
  label?: string
  [key: string]: unknown
}

export interface YVirtualListProps<T extends YVirtualListItem = YVirtualListItem> {
  items: T[]
  itemHeight: number
  height: number
  itemKey?: keyof T | ((item: T, index: number) => string | number)
  overscan?: number
  ariaLabel?: string
  emptyText?: string
}

export interface YVirtualListScrollPayload {
  scrollTop: number
  start: number
  end: number
}

export interface YVirtualListRange {
  start: number
  end: number
}
