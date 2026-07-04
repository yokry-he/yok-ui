---
title: Calendar
description: 月视图日历，支持受控日期、面板切换、禁用日期和日期格自定义。
---

# Calendar

Calendar 用于展示一个月内的日期选择、档期查看或轻量日程入口。Yok UI 的实现参考 Element Plus 的受控月历、范围/禁用日期思路，以及 Ant Design Calendar 的月视图和日期格定制能力，先提供更适合文档和后台场景的轻量基础版本。

## Example

### Basic

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { YCalendar } from '@yok-ui/core'

const selectedDate = ref('2026-06-18')
</script>

<template>
  <YCalendar v-model="selectedDate" />
</template>
```

### Disabled Dates

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { YCalendar } from '@yok-ui/core'

const selectedDate = ref('2026-06-18')
const disableWeekends = (date: Date) => [0, 6].includes(date.getDay())
</script>

<template>
  <YCalendar v-model="selectedDate" :disabled-date="disableWeekends" />
</template>
```

### Date Cell

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { YCalendar } from '@yok-ui/core'

const selectedDate = ref('2026-06-18')
const releaseDays = new Set(['2026-06-18', '2026-06-24'])
</script>

<template>
  <YCalendar v-model="selectedDate">
    <template #dateCell="{ cell }">
      <span>{{ cell.day }}</span>
      <small v-if="releaseDays.has(cell.value)">Release</small>
    </template>
  </YCalendar>
</template>
```

## Live example

<LiveExampleRunner preset="calendar" />

## Usage Notes

- `modelValue` 使用 `YYYY-MM-DD` 字符串，方便和表单、路由查询参数和后端接口保持一致。
- `panel-change` 只表示当前显示月份变化，不会自动修改选中日期。
- `dateCell` 适合展示少量标记；复杂日程列表应跳转到单独的日程页或抽屉详情。

## Accessibility

- 日历主体使用 `role="grid"`，星期头使用 `role="columnheader"`。
- 日期格使用原生 `button`，可通过 Tab 聚焦，Enter 或 Space 触发选择。
- 选中日期同步 `aria-selected` 和 `aria-pressed`，禁用日期使用原生 `disabled`。

## API

<ComponentApiSection name="YCalendar" />
