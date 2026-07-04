<script setup lang="ts">
import { ref } from 'vue'
import type { YSearchFormField, YSearchFormSubmitPayload, YSearchFormValue } from '@yok-ui/admin'

const searchValues = ref<Record<string, YSearchFormValue>>({
  keyword: 'table',
  status: 'stable',
  releaseDate: '2026-07-01',
  releaseWindow: ['2026-07-01', '2026-07-07']
})
const compactValues = ref<Record<string, YSearchFormValue>>({})
const message = ref('Waiting for search')

async function loadOwnerOptions() {
  return [
    { label: 'Core team', value: 'core' },
    { label: 'Admin team', value: 'admin' },
    { label: 'Design system', value: 'design' }
  ]
}

const fields: YSearchFormField[] = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Any status',
    options: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' },
      { label: 'Needs review', value: 'review' }
    ]
  },
  {
    key: 'package',
    label: 'Package',
    type: 'select',
    placeholder: 'Any package',
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Product', value: 'product' },
      { label: 'Admin', value: 'admin' },
      { label: 'Brand', value: 'brand' }
    ]
  },
  {
    key: 'releaseDate',
    label: 'Release date',
    type: 'date',
    shortcuts: [
      { label: 'Today', value: '2026-06-13' },
      { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }
    ]
  },
  {
    key: 'releaseWindow',
    label: 'Release window',
    type: 'dateRange',
    shortcuts: [
      { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00' }
    ]
  },
  { key: 'owner', label: 'Owner', type: 'select', options: loadOwnerOptions }
]

function handleSearch(payload: YSearchFormSubmitPayload) {
  message.value = `Search fields: ${payload.activeFieldKeys.join(', ') || 'none'}`
}

const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' }
]

const tableRows = [
  { id: 'button', name: 'YButton', status: 'Stable' },
  { id: 'search-form', name: 'YSearchForm', status: 'Beta' }
]

const searchFormSetup = [
  "import { ref } from 'vue'",
  "import { YButton } from '@yok-ui/core'",
  "import { YCrudLayout, YDataTable, YSearchForm, type YSearchFormField, type YSearchFormSubmitPayload, type YSearchFormValue } from '@yok-ui/admin'",
  '',
  'const searchValues = ref<Record<string, YSearchFormValue>>({',
  "  keyword: 'table',",
  "  status: 'stable',",
  "  releaseDate: '2026-07-01',",
  "  releaseWindow: ['2026-07-01', '2026-07-07']",
  '})',
  'const compactValues = ref<Record<string, YSearchFormValue>>({})',
  "const message = ref('Waiting for search')",
  '',
  'async function loadOwnerOptions() {',
  '  return [',
  "    { label: 'Core team', value: 'core' },",
  "    { label: 'Admin team', value: 'admin' },",
  "    { label: 'Design system', value: 'design' }",
  '  ]',
  '}',
  '',
  'const fields: YSearchFormField[] = [',
  "  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },",
  '  {',
  "    key: 'status',",
  "    label: 'Status',",
  "    type: 'select',",
  "    placeholder: 'Any status',",
  '    options: [',
  "      { label: 'Stable', value: 'stable' },",
  "      { label: 'Beta', value: 'beta' },",
  "      { label: 'Needs review', value: 'review' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'package',",
  "    label: 'Package',",
  "    type: 'select',",
  "    placeholder: 'Any package',",
  '    options: [',
  "      { label: 'Core', value: 'core' },",
  "      { label: 'Product', value: 'product' },",
  "      { label: 'Admin', value: 'admin' },",
  "      { label: 'Brand', value: 'brand' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'releaseDate',",
  "    label: 'Release date',",
  "    type: 'date',",
  '    shortcuts: [',
  "      { label: 'Today', value: '2026-06-13' },",
  "      { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'releaseWindow',",
  "    label: 'Release window',",
  "    type: 'dateRange',",
  '    shortcuts: [',
  "      { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00' }",
  '    ]',
  '  },',
  "  { key: 'owner', label: 'Owner', type: 'select', options: loadOwnerOptions }",
  ']',
  '',
  'const tableColumns = [',
  "  { key: 'name', label: 'Name' },",
  "  { key: 'status', label: 'Status' }",
  ']',
  '',
  'const tableRows = [',
  "  { id: 'button', name: 'YButton', status: 'Stable' },",
  "  { id: 'search-form', name: 'YSearchForm', status: 'Beta' }",
  ']',
  '',
  'function handleSearch(payload: YSearchFormSubmitPayload) {',
  "  message.value = `Search fields: ${payload.activeFieldKeys.join(', ') || 'none'}`",
  '}'
].join('\n')

const advancedCode = [
  '<YSearchForm',
  '  v-model="searchValues"',
  '  title="Component search"',
  '  description="Use collapsed filters for dense admin pages."',
  '  :fields="fields"',
  '  :collapsed-count="3"',
  '  @search="handleSearch"',
  '  @reset="message = \'Search reset\'"',
  '/>',
  '<p class="demo-note">{{ message }}</p>'
].join('\n')

const crudCode = [
  '<YCrudLayout',
  '  title="Release queue"',
  '  eyebrow="Admin"',
  '  description="Search criteria can stay compact while table state remains controlled."',
  '  density="compact"',
  '  :heading-level="2"',
  '>',
  '  <template #search>',
  '    <YSearchForm',
  '      v-model="compactValues"',
  '      density="compact"',
  '      :fields="fields"',
  '      :collapsed-count="2"',
  '      @search="handleSearch"',
  '    >',
  '      <template #actions>',
  '        <YButton variant="secondary">Save view</YButton>',
  '      </template>',
  '    </YSearchForm>',
  '  </template>',
  '  <template #table>',
  '    <YDataTable title="Components" :columns="tableColumns" :data="tableRows" />',
  '  </template>',
  '</YCrudLayout>'
].join('\n')
</script>

# Search Form

Search Form 是后台列表页的高级搜索表单。它参考主流组件库中表格页常见的 inline / advanced search / query filter 模式，适合放在 `YCrudLayout` 的 search 插槽里，与 `YDataTable` 的远程请求参数一起使用。

和轻量的 `YSearchPanel` 相比，`YSearchForm` 更适合字段较多的资源列表：支持折叠、默认值重置、查询 payload、字段级禁用、内置日期/日期范围筛选、异步 select presets，以及 `field-{key}` 自定义字段插槽。

## Advanced Search

<DocDemo
  title="Advanced search"
  description="字段较多的资源列表可以折叠高级筛选，同时保留当前活跃字段反馈。"
  :code="advancedCode"
  :setup="searchFormSetup"
  :usage="['advanced search', 'date filters', 'async presets', 'submit payload']"
>
  <YSearchForm
    v-model="searchValues"
    title="Component search"
    description="Use collapsed filters for dense admin pages."
    :fields="fields"
    :collapsed-count="3"
    @search="handleSearch"
    @reset="message = 'Search reset'"
  />
  <p class="demo-note">{{ message }}</p>
</DocDemo>

## Compact In CRUD Layout

<DocDemo
  title="Compact in CRUD layout"
  description="紧凑搜索表单适合嵌入 CRUD Layout，让查询区和表格状态保持在同一页面骨架中。"
  :code="crudCode"
  :setup="searchFormSetup"
  :usage="['compact density', 'crud search slot', 'custom actions']"
>
  <YCrudLayout
    title="Release queue"
    eyebrow="Admin"
    description="Search criteria can stay compact while table state remains controlled."
    density="compact"
    :heading-level="2"
  >
    <template #search>
      <YSearchForm
        v-model="compactValues"
        density="compact"
        :fields="fields"
        :collapsed-count="2"
        @search="handleSearch"
      >
        <template #actions>
          <YButton variant="secondary">Save view</YButton>
        </template>
      </YSearchForm>
    </template>
    <template #table>
      <YDataTable
        title="Components"
        :columns="tableColumns"
        :data="tableRows"
      />
    </template>
  </YCrudLayout>
</DocDemo>

## Built-in Date And Async Filters

`type: 'date'` 和 `type: 'dateRange'` 会直接复用 Core 包的 `YDatePicker` / `YDateRangePicker`，因此可以传入带时间说明的 `shortcuts`。`select` 字段的 `options` 可以是数组，也可以是异步函数，用于加载远程字典、负责人列表或租户选项。

```ts
const fields: YSearchFormField[] = [
  {
    key: 'releaseDate',
    label: 'Release date',
    type: 'date',
    shortcuts: [{ label: 'Launch day', value: '2026-07-01', time: '20:30' }]
  },
  {
    key: 'releaseWindow',
    label: 'Release window',
    type: 'dateRange',
    shortcuts: [{ label: 'Release week', value: ['2026-07-01', '2026-07-07'] }]
  },
  { key: 'owner', label: 'Owner', type: 'select', options: loadOwnerOptions }
]
```

## Custom Field

通过 `field-{key}` 插槽可以接入组织树、人员选择、权限对象等更复杂的业务控件。插槽会收到当前字段、当前值和 `update` 方法。

```vue
<YSearchForm v-model="query" :fields="fields">
  <template #field-owner="{ value, update }">
    <YInput
      label="Owner"
      :model-value="value"
      placeholder="Type owner name"
      @update:model-value="update"
    />
  </template>
</YSearchForm>
```

## Live example

<LiveExampleRunner preset="searchForm" />

## API

<ComponentApiSection name="YSearchForm" />

## Accessibility

- 组件使用原生 `form`，提交按钮为 `type="submit"`。
- 内置字段继承 `YInput` / `YSelect` 的 label 语义。
- 当前筛选数量通过 `role="status"` 和 polite live region 宣告。
- 展开按钮同步 `aria-expanded`。
- 自定义字段插槽应继续提供可见 label 或等价的可访问名称。
