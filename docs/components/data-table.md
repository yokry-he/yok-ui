<script setup lang="ts">
import { ref } from 'vue'
import type { YBulkActionItem, YDataTableBulkActionPayload, YDataTableDensity, YDataTableRequestPayload } from '@yok-ui/admin'
import type { YTableFilterState, YTableSelectionPayload, YTableSortPayload } from '@yok-ui/core'

const selectedRowKeys = ref(['button'])
const columnKeys = ref(['name', 'package', 'status'])
const page = ref(1)
const density = ref<YDataTableDensity>('comfortable')
const dataFilters = ref<YTableFilterState>({ status: ['Stable'] })
const state = ref('Selected: button')
const remoteLoading = ref(true)
const remoteError = ref('')
const bulkMessage = ref('Bulk actions ready')
const emptyMessage = ref('Waiting for resources')
const dataTableColumnWidths = ref<Record<string, number>>({ name: 188, package: 136 })

const columns = [
  { key: 'name', label: 'Component', sortable: true },
  { key: 'package', label: 'Package' },
  { key: 'status', label: 'Status', sortable: true }
]

const rows = [
  { id: 'button', name: 'YButton', package: 'Core', status: 'Stable' },
  { id: 'table', name: 'YTable', package: 'Core', status: 'Stable' },
  { id: 'data-table', name: 'YDataTable', package: 'Admin', status: 'Beta' },
  { id: 'search-panel', name: 'YSearchPanel', package: 'Admin', status: 'Beta' },
  { id: 'brand-hero', name: 'YBrandHero', package: 'Brand', status: 'Stable' }
]

const matrixColumns = [
  { key: 'name', label: 'Component', width: '180px', fixed: 'left' as const, sortable: true },
  { key: 'package', label: 'Package', width: '140px' },
  {
    key: 'status',
    label: 'Status',
    width: '140px',
    align: 'center' as const,
    filters: [
      { text: 'Stable', value: 'Stable' },
      { text: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner', width: '160px' },
  { key: 'updated', label: 'Updated', width: '160px' },
  { key: 'score', label: 'Score', width: '120px', align: 'right' as const, fixed: 'right' as const, sortable: true }
]

const matrixRows = Array.from({ length: 14 }, (_, index) => {
  const source = rows[index % rows.length]

  return {
    ...source,
    id: `${source.id}-${index + 1}`,
    name: `${source.name} ${index + 1}`,
    owner: index % 2 === 0 ? 'Core team' : 'Experience team',
    updated: `2026-06-${String(16 - (index % 6)).padStart(2, '0')}`,
    score: 92 - index
  }
})

const virtualRows = Array.from({ length: 1000 }, (_, index) => {
  const source = rows[index % rows.length]

  return {
    ...source,
    id: `virtual-${index + 1}`,
    name: `${source.name} ${index + 1}`,
    package: index % 2 === 0 ? source.package : 'Admin',
    status: index % 3 === 0 ? 'Stable' : 'Beta'
  }
})

const bulkActionItems: YBulkActionItem[] = [
  { label: 'Archive', value: 'archive', tone: 'info' },
  { label: 'Approve', value: 'approve', tone: 'success' },
  { label: 'Delete', value: 'delete', tone: 'danger' }
]

const dataTableCodeSetup = [
  "import { ref } from 'vue'",
  "import { YDataTable, type YDataTableBulkActionPayload, type YDataTableDensity, type YDataTableRequestPayload } from '@yok-ui/admin'",
  "import { YButton, YEmpty, YTag, type YTableFilterState, type YTableSelectionPayload, type YTableSortPayload } from '@yok-ui/core'",
  '',
  "const selectedRowKeys = ref(['button'])",
  "const columnKeys = ref(['name', 'package', 'status'])",
  'const page = ref(1)',
  "const density = ref<YDataTableDensity>('comfortable')",
  "const dataFilters = ref<YTableFilterState>({ status: ['Stable'] })",
  "const state = ref('Selected: button')",
  'const remoteLoading = ref(true)',
  "const remoteError = ref('')",
  "const bulkMessage = ref('Bulk actions ready')",
  "const emptyMessage = ref('Waiting for resources')",
  'const dataTableColumnWidths = ref<Record<string, number>>({ name: 188, package: 136 })',
  'const query = ref({ page: 2, pageSize: 3 })',
  'const total = 42',
  '',
  `const columns = ${JSON.stringify(columns, null, 2)}`,
  '',
  `const rows = ${JSON.stringify(rows, null, 2)}`,
  '',
  `const matrixColumns = ${JSON.stringify(matrixColumns, null, 2)}`,
  '',
  'const matrixRows = Array.from({ length: 14 }, (_, index) => {',
  '  const source = rows[index % rows.length]',
  '',
  '  return {',
  '    ...source,',
  '    id: `${source.id}-${index + 1}`,',
  '    name: `${source.name} ${index + 1}`,',
  "    owner: index % 2 === 0 ? 'Core team' : 'Experience team',",
  "    updated: `2026-06-${String(16 - (index % 6)).padStart(2, '0')}`,",
  '    score: 92 - index',
  '  }',
  '})',
  '',
  'const virtualRows = Array.from({ length: 1000 }, (_, index) => {',
  '  const source = rows[index % rows.length]',
  '',
  '  return {',
  '    ...source,',
  '    id: `virtual-${index + 1}`,',
  '    name: `${source.name} ${index + 1}`,',
  "    package: index % 2 === 0 ? source.package : 'Admin',",
  "    status: index % 3 === 0 ? 'Stable' : 'Beta'",
  '  }',
  '})',
  '',
  `const bulkActionItems = ${JSON.stringify(bulkActionItems, null, 2)}`,
  '',
  'function handleSelectionChange(payload: YTableSelectionPayload) {',
  "  state.value = `Selected: ${payload.selectedRowKeys.join(', ') || 'none'}`",
  '}',
  '',
  'function handleSortChange(payload: YTableSortPayload) {',
  "  state.value = payload.order ? `Sorted by ${payload.key} ${payload.order}` : 'Sort cleared'",
  '}',
  '',
  'function handleRequestChange(payload: YDataTableRequestPayload) {',
  '  state.value = `Request: ${payload.reason} · page ${payload.page}`',
  '}',
  '',
  'function handleBulkAction(payload: YDataTableBulkActionPayload) {',
  "  bulkMessage.value = `${payload.action.label}: ${payload.selectedRows.map((row) => row.name).join(', ')}`",
  '}',
  '',
  'function loadRows(payload?: YDataTableRequestPayload) {',
  "  state.value = payload ? `Request: ${payload.reason} · page ${payload.page}` : 'Refreshing component inventory...'",
  '}',
  '',
  'function loadDrafts() {',
  "  emptyMessage.value = 'Refreshing drafts from empty state'",
  '}'
].join('\n')

const dataTableCode = [
  '<YDataTable',
  '  v-model:page="page"',
  '  v-model:column-keys="columnKeys"',
  '  v-model:selected-row-keys="selectedRowKeys"',
  '  v-model:density="density"',
  '  title="Component inventory"',
  '  description="Review package coverage and release readiness."',
  '  caption="Component inventory table"',
  '  :columns="columns"',
  '  :data="rows"',
  '  :bulk-actions="bulkActionItems"',
  '  bulk-action-clear-text="Clear selected"',
  '  column-reset-text="Restore columns"',
  '  reorderable-columns',
  '  sticky-bulk-actions',
  '  selectable',
  '  pagination',
  '  show-column-settings',
  '  show-density-settings',
  '  refreshable',
  '  striped',
  '  :page-size="3"',
  '  @refresh="loadRows"',
  '  @bulk-action="handleBulkAction"',
  "  @bulk-clear=\"bulkMessage = 'Selection cleared from bulk bar'\"",
  '  @request-change="handleRequestChange"',
  '  @selection-change="handleSelectionChange"',
  '  @sort-change="handleSortChange"',
  '>',
  '  <template #actions>',
  '    <YButton variant="secondary">Export</YButton>',
  '    <YButton variant="primary">Create</YButton>',
  '  </template>',
  '  <template #bulkSummary="{ selectedCount, selectedRows }">',
  "    <span>{{ selectedCount }} selected · {{ selectedRows.map((row) => row.name).join(', ') }}</span>",
  '  </template>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YDataTable>'
].join('\n')

const remoteCode = `<YDataTable
  remote
  pagination
  :page="query.page"
  :page-size="query.pageSize"
  :total="total"
  :columns="columns"
  :data="rows.slice(0, 3)"
  :loading="remoteLoading"
  :error-text="remoteError"
  refreshable
  title="Remote inventory"
  description="Server-side paging keeps the request contract predictable."
  caption="Remote component inventory"
  loading-text="Refreshing component inventory"
  summary="3 rows shown · remote source"
  striped
  @refresh="state = 'Retry from error banner'"
  @request-change="loadRows"
/>`

const emptyCode = [
  '<YDataTable',
  '  title="Component drafts"',
  '  :columns="columns"',
  '  :data="[]"',
  '  empty-text="No drafts yet"',
  '  refreshable',
  '  @refresh="loadDrafts"',
  '>',
  '  <template #empty="{ emptyText, refresh }">',
  '    <YEmpty :title="emptyText" description="Create a draft or refresh the list.">',
  '      <template #action>',
  '        <YButton variant="primary" @click="refresh">Refresh drafts</YButton>',
  '      </template>',
  '    </YEmpty>',
  '  </template>',
  '</YDataTable>'
].join('\n')

const scrollCode = [
  '<YDataTable',
  '  v-model:filters="dataFilters"',
  '  title="Release matrix"',
  '  description="Scan many rows without losing column context."',
  '  :columns="matrixColumns"',
  '  :data="matrixRows"',
  '  :max-height="320"',
  '  bulk-action-clear-text="Clear selected"',
  '  selectable',
  '  striped',
  '  show-density-settings',
  '  @filter-change="state = `Filter: ${$event.columnKey} · ${$event.values.join(\', \') || \'all\'}`"',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YDataTable>'
].join('\n')

const resizeCode = [
  '<YDataTable',
  '  v-model:column-widths="dataTableColumnWidths"',
  '  title="Resizable release matrix"',
  '  description="Tune important columns without leaving the current data workflow."',
  '  :columns="matrixColumns"',
  '  :data="matrixRows"',
  '  resizable',
  '  :min-column-width="112"',
  '  :summary="state"',
  '  striped',
  '  @column-resize="state = `Saved widths: ${Object.keys($event.widths).length} columns · ${$event.columnKey} ${$event.width}px`"',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YDataTable>'
].join('\n')

const virtualCode = [
  '<YDataTable',
  '  title="Virtualized release queue"',
  '  description="Scroll a thousand generated rows without mounting the full tbody."',
  '  :columns="columns"',
  '  :data="virtualRows"',
  '  virtualized',
  '  :virtual-height="320"',
  '  :virtual-row-height="48"',
  '  :virtual-overscan="4"',
  '  striped',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YDataTable>'
].join('\n')

function handleSelectionChange(payload: YTableSelectionPayload) {
  state.value = `Selected: ${payload.selectedRowKeys.join(', ') || 'none'}`
}

function handleSortChange(payload: YTableSortPayload) {
  state.value = payload.order ? `Sorted by ${payload.key} ${payload.order}` : 'Sort cleared'
}

function handleRequestChange(payload: YDataTableRequestPayload) {
  state.value = `Request: ${payload.reason} · page ${payload.page}`
}

function handleBulkAction(payload: YDataTableBulkActionPayload) {
  bulkMessage.value = `${payload.action.label}: ${payload.selectedRows.map((row) => row.name).join(', ')}`
}

function toggleRemoteState() {
  if (remoteLoading.value) {
    remoteLoading.value = false
    remoteError.value = 'Network timeout while loading component inventory.'
    state.value = 'Remote request failed'
    return
  }

  remoteLoading.value = true
  remoteError.value = ''
  state.value = 'Retrying remote request...'
}
</script>

# Data Table

Data Table 是 Admin 包的后台列表组合组件。它复用 Core 的 `YTable` 和 `YPagination`，把标题、操作区、批量状态、选择、排序和分页组合成常见的资源管理页底座。

::: tip TIP
`YDataTable` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Resource management table {#data-table-resource-management-table}

<DocDemo
  title="Resource management table"
  description="把表格、分页、列设置、列重置、刷新和批量操作放进一个后台列表框架里。"
  :code="dataTableCode"
  :setup="dataTableCodeSetup"
  :usage="['pagination', 'column settings', 'column reset', 'bulk actions', 'request-change']"
>
  <YDataTable
    v-model:page="page"
    v-model:column-keys="columnKeys"
    v-model:selected-row-keys="selectedRowKeys"
    v-model:density="density"
    title="Component inventory"
    description="Review package coverage and release readiness."
    caption="Component inventory table"
    :columns="columns"
    :data="rows"
    :bulk-actions="bulkActionItems"
    bulk-action-clear-text="Clear selected"
    column-reset-text="Restore columns"
    reorderable-columns
    sticky-bulk-actions
    selectable
    pagination
    show-column-settings
    show-density-settings
    refreshable
    striped
    :page-size="3"
    @refresh="state = 'Refreshing component inventory...'"
    @bulk-action="handleBulkAction"
    @bulk-clear="bulkMessage = 'Selection cleared from bulk bar'"
    @density-change="state = `Density: ${density}`"
    @request-change="handleRequestChange"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <template #actions>
      <YButton variant="secondary">Export</YButton>
      <YButton variant="primary">Create</YButton>
    </template>
    <template #bulkSummary="{ selectedCount, selectedRows }">
      <span>{{ selectedCount }} selected · {{ selectedRows.map((row) => row.name).join(', ') }}</span>
    </template>
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YDataTable>
  <p class="demo-note">{{ state }}</p>
  <p class="demo-note">{{ bulkMessage }}</p>
</DocDemo>

## Custom empty state {#data-table-custom-empty-state}

<DocDemo
  title="Custom empty state"
  description="后台列表的空状态通常要承载创建、刷新或清空筛选动作，empty 插槽会透传内部表格状态和 refresh 函数。"
  :code="emptyCode"
  :setup="dataTableCodeSetup"
  :usage="['empty slot', 'refresh', 'YEmpty']"
>
  <YDataTable
    title="Component drafts"
    description="Create or refresh draft rows from the same empty state."
    :columns="columns"
    :data="[]"
    empty-text="No drafts yet"
    refreshable
    @refresh="emptyMessage = 'Refreshing drafts from empty state'"
  >
    <template #actions>
      <YButton variant="primary">Create draft</YButton>
    </template>
    <template #empty="{ emptyText, refresh }">
      <YEmpty :title="emptyText" description="Create a draft or refresh the list.">
        <template #action>
          <YButton variant="primary" @click="refresh">Refresh drafts</YButton>
        </template>
      </YEmpty>
    </template>
  </YDataTable>
  <p class="demo-note">{{ emptyMessage }}</p>
</DocDemo>

## Scrollable resource matrix {#data-table-scrollable-resource-matrix}

<DocDemo
  title="Scrollable resource matrix"
  description="后台资源列表可以限制表格工作区高度，表头吸顶、左右固定列和选择列会在内部滚动时保持可见。"
  :code="scrollCode"
  :setup="dataTableCodeSetup"
  :usage="['max-height', 'fixed header', 'fixed columns', 'density']"
>
  <YDataTable
    v-model:filters="dataFilters"
    title="Release matrix"
    description="Scan many rows without losing column context."
    :columns="matrixColumns"
    :data="matrixRows"
    :max-height="320"
    bulk-action-clear-text="Clear selected"
    selectable
    striped
    show-density-settings
    @filter-change="state = `Filter: ${$event.columnKey} · ${$event.values.join(', ') || 'all'}`"
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YDataTable>
</DocDemo>

## Resizable release matrix {#data-table-resizable-release-matrix}

<DocDemo
  title="Resizable release matrix"
  description="允许用户在后台表格里临时拉宽关键列；列宽调整结束会触发 columnResize，业务层可把 widths 保存为个人偏好。"
  :code="resizeCode"
  :setup="dataTableCodeSetup"
  :usage="['resizable', 'min-column-width', 'column-resize', 'preferences']"
>
  <YDataTable
    v-model:column-widths="dataTableColumnWidths"
    title="Resizable release matrix"
    description="Tune important columns without leaving the current data workflow."
    :columns="matrixColumns"
    :data="matrixRows"
    resizable
    :min-column-width="112"
    :summary="state"
    striped
    @column-resize="state = `Saved widths: ${Object.keys($event.widths).length} columns · ${$event.columnKey} ${$event.width}px`"
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YDataTable>
</DocDemo>

## Virtualized thousand-row table {#data-table-virtualized-thousand-row-table}

<DocDemo
  title="Virtualized thousand-row table"
  description="面向千级后台数据，固定表格工作区高度，只渲染视口附近行，保留排序、筛选、选择和 summary 状态。"
  :code="virtualCode"
  :setup="dataTableCodeSetup"
  :usage="['virtualized', '1000 rows', 'fixed height', 'performance']"
>
  <YDataTable
    title="Virtualized release queue"
    description="Scroll a thousand generated rows without mounting the full tbody."
    :columns="columns"
    :data="virtualRows"
    virtualized
    :virtual-height="320"
    :virtual-row-height="48"
    :virtual-overscan="4"
    striped
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YDataTable>
</DocDemo>

## Remote mode {#data-table-remote-mode}

<DocDemo
  title="Remote request contract"
  description="remote 开启后，分页、排序、刷新和列设置变化都会通过 requestChange 交给业务层请求接口。"
  :code="remoteCode"
  :setup="dataTableCodeSetup"
  :usage="['remote', 'server pagination', 'single request entry']"
>
  <div class="docs-panel">
    <p class="docs-eyebrow">request contract</p>
    <h2>业务层只需要监听一个 request-change</h2>
    <p>
      本地分页适合少量静态数据；远程模式适合后台资源列表。YDataTable 不直接请求接口，
      它只把用户意图整理成稳定 payload，交给业务代码处理。
    </p>
  </div>
</DocDemo>

## Remote loading and error {#data-table-remote-loading-and-error}

<DocDemo
  title="Remote loading and error"
  description="远程列表常见的加载、失败和重试状态会统一落在表格语义、状态提示和错误提示条里。"
  :code="remoteCode"
  :setup="dataTableCodeSetup"
  :usage="['loading', 'loading-text', 'error-text', 'summary']"
>
  <div class="demo-actions">
    <YButton type="button" variant="primary" @click="toggleRemoteState">
      {{ remoteLoading ? 'Show error' : 'Retry request' }}
    </YButton>
    <YTag :tone="remoteLoading ? 'info' : 'danger'">
      {{ remoteLoading ? 'Refreshing rows' : 'Request failed' }}
    </YTag>
  </div>
  <YDataTable
    remote
    pagination
    refreshable
    title="Remote inventory"
    description="Server-side paging keeps the request contract predictable."
    caption="Remote component inventory"
    :columns="columns"
    :data="rows.slice(0, 3)"
    :loading="remoteLoading"
    :error-text="remoteError"
    loading-text="Refreshing component inventory"
    summary="3 rows shown · remote source"
    :page="2"
    :page-size="3"
    :total="42"
    striped
    @refresh="state = 'Retry from error banner'"
    @request-change="handleRequestChange"
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YDataTable>
  <p class="demo-note">{{ state }}</p>
</DocDemo>

## Usage notes {#data-table-usage-notes}

- `bulkActions` 适合常见批量动作，点击后通过 `bulk-action` 返回 action、selectedRowKeys 和 selectedRows。
- `bulkActions` prop 与 `#bulkActions` 插槽可以二选一；需要完全自定义按钮时使用插槽，需要快速配置时使用 props。
- `bulk-action-clear-text` 控制清空选择按钮文案；清空时会同步触发 `update:selectedRowKeys`、`selectionChange` 和 `bulk-clear`。
- `sticky-bulk-actions` 适合长表格和后台列表页，让批量操作栏在滚动时停留在当前工作区顶部。
- `#empty` 会透传给内部 `YTable`，并额外提供 `errorText` 与 `refresh`，适合做空列表、空筛选、失败重试等业务状态。
- `density` 支持 `comfortable` 和 `compact`，可通过 `show-density-settings` 暴露内置切换器；旧的 `compact` prop 仍可作为兼容快捷方式。
- `viewPreference` / `defaultViewPreference` 是更适合业务持久化的聚合入口，会同时包含 `columnKeys`、`columnWidths`、`density` 和 `filters`；用户调整这些设置时会触发 `update:viewPreference` 与 `viewPreferenceChange`。
- `columnKeys` / `defaultColumnKeys` 同时控制可见列和列顺序，适合保存用户视图偏好。
- `reorderableColumns` 会在列设置区展示可访问的列顺序调整按钮；调整后通过 `update:columnKeys`、`columnChange` 和 remote `request-change` 同步新顺序。
- `column-reset-text` 控制列设置区的恢复默认按钮文案；点击后回到 `defaultColumnKeys`，未配置时回到全部列。
- `resizable` 会透传给内部 `YTable`，适合后台列表保存用户列宽偏好；`columnResize.widths` 可作为偏好配置持久化。
- `columnWidths` / `defaultColumnWidths` 支持受控和非受控列宽偏好；remote 模式拖拽结束后，`request-change` 会以 `reason: 'columnResize'` 携带 `columnWidths`。
- `maxHeight` 会传给内部 `YTable`，用于长列表、抽屉列表和后台工作台里的固定表头滚动区域。
- `virtualized` 适合千级以上列表，开启后通过 `virtualHeight`、`virtualRowHeight` 和 `virtualOverscan` 控制固定高度、行高估算和视口外缓冲渲染。
- `filters` / `defaultFilters` 会纳入本地筛选、总数和分页计算；remote 模式下会通过 `request-change` 的 `filters` 字段交给业务层请求。
- `showFilterSummary` 默认开启；有活跃筛选时会展示可清除的筛选胶囊和 Clear all 入口。
- Live example 的“筛选摘要”场景用于验收后台列表常见的活跃条件展示：默认筛选会同步到表格行、顶部筛选胶囊、Clear all 入口和可复制源码。
- Live example 的“列配置重置”场景用于验收隐藏列后的恢复默认入口，以及 remote 模式下 `requestChange.reason === 'columns'` 的请求边界。
- Live example 的“列宽调整”场景用于验收表头拖拽手柄、最小列宽约束和预览源码中的列宽偏好入口。
- Live example 的“千行性能”场景用于验收虚拟滚动表格的千行数据、固定高度和视口附近渲染边界。
- 键盘路径应优先保留原生控件语义：Tab 进入表格工具栏、密度切换、列设置、行选择和分页；Space 切换 checkbox 选择；Enter 激活工具栏、刷新、批量操作和分页按钮。Live example 的“键盘巡航”场景会把这条路径显式放进验收面板。

## Data Table API {#data-table-api}

<ComponentApiSection name="YDataTable" />

## Accessibility {#accessibility}

- 外层容器同步 `aria-busy`，loading 时通过 `role="status"` 宣告。
- 错误状态使用 `role="alert"`，可与 refreshable 的 Retry 动作组合。
- 批量选择状态使用 `role="status"` 和 polite live region。
- 列设置使用原生 checkbox，至少保留一列可见。
- 恢复默认列按钮使用原生 button，当前列配置已经等于默认列时会禁用，避免重复提交无意义变更。
- 表头筛选继承内部 `YTable` 的 details / checkbox / radio 语义，remote 模式仍保留清晰请求状态流。
- 开启虚拟滚动时，summary 仍会宣告完整数据规模；业务应提供稳定的 `rowKey`，避免滚动窗口复用时选择状态混乱。
- 筛选摘要使用原生 button，单个筛选和 Clear all 都会同步 `update:filters`，remote 模式会继续发出统一请求载荷。
- 自定义空状态继承内部表格的 `role="status"` 容器，插槽中的创建和刷新动作应保留原生按钮语义。
- 表格 caption、summary、固定表头、排序、选择和分页语义继承自 Core 的 `YTable` 与 `YPagination`。
