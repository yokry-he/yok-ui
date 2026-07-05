<script setup lang="ts">
import YTable, {
  type YTableColumn,
  type YTableColumnResizePayload,
  type YTableFilterMode,
  type YTableFilterPayload,
  type YTableFilterState,
  type YTableRow,
  type YTableSelectionPayload,
  type YTableSortOrder,
  type YTableSortPayload
} from './YTable.vue'

defineOptions({
  name: 'YVirtualTable'
})

interface Props {
  columns: YTableColumn[]
  data: YTableRow[]
  rowKey?: string
  emptyText?: string
  loading?: boolean
  loadingText?: string
  caption?: string
  summary?: string
  height?: number
  rowHeight?: number
  overscan?: number
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
  resizable?: boolean
  minColumnWidth?: number
  columnWidths?: Record<string, number>
  defaultColumnWidths?: Record<string, number>
}

withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  emptyText: 'No data yet',
  loading: false,
  loadingText: 'Loading data...',
  caption: '',
  summary: '',
  height: 360,
  rowHeight: 48,
  overscan: 6,
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
  resizable: false,
  minColumnWidth: 96,
  columnWidths: undefined,
  defaultColumnWidths: () => ({})
})

defineEmits<{
  'update:selectedRowKeys': [keys: string[]]
  selectionChange: [payload: YTableSelectionPayload]
  'update:sortKey': [key: string]
  'update:sortOrder': [order: YTableSortOrder]
  sortChange: [payload: YTableSortPayload]
  'update:filters': [filters: YTableFilterState]
  filterChange: [payload: YTableFilterPayload]
  'update:columnWidths': [widths: Record<string, number>]
  columnResize: [payload: YTableColumnResizePayload]
}>()
</script>

<template>
  <YTable
    class="yok-virtual-table"
    :columns="columns"
    :data="data"
    :row-key="rowKey"
    :empty-text="emptyText"
    :loading="loading"
    :loading-text="loadingText"
    :caption="caption"
    :summary="summary"
    :striped="striped"
    :compact="compact"
    :selectable="selectable"
    :selected-row-keys="selectedRowKeys"
    :default-selected-row-keys="defaultSelectedRowKeys"
    :sort-key="sortKey"
    :sort-order="sortOrder"
    :default-sort-key="defaultSortKey"
    :default-sort-order="defaultSortOrder"
    :filters="filters"
    :default-filters="defaultFilters"
    :filter-mode="filterMode"
    :resizable="resizable"
    :min-column-width="minColumnWidth"
    :column-widths="columnWidths"
    :default-column-widths="defaultColumnWidths"
    virtualized
    :virtual-height="height"
    :virtual-row-height="rowHeight"
    :virtual-overscan="overscan"
    @update:selected-row-keys="$emit('update:selectedRowKeys', $event)"
    @selection-change="$emit('selectionChange', $event)"
    @update:sort-key="$emit('update:sortKey', $event)"
    @update:sort-order="$emit('update:sortOrder', $event)"
    @sort-change="$emit('sortChange', $event)"
    @update:filters="$emit('update:filters', $event)"
    @filter-change="$emit('filterChange', $event)"
    @update:column-widths="$emit('update:columnWidths', $event)"
    @column-resize="$emit('columnResize', $event)"
  >
    <template #empty="slotProps">
      <slot name="empty" v-bind="slotProps" />
    </template>
    <template
      v-for="column in columns"
      #[`cell-${column.key}`]="slotProps"
      :key="column.key"
    >
      <slot
        :name="`cell-${column.key}`"
        v-bind="slotProps"
      >
        {{ slotProps.value }}
      </slot>
    </template>
  </YTable>
</template>

<style scoped>
.yok-virtual-table {
  --yok-virtual-table-border-color: var(--yok-color-border);
  --yok-virtual-table-shadow: var(--yok-shadow-sm);

  box-shadow: inset 0 -1px 0 var(--yok-virtual-table-border-color);
}
</style>
