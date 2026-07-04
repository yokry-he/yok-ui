<script setup lang="ts">
import { ref } from 'vue'

const filters = ref({})
const fields = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'All status',
    options: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' }
    ]
  }
]

const searchPanelSetup = [
  "import { ref } from 'vue'",
  "import { YSearchPanel } from '@yok-ui/admin'",
  '',
  'const filters = ref({})',
  'const fields = [',
  "  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },",
  '  {',
  "    key: 'status',",
  "    label: 'Status',",
  "    type: 'select',",
  "    placeholder: 'All status',",
  '    options: [',
  "      { label: 'Stable', value: 'stable' },",
  "      { label: 'Beta', value: 'beta' }",
  '    ]',
  '  }',
  ']'
].join('\n')

const basicCode = '<YSearchPanel v-model="filters" :fields="fields" />'
</script>

# Search Panel

Search Panel 用于后台筛选区，适合放在表格或数据列表上方。当前版本支持输入框和选择器字段。

## Example

<DocDemo
  title="Table filters"
  description="筛选面板以配置驱动字段，适合放在表格、资源页或 CRUD 页面顶部。"
  :code="basicCode"
  :setup="searchPanelSetup"
  :usage="['admin package', 'configured fields', 'v-model filters']"
>
  <YSearchPanel v-model="filters" :fields="fields" />
</DocDemo>

## Live example

<LiveExampleRunner preset="searchPanel" />

## API

<ComponentApiSection name="YSearchPanel" />

## Accessibility

- 每个字段都会使用配置中的 `label` 作为可访问名称，避免只依赖 placeholder。
- 提交和重置按钮使用原生 button 语义，支持 Enter / Space 激活。
- 筛选结果数量、错误和加载状态应由承载列表或表格区域补充 `role="status"`。
