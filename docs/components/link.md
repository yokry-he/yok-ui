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

## Example

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

## Live example

<LiveExampleRunner
  preset="link"
  title="在线编辑 Link 示例"
  description="调整语义色、下划线策略、外链和禁用态，验证链接在文档和产品页面中的真实使用方式。"
/>

## API

<ComponentApiSection name="YLink" />

## Accessibility

- Link 保持原生 anchor 语义，非禁用状态下可通过 Tab 聚焦并用 Enter 访问。
- `external` 会默认使用 `_blank` 和 `noopener noreferrer`，降低外链安全风险。
- 禁用态会移除 `href` 并设置 `aria-disabled`，避免辅助技术用户误以为链接仍可访问。
