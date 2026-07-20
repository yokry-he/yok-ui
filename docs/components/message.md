<script setup lang="ts">

const componentSetup = `import { YMessage } from '@yok-ui/core'`
const componentCode = `<YMessage tone="success" title="Saved">
  Component settings have been updated.
</YMessage>`
const serviceCode = `<script setup lang="ts">
import { message, YButton } from '@yok-ui/core'

function showSuccess() {
  message.success('Theme tokens saved.')
}

function showWarning() {
  message.warning({
    title: 'Needs review',
    content: 'Some contrast pairs are close to the AA threshold.',
    duration: 0
  })
}
</` + `script>

<template>
  <div class="demo-row">
    <YButton variant="primary" @click="showSuccess">Show success</YButton>
    <YButton variant="secondary" @click="showWarning">Show warning</YButton>
  </div>
</template>`
</script>

# Message

Message 用于轻量反馈，例如保存成功、复制完成、当前状态提示。它同时提供组件式 API 和命令式 service API。

::: tip TIP
`YMessage` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Component messages {#message-component-messages}

<DocDemo
  title="Component messages"
  description="适合文档示例、表单状态和页面内持久提示。"
  :code="componentCode"
  :setup="componentSetup"
  :usage="['status', 'closable', 'tone']"
>
  <div class="demo-stack">
    <YMessage tone="success" title="Saved">Component settings have been updated.</YMessage>
    <YMessage tone="warning" title="Heads up" closable>Admin components are still in roadmap mode.</YMessage>
  </div>
</DocDemo>

## Service API {#message-service-api}

<DocDemo
  title="Service API"
  description="适合保存、复制、删除等短反馈，warning 和 danger 默认使用 alert 语义。"
  :code="serviceCode"
  :usage="['message.success', 'message.warning', 'duration']"
>
  <YMessage tone="info" title="Service preview">Call message.success(...) in your app code.</YMessage>
</DocDemo>

## Usage notes {#message-usage-notes}

- `YMessage` 适合短反馈；需要承载操作按钮、长内容或详情列表时使用 `YAlert`、`YModal` 或页面内状态区。
- 成功和信息提示默认使用 `role="status"`，不会打断读屏；错误、阻断和需要立即处理的提示使用 `role="alert"`。
- 持续提示应开启 `closable`，并提供具体的 `closeLabel`，例如“关闭失败提示”。
- Yok UI 不支持把任意 HTML 字符串注入 Message 正文；需要富文本时请使用组件插槽，避免 XSS 风险。
- 命令式 `message` 适合保存、复制、删除后的短反馈；需要同内容合并或位置控制时，应先在业务层封装策略。

## Message API {#message-api}

<ComponentApiSection name="YMessage" />

## Accessibility {#accessibility}

- `YMessage` 默认使用 `role="status"` 和 `aria-atomic="true"`。
- service 中的 `warning` 和 `danger` 会使用 `role="alert"`。
- 关闭按钮始终有可配置的 `aria-label`。
- 可关闭消息必须能通过 Tab 聚焦关闭按钮，并可用 Enter 或 Space 触发。
