<script setup lang="ts">
const setup = `import { YCol, YRow, YTag } from '@yok-ui/core'`
const code = `<YRow :gutter="[16, 20]" align="stretch">
  <YCol :xs="24" :md="12" :lg="8">
    <div class="grid-demo-cell">Core</div>
  </YCol>
  <YCol :xs="24" :md="12" :lg="8">
    <div class="grid-demo-cell">Product</div>
  </YCol>
  <YCol :xs="24" :md="24" :lg="8">
    <div class="grid-demo-cell">Admin</div>
  </YCol>
</YRow>`
</script>

# Grid

Grid 提供 24 栅格布局能力，用于页面区块、仪表盘指标、表单分栏和卡片列表。它补齐 Flex 和 Space 之外的“列宽比例 + 响应式断点”能力，和 Element Plus、Ant Design Vue 的 Row / Col 使用方式保持接近。

::: tip TIP
`YRow` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Responsive grid {#grid-responsive-grid}

<DocDemo
  title="Responsive grid"
  description="通过 xs / md / lg 断点控制列宽，移动端堆叠，桌面端三列展示。"
  :code="code"
  :setup="setup"
  :usage="['24 columns', 'responsive spans', 'gutter']"
>
  <YRow :gutter="[16, 20]" align="stretch">
    <YCol :xs="24" :md="12" :lg="8">
      <div class="grid-demo-cell">
        <strong>Core</strong>
        <YTag tone="success">Stable</YTag>
      </div>
    </YCol>
    <YCol :xs="24" :md="12" :lg="8">
      <div class="grid-demo-cell">
        <strong>Product</strong>
        <YTag tone="info">Workflow</YTag>
      </div>
    </YCol>
    <YCol :xs="24" :md="24" :lg="8">
      <div class="grid-demo-cell">
        <strong>Admin</strong>
        <YTag tone="warning">Dense</YTag>
      </div>
    </YCol>
  </YRow>
</DocDemo>

## Grid API {#grid-api}

<ComponentApiSection name="YRow" />

<ComponentApiSection name="YCol" />

## Accessibility {#accessibility}

- Grid 只负责布局，不会改变列内按钮、链接、输入框等控件的语义和键盘顺序。
- `order`、`push`、`pull` 只适合视觉重排；重要阅读顺序仍应以 DOM 顺序为准。
- 列内容直接使用 `YCol` 包裹，避免在业务页面里混合多层无语义 wrapper。
- 响应式布局建议始终提供 `xs` 配置，确保移动端可读且不会横向溢出。

<style scoped>
.grid-demo-cell {
  display: grid;
  gap: 10px;
  min-height: 104px;
  padding: 18px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
}
</style>
