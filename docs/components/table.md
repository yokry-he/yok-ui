<script setup lang="ts">
import { ref } from 'vue'
import type { YTableExpandPayload, YTableFilterState, YTableSelectionPayload, YTableSortPayload } from '@yok-ui/core'

const columns = [
  { key: 'name', label: 'Component', sortable: true },
  { key: 'package', label: 'Package' },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'stars', label: 'Stars', align: 'right' as const, sortable: true }
]

const rows = [
  { id: 'table', name: 'YTable', package: 'Core', status: 'Stable', stars: 9, detail: 'Supports selection, sorting, filters, fixed columns and expandable details.' },
  { id: 'pagination', name: 'YPagination', package: 'Core', status: 'Stable', stars: 7, detail: 'Used with tables to handle paged datasets and server-side navigation.' },
  { id: 'popover', name: 'YPopover', package: 'Core', status: 'Beta', stars: 5, detail: 'Built on Floating UI for anchored overlays and contextual actions.' }
]

const selectedRowKeys = ref(['table'])
const expandedRowKeys = ref(['table'])
const tableState = ref('Selected: table')
const tableLoading = ref(true)
const emptyRows = ref<typeof rows>([])
const tableFilters = ref<YTableFilterState>({ status: ['Stable'] })
const tableColumnWidths = ref<Record<string, number>>({ name: 184, package: 136 })

const wideColumns = [
  { key: 'name', label: 'Component', width: '180px', fixed: 'left' as const, sortable: true },
  { key: 'package', label: 'Package', width: '140px' },
  { key: 'status', label: 'Status', width: '140px', align: 'center' as const },
  { key: 'owner', label: 'Owner', width: '180px' },
  { key: 'updated', label: 'Updated', width: '180px' },
  { key: 'stars', label: 'Stars', width: '120px', align: 'right' as const, fixed: 'right' as const, sortable: true }
]

const wideRows = [
  { id: 'button', name: 'YButton', package: 'Core', status: 'Stable', owner: 'Core team', updated: '2026-06-16', stars: 12 },
  { id: 'table', name: 'YTable', package: 'Core', status: 'Stable', owner: 'Data team', updated: '2026-06-16', stars: 9 },
  { id: 'data-table', name: 'YDataTable', package: 'Admin', status: 'Beta', owner: 'Admin team', updated: '2026-06-15', stars: 6 }
]

const filterColumns = [
  { key: 'name', label: 'Component', sortable: true },
  {
    key: 'package',
    label: 'Package',
    filters: [
      { text: 'Core', value: 'Core' },
      { text: 'Admin', value: 'Admin' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    filters: [
      { text: 'Stable', value: 'Stable' },
      { text: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'stars', label: 'Stars', align: 'right' as const, sortable: true }
]

const scrollRows = Array.from({ length: 12 }, (_, index) => {
  const source = wideRows[index % wideRows.length]

  return {
    ...source,
    id: `${source.id}-${index + 1}`,
    name: `${source.name} ${index + 1}`,
    updated: `2026-06-${String(16 - (index % 5)).padStart(2, '0')}`,
    stars: Number(source.stars) + index
  }
})

const virtualRows = Array.from({ length: 1000 }, (_, index) => {
  const source = rows[index % rows.length]

  return {
    ...source,
    id: `virtual-${index + 1}`,
    name: `${source.name} ${index + 1}`,
    stars: Number(source.stars) + (index % 20)
  }
})

const tableCodeSetup = [
  "import { ref } from 'vue'",
  "import { YButton, YEmpty, YTable, YTag, type YTableExpandPayload, type YTableFilterState, type YTableSelectionPayload, type YTableSortPayload } from '@yok-ui/core'",
  '',
  "const selectedRowKeys = ref(['table'])",
  "const expandedRowKeys = ref(['table'])",
  "const tableState = ref('Selected: table')",
  'const tableLoading = ref(true)',
  'const emptyRows = ref([])',
  "const tableFilters = ref<YTableFilterState>({ status: ['Stable'] })",
  'const tableColumnWidths = ref<Record<string, number>>({ name: 184, package: 136 })',
  '',
  `const columns = ${JSON.stringify(columns, null, 2)}`,
  '',
  `const rows = ${JSON.stringify(rows, null, 2)}`,
  '',
  `const wideColumns = ${JSON.stringify(wideColumns, null, 2)}`,
  '',
  `const wideRows = ${JSON.stringify(wideRows, null, 2)}`,
  '',
  `const filterColumns = ${JSON.stringify(filterColumns, null, 2)}`,
  '',
  'const scrollRows = Array.from({ length: 12 }, (_, index) => {',
  '  const source = wideRows[index % wideRows.length]',
  '',
  '  return {',
  '    ...source,',
  '    id: `${source.id}-${index + 1}`,',
  '    name: `${source.name} ${index + 1}`,',
  "    updated: `2026-06-${String(16 - (index % 5)).padStart(2, '0')}`,",
  '    stars: Number(source.stars) + index',
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
  '    stars: Number(source.stars) + (index % 20)',
  '  }',
  '})',
  '',
  'function handleSelectionChange(payload: YTableSelectionPayload) {',
  "  tableState.value = `Selected: ${payload.selectedRowKeys.join(', ') || 'none'}`",
  '}',
  '',
  'function handleSortChange(payload: YTableSortPayload) {',
  "  tableState.value = payload.order ? `Sorted by ${payload.key} ${payload.order}` : 'Sort cleared'",
  '}',
  '',
  'function handleExpandChange(payload: YTableExpandPayload) {',
  "  tableState.value = `${payload.expanded ? 'Expanded' : 'Collapsed'}: ${payload.rowKey}`",
  '}',
  '',
  'function toggleTableLoading() {',
  '  tableLoading.value = !tableLoading.value',
  '}'
].join('\n')

const tableCode = [
  '<YTable',
  '  v-model:selected-row-keys="selectedRowKeys"',
  '  :columns="columns"',
  '  :data="rows"',
  '  caption="Component maturity"',
  '  selectable',
  '  striped',
  '  @selection-change="handleSelectionChange"',
  '  @sort-change="handleSortChange"',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

const expandableCode = [
  '<YTable',
  '  v-model:expanded-row-keys="expandedRowKeys"',
  '  :columns="columns"',
  '  :data="rows"',
  '  caption="Expandable component details"',
  '  expandable',
  '  striped',
  '  @expand-change="handleExpandChange"',
  '>',
  '  <template #expand="{ row, rowKey }">',
  '    <div class="demo-detail">',
  '      <strong>{{ rowKey }}</strong>',
  '      <span>{{ row.detail }}</span>',
  '    </div>',
  '  </template>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

const loadingCode = [
  '<YTable',
  '  :columns="columns"',
  '  :data="rows"',
  '  :loading="tableLoading"',
  '  caption="Release readiness"',
  '  loading-text="Refreshing component data"',
  '  summary="3 rows · remote refresh pending"',
  '  striped',
  '/>'
].join('\n')

const fixedColumnsCode = [
  '<YTable',
  '  :columns="wideColumns"',
  '  :data="wideRows"',
  '  caption="Release matrix"',
  '  summary="6 columns · fixed edges"',
  '  striped',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

const resizeCode = [
  '<YTable',
  '  v-model:column-widths="tableColumnWidths"',
  '  :columns="wideColumns"',
  '  :data="wideRows"',
  '  resizable',
  '  :min-column-width="112"',
  '  :summary="tableState"',
  '  @column-resize="tableState = `Saved widths: ${Object.keys($event.widths).length} columns · ${$event.columnKey} ${$event.width}px`"',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

const filterCode = [
  '<YTable',
  '  v-model:filters="tableFilters"',
  '  :columns="filterColumns"',
  '  :data="rows"',
  '  caption="Filterable component maturity"',
  '  summary="Column filters keep scan context close to the header"',
  '  striped',
  '  @filter-change="tableState = `Filter: ${$event.columnKey} · ${$event.values.join(\', \') || \'all\'}`"',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

const fixedHeaderCode = [
  '<YTable',
  '  :columns="wideColumns"',
  '  :data="scrollRows"',
  '  :max-height="280"',
  '  caption="Scrollable release matrix"',
  '  summary="12 rows · fixed header and fixed edges"',
  '  striped',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

const virtualCode = [
  '<YTable',
  '  :columns="columns"',
  '  :data="virtualRows"',
  '  virtualized',
  '  :virtual-height="280"',
  '  :virtual-row-height="48"',
  '  :virtual-overscan="4"',
  '  caption="Virtualized component matrix"',
  '  striped',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

const emptyCode = [
  '<YTable',
  '  :columns="columns"',
  '  :data="emptyRows"',
  '  empty-text="No components matched"',
  '  caption="Filtered component table"',
  '>',
  '  <template #empty="{ emptyText }">',
  '    <YEmpty :title="emptyText" description="Try another filter or create a component.">',
    '      <template #action>',
  '        <YButton variant="primary" @click="emptyRows = rows">Load demo rows</YButton>',
  '      </template>',
  '    </YEmpty>',
  '  </template>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YTable>'
].join('\n')

function handleSelectionChange(payload: YTableSelectionPayload) {
  tableState.value = `Selected: ${payload.selectedRowKeys.join(', ') || 'none'}`
}

function handleSortChange(payload: YTableSortPayload) {
  tableState.value = payload.order ? `Sorted by ${payload.key} ${payload.order}` : 'Sort cleared'
}

function handleExpandChange(payload: YTableExpandPayload) {
  tableState.value = `${payload.expanded ? 'Expanded' : 'Collapsed'}: ${payload.rowKey}`
}

function toggleTableLoading() {
  tableLoading.value = !tableLoading.value
}
</script>

# Table

Table 用于展示结构化数据，是后台管理、组件清单和资源列表的基础。当前版本提供列定义、列宽、固定列、展开行、空状态、加载态、caption、summary、条纹行、单元格插槽、排序和行选择。

## Example

<DocDemo
  title="Selectable table"
  description="列定义、排序、选择和单元格插槽组合在一个稳定的 table 语义里。"
  :code="tableCode"
  :setup="tableCodeSetup"
  :usage="['columns', 'row selection', 'sort-change', 'cell slots']"
>
  <YTable
    v-model:selected-row-keys="selectedRowKeys"
    :columns="columns"
    :data="rows"
    caption="Component maturity"
    selectable
    striped
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
  <p class="demo-note">{{ tableState }}</p>
</DocDemo>

<DocDemo
  title="Expandable rows"
  description="展开行适合展示详情、审计信息或二级操作；支持受控展开键、默认展开键和 expand slot。"
  :code="expandableCode"
  :setup="tableCodeSetup"
  :usage="['expandable', 'expanded-row-keys', 'expand slot', 'expand-change']"
>
  <YTable
    v-model:expanded-row-keys="expandedRowKeys"
    :columns="columns"
    :data="rows"
    caption="Expandable component details"
    expandable
    striped
    @expand-change="handleExpandChange"
  >
    <template #expand="{ row, rowKey }">
      <div class="demo-detail">
        <strong>{{ rowKey }}</strong>
        <span>{{ row.detail }}</span>
      </div>
    </template>
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
  <p class="demo-note">{{ tableState }}</p>
</DocDemo>

<DocDemo
  title="Loading and summary"
  description="远程刷新时保留已有表格结构，用 aria-busy、状态提示和底部摘要表达当前数据状态。"
  :code="loadingCode"
  :setup="tableCodeSetup"
  :usage="['loading', 'loading-text', 'caption', 'summary']"
>
  <div class="demo-actions">
    <YButton type="button" variant="primary" @click="toggleTableLoading">
      {{ tableLoading ? 'Stop loading' : 'Show loading' }}
    </YButton>
    <YTag tone="info">Remote refresh keeps row layout stable</YTag>
  </div>
  <YTable
    :columns="columns"
    :data="rows"
    :loading="tableLoading"
    caption="Release readiness"
    loading-text="Refreshing component data"
    summary="3 rows · remote refresh pending"
    striped
  />
</DocDemo>

<DocDemo
  title="Fixed columns"
  description="列很多时可给关键列设置 width 和 fixed，左右固定列会在横向滚动时保持可见。"
  :code="fixedColumnsCode"
  :setup="tableCodeSetup"
  :usage="['width', 'fixed left', 'fixed right', 'horizontal scroll']"
>
  <YTable
    :columns="wideColumns"
    :data="wideRows"
    caption="Release matrix"
    summary="6 columns · fixed edges"
    striped
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
</DocDemo>

<DocDemo
  title="Resizable columns"
  description="后台表格经常需要临时拉宽关键列；开启 resizable 后，表头右侧手柄会调整列宽，并在结束时抛出 columnResize。"
  :code="resizeCode"
  :setup="tableCodeSetup"
  :usage="['resizable', 'min-column-width', 'column-resize', 'column width']"
>
  <YTable
    v-model:column-widths="tableColumnWidths"
    :columns="wideColumns"
    :data="wideRows"
    resizable
    :min-column-width="112"
    :summary="tableState"
    @column-resize="tableState = `Saved widths: ${Object.keys($event.widths).length} columns · ${$event.columnKey} ${$event.width}px`"
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
</DocDemo>

<DocDemo
  title="Column filters"
  description="列配置可以声明 filters，表头会展示轻量筛选器；同一列内取并集，不同列之间取交集。"
  :code="filterCode"
  :setup="tableCodeSetup"
  :usage="['filters', 'v-model:filters', 'filter-change', 'filter-method']"
>
  <YTable
    v-model:filters="tableFilters"
    :columns="filterColumns"
    :data="rows"
    caption="Filterable component maturity"
    summary="Column filters keep scan context close to the header"
    striped
    @filter-change="tableState = `Filter: ${$event.columnKey} · ${$event.values.join(', ') || 'all'}`"
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
  <p class="demo-note">{{ tableState }}</p>
</DocDemo>

<DocDemo
  title="Fixed header"
  description="设置 max-height 后表格会启用纵向滚动，表头在滚动容器内吸顶，并可与左右固定列一起使用。"
  :code="fixedHeaderCode"
  :setup="tableCodeSetup"
  :usage="['max-height', 'sticky header', 'fixed columns', 'vertical scroll']"
>
  <YTable
    :columns="wideColumns"
    :data="scrollRows"
    :max-height="280"
    caption="Scrollable release matrix"
    summary="12 rows · fixed header and fixed edges"
    striped
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
</DocDemo>

<DocDemo
  title="Virtualized rows"
  description="千级数据不需要一次挂载完整 tbody；开启 virtualized 后只渲染视口附近行，同时保留表头、排序、筛选和 summary。"
  :code="virtualCode"
  :setup="tableCodeSetup"
  :usage="['virtualized', '1000 rows', 'fixed height', 'performance']"
>
  <YTable
    :columns="columns"
    :data="virtualRows"
    virtualized
    :virtual-height="280"
    :virtual-row-height="48"
    :virtual-overscan="4"
    caption="Virtualized component matrix"
    striped
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
</DocDemo>

<DocDemo
  title="Custom empty state"
  description="空数据时可以使用 empty slot 放入 YEmpty、重试按钮或创建入口，保留表格外层状态语义。"
  :code="emptyCode"
  :setup="tableCodeSetup"
  :usage="['empty slot', 'empty-text', 'custom action']"
>
  <div class="demo-actions">
    <YButton type="button" variant="primary" @click="emptyRows = rows">
      Load rows
    </YButton>
    <YButton type="button" variant="secondary" @click="emptyRows = []">
      Clear rows
    </YButton>
  </div>
  <YTable
    :columns="columns"
    :data="emptyRows"
    empty-text="No components matched"
    caption="Filtered component table"
  >
    <template #empty="{ emptyText }">
      <YEmpty :title="emptyText" description="Try another filter or create a component.">
        <template #action>
          <YButton variant="primary" @click="emptyRows = rows">Load demo rows</YButton>
        </template>
      </YEmpty>
    </template>
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YTable>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="table"
  title="在线编辑 Table 示例"
  description="运行器内置列和数据，可直接调整排序筛选、选择摘要、滚动矩阵、加载、空筛选结果、远程受控和键盘巡航场景。"
/>

## Usage notes

- `loading` 不会清空已有数据，适合远程刷新、筛选请求和分页请求时保持表格尺寸稳定。
- `caption` 会渲染为原生 `caption`，用于给表格提供可读上下文。
- `summary` 适合展示总数、远程请求状态或批量操作摘要；未传入且启用 `selectable` 时，会自动显示当前选中数量。
- `width` 建议用于固定列或关键业务列；`fixed: 'left' | 'right'` 会根据列宽计算 sticky 偏移，有选择列时选择列会随左固定列一起固定。
- `resizable` 会在表头渲染列宽拖拽手柄；列定义支持 `minWidth`、`maxWidth` 和 `resizable: false` 控制单列边界。
- `columnWidths` / `defaultColumnWidths` 用于保存用户列宽偏好；与 `v-model:column-widths` 组合后，拖拽结果可直接写入本地存储或服务端配置。
- `expandable` 会显示展开列；`expandedRowKeys` / `defaultExpandedRowKeys` 支持受控和非受控展开状态，`#expand` 用于展示行详情。
- `maxHeight` 会限制表格滚动容器高度并让表头在容器内吸顶，适合长列表、弹窗表格和工作台卡片区域。
- `virtualized` 会启用固定高度虚拟滚动；`virtualHeight` 控制可视高度，`virtualRowHeight` 需要贴近真实行高，`virtualOverscan` 控制视口外缓冲行数。
- `filters` / `defaultFilters` 支持受控和非受控列筛选；列上的 `filterMethod` 可覆盖默认的等值匹配。
- 远程数据场景使用 `filterMode="manual"`，组件只维护筛选和排序状态并发出事件，由业务层请求服务端数据。
- 需要从工具栏重置状态时，可通过组件 ref 调用 `clearSort()` 和 `clearFilter(columnKeys?)`。
- `#empty` 适合放入 `YEmpty`、创建按钮或重试按钮；插槽会收到 loading、emptyText、loadingText 和 columns。
- Live example 的“键盘巡航”场景用于检查表格基础键盘链路：Tab 进入排序表头、筛选、行选择和摘要区域，Space 切换 checkbox，Enter 激活排序和按钮。

## API

<ComponentApiSection name="YTable" />

## Accessibility

- 表头排序使用原生 `button`，并在 `th` 上同步 `aria-sort`。
- 行选择和全选使用原生 checkbox，全选框支持 indeterminate 状态。
- 展开按钮使用原生 button，并同步 `aria-expanded` 与 `aria-controls` 关联详情行。
- 表格保留原生 `table`、`caption`、`thead`、`tbody`、`th scope="col"` 语义。
- `maxHeight` 只限制外层滚动容器，固定表头和固定列不会改变原生表格结构。
- 虚拟滚动会只渲染视口附近行；请提供稳定 `rowKey`，并用 caption / summary 描述完整数据范围。
- 表头筛选器使用原生 `details`、checkbox / radio 与 button，筛选计数通过可读标签表达。
- 加载状态会在外层同步 `aria-busy`，并通过 `role="status"` 向辅助技术宣告。
- 自定义空状态仍包裹在 `role="status"` 容器内；如果放入交互按钮，按钮本身应保持原生 button 语义。
- 键盘交互优先依赖原生控件能力：排序表头是 button，行选择是 checkbox，筛选动作是 details / button，不额外引入 roving tabindex。
