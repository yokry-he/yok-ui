<script setup lang="ts">

const basicSetup = `import { YProgress } from '@yok-ui/core'`

const basicCode = `<template>
  <YProgress label="Package build" :value="68" />
  <YProgress label="Test coverage" :value="82" tone="success" />
  <YProgress label="Storage usage" :value="74" tone="warning" striped />
</template>`

const sizesSetup = `import { YProgress } from '@yok-ui/core'`

const sizesCode = `<template>
  <YProgress label="Small task" :value="32" size="sm" />
  <YProgress label="Default task" :value="56" />
  <YProgress label="Large task" :value="88" size="lg" tone="success" />
</template>`
</script>

# Progress

Progress 用于展示任务、上传、配额或流程的完成度。它是线性进度条，不负责异步状态管理；业务侧只需要传入当前 `value`。

::: tip TIP
`YProgress` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Semantic progress {#progress-semantic-progress}

<DocDemo
  title="Semantic progress"
  description="进度条用于展示可量化状态，tone 应该和业务语义一致。"
  :code="basicCode"
  :setup="basicSetup"
  :usage="['value', 'tone', 'striped']"
>
  <div class="demo-stack">
    <YProgress label="Package build" :value="68" />
    <YProgress label="Test coverage" :value="82" tone="success" />
    <YProgress label="Storage usage" :value="74" tone="warning" striped />
  </div>
</DocDemo>

## Sizes {#progress-sizes}

<DocDemo
  title="Sizes"
  description="小尺寸适合紧凑列表，默认尺寸适合卡片，lg 适合关键流程页面。"
  :code="sizesCode"
  :setup="sizesSetup"
  :usage="['sm', 'md', 'lg']"
>
  <div class="demo-stack">
    <YProgress label="Small task" :value="32" size="sm" />
    <YProgress label="Default task" :value="56" />
    <YProgress label="Large task" :value="88" size="lg" tone="success" />
  </div>
</DocDemo>

## Progress API {#progress-api}

<ComponentApiSection name="YProgress" />

## Accessibility {#accessibility}

- Progress 使用 `role="progressbar"`，并提供 `aria-valuemin="0"`、`aria-valuemax="100"`、`aria-valuenow` 和可命名的 `aria-label`。
- `value` 会限制在 0 到 100 之间，避免异常数据破坏语义或布局。
- 如果附近已经有明确文本，可以设置 `showValue="false"` 隐藏视觉百分比；读屏仍然可以通过 `aria-valuenow` 获得当前值。
