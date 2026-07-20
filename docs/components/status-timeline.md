<script setup lang="ts">
import type { YStatusTimelineItem } from '@yok-ui/admin'

const releaseSteps: YStatusTimelineItem[] = [
  {
    title: 'Created',
    value: 'created',
    description: 'Component proposal and API sketch were created.',
    time: '09:12',
    actor: 'Yok',
    tone: 'success',
    status: 'Done'
  },
  {
    title: 'Design review',
    value: 'review',
    description: 'Visual density, keyboard behavior, and docs example are being reviewed.',
    time: '10:30',
    actor: 'Design system',
    tone: 'warning',
    status: 'Active'
  },
  {
    title: 'Release',
    value: 'release',
    description: 'Ship after tests, docs build, and package declarations pass.',
    time: 'Next',
    actor: 'Maintainer',
    status: 'Pending',
    disabled: true
  }
]

const statusTimelineSetup = [
  "import { YButton } from '@yok-ui/core'",
  "import { YStatusTimeline, type YStatusTimelineItem } from '@yok-ui/admin'",
  '',
  'const releaseSteps: YStatusTimelineItem[] = [',
  '  {',
  "    title: 'Created',",
  "    value: 'created',",
  "    description: 'Component proposal and API sketch were created.',",
  "    time: '09:12',",
  "    actor: 'Yok',",
  "    tone: 'success',",
  "    status: 'Done'",
  '  },',
  '  {',
  "    title: 'Design review',",
  "    value: 'review',",
  "    description: 'Visual density, keyboard behavior, and docs example are being reviewed.',",
  "    time: '10:30',",
  "    actor: 'Design system',",
  "    tone: 'warning',",
  "    status: 'Active'",
  '  },',
  '  {',
  "    title: 'Release',",
  "    value: 'release',",
  "    description: 'Ship after tests, docs build, and package declarations pass.',",
  "    time: 'Next',",
  "    actor: 'Maintainer',",
  "    status: 'Pending',",
  '    disabled: true',
  '  }',
  ']'
].join('\n')

const workflowCode = [
  '<YStatusTimeline',
  '  active-value="review"',
  '  aria-label="Component release workflow"',
  '  :items="releaseSteps"',
  '>',
  '  <template #actions="{ item }">',
  '    <YButton v-if="item.value === \'review\'" size="sm" variant="ghost">Open review</YButton>',
  '  </template>',
  '</YStatusTimeline>'
].join('\n')

const compactCode = [
  '<YStatusTimeline',
  '  reverse',
  '  size="sm"',
  '  active-value="review"',
  '  aria-label="Compact release workflow"',
  '  :items="releaseSteps"',
  '/>'
].join('\n')
</script>

# Status Timeline

Status Timeline 用于后台流程记录、审核节点、发布状态和订单处理。它参考主流组件库的 Timeline / Steps / Activity Log 模式，但更偏“业务状态流”，适合放在 `YCrudLayout` 的侧栏、详情页或审核抽屉里。

::: tip TIP
`YStatusTimeline` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Release workflow {#status-timeline-release-workflow}

<DocDemo
  title="Release workflow"
  description="业务状态流适合审核节点、发布状态和订单处理，当前节点通过 aria-current 暴露。"
  :code="workflowCode"
  :setup="statusTimelineSetup"
  :usage="['activeValue', 'actions slot', 'aria-current']"
>
  <YStatusTimeline
    active-value="review"
    aria-label="Component release workflow"
    :items="releaseSteps"
  >
    <template #actions="{ item }">
      <YButton v-if="item.value === 'review'" size="sm" variant="ghost">Open review</YButton>
    </template>
  </YStatusTimeline>
</DocDemo>

## Compact reverse {#status-timeline-compact-reverse}

<DocDemo
  title="Compact reverse"
  description="倒序适合审计日志和最新状态优先的侧栏，小尺寸适合详情页抽屉。"
  :code="compactCode"
  :setup="statusTimelineSetup"
  :usage="['reverse', 'size=sm', 'drawer']"
>
  <YStatusTimeline
    reverse
    size="sm"
    active-value="review"
    aria-label="Compact release workflow"
    :items="releaseSteps"
  />
</DocDemo>

## Status Timeline API {#status-timeline-api}

<ComponentApiSection name="YStatusTimeline" />

## Accessibility {#accessibility}

- 外层使用具名 `section`，内部使用 `ol` / `li` 保留有序流程语义。
- 当前节点通过 `aria-current="step"` 暴露给辅助技术。
- 节点操作区不改变按钮语义，直接使用原生 button 或 Yok UI button。
- `reverse` 只改变展示顺序，业务层仍应提供清晰的 `time` 和 `status` 文案。
