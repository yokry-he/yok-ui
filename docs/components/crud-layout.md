<script setup lang="ts">
import { ref } from 'vue'
import type { YFilterTabItem } from '@yok-ui/admin'

const activeStatus = ref('all')

const statusTabs: YFilterTabItem[] = [
  { label: 'All', value: 'all', count: 42 },
  { label: 'Stable', value: 'stable', count: 24, tone: 'success' },
  { label: 'Beta', value: 'beta', count: 13, tone: 'warning' },
  { label: 'Review', value: 'review', count: 5, tone: 'danger' }
]

const columns = [
  { key: 'name', label: 'Component', sortable: true },
  { key: 'package', label: 'Package' },
  { key: 'status', label: 'Status', sortable: true }
]

const rows = [
  { id: 'button', name: 'YButton', package: 'Core', status: 'Stable' },
  { id: 'form', name: 'YForm', package: 'Core', status: 'Beta' },
  { id: 'crud-layout', name: 'YCrudLayout', package: 'Admin', status: 'Beta' }
]

const crudLayoutSetup = [
  "import { ref } from 'vue'",
  "import { YButton, YTag } from '@yok-ui/core'",
  "import { YCrudLayout, YDataTable, YFilterTabs, type YFilterTabItem } from '@yok-ui/admin'",
  '',
  "const activeStatus = ref('all')",
  '',
  'const statusTabs: YFilterTabItem[] = [',
  "  { label: 'All', value: 'all', count: 42 },",
  "  { label: 'Stable', value: 'stable', count: 24, tone: 'success' },",
  "  { label: 'Beta', value: 'beta', count: 13, tone: 'warning' },",
  "  { label: 'Review', value: 'review', count: 5, tone: 'danger' }",
  ']',
  '',
  'const columns = [',
  "  { key: 'name', label: 'Component', sortable: true },",
  "  { key: 'package', label: 'Package' },",
  "  { key: 'status', label: 'Status', sortable: true }",
  ']',
  '',
  'const rows = [',
  "  { id: 'button', name: 'YButton', package: 'Core', status: 'Stable' },",
  "  { id: 'form', name: 'YForm', package: 'Core', status: 'Beta' },",
  "  { id: 'crud-layout', name: 'YCrudLayout', package: 'Admin', status: 'Beta' }",
  ']'
].join('\n')

const basicCode = [
  '<YCrudLayout',
  '  title="Component inventory"',
  '  eyebrow="Admin"',
  '  status="CRUD ready"',
  '  description="Review package coverage, filter by lifecycle status, and prepare release work."',
  '  aria-label="Component inventory management"',
  '>',
  '  <template #actions>',
  '    <YButton variant="secondary">Export</YButton>',
  '    <YButton variant="primary">Create</YButton>',
  '  </template>',
  '  <template #filters>',
  '    <YFilterTabs v-model="activeStatus" aria-label="Component lifecycle filters" :items="statusTabs" />',
  '  </template>',
  '  <template #toolbar>',
  '    <YButton variant="ghost">Save view</YButton>',
  '  </template>',
  '  <template #table>',
  '    <YDataTable',
  '      title="Release queue"',
  '      description="A composed CRUD page pattern for admin screens."',
  '      :columns="columns"',
  '      :data="rows"',
  '      selectable',
  '      striped',
  '    >',
  '      <template #cell-status="{ value }">',
  '        <YTag :tone="value === \'Stable\' ? \'success\' : \'warning\'">{{ value }}</YTag>',
  '      </template>',
  '    </YDataTable>',
  '  </template>',
  '  <template #aside>',
  '    <strong>Saved view</strong>',
  '    <p class="demo-note">Status: {{ activeStatus }}. Use this area for summaries, saved filters, or review notes.</p>',
  '  </template>',
  '</YCrudLayout>'
].join('\n')
</script>

# CRUD Layout

CRUD Layout 是 Admin 包的资源管理页骨架。它参考主流组件库的 Pro Layout / PageContainer / List Page 思路，把标题、筛选、状态切换、工具按钮、列表、侧栏和页脚组织成稳定的后台页面结构。

它不会替代 `YSearchPanel`、`YFilterTabs` 或 `YDataTable`，而是负责把这些组件放到对的位置，让业务页少写布局样板代码。

## Example

<DocDemo
  title="Composed admin page"
  description="CRUD Layout 负责页面骨架，筛选、表格和侧栏内容仍由专门组件承载。"
  :code="basicCode"
  :setup="crudLayoutSetup"
  :usage="['admin package', 'layout slots', 'composed table page']"
>
  <YCrudLayout
    title="Component inventory"
    eyebrow="Admin"
    status="CRUD ready"
    description="Review package coverage, filter by lifecycle status, and prepare release work."
    aria-label="Component inventory management"
  >
    <template #actions>
      <YButton variant="secondary">Export</YButton>
      <YButton variant="primary">Create</YButton>
    </template>
    <template #filters>
      <YFilterTabs v-model="activeStatus" aria-label="Component lifecycle filters" :items="statusTabs" />
    </template>
    <template #toolbar>
      <YButton variant="ghost">Save view</YButton>
    </template>
    <template #table>
      <YDataTable
        title="Release queue"
        description="A composed CRUD page pattern for admin screens."
        :columns="columns"
        :data="rows"
        selectable
        striped
      >
        <template #cell-status="{ value }">
          <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
        </template>
      </YDataTable>
    </template>
    <template #aside>
      <strong>Saved view</strong>
      <p class="demo-note">Status: {{ activeStatus }}. Use this area for summaries, saved filters, or review notes.</p>
    </template>
  </YCrudLayout>
</DocDemo>

## Live example

<LiveExampleRunner preset="crudLayout" />

## API

<ComponentApiSection name="YCrudLayout" />

## Accessibility

- 外层是具名 `section`，默认使用 `title` 作为可访问名称。
- 主列表区域不强行声明页面级 landmark，避免嵌入已有 AppShell 或文档页时产生重复 `main`。
- 标题结构复用 `YPageHeader`，筛选、表格和分页语义由插入的组件继承。
- 侧栏使用 `aside`，适合放上下文信息、保存视图或审核说明。
