<script setup lang="ts">
const dividerSetup = "import { YDivider, YTag } from '@yok-ui/core'"

const basicCode = [
  '<YDivider label="Core" align="start" />',
  '<div class="demo-row">',
  '  <YTag>Button</YTag>',
  '  <YTag>Input</YTag>',
  '  <YTag>Modal</YTag>',
  '</div>',
  '<YDivider label="Product" />',
  '<div class="demo-row">',
  '  <YTag tone="info">Command Palette</YTag>',
  '  <YTag tone="info">Code Block</YTag>',
  '</div>'
].join('\n')

const alignCode = [
  '<div class="demo-stack">',
  '  <YDivider label="Start" align="start" />',
  '  <YDivider label="Center" />',
  '  <YDivider label="End" align="end" />',
  '</div>'
].join('\n')
</script>

# Divider

Divider 用于分隔内容组，也可以带上轻量标签，帮助长表单、设置页和文档页面建立节奏。

::: tip TIP
`YDivider` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Labeled groups {#divider-labeled-groups}

<DocDemo
  title="Labeled groups"
  description="带标签的分割线适合长表单、组件清单和设置页分组，但不替代语义标题。"
  :code="basicCode"
  :setup="dividerSetup"
  :usage="['label', 'align', 'separator']"
>
  <YDivider label="Core" align="start" />
  <div class="demo-row">
    <YTag>Button</YTag>
    <YTag>Input</YTag>
    <YTag>Modal</YTag>
  </div>
  <YDivider label="Product" />
  <div class="demo-row">
    <YTag tone="info">Command Palette</YTag>
    <YTag tone="info">Code Block</YTag>
  </div>
</DocDemo>

## Alignment {#divider-alignment}

<DocDemo
  title="Alignment"
  description="align 用于控制标签位置，帮助不同密度的内容保持清晰节奏。"
  :code="alignCode"
  :setup="dividerSetup"
  :usage="['start', 'center', 'end']"
>
  <div class="demo-stack">
    <YDivider label="Start" align="start" />
    <YDivider label="Center" />
    <YDivider label="End" align="end" />
  </div>
</DocDemo>

## Divider API {#divider-api}

<ComponentApiSection name="YDivider" />

## Accessibility {#accessibility}

- 默认分割线作为视觉分隔，不应替代真实标题层级。
- 带 `label` 时文案应简短，帮助用户理解相邻内容分组。
- 长表单或设置页仍应使用语义标题，让键盘和辅助技术用户能快速浏览结构。
