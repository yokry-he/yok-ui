<script setup lang="ts">
import { ref } from 'vue'

const volume = ref(42)
const opacity = ref(0.6)
const quality = ref(60)
const budgetRange = ref<[number, number]>([20, 80])
const verticalTemperature = ref(65)

const qualityMarks = [
  { value: 0, label: 'Draft' },
  { value: 50, label: 'Good' },
  { value: 100, label: 'Best' }
]

const sliderSetup = [
  "import { ref } from 'vue'",
  "import { YSlider } from '@yok-ui/core'",
  '',
  'const volume = ref(42)',
  'const opacity = ref(0.6)',
  'const quality = ref(60)',
  'const budgetRange = ref<[number, number]>([20, 80])',
  'const verticalTemperature = ref(65)',
  '',
  'const qualityMarks = [',
  "  { value: 0, label: 'Draft' },",
  "  { value: 50, label: 'Good' },",
  "  { value: 100, label: 'Best' }",
  ']'
].join('\n')

const volumeCode = [
  '<YSlider v-model="volume" label="Volume" />',
  '<p class="demo-note">Volume: {{ volume }}</p>'
].join('\n')

const opacityCode = [
  '<YSlider v-model="opacity" label="Opacity" :min="0" :max="1" :step="0.1" :precision="1" />',
  '<p class="demo-note">Opacity: {{ opacity }}</p>'
].join('\n')

const marksCode = [
  '<YSlider v-model="quality" label="Quality" :marks="qualityMarks" :step="10" />',
  '<p class="demo-note">Quality: {{ quality }}</p>'
].join('\n')

const rangeCode = [
  '<YSlider v-model="budgetRange" label="Budget range" range :step="5" />',
  '<p class="demo-note">Budget: {{ budgetRange[0] }} - {{ budgetRange[1] }}</p>'
].join('\n')

const verticalCode = [
  '<YSlider',
  '  v-model="verticalTemperature"',
  '  label="Temperature"',
  '  vertical',
  '  height="180px"',
  '  show-tooltip',
  '  tooltip-placement="right"',
  '  :step="5"',
  '/>',
  '<p class="demo-note">Temperature: {{ verticalTemperature }}</p>'
].join('\n')
</script>

# Slider

Slider 用于在一个范围内选择数字值，适合比例、阈值、评分、价格和可视化配置。

当前版本使用原生 `input type="range"`，支持最小/最大值、步进、小数精度、单值或范围选择、当前值展示、标记、垂直方向、tooltip placement 和错误状态。

::: tip TIP
`YSlider` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic value {#slider-basic-value}

<DocDemo
  title="Basic value"
  description="基础滑块适合音量、比例和阈值等近似数值选择。"
  :code="volumeCode"
  :setup="sliderSetup"
  :usage="['v-model', 'keyboard', 'showValue']"
>
  <YSlider v-model="volume" label="Volume" />
  <p class="demo-note">Volume: {{ volume }}</p>
</DocDemo>

## Decimal precision {#slider-decimal-precision}

<DocDemo
  title="Decimal precision"
  description="min、max、step 和 precision 组合适合透明度、缩放比例等小数值。"
  :code="opacityCode"
  :setup="sliderSetup"
  :usage="['min/max', 'step', 'precision']"
>
  <YSlider v-model="opacity" label="Opacity" :min="0" :max="1" :step="0.1" :precision="1" />
  <p class="demo-note">Opacity: {{ opacity }}</p>
</DocDemo>

## Marks and steps {#slider-marks-and-steps}

<DocDemo
  title="Marks and steps"
  description="marks 用于说明关键节点，step 应与业务粒度保持一致。"
  :code="marksCode"
  :setup="sliderSetup"
  :usage="['marks', 'step', 'labels']"
>
  <YSlider v-model="quality" label="Quality" :marks="qualityMarks" :step="10" />
  <p class="demo-note">Quality: {{ quality }}</p>
</DocDemo>

## Range {#slider-range}

<DocDemo
  title="Range"
  description="range 适合预算、价格区间、筛选阈值，提交值会保持从小到大。"
  :code="rangeCode"
  :setup="sliderSetup"
  :usage="['range', 'tuple', 'filter']"
>
  <YSlider v-model="budgetRange" label="Budget range" range :step="5" />
  <p class="demo-note">Budget: {{ budgetRange[0] }} - {{ budgetRange[1] }}</p>
</DocDemo>

## Vertical threshold {#slider-vertical-threshold}

<DocDemo
  title="Vertical threshold"
  description="垂直滑块适合窄列仪表盘和侧边阈值控制，需要给出稳定高度。"
  :code="verticalCode"
  :setup="sliderSetup"
  :usage="['vertical', 'height', 'tooltip']"
>
  <YSlider
    v-model="verticalTemperature"
    label="Temperature"
    vertical
    height="180px"
    show-tooltip
    tooltip-placement="right"
    :step="5"
  />
  <p class="demo-note">Temperature: {{ verticalTemperature }}</p>
</DocDemo>

## Usage notes {#slider-usage-notes}

- 适合“近似选择”的连续数值，例如音量、透明度、比例、阈值和评分；需要精确键入金额或数量时优先使用 `InputNumber`。
- `range` 适合价格、预算、筛选区间和阈值范围；提交值始终会归一化为从小到大的 `[min, max]`。
- `vertical` 适合仪表盘阈值、空间受限的侧边调节器和移动端窄列控制；必须给出明确 `height`，避免交互区域不稳定。
- `showTooltip` 与 `tooltipPlacement` 用于需要贴近 thumb 反馈当前值的场景；静态说明或表单读数仍可使用默认 header value。
- `step` 应匹配业务粒度：比例常用 5 或 10，精细调节再降低步长，避免让用户拖动到没有业务意义的小数。
- 当数值本身会影响决策时保留 `showValue`，装饰性调节可以隐藏当前值。
- 错误状态要写清楚业务规则，例如最低覆盖率、允许范围或锁定原因；不要只给红色边框。
- 键盘路径依赖原生 range：Tab 聚焦滑块后，方向键按 `step` 调整数值。
- 当前 Yok UI 已覆盖基础、范围、步进、标记、垂直方向、tooltip placement、禁用、错误和键盘；tooltip formatter、轨道点击动画等高级能力会作为后续 parity 项推进。

## Slider API {#slider-api}

<ComponentApiSection name="YSlider" />

## Accessibility {#accessibility}

- 使用原生 `input type="range"`，保留浏览器滑块语义和键盘交互。
- 同步设置 `min`、`max`、`step`、`aria-valuemin`、`aria-valuemax`、`aria-valuenow` 和 `aria-valuetext`。
- 错误信息使用 `role="alert"`，输入框同步设置 `aria-invalid`。
