<script setup lang="ts">
const dataToolbarSetup = [
  "import { YButton } from '@yok-ui/core'",
  "import { YDataToolbar } from '@yok-ui/admin'"
].join('\n')

const basicCode = [
  '<YDataToolbar',
  '  title="Component list"',
  '  description="Manage package components and release status."',
  '  :count="33"',
  '>',
  '  <YButton variant="secondary">Export</YButton>',
  '  <YButton variant="primary">Create</YButton>',
  '</YDataToolbar>'
].join('\n')
</script>

# Data Toolbar

Data Toolbar 用于数据列表上方，承载列表标题、数量和批量操作。

::: tip TIP
`YDataToolbar` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## List toolbar {#data-toolbar-list-toolbar}

<DocDemo
  title="List toolbar"
  description="数据工具栏把列表标题、结果数量和主要操作放在同一区域，适合表格和资源列表上方。"
  :code="basicCode"
  :setup="dataToolbarSetup"
  :usage="['admin package', 'count status', 'toolbar actions']"
>
  <YDataToolbar title="Component list" description="Manage package components and release status." :count="33">
    <YButton variant="secondary">Export</YButton>
    <YButton variant="primary">Create</YButton>
  </YDataToolbar>
</DocDemo>

## Data Toolbar API {#data-toolbar-api}

<ComponentApiSection name="YDataToolbar" />

## Accessibility {#accessibility}

- `title` 和 `description` 应描述当前数据集合，帮助用户理解工具栏操作范围。
- `count` 只作为补充状态，不能替代列表或表格自身的结果说明。
- 默认插槽中的操作需要保持清晰按钮文案，批量或危险操作应额外确认。
