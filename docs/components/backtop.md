<script setup lang="ts">

const setup = `import { YBacktop } from '@yok-ui/core'`
const code = `<YBacktop :visibility-height="240" :right="24" :bottom="24" />`
</script>

# Backtop

Backtop 用于长文档、长表格和详情页快速返回顶部。它是页面级辅助操作，不应替代主要导航。

::: tip TIP
`YBacktop` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Page helper {#backtop-page-helper}

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

## Backtop API {#backtop-api}

<ComponentApiSection name="YBacktop" />

## Accessibility {#accessibility}

- 使用原生 `button`。
- 默认 `aria-label="Back to top"`。
- 只作为辅助操作，不承载关键流程。
