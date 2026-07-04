---
title: Notification
description: 组件式与命令式通知，用于展示标题、长内容、位置和手动关闭。
---

# Notification

Notification 用于展示比 Message 更完整的异步反馈，例如发布完成、后台任务失败、审核提醒或需要用户手动关闭的状态。设计参考 Element Plus 和 Ant Design 的通知模式：支持语义类型、四角位置、自动关闭、手动关闭和命令式调用。

## Example

### Basic

```vue
<script setup lang="ts">
import { YNotification } from '@yok-ui/core'
</script>

<template>
  <YNotification title="Published" tone="success" closable>
    Calendar docs are live.
  </YNotification>
</template>
```

### Alert Tone

```vue
<script setup lang="ts">
import { YNotification } from '@yok-ui/core'
</script>

<template>
  <YNotification title="Deploy failed" tone="danger" role="alert" close-label="Close failure notification">
    Rollback is ready. Review the failed package before retrying.
  </YNotification>
</template>
```

### Service

```ts
import { notification } from '@yok-ui/core'

const handle = notification.success({
  title: 'Published',
  content: 'Calendar docs are live.',
  placement: 'bottom-left',
  duration: 4500
})

handle.update({
  title: 'Synced',
  content: 'Release notes are ready.'
})
```

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
