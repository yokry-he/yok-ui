<script setup lang="ts">
import { ref } from 'vue'
import type {
  YBulkActionItem,
  YFilterTabItem,
  YReviewWorkflowStep,
  YSavedViewItem,
  YSearchFormField,
} from '@yok-ui/admin'

const activeFilter = ref('all')
const activeView = ref('release')
const selectedRows = ref(['table'])
const query = ref({ keyword: 'table', status: 'beta' })

const adminFilters: YFilterTabItem[] = [
  { label: 'All', value: 'all', count: 33 },
  { label: 'Stable', value: 'stable', count: 18, tone: 'success' },
  { label: 'Beta', value: 'beta', count: 11, tone: 'warning' },
  { label: 'Needs review', value: 'review', count: 4, tone: 'danger' }
]

const searchFields: YSearchFormField[] = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search components' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Any status',
    options: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' }
    ]
  },
  { key: 'owner', label: 'Owner', placeholder: 'Design system' },
  { key: 'release', label: 'Release', placeholder: '0.2.0' }
]

const releaseSteps: YReviewWorkflowStep[] = [
  { title: 'Created', value: 'created', status: 'Done', tone: 'success', time: '09:12', actor: 'Yok' },
  { title: 'Reviewing', value: 'reviewing', status: 'Active', tone: 'warning', time: '10:30', actor: 'Design system' },
  { title: 'Release', value: 'release', status: 'Pending', disabled: true, time: 'Next' }
]

const savedViews: YSavedViewItem[] = [
  { label: 'Release queue', value: 'release', description: 'Ready for review', count: 8, pinned: true },
  { label: 'Stable core', value: 'stable', description: 'Stable components', count: 18 }
]

const bulkActions: YBulkActionItem[] = [
  { label: 'Archive', value: 'archive', tone: 'info' },
  { label: 'Publish', value: 'publish', tone: 'success' },
  { label: 'Delete', value: 'delete', tone: 'danger' }
]

const adminPreviewSetup = [
  "import { ref } from 'vue'",
  "import { YButton } from '@yok-ui/core'",
  "import { YBulkActionBar, YCrudLayout, YDataTable, YFilterTabs, YMetricCard, YReviewWorkflow, YSavedViews, YSearchForm, type YBulkActionItem, type YFilterTabItem, type YReviewWorkflowStep, type YSavedViewItem, type YSearchFormField } from '@yok-ui/admin'",
  '',
  "const activeFilter = ref('all')",
  "const activeView = ref('release')",
  "const selectedRows = ref(['table'])",
  "const query = ref({ keyword: 'table', status: 'beta' })",
  '',
  'const adminFilters: YFilterTabItem[] = [',
  "  { label: 'All', value: 'all', count: 33 },",
  "  { label: 'Stable', value: 'stable', count: 18, tone: 'success' },",
  "  { label: 'Beta', value: 'beta', count: 11, tone: 'warning' },",
  "  { label: 'Needs review', value: 'review', count: 4, tone: 'danger' }",
  ']',
  '',
  'const searchFields: YSearchFormField[] = [',
  "  { key: 'keyword', label: 'Keyword', placeholder: 'Search components' },",
  "  { key: 'status', label: 'Status', type: 'select', placeholder: 'Any status', options: [{ label: 'Stable', value: 'stable' }, { label: 'Beta', value: 'beta' }] },",
  "  { key: 'owner', label: 'Owner', placeholder: 'Design system' },",
  "  { key: 'release', label: 'Release', placeholder: '0.2.0' }",
  ']',
  '',
  'const releaseSteps: YReviewWorkflowStep[] = [',
  "  { title: 'Created', value: 'created', status: 'Done', tone: 'success', time: '09:12', actor: 'Yok' },",
  "  { title: 'Reviewing', value: 'reviewing', status: 'Active', tone: 'warning', time: '10:30', actor: 'Design system' },",
  "  { title: 'Release', value: 'release', status: 'Pending', disabled: true, time: 'Next' }",
  ']',
  '',
  'const savedViews: YSavedViewItem[] = [',
  "  { label: 'Release queue', value: 'release', description: 'Ready for review', count: 8, pinned: true },",
  "  { label: 'Stable core', value: 'stable', description: 'Stable components', count: 18 }",
  ']',
  '',
  'const bulkActions: YBulkActionItem[] = [',
  "  { label: 'Archive', value: 'archive', tone: 'info' },",
  "  { label: 'Publish', value: 'publish', tone: 'success' },",
  "  { label: 'Delete', value: 'delete', tone: 'danger' }",
  ']',
  '',
  'const tableColumns = [',
  "  { key: 'name', label: 'Name', sortable: true },",
  "  { key: 'status', label: 'Status' }",
  ']',
  '',
  'const tableData = [',
  "  { id: 'table', name: 'YTable', status: 'Stable' },",
  "  { id: 'data-table', name: 'YDataTable', status: 'Beta' }",
  ']'
].join('\n')

const adminPreviewCode = [
  '<div class="admin-preview-stack">',
  '  <div class="docs-demo-grid">',
  '    <YMetricCard label="Components" value="33" trend="+4" description="Admin package started." />',
  '    <YMetricCard label="Packages" value="7" trend="multi" tone="info" description="Core, Product, Admin, Brand, Hooks, Icons, Themes." />',
  '  </div>',
  '  <YCrudLayout',
  '    title="Component inventory"',
  '    eyebrow="Admin"',
  '    status="Phase 2 ready"',
  '    description="Scan component coverage, filter by status, and manage release work."',
  '  >',
  '    <template #actions>',
  '      <YButton variant="secondary">Export</YButton>',
  '      <YButton variant="primary">Create</YButton>',
  '    </template>',
  '    <template #search>',
  '      <YSearchForm v-model="query" density="compact" :fields="searchFields" :collapsed-count="2" />',
  '    </template>',
  '    <template #filters>',
  '      <YFilterTabs v-model="activeFilter" aria-label="Admin component status" :items="adminFilters" />',
  '    </template>',
  '    <template #table>',
  '      <YDataTable',
  '        v-model:selected-row-keys="selectedRows"',
  '        title="Release queue"',
  '        description="A compact admin list pattern built from Core table and pagination primitives."',
  '        :columns="tableColumns"',
  '        :data="tableData"',
  '        selectable',
  '      >',
  '        <template #bulkActions="{ selectedRowKeys }">',
  '          <YBulkActionBar',
  '            :selected-row-keys="selectedRowKeys"',
  '            :actions="bulkActions"',
  '            clear-text="Reset"',
  '            @clear="selectedRows = []"',
  '          />',
  '        </template>',
  '      </YDataTable>',
  '    </template>',
  '    <template #aside>',
  '      <YSavedViews v-model="activeView" title="Saved views" aria-label="Admin saved views" :items="savedViews" />',
  '      <YReviewWorkflow title="Release review" active-value="reviewing" reviewer="Yok" due-text="Today" :items="releaseSteps" />',
  '    </template>',
  '  </YCrudLayout>',
  '</div>'
].join('\n')
</script>

# @yok-ui/admin

Admin 包服务后台管理、资源列表、数据概览和配置页。它复用 `@yok-ui/core` 的基础组件，提供更贴近业务页面的组合组件。

## Install

```bash
pnpm add @yok-ui/admin @yok-ui/core @yok-ui/themes
```

## Import

完整引入：

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import YokAdmin from '@yok-ui/admin'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/admin/style.css'
import App from './App.vue'

createApp(App).use(YokCore).use(YokAdmin).mount('#app')
```

按需导入：

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/admin/style.css'
import { YBulkActionBar, YPageHeader, YMetricCard, YReviewWorkflow, YSearchForm, YSearchPanel, YCrudLayout, YFilterTabs, YDataTable, YSavedViews, YStatusTimeline } from '@yok-ui/admin'
```

## Components

<PackageComponents package-name="@yok-ui/admin" />

## Preview

<DocDemo
  title="Admin inventory workflow"
  description="组合指标卡、搜索表单、筛选标签、数据表、批量操作、保存视图和审核流程，形成完整后台资源列表页。"
  :code="adminPreviewCode"
  :setup="adminPreviewSetup"
  :usage="['admin page', 'crud workflow', 'bulk actions']"
>
  <div class="admin-preview-stack">
    <div class="docs-demo-grid">
      <YMetricCard label="Components" value="33" trend="+4" description="Admin package started." />
      <YMetricCard label="Packages" value="7" trend="multi" tone="info" description="Core, Product, Admin, Brand, Hooks, Icons, Themes." />
    </div>
    <YCrudLayout
      title="Component inventory"
      eyebrow="Admin"
      status="Phase 2 ready"
      description="Scan component coverage, filter by status, and manage release work."
    >
      <template #actions>
        <YButton variant="secondary">Export</YButton>
        <YButton variant="primary">Create</YButton>
      </template>
      <template #search>
        <YSearchForm
          v-model="query"
          density="compact"
          :fields="searchFields"
          :collapsed-count="2"
        />
      </template>
      <template #filters>
        <YFilterTabs v-model="activeFilter" aria-label="Admin component status" :items="adminFilters" />
      </template>
      <template #table>
        <YDataTable
          v-model:selected-row-keys="selectedRows"
          title="Release queue"
          description="A compact admin list pattern built from Core table and pagination primitives."
          :columns="[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'status', label: 'Status' }
          ]"
          :data="[
            { id: 'table', name: 'YTable', status: 'Stable' },
            { id: 'data-table', name: 'YDataTable', status: 'Beta' }
          ]"
          selectable
        >
          <template #bulkActions="{ selectedRowKeys }">
            <YBulkActionBar
              :selected-row-keys="selectedRowKeys"
              :actions="bulkActions"
              clear-text="Reset"
              @clear="selectedRows = []"
            />
          </template>
        </YDataTable>
      </template>
      <template #aside>
        <YSavedViews
          v-model="activeView"
          title="Saved views"
          aria-label="Admin saved views"
          :items="savedViews"
        />
        <YReviewWorkflow
          title="Release review"
          active-value="reviewing"
          reviewer="Yok"
          due-text="Today"
          :items="releaseSteps"
        />
      </template>
    </YCrudLayout>
  </div>
</DocDemo>

<style scoped>
.admin-preview-stack {
  display: grid;
  gap: 16px;
}
</style>
