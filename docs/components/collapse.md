<script setup lang="ts">
import { ref } from 'vue'

const active = ref(['usage'])
const items = [
  { label: 'Usage', value: 'usage', content: 'Use Collapse to group long settings or FAQ content.' },
  { label: 'API', value: 'api', content: 'Use modelValue to control opened panels.' },
  { label: 'Disabled', value: 'disabled', content: 'This panel is disabled.', disabled: true }
]

const code = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  '',
  "const active = ref(['usage'])",
  'const items = [',
  "  { label: 'Usage', value: 'usage', content: 'Use it for grouped content.' },",
  "  { label: 'API', value: 'api', content: 'Control it with v-model.' }",
  ']',
  '</' + 'script>',
  '',
  '<template>',
  '  <YCollapse v-model="active" :items="items" />',
  '</template>'
].join('\n')
</script>

# Collapse

Collapse 用于折叠长内容，适合 FAQ、设置项、权限说明和文档中的渐进披露。

## Example

<DocDemo
  title="Controlled panels"
  description="默认支持多项展开；打开 accordion 后会变成手风琴模式。"
  :code="code"
  :usage="['v-model', 'accordion', 'label/panel slots']"
>
  <YCollapse v-model="active" :items="items" />
</DocDemo>

## Live example

<LiveExampleRunner
  preset="collapse"
  title="在线编辑 Collapse 示例"
  description="切换 FAQ 分组、手风琴设置、禁用面板、移动折叠和键盘展开场景，验证长内容渐进披露的交互节奏。"
/>

## Usage notes

- Collapse 适合 FAQ、设置分组、权限说明和文档渐进披露，不适合承载必须立即看到的关键信息。
- 默认多面板可同时展开；设置页或表单分组需要降低认知负担时，可以开启 `accordion`。
- 禁用项应保持可见，并在内容或旁侧文案中解释为什么暂不可用。
- 移动端面板标题要短，内容尽量分段，避免展开后首屏被长文案淹没。
- 键盘路径应保持简单：Tab 到达每个触发器，Enter 或 Space 切换面板。

## API

<ComponentApiSection name="YCollapse" />

## Accessibility

- 每个触发器使用原生 `button`。
- 展开状态通过 `aria-expanded` 暴露。
- 触发器通过 `aria-controls` 关联面板。
- 禁用项使用原生 `disabled`，不会触发 `change` 或 `update:modelValue`。
