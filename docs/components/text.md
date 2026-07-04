<script setup lang="ts">
const setup = `import { YSpace, YText } from '@yok-ui/core'`
const code = `<YSpace direction="vertical" align="start">
  <YText strong>Fresh cute typography</YText>
  <YText tone="secondary">Use semantic text instead of one-off CSS.</YText>
  <YText code>componentRegistry</YText>
</YSpace>`
</script>

# Text

Text 用于基础文本语义、强调、标记、代码和省略展示，帮助文档和产品页面减少散落的文本样式。

## Example

<DocDemo
  title="Semantic text"
  description="使用 Text 表达轻量状态、辅助文案和内联代码。"
  :code="code"
  :setup="setup"
  :usage="['tone', 'mark/code', 'line clamp']"
>
  <YSpace direction="vertical" align="start">
    <YText strong>Fresh cute typography</YText>
    <YText tone="secondary">Use semantic text instead of one-off CSS.</YText>
    <YText code>componentRegistry</YText>
  </YSpace>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="text"
  title="在线编辑 Text 示例"
  description="调整文本语义色、尺寸、加粗、内联代码和多行省略，验证文档和产品页面的真实排版场景。"
/>

## API

<ComponentApiSection name="YText" />

## Accessibility

- Text 默认只负责视觉语义，不会额外制造焦点。
- `code` 适合变量名、token 和配置键，不应包裹大段代码。
- `truncated` 和 `lineClamp` 会隐藏部分内容，关键信息不应只存在于被省略的文本里。
