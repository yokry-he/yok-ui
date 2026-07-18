<script setup lang="ts">
import { ref } from 'vue'

const active = ref('usage')
const closedTab = ref('')
const tabs = [
  { label: 'Usage', value: 'usage', icon: '◎' },
  { label: 'API', value: 'api', badge: 6 },
  { label: 'Theme', value: 'theme' },
  { label: 'Draft', value: 'draft', closable: true },
  { label: 'Disabled', value: 'disabled', disabled: true }
]
const setup = [
  "import { ref } from 'vue'",
  "import { YTabs } from '@yok-ui/core'",
  '',
  "const active = ref('usage')",
  "const closedTab = ref('')",
  'const tabs = [',
  "  { label: 'Usage', value: 'usage', icon: '◎' },",
  "  { label: 'API', value: 'api', badge: 6 },",
  "  { label: 'Theme', value: 'theme' },",
  "  { label: 'Draft', value: 'draft', closable: true },",
  "  { label: 'Disabled', value: 'disabled', disabled: true }",
  ']',
  '',
  'function handleClose(value: string) {',
  '  closedTab.value = value',
  '}'
].join('\n')
const code = `<YTabs
  v-model="active"
  :tabs="tabs"
  variant="card"
  activation-mode="manual"
  aria-label="Documentation sections"
  @close="handleClose"
>
  <template #default="{ active }">
    <p v-if="active === 'usage'">Show examples.</p>
    <p v-else-if="active === 'api'">Show API.</p>
    <p v-else-if="active === 'draft'">Show draft notes.</p>
    <p v-else>Show theme tokens.</p>
  </template>
</YTabs>`

function handleClose(value: string) {
  closedTab.value = value
}
</script>

# Tabs

Tabs 用于在同一上下文中切换内容，是主流组件库文档和产品设置页的常用组件。当前版本补齐了 WAI-ARIA Tabs 模式要求的 roving tabindex、方向键导航、自动/手动激活、tab 与 panel 关联，以及接近 Element Plus / Ant Design 的 line、card、segment 三种视觉形态。

::: tip TIP
`YTabs` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Context switch {#tabs-context-switch}

<DocDemo
  title="Context switch"
  description="适合平级内容切换，不适合承载跨页面导航；manual 模式下方向键只移动焦点，Enter 或 Space 激活。"
  :code="code"
  :setup="setup"
  :usage="['v-model', 'manual activation', 'closable tab']"
>
  <YTabs
    v-model="active"
    :tabs="tabs"
    variant="card"
    activation-mode="manual"
    aria-label="Documentation sections"
    @close="handleClose"
  >
    <template #default="{ active }">
      <p v-if="active === 'usage'">Show examples and quick usage.</p>
      <p v-else-if="active === 'api'">Show props, events, and slots.</p>
      <p v-else-if="active === 'draft'">Show draft notes and closable work-in-progress panels.</p>
      <p v-else>Show theme tokens and design notes.</p>
    </template>
  </YTabs>
  <p v-if="closedTab" class="docs-muted">Close requested: {{ closedTab }}</p>
</DocDemo>

## Tabs API {#tabs-api}

<ComponentApiSection name="YTabs" />

## Accessibility {#accessibility}

- Tabs 使用 tablist / tab / tabpanel 语义表达平级内容切换。
- Horizontal 模式使用 Left / Right，Vertical 模式使用 Up / Down；Home / End 跳到首尾可用 tab。
- `activationMode="auto"` 下方向键聚焦即激活；`manual` 下 Enter 或 Space 激活当前 tab。
- 当前 tab 与 panel 通过 `aria-controls`、`aria-labelledby` 和稳定 id 关联。
- 禁用 tab 不参与激活，默认内容切换不应替代跨页面导航。
