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

::: tip TIP
`YText` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Semantic text {#text-semantic-text}

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

## Text API {#text-api}

<ComponentApiSection name="YText" />

## Accessibility {#accessibility}

- Text 默认只负责视觉语义，不会额外制造焦点。
- `code` 适合变量名、token 和配置键，不应包裹大段代码。
- `truncated` 和 `lineClamp` 会隐藏部分内容，关键信息不应只存在于被省略的文本里。
