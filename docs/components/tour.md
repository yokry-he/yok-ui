<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
const current = ref(0)
const tourSteps = [
  {
    title: 'Search docs',
    description: 'Use search to jump to components, guides and examples.',
    target: '#tour-doc-search'
  },
  {
    title: 'Open Playground',
    description: 'Edit the current example, copy source and export a reproduction bundle.',
    target: '#tour-doc-playground'
  },
  {
    title: 'Ship evidence',
    description: 'Verify API coverage, keyboard notes and docs build before release.',
    target: '#tour-doc-ship'
  }
]
const setup = `import { ref } from 'vue'
import { YButton, YTour } from '@yok-ui/core'

const open = ref(true)
const current = ref(0)
const tourSteps = ${JSON.stringify(tourSteps, null, 2)}`
const code = `<YTour
  v-model:open="open"
  :steps="tourSteps"
  :current="current"
  skip-text="Skip guide"
/>`
</script>

# Tour

Tour 用于产品引导、功能发现和逐步新手教程。它参考主流组件库的产品引导模式：用弹层解释当前步骤，用目标高亮把说明绑定到真实界面元素。

## Example

<DocDemo
  title="Product guidance"
  description="适合首次进入页面、重大功能发布或复杂工作台的分步说明。"
  :code="code"
  :setup="setup"
  :usage="['controlled open', 'target spotlight', 'finish event']"
>
  <div class="demo-stack">
    <div class="demo-row">
      <YButton id="tour-doc-search" variant="secondary">Search docs</YButton>
      <YButton id="tour-doc-playground" variant="primary">Open Playground</YButton>
      <YButton id="tour-doc-ship" variant="secondary">Ship evidence</YButton>
    </div>
    <YTour
      v-model:open="open"
      :steps="tourSteps"
      :current="current"
      skip-text="Skip guide"
      @update:current="(index) => current = index"
    />
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="tour"
  title="在线编辑 Tour 示例"
  description="验证基础引导、目标高亮、受控步骤、完成关闭、移动端和键盘关闭路径。"
/>

## Usage notes

- `steps` 是数据源，`target` 可以传 CSS 选择器或 HTMLElement。
- `open` 和 `current` 都保持受控，适合接入路由状态、用户偏好和埋点。
- 最后一步点击完成时会触发 `finish`，同时请求 `update:open=false`。
- Tour 用于短流程引导，不适合替代复杂表单、Modal 或整页帮助中心。

## API

<ComponentApiSection name="YTour" />

## Accessibility

- Tour 面板使用 `role="dialog"` 和 `aria-modal="true"`，标题作为可访问名称。
- 打开后通过统一弹层能力进行焦点锁定、滚动锁定和 Escape 关闭。
- 高亮目标只作为视觉说明，`spotlight` 使用 `aria-hidden`，不会新增焦点停留点。
- 上一步、下一步、完成和跳过都是原生按钮，可用 Enter / Space 操作。
