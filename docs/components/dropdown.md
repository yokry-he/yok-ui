<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const selected = ref('No action yet')
const items = [
  { label: 'Edit component', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Delete', value: 'delete' }
]

const batchItems = [
  { label: 'Select all rows', value: 'select-all' },
  { label: 'Mark as reviewed', value: 'reviewed' },
  { label: 'Export selected', value: 'export' }
]

const dropdownSetup = [
  "import { ref } from 'vue'",
  "import { YDropdown, YTag } from '@yok-ui/core'",
  '',
  'const open = ref(false)',
  "const selected = ref('No action yet')",
  'const items = [',
  "  { label: 'Edit component', value: 'edit' },",
  "  { label: 'Duplicate', value: 'duplicate' },",
  "  { label: 'Delete', value: 'delete' }",
  ']',
  '',
  'const batchItems = [',
  "  { label: 'Select all rows', value: 'select-all' },",
  "  { label: 'Mark as reviewed', value: 'reviewed' },",
  "  { label: 'Export selected', value: 'export' }",
  ']'
].join('\n')

const basicCode = [
  '<div class="demo-row">',
  '  <YDropdown',
  '    v-model:open="open"',
  '    label="Actions"',
  '    :items="items"',
  '    @select="selected = $event.label"',
  '  />',
  '  <YTag tone="info">{{ selected }}</YTag>',
  '</div>'
].join('\n')

const hoverCode = [
  '<div class="demo-row">',
  '  <YDropdown',
  '    open',
  '    label="Hover actions"',
  '    trigger="hover"',
  '    placement="top-start"',
  '    :items="items"',
  '  />',
  '  <YDropdown',
  '    open',
  '    label="Sticky menu"',
  '    :hide-on-click="false"',
  '    :items="batchItems"',
  '  />',
  '</div>'
].join('\n')

const disabledCode = [
  '<YDropdown',
  '  disabled',
  '  label="Locked actions"',
  '  :items="items"',
  '/>'
].join('\n')
</script>

# Dropdown

Dropdown 用于承载一组轻量操作。它比直接铺开按钮更节省空间，适合表格行操作、工具栏和卡片右上角菜单。

::: tip TIP
`YDropdown` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic actions {#dropdown-basic-actions}

<DocDemo
  title="Basic actions"
  description="基础菜单适合表格行、卡片和工具栏的轻量操作；select 事件返回完整菜单项。"
  :code="basicCode"
  :setup="dropdownSetup"
  :usage="['v-model:open', 'select', 'menu']"
>
  <div class="demo-row">
    <YDropdown
      v-model:open="open"
      label="Actions"
      :items="items"
      @select="selected = $event.label"
    />
    <YTag tone="info">{{ selected }}</YTag>
  </div>
</DocDemo>

## Hover and sticky menus {#dropdown-hover-and-sticky-menus}

<DocDemo
  title="Hover and sticky menus"
  description="hover 菜单适合轻量工具栏，hideOnClick=false 适合连续选择多项。"
  :code="hoverCode"
  :setup="dropdownSetup"
  :usage="['hover', 'placement', 'hideOnClick']"
>
  <div class="demo-row">
    <YDropdown
      open
      label="Hover actions"
      trigger="hover"
      placement="top-start"
      :items="items"
    />
    <YDropdown
      open
      label="Sticky menu"
      :hide-on-click="false"
      :items="batchItems"
    />
  </div>
</DocDemo>

## Disabled actions {#dropdown-disabled-actions}

<DocDemo
  title="Disabled actions"
  description="整组操作不可用时禁用触发器，而不是暴露一个无法执行的菜单。"
  :code="disabledCode"
  :setup="dropdownSetup"
  :usage="['disabled', 'aria-disabled', 'locked action']"
>
  <YDropdown
    disabled
    label="Locked actions"
    :items="items"
  />
</DocDemo>

## Usage notes {#dropdown-usage-notes}

- Dropdown 适合承载同一对象的一组轻量命令，不适合放复杂表单或长内容。
- 表格行、卡片右上角和工具栏末端优先验证 `placement="bottom-end"` 或 `align="end"`，避免菜单溢出视口。
- 常规菜单优先使用 `trigger="click"`；仅在工具栏、状态标签旁或轻量预览场景使用 `trigger="hover"`。
- 需要连续选择多项时使用 `:hide-on-click="false"`，否则选择后保持默认自动关闭。
- 整组操作不可用时使用 `disabled` 禁用触发器，而不是只禁用每个菜单项。
- 危险操作可以保留在菜单内，但应在条件不足时禁用，并通过旁边的说明或状态提示解释原因。
- 常用动作不要全部藏进 Dropdown；高频主操作应保留为可见按钮。
- 菜单项文案使用动词开头，并保持同一组菜单的语气和粒度一致。

## Dropdown API {#dropdown-api}

<ComponentApiSection name="YDropdown" />

## Accessibility {#accessibility}

- 触发器使用 `aria-haspopup="menu"`、`aria-expanded` 和 `aria-controls`。
- 禁用触发器会设置 `aria-disabled`，并移除菜单关联，避免辅助技术误读为可展开入口。
- 菜单项使用 `role="menuitem"`，禁用项不会参与键盘移动。
- 触发器聚焦时，`Enter`、`Space`、`ArrowDown` 会打开菜单并聚焦第一个可用项。
- `ArrowUp` 打开菜单时会聚焦最后一个可用项。
- 菜单展开后支持 `ArrowUp` / `ArrowDown` 循环移动，`Home` / `End` 跳到首尾。
- `Escape` 和外部点击默认会关闭菜单，并把焦点返回触发器；可通过关闭策略 props 调整。
