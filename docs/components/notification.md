---
title: Notification
description: 组件式与命令式通知，用于展示标题、长内容、位置和手动关闭。
---

<script setup lang="ts">
import { notification } from '@yok-ui/core'

const componentSetup = `import { YNotification } from '@yok-ui/core'`

const basicCode = `<YNotification title="Published" tone="success" closable>
  Calendar docs are live.
</YNotification>`

const alertCode = `<YNotification
  title="Deploy failed"
  tone="danger"
  role="alert"
  close-label="Close failure notification"
>
  Rollback is ready. Review the failed package before retrying.
</YNotification>`

const serviceCode = `<script setup lang="ts">
import { notification, YButton } from '@yok-ui/core'

function showPublishNotice() {
  const handle = notification.success({
    title: 'Published',
    content: 'Calendar docs are live.',
    placement: 'bottom-left',
    duration: 4500
  })

  window.setTimeout(() => {
    handle.update({
      title: 'Synced',
      content: 'Release notes are ready.'
    })
  }, 900)
}
</` + `script>

<template>
  <YButton variant="primary" @click="showPublishNotice">
    Show notification
  </YButton>
</template>`

function showDocsNotification() {
  const handle = notification.success({
    title: 'Published',
    content: 'Calendar docs are live.',
    placement: 'bottom-left',
    duration: 2800
  })

  window.setTimeout(() => {
    handle.update({
      title: 'Synced',
      content: 'Release notes are ready.'
    })
  }, 900)
}
</script>

# Notification

Notification 用于展示比 Message 更完整的异步反馈，例如发布完成、后台任务失败、审核提醒或需要用户手动关闭的状态。设计参考 Element Plus 和 Ant Design 的通知模式：支持语义类型、四角位置、自动关闭、手动关闭和命令式调用。

## Examples

<DocDemo
  title="Basic"
  description="适合发布成功、异步任务完成和需要标题的正向反馈。"
  :code="basicCode"
  :setup="componentSetup"
  :usage="['tone=success', 'closable', 'role=status']"
>
  <YNotification title="Published" tone="success" closable>
    Calendar docs are live.
  </YNotification>
</DocDemo>

<DocDemo
  title="Alert tone"
  description="失败、阻断和高优先级反馈应显式使用 alert 语义，并提供清晰的关闭标签。"
  :code="alertCode"
  :setup="componentSetup"
  :usage="['tone=danger', 'role=alert', 'closeLabel']"
>
  <YNotification
    title="Deploy failed"
    tone="danger"
    role="alert"
    close-label="Close failure notification"
  >
    Rollback is ready. Review the failed package before retrying.
  </YNotification>
</DocDemo>

<DocDemo
  title="Service API"
  description="命令式 service 适合跨页面任务、后台队列和保存发布流程；返回 handle 可手动关闭或更新内容。"
  :code="serviceCode"
  :usage="['notification.success', 'placement', 'handle.update']"
>
  <YButton variant="primary" @click="showDocsNotification">
    Show notification
  </YButton>
</DocDemo>

## Live example

<LiveExampleRunner preset="notification" />

## Usage Notes

- 短反馈优先使用 Message；需要标题、较长说明或后台任务结果时使用 Notification。
- 命令式 `notification` 只接收安全文本内容，不接受 HTML 字符串。
- 需要用户处理的通知把 `duration` 设为 `0`，并保留关闭按钮。
- `warning` 和 `danger` 通知建议使用 `role="alert"`，普通成功或信息通知使用 `status`。

## Accessibility

- 通知容器使用 `role="status"` 或 `role="alert"`，并设置 `aria-atomic="true"`。
- 关闭按钮是原生 `button`，必须提供明确的 `closeLabel`。
- 服务式通知不会自动抢焦点；键盘用户可以继续当前任务，再通过关闭按钮处理通知。

## API

<ComponentApiSection name="YNotification" />
