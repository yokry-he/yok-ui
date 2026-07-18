<script setup lang="ts">
const setup = `import { YLink, YSpace } from '@yok-ui/core'`
const code = `<YSpace wrap>
  <YLink href="/guide/introduction">Read guide</YLink>
  <YLink href="https://github.com" external tone="info">GitHub</YLink>
  <YLink href="/danger" tone="danger" underline="always">Remove draft</YLink>
</YSpace>`
</script>

# Link

Link 用于主题化文本链接，适合文档入口、设置项辅助导航、空状态补充操作和轻量外链。

::: tip TIP
`YLink` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Inline navigation {#link-inline-navigation}

<DocDemo
  title="Inline navigation"
  description="低权重导航使用 Link，关键动作仍建议使用 Button 或确认类组件。"
  :code="code"
  :setup="setup"
  :usage="['external safe rel', 'disabled state', 'underline strategy']"
>
  <YSpace wrap>
    <YLink href="/guide/introduction">Read guide</YLink>
    <YLink href="https://github.com" external tone="info">GitHub</YLink>
    <YLink href="/danger" tone="danger" underline="always">Remove draft</YLink>
  </YSpace>
</DocDemo>

## Link API {#link-api}

<ComponentApiSection name="YLink" />

## Accessibility {#accessibility}

- Link 保持原生 anchor 语义，非禁用状态下可通过 Tab 聚焦并用 Enter 访问。
- `external` 会默认使用 `_blank` 和 `noopener noreferrer`，降低外链安全风险。
- 禁用态会移除 `href` 并设置 `aria-disabled`，避免辅助技术用户误以为链接仍可访问。
