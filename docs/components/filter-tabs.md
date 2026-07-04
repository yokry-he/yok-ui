<script setup lang="ts">
import { ref } from 'vue'
import type { YFilterTabItem } from '@yok-ui/admin'

const active = ref('all')
const requestState = ref('Filter: all')

const statusTabs: YFilterTabItem[] = [
  { label: 'All', value: 'all', count: 48 },
  { label: 'Stable', value: 'stable', count: 27, tone: 'success' },
  { label: 'Beta', value: 'beta', count: 16, tone: 'warning' },
  { label: 'Blocked', value: 'blocked', count: 5, tone: 'danger' },
  { label: 'Archived', value: 'archived', count: 0, disabled: true }
]

const tableColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' }
]

const tableRows = [
  { id: 'button', name: 'YButton', status: 'Stable' },
  { id: 'form', name: 'YForm', status: 'Beta' },
  { id: 'filter-tabs', name: 'YFilterTabs', status: 'Beta' }
]

function handleChange(item: { label: string; value: string }) {
  requestState.value = `Filter: ${item.value}`
}

const filterTabsSetup = [
  "import { ref } from 'vue'",
  "import { YDataTable, YFilterTabs, type YFilterTabItem } from '@yok-ui/admin'",
  '',
  "const active = ref('all')",
  "const requestState = ref('Filter: all')",
  '',
  'const statusTabs: YFilterTabItem[] = [',
  "  { label: 'All', value: 'all', count: 48 },",
  "  { label: 'Stable', value: 'stable', count: 27, tone: 'success' },",
  "  { label: 'Beta', value: 'beta', count: 16, tone: 'warning' },",
  "  { label: 'Blocked', value: 'blocked', count: 5, tone: 'danger' },",
  "  { label: 'Archived', value: 'archived', count: 0, disabled: true }",
  ']',
  '',
  'const tableColumns = [',
  "  { key: 'name', label: 'Name', sortable: true },",
  "  { key: 'status', label: 'Status' }",
  ']',
  '',
  'const tableRows = [',
  "  { id: 'button', name: 'YButton', status: 'Stable' },",
  "  { id: 'form', name: 'YForm', status: 'Beta' },",
  "  { id: 'filter-tabs', name: 'YFilterTabs', status: 'Beta' }",
  ']',
  '',
  'function handleChange(item: { label: string; value: string }) {',
  '  requestState.value = `Filter: ${item.value}`',
  '}'
].join('\n')

const basicCode = [
  '<div class="demo-stack">',
  '  <YFilterTabs',
  '    v-model="active"',
  '    aria-label="Component status filters"',
  '    :items="statusTabs"',
  '    @change="handleChange"',
  '  />',
  '  <YDataTable',
  '    title="Component queue"',
  '    description="Filter first, then scan the table."',
  '    :columns="tableColumns"',
  '    :data="tableRows"',
  '    striped',
  '  />',
  '  <p class="demo-note">{{ requestState }}</p>',
  '</div>'
].join('\n')
</script>

# Filter Tabs

Filter Tabs 是 Admin 包的状态筛选组件，适合放在资源列表、审核队列、订单管理和组件库存页顶部。它参考主流后台组件库里的 segmented tabs / status tabs 模式，但保持 Yok UI 的清爽可爱气质：轻量、柔和、带清晰数量反馈。

## Example

<DocDemo
  title="Status filters"
  description="状态筛选项和数据表配合使用，先限定范围，再扫描列表。"
  :code="basicCode"
  :setup="filterTabsSetup"
  :usage="['tablist semantics', 'status count', 'data table filter']"
>
  <div class="demo-stack">
    <YFilterTabs
      v-model="active"
      aria-label="Component status filters"
      :items="statusTabs"
      @change="handleChange"
    />
    <YDataTable
      title="Component queue"
      description="Filter first, then scan the table."
      :columns="tableColumns"
      :data="tableRows"
      striped
    />
    <p class="demo-note">{{ requestState }}</p>
  </div>
</DocDemo>

## Live example

<LiveExampleRunner preset="filterTabs" />

## API

<ComponentApiSection name="YFilterTabs" />

## Accessibility

- 外层使用 `role="tablist"`，每个筛选项使用 `role="tab"`。
- 当前项同步 `aria-selected`，禁用项使用原生 `disabled`。
- 支持 Left / Right / Up / Down、Home 和 End 在可用项之间切换。
- `aria-label` 用于描述这组筛选项的业务含义。
