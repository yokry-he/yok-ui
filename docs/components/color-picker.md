<script setup lang="ts">
import { ref } from 'vue'

const accentColor = ref('#14B8A6')
const brandColor = ref('#F472B6')
const overlayColor = ref('#14B8A680')
const emptyColor = ref('')
const requiredColor = ref('')
const requiredColorError = ref('Choose a brand-approved color.')

const brandPresets = ['#14B8A6', '#38BDF8', '#A78BFA', '#F472B6', '#FBBF24']

function handleRequiredColorChange(value: string) {
  requiredColorError.value = brandPresets.includes(value) ? '' : 'Choose a brand-approved color.'
}

const colorPickerSetup = [
  "import { ref } from 'vue'",
  "import { YColorPicker } from '@yok-ui/core'",
  '',
  "const accentColor = ref('#14B8A6')",
  "const brandColor = ref('#F472B6')",
  "const overlayColor = ref('#14B8A680')",
  "const emptyColor = ref('')",
  "const requiredColor = ref('')",
  "const requiredColorError = ref('Choose a brand-approved color.')",
  '',
  "const brandPresets = ['#14B8A6', '#38BDF8', '#A78BFA', '#F472B6', '#FBBF24']",
  '',
  'function handleRequiredColorChange(value: string) {',
  "  requiredColorError.value = brandPresets.includes(value) ? '' : 'Choose a brand-approved color.'",
  '}'
].join('\n')

const basicCode = [
  '<YColorPicker v-model="accentColor" label="Accent color" />',
  '<p class="demo-note">Accent: {{ accentColor }}</p>'
].join('\n')

const presetsCode = [
  '<YColorPicker v-model="brandColor" label="Brand color" :presets="brandPresets" />',
  '<p class="demo-note">Brand: {{ brandColor }}</p>'
].join('\n')

const alphaCode = [
  '<YColorPicker v-model="overlayColor" label="Overlay color" show-alpha show-text size="large" />',
  '<p class="demo-note">Overlay: {{ overlayColor }}</p>'
].join('\n')

const optionalCode = [
  '<YColorPicker v-model="emptyColor" label="Optional color" placeholder="#38BDF8" />',
  '<p class="demo-note">Empty values are allowed for optional theme slots.</p>'
].join('\n')

const validationCode = [
  '<YColorPicker',
  '  id="brand-required-color"',
  '  v-model="requiredColor"',
  '  label="Brand color"',
  '  aria-describedby="brand-required-color-help"',
  '  :presets="brandPresets"',
  '  :invalid="Boolean(requiredColorError)"',
  '  :error="requiredColorError"',
  '  @change="handleRequiredColorChange"',
  '/>',
  '<p id="brand-required-color-help" class="demo-note">Choose one approved brand token before publishing.</p>'
].join('\n')
</script>

# Color Picker

Color Picker 用于选择主题色、品牌色、状态色和轻量可视化配置。它提供原生色板、HEX 文本输入和预设色，适合主题编辑器、配置表单和内容创作工具。

当前版本聚焦稳定的 HEX / HEXA 工作流：输入会规范化为 `#RRGGBB` 或 `#RRGGBBAA`，支持 3/4 位短写、透明度、触发器文本、清空、预设色、错误状态和禁用状态。

::: tip TIP
`YColorPicker` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Accent color {#color-picker-accent-color}

<DocDemo
  title="Accent color"
  description="基础色值选择适合主题色、品牌色和状态色配置。"
  :code="basicCode"
  :setup="colorPickerSetup"
  :usage="['v-model', 'hex', 'native color']"
>
  <YColorPicker v-model="accentColor" label="Accent color" />
  <p class="demo-note">Accent: {{ accentColor }}</p>
</DocDemo>

## Brand presets {#color-picker-brand-presets}

<DocDemo
  title="Brand presets"
  description="预设色应来自设计 token，帮助用户选择可维护的品牌颜色。"
  :code="presetsCode"
  :setup="colorPickerSetup"
  :usage="['presets', 'tokens', 'aria-pressed']"
>
  <YColorPicker v-model="brandColor" label="Brand color" :presets="brandPresets" />
  <p class="demo-note">Brand: {{ brandColor }}</p>
</DocDemo>

## Alpha and text {#color-picker-alpha-and-text}

<DocDemo
  title="Alpha and text"
  description="showAlpha 支持 HEXA 工作流，showText 让当前色值更容易扫描和复制。"
  :code="alphaCode"
  :setup="colorPickerSetup"
  :usage="['showAlpha', 'showText', 'size']"
>
  <YColorPicker v-model="overlayColor" label="Overlay color" show-alpha show-text size="large" />
  <p class="demo-note">Overlay: {{ overlayColor }}</p>
</DocDemo>

## Optional color {#color-picker-optional-color}

<DocDemo
  title="Optional color"
  description="空值适合可继承或可关闭的主题槽位，placeholder 说明建议色值。"
  :code="optionalCode"
  :setup="colorPickerSetup"
  :usage="['placeholder', 'empty value', 'optional']"
>
  <YColorPicker v-model="emptyColor" label="Optional color" placeholder="#38BDF8" />
  <p class="demo-note">Empty values are allowed for optional theme slots.</p>
</DocDemo>

## Form validation {#color-picker-form-validation}

<DocDemo
  title="Form validation"
  description="invalid 与 error 用于业务校验，并通过 aria-describedby 连接帮助文本。"
  :code="validationCode"
  :setup="colorPickerSetup"
  :usage="['invalid', 'error', 'change']"
>
  <YColorPicker
    id="brand-required-color"
    v-model="requiredColor"
    label="Brand color"
    aria-describedby="brand-required-color-help"
    :presets="brandPresets"
    :invalid="Boolean(requiredColorError)"
    :error="requiredColorError"
    @change="handleRequiredColorChange"
  />
  <p id="brand-required-color-help" class="demo-note">Choose one approved brand token before publishing.</p>
</DocDemo>

## Usage notes {#color-picker-usage-notes}

- 默认使用 6 位 HEX，适合主题色、品牌色和状态色；开启 `showAlpha` 后可提交 4 位或 8 位 HEXA。
- `showText` 适合在触发器内直接展示当前色值，配置表单和主题面板会更容易扫描。
- 原生色板只支持不透明颜色；透明度应通过文本输入、粘贴或预设色提交。
- `size` 用于适配不同密度；未显式传入时会读取 `YConfigProvider`，局部可继续用 `small` 或 `large` 覆盖全局设置。
- 预设色应来自品牌 token 或主题包，避免让用户在关键配置里自由选择不可维护的颜色。
- 表单容器接入时建议传入稳定 `id` 和 `ariaDescribedby`，让帮助文本、错误文本与原生色板和 HEX 输入都建立可审计关联。
- 如果业务需要限制品牌色，优先结合 `presets`、`invalid` 和 `error` 展示明确原因，而不是只依赖红色边框。

## Color Picker API {#color-picker-api}

<ComponentApiSection name="YColorPicker" />

## Accessibility {#accessibility}

- 原生 `input type="color"` 保留系统色板能力，并与可见色块组合。
- HEX 文本输入保留原生 input 语义，支持粘贴、键盘编辑和表单校验。
- 预设色使用 button，提供 `aria-label` 和 `aria-pressed`。
- 错误与非法 HEX 输入使用 `role="alert"` 宣告，并通过 `aria-invalid` 标记原生色板和 HEX 输入。
