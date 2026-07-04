<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const setup = [
  "import { ref } from 'vue'",
  "import { YButton, YInput, YModal } from '@yok-ui/core'",
  '',
  'const open = ref(false)'
].join('\n')
const code = `<YButton variant="primary" @click="open = true">Open modal</YButton>
<YModal
  :open="open"
  title="Create component"
  description="Name the component and choose its package."
  @close="open = false"
>
  <YInput label="Component name" placeholder="YCard" />
  <template #footer>
    <YButton variant="secondary" @click="open = false">Cancel</YButton>
    <YButton variant="primary" @click="open = false">Create</YButton>
  </template>
</YModal>`
</script>

# Modal

Modal 用于需要用户注意的短流程，例如创建组件、确认操作、展示详情。

## Example

<DocDemo
  title="Create flow"
  description="Modal 提供遮罩关闭、Escape 关闭、焦点进入弹窗、Tab 焦点循环和关闭后焦点返回。"
  :code="code"
  :setup="setup"
  :usage="['dialog', 'focus trap', 'footer slot']"
>
  <YButton variant="primary" @click="open = true">Open modal</YButton>
  <YModal
    :open="open"
    title="Create component"
    description="Name the component and choose its package."
    @close="open = false"
  >
    <YInput label="Component name" placeholder="YCard" />
    <template #footer>
      <YButton variant="secondary" @click="open = false">Cancel</YButton>
      <YButton variant="primary" @click="open = false">Create</YButton>
    </template>
  </YModal>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="modal"
  title="在线编辑 Modal 示例"
  description="运行器用局部预览壳展示 Modal 结构，可切换确认、危险操作、表单复核、移动弹窗和键盘焦点场景。"
/>

## Usage notes

- Modal 适合必须打断当前流程的短任务；复杂编辑页应优先考虑 Drawer 或独立页面。
- 移动弹窗场景应控制标题和正文长度，保证底部操作在窄屏下仍可见、可点、不会挤压主体内容。
- 危险操作应避免遮罩误触关闭，并使用明确的按钮文案让用户理解后果。
- 键盘焦点场景应验证 Tab / Shift + Tab 保持在弹窗内，`Escape` 可以关闭弹窗，并在关闭后把焦点还给触发入口。

## API

<ComponentApiSection name="YModal" />

## Accessibility

- 使用 `role="dialog"` 和 `aria-modal="true"` 暴露弹窗语义。
- 打开后聚焦第一个可聚焦控件。
- 使用 Tab / Shift + Tab 时焦点保持在弹窗内。
- `title` 和 `description` 应提供可访问名称与说明；自定义标题区域也必须保留可被辅助技术读取的标题。
- 关闭按钮、取消按钮和确认按钮都应可通过键盘到达。
