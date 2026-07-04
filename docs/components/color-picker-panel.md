<script setup lang="ts">
import { ref } from 'vue'

const themeColor = ref('#14B8A6')
const brandColor = ref('#F472B6')
const overlayColor = ref('#14B8A680')
const requiredColor = ref('')
const requiredColorError = ref('Choose a brand-approved color.')

const brandPresets = ['#14B8A6', '#38BDF8', '#A78BFA', '#F472B6', '#FBBF24']

function handleRequiredColorChange(value: string) {
  requiredColorError.value = brandPresets.includes(value) ? '' : 'Choose a brand-approved color.'
}

const panelSetup = [
  "import { ref } from 'vue'",
  "import { YColorPickerPanel } from '@yok-ui/core'",
  '',
  "const themeColor = ref('#14B8A6')",
  "const brandColor = ref('#F472B6')",
  "const overlayColor = ref('#14B8A680')",
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
  '<YColorPickerPanel v-model="themeColor" label="Theme color" />',
  '<p class="demo-note">Theme: {{ themeColor }}</p>'
].join('\n')

const presetCode = [
  '<YColorPickerPanel v-model="brandColor" label="Brand token" :presets="brandPresets" />',
  '<p class="demo-note">Brand token: {{ brandColor }}</p>'
].join('\n')

const alphaCode = [
  '<YColorPickerPanel v-model="overlayColor" label="Overlay token" show-alpha />',
  '<p class="demo-note">Overlay token: {{ overlayColor }}</p>'
].join('\n')

const validationCode = [
  '<YColorPickerPanel',
  '  id="brand-panel-color"',
  '  v-model="requiredColor"',
  '  label="Brand token"',
  '  aria-describedby="brand-panel-color-help"',
  '  :presets="brandPresets"',
  '  :invalid="Boolean(requiredColorError)"',
  '  :error="requiredColorError"',
  '  @change="handleRequiredColorChange"',
  '/>',
  '<p id="brand-panel-color-help" class="demo-note">Choose one approved brand token before publishing.</p>'
].join('\n')
</script>

# Color Picker Panel

Color Picker Panel 是可直接嵌入页面、抽屉、主题实验室和后台配置页的颜色选择面板。它不创建弹层，适合用户需要持续查看并调整颜色 token 的工作流。

它参考主流组件库里独立 panel 的组织方式，把原生色板、HEX 文本输入、预设色和错误状态放在一个稳定面板内，便于组合到主题系统、表单和设计 token 编辑器。

## Examples

<DocDemo
  title="Embedded theme color"
  description="面板适合放在主题配置页中，用户可以持续看到当前色值和预设色。"
  :code="basicCode"
  :setup="panelSetup"
  :usage="['embedded panel', 'v-model', 'HEX']"
>
  <YColorPickerPanel v-model="themeColor" label="Theme color" />
  <p class="demo-note">Theme: {{ themeColor }}</p>
</DocDemo>

<DocDemo
  title="Brand presets"
  description="预设色应来自品牌 token，避免关键配置产生不可维护的自由颜色。"
  :code="presetCode"
  :setup="panelSetup"
  :usage="['presets', 'aria-pressed', 'design token']"
>
  <YColorPickerPanel v-model="brandColor" label="Brand token" :presets="brandPresets" />
  <p class="demo-note">Brand token: {{ brandColor }}</p>
</DocDemo>

<DocDemo
  title="Alpha token"
  description="开启 showAlpha 后，面板允许 4 位或 8 位 HEXA，适合遮罩、浮层和图表透明色。"
  :code="alphaCode"
  :setup="panelSetup"
  :usage="['showAlpha', 'HEXA', 'overlay token']"
>
  <YColorPickerPanel v-model="overlayColor" label="Overlay token" show-alpha />
  <p class="demo-note">Overlay token: {{ overlayColor }}</p>
</DocDemo>

<DocDemo
  title="Panel validation"
  description="嵌入式面板也应接入表单校验，帮助文本和错误信息会同时关联原生色板和 HEX 输入。"
  :code="validationCode"
  :setup="panelSetup"
  :usage="['id', 'ariaDescribedby', 'error']"
>
  <YColorPickerPanel
    id="brand-panel-color"
    v-model="requiredColor"
    label="Brand token"
    aria-describedby="brand-panel-color-help"
    :presets="brandPresets"
    :invalid="Boolean(requiredColorError)"
    :error="requiredColorError"
    @change="handleRequiredColorChange"
  />
  <p id="brand-panel-color-help" class="demo-note">Choose one approved brand token before publishing.</p>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="colorPickerPanel"
  title="在线编辑 Color Picker Panel 示例"
  description="切换主题色、品牌预设、透明度、禁用、校验、移动端和键盘输入场景，验证嵌入式颜色面板。"
/>

## Usage notes

- 需要在表单里紧凑选择颜色时用 `YColorPicker`；需要在主题页面、抽屉或配置页里持续编辑颜色时用 `YColorPickerPanel`。
- `modelValue` 默认使用 `#RRGGBB`，开启 `showAlpha` 后可提交 `#RRGGBBAA`。
- 原生色板仍只提交不透明颜色，透明度建议通过 HEX 文本或预设色提交。
- `presets` 应来自设计 token 或品牌配置，避免主题系统产生不可维护的颜色。
- 面板使用 `role="group"`，有可见 label 时通过 `aria-labelledby` 命名；无可见 label 时应传 `ariaLabel`。

## API

<ComponentApiSection name="YColorPickerPanel" />

## Accessibility

- 面板根节点使用 `role="group"` 表达一组相关控件。
- 原生色板和 HEX 文本输入都会同步 `aria-invalid` 和 `aria-describedby`。
- 预设色是原生 button，使用 `aria-label` 描述目标色值，使用 `aria-pressed` 表示当前选中状态。
- 错误信息使用 `role="alert"`，适合表单和主题发布前校验。
