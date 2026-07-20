<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

const popoverSetup = [
  "import { ref } from 'vue'",
  "import { YButton, YPopover, YTag } from '@yok-ui/core'",
  '',
  'const open = ref(false)'
].join('\n')

const clickCode = [
  '<YPopover',
  '  v-model:open="open"',
  '  title="Release note"',
  '  content="Table, Pagination, FormItem and Popover are now part of Core."',
  '>',
  '  <template #trigger>',
  '    <YButton variant="secondary">Open popover</YButton>',
  '  </template>',
  '  <YTag tone="success">Fresh cute and practical</YTag>',
  '</YPopover>',
  '<p class="demo-note">Open: {{ open ? \'yes\' : \'no\' }}</p>'
].join('\n')

const hoverCode = [
  '<YPopover',
  '  trigger="hover"',
  '  placement="right-start"',
  '  title="Hover details"',
  '  content="Hover and focus can reveal compact guidance."',
  '  :show-delay="120"',
  '  :hide-delay="80"',
  '>',
  '  <template #trigger>',
  '    <YButton variant="primary">Hover guidance</YButton>',
  '  </template>',
  '  <YTag tone="info">right-start placement</YTag>',
  '</YPopover>'
].join('\n')

const disabledCode = [
  '<YPopover',
  '  disabled',
  '  title="Unavailable"',
  '  content="This popover is disabled until the workflow is ready."',
  '>',
  '  <template #trigger>',
  '    <YButton variant="secondary">Disabled popover</YButton>',
  '  </template>',
  '</YPopover>'
].join('\n')
</script>

# Popover

Popover 用于点击后展示较短的补充内容、操作说明或轻量预览。它比 Tooltip 更适合承载多行内容或按钮。

::: tip TIP
`YPopover` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Controlled popover {#popover-controlled-popover}

<DocDemo
  title="Controlled popover"
  description="点击触发适合发布说明、字段解释和轻量预览；v-model:open 可把打开状态交给业务控制。"
  :code="clickCode"
  :setup="popoverSetup"
  :usage="['v-model:open', 'trigger slot', 'dialog']"
>
  <YPopover
    v-model:open="open"
    title="Release note"
    content="Table, Pagination, FormItem and Popover are now part of Core."
  >
    <template #trigger>
      <YButton variant="secondary">Open popover</YButton>
    </template>
    <YTag tone="success">Fresh cute and practical</YTag>
  </YPopover>
  <p class="demo-note">Open: {{ open ? 'yes' : 'no' }}</p>
</DocDemo>

## Hover placement {#popover-hover-placement}

<DocDemo
  title="Hover placement"
  description="hover 场景适合非阻断说明，placement 与 delay 用于减少闪烁并避免遮挡。"
  :code="hoverCode"
  :setup="popoverSetup"
  :usage="['hover', 'placement', 'delay']"
>
  <YPopover
    trigger="hover"
    placement="right-start"
    title="Hover details"
    content="Hover and focus can reveal compact guidance."
    :show-delay="120"
    :hide-delay="80"
  >
    <template #trigger>
      <YButton variant="primary">Hover guidance</YButton>
    </template>
    <YTag tone="info">right-start placement</YTag>
  </YPopover>
</DocDemo>

## Disabled trigger {#popover-disabled-trigger}

<DocDemo
  title="Disabled trigger"
  description="流程未满足时禁用触发器，避免暴露一个不可执行的浮层关系。"
  :code="disabledCode"
  :setup="popoverSetup"
  :usage="['disabled', 'aria-disabled', 'no panel']"
>
  <YPopover
    disabled
    title="Unavailable"
    content="This popover is disabled until the workflow is ready."
  >
    <template #trigger>
      <YButton variant="secondary">Disabled popover</YButton>
    </template>
  </YPopover>
</DocDemo>

## Usage notes {#popover-usage-notes}

- Popover 适合承载比 Tooltip 更长的补充信息，也可以放入少量操作，但不应承载复杂表单或关键阻断流程。
- `placement` 支持四个方向和 `start/end` 对齐，例如 `right-start` 适合表格行操作说明。
- `trigger` 支持 `click`、`hover`、`focus` 和 `manual`；需要完全由外部控制时使用 `manual` 配合 `v-model:open`。
- `showDelay` / `hideDelay` 适合 hover 场景，避免鼠标快速经过时闪烁。
- 位置选择应优先保证触发器和弹层内容都可见；移动避让场景建议使用较短文案和 `bottom` 方向。
- `disabled` 会关闭触发行为，适合在流程未满足前保留说明入口但不展示浮层。
- 确认提示应保持文案短而明确，避免把复杂危险操作塞进轻量浮层。
- 键盘触发场景应验证 Enter / Space 打开弹层，`Escape` 关闭弹层，并让焦点保持在触发器上。

## Popover API {#popover-api}

<ComponentApiSection name="YPopover" />

## Accessibility {#accessibility}

- 触发器使用 `role="button"`、`aria-expanded` 和 `aria-controls` 关联面板。
- 面板使用 `role="dialog"`，并通过 `title` 或默认文案提供可访问名称。
- 触发器支持点击、Enter、Space 开关；hover 模式也会响应键盘 focus。
- `Escape` 会关闭面板并保持焦点在触发器上。
- 禁用状态会设置 `aria-disabled` 并移除 `aria-controls`，避免辅助技术误判可打开关系。
