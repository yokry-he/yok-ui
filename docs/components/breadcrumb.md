<script setup lang="ts">
const docsItems = [
  { label: 'Guide', href: '/guide/introduction' },
  { label: 'Components', href: '/components/' },
  { label: 'Breadcrumb' }
]

const projectItems = [
  { label: 'Workspace', href: '/workspace' },
  { label: 'Private package', href: '/private', disabled: true },
  { label: 'Overview' }
]

const breadcrumbSetup = [
  "import { YBreadcrumb } from '@yok-ui/core'",
  '',
  'const docsItems = [',
  "  { label: 'Guide', href: '/guide/introduction' },",
  "  { label: 'Components', href: '/components/' },",
  "  { label: 'Breadcrumb' }",
  ']',
  '',
  'const projectItems = [',
  "  { label: 'Workspace', href: '/workspace' },",
  "  { label: 'Private package', href: '/private', disabled: true },",
  "  { label: 'Overview' }",
  ']'
].join('\n')

const basicCode = '<YBreadcrumb :items="docsItems" />'

const disabledCode = [
  '<YBreadcrumb',
  '  separator=">"',
  '  aria-label="Project path"',
  '  :items="projectItems"',
  '/>'
].join('\n')
</script>

# Breadcrumb

Breadcrumb 用于展示当前页面在站点或产品结构中的位置，帮助用户回到上级页面。它适合文档站、后台详情页、设置页和作品集的多层路径。

::: tip TIP
`YBreadcrumb` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Documentation path {#breadcrumb-documentation-path}

<DocDemo
  title="Documentation path"
  description="文档站路径应把上级页面作为真实链接，最后一项表达当前位置。"
  :code="basicCode"
  :setup="breadcrumbSetup"
  :usage="['nav', 'aria-current', 'links']"
>
  <YBreadcrumb :items="docsItems" />
</DocDemo>

## Disabled item {#breadcrumb-disabled-item}

<DocDemo
  title="Disabled item"
  description="不可访问的中间层级不渲染为链接，并通过 aria-disabled 说明当前不可进入。"
  :code="disabledCode"
  :setup="breadcrumbSetup"
  :usage="['separator', 'disabled', 'aria-label']"
>
  <YBreadcrumb
    separator=">"
    aria-label="Project path"
    :items="projectItems"
  />
</DocDemo>

## Breadcrumb API {#breadcrumb-api}

<ComponentApiSection name="YBreadcrumb" />

## Accessibility {#accessibility}

Breadcrumb 使用 `nav` 和有序列表表达路径层级，默认 `aria-label` 为 `Breadcrumb`。最后一项或显式设置 `current: true` 的项目会得到 `aria-current="page"`。禁用项不会渲染为链接，并使用 `aria-disabled="true"`。
