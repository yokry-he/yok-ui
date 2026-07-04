<script setup lang="ts">
const actions = [
  { key: 'create', label: 'Create component', icon: '+', type: 'primary' },
  { key: 'docs', label: 'Open docs', icon: '?' },
  { key: 'feedback', label: 'Send feedback', icon: '!' }
]

const setup = `import { YFloatButton, YFloatButtonGroup } from '@yok-ui/core'

const actions = ${JSON.stringify(actions, null, 2)}`

const singleCode = `<YFloatButton
  label="Create component"
  tooltip="Create"
  type="primary"
  icon="+"
  :right="96"
  :bottom="24"
/>`

const groupCode = `<YFloatButtonGroup
  label="Quick actions"
  :items="actions"
  :open="true"
  shape="square"
  icon="..."
/>`
</script>

# Float Button

Float Button 用于页面级快捷操作。它适合“创建、反馈、返回顶部、打开快捷动作”等高频但不属于主内容流的动作，参考 Ant Design FloatButton、NG-ZORRO FloatButton 和 Material FAB 的使用方式，同时保持 Yok UI 的清爽可爱视觉和可访问性约定。

## Example

<DocDemo
  title="Page shortcut"
  description="单个浮动按钮用于页面级主快捷动作；避免在同一页面放置多个同等优先级的固定操作。"
  :code="singleCode"
  :setup="setup"
  :usage="['fixed action', 'aria-label', 'safe placement']"
>
  <div class="docs-panel">
    <p class="docs-eyebrow">demo note</p>
    <h2>固定在页面右下角的快捷入口</h2>
    <p>文档示例中按钮会固定到视口右下角。真实产品中应为它保留安全边距，避免遮挡表单提交栏、底部导航和聊天入口。</p>
    <YFloatButton label="Create component" tooltip="Create" type="primary" icon="+" :right="96" :bottom="24" />
  </div>
</DocDemo>

<DocDemo
  title="Action group"
  description="按钮组用于收纳多个低频快捷动作，触发器同步 aria-expanded，展开内容使用 menu/menuitem 语义。"
  :code="groupCode"
  :setup="setup"
  :usage="['controlled open', 'menu semantics', 'quick actions']"
>
  <div class="docs-panel">
    <p class="docs-eyebrow">demo note</p>
    <h2>将次级动作收进浮动菜单</h2>
    <p>动作组适合将反馈、文档、创建等页面级操作收进一个入口。示例保持展开，便于检查菜单项和键盘路径。</p>
    <YFloatButtonGroup label="Quick actions" :items="actions" :open="true" shape="square" icon="..." />
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="floatButton"
  title="在线编辑 Float Button 示例"
  description="调试单按钮、动作组、禁用项、移动安全区和键盘操作路径。"
/>

## API

<ComponentApiSection name="YFloatButton" />

<ComponentApiSection name="YFloatButtonGroup" />

## Accessibility

- `YFloatButton` 使用原生 `button`，必须提供 `label` 作为 `aria-label`。
- `YFloatButtonGroup` 触发器同步 `aria-haspopup="menu"` 和 `aria-expanded`。
- 展开后的动作区使用 `role="menu"`，动作项使用原生 button + `role="menuitem"`。
- 固定定位按钮可能遮挡页面内容；业务侧应结合 `right`、`bottom` 和移动端安全区预留空间。
