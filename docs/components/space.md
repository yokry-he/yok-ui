<script setup lang="ts">
const setup = `import { YButton, YSpace, YTag } from '@yok-ui/core'`
const code = `<YSpace wrap size="md">
  <YButton variant="primary">Publish</YButton>
  <YButton variant="secondary">Save draft</YButton>
  <YTag tone="success">Stable spacing</YTag>
</YSpace>`
</script>

# Space

Space 用于给按钮组、标签串、工具栏片段和表单局部内容提供一致间距，避免在业务页面里反复手写 margin。

## Example

<DocDemo
  title="Action group"
  description="适合小型操作组、状态标签和局部工具项。"
  :code="code"
  :setup="setup"
  :usage="['gap tokens', 'wrap', 'separator slot']"
>
  <YSpace wrap size="md">
    <YButton variant="primary">Publish</YButton>
    <YButton variant="secondary">Save draft</YButton>
    <YTag tone="success">Stable spacing</YTag>
  </YSpace>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="space"
  title="在线编辑 Space 示例"
  description="调整方向、间距、对齐、换行和分隔符，让工具区不再依赖手写 margin。"
/>

## API

<ComponentApiSection name="YSpace" />

## Accessibility

- Space 只负责布局，不会改变内部按钮、链接、输入框等控件的语义。
- 使用 `separator` slot 时，分隔符默认作为视觉分隔，不应承载必须朗读的信息。
- 响应式工具区建议开启 `wrap`，避免窄视口下操作项被挤压或横向溢出。
