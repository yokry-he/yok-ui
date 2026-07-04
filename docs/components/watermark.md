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

## Example

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

## Live example

<LiveExampleRunner preset="watermark" />

## API

<ComponentApiSection name="YWatermark" />

## Accessibility

- 水印 overlay 设置 `aria-hidden="true"`。
- 水印层 `pointer-events: none`，不会阻挡内容交互。
- 内容语义由内部 slot 保持。
