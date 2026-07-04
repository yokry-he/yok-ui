<script setup lang="ts">

const setup = `import { YButton, YTooltip } from '@yok-ui/core'`

const code = `<template>
  <YTooltip content="Create a new component file">
    <YButton variant="primary">Create</YButton>
  </YTooltip>
  <YTooltip content="Copy install command" placement="bottom" :show-delay="240">
    <YButton variant="secondary">Copy</YButton>
  </YTooltip>
  <YTooltip content="Click again to close" trigger="click" placement="right" open>
    <YButton variant="secondary">Click trigger</YButton>
  </YTooltip>
  <YTooltip content="Light theme for dense settings" theme="light" placement="left-start" :hide-delay="80">
    <YButton variant="secondary">Light</YButton>
  </YTooltip>
</template>`
</script>

# Tooltip

Tooltip 用于给按钮、图标或短文本补充说明。它只承载短说明，需要可交互内容时请使用 `YPopover`。

## Example

<DocDemo
  title="Short explanation"
  description="Tooltip 会把 aria-describedby 自动关联到默认插槽里的第一个触发元素。"
  :code="code"
  :setup="setup"
  :usage="['hover', 'focus-within', 'aria-describedby']"
>
  <div class="demo-row">
    <YTooltip content="Create a new component file">
      <YButton variant="primary">Create</YButton>
    </YTooltip>
    <YTooltip content="Copy install command" placement="bottom" :show-delay="240">
      <YButton variant="secondary">Copy</YButton>
    </YTooltip>
    <YTooltip content="Click again to close" trigger="click" placement="right" open>
      <YButton variant="secondary">Click trigger</YButton>
    </YTooltip>
    <YTooltip content="Light theme for dense settings" theme="light" placement="left-start" :hide-delay="80">
      <YButton variant="secondary">Light</YButton>
    </YTooltip>
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="tooltip"
  title="在线编辑 Tooltip 示例"
  description="试验 hover/focus、点击触发、浅色主题、禁用、错误说明、位置和延迟，确认短说明不会干扰主操作。"
/>

## Usage notes

- Tooltip 只放短文本，不承载按钮、表单或链接；需要交互内容时使用 `YPopover`。
- 文案应补充触发元素的目的、限制或快捷键，不重复按钮本身的文字。
- 错误说明必须补充页面上可见的错误状态，不能成为唯一的错误反馈。
- 禁用控件需要说明原因时，优先把 Tooltip 绑定到可聚焦的相邻帮助入口或包装元素。
- 方位支持 top / bottom / left / right 及 start / end 对齐；选择时以不遮挡触发元素和主要阅读路径为准。
- `trigger="click"` 适合密集工具栏中的短说明；需要完全由业务状态控制时使用 `trigger="manual"` 和 `open`。
- `theme="light"` 适合浅色设置项、表格操作列或密集工具条，但仍应保持边框和阴影，避免和页面内容混在一起。

## API

<ComponentApiSection name="YTooltip" />

## Accessibility

- 自动生成稳定 tooltip id。
- 合并触发元素已有的 `aria-describedby`，不覆盖原有描述关系。
- `disabled` 会关闭触发行为并停止写入 `aria-describedby`，避免禁用说明误导辅助技术。
- 触发元素建议使用原生 `button`、`a` 或可聚焦表单控件。
- 键盘用户应能通过聚焦触发元素获得同等说明，且离开触发区域后提示应消失。
