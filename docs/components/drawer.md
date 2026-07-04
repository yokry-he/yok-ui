<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const setup = [
  "import { ref } from 'vue'",
  "import { YButton, YDrawer, YInput, YMessage } from '@yok-ui/core'",
  '',
  'const open = ref(false)'
].join('\n')
const code = `<YButton variant="primary" @click="open = true">Open drawer</YButton>
<YDrawer
  :open="open"
  title="Package settings"
  description="Adjust package level preferences without leaving the page."
  @close="open = false"
>
  <div>
    <YInput label="Package name" model-value="Core" />
    <YMessage tone="success" title="Ready">Drawer shares the same overlay language as Modal.</YMessage>
  </div>
  <template #footer>
    <YButton variant="ghost" @click="open = false">Cancel</YButton>
    <YButton variant="primary" @click="open = false">Save</YButton>
  </template>
</YDrawer>`
</script>

# Drawer

Drawer 用于侧边任务流，例如编辑设置、查看详情、筛选条件。相比 Modal，它更适合保留页面上下文。

## Example

<DocDemo
  title="Side task"
  description="适合设置、详情和筛选，不打断用户对当前页面的空间感。"
  :code="code"
  :setup="setup"
  :usage="['side panel', 'focus trap', 'footer slot']"
>
  <YButton variant="primary" @click="open = true">Open drawer</YButton>
  <YDrawer
    :open="open"
    title="Package settings"
    description="Adjust package level preferences without leaving the page."
    @close="open = false"
  >
    <div class="demo-stack">
      <YInput label="Package name" model-value="Core" />
      <YMessage tone="success" title="Ready">Drawer shares the same overlay language as Modal.</YMessage>
    </div>
    <template #footer>
      <YButton variant="ghost" @click="open = false">Cancel</YButton>
      <YButton variant="primary" @click="open = false">Save</YButton>
    </template>
  </YDrawer>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="drawer"
  title="在线编辑 Drawer 示例"
  description="运行器会把 Drawer 渲染成局部侧边预览，可切换配置、详情、移动导航和键盘关闭场景。"
/>

## Usage notes

- 桌面端 Drawer 适合承载筛选、详情、设置和次级编辑，不应替代主流程页面。
- 移动导航场景应使用左侧抽屉承载导航，避免把桌面侧边栏直接堆到首屏核心内容上方。
- 键盘关闭场景应验证显式关闭按钮可聚焦，`Escape` 可以关闭弹层，并在关闭后把焦点还给触发入口。
- 高风险流程可以禁用遮罩点击关闭，保留明确按钮和 `Escape` 作为可预期的关闭路径。

## API

<ComponentApiSection name="YDrawer" />

## Accessibility

- Drawer 打开后应聚焦到弹层上下文，并在关闭时回到触发元素。
- `title` 和 `description` 用于建立弹层可访问名称与说明。
- `Escape` 和显式关闭按钮都应可关闭弹层；危险操作应放在 footer 中并保留确认文案。
