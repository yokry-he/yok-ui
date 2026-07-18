<script setup lang="ts">
import { ref } from 'vue'
import type { YDateShortcut } from '@yok-ui/core'

const releaseDate = ref('2026-06-13')
const shortcutDate = ref('2026-06-15')
const weekdayDate = ref('2026-06-16')
const inlineDate = ref('2026-06-18')
const requiredDate = ref('')
const requiredDateError = ref('Release date is required.')
const panelState = ref('等待选择发布日期')

const dateShortcuts: YDateShortcut[] = [
  { label: 'Today', value: '2026-06-13' },
  { label: 'Review day', value: '2026-06-15', time: '10:00', description: 'Design and QA review' },
  { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }
]

const panelSetup = [
  "import { ref } from 'vue'",
  "import { YDatePickerPanel, type YDateShortcut } from '@yok-ui/core'",
  '',
  "const releaseDate = ref('2026-06-13')",
  "const shortcutDate = ref('2026-06-15')",
  "const weekdayDate = ref('2026-06-16')",
  "const inlineDate = ref('2026-06-18')",
  "const requiredDate = ref('')",
  "const requiredDateError = ref('Release date is required.')",
  'const dateShortcuts: YDateShortcut[] = [',
  "  { label: 'Today', value: '2026-06-13' },",
  "  { label: 'Review day', value: '2026-06-15', time: '10:00', description: 'Design and QA review' },",
  "  { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }",
  ']',
  '',
  'function disableWeekends(date: Date) {',
  '  return date.getDay() === 0 || date.getDay() === 6',
  '}',
  '',
  'function handleRequiredDateChange(value: string) {',
  "  requiredDateError.value = value ? '' : 'Release date is required.'",
  '}'
].join('\n')

const basicCode = [
  '<YDatePickerPanel v-model="releaseDate" label="Release calendar" />',
  '<p class="demo-note">Selected: {{ releaseDate }}</p>'
].join('\n')

const shortcutCode = [
  '<YDatePickerPanel v-model="shortcutDate" label="Release shortcuts" :shortcuts="dateShortcuts" />',
  '<p class="demo-note">Selected: {{ shortcutDate }}</p>'
].join('\n')

const disabledCode = [
  '<YDatePickerPanel',
  '  v-model="weekdayDate"',
  '  label="Weekday calendar"',
  '  :disabled-date="disableWeekends"',
  '/>'
].join('\n')

const borderlessCode = [
  '<YDatePickerPanel v-model="inlineDate" label="Inline calendar" :border="false" />'
].join('\n')

const validationCode = [
  '<YDatePickerPanel',
  '  id="release-date-panel"',
  '  v-model="requiredDate"',
  '  label="Required release date"',
  '  aria-describedby="release-date-panel-help"',
  '  :invalid="Boolean(requiredDateError)"',
  '  :error="requiredDateError"',
  '  @change="handleRequiredDateChange"',
  '/>',
  '<p id="release-date-panel-help" class="demo-note">Choose a release date before publishing.</p>'
].join('\n')

function disableWeekends(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}

function handlePanelChange(value: string) {
  panelState.value = `Panel month: ${value}`
}

function handleRequiredDateChange(value: string) {
  requiredDateError.value = value ? '' : 'Release date is required.'
}
</script>

# Date Picker Panel

Date Picker Panel 是可直接嵌入页面、抽屉、Popover 内容区或筛选侧栏的日期选择面板。它不创建弹层，适合用户需要一直看到日历并快速调整日期的工作流。

它参考主流组件库独立 panel 的组织方式，把月份导航、日期网格、禁用规则、快捷项和可访问性状态放在一个稳定受控组件里。需要常规表单触发器时使用 <a href="/components/date-picker">Date Picker</a>；需要始终展示日历时使用 Date Picker Panel。

::: tip TIP
`YDatePickerPanel` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Embedded calendar {#date-picker-panel-embedded-calendar}

<DocDemo
  title="Embedded calendar"
  description="嵌入式日期面板适合筛选侧栏、发布配置和日期仪表盘。"
  :code="basicCode"
  :setup="panelSetup"
  :usage="['embedded panel', 'v-model', 'YYYY-MM-DD']"
>
  <YDatePickerPanel v-model="releaseDate" label="Release calendar" @panel-change="handlePanelChange" />
  <p class="demo-note">Selected: {{ releaseDate }} · {{ panelState }}</p>
</DocDemo>

## Shortcuts {#date-picker-panel-shortcuts}

<DocDemo
  title="Shortcuts"
  description="快捷日期适合评审日、上线日和带业务时间说明的高频选择。"
  :code="shortcutCode"
  :setup="panelSetup"
  :usage="['shortcuts', 'time preset', 'description']"
>
  <YDatePickerPanel v-model="shortcutDate" label="Release shortcuts" :shortcuts="dateShortcuts" />
  <p class="demo-note">Selected: {{ shortcutDate }}</p>
</DocDemo>

## Disabled dates {#date-picker-panel-disabled-dates}

<DocDemo
  title="Disabled dates"
  description="禁用规则应保持纯函数，适合排除周末、维护窗口或不可预约日期。"
  :code="disabledCode"
  :setup="panelSetup"
  :usage="['disabledDate', 'keyboard skip', 'pure function']"
>
  <YDatePickerPanel
    v-model="weekdayDate"
    label="Weekday calendar"
    :disabled-date="disableWeekends"
  />
  <p class="demo-note">Weekends are disabled.</p>
</DocDemo>

## Borderless panel {#date-picker-panel-borderless-panel}

<DocDemo
  title="Borderless panel"
  description="嵌入卡片、抽屉或 Popover 内容区时，可以移除外框和阴影，让容器负责视觉边界。"
  :code="borderlessCode"
  :setup="panelSetup"
  :usage="['border=false', 'composition', 'inline panel']"
>
  <YDatePickerPanel v-model="inlineDate" label="Inline calendar" :border="false" />
</DocDemo>

## Panel validation {#date-picker-panel-panel-validation}

<DocDemo
  title="Panel validation"
  description="独立面板也应接入表单校验，错误信息会关联到 group 级可访问属性。"
  :code="validationCode"
  :setup="panelSetup"
  :usage="['id', 'ariaDescribedby', 'error']"
>
  <YDatePickerPanel
    id="release-date-panel"
    v-model="requiredDate"
    label="Required release date"
    aria-describedby="release-date-panel-help"
    :invalid="Boolean(requiredDateError)"
    :error="requiredDateError"
    @change="handleRequiredDateChange"
  />
  <p id="release-date-panel-help" class="demo-note">Choose a release date before publishing.</p>
</DocDemo>

## Usage notes {#date-picker-panel-usage-notes}

- 常规表单输入优先使用 `YDatePicker`；始终展示日历、嵌入配置面板或筛选侧栏时使用 `YDatePickerPanel`。
- `modelValue` 使用 `YYYY-MM-DD` 字符串，便于 URL 查询参数、表单提交和后端接口保存。
- `disabledDate` 应保持为纯函数，键盘移动会跳过被禁用的日期。
- `border=false` 适合放入已有卡片、抽屉、Popover 或表单分组中，避免重复边框。
- `shortcuts` 可以携带 `time` 和 `description`，用于表达评审窗口、上线窗口等业务 preset。
- 面板使用 `role="group"`，日期区域使用 `role="grid"`；有可见 `label` 时通过 `aria-labelledby` 命名，无可见标题时应传 `ariaLabel`。

## Date Picker Panel API {#date-picker-panel-api}

<ComponentApiSection name="YDatePickerPanel" />

## Accessibility {#accessibility}

- 面板根节点使用 `role="group"` 表达一组日期选择控件。
- 日历区域使用 `role="grid"`、星期使用 `role="columnheader"`、日期按钮使用 `role="gridcell"` 和 `aria-selected`。
- 方向键移动日期，`Home` / `End` 移动到周首周末，`PageUp` / `PageDown` 切换月份。
- 禁用日期和禁用快捷项使用原生 `disabled`，键盘移动会跳过禁用日期。
- 错误信息使用 `role="alert"`，面板同步 `aria-invalid` 和 `aria-describedby`。
