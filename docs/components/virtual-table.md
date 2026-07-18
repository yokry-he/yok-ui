<script setup lang="ts">
import { ref } from 'vue'
import type { YTableSortPayload } from '@yok-ui/core'

const columns = [
  { key: 'name', label: 'Component', width: 180, sortable: true },
  {
    key: 'status',
    label: 'Status',
    width: 132,
    filters: [
      { text: 'Stable', value: 'Stable' },
      { text: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner', width: 160 },
  { key: 'updated', label: 'Updated', width: 144 },
  { key: 'score', label: 'Score', width: 96, align: 'right' as const, sortable: true }
]

const rows = Array.from({ length: 1000 }, (_, index) => ({
  id: `component-${index + 1}`,
  name: `Component ${index + 1}`,
  status: index % 4 === 0 ? 'Beta' : 'Stable',
  owner: index % 3 === 0 ? 'Admin team' : index % 3 === 1 ? 'Core team' : 'Docs team',
  updated: `2026-07-${String((index % 28) + 1).padStart(2, '0')}`,
  score: 72 + (index % 28)
}))

const tableState = ref('1000 rows · virtual viewport')

function handleSort(payload: YTableSortPayload) {
  tableState.value = payload.order
    ? `Sorted by ${payload.key} ${payload.order}`
    : 'Sort cleared'
}

const setupCode = [
  "import { ref } from 'vue'",
  "import { YTag, YVirtualTable, type YTableSortPayload } from '@yok-ui/core'",
  '',
  `const columns = ${JSON.stringify(columns, null, 2)}`,
  '',
  'const rows = Array.from({ length: 1000 }, (_, index) => ({',
  '  id: `component-${index + 1}`,',
  '  name: `Component ${index + 1}`,',
  "  status: index % 4 === 0 ? 'Beta' : 'Stable',",
  "  owner: index % 3 === 0 ? 'Admin team' : index % 3 === 1 ? 'Core team' : 'Docs team',",
  "  updated: `2026-07-${String((index % 28) + 1).padStart(2, '0')}`,",
  '  score: 72 + (index % 28)',
  '}))',
  '',
  "const tableState = ref('1000 rows · virtual viewport')",
  '',
  'function handleSort(payload: YTableSortPayload) {',
  '  tableState.value = payload.order',
  '    ? `Sorted by ${payload.key} ${payload.order}`',
  "    : 'Sort cleared'",
  '}'
].join('\n')

const basicCode = [
  '<YVirtualTable',
  '  :columns="columns"',
  '  :data="rows"',
  '  :height="320"',
  '  :row-height="48"',
  '  :overscan="6"',
  '  caption="Component readiness matrix"',
  '  :summary="tableState"',
  '  striped',
  '  @sort-change="handleSort"',
  '>',
  '  <template #cell-status="{ value }">',
  "    <YTag :tone=\"value === 'Stable' ? 'success' : 'warning'\">{{ value }}</YTag>",
  '  </template>',
  '</YVirtualTable>'
].join('\n')
</script>

# Virtual Table

Virtual Table 是面向大数据量表格的 Core 组件入口。它复用 `YTable` 的列、排序、筛选、选择和列宽能力，但默认开启固定行高虚拟滚动，适合组件审查队列、日志矩阵、权限明细和资源清单。

Element Plus 将 Virtualized Table 作为独立数据组件；Yok UI 也提供独立 `YVirtualTable`，让用户不必记住 `YTable virtualized` 的组合参数。

::: tip TIP
`YVirtualTable` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Large component matrix {#virtual-table-large-component-matrix}

<DocDemo
  title="Large component matrix"
  description="1000 行数据只渲染当前视口附近的行，同时保留表头、排序、筛选、状态标签和底部摘要。"
  :code="basicCode"
  :setup="setupCode"
  :usage="['1000 rows', 'fixed row height', 'sortable columns']"
>
  <YVirtualTable
    :columns="columns"
    :data="rows"
    :height="320"
    :row-height="48"
    :overscan="6"
    caption="Component readiness matrix"
    :summary="tableState"
    striped
    @sort-change="handleSort"
  >
    <template #cell-status="{ value }">
      <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
    </template>
  </YVirtualTable>
</DocDemo>

## Virtual Table API {#virtual-table-api}

<ComponentApiSection name="YVirtualTable" />

## Accessibility {#accessibility}

- 表格仍使用原生 `table`、`thead`、`tbody`、`th` 和 `td` 语义，虚拟滚动只减少 DOM 行数。
- 长数据集需要提供 `caption` 或上方标题，说明当前数据范围和用途。
- 固定行高是虚拟表格的前提；需要展开详情或可变高度内容时，应使用 `YTable` 或 `YDataTable`。
