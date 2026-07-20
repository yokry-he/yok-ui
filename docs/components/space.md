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

::: tip TIP
`YSpace` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Action group {#space-action-group}

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

## Space API {#space-api}

<ComponentApiSection name="YSpace" />

## Accessibility {#accessibility}

- Space 只负责布局，不会改变内部按钮、链接、输入框等控件的语义。
- 使用 `separator` slot 时，分隔符默认作为视觉分隔，不应承载必须朗读的信息。
- 响应式工具区建议开启 `wrap`，避免窄视口下操作项被挤压或横向溢出。
