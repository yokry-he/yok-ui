<script setup lang="ts">

const setup = `import { YButton, YCard, YWatermark } from '@yok-ui/core'`
const code = `<YWatermark content="Yok UI">
  <YCard title="Protected preview" description="This region carries a watermark.">
    Component preview content.
  </YCard>
</YWatermark>`
</script>

# Watermark

Watermark 为内容区域添加不可交互的文字水印，适合预览稿、内部文档、审核页和敏感信息展示。

::: tip TIP
`YWatermark` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Protected content {#watermark-protected-content}

<DocDemo
  title="Protected content"
  description="水印层不响应鼠标事件，不会阻挡区域内的按钮、链接和输入控件。"
  :code="code"
  :setup="setup"
  :usage="['content watermark', 'pointer-events none', 'data url']"
>
  <YWatermark content="Yok UI">
    <YCard title="Protected preview" description="This region carries a watermark.">
      <p>Component preview content.</p>
      <YButton variant="secondary">Still clickable</YButton>
    </YCard>
  </YWatermark>
</DocDemo>

## Watermark API {#watermark-api}

<ComponentApiSection name="YWatermark" />

## Accessibility {#accessibility}

- 水印 overlay 设置 `aria-hidden="true"`。
- 水印层 `pointer-events: none`，不会阻挡内容交互。
- 内容语义由内部 slot 保持。
