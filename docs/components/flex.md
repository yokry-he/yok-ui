<script setup lang="ts">
const setup = `import { YButton, YFlex, YTag } from '@yok-ui/core'`
const code = `<YFlex wrap align="center" justify="between" gap="md" aria-label="Release actions">
  <YFlex wrap align="center" gap="sm">
    <YTag tone="success">Stable</YTag>
    <YTag tone="info">Core package</YTag>
  </YFlex>
  <YFlex wrap align="center" gap="sm">
    <YButton variant="secondary">Preview</YButton>
    <YButton variant="primary">Publish</YButton>
  </YFlex>
</YFlex>`
</script>

# Flex

Flex 是轻量布局容器，用来处理块级元素的主轴/交叉轴对齐、换行、间距和语义根节点。它不会像 Space 一样为每个子元素增加包裹层，更适合页面工具区、卡片内容、响应式操作条和导航片段。

## Example

<DocDemo
  title="Toolbar layout"
  description="不改变子节点结构的前提下组织状态标签和操作按钮。"
  :code="code"
  :setup="setup"
  :usage="['no child wrapper', 'wrap', 'semantic group']"
>
  <YFlex wrap align="center" justify="between" gap="md" aria-label="Release actions">
    <YFlex wrap align="center" gap="sm">
      <YTag tone="success">Stable</YTag>
      <YTag tone="info">Core package</YTag>
    </YFlex>
    <YFlex wrap align="center" gap="sm">
      <YButton variant="secondary">Preview</YButton>
      <YButton variant="primary">Publish</YButton>
    </YFlex>
  </YFlex>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="flex"
  title="在线编辑 Flex 示例"
  description="调整方向、对齐、换行、间距和语义标签，验证它与 Space 的使用边界。"
/>

## API

<ComponentApiSection name="YFlex" />

## Accessibility

- Flex 只负责布局，不会改变内部按钮、链接、输入框等控件的语义和键盘顺序。
- 普通视觉布局无需额外 ARIA；当布局区域本身需要被辅助技术识别时，可以传入 `aria-label`。
- 使用 `as="nav"`、`as="main"`、`as="section"` 等语义标签时，应确保页面中对应 landmark 不重复或具备清晰名称。
- 响应式工具区建议开启 `wrap` 并使用稳定 gap，避免窄视口出现横向溢出。
