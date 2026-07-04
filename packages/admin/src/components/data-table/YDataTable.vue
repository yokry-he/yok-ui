<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  YPagination,
  YTable,
  type YTableColumn,
  type YTableColumnResizePayload,
  type YTableFilterPayload,
  type YTableFilterState,
  type YTableFilterValue,
  type YTableRow,
  type YTableSortOrder,
  type YTableSortPayload
} from '@yok-ui/core'
import {
  YBulkActionBar,
  type YBulkActionItem,
  type YBulkActionPayload
} from '../bulk-action-bar'
import YDataToolbar from '../data-toolbar/YDataToolbar.vue'

defineOptions({
  name: 'YDataTable'
})

export interface YDataTablePagePayload {
  page: number
  pageSize: number
}

export interface YDataTableColumnPayload {
  columnKeys: string[]
  columns: YTableColumn[]
}

export type YDataTableColumnResizePayload = YTableColumnResizePayload

export interface YDataTableSelectionPayload {
  selectedRowKeys: string[]
  selectedRows: YTableRow[]
}

export interface YDataTableBulkActionPayload extends YDataTableSelectionPayload {
  action: YBulkActionItem
}

export type YDataTableDensity = 'comfortable' | 'compact'

export interface YDataTableViewPreference {
  columnKeys: string[]
  columnWidths: Record<string, number>
  density: YDataTableDensity
  filters: YTableFilterState
}

export type YDataTableViewPreferenceReason = 'columns' | 'columnResize' | 'density' | 'filters'

export interface YDataTableViewPreferencePayload {
  reason: YDataTableViewPreferenceReason
  preference: YDataTableViewPreference
}

export type YDataTableRequestReason = 'page' | 'sort' | 'columns' | 'columnResize' | 'filters' | 'refresh'

export interface YDataTableRequestPayload {
  reason: YDataTableRequestReason
  page: number
  pageSize: number
  sortKey: string
  sortOrder: YTableSortOrder
  columnKeys: string[]
  filters: YTableFilterState
  columnWidths?: Record<string, number>
}

interface Props {
  title?: string
  description?: string
  columns: YTableColumn[]
  data: YTableRow[]
  rowKey?: string
  emptyText?: string
  loading?: boolean
  loadingText?: string
  caption?: string
  summary?: string
  maxHeight?: string | number
  errorText?: string
  striped?: boolean
  compact?: boolean
  density?: YDataTableDensity
  defaultDensity?: YDataTableDensity
  showDensitySettings?: boolean
  viewPreference?: Partial<YDataTableViewPreference>
  defaultViewPreference?: Partial<YDataTableViewPreference>
  showFilterSummary?: boolean
  selectable?: boolean
  selectedRowKeys?: string[]
  bulkActions?: YBulkActionItem[]
  bulkActionTitle?: string
  bulkActionClearText?: string
  stickyBulkActions?: boolean
  page?: number
  pageSize?: number
  total?: number
  pagination?: boolean
  sortKey?: string
  sortOrder?: YTableSortOrder
  filters?: YTableFilterState
  defaultFilters?: YTableFilterState
  columnKeys?: string[]
  defaultColumnKeys?: string[]
  showColumnSettings?: boolean
  columnResetText?: string
  reorderableColumns?: boolean
  virtualized?: boolean
  virtualHeight?: number
  virtualRowHeight?: number
  virtualOverscan?: number
  resizable?: boolean
  minColumnWidth?: number
  columnWidths?: Record<string, number>
  defaultColumnWidths?: Record<string, number>
  refreshable?: boolean
  remote?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  rowKey: 'id',
  emptyText: 'No data yet',
  loading: false,
  loadingText: 'Loading data...',
  caption: '',
  summary: '',
  maxHeight: undefined,
  errorText: '',
  striped: false,
  compact: false,
  density: undefined,
  defaultDensity: 'comfortable',
  showDensitySettings: false,
  viewPreference: undefined,
  defaultViewPreference: undefined,
  showFilterSummary: true,
  selectable: false,
  selectedRowKeys: undefined,
  bulkActions: () => [],
  bulkActionTitle: '',
  bulkActionClearText: 'Clear',
  stickyBulkActions: false,
  page: 1,
  pageSize: 10,
  total: undefined,
  pagination: false,
  sortKey: undefined,
  sortOrder: undefined,
  filters: undefined,
  defaultFilters: () => ({}),
  columnKeys: undefined,
  defaultColumnKeys: () => [],
  showColumnSettings: false,
  columnResetText: 'Reset columns',
  reorderableColumns: false,
  virtualized: false,
  virtualHeight: 320,
  virtualRowHeight: 48,
  virtualOverscan: 4,
  resizable: false,
  minColumnWidth: 96,
  columnWidths: undefined,
  defaultColumnWidths: () => ({}),
  refreshable: false,
  remote: false
})

const emit = defineEmits<{
  'update:page': [page: number]
  'pageChange': [payload: YDataTablePagePayload]
  'update:columnKeys': [keys: string[]]
  'columnChange': [payload: YDataTableColumnPayload]
  refresh: []
  'requestChange': [payload: YDataTableRequestPayload]
  'update:selectedRowKeys': [keys: string[]]
  'selectionChange': [payload: YDataTableSelectionPayload]
  'bulkAction': [payload: YDataTableBulkActionPayload]
  'bulkClear': [payload: YDataTableSelectionPayload]
  'update:density': [density: YDataTableDensity]
  'densityChange': [density: YDataTableDensity]
  'update:viewPreference': [preference: YDataTableViewPreference]
  'viewPreferenceChange': [payload: YDataTableViewPreferencePayload]
  'update:sortKey': [key: string]
  'update:sortOrder': [order: YTableSortOrder]
  'sortChange': [payload: YTableSortPayload]
  'update:filters': [filters: YTableFilterState]
  'filterChange': [payload: YTableFilterPayload]
  'update:columnWidths': [widths: Record<string, number>]
  'columnResize': [payload: YDataTableColumnResizePayload]
}>()

const internalColumnKeys = ref<string[]>(getInitialColumnKeys())
const internalColumnWidths = ref<Record<string, number>>(getInitialColumnWidths())
const internalSelectedRowKeys = ref<string[]>(props.selectedRowKeys ? [...props.selectedRowKeys] : [])
const internalDensity = ref<YDataTableDensity>(props.defaultViewPreference?.density ?? props.defaultDensity)
const internalFilters = ref<YTableFilterState>(getInitialFilters())
const selectedRowKeysValue = computed(() => props.selectedRowKeys ?? internalSelectedRowKeys.value)
const selectedCount = computed(() => selectedRowKeysValue.value.length)
const columnKeysValue = computed(() => props.columnKeys ?? props.viewPreference?.columnKeys ?? internalColumnKeys.value)
const columnWidthsValue = computed(() => props.columnWidths ?? props.viewPreference?.columnWidths ?? internalColumnWidths.value)
const defaultColumnKeysValue = computed(() => {
  const availableKeys = props.columns.map((column) => column.key)
  const defaultKeys = props.defaultColumnKeys.length
    ? normalizeColumnKeys(props.defaultColumnKeys)
    : availableKeys

  return defaultKeys.length ? defaultKeys : [availableKeys[0]].filter(Boolean)
})
const canResetColumns = computed(() => !areSameStringList(columnKeysValue.value, defaultColumnKeysValue.value))
const filtersValue = computed(() => props.filters ?? props.viewPreference?.filters ?? internalFilters.value)
const densityValue = computed<YDataTableDensity>(() => props.density ?? props.viewPreference?.density ?? (props.compact ? 'compact' : internalDensity.value))
const isCompact = computed(() => densityValue.value === 'compact')
const tableCaption = computed(() => props.caption || props.title)
const visibleColumns = computed(() => {
  const columnsByKey = new Map(props.columns.map((column) => [column.key, column]))
  const orderedColumns = columnKeysValue.value
    .map((key) => columnsByKey.get(key))
    .filter((column): column is YTableColumn => Boolean(column))
  const orderedKeySet = new Set(orderedColumns.map((column) => column.key))
  const fallbackColumns = props.columns.filter((column) => !orderedKeySet.has(column.key) && columnKeysValue.value.includes(column.key))
  const filteredColumns = [...orderedColumns, ...fallbackColumns]

  return filteredColumns.length ? filteredColumns : props.columns.slice(0, 1)
})
const selectedRows = computed(() => getSelectedRows(selectedRowKeysValue.value))
const activeFilterItems = computed(() => visibleColumns.value.flatMap((column) => {
  const values = filtersValue.value[column.key] ?? []

  return values.map((value) => {
    const option = column.filters?.find((item) => item.value === value)

    return {
      id: `${column.key}:${String(value)}`,
      column,
      columnKey: column.key,
      columnLabel: column.label,
      value,
      label: option?.text ?? String(value)
    }
  })
}))
const hasActiveFilters = computed(() => Boolean(activeFilterItems.value.length))
const shouldShowSettings = computed(() => props.showColumnSettings || props.showDensitySettings || (props.showFilterSummary && hasActiveFilters.value))
const filteredData = computed(() => props.remote ? props.data : props.data.filter((row) => visibleColumns.value.every((column) => rowMatchesColumnFilter(row, column))))
const totalValue = computed(() => props.total ?? (props.remote ? props.data.length : filteredData.value.length))
const visibleData = computed(() => {
  if (!props.pagination || props.remote) {
    return filteredData.value
  }

  const start = (props.page - 1) * props.pageSize
  return filteredData.value.slice(start, start + props.pageSize)
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

function hasColumnWidths(widths: Record<string, number> = {}) {
  return Object.keys(cloneColumnWidths(widths)).length > 0
}

function hasFilters(filters: YTableFilterState = {}) {
  return Object.values(filters).some((values) => values.length > 0)
}

function normalizeColumnKeys(keys: string[]) {
  const availableKeys = new Set(props.columns.map((column) => column.key))
  const uniqueKeys = Array.from(new Set(keys))

  return uniqueKeys.filter((key) => availableKeys.has(key))
}

function getInitialColumnKeys() {
  const defaultKeys = props.defaultColumnKeys.length
    ? props.defaultColumnKeys
    : props.defaultViewPreference?.columnKeys ?? []
  const normalizedKeys = normalizeColumnKeys(defaultKeys)

  return normalizedKeys.length ? normalizedKeys : props.columns.map((column) => column.key)
}

function getInitialColumnWidths() {
  if (hasColumnWidths(props.defaultColumnWidths)) {
    return cloneColumnWidths(props.defaultColumnWidths)
  }

  return cloneColumnWidths(props.defaultViewPreference?.columnWidths)
}

function getInitialFilters() {
  if (hasFilters(props.defaultFilters)) {
    return cloneFilters(props.defaultFilters)
  }

  return cloneFilters(props.defaultViewPreference?.filters)
}

function getRowKey(row: YTableRow, rowIndex: number) {
  return String(row[props.rowKey] ?? rowIndex)
}

function getSelectedRows(keys: string[]) {
  const selectedKeySet = new Set(keys)
  return props.data.filter((row, index) => selectedKeySet.has(getRowKey(row, index)))
}

function rowMatchesColumnFilter(row: YTableRow, column: YTableColumn) {
  const values = filtersValue.value[column.key] ?? []

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

const tableSummary = computed(() => {
  if (props.summary) {
    return props.summary
  }

  const visibleCount = visibleData.value.length
  const total = totalValue.value
  const itemLabel = total === 1 ? 'item' : 'items'
  const selectedSuffix = props.selectable && selectedCount.value
    ? ` · ${selectedCount.value} selected`
    : ''

  if (props.pagination) {
    return `Page ${props.page} · ${visibleCount} shown of ${total} ${itemLabel}${selectedSuffix}`
  }

  return `${visibleCount} shown${selectedSuffix}`
})

function createRequestPayload(
  reason: YDataTableRequestReason,
  overrides: Partial<Omit<YDataTableRequestPayload, 'reason'>> = {}
): YDataTableRequestPayload {
  const payload: YDataTableRequestPayload = {
    reason,
    page: overrides.page ?? props.page,
    pageSize: overrides.pageSize ?? props.pageSize,
    sortKey: overrides.sortKey ?? props.sortKey ?? '',
    sortOrder: overrides.sortOrder ?? props.sortOrder ?? null,
    columnKeys: overrides.columnKeys ?? columnKeysValue.value,
    filters: cloneFilters(overrides.filters ?? filtersValue.value)
  }

  if (overrides.columnWidths) {
    payload.columnWidths = cloneColumnWidths(overrides.columnWidths)
  }

  return payload
}

function emitRequestChange(payload: YDataTableRequestPayload) {
  if (props.remote) {
    emit('requestChange', payload)
  }
}

function createViewPreference(overrides: Partial<YDataTableViewPreference> = {}): YDataTableViewPreference {
  const nextColumnKeys = overrides.columnKeys
    ? normalizeColumnKeys(overrides.columnKeys)
    : normalizeColumnKeys(columnKeysValue.value)

  return {
    columnKeys: nextColumnKeys.length ? nextColumnKeys : props.columns.map((column) => column.key),
    columnWidths: cloneColumnWidths(overrides.columnWidths ?? columnWidthsValue.value),
    density: overrides.density ?? densityValue.value,
    filters: cloneFilters(overrides.filters ?? filtersValue.value)
  }
}

function emitViewPreferenceChange(
  reason: YDataTableViewPreferenceReason,
  overrides: Partial<YDataTableViewPreference> = {}
) {
  const preference = createViewPreference(overrides)

  emit('update:viewPreference', preference)
  emit('viewPreferenceChange', {
    reason,
    preference
  })
}

function handlePageChange(page: number) {
  emit('update:page', page)
  emit('pageChange', {
    page,
    pageSize: props.pageSize
  })
  emitRequestChange(createRequestPayload('page', { page }))
}

function commitColumnKeys(keys: string[]) {
  const availableKeys = props.columns.map((column) => column.key)
  const normalizedKeys = normalizeColumnKeys(keys)
  const nextKeys = normalizedKeys.length ? normalizedKeys : [availableKeys[0]].filter(Boolean)
  internalColumnKeys.value = nextKeys
  emit('update:columnKeys', nextKeys)
  emit('columnChange', {
    columnKeys: nextKeys,
    columns: props.columns.filter((column) => nextKeys.includes(column.key))
  })
  emitViewPreferenceChange('columns', { columnKeys: nextKeys })
  emitRequestChange(createRequestPayload('columns', { columnKeys: nextKeys }))
}

function areSameStringList(first: string[], second: string[]) {
  return first.length === second.length && first.every((item, index) => item === second[index])
}

function resetColumns() {
  if (!canResetColumns.value) {
    return
  }

  commitColumnKeys(defaultColumnKeysValue.value)
}

function commitFilters(filters: YTableFilterState) {
  const nextFilters = cloneFilters(filters)
  internalFilters.value = nextFilters
  emit('update:filters', nextFilters)
  emitViewPreferenceChange('filters', { filters: nextFilters })
}

function notifyFilterChange(column: YTableColumn, filters: YTableFilterState) {
  emit('filterChange', {
    columnKey: column.key,
    values: filters[column.key] ?? [],
    filters,
    column
  })
  emitRequestChange(createRequestPayload('filters', {
    page: 1,
    filters
  }))
}

function clearFilterValue(column: YTableColumn, value: YTableFilterValue) {
  const nextFilters = cloneFilters(filtersValue.value)
  const nextValues = (nextFilters[column.key] ?? []).filter((item) => item !== value)

  if (nextValues.length) {
    nextFilters[column.key] = nextValues
  } else {
    delete nextFilters[column.key]
  }

  commitFilters(nextFilters)
  notifyFilterChange(column, nextFilters)
}

function clearAllFilters() {
  const previousItems = activeFilterItems.value
  commitFilters({})

  if (previousItems[0]) {
    notifyFilterChange(previousItems[0].column, {})
    return
  }

  emitRequestChange(createRequestPayload('filters', {
    page: 1,
    filters: {}
  }))
}

function toggleColumn(key: string, checked: boolean) {
  const nextKeys = checked
    ? [...columnKeysValue.value, key]
    : columnKeysValue.value.filter((item) => item !== key)

  commitColumnKeys(nextKeys)
}

function moveColumn(key: string, direction: -1 | 1) {
  const currentIndex = columnKeysValue.value.indexOf(key)
  const targetIndex = currentIndex + direction

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= columnKeysValue.value.length) {
    return
  }

  const nextKeys = [...columnKeysValue.value]
  const [movedKey] = nextKeys.splice(currentIndex, 1)
  nextKeys.splice(targetIndex, 0, movedKey)
  commitColumnKeys(nextKeys)
}

function commitDensity(density: YDataTableDensity) {
  internalDensity.value = density
  emit('update:density', density)
  emit('densityChange', density)
  emitViewPreferenceChange('density', { density })
}

function commitSelectedRowKeys(keys: string[]) {
  const uniqueKeys = Array.from(new Set(keys))
  internalSelectedRowKeys.value = uniqueKeys
  emit('update:selectedRowKeys', uniqueKeys)
  emit('selectionChange', {
    selectedRowKeys: uniqueKeys,
    selectedRows: getSelectedRows(uniqueKeys)
  })
}

function clearSelection() {
  const previousKeys = [...selectedRowKeysValue.value]
  const previousRows = getSelectedRows(previousKeys)

  commitSelectedRowKeys([])
  emit('bulkClear', {
    selectedRowKeys: previousKeys,
    selectedRows: previousRows
  })
}

function handleBulkAction(payload: YBulkActionPayload) {
  emit('bulkAction', {
    action: payload.action,
    selectedRowKeys: payload.selectedRowKeys,
    selectedRows: getSelectedRows(payload.selectedRowKeys)
  })
}

function handleSortChange(payload: YTableSortPayload) {
  emit('sortChange', payload)
  emitRequestChange(createRequestPayload('sort', {
    page: 1,
    sortKey: payload.key,
    sortOrder: payload.order
  }))
}

function handleFilterChange(payload: YTableFilterPayload) {
  emit('filterChange', payload)
  emitRequestChange(createRequestPayload('filters', {
    page: 1,
    filters: payload.filters
  }))
}

function handleColumnResize(payload: YTableColumnResizePayload) {
  const nextWidths = cloneColumnWidths(payload.widths)
  internalColumnWidths.value = nextWidths
  emit('update:columnWidths', nextWidths)
  emit('columnResize', payload)
  emitViewPreferenceChange('columnResize', {
    columnWidths: nextWidths
  })
  emitRequestChange(createRequestPayload('columnResize', {
    columnWidths: nextWidths
  }))
}

function handleRefresh() {
  emit('refresh')
  emitRequestChange(createRequestPayload('refresh'))
}
</script>

<template>
  <section class="yok-data-table" :aria-busy="loading ? 'true' : 'false'">
    <YDataToolbar
      v-if="title || description || $slots.actions || refreshable || totalValue"
      :title="title"
      :description="description"
      :count="totalValue"
    >
      <slot name="actions" />
      <button
        v-if="refreshable"
        class="yok-data-table__tool-button yok-focus-ring"
        type="button"
        :disabled="loading"
        @click="handleRefresh"
      >
        Refresh
      </button>
    </YDataToolbar>

    <section v-if="shouldShowSettings" class="yok-data-table__settings" aria-label="Table view settings">
      <div v-if="showColumnSettings" class="yok-data-table__setting-group">
        <div class="yok-data-table__setting-head">
          <strong>Columns</strong>
          <button
            class="yok-data-table__column-reset yok-focus-ring"
            type="button"
            :disabled="!canResetColumns"
            @click="resetColumns"
          >
            {{ columnResetText }}
          </button>
        </div>
        <div
          v-for="(column, columnIndex) in visibleColumns"
          :key="column.key"
          class="yok-data-table__column-option"
        >
          <label class="yok-data-table__column-toggle">
            <input
              class="yok-data-table__checkbox yok-focus-ring"
              type="checkbox"
              :checked="columnKeysValue.includes(column.key)"
              :disabled="columnKeysValue.length === 1 && columnKeysValue.includes(column.key)"
              @change="toggleColumn(column.key, ($event.target as HTMLInputElement).checked)"
            />
            <span>{{ column.label }}</span>
          </label>
          <span v-if="reorderableColumns" class="yok-data-table__column-moves" aria-label="Column order controls">
            <button
              class="yok-data-table__column-move yok-focus-ring"
              type="button"
              :disabled="columnIndex === 0"
              :aria-label="`Move ${column.label} column left`"
              @click="moveColumn(column.key, -1)"
            >
              ↑
            </button>
            <button
              class="yok-data-table__column-move yok-focus-ring"
              type="button"
              :disabled="columnIndex === visibleColumns.length - 1"
              :aria-label="`Move ${column.label} column right`"
              @click="moveColumn(column.key, 1)"
            >
              ↓
            </button>
          </span>
        </div>
        <label
          v-for="column in columns.filter((item) => !columnKeysValue.includes(item.key))"
          :key="column.key"
          class="yok-data-table__column-option"
        >
          <span class="yok-data-table__column-toggle">
            <input
              class="yok-data-table__checkbox yok-focus-ring"
              type="checkbox"
              :checked="false"
              @change="toggleColumn(column.key, ($event.target as HTMLInputElement).checked)"
            />
            <span>{{ column.label }}</span>
          </span>
        </label>
      </div>
      <div v-if="showDensitySettings" class="yok-data-table__setting-group">
        <strong>Density</strong>
        <div class="yok-data-table__density-toggle" role="group" aria-label="Table density">
          <button
            type="button"
            class="yok-data-table__density-button yok-focus-ring"
            :class="{ 'is-active': densityValue === 'comfortable' }"
            :aria-pressed="densityValue === 'comfortable'"
            @click="commitDensity('comfortable')"
          >
            Comfortable
          </button>
          <button
            type="button"
            class="yok-data-table__density-button yok-focus-ring"
            :class="{ 'is-active': densityValue === 'compact' }"
            :aria-pressed="densityValue === 'compact'"
            @click="commitDensity('compact')"
          >
            Compact
          </button>
        </div>
      </div>
      <div v-if="showFilterSummary && hasActiveFilters" class="yok-data-table__setting-group yok-data-table__filter-summary" role="group" aria-label="Active table filters">
        <strong>Filters</strong>
        <button
          v-for="item in activeFilterItems"
          :key="item.id"
          class="yok-data-table__filter-chip yok-focus-ring"
          type="button"
          :aria-label="`Clear filter ${item.columnLabel}: ${item.label}`"
          @click="clearFilterValue(item.column, item.value)"
        >
          <span>{{ item.columnLabel }}: {{ item.label }}</span>
          <span aria-hidden="true">×</span>
        </button>
        <button
          class="yok-data-table__filter-clear yok-focus-ring"
          type="button"
          @click="clearAllFilters"
        >
          Clear all
        </button>
      </div>
    </section>

    <div
      v-if="selectable && selectedCount"
      class="yok-data-table__bulk"
      :class="{ 'yok-data-table__bulk--sticky': stickyBulkActions }"
    >
      <YBulkActionBar
        :selected-row-keys="selectedRowKeysValue"
        :actions="bulkActions"
        :title="bulkActionTitle"
        :clear-text="bulkActionClearText"
        aria-label="Selected table rows"
        @clear="clearSelection"
        @action="handleBulkAction"
      >
        <template v-if="$slots.bulkSummary" #summary="{ selectedCount: slotSelectedCount, selectedRowKeys: slotSelectedRowKeys }">
          <slot
            name="bulkSummary"
            :selected-count="slotSelectedCount"
            :selected-row-keys="slotSelectedRowKeys"
            :selected-rows="selectedRows"
          />
        </template>
        <template v-if="$slots.bulkActions" #actions="{ selectedCount: slotSelectedCount, selectedRowKeys: slotSelectedRowKeys }">
          <slot
            name="bulkActions"
            :selected-count="slotSelectedCount"
            :selected-row-keys="slotSelectedRowKeys"
            :selected-rows="selectedRows"
            :clear-selection="clearSelection"
          />
        </template>
      </YBulkActionBar>
    </div>

    <div v-if="errorText" class="yok-data-table__error" role="alert">
      <span class="yok-data-table__error-mark" aria-hidden="true">!</span>
      <span class="yok-data-table__error-copy">
        <strong class="yok-data-table__error-title">Request failed</strong>
        <span class="yok-data-table__error-text">{{ errorText }}</span>
      </span>
      <button
        v-if="refreshable"
        class="yok-data-table__tool-button yok-data-table__tool-button--quiet yok-focus-ring"
        type="button"
        :disabled="loading"
        @click="handleRefresh"
      >
        Retry
      </button>
    </div>

    <div class="yok-data-table__body">
      <YTable
        :columns="visibleColumns"
        :data="visibleData"
        :row-key="rowKey"
        :empty-text="errorText || emptyText"
        :loading="loading"
        :loading-text="loadingText"
        :caption="tableCaption"
        :summary="tableSummary"
        :max-height="maxHeight"
        :virtualized="virtualized"
        :virtual-height="virtualHeight"
        :virtual-row-height="virtualRowHeight"
        :virtual-overscan="virtualOverscan"
        :resizable="resizable"
        :min-column-width="minColumnWidth"
        :column-widths="columnWidthsValue"
        :striped="striped"
        :compact="isCompact"
        :selectable="selectable"
        :selected-row-keys="selectedRowKeysValue"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        :filters="filtersValue"
        filter-mode="manual"
        @update:selected-row-keys="commitSelectedRowKeys"
        @update:sort-key="$emit('update:sortKey', $event)"
        @update:sort-order="$emit('update:sortOrder', $event)"
        @update:filters="commitFilters"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
        @column-resize="handleColumnResize"
      >
        <template v-if="$slots.empty" #empty="slotProps">
          <slot
            name="empty"
            v-bind="slotProps"
            :error-text="errorText"
            :refresh="handleRefresh"
          />
        </template>
        <template v-for="column in visibleColumns" #[`cell-${column.key}`]="slotProps">
          <slot :name="`cell-${column.key}`" v-bind="slotProps">
            {{ slotProps.value }}
          </slot>
        </template>
      </YTable>
    </div>

    <footer v-if="pagination" class="yok-data-table__footer">
      <p class="yok-data-table__summary">
        Page {{ page }} · {{ totalValue }} items
      </p>
      <YPagination
        :page="page"
        :page-size="pageSize"
        :total="totalValue"
        @change="handlePageChange"
      />
    </footer>
  </section>
</template>

<style scoped>
.yok-data-table {
  display: grid;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-data-table__body {
  position: relative;
  min-width: 0;
}

.yok-data-table__settings,
.yok-data-table__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 52%, var(--yok-color-surface));
  padding: var(--yok-space-3) var(--yok-space-4);
}

.yok-data-table__bulk {
  min-width: 0;
}

.yok-data-table__bulk--sticky {
  position: sticky;
  top: var(--yok-space-3);
  z-index: 6;
}

.yok-data-table__settings {
  align-items: flex-start;
  justify-content: flex-start;
  background: var(--yok-color-surface);
}

.yok-data-table__setting-group {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-data-table__setting-group strong {
  color: var(--yok-color-text);
  font-size: 13px;
}

.yok-data-table__setting-head {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-data-table__column-reset {
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: var(--yok-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.2;
  padding: 4px 8px;
}

.yok-data-table__column-reset:disabled {
  cursor: not-allowed;
  opacity: 0.52;
}

.yok-data-table__column-reset:not(:disabled):hover {
  background: var(--yok-color-primarySoft);
}

.yok-data-table__column-option {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 650;
}

.yok-data-table__column-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-data-table__column-moves {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
}

.yok-data-table__column-move {
  display: inline-grid;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.yok-data-table__column-move:not(:disabled):hover {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-data-table__column-move:disabled {
  cursor: not-allowed;
  opacity: 0.46;
}

.yok-data-table__filter-summary {
  flex: 1 1 100%;
}

.yok-data-table__filter-chip,
.yok-data-table__filter-clear {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  min-height: 30px;
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  padding: 0 var(--yok-space-3);
}

.yok-data-table__filter-chip {
  background: color-mix(in srgb, var(--yok-color-primarySoft) 72%, var(--yok-color-surface));
  color: var(--yok-color-primary);
}

.yok-data-table__filter-chip span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-data-table__filter-clear {
  background: var(--yok-color-surface);
  color: var(--yok-color-textMuted);
}

.yok-data-table__filter-chip:hover,
.yok-data-table__filter-clear:hover {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-data-table__checkbox {
  width: 15px;
  height: 15px;
  accent-color: var(--yok-color-primary);
}

.yok-data-table__density-toggle {
  display: inline-flex;
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 72%, var(--yok-color-surface));
  padding: 3px;
}

.yok-data-table__density-button {
  min-height: 30px;
  min-width: 96px;
  border: 0;
  border-radius: calc(var(--yok-radius-md) - 2px);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  padding: 0 var(--yok-space-3);
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    color 160ms ease;
}

.yok-data-table__density-button:hover {
  color: var(--yok-color-primary);
}

.yok-data-table__density-button.is-active {
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  color: var(--yok-color-primary);
}

.yok-data-table__tool-button {
  min-height: 34px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-weight: 700;
  padding: 0 var(--yok-space-3);
}

.yok-data-table__tool-button:hover {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-data-table__tool-button:disabled {
  cursor: not-allowed;
  opacity: 0.56;
}

.yok-data-table__tool-button--quiet {
  background: color-mix(in srgb, var(--yok-color-danger) 8%, var(--yok-color-surface));
  border-color: color-mix(in srgb, var(--yok-color-danger) 24%, var(--yok-color-border));
  color: var(--yok-color-danger);
  flex: 0 0 auto;
}

.yok-data-table__error {
  display: flex;
  align-items: center;
  gap: var(--yok-space-3);
  border: 1px solid color-mix(in srgb, var(--yok-color-danger) 24%, var(--yok-color-border));
  border-radius: var(--yok-radius-lg);
  background: color-mix(in srgb, var(--yok-color-danger) 7%, var(--yok-color-surface));
  color: var(--yok-color-text);
  padding: var(--yok-space-3) var(--yok-space-4);
}

.yok-data-table__error-mark {
  display: inline-grid;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-color-danger) 14%, var(--yok-color-surface));
  color: var(--yok-color-danger);
  font-size: 13px;
  font-weight: 850;
}

.yok-data-table__error-copy {
  display: grid;
  flex: 1 1 auto;
  gap: 2px;
  min-width: 0;
}

.yok-data-table__error-title {
  color: var(--yok-color-danger);
  font-size: 13px;
}

.yok-data-table__error-text {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.5;
}

.yok-data-table__footer {
  background: var(--yok-color-surface);
}

.yok-data-table__summary {
  margin: 0;
  color: var(--yok-color-textMuted);
  font-size: 13px;
}

@media (max-width: 720px) {
  .yok-data-table__setting-group {
    align-items: flex-start;
    flex-direction: column;
  }

  .yok-data-table__density-toggle {
    width: 100%;
  }

  .yok-data-table__density-button {
    flex: 1 1 0;
    min-width: 0;
  }

  .yok-data-table__error {
    align-items: flex-start;
    flex-direction: column;
  }

  .yok-data-table__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
