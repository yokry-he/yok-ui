<script setup lang="ts">
import { ref } from 'vue'

const satisfaction = ref(4)
const taste = ref(3.5)
const mood = ref(2)
const quality = ref(4)
const service = ref(4)
const rateState = ref('Satisfaction: 4')
const rateTexts = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']

const rateCodeSetup = [
  "import { ref } from 'vue'",
  "import { YRate } from '@yok-ui/core'",
  '',
  'const satisfaction = ref(4)',
  'const taste = ref(3.5)',
  'const mood = ref(2)',
  'const quality = ref(4)',
  'const service = ref(4)',
  "const rateTexts = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']"
].join('\n')

const basicCode = '<YRate v-model="satisfaction" label="Satisfaction" />'

const halfCode = '<YRate v-model="taste" label="Taste" allow-half />'

const iconCode = '<YRate v-model="mood" label="Mood" icon="❤" void-icon="♡" />'

const readonlyCode = '<YRate v-model="quality" label="Quality score" readonly />'

const textCode = '<YRate v-model="service" label="Service quality" :texts="rateTexts" size="large" />'

function handleRateChange(value: number) {
  rateState.value = `Satisfaction: ${value}`
}
</script>

# Rate

Rate 用于表达满意度、偏好、质量等级和轻量评价。它适合比 Slider 更具情绪表达的场景，比如评分、收藏倾向、内容推荐反馈。

当前版本支持整数评分、半星评分、等级文案、尺寸、自定义图标、再次点击清空、只读/禁用和错误状态。

::: tip TIP
`YRate` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic rate {#rate-basic-rate}

<DocDemo
  title="Basic rate"
  description="基础评分适合满意度、内容质量和轻量反馈。"
  :code="basicCode"
  :setup="rateCodeSetup"
  :usage="['radiogroup', 'clearable', 'change']"
>
  <YRate v-model="satisfaction" label="Satisfaction" @change="handleRateChange" />
  <p class="demo-note">{{ rateState }}</p>
</DocDemo>

## Half step {#rate-half-step}

<DocDemo
  title="Half step"
  description="allowHalf 会把步进改为 0.5，适合更细粒度的评分场景。"
  :code="halfCode"
  :setup="rateCodeSetup"
  :usage="['allowHalf', '0.5 step', 'keyboard']"
>
  <YRate v-model="taste" label="Taste" allow-half />
  <p class="demo-note">Taste: {{ taste }}</p>
</DocDemo>

## Custom icon {#rate-custom-icon}

<DocDemo
  title="Custom icon"
  description="图标可以表达更轻松的情绪反馈，但仍保留评分语义。"
  :code="iconCode"
  :setup="rateCodeSetup"
  :usage="['icon', 'voidIcon', 'friendly feedback']"
>
  <YRate v-model="mood" label="Mood" icon="❤" void-icon="♡" />
</DocDemo>

## Copywriting and size {#rate-copywriting-and-size}

<DocDemo
  title="Copywriting and size"
  description="texts 可以解释每个分数代表的含义，size 用于适配桌面表单、卡片和移动端密度。"
  :code="textCode"
  :setup="rateCodeSetup"
  :usage="['texts', 'size', 'title']"
>
  <YRate v-model="service" label="Service quality" :texts="rateTexts" size="large" />
  <p class="demo-note">Service: {{ service }}</p>
</DocDemo>

## Readonly score {#rate-readonly-score}

<DocDemo
  title="Readonly score"
  description="只读评分适合展示聚合分、质量分或不可编辑的历史评价。"
  :code="readonlyCode"
  :setup="rateCodeSetup"
  :usage="['readonly', 'showValue', 'display only']"
>
  <YRate v-model="quality" label="Quality score" readonly />
</DocDemo>

## Usage notes {#rate-usage-notes}

- 评分组件适合表达偏好，不适合精确数值配置；精确数值优先使用 Input Number 或 Slider。
- `allowHalf` 会改变键盘步进和点击区域，辅助技术仍通过 radio 语义理解当前值。
- `texts` 适合把 1-5 分翻译成业务语言，例如 Poor、Fair、Good、Great、Excellent；它会同步用于按钮 title 和辅助技术标签。
- `size` 用于适配不同密度：表格内可用 small，普通表单用 medium，强调型反馈卡片可用 large。
- `readonly` 用于展示历史或聚合评分；`disabled` 用于不可操作且语义上被禁用的表单项。
- 自定义图标应保持视觉宽度稳定，避免评分切换时布局抖动。

## Rate API {#rate-api}

<ComponentApiSection name="YRate" />

## Accessibility {#accessibility}

- 使用 `radiogroup` / `radio` 语义表达评分组和每个分值。
- 每个评分按钮提供明确的 `aria-label`，例如 `3.5 of 5`。
- 当前分值通过 `aria-checked` 表达，错误状态通过 `aria-invalid` 和 `role="alert"` 表达。
- 方向键、Home 和 End 可完成主要键盘操作；半星模式下步进为 `0.5`。
