<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  YTableColumn,
  YTableFilterState,
  YTableRow,
  YTableSortOrder
} from '@yok-ui/core'
import YDataTable, {
  type YDataTableBulkActionPayload,
  type YDataTableColumnPayload,
  type YDataTableColumnResizePayload,
  type YDataTableDensity,
  type YDataTablePagePayload,
  type YDataTableRequestPayload,
  type YDataTableSelectionPayload,
  type YDataTableViewPreference,
  type YDataTableViewPreferencePayload,
  type YDataTableViewPreferenceReason
} from '../data-table/YDataTable.vue'
import type { YBulkActionItem } from '../bulk-action-bar'
import YSavedViews, { type YSavedViewItem } from '../saved-views/YSavedViews.vue'

defineOptions({
  name: 'YDataView'
})

export interface YDataViewItem extends YSavedViewItem {
  preference?: Partial<YDataTableViewPreference>
}

export type YDataViewPreferenceReason = YDataTableViewPreferenceReason | 'view'

export interface YDataViewPreferencePayload {
  reason: YDataViewPreferenceReason
  view: YDataViewItem | null
  preference: YDataTableViewPreference
}

export interface YDataViewSavePayload {
  view: YDataViewItem | null
  preference: YDataTableViewPreference
}

interface Props {
  views: YDataViewItem[]
  columns: YTableColumn[]
  data: YTableRow[]
  modelValue?: string
  defaultView?: string
  viewPreference?: Partial<YDataTableViewPreference>
  title?: string
  description?: string
  ariaLabel?: string
  savedViewsTitle?: string
  savedViewsDescription?: string
  tableTitle?: string
  tableDescription?: string
  rowKey?: string
  page?: number
  pageSize?: number
  total?: number
  pagination?: boolean
  selectable?: boolean
  selectedRowKeys?: string[]
  bulkActions?: YBulkActionItem[]
  bulkActionTitle?: string
  stickyBulkActions?: boolean
  showColumnSettings?: boolean
  showDensitySettings?: boolean
  showFilterSummary?: boolean
  reorderableColumns?: boolean
  resizable?: boolean
  minColumnWidth?: number
  remote?: boolean
  loading?: boolean
  loadingText?: string
  errorText?: string
  emptyText?: string
  columnResetText?: string
  saveText?: string
  createText?: string
  manageText?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultView: '',
  viewPreference: undefined,
  title: '',
  description: '',
  ariaLabel: 'Data view',
  savedViewsTitle: 'Saved views',
  savedViewsDescription: '',
  tableTitle: '',
  tableDescription: '',
  rowKey: 'id',
  page: 1,
  pageSize: 10,
  total: undefined,
  pagination: false,
  selectable: false,
  selectedRowKeys: undefined,
  bulkActions: () => [],
  bulkActionTitle: '',
  stickyBulkActions: false,
  showColumnSettings: true,
  showDensitySettings: true,
  showFilterSummary: true,
  reorderableColumns: true,
  resizable: false,
  minColumnWidth: 96,
  remote: false,
  loading: false,
  loadingText: 'Loading data...',
  errorText: '',
  emptyText: 'No data yet',
  columnResetText: 'Restore saved view',
  saveText: 'Save current',
  createText: 'Create view',
  manageText: 'Manage views'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [view: YDataViewItem]
  'update:viewPreference': [preference: YDataTableViewPreference]
  'viewPreferenceChange': [payload: YDataViewPreferencePayload]
  save: [payload: YDataViewSavePayload]
  create: []
  manage: []
  requestChange: [payload: YDataTableRequestPayload]
  'update:page': [page: number]
  pageChange: [payload: YDataTablePagePayload]
  'update:selectedRowKeys': [keys: string[]]
  selectionChange: [payload: YDataTableSelectionPayload]
  bulkAction: [payload: YDataTableBulkActionPayload]
  bulkClear: [payload: YDataTableSelectionPayload]
  columnChange: [payload: YDataTableColumnPayload]
  columnResize: [payload: YDataTableColumnResizePayload]
}>()

const internalViewValue = ref(props.defaultView || props.views[0]?.value || '')
const internalPreferences = ref<Record<string, Partial<YDataTableViewPreference>>>({})

const selectedViewValue = computed(() => props.modelValue ?? internalViewValue.value)
const selectedView = computed(() => props.views.find((view) => view.value === selectedViewValue.value) ?? props.views[0] ?? null)
const selectedStoredPreference = computed(() => {
  const view = selectedView.value

  return view ? internalPreferences.value[view.value] : undefined
})
const activePreference = computed(() => createCompletePreference(
  props.viewPreference ?? selectedStoredPreference.value ?? selectedView.value?.preference
))

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

function normalizeColumnKeys(keys: string[] = []) {
  const availableKeys = new Set(props.columns.map((column) => column.key))
  const normalizedKeys = Array.from(new Set(keys)).filter((key) => availableKeys.has(key))

  return normalizedKeys.length ? normalizedKeys : props.columns.map((column) => column.key)
}

function createCompletePreference(preference: Partial<YDataTableViewPreference> = {}): YDataTableViewPreference {
  return {
    columnKeys: normalizeColumnKeys(preference.columnKeys),
    columnWidths: cloneColumnWidths(preference.columnWidths),
    density: preference.density ?? 'comfortable',
    filters: cloneFilters(preference.filters)
  }
}

function rememberPreference(preference: YDataTableViewPreference) {
  const view = selectedView.value

  if (!view || props.viewPreference) {
    return
  }

  internalPreferences.value = {
    ...internalPreferences.value,
    [view.value]: preference
  }
}

function emitViewPreference(reason: YDataViewPreferenceReason, preference: YDataTableViewPreference) {
  emit('update:viewPreference', preference)
  emit('viewPreferenceChange', {
    reason,
    view: selectedView.value,
    preference
  })
}

function handleViewChange(view: YSavedViewItem) {
  const nextView = view as YDataViewItem
  const preference = createCompletePreference(nextView.preference)

  internalViewValue.value = nextView.value
  emit('update:modelValue', nextView.value)
  emit('change', nextView)
  emitViewPreference('view', preference)
}

function handleTableViewPreferenceUpdate(preference: YDataTableViewPreference) {
  rememberPreference(preference)
  emit('update:viewPreference', preference)
}

function handleTableViewPreferenceChange(payload: YDataTableViewPreferencePayload) {
  rememberPreference(payload.preference)
  emit('viewPreferenceChange', {
    reason: payload.reason,
    view: selectedView.value,
    preference: payload.preference
  })
}

function handleSave() {
  emit('save', {
    view: selectedView.value,
    preference: activePreference.value
  })
}
</script>

<template>
  <section class="yok-data-view" :aria-label="ariaLabel">
    <header v-if="title || description" class="yok-data-view__header">
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </header>

    <div class="yok-data-view__layout">
      <aside class="yok-data-view__views">
        <YSavedViews
          :model-value="selectedViewValue"
          :items="views"
          :title="savedViewsTitle"
          :description="savedViewsDescription"
          :save-text="saveText"
          :create-text="createText"
          :manage-text="manageText"
          @change="handleViewChange"
          @save="handleSave"
          @create="$emit('create')"
          @manage="$emit('manage')"
        />
      </aside>

      <div class="yok-data-view__table">
        <YDataTable
          :title="tableTitle"
          :description="tableDescription"
          :columns="columns"
          :data="data"
          :row-key="rowKey"
          :page="page"
          :page-size="pageSize"
          :total="total"
          :pagination="pagination"
          :selectable="selectable"
          :selected-row-keys="selectedRowKeys"
          :bulk-actions="bulkActions"
          :bulk-action-title="bulkActionTitle"
          :sticky-bulk-actions="stickyBulkActions"
          :show-column-settings="showColumnSettings"
          :show-density-settings="showDensitySettings"
          :show-filter-summary="showFilterSummary"
          :reorderable-columns="reorderableColumns"
          :resizable="resizable"
          :min-column-width="minColumnWidth"
          :remote="remote"
          :loading="loading"
          :loading-text="loadingText"
          :error-text="errorText"
          :empty-text="emptyText"
          :column-reset-text="columnResetText"
          :view-preference="activePreference"
          @update:view-preference="handleTableViewPreferenceUpdate"
          @view-preference-change="handleTableViewPreferenceChange"
          @request-change="$emit('requestChange', $event)"
          @update:page="$emit('update:page', $event)"
          @page-change="$emit('pageChange', $event)"
          @update:selected-row-keys="$emit('update:selectedRowKeys', $event)"
          @selection-change="$emit('selectionChange', $event)"
          @bulk-action="$emit('bulkAction', $event)"
          @bulk-clear="$emit('bulkClear', $event)"
          @column-change="$emit('columnChange', $event)"
          @column-resize="$emit('columnResize', $event)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.yok-data-view {
  display: grid;
  gap: var(--yok-space-4);
  color: var(--yok-color-text);
}

.yok-data-view__header {
  display: grid;
  gap: var(--yok-space-1);
}

.yok-data-view__header h2,
.yok-data-view__header p {
  margin: 0;
}

.yok-data-view__header h2 {
  font-size: 22px;
  line-height: 1.25;
  letter-spacing: 0;
}

.yok-data-view__header p {
  color: var(--yok-color-textMuted);
  line-height: 1.7;
}

.yok-data-view__layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: var(--yok-space-4);
  align-items: start;
}

.yok-data-view__views,
.yok-data-view__table {
  min-width: 0;
}

.yok-data-view__views {
  position: sticky;
  top: var(--yok-space-4);
}

@media (max-width: 860px) {
  .yok-data-view__layout {
    grid-template-columns: 1fr;
  }

  .yok-data-view__views {
    position: static;
  }
}
</style>
