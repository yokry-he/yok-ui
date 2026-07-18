---
title: Calendar
description: 月视图日历，支持受控日期、面板切换、禁用日期和日期格自定义。
---

<script setup lang="ts">
import { ref } from 'vue'

const selectedDate = ref('2026-06-18')
const sprintDate = ref('2026-06-18')
const releaseDate = ref('2026-06-18')
const fixedToday = new Date(2026, 5, 1)
const disableWeekends = (date: Date) => [0, 6].includes(date.getDay())
const releaseDays = new Set(['2026-06-18', '2026-06-24'])

const calendarSetup = [
  "import { ref } from 'vue'",
  "import { YCalendar, YTag } from '@yok-ui/core'",
  '',
  "const selectedDate = ref('2026-06-18')",
  "const sprintDate = ref('2026-06-18')",
  "const releaseDate = ref('2026-06-18')",
  'const fixedToday = new Date(2026, 5, 1)',
  'const disableWeekends = (date: Date) => [0, 6].includes(date.getDay())',
  "const releaseDays = new Set(['2026-06-18', '2026-06-24'])"
].join('\n')

const basicCode = [
  '<div class="demo-stack">',
  '  <YCalendar v-model="selectedDate" :today="fixedToday" />',
  '  <YTag tone="info">Selected: {{ selectedDate }}</YTag>',
  '</div>'
].join('\n')

const disabledCode = [
  '<div class="demo-stack">',
  '  <YCalendar',
  '    v-model="sprintDate"',
  '    :today="fixedToday"',
  '    :disabled-date="disableWeekends"',
  '  />',
  '  <YTag tone="warning">Weekends are disabled</YTag>',
  '</div>'
].join('\n')

const dateCellCode = [
  '<YCalendar v-model="releaseDate" :today="fixedToday">',
  '  <template #dateCell="{ cell }">',
  '    <span>{{ cell.day }}</span>',
  '    <small v-if="releaseDays.has(cell.value)">Release</small>',
  '  </template>',
  '</YCalendar>'
].join('\n')
</script>

# Calendar

Calendar 用于展示一个月内的日期选择、档期查看或轻量日程入口。Yok UI 的实现参考 Element Plus 的受控月历、范围/禁用日期思路，以及 Ant Design Calendar 的月视图和日期格定制能力，先提供更适合文档和后台场景的轻量基础版本。

::: tip TIP
`YCalendar` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic calendar {#calendar-basic-calendar}

<DocDemo
  id="demo-basic-calendar"
  title="Basic calendar"
  description="使用 YYYY-MM-DD 字符串作为选中值，方便和表单、路由查询参数和接口字段保持一致。"
  :code="basicCode"
  :setup="calendarSetup"
  :usage="['v-model date string', 'today baseline', 'selected state']"
>
  <div class="demo-stack">
    <YCalendar v-model="selectedDate" :today="fixedToday" />
    <YTag tone="info">Selected: {{ selectedDate }}</YTag>
  </div>
</DocDemo>

## Disabled dates {#calendar-disabled-dates}

<DocDemo
  id="demo-disabled-dates"
  title="Disabled dates"
  description="disabledDate 用于禁用周末、不可预约日期或服务不可用日期，禁用格会使用原生 disabled。"
  :code="disabledCode"
  :setup="calendarSetup"
  :usage="['disabledDate(date)', 'native disabled', 'availability rules']"
>
  <div class="demo-stack">
    <YCalendar
      v-model="sprintDate"
      :today="fixedToday"
      :disabled-date="disableWeekends"
    />
    <YTag tone="warning">Weekends are disabled</YTag>
  </div>
</DocDemo>

## Date cell {#calendar-date-cell}

<DocDemo
  id="demo-date-cell"
  title="Date cell"
  description="dateCell slot 适合展示轻量标记、发布日期或状态点；复杂日程详情应进入抽屉或详情页。"
  :code="dateCellCode"
  :setup="calendarSetup"
  :usage="['dateCell slot', 'cell.value', 'release markers']"
>
  <YCalendar v-model="releaseDate" :today="fixedToday">
    <template #dateCell="{ cell }">
      <span>{{ cell.day }}</span>
      <small v-if="releaseDays.has(cell.value)">Release</small>
    </template>
  </YCalendar>
</DocDemo>

## Usage Notes {#calendar-usage-notes}

- `modelValue` 使用 `YYYY-MM-DD` 字符串，方便和表单、路由查询参数和后端接口保持一致。
- `panel-change` 只表示当前显示月份变化，不会自动修改选中日期。
- `dateCell` 适合展示少量标记；复杂日程列表应跳转到单独的日程页或抽屉详情。

## Calendar API {#calendar-api}

<ComponentApiSection name="YCalendar" />

## Accessibility {#accessibility}

- 日历主体使用 `role="grid"`，星期头使用 `role="columnheader"`。
- 日期格使用原生 `button`，可通过 Tab 聚焦，Enter 或 Space 触发选择。
- 选中日期同步 `aria-selected` 和 `aria-pressed`，禁用日期使用原生 `disabled`。
