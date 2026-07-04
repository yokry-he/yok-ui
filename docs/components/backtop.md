<script setup lang="ts">

const setup = `import { YBacktop } from '@yok-ui/core'`
const code = `<YBacktop :visibility-height="240" :right="24" :bottom="24" />`
</script>

# Backtop

Backtop 用于长文档、长表格和详情页快速返回顶部。它是页面级辅助操作，不应替代主要导航。

## Example

<DocDemo
  title="Page helper"
  description="滚动超过 visibilityHeight 后显示，点击后平滑回到顶部。"
  :code="code"
  :setup="setup"
  :usage="['fixed position', 'scroll helper', 'aria-label']"
>
  <div class="docs-panel">
    <p class="docs-eyebrow">demo note</p>
    <h2>Backtop 在真实长页面中显示</h2>
    <p>文档站自身已经是长页面场景。组件默认固定在视口右下角，点击后回到页面顶部。</p>
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="backtop"
  title="在线编辑 Backtop 示例"
  description="预览返回顶部辅助按钮的固定位置、可访问标签和页面级辅助操作形态。"
/>

## API

<ComponentApiSection name="YBacktop" />

## Accessibility

- 使用原生 `button`。
- 默认 `aria-label="Back to top"`。
- 只作为辅助操作，不承载关键流程。
