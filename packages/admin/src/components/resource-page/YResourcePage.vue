<script setup lang="ts">
import type { YTableColumn, YTableRow } from '@yok-ui/core'
import { YDrawer } from '@yok-ui/core'
import YCrudLayout, { type YCrudLayoutDensity } from '../crud-layout/YCrudLayout.vue'
import YDataView, {
  type YDataViewItem,
  type YDataViewPreferencePayload,
  type YDataViewSavePayload
} from '../data-view/YDataView.vue'
import type {
  YDataTableBulkActionPayload,
  YDataTableColumnPayload,
  YDataTableColumnResizePayload,
  YDataTablePagePayload,
  YDataTableRequestPayload,
  YDataTableSelectionPayload,
  YDataTableViewPreference
} from '../data-table/YDataTable.vue'
import type { YBulkActionItem } from '../bulk-action-bar'
import YSearchForm, {
  type YSearchFormField,
  type YSearchFormSubmitPayload,
  type YSearchFormValue
} from '../search-form/YSearchForm.vue'

defineOptions({
  name: 'YResourcePage',
  inheritAttrs: false
})

export interface YResourcePageSearchPayload extends YSearchFormSubmitPayload {}
export type YResourcePageDensity = YCrudLayoutDensity
export type YResourcePageDetailPlacement = 'left' | 'right'

interface Props {
  title: string
  description?: string
  eyebrow?: string
  status?: string
  density?: YResourcePageDensity
  stickyHeader?: boolean
  ariaLabel?: string
  headingLevel?: 1 | 2 | 3
  searchModel?: Record<string, YSearchFormValue>
  searchFields?: YSearchFormField[]
  searchTitle?: string
  searchDescription?: string
  searchSubmitText?: string
  searchResetText?: string
  searchCollapsedCount?: number
  searchCollapsible?: boolean
  searchDefaultCollapsed?: boolean
  views: YDataViewItem[]
  viewValue?: string
  defaultView?: string
  viewPreference?: Partial<YDataTableViewPreference>
  columns: YTableColumn[]
  data: YTableRow[]
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
  detailOpen?: boolean
  detailTitle?: string
  detailDescription?: string
  detailPlacement?: YResourcePageDetailPlacement
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  eyebrow: '',
  status: '',
  density: 'comfortable',
  stickyHeader: false,
  ariaLabel: '',
  headingLevel: 1,
  searchModel: () => ({}),
  searchFields: () => [],
  searchTitle: 'Search resources',
  searchDescription: '',
  searchSubmitText: 'Search',
  searchResetText: 'Reset',
  searchCollapsedCount: 3,
  searchCollapsible: true,
  searchDefaultCollapsed: true,
  viewValue: undefined,
  defaultView: '',
  viewPreference: undefined,
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
  manageText: 'Manage views',
  detailOpen: false,
  detailTitle: 'Resource detail',
  detailDescription: '',
  detailPlacement: 'right'
})

const emit = defineEmits<{
  'update:searchModel': [value: Record<string, YSearchFormValue>]
  search: [payload: YResourcePageSearchPayload]
  reset: [value: Record<string, YSearchFormValue>]
  searchCollapseChange: [collapsed: boolean]
  'update:viewValue': [value: string]
  viewChange: [view: YDataViewItem]
  'update:viewPreference': [preference: YDataTableViewPreference]
  viewPreferenceChange: [payload: YDataViewPreferencePayload]
  saveView: [payload: YDataViewSavePayload]
  createView: []
  manageViews: []
  requestChange: [payload: YDataTableRequestPayload]
  'update:page': [page: number]
  pageChange: [payload: YDataTablePagePayload]
  'update:selectedRowKeys': [keys: string[]]
  selectionChange: [payload: YDataTableSelectionPayload]
  bulkAction: [payload: YDataTableBulkActionPayload]
  bulkClear: [payload: YDataTableSelectionPayload]
  columnChange: [payload: YDataTableColumnPayload]
  columnResize: [payload: YDataTableColumnResizePayload]
  closeDetail: []
}>()
</script>

<template>
  <YCrudLayout
    class="yok-resource-page"
    :class="`yok-resource-page--${density}`"
    :title="title"
    :description="description"
    :eyebrow="eyebrow"
    :status="status"
    :density="density"
    :sticky-header="stickyHeader"
    :aria-label="ariaLabel || title"
    :heading-level="headingLevel"
  >
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>

    <template v-if="searchFields.length" #search>
      <YSearchForm
        :model-value="searchModel"
        :fields="searchFields"
        :title="searchTitle"
        :description="searchDescription"
        :submit-text="searchSubmitText"
        :reset-text="searchResetText"
        :collapsed-count="searchCollapsedCount"
        :collapsible="searchCollapsible"
        :default-collapsed="searchDefaultCollapsed"
        :density="density"
        @update:model-value="$emit('update:searchModel', $event)"
        @search="$emit('search', $event)"
        @reset="$emit('reset', $event)"
        @collapse-change="$emit('searchCollapseChange', $event)"
      >
        <template v-if="$slots.searchActions" #actions>
          <slot name="searchActions" />
        </template>
      </YSearchForm>
    </template>

    <template v-if="$slots.filters" #filters>
      <slot name="filters" />
    </template>

    <template v-if="$slots.toolbar" #toolbar>
      <slot name="toolbar" />
    </template>

    <template #table>
      <YDataView
        :model-value="viewValue"
        :default-view="defaultView"
        :view-preference="viewPreference"
        :views="views"
        :columns="columns"
        :data="data"
        :saved-views-title="savedViewsTitle"
        :saved-views-description="savedViewsDescription"
        :table-title="tableTitle"
        :table-description="tableDescription"
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
        :save-text="saveText"
        :create-text="createText"
        :manage-text="manageText"
        @update:model-value="$emit('update:viewValue', $event)"
        @change="$emit('viewChange', $event)"
        @update:view-preference="$emit('update:viewPreference', $event)"
        @view-preference-change="$emit('viewPreferenceChange', $event)"
        @save="$emit('saveView', $event)"
        @create="$emit('createView')"
        @manage="$emit('manageViews')"
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
    </template>

    <template v-if="$slots.aside" #aside>
      <slot name="aside" />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </YCrudLayout>

  <YDrawer
    v-if="$slots.detail"
    :open="detailOpen"
    :title="detailTitle"
    :description="detailDescription"
    :placement="detailPlacement"
    @close="$emit('closeDetail')"
  >
    <slot name="detail" />
    <template v-if="$slots.detailFooter" #footer>
      <slot name="detailFooter" />
    </template>
  </YDrawer>
</template>

<style scoped>
.yok-resource-page {
  --yok-resource-page-surface: var(--yok-color-surface);

  min-width: 0;
  border-radius: var(--yok-radius-xl);
  background: var(--yok-resource-page-surface);
  color: var(--yok-color-text);
  transition:
    background var(--yok-motion-fast),
    color var(--yok-motion-fast);
}
</style>
