<script setup lang="ts">
import { ref } from 'vue'
import type { YDataViewItem, YResourcePageSearchPayload, YSearchFormField } from '@yok-ui/admin'

const searchModel = ref({ keyword: 'data', status: 'Beta' })
const activeView = ref('beta')
const detailOpen = ref(false)
const lastEvent = ref('Waiting for search or view event')

const searchFields: YSearchFormField[] = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Stable', value: 'Stable' },
      { label: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner', placeholder: 'Core team' }
]

const columns = [
  {
    key: 'name',
    label: 'Component',
    sortable: true,
    filters: [
      { text: 'Button', value: 'Button' },
      { text: 'Table', value: 'Table' }
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
  { key: 'owner', label: 'Owner' },
  { key: 'updated', label: 'Updated' }
]

const rows = [
  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core team', updated: '2026-06-13' },
  { id: 'data-view', name: 'Data View', status: 'Beta', owner: 'Admin team', updated: '2026-06-18' },
  { id: 'resource-page', name: 'Resource Page', status: 'Beta', owner: 'Admin team', updated: '2026-06-26' },
  { id: 'table', name: 'Table', status: 'Stable', owner: 'Core team', updated: '2026-06-15' }
]

const views: YDataViewItem[] = [
  {
    label: 'Beta review',
    value: 'beta',
    description: 'Components waiting for API and live example review.',
    count: 2,
    pinned: true,
    preference: {
      columnKeys: ['status', 'name', 'owner'],
      columnWidths: { status: 128, name: 200 },
      density: 'compact',
      filters: { status: ['Beta'] }
    }
  },
  {
    label: 'Stable core',
    value: 'stable',
    description: 'Stable components ready for release notes.',
    count: 2,
    preference: {
      columnKeys: ['name', 'status', 'owner'],
      columnWidths: {},
      density: 'comfortable',
      filters: { status: ['Stable'] }
    }
  }
]

function handleSearch(payload: YResourcePageSearchPayload) {
  lastEvent.value = `Search: ${payload.activeFieldKeys.join(', ') || 'no filters'}`
}

const resourcePageSetup = [
  "import { ref } from 'vue'",
  "import { YButton } from '@yok-ui/core'",
  "import { YResourcePage, type YDataViewItem, type YResourcePageSearchPayload, type YSearchFormField } from '@yok-ui/admin'",
  '',
  "const searchModel = ref({ keyword: 'data', status: 'Beta' })",
  "const activeView = ref('beta')",
  'const detailOpen = ref(false)',
  "const lastEvent = ref('Waiting for search or view event')",
  '',
  'const searchFields: YSearchFormField[] = [',
  "  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },",
  '  {',
  "    key: 'status',",
  "    label: 'Status',",
  "    type: 'select',",
  '    options: [',
  "      { label: 'Stable', value: 'Stable' },",
  "      { label: 'Beta', value: 'Beta' }",
  '    ]',
  '  },',
  "  { key: 'owner', label: 'Owner', placeholder: 'Core team' }",
  ']',
  '',
  'const columns = [',
  '  {',
  "    key: 'name',",
  "    label: 'Component',",
  '    sortable: true,',
  '    filters: [',
  "      { text: 'Button', value: 'Button' },",
  "      { text: 'Table', value: 'Table' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'status',",
  "    label: 'Status',",
  '    filters: [',
  "      { text: 'Stable', value: 'Stable' },",
  "      { text: 'Beta', value: 'Beta' }",
  '    ]',
  '  },',
  "  { key: 'owner', label: 'Owner' },",
  "  { key: 'updated', label: 'Updated' }",
  ']',
  '',
  'const rows = [',
  "  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core team', updated: '2026-06-13' },",
  "  { id: 'data-view', name: 'Data View', status: 'Beta', owner: 'Admin team', updated: '2026-06-18' },",
  "  { id: 'resource-page', name: 'Resource Page', status: 'Beta', owner: 'Admin team', updated: '2026-06-26' },",
  "  { id: 'table', name: 'Table', status: 'Stable', owner: 'Core team', updated: '2026-06-15' }",
  ']',
  '',
  'const views: YDataViewItem[] = [',
  '  {',
  "    label: 'Beta review',",
  "    value: 'beta',",
  "    description: 'Components waiting for API and live example review.',",
  '    count: 2,',
  '    pinned: true,',
  '    preference: {',
  "      columnKeys: ['status', 'name', 'owner'],",
  '      columnWidths: { status: 128, name: 200 },',
  "      density: 'compact',",
  "      filters: { status: ['Beta'] }",
  '    }',
  '  },',
  '  {',
  "    label: 'Stable core',",
  "    value: 'stable',",
  "    description: 'Stable components ready for release notes.',",
  '    count: 2,',
  '    preference: {',
  "      columnKeys: ['name', 'status', 'owner'],",
  '      columnWidths: {},',
  "      density: 'comfortable',",
  "      filters: { status: ['Stable'] }",
  '    }',
  '  }',
  ']',
  '',
  'function handleSearch(payload: YResourcePageSearchPayload) {',
  "  lastEvent.value = `Search: ${payload.activeFieldKeys.join(', ') || 'no filters'}`",
  '}'
].join('\n')

const basicCode = [
  '<YResourcePage',
  '  v-model:search-model="searchModel"',
  '  v-model:view-value="activeView"',
  '  title="Component resources"',
  '  description="Search, review and maintain component records."',
  '  eyebrow="Admin"',
  '  status="Live"',
  '  search-title="Resource filters"',
  '  search-description="Use repeated filters without rebuilding page layout."',
  '  saved-views-title="Saved table views"',
  '  table-title="Component queue"',
  '  :search-fields="searchFields"',
  '  :views="views"',
  '  :columns="columns"',
  '  :data="rows"',
  '  pagination',
  '  :page-size="3"',
  '  selectable',
  '  show-filter-summary',
  '  show-density-settings',
  '  show-column-settings',
  '  detail-title="Component detail"',
  '  detail-description="Review selected component metadata."',
  '  :detail-open="detailOpen"',
  '  @search="handleSearch"',
  '  @view-change="lastEvent = `View: ${$event.label}`"',
  '  @close-detail="detailOpen = false"',
  '>',
  '  <template #actions>',
  '    <YButton variant="primary" @click="detailOpen = true">Open detail</YButton>',
  '  </template>',
  '  <template #toolbar>',
  '    <YButton variant="secondary">Export CSV</YButton>',
  '  </template>',
  '  <template #aside>',
  '    <section aria-label="Release summary">Release summary: {{ rows.length }} resources tracked.</section>',
  '  </template>',
  '  <template #detail>',
  '    <p>Resource Page keeps the table state visible while detail content opens in a drawer.</p>',
  '  </template>',
  '  <template #detailFooter>',
  '    <YButton variant="primary" @click="detailOpen = false">Approve</YButton>',
  '  </template>',
  '</YResourcePage>',
  '<p class="demo-note">{{ lastEvent }}</p>'
].join('\n')
</script>

# Resource Page

Resource Page 是 Admin 包里的页面级组合组件。它把 `YCrudLayout`、`YSearchForm`、`YDataView` 和 `YDrawer` 串成一套资源管理页：标题区、搜索区、保存视图、数据表、右侧摘要和详情抽屉都有稳定位置。

它的目标不是替代业务层，而是把主流后台组件库里反复出现的资源列表工作流固定下来：搜索、筛选、保存视图、批量选择、详情查看和远程请求事件都从一个页面组件向外透出。

::: tip TIP
`YResourcePage` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Resource management page {#resource-page-resource-management-page}

<DocDemo
  title="Resource management page"
  description="Resource Page 把搜索、保存视图、数据表、侧栏摘要和详情抽屉组合成完整后台资源页。"
  :code="basicCode"
  :setup="resourcePageSetup"
  :usage="['resource workflow', 'search and saved views', 'drawer detail']"
>
  <YResourcePage
    v-model:search-model="searchModel"
    v-model:view-value="activeView"
    title="Component resources"
    description="Search, review and maintain component records."
    eyebrow="Admin"
    status="Live"
    search-title="Resource filters"
    search-description="Use repeated filters without rebuilding page layout."
    saved-views-title="Saved table views"
    table-title="Component queue"
    :search-fields="searchFields"
    :views="views"
    :columns="columns"
    :data="rows"
    pagination
    :page-size="3"
    selectable
    show-filter-summary
    show-density-settings
    show-column-settings
    detail-title="Component detail"
    detail-description="Review selected component metadata."
    :detail-open="detailOpen"
    @search="handleSearch"
    @view-change="lastEvent = `View: ${$event.label}`"
    @close-detail="detailOpen = false"
  >
    <template #actions>
      <YButton variant="primary" @click="detailOpen = true">Open detail</YButton>
    </template>
    <template #toolbar>
      <YButton variant="secondary">Export CSV</YButton>
    </template>
    <template #aside>
      <section aria-label="Release summary">Release summary: {{ rows.length }} resources tracked.</section>
    </template>
    <template #detail>
      <p>Resource Page keeps the table state visible while detail content opens in a drawer.</p>
    </template>
    <template #detailFooter>
      <YButton variant="primary" @click="detailOpen = false">Approve</YButton>
    </template>
  </YResourcePage>
  <p class="demo-note">{{ lastEvent }}</p>
</DocDemo>

## Resource Page API {#resource-page-api}

<ComponentApiSection name="YResourcePage" />

## Accessibility {#accessibility}

- 页面外层继承 `YCrudLayout` 的具名 `section`，标题层级可通过 `headingLevel` 调整。
- 搜索表单使用原生 `form` 提交，重置和展开动作都是键盘可达按钮。
- 保存视图、表格筛选、分页、行选择和批量操作继承 `YDataView` 与 `YDataTable` 的语义。
- 详情区使用 `YDrawer` 的 dialog 语义，关闭按钮、Esc 和遮罩关闭都会透出 `closeDetail`。
- 移动端保持单列资源流，避免把桌面侧栏直接堆到首屏核心内容上方。
