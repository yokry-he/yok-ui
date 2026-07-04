<script setup lang="ts">
import { ref } from 'vue'

const viewMode = ref('list')
const period = ref('weekly')
const density = ref('comfortable')

const viewOptions = ['list', 'kanban', 'calendar']
const periodOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
]
const densityOptions = [
  { label: 'Compact', value: 'compact', description: 'Dense tables' },
  { label: 'Comfortable', value: 'comfortable', description: 'Forms and review' },
  { label: 'Relaxed', value: 'relaxed', description: 'Reading mode' }
]

const segmentedSetup = [
  "import { ref } from 'vue'",
  "import { YSegmented } from '@yok-ui/core'",
  '',
  "const viewMode = ref('list')",
  "const period = ref('weekly')",
  "const density = ref('comfortable')",
  '',
  "const viewOptions = ['list', 'kanban', 'calendar']",
  'const periodOptions = [',
  "  { label: 'Daily', value: 'daily' },",
  "  { label: 'Weekly', value: 'weekly' },",
  "  { label: 'Monthly', value: 'monthly' }",
  ']',
  'const densityOptions = [',
  "  { label: 'Compact', value: 'compact', description: 'Dense tables' },",
  "  { label: 'Comfortable', value: 'comfortable', description: 'Forms and review' },",
  "  { label: 'Relaxed', value: 'relaxed', description: 'Reading mode' }",
  ']'
].join('\n')

const basicCode = [
  '<YSegmented v-model="viewMode" :options="viewOptions" aria-label="View mode" name="view-mode" />',
  '<p class="demo-note">Current view: {{ viewMode }}</p>'
].join('\n')

const blockCode = [
  '<YSegmented v-model="period" :options="periodOptions" aria-label="Report period" block shape="round" />',
  '<p class="demo-note">Report period: {{ period }}</p>'
].join('\n')

const verticalCode = [
  '<YSegmented v-model="density" :options="densityOptions" label="Density" orientation="vertical" size="lg" />',
  '<p class="demo-note">Density: {{ density }}</p>'
].join('\n')
</script>

# Segmented

Segmented 用于在少量互斥选项之间快速切换。它参考 Ant Design Segmented 的单选、block、vertical、disabled、size 和 name 使用方式，并保留 Yok UI 的清爽可爱视觉。

## Example

<DocDemo
  title="Basic switch"
  description="基础分段适合少量视图模式切换，name 能保留原生 radio 组键盘行为。"
  :code="basicCode"
  :setup="segmentedSetup"
  :usage="['v-model', 'string options', 'radio group']"
>
  <YSegmented v-model="viewMode" :options="viewOptions" aria-label="View mode" name="view-mode" />
  <p class="demo-note">Current view: {{ viewMode }}</p>
</DocDemo>

## Block

<DocDemo
  title="Block period"
  description="block 让选项平均分布，适合筛选条、工具栏和窄容器。"
  :code="blockCode"
  :setup="segmentedSetup"
  :usage="['block', 'round', 'object options']"
>
  <YSegmented v-model="period" :options="periodOptions" aria-label="Report period" block shape="round" />
  <p class="demo-note">Report period: {{ period }}</p>
</DocDemo>

## Vertical

<DocDemo
  title="Vertical density"
  description="纵向分段适合设置面板和侧边筛选，描述文本帮助解释每个选项。"
  :code="verticalCode"
  :setup="segmentedSetup"
  :usage="['vertical', 'description', 'size']"
>
  <YSegmented v-model="density" :options="densityOptions" label="Density" orientation="vertical" size="lg" />
  <p class="demo-note">Density: {{ density }}</p>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="segmented"
  title="在线编辑 Segmented 示例"
  description="验证视图模式、等宽周期、纵向分段、禁用选项和键盘单选场景。"
/>

## Usage notes

- 适合 2 到 5 个轻量选项，例如视图模式、统计周期、内容密度和筛选维度。
- 复杂说明、错误提示或较多选项应优先使用 `YRadioGroup`。
- `block` 适合工具栏、筛选条和窄容器；普通内联区域保持默认宽度更利于扫描。
- 需要浏览器原生同组键盘行为时传入稳定 `name`。

## API

<ComponentApiSection name="YSegmented" />

## Accessibility

- 组件使用 `role="radiogroup"` 并保留原生 `input type="radio"`。
- 有可见标题时使用 `label`；无可见标题时必须提供 `ariaLabel`。
- 同一个分段组建议提供 `name`，让方向键在原生 radio 组内切换。
- 禁用项使用原生 `disabled`，不只依赖视觉弱化。
