<script setup lang="ts">
import { ref } from 'vue'

const quantity = ref(4)
const rating = ref(4.5)
const budget = ref(1200)
const threshold = ref(80)
const numberState = ref('Budget: 1200')

const basicCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YInputNumber } from '@yok-ui/core'",
  '',
  'const quantity = ref(4)',
  '</' + 'script>',
  '',
  '<template>',
  '  <YInputNumber v-model="quantity" label="Quantity" :min="0" :max="12" />',
  '</template>'
].join('\n')

const precisionCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YInputNumber } from '@yok-ui/core'",
  '',
  'const rating = ref(4.5)',
  '</' + 'script>',
  '',
  '<template>',
  '  <YInputNumber v-model="rating" label="Rating" :min="0" :max="5" :step="0.5" :precision="1" />',
  '</template>'
].join('\n')

const controlsSetup = [
  "import { ref } from 'vue'",
  "import { YInputNumber } from '@yok-ui/core'",
  '',
  'const budget = ref(1200)',
  "const numberState = ref('Budget: 1200')",
  '',
  'function handleBudgetChange(value: number | null) {',
  "  numberState.value = `Budget: ${value ?? 'empty'}`",
  '}'
].join('\n')

const controlsCode = [
  '<template>',
  '  <YInputNumber v-model="budget" label="Budget" :step="100" :controls="false" @change="handleBudgetChange" />',
  '  <p>{{ numberState }}</p>',
  '</template>'
].join('\n')

const stateSetup = [
  "import { ref } from 'vue'",
  "import { YInputNumber } from '@yok-ui/core'",
  '',
  'const threshold = ref(80)'
].join('\n')

const stateCode = [
  '<template>',
  '  <YInputNumber',
  '    v-model="threshold"',
  '    label="Coverage threshold"',
  '    :min="0"',
  '    :max="100"',
  '    :step="5"',
  '    error="Threshold must be reviewed before release."',
  '  />',
  '</template>'
].join('\n')

function handleBudgetChange(value: number | null) {
  numberState.value = `Budget: ${value ?? 'empty'}`
}
</script>

# Input Number

Input Number 用于输入受控数字，适合数量、价格、评分、阈值和后台配置项。

当前版本提供原生数字输入、加减按钮、最小/最大值、步进、精度归一化、错误状态和键盘上下键操作。

## Example

<DocDemo
  title="Bounded quantity"
  description="min 和 max 会限制可提交值，适合数量、库存和分页大小。"
  :code="basicCode"
  :usage="['min', 'max', 'step']"
>
  <YInputNumber v-model="quantity" label="Quantity" :min="0" :max="12" />
  <p class="demo-note">Quantity: {{ quantity }}</p>
</DocDemo>

<DocDemo
  title="Precision"
  description="step 与 precision 组合适合评分、折扣、比例等小数输入。"
  :code="precisionCode"
  :usage="['step', 'precision', 'decimal']"
>
  <YInputNumber v-model="rating" label="Rating" :min="0" :max="5" :step="0.5" :precision="1" />
  <p class="demo-note">Rating: {{ rating }}</p>
</DocDemo>

<DocDemo
  title="Without controls"
  description="关闭 controls 后保留原生数字输入，适合预算、金额等用户习惯直接键入的字段。"
  :code="controlsCode"
  :setup="controlsSetup"
  :usage="['controls=false', 'keyboard input', 'change']"
>
  <YInputNumber v-model="budget" label="Budget" :step="100" :controls="false" @change="handleBudgetChange" />
  <p class="demo-note">{{ numberState }}</p>
</DocDemo>

<DocDemo
  title="Error state"
  description="错误态用于表单校验或发布前检查，输入框会同步 aria-invalid。"
  :code="stateCode"
  :setup="stateSetup"
  :usage="['error', 'aria-invalid', 'review state']"
>
  <YInputNumber
    v-model="threshold"
    label="Coverage threshold"
    :min="0"
    :max="100"
    :step="5"
    error="Threshold must be reviewed before release."
  />
</DocDemo>

## Live example

<LiveExampleRunner
  preset="inputNumber"
  title="在线编辑 Input Number 示例"
  description="切换数量范围、小数精度、无步进器、校验错误、移动数值和键盘步进场景，验证数值输入在表单和配置流程里的表现。"
/>

## Usage notes

- `modelValue` 可以是 `number` 或 `null`，空输入会以 `null` 表达。
- `size` 未显式传入时会读取 `YConfigProvider`，适合和 Input、Textarea、Select 保持同一表单密度。
- `precision` 会在提交时归一化显示值，建议和 `step` 一起设计。
- 关闭 `controls` 不会移除键盘能力，用户仍可直接输入或用方向键调整。
- 数量、库存和分页大小应明确设置 `min`、`max` 和 `step`，避免只靠后端校验兜底。
- 金额、预算等字段通常更适合隐藏步进器，让用户直接键入完整数值。
- 移动端场景应使用短标签和清晰范围，避免步进器占用过多输入空间。
- 键盘路径需要覆盖 ArrowUp、ArrowDown、Tab 到达加减按钮以及错误态下的读屏提示。
- 金额输入如果需要货币格式化，建议在业务层配合前后缀或专门的 MoneyInput 组件。

## API

<ComponentApiSection name="YInputNumber" />

## Accessibility

- 使用原生 `input type="number"`，保留浏览器数字输入语义。
- 同步设置 `min`、`max`、`step`、`aria-valuemin`、`aria-valuemax` 和 `aria-valuenow`。
- 加减按钮使用明确的 `aria-label`。
- 错误信息使用 `role="alert"`，输入框同步设置 `aria-invalid`。
