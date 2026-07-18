<script setup lang="ts">
import type { YTimelineItem } from '@yok-ui/core'

const events: YTimelineItem[] = [
  {
    title: 'Component created',
    value: 'created',
    description: 'The first proposal and API draft were created.',
    time: '09:12',
    tone: 'success'
  },
  {
    title: 'Design reviewed',
    value: 'reviewed',
    description: 'Spacing, accessibility and docs examples were checked.',
    time: '10:30',
    tone: 'warning'
  },
  {
    title: 'Documentation published',
    value: 'published',
    description: 'The component page is now available in the docs site.',
    time: '12:00',
    tone: 'info'
  }
]

const timelineSetup = [
  "import { YButton, YTag, YTimeline, type YTimelineItem } from '@yok-ui/core'",
  '',
  'const events: YTimelineItem[] = [',
  '  {',
  "    title: 'Component created',",
  "    value: 'created',",
  "    description: 'The first proposal and API draft were created.',",
  "    time: '09:12',",
  "    tone: 'success'",
  '  },',
  '  {',
  "    title: 'Design reviewed',",
  "    value: 'reviewed',",
  "    description: 'Spacing, accessibility and docs examples were checked.',",
  "    time: '10:30',",
  "    tone: 'warning'",
  '  },',
  '  {',
  "    title: 'Documentation published',",
  "    value: 'published',",
  "    description: 'The component page is now available in the docs site.',",
  "    time: '12:00',",
  "    tone: 'info'",
  '  }',
  ']'
].join('\n')

const basicCode = [
  '<YTimeline',
  '  title="Release activity"',
  '  description="Track component work from draft to documentation."',
  '  :items="events"',
  '/>'
].join('\n')

const alternateCode = [
  '<YTimeline',
  '  placement="alternate"',
  '  title="Alternating story"',
  '  description="Useful for release notes or brand storytelling."',
  '  :items="events"',
  '>',
  '  <template #actions="{ item }">',
  '    <YButton v-if="item.value === \'reviewed\'" size="sm" variant="ghost">Open notes</YButton>',
  '  </template>',
  '</YTimeline>'
].join('\n')

const customDotCode = [
  '<YTimeline size="sm" :items="events">',
  '  <template #dot="{ index }">{{ index + 1 }}</template>',
  '  <template #item="{ item }">',
  '    <YTag v-if="item.tone" :tone="item.tone">{{ item.tone }}</YTag>',
  '  </template>',
  '</YTimeline>'
].join('\n')
</script>

# Timeline

Timeline 用于展示按时间排序的事件、日志、版本记录、订单轨迹或活动流。它是通用 Core 组件，适合产品、后台和品牌页面复用；更偏审核决策的业务流程可以使用 Admin 包的 `YReviewWorkflow`。

::: tip TIP
`YTimeline` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Release activity {#timeline-release-activity}

<DocDemo
  title="Release activity"
  description="基础时间线适合发布记录、审计日志和活动流，使用 ol/li 表达顺序。"
  :code="basicCode"
  :setup="timelineSetup"
  :usage="['ordered events', 'time', 'tone']"
>
  <YTimeline
    title="Release activity"
    description="Track component work from draft to documentation."
    :items="events"
  />
</DocDemo>

## Alternate {#timeline-alternate}

<DocDemo
  title="Alternate placement"
  description="交替布局适合发布故事或品牌叙事；节点操作使用 actions 插槽承载真实按钮。"
  :code="alternateCode"
  :setup="timelineSetup"
  :usage="['alternate', 'actions slot', 'button']"
>
  <YTimeline
    placement="alternate"
    title="Alternating story"
    description="Useful for release notes or brand storytelling."
    :items="events"
  >
    <template #actions="{ item }">
      <YButton v-if="item.value === 'reviewed'" size="sm" variant="ghost">Open notes</YButton>
    </template>
  </YTimeline>
</DocDemo>

## Custom Dot {#timeline-custom-dot}

<DocDemo
  title="Custom dot"
  description="自定义 dot 可增强视觉节奏，但关键状态仍应在文本中表达。"
  :code="customDotCode"
  :setup="timelineSetup"
  :usage="['dot slot', 'item slot', 'small size']"
>
  <YTimeline size="sm" :items="events">
    <template #dot="{ index }">{{ index + 1 }}</template>
    <template #item="{ item }">
      <YTag v-if="item.tone" :tone="item.tone">{{ item.tone }}</YTag>
    </template>
  </YTimeline>
</DocDemo>

## Timeline API {#timeline-api}

<ComponentApiSection name="YTimeline" />

## Accessibility {#accessibility}

- 外层使用具名 `section`。
- 节点列表使用 `ol` / `li` 表达有序事件流。
- 时间文本使用原生 `time` 元素。
- `loading` 节点会通过 `aria-busy` 表达当前事件仍在进行。
- `disabled` 节点会通过 `aria-disabled` 表达不可用或未完成状态。
- 自定义 `dot` 插槽默认仍作为装饰性轴线的一部分，不应承载唯一重要信息。

## Usage notes {#timeline-usage-notes}

- 参考 Ant Design Timeline 的组织方式，Timeline 应覆盖基础时间线、倒序、交替布局、加载尾项、移动端和语义结构。
- 时间线适合表达“时间顺序”或“流程顺序”；如果只是同级步骤导航，应使用 `YSteps`。
- 活动流和审计日志常用 `reverse` 让最新事件优先；发布故事和品牌叙事可以使用 `placement="alternate"`。
- 异步任务还在进行时，将最后一个节点标记为 `loading`，并把标题写成明确的进行中状态。
- 移动端优先使用 `size="sm"` 和默认单侧布局，避免交替布局在窄屏中造成阅读跳跃。
- 节点内有操作时，使用 `actions` 插槽放真实按钮，保持键盘用户能按顺序进入每个事件操作。
