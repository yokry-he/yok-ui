<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import YInternalIcon from '../_internal/YInternalIcon.vue'

defineOptions({
  name: 'YTable'
})

export type YTableSortOrder = 'asc' | 'desc' | null
export type YTableFilterValue = string | number | boolean
export type YTableFilterMode = 'local' | 'manual'

export type YTableRow = Record<string, unknown>
export type YTableColumnFixed = 'left' | 'right'

export interface YTableFilterOption {
  text: string
  value: YTableFilterValue
}

export interface YTableColumn {
  key: string
  label: string
  width?: string | number
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'center' | 'right'
  fixed?: YTableColumnFixed
  resizable?: boolean
  sortable?: boolean | ((a: YTableRow, b: YTableRow, column: YTableColumn) => number)
  filters?: YTableFilterOption[]
  filterMultiple?: boolean
  filterMethod?: (value: YTableFilterValue, row: YTableRow, column: YTableColumn) => boolean
}

export interface YTableSortPayload {
  key: string
  order: YTableSortOrder
  column?: YTableColumn
}

export type YTableFilterState = Record<string, YTableFilterValue[]>

export interface YTableFilterPayload {
  columnKey: string
  values: YTableFilterValue[]
  filters: YTableFilterState
  column?: YTableColumn
}

export interface YTableSelectionPayload {
  selectedRowKeys: string[]
  selectedRows: YTableRow[]
}

export interface YTableExpandPayload {
  rowKey: string
  expanded: boolean
  expandedRowKeys: string[]
  row: YTableRow
}

export interface YTableColumnResizePayload {
  columnKey: string
  width: number
  widths: Record<string, number>
  column: YTableColumn
}

interface Props {
  columns: YTableColumn[]
  data: YTableRow[]
  rowKey?: string
  emptyText?: string
  loading?: boolean
  loadingText?: string
  caption?: string
  summary?: string
  maxHeight?: string | number
  striped?: boolean
  compact?: boolean
  selectable?: boolean
  selectedRowKeys?: string[]
  defaultSelectedRowKeys?: string[]
  sortKey?: string
  sortOrder?: YTableSortOrder
  defaultSortKey?: string
  defaultSortOrder?: YTableSortOrder
  filters?: YTableFilterState
  defaultFilters?: YTableFilterState
  filterMode?: YTableFilterMode
  expandable?: boolean
  expandedRowKeys?: string[]
  defaultExpandedRowKeys?: string[]
  virtualized?: boolean
  virtualHeight?: number
  virtualRowHeight?: number
  virtualOverscan?: number
  resizable?: boolean
  minColumnWidth?: number
  columnWidths?: Record<string, number>
  defaultColumnWidths?: Record<string, number>
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  emptyText: 'No data yet',
  loading: false,
  loadingText: 'Loading data...',
  caption: '',
  summary: '',
  maxHeight: undefined,
  striped: false,
  compact: false,
  selectable: false,
  selectedRowKeys: undefined,
  defaultSelectedRowKeys: () => [],
  sortKey: undefined,
  sortOrder: undefined,
  defaultSortKey: '',
  defaultSortOrder: null,
  filters: undefined,
  defaultFilters: () => ({}),
  filterMode: 'local',
  expandable: false,
  expandedRowKeys: undefined,
  defaultExpandedRowKeys: () => [],
  virtualized: false,
  virtualHeight: 320,
  virtualRowHeight: 48,
  virtualOverscan: 4,
  resizable: false,
  minColumnWidth: 96,
  columnWidths: undefined,
  defaultColumnWidths: () => ({})
})

const emit = defineEmits<{
  'update:selectedRowKeys': [keys: string[]]
  'selectionChange': [payload: YTableSelectionPayload]
  'update:expandedRowKeys': [keys: string[]]
  expandChange: [payload: YTableExpandPayload]
  'update:sortKey': [key: string]
  'update:sortOrder': [order: YTableSortOrder]
  'sortChange': [payload: YTableSortPayload]
  'update:filters': [filters: YTableFilterState]
  'filterChange': [payload: YTableFilterPayload]
  'update:columnWidths': [widths: Record<string, number>]
  'columnResize': [payload: YTableColumnResizePayload]
}>()

const DEFAULT_FIXED_COLUMN_WIDTH = 160
const SELECTION_COLUMN_WIDTH = 44
const EXPAND_COLUMN_WIDTH = 44

const internalSelectedRowKeys = ref<string[]>([...props.defaultSelectedRowKeys])
const internalExpandedRowKeys = ref<string[]>([...props.defaultExpandedRowKeys])
const internalSortKey = ref(props.defaultSortKey)
const internalSortOrder = ref<YTableSortOrder>(props.defaultSortOrder)
const internalFilters = ref<YTableFilterState>(cloneFilters(props.defaultFilters))
const scrollTop = ref(0)
const internalColumnWidths = ref<Record<string, number>>(cloneColumnWidths(props.defaultColumnWidths))
const resizePreviewWidths = ref<Record<string, number> | null>(null)
const activeResize = ref<{
  column: YTableColumn
  startX: number
  startWidth: number
  latestWidth: number
} | null>(null)

const sortKeyValue = computed(() => props.sortKey ?? internalSortKey.value)
const sortOrderValue = computed(() => props.sortOrder ?? internalSortOrder.value)
const filtersValue = computed(() => props.filters ?? internalFilters.value)
const selectedRowKeysValue = computed(() => props.selectedRowKeys ?? internalSelectedRowKeys.value)
const expandedRowKeysValue = computed(() => props.expandedRowKeys ?? internalExpandedRowKeys.value)
const columnWidthsValue = computed(() => resizePreviewWidths.value ?? props.columnWidths ?? internalColumnWidths.value)
const selectedKeySet = computed(() => new Set(selectedRowKeysValue.value))
const expandedKeySet = computed(() => new Set(expandedRowKeysValue.value))
const sortableColumn = computed(() => props.columns.find((column) => column.key === sortKeyValue.value && column.sortable))
const hasFixedColumn = computed(() => props.columns.some((column) => Boolean(column.fixed)))
const hasVerticalScroll = computed(() => Boolean(props.maxHeight))
const hasLeftFixedColumn = computed(() => props.columns.some((column) => column.fixed === 'left'))
const shouldFixExpandColumn = computed(() => props.expandable && hasLeftFixedColumn.value)
const shouldFixSelectionColumn = computed(() => props.selectable && hasLeftFixedColumn.value)
const expandCellStyle = computed(() => shouldFixExpandColumn.value ? { left: '0px' } : undefined)
const selectionCellStyle = computed(() => shouldFixSelectionColumn.value ? { left: `${props.expandable ? EXPAND_COLUMN_WIDTH : 0}px` } : undefined)
const normalizedVirtualHeight = computed(() => Math.max(1, props.virtualHeight))
const normalizedVirtualRowHeight = computed(() => Math.max(1, props.virtualRowHeight))
const normalizedVirtualOverscan = computed(() => Math.max(0, props.virtualOverscan))

function getColumnWidthPx(column: YTableColumn) {
  const resizedWidth = columnWidthsValue.value[column.key]

  if (typeof resizedWidth === 'number') {
    return resizedWidth
  }

  if (typeof column.width === 'number') {
    return column.width
  }

  if (typeof column.width === 'string') {
    const match = column.width.trim().match(/^(\d+(?:\.\d+)?)(px)?$/)

    if (match) {
      return Number(match[1])
    }
  }

  return DEFAULT_FIXED_COLUMN_WIDTH
}

function getColumnWidthStyle(column: YTableColumn) {
  const resizedWidth = columnWidthsValue.value[column.key]

  if (typeof resizedWidth === 'number') {
    return `${resizedWidth}px`
  }

  if (typeof column.width === 'number') {
    return `${column.width}px`
  }

  return column.width
}

function getColumnMinWidth(column: YTableColumn) {
  return Math.max(1, column.minWidth ?? props.minColumnWidth)
}

function clampColumnWidth(column: YTableColumn, width: number) {
  const minWidth = getColumnMinWidth(column)
  const maxWidth = column.maxWidth

  if (typeof maxWidth === 'number') {
    return Math.min(Math.max(width, minWidth), Math.max(minWidth, maxWidth))
  }

  return Math.max(width, minWidth)
}

function isColumnResizable(column: YTableColumn) {
  return (props.resizable || column.resizable === true) && column.resizable !== false
}

function getLengthStyle(value?: string | number) {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

const tableScrollStyle = computed(() => {
  const maxHeight = props.virtualized
    ? getLengthStyle(normalizedVirtualHeight.value)
    : getLengthStyle(props.maxHeight)

  return maxHeight ? { maxHeight } : undefined
})

function cloneFilters(filters: YTableFilterState = {}) {
  return Object.fromEntries(
    Object.entries(filters).map(([key, values]) => [key, [...values]])
  ) as YTableFilterState
}

function cloneColumnWidths(widths: Record<string, number> = {}) {
  return Object.fromEntries(
    Object.entries(widths).filter(([, width]) => Number.isFinite(width) && width > 0)
  ) as Record<string, number>
}

function getColumnFilterValues(column: YTableColumn) {
  return filtersValue.value[column.key] ?? []
}

function hasColumnFilters(column: YTableColumn) {
  return Boolean(column.filters?.length)
}

function isFilterChecked(column: YTableColumn, value: YTableFilterValue) {
  return getColumnFilterValues(column).includes(value)
}

function getActiveFilterCount(column: YTableColumn) {
  return getColumnFilterValues(column).length
}

function getFilterLabel(column: YTableColumn) {
  const count = getActiveFilterCount(column)

  return count ? `${column.label}: ${count} filter${count === 1 ? '' : 's'} selected` : `${column.label}: open filters`
}

function normalizeFilterValues(column: YTableColumn, values: YTableFilterValue[]) {
  const allowedValues = new Set(column.filters?.map((option) => option.value) ?? [])
  const uniqueValues = Array.from(new Set(values)).filter((value) => allowedValues.has(value))

  return column.filterMultiple === false ? uniqueValues.slice(0, 1) : uniqueValues
}

function commitColumnFilter(column: YTableColumn, values: YTableFilterValue[]) {
  const normalizedValues = normalizeFilterValues(column, values)
  const nextFilters = cloneFilters(filtersValue.value)

  if (normalizedValues.length) {
    nextFilters[column.key] = normalizedValues
  } else {
    delete nextFilters[column.key]
  }

  internalFilters.value = nextFilters
  emit('update:filters', nextFilters)
  emit('filterChange', {
    columnKey: column.key,
    values: normalizedValues,
    filters: nextFilters,
    column
  })
}

function toggleFilterOption(column: YTableColumn, value: YTableFilterValue, checked: boolean) {
  if (column.filterMultiple === false) {
    if (checked) {
      commitColumnFilter(column, [value])
    }

    return
  }

  const currentValues = getColumnFilterValues(column)
  const nextValues = checked
    ? [...currentValues, value]
    : currentValues.filter((item) => item !== value)

  commitColumnFilter(column, nextValues)
}

function clearColumnFilter(column: YTableColumn) {
  commitColumnFilter(column, [])
}

function handleColumnResizeMove(event: Event) {
  const resize = activeResize.value

  if (!resize) {
    return
  }

  const clientX = (event as PointerEvent).clientX
  const width = clampColumnWidth(resize.column, resize.startWidth + clientX - resize.startX)
  resize.latestWidth = width
  resizePreviewWidths.value = {
    ...columnWidthsValue.value,
    [resize.column.key]: width
  }
}

function stopColumnResize() {
  const resize = activeResize.value

  if (!resize) {
    return
  }

  document.removeEventListener('pointermove', handleColumnResizeMove)
  document.removeEventListener('pointerup', stopColumnResize)
  const nextWidths = cloneColumnWidths(resizePreviewWidths.value ?? columnWidthsValue.value)
  internalColumnWidths.value = nextWidths
  resizePreviewWidths.value = null
  activeResize.value = null
  emit('update:columnWidths', nextWidths)
  emit('columnResize', {
    columnKey: resize.column.key,
    width: resize.latestWidth,
    widths: nextWidths,
    column: resize.column
  })
}

function startColumnResize(column: YTableColumn, event: PointerEvent) {
  if (!isColumnResizable(column)) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  stopColumnResize()
  const startWidth = clampColumnWidth(column, getColumnWidthPx(column))
  activeResize.value = {
    column,
    startX: event.clientX,
    startWidth,
    latestWidth: startWidth
  }
  resizePreviewWidths.value = {
    ...columnWidthsValue.value,
    [column.key]: startWidth
  }
  document.addEventListener('pointermove', handleColumnResizeMove)
  document.addEventListener('pointerup', stopColumnResize)
}

const columnLayouts = computed(() => props.columns.map((column, columnIndex) => {
  const widthStyle = getColumnWidthStyle(column)
  const fixedWidthStyle = column.fixed && !widthStyle ? `${DEFAULT_FIXED_COLUMN_WIDTH}px` : widthStyle
  const style: Record<string, string | undefined> = {
    width: fixedWidthStyle,
    minWidth: column.fixed ? fixedWidthStyle : undefined,
    textAlign: column.align ?? 'left'
  }

  if (column.fixed === 'left') {
    const previousLeftWidth = props.columns
      .slice(0, columnIndex)
      .filter((item) => item.fixed === 'left')
      .reduce((total, item) => total + getColumnWidthPx(item), 0)
    const expandOffset = shouldFixExpandColumn.value ? EXPAND_COLUMN_WIDTH : 0
    const selectionOffset = shouldFixSelectionColumn.value ? SELECTION_COLUMN_WIDTH : 0
    style.left = `${expandOffset + selectionOffset + previousLeftWidth}px`
  }

  if (column.fixed === 'right') {
    const nextRightWidth = props.columns
      .slice(columnIndex + 1)
      .filter((item) => item.fixed === 'right')
      .reduce((total, item) => total + getColumnWidthPx(item), 0)
    style.right = `${nextRightWidth}px`
  }

  return {
    column,
    style,
    className: {
      'yok-table__cell--fixed': Boolean(column.fixed),
      'yok-table__cell--fixed-left': column.fixed === 'left',
      'yok-table__cell--fixed-right': column.fixed === 'right'
    }
  }
}))

function getRowKey(row: YTableRow, rowIndex: number) {
  return String(row[props.rowKey] ?? rowIndex)
}

function compareValues(first: unknown, second: unknown) {
  if (typeof first === 'number' && typeof second === 'number') {
    return first - second
  }

  return String(first ?? '').localeCompare(String(second ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base'
  })
}

function rowMatchesColumnFilter(row: YTableRow, column: YTableColumn, values: YTableFilterValue[]) {
  if (!values.length) {
    return true
  }

  return values.some((value) => {
    if (column.filterMethod) {
      return column.filterMethod(value, row, column)
    }

    return row[column.key] === value
  })
}

const filteredData = computed(() => {
  if (props.filterMode === 'manual') {
    return props.data
  }

  return props.data.filter((row) => props.columns.every((column) => rowMatchesColumnFilter(row, column, getColumnFilterValues(column))))
})

const sortedData = computed(() => {
  const column = sortableColumn.value

  if (!column || !sortOrderValue.value) {
    return filteredData.value
  }

  const direction = sortOrderValue.value === 'asc' ? 1 : -1

  return [...filteredData.value].sort((first, second) => {
    const result = typeof column.sortable === 'function'
      ? column.sortable(first, second, column)
      : compareValues(first[column.key], second[column.key])

    return result * direction
  })
})

const virtualVisibleCount = computed(() => Math.ceil(normalizedVirtualHeight.value / normalizedVirtualRowHeight.value))
const canVirtualizeRows = computed(() => props.virtualized && sortedData.value.length > virtualVisibleCount.value)
const virtualRange = computed(() => {
  const total = sortedData.value.length

  if (!canVirtualizeRows.value) {
    return {
      start: 0,
      end: total
    }
  }

  const baseStart = Math.max(0, Math.floor(scrollTop.value / normalizedVirtualRowHeight.value) - normalizedVirtualOverscan.value)
  const end = Math.min(total, baseStart + virtualVisibleCount.value + normalizedVirtualOverscan.value)

  return {
    start: baseStart,
    end
  }
})
const renderedData = computed(() => sortedData.value.slice(virtualRange.value.start, virtualRange.value.end))
const virtualTopSpacerStyle = computed(() => ({
  height: `${virtualRange.value.start * normalizedVirtualRowHeight.value}px`
}))
const virtualBottomSpacerStyle = computed(() => ({
  height: `${Math.max(0, sortedData.value.length - virtualRange.value.end) * normalizedVirtualRowHeight.value}px`
}))
const virtualColumnSpan = computed(() => props.columns.length + (props.selectable ? 1 : 0) + (props.expandable ? 1 : 0))
const visibleRowKeys = computed(() => sortedData.value.map((row, index) => getRowKey(row, index)))
const allVisibleSelected = computed(() => Boolean(visibleRowKeys.value.length) && visibleRowKeys.value.every((key) => selectedKeySet.value.has(key)))
const someVisibleSelected = computed(() => visibleRowKeys.value.some((key) => selectedKeySet.value.has(key)))
const resolvedSummary = computed(() => {
  if (props.summary) {
    return props.summary
  }

  const rowCount = sortedData.value.length

  if (!props.selectable && canVirtualizeRows.value) {
    return `${rowCount} row${rowCount === 1 ? '' : 's'}`
  }

  if (!props.selectable) {
    return ''
  }

  const selectedCount = selectedRowKeysValue.value.length

  return selectedCount
    ? `${selectedCount} selected · ${rowCount} row${rowCount === 1 ? '' : 's'}`
    : `${rowCount} row${rowCount === 1 ? '' : 's'}`
})

function commitSelectedRowKeys(keys: string[]) {
  const uniqueKeys = Array.from(new Set(keys))
  internalSelectedRowKeys.value = uniqueKeys
  emit('update:selectedRowKeys', uniqueKeys)
  emit('selectionChange', {
    selectedRowKeys: uniqueKeys,
    selectedRows: props.data.filter((row, index) => uniqueKeys.includes(getRowKey(row, index)))
  })
}

function toggleRow(row: YTableRow, rowIndex: number, checked: boolean) {
  const key = getRowKey(row, rowIndex)
  const nextKeys = checked
    ? [...selectedRowKeysValue.value, key]
    : selectedRowKeysValue.value.filter((item) => item !== key)

  commitSelectedRowKeys(nextKeys)
}

function toggleAllVisible(checked: boolean) {
  if (checked) {
    commitSelectedRowKeys([...selectedRowKeysValue.value, ...visibleRowKeys.value])
    return
  }

  commitSelectedRowKeys(selectedRowKeysValue.value.filter((key) => !visibleRowKeys.value.includes(key)))
}

function isRowExpanded(row: YTableRow, rowIndex: number) {
  return expandedKeySet.value.has(getRowKey(row, rowIndex))
}

function getExpandedRowId(row: YTableRow, rowIndex: number) {
  return `yok-table-expanded-${getRowKey(row, rowIndex)}`
}

function commitExpandedRow(row: YTableRow, rowIndex: number, expanded: boolean) {
  const key = getRowKey(row, rowIndex)
  const nextKeys = expanded
    ? [...expandedRowKeysValue.value, key]
    : expandedRowKeysValue.value.filter((item) => item !== key)
  const uniqueKeys = Array.from(new Set(nextKeys))

  internalExpandedRowKeys.value = uniqueKeys
  emit('update:expandedRowKeys', uniqueKeys)
  emit('expandChange', {
    rowKey: key,
    expanded,
    expandedRowKeys: uniqueKeys,
    row
  })
}

function toggleExpandedRow(row: YTableRow, rowIndex: number) {
  commitExpandedRow(row, rowIndex, !isRowExpanded(row, rowIndex))
}

function getNextSortOrder(column: YTableColumn) {
  if (sortKeyValue.value !== column.key) {
    return 'asc' as const
  }

  if (sortOrderValue.value === 'asc') {
    return 'desc' as const
  }

  if (sortOrderValue.value === 'desc') {
    return null
  }

  return 'asc' as const
}

function sortColumn(column: YTableColumn) {
  if (!column.sortable) {
    return
  }

  const nextOrder = getNextSortOrder(column)
  const nextKey = nextOrder ? column.key : ''

  internalSortKey.value = nextKey
  internalSortOrder.value = nextOrder
  emit('update:sortKey', nextKey)
  emit('update:sortOrder', nextOrder)
  emit('sortChange', {
    key: nextKey,
    order: nextOrder,
    column: nextOrder ? column : undefined
  })
}

function getAriaSort(column: YTableColumn) {
  if (sortKeyValue.value !== column.key || !sortOrderValue.value) {
    return 'none'
  }

  return sortOrderValue.value === 'asc' ? 'ascending' : 'descending'
}

function getSortLabel(column: YTableColumn) {
  if (sortKeyValue.value !== column.key || !sortOrderValue.value) {
    return 'Sort'
  }

  return sortOrderValue.value === 'asc' ? 'Ascending' : 'Descending'
}

function isRowSelected(row: YTableRow, rowIndex: number) {
  return selectedKeySet.value.has(getRowKey(row, rowIndex))
}

function getRowLabel(row: YTableRow, rowIndex: number) {
  return String(row.name ?? row.title ?? row.label ?? getRowKey(row, rowIndex))
}

function handleScroll(event: Event) {
  scrollTop.value = (event.currentTarget as HTMLElement).scrollTop
}

onBeforeUnmount(() => {
  stopColumnResize()
})

defineExpose({
  clearSort() {
    internalSortKey.value = ''
    internalSortOrder.value = null
    emit('update:sortKey', '')
    emit('update:sortOrder', null)
    emit('sortChange', {
      key: '',
      order: null
    })
  },
  clearFilter(columnKeys?: string[]) {
    if (!columnKeys?.length) {
      internalFilters.value = {}
      emit('update:filters', {})
      emit('filterChange', {
        columnKey: '',
        values: [],
        filters: {}
      })
      return
    }

    const nextFilters = cloneFilters(filtersValue.value)
    columnKeys.forEach((key) => {
      delete nextFilters[key]
    })
    internalFilters.value = nextFilters
    emit('update:filters', nextFilters)
    emit('filterChange', {
      columnKey: columnKeys[0] ?? '',
      values: [],
      filters: nextFilters,
      column: props.columns.find((column) => column.key === columnKeys[0])
    })
  }
})
</script>

<template>
  <div
    class="yok-table"
    :class="{
      'yok-table--compact': compact,
      'yok-table--loading': loading,
      'yok-table--has-fixed-columns': hasFixedColumn,
      'yok-table--scroll-y': hasVerticalScroll || canVirtualizeRows,
      'yok-table--virtualized': canVirtualizeRows
    }"
    :aria-busy="loading ? 'true' : undefined"
    :data-virtualized="canVirtualizeRows ? 'true' : undefined"
  >
    <div class="yok-table__scroll" :style="tableScrollStyle" @scroll="handleScroll">
      <table>
        <caption v-if="caption" class="yok-table__caption">
          {{ caption }}
        </caption>
        <thead>
          <tr>
            <th
              v-if="expandable"
              class="yok-table__expand-cell"
              :class="{ 'yok-table__expand-cell--fixed': shouldFixExpandColumn }"
              :style="expandCellStyle"
              scope="col"
            >
              <span class="yok-table__sr-only">Expand row</span>
            </th>
            <th
              v-if="selectable"
              class="yok-table__selection-cell"
              :class="{ 'yok-table__selection-cell--fixed': shouldFixSelectionColumn }"
              :style="selectionCellStyle"
              scope="col"
            >
              <input
                class="yok-table__checkbox yok-focus-ring"
                type="checkbox"
                aria-label="Select all visible rows"
                :checked="allVisibleSelected"
                :indeterminate="someVisibleSelected && !allVisibleSelected"
                @change="toggleAllVisible(($event.target as HTMLInputElement).checked)"
              />
            </th>
            <th
              v-for="layout in columnLayouts"
              :key="layout.column.key"
              :class="layout.className"
              :style="layout.style"
              :aria-sort="layout.column.sortable ? getAriaSort(layout.column) : undefined"
              scope="col"
            >
              <div class="yok-table__header-cell">
                <button
                  v-if="layout.column.sortable"
                  class="yok-table__sort-button yok-focus-ring"
                  type="button"
                  :aria-label="`${layout.column.label}: ${getSortLabel(layout.column)}`"
                  @click="sortColumn(layout.column)"
                >
                  <span>{{ layout.column.label }}</span>
                  <span class="yok-table__sort-icon" aria-hidden="true">
                    {{ sortKeyValue === layout.column.key && sortOrderValue === 'asc' ? '↑' : sortKeyValue === layout.column.key && sortOrderValue === 'desc' ? '↓' : '↕' }}
                  </span>
                </button>
                <span v-else>{{ layout.column.label }}</span>
                <details v-if="hasColumnFilters(layout.column)" class="yok-table__filter">
                  <summary class="yok-table__filter-trigger yok-focus-ring" :aria-label="getFilterLabel(layout.column)">
                    <span aria-hidden="true">⌕</span>
                    <span v-if="getActiveFilterCount(layout.column)" class="yok-table__filter-count">
                      {{ getActiveFilterCount(layout.column) }}
                    </span>
                  </summary>
                  <div class="yok-table__filter-panel">
                    <label
                      v-for="option in layout.column.filters"
                      :key="String(option.value)"
                      class="yok-table__filter-option"
                    >
                      <input
                        class="yok-table__checkbox yok-focus-ring"
                        :type="layout.column.filterMultiple === false ? 'radio' : 'checkbox'"
                        :name="`yok-table-filter-${layout.column.key}`"
                        :checked="isFilterChecked(layout.column, option.value)"
                        @change="toggleFilterOption(layout.column, option.value, ($event.target as HTMLInputElement).checked)"
                      />
                      <span>{{ option.text }}</span>
                    </label>
                    <button
                      class="yok-table__filter-clear yok-focus-ring"
                      type="button"
                      :disabled="!getActiveFilterCount(layout.column)"
                      @click="clearColumnFilter(layout.column)"
                    >
                      Clear
                    </button>
                  </div>
                </details>
              </div>
              <button
                v-if="isColumnResizable(layout.column)"
                class="yok-table__resize-handle yok-focus-ring"
                type="button"
                :aria-label="`Resize ${layout.column.label} column`"
                @pointerdown="startColumnResize(layout.column, $event)"
              />
            </th>
          </tr>
        </thead>
        <tbody v-if="sortedData.length">
          <tr
            v-if="canVirtualizeRows && virtualRange.start"
            class="yok-table__virtual-spacer yok-table__virtual-spacer--top"
            aria-hidden="true"
          >
            <td :colspan="virtualColumnSpan" :style="virtualTopSpacerStyle" />
          </tr>
          <template
            v-for="(row, localRowIndex) in renderedData"
            :key="getRowKey(row, virtualRange.start + localRowIndex)"
          >
            <tr
              :data-row-key="getRowKey(row, virtualRange.start + localRowIndex)"
              :class="{ 'yok-table__row--striped': striped && (virtualRange.start + localRowIndex) % 2 === 1 }"
            >
              <td
                v-if="expandable"
                class="yok-table__expand-cell"
                :class="{ 'yok-table__expand-cell--fixed': shouldFixExpandColumn }"
                :style="expandCellStyle"
              >
                <button
                  class="yok-table__expand-button yok-focus-ring"
                  type="button"
                  :aria-label="`${isRowExpanded(row, virtualRange.start + localRowIndex) ? 'Collapse' : 'Expand'} ${getRowLabel(row, virtualRange.start + localRowIndex)} details`"
                  :aria-expanded="isRowExpanded(row, virtualRange.start + localRowIndex) ? 'true' : 'false'"
                  :aria-controls="getExpandedRowId(row, virtualRange.start + localRowIndex)"
                  @click="toggleExpandedRow(row, virtualRange.start + localRowIndex)"
                >
                  <YInternalIcon :name="isRowExpanded(row, virtualRange.start + localRowIndex) ? 'chevronDown' : 'chevronRight'" />
                </button>
              </td>
              <td
                v-if="selectable"
                class="yok-table__selection-cell"
                :class="{ 'yok-table__selection-cell--fixed': shouldFixSelectionColumn }"
                :style="selectionCellStyle"
              >
                <input
                  class="yok-table__checkbox yok-focus-ring"
                  type="checkbox"
                  :aria-label="`Select ${getRowLabel(row, virtualRange.start + localRowIndex)}`"
                  :checked="isRowSelected(row, virtualRange.start + localRowIndex)"
                  @change="toggleRow(row, virtualRange.start + localRowIndex, ($event.target as HTMLInputElement).checked)"
                />
              </td>
              <td
                v-for="layout in columnLayouts"
                :key="layout.column.key"
                :class="layout.className"
                :style="layout.style"
              >
                <slot :name="`cell-${layout.column.key}`" :row="row" :column="layout.column" :value="row[layout.column.key]">
                  {{ row[layout.column.key] }}
                </slot>
              </td>
            </tr>
            <tr
              v-if="expandable && isRowExpanded(row, virtualRange.start + localRowIndex)"
              :id="getExpandedRowId(row, virtualRange.start + localRowIndex)"
              class="yok-table__expanded-row"
            >
              <td class="yok-table__expanded-cell" :colspan="virtualColumnSpan">
                <slot
                  name="expand"
                  :row="row"
                  :row-key="getRowKey(row, virtualRange.start + localRowIndex)"
                  :row-index="virtualRange.start + localRowIndex"
                  :expanded="true"
                >
                  {{ row.description || row.detail || '' }}
                </slot>
              </td>
            </tr>
          </template>
          <tr
            v-if="canVirtualizeRows && virtualRange.end < sortedData.length"
            class="yok-table__virtual-spacer yok-table__virtual-spacer--bottom"
            aria-hidden="true"
          >
            <td :colspan="virtualColumnSpan" :style="virtualBottomSpacerStyle" />
          </tr>
        </tbody>
      </table>
      <div v-if="!sortedData.length" class="yok-table__empty" role="status">
        <slot
          name="empty"
          :loading="loading"
          :empty-text="emptyText"
          :loading-text="loadingText"
          :columns="columns"
        >
          {{ loading ? loadingText : emptyText }}
        </slot>
      </div>
      <div v-if="loading && sortedData.length" class="yok-table__loading" role="status" aria-live="polite">
        <span class="yok-table__loading-dot" aria-hidden="true" />
        <span>{{ loadingText }}</span>
      </div>
    </div>
    <div v-if="resolvedSummary" class="yok-table__summary" role="status" aria-live="polite">
      {{ resolvedSummary }}
    </div>
  </div>
</template>

<style scoped>
.yok-table {
  width: 100%;
  inline-size: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-table__scroll {
  position: relative;
  width: 100%;
  inline-size: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
}

.yok-table--scroll-y .yok-table__scroll {
  overflow-y: auto;
}

.yok-table table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
}

.yok-table--has-fixed-columns table {
  min-width: max-content;
}

.yok-table__caption {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 750;
  padding: var(--yok-space-3) var(--yok-space-4);
  text-align: left;
}

.yok-table th,
.yok-table td {
  border-bottom: 1px solid var(--yok-color-border);
  padding: var(--yok-space-4);
  vertical-align: middle;
}

.yok-table--compact th,
.yok-table--compact td {
  padding: var(--yok-space-3);
}

.yok-table th {
  position: relative;
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 800;
}

.yok-table__header-cell {
  display: inline-flex;
  align-items: center;
  justify-content: inherit;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-table--scroll-y thead th {
  position: sticky;
  top: 0;
  z-index: 2;
}

.yok-table__selection-cell {
  width: 44px;
  text-align: center;
}

.yok-table__expand-cell {
  width: 44px;
  text-align: center;
}

.yok-table__expand-cell--fixed {
  position: sticky;
  left: 0;
  z-index: 2;
  background: var(--yok-color-surface);
}

.yok-table th.yok-table__expand-cell--fixed {
  z-index: 4;
  background: var(--yok-color-surfaceMuted);
}

.yok-table--scroll-y th.yok-table__expand-cell--fixed {
  z-index: 5;
}

.yok-table__selection-cell--fixed {
  position: sticky;
  z-index: 2;
  background: var(--yok-color-surface);
}

.yok-table th.yok-table__selection-cell--fixed {
  z-index: 4;
  background: var(--yok-color-surfaceMuted);
}

.yok-table--scroll-y th.yok-table__selection-cell--fixed {
  z-index: 5;
}

.yok-table__cell--fixed {
  position: sticky;
  z-index: 1;
  background: var(--yok-color-surface);
}

.yok-table th.yok-table__cell--fixed {
  z-index: 3;
  background: var(--yok-color-surfaceMuted);
}

.yok-table--scroll-y th.yok-table__cell--fixed {
  z-index: 4;
}

.yok-table__cell--fixed-left {
  box-shadow: 12px 0 18px -18px color-mix(in srgb, var(--yok-color-text) 42%, transparent);
}

.yok-table__cell--fixed-right {
  box-shadow: -12px 0 18px -18px color-mix(in srgb, var(--yok-color-text) 42%, transparent);
}

.yok-table__checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--yok-color-primary);
  cursor: pointer;
}

.yok-table__expand-button {
  display: inline-grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  font-weight: 850;
  line-height: 1;
  padding: 0;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.yok-table__expand-button:hover {
  border-color: color-mix(in srgb, var(--yok-color-primary) 44%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-primarySoft) 68%, var(--yok-color-surface));
  color: var(--yok-color-primary);
}

.yok-table__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.yok-table__sort-button {
  display: inline-flex;
  align-items: center;
  justify-content: inherit;
  gap: var(--yok-space-2);
  min-height: 28px;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: inherit;
  padding: 0 var(--yok-space-1);
}

.yok-table__sort-button:hover {
  color: var(--yok-color-primary);
}

.yok-table__sort-icon {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  line-height: 1;
}

.yok-table__resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  z-index: 6;
  width: 8px;
  height: 100%;
  border: 0;
  background: transparent;
  cursor: col-resize;
  padding: 0;
}

.yok-table__resize-handle::after {
  position: absolute;
  top: var(--yok-space-3);
  bottom: var(--yok-space-3);
  left: 3px;
  width: 2px;
  border-radius: 999px;
  background: transparent;
  content: '';
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease;
}

.yok-table__resize-handle:hover::after,
.yok-table__resize-handle:focus-visible::after {
  background: var(--yok-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--yok-color-primary) 12%, transparent);
}

.yok-table__filter {
  position: relative;
  flex: 0 0 auto;
}

.yok-table__filter-trigger {
  display: inline-grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--yok-radius-sm);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 13px;
  list-style: none;
  position: relative;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.yok-table__filter-trigger::-webkit-details-marker {
  display: none;
}

.yok-table__filter-trigger:hover,
.yok-table__filter[open] .yok-table__filter-trigger {
  border-color: color-mix(in srgb, var(--yok-color-primary) 24%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-primarySoft) 74%, var(--yok-color-surface));
  color: var(--yok-color-primary);
}

.yok-table__filter-count {
  position: absolute;
  top: -5px;
  right: -5px;
  display: inline-grid;
  min-width: 16px;
  height: 16px;
  place-items: center;
  border: 1px solid var(--yok-color-surfaceMuted);
  border-radius: 999px;
  background: var(--yok-color-primary);
  color: var(--yok-color-primaryText);
  font-size: 10px;
  font-weight: 850;
  line-height: 1;
  padding: 0 4px;
}

.yok-table__filter-panel {
  position: absolute;
  top: calc(100% + var(--yok-space-2));
  right: 0;
  z-index: 8;
  display: grid;
  min-width: 168px;
  gap: var(--yok-space-2);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-3);
  text-align: left;
}

.yok-table__filter-option {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.4;
}

.yok-table__filter-clear {
  min-height: 30px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 72%, var(--yok-color-surface));
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
}

.yok-table__filter-clear:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-table__filter-clear:disabled {
  cursor: not-allowed;
  opacity: 0.56;
}

.yok-table td {
  color: var(--yok-color-text);
}

.yok-table tbody tr:last-child td {
  border-bottom: 0;
}

.yok-table__row--striped td {
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 58%, transparent);
}

.yok-table__row--striped .yok-table__selection-cell--fixed,
.yok-table__row--striped .yok-table__expand-cell--fixed,
.yok-table__row--striped .yok-table__cell--fixed {
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 58%, var(--yok-color-surface));
}

.yok-table__expanded-row td {
  background: color-mix(in srgb, var(--yok-color-primarySoft) 34%, var(--yok-color-surface));
}

.yok-table__expanded-cell {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.7;
}

.yok-table__virtual-spacer td {
  border-bottom: 0;
  padding: 0;
}

.yok-table__empty {
  display: grid;
  min-height: 120px;
  place-items: center;
  color: var(--yok-color-textMuted);
  padding: var(--yok-space-6);
}

.yok-table__loading {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  min-width: 560px;
  background: color-mix(in srgb, var(--yok-color-surface) 78%, transparent);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 750;
  pointer-events: none;
}

.yok-table__loading-dot {
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
  border-radius: 999px;
  background: var(--yok-color-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--yok-color-primary) 14%, transparent);
}

.yok-table__summary {
  border-top: 1px solid var(--yok-color-border);
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 64%, transparent);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 750;
  padding: var(--yok-space-3) var(--yok-space-4);
}
</style>
