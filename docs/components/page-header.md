<script setup lang="ts">
const pageHeaderSetup = [
  "import { YButton } from '@yok-ui/core'",
  "import { YPageHeader } from '@yok-ui/admin'"
].join('\n')

const basicCode = [
  '<YPageHeader',
  '  title="Component inventory"',
  '  eyebrow="Admin"',
  '  status="Phase 2 ready"',
  '  description="Manage component coverage, package status and release tasks."',
  '>',
  '  <template #actions>',
  '    <YButton variant="secondary">Export</YButton>',
  '    <YButton variant="primary">Create</YButton>',
  '  </template>',
  '</YPageHeader>'
].join('\n')
</script>

# Page Header

Page Header 用于后台页面顶部，承载页面标题、描述、状态和操作区。它比普通标题更适合管理系统的信息组织。

::: tip TIP
`YPageHeader` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Admin page header {#page-header-admin-page-header}

<DocDemo
  title="Admin page header"
  description="后台页面头部应集中展示标题、状态和主要操作，避免把动作散落到页面各处。"
  :code="basicCode"
  :setup="pageHeaderSetup"
  :usage="['admin package', 'actions slot', 'page status']"
>
  <YPageHeader
    title="Component inventory"
    eyebrow="Admin"
    status="Phase 2 ready"
    description="Manage component coverage, package status and release tasks."
  >
    <template #actions>
      <YButton variant="secondary">Export</YButton>
      <YButton variant="primary">Create</YButton>
    </template>
  </YPageHeader>
</DocDemo>

## Page Header API {#page-header-api}

<ComponentApiSection name="YPageHeader" />

## Accessibility {#accessibility}

- 标题使用真实文本输出，页面仍应保留唯一 `h1`。
- `actions` 插槽中的操作应使用原生 button 或 Yok UI Button，保持可聚焦和可键盘触发。
- 状态文本只表达页面状态，不替代错误或成功反馈的 alert 语义。
