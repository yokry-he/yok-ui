<script setup lang="ts">
import { ref } from 'vue'
import type { YDataViewItem, YDataViewPreferencePayload, YDataViewSavePayload } from '@yok-ui/admin'

const activeView = ref('beta')
const latestPreference = ref('Waiting for preference change')
const latestSave = ref('Waiting for save')

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
  { id: 'data-table', name: 'Data Table', status: 'Beta', owner: 'Admin team', updated: '2026-06-16' },
  { id: 'theme', name: 'Theme Lab', status: 'Stable', owner: 'Design system', updated: '2026-06-15' },
  { id: 'review', name: 'Review Workflow', status: 'Beta', owner: 'Ops team', updated: '2026-06-14' }
]

const views: YDataViewItem[] = [
  {
    label: 'Beta review',
    value: 'beta',
    description: 'Components waiting for API and live example review.',
    count: 2,
    pinned: true,
    preference: {
      columnKeys: ['name', 'status', 'owner'],
      columnWidths: { name: 188, status: 132 },
      density: 'comfortable',
      filters: { status: ['Beta'] }
    }
  },
  {
    label: 'Stable core',
    value: 'stable',
    description: 'Stable components ready for package documentation.',
    count: 2,
    pinned: true,
    preference: {
      columnKeys: ['status', 'name', 'owner'],
      columnWidths: { status: 148, name: 212 },
      density: 'comfortable',
      filters: { status: ['Stable'] }
    }
  },
  {
    label: 'Mobile audit',
    value: 'mobile',
    description: 'Compact view for narrow review surfaces.',
    count: 2,
    preference: {
      columnKeys: ['name', 'status'],
      columnWidths: { name: 168 },
      density: 'compact',
      filters: {}
    }
  }
]

function handlePreferenceChange(payload: YDataViewPreferencePayload) {
  latestPreference.value = `${payload.reason}: ${payload.preference.density}`
}

function handleSave(payload: YDataViewSavePayload) {
  latestSave.value = `${payload.view?.label ?? 'Current view'} saved with ${payload.preference.columnKeys.length} columns`
}

const dataViewSetup = [
  "import { ref } from 'vue'",
  "import { YDataView, type YDataViewItem, type YDataViewPreferencePayload, type YDataViewSavePayload } from '@yok-ui/admin'",
  '',
  "const activeView = ref('beta')",
  "const latestPreference = ref('Waiting for preference change')",
  "const latestSave = ref('Waiting for save')",
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
  "  { id: 'data-table', name: 'Data Table', status: 'Beta', owner: 'Admin team', updated: '2026-06-16' },",
  "  { id: 'theme', name: 'Theme Lab', status: 'Stable', owner: 'Design system', updated: '2026-06-15' },",
  "  { id: 'review', name: 'Review Workflow', status: 'Beta', owner: 'Ops team', updated: '2026-06-14' }",
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
  "      columnKeys: ['name', 'status', 'owner'],",
  '      columnWidths: { name: 188, status: 132 },',
  "      density: 'comfortable',",
  "      filters: { status: ['Beta'] }",
  '    }',
  '  },',
  '  {',
  "    label: 'Stable core',",
  "    value: 'stable',",
  "    description: 'Stable components ready for package documentation.',",
  '    count: 2,',
  '    pinned: true,',
  '    preference: {',
  "      columnKeys: ['status', 'name', 'owner'],",
  '      columnWidths: { status: 148, name: 212 },',
  "      density: 'comfortable',",
  "      filters: { status: ['Stable'] }",
  '    }',
  '  },',
  '  {',
  "    label: 'Mobile audit',",
  "    value: 'mobile',",
  "    description: 'Compact view for narrow review surfaces.',",
  '    count: 2,',
  '    preference: {',
  "      columnKeys: ['name', 'status'],",
  '      columnWidths: { name: 168 },',
  "      density: 'compact',",
  '      filters: {}',
  '    }',
  '  }',
  ']',
  '',
  'function handlePreferenceChange(payload: YDataViewPreferencePayload) {',
  '  latestPreference.value = `${payload.reason}: ${payload.preference.density}`',
  '}',
  '',
  'function handleSave(payload: YDataViewSavePayload) {',
  "  latestSave.value = `${payload.view?.label ?? 'Current view'} saved with ${payload.preference.columnKeys.length} columns`",
  '}'
].join('\n')

const basicCode = [
  '<YDataView',
  '  v-model="activeView"',
  '  title="Component review workspace"',
  '  description="Switch saved views and persist table preferences in one admin surface."',
  '  saved-views-title="Saved table views"',
  '  saved-views-description="Reusable review scopes."',
  '  table-title="Component queue"',
  '  table-description="Rows, filters, density and column preferences share the active view."',
  '  :views="views"',
  '  :columns="columns"',
  '  :data="rows"',
  '  pagination',
  '  :page-size="3"',
  '  selectable',
  '  show-filter-summary',
  '  show-density-settings',
  '  show-column-settings',
  '  reorderable-columns',
  '  resizable',
  '  @view-preference-change="handlePreferenceChange"',
  '  @save="handleSave"',
  '/>',
  '<p class="demo-note">Current view: {{ activeView }} · {{ latestPreference }} · {{ latestSave }}</p>'
].join('\n')
</script>

# Data View

Data View 是后台列表页的组合组件。它把 `YSavedViews` 和 `YDataTable` 放进同一个布局里，让保存视图、列偏好、列宽、密度、筛选摘要和分页能围绕同一个当前视图同步。

它适合组件库官网、SaaS 管理台、审核队列、资源库等需要反复切换筛选方案的页面。业务层仍然负责接口请求和持久化，Data View 只负责稳定的 UI 结构和事件流。

::: tip TIP
`YDataView` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Saved table workspace {#data-view-saved-table-workspace}

<DocDemo
  title="Saved table workspace"
  description="Data View 将保存视图、表格偏好、筛选摘要和分页组织成一套可持久化的数据工作区。"
  :code="basicCode"
  :setup="dataViewSetup"
  :usage="['saved views', 'table preference', 'admin data workflow']"
>
  <YDataView
    v-model="activeView"
    title="Component review workspace"
    description="Switch saved views and persist table preferences in one admin surface."
    saved-views-title="Saved table views"
    saved-views-description="Reusable review scopes."
    table-title="Component queue"
    table-description="Rows, filters, density and column preferences share the active view."
    :views="views"
    :columns="columns"
    :data="rows"
    pagination
    :page-size="3"
    selectable
    show-filter-summary
    show-density-settings
    show-column-settings
    reorderable-columns
    resizable
    @view-preference-change="handlePreferenceChange"
    @save="handleSave"
  />
  <p class="demo-note">Current view: {{ activeView }} · {{ latestPreference }} · {{ latestSave }}</p>
</DocDemo>

## Data View API {#data-view-api}

<ComponentApiSection name="YDataView" />

## Accessibility {#accessibility}

- 外层使用具名 `section`，左侧保存视图和右侧数据表都有独立可访问名称。
- 保存视图继承 `YSavedViews` 的原生 button 语义，当前视图通过 `aria-pressed` 表达。
- 表格区域继承 `YDataTable` 的 caption、summary、排序、筛选、分页和选择语义。
- 列设置、密度切换、筛选摘要和保存动作都使用原生可聚焦控件。
- 窄屏下布局会收敛为单列，避免桌面侧栏直接挤压首屏表格内容。
