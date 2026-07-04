<script setup lang="ts">
const setup = `import { YScrollbar, YTag } from '@yok-ui/core'`
const code = `<YScrollbar :height="180" aria-label="Component changelog">
  <div class="demo-stack">
    <YTag tone="success">Stable Button docs</YTag>
    <YTag tone="info">Live Example source panel</YTag>
    <YTag tone="warning">Theme tokens review</YTag>
    <YTag tone="success">Scrollbar added to Basic</YTag>
  </div>
</YScrollbar>`
</script>

# Scrollbar

Scrollbar 用于给文档片段、日志、短列表和宽内容提供统一滚动区域。它和 Element Plus 的 Scrollbar 一样属于 Basic 能力，但在 Yok UI 中额外强调可聚焦视口、滚动事件指标和 Live Example 场景调试。

## Example

<DocDemo
  title="Component changelog"
  description="固定高度区域内部滚动，不让列表撑开整个文档页面。"
  :code="code"
  :setup="setup"
  :usage="['height', 'scroll event', 'keyboard viewport']"
>
  <YScrollbar :height="180" aria-label="Component changelog">
    <div class="demo-stack">
      <YTag tone="success">Stable Button docs</YTag>
      <YTag tone="info">Live Example source panel</YTag>
      <YTag tone="warning">Theme tokens review</YTag>
      <YTag tone="success">Scrollbar added to Basic</YTag>
      <YTag tone="info">Keyboard focusable viewport</YTag>
    </div>
  </YScrollbar>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="scrollbar"
  title="在线编辑 Scrollbar 示例"
  description="切换固定高度、紧凑面板、横向滚动、移动高度和键盘滚动路径。"
/>

## API

<ComponentApiSection name="YScrollbar" />

## Accessibility

- 滚动视口默认带 `tabindex="0"` 和 `role="region"`，请通过 `aria-label` 描述该区域承载的内容。
- `YScrollbar` 不改变内部内容语义，列表、表格、按钮仍应由内部组件自行提供可访问名称和状态。
- 横向滚动只适合不可折行内容，普通文本应优先换行，避免移动端出现难以操作的横向浏览。
