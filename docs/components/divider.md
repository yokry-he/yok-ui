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

## Example

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

## Live example

<LiveExampleRunner
  preset="divider"
  title="在线编辑 Divider 示例"
  description="调整分割线标签和对齐方式，让长表单、设置页和文档内容更有节奏。"
/>

## API

<ComponentApiSection name="YDivider" />

## Accessibility

- 默认分割线作为视觉分隔，不应替代真实标题层级。
- 带 `label` 时文案应简短，帮助用户理解相邻内容分组。
- 长表单或设置页仍应使用语义标题，让键盘和辅助技术用户能快速浏览结构。
