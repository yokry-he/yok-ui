<script setup lang="ts">
import { ref } from 'vue'
import type { YDateShortcut } from '@yok-ui/core'

const releaseDate = ref('2026-06-13')
const shortcutDate = ref('')
const reviewDate = ref('')
const clearableDate = ref('2026-06-20')
const lockedDate = ref('2026-07-01')
const compactDate = ref('2026-06-18')
const localeDate = ref('2026-06-25')
const requiredDate = ref('')
const dateState = ref('等待选择评审日期')
const requiredDateError = ref('Release date is required.')
const dateShortcuts: YDateShortcut[] = [
  { label: 'Today', value: '2026-06-13' },
  { label: 'Review day', value: () => '2026-06-15', time: '10:00', description: 'Design and QA review' },
  { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }
]

const datePickerCodeSetup = [
  "import { ref } from 'vue'",
  "import { YDatePicker, type YDateShortcut } from '@yok-ui/core'",
  '',
  "const releaseDate = ref('2026-06-13')",
  "const shortcutDate = ref('')",
  "const reviewDate = ref('')",
  "const clearableDate = ref('2026-06-20')",
  "const lockedDate = ref('2026-07-01')",
  "const compactDate = ref('2026-06-18')",
  "const localeDate = ref('2026-06-25')",
  "const requiredDate = ref('')",
  "const requiredDateError = ref('Release date is required.')",
  'const dateShortcuts: YDateShortcut[] = [',
  "  { label: 'Today', value: '2026-06-13' },",
  "  { label: 'Review day', value: () => '2026-06-15', time: '10:00', description: 'Design and QA review' },",
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

const basicCode = '<YDatePicker v-model="releaseDate" label="Release date" />'

const shortcutCode = [
  '<YDatePicker v-model="shortcutDate" label="Release date" :shortcuts="dateShortcuts" />'
].join('\n')

const disabledCode = [
  '<YDatePicker',
  '  v-model="reviewDate"',
  '  label="Review date"',
  '  placeholder="Pick a weekday"',
  '  :disabled-date="disableWeekends"',
  '/>'
].join('\n')

const clearableDisabledCode = [
  '<YDatePicker v-model="clearableDate" label="Review date" clearable />',
  '<YDatePicker v-model="lockedDate" label="Locked launch date" disabled />'
].join('\n')

const sizeLocaleCode = [
  '<YDatePicker v-model="compactDate" label="Compact date" size="sm" />',
  '<YDatePicker v-model="localeDate" label="发布日期" locale="zh-CN" size="lg" />'
].join('\n')

const validationCode = [
  '<YDatePicker',
  '  id="release-required-date"',
  '  v-model="requiredDate"',
  '  label="Release date"',
  '  placeholder="Required before release"',
  '  aria-describedby="release-required-date-help"',
  '  :error="requiredDateError"',
  '  @change="handleRequiredDateChange"',
  '/>',
  '<p id="release-required-date-help">Choose a release date before publishing.</p>'
].join('\n')

function disableWeekends(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}

function handleReviewChange(value: string) {
  dateState.value = value ? `Review date: ${value}` : '等待选择评审日期'
}

function handleRequiredDateChange(value: string) {
  requiredDateError.value = value ? '' : 'Release date is required.'
}
</script>

# Date Picker

Date Picker 用于选择单个日期，是表单、筛选条件、发布设置和后台流程里的基础组件。

当前版本聚焦单日期选择：使用 `YYYY-MM-DD` 字符串作为值，支持月份切换、清空、禁用日期、快捷项和键盘导航。需要区间筛选时可以使用 <a href="/components/date-range-picker">Date Range Picker</a>。

::: tip TIP
`YDatePicker` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic usage {#date-picker-basic-usage}

<DocDemo
  title="Basic usage"
  description="基础日期选择适合发布日、生日、预约日等单个确定日期。"
  :code="basicCode"
  :setup="datePickerCodeSetup"
  :usage="['YYYY-MM-DD', 'v-model', 'clearable']"
>
  <YDatePicker v-model="releaseDate" label="Release date" />
  <p class="demo-note">Selected: {{ releaseDate }}</p>
</DocDemo>

## Shortcuts {#date-picker-shortcuts}

<DocDemo
  title="Shortcuts"
  description="快捷项把常用日期放进面板里，也可以携带业务时间和说明，适合评审窗口、上线窗口等高频选择。"
  :code="shortcutCode"
  :setup="datePickerCodeSetup"
  :usage="['shortcuts', 'static value', 'factory value', 'time preset']"
>
  <YDatePicker v-model="shortcutDate" label="Release date" :shortcuts="dateShortcuts" />
  <p class="demo-note">Selected: {{ shortcutDate || 'none' }}</p>
</DocDemo>

## Disabled dates {#date-picker-disabled-dates}

<DocDemo
  title="Disabled dates"
  description="禁用规则适合排除周末、维护窗口或业务上不可预约的日期。"
  :code="disabledCode"
  :setup="datePickerCodeSetup"
  :usage="['disabledDate', 'change', 'placeholder']"
>
  <YDatePicker
    v-model="reviewDate"
    label="Review date"
    placeholder="Pick a weekday"
    :disabled-date="disableWeekends"
    @change="handleReviewChange"
  />
  <p class="demo-note">{{ dateState }}</p>
</DocDemo>

## Clearable and disabled {#date-picker-clearable-and-disabled}

<DocDemo
  title="Clearable and disabled"
  description="可清空日期适合临时筛选；禁用状态适合已经锁定的发布日期或不可编辑审批字段。"
  :code="clearableDisabledCode"
  :setup="datePickerCodeSetup"
  :usage="['clearable', 'disabled', 'locked field']"
>
  <div class="demo-stack">
    <YDatePicker v-model="clearableDate" label="Review date" clearable />
    <YDatePicker v-model="lockedDate" label="Locked launch date" disabled />
  </div>
  <p class="demo-note">Review: {{ clearableDate || 'empty' }} · Locked: {{ lockedDate }}</p>
</DocDemo>

## Size and locale {#date-picker-size-and-locale}

<DocDemo
  title="Size and locale"
  description="尺寸应跟随表单密度；locale 用于切换月份和星期展示，适合中英文混合后台或国际化文档。"
  :code="sizeLocaleCode"
  :setup="datePickerCodeSetup"
  :usage="['size', 'locale', 'YConfigProvider density']"
>
  <div class="demo-stack">
    <YDatePicker v-model="compactDate" label="Compact date" size="sm" />
    <YDatePicker v-model="localeDate" label="发布日期" locale="zh-CN" size="lg" />
  </div>
  <p class="demo-note">Compact: {{ compactDate }} · Locale: {{ localeDate }}</p>
</DocDemo>

## Form validation {#date-picker-form-validation}

<DocDemo
  title="Form validation"
  description="表单校验场景应同时提供稳定 id、帮助文本关联、错误文案和事件反馈，方便接入 FormItem、提交门禁和无障碍审计。"
  :code="validationCode"
  :setup="datePickerCodeSetup"
  :usage="['id', 'ariaDescribedby', 'error', 'visibleChange']"
>
  <YDatePicker
    id="release-required-date"
    v-model="requiredDate"
    label="Release date"
    placeholder="Required before release"
    aria-describedby="release-required-date-help"
    :error="requiredDateError"
    @change="handleRequiredDateChange"
  />
  <p id="release-required-date-help" class="demo-note">Choose a release date before publishing.</p>
</DocDemo>

## Usage notes {#date-picker-usage-notes}

- 当前值使用 `YYYY-MM-DD` 字符串，便于表单提交、查询参数和后端接口直接保存。
- `shortcuts` 可以是固定字符串或返回字符串的函数，适合把今天、评审日、上线日等业务常用日期放进面板；`time` 和 `description` 用于表达“10:00 评审”“20:30 上线”这类带时间的业务 preset。
- `disabledDate` 应保持为纯函数，只根据日期返回是否禁用，避免在日历渲染时产生副作用。
- `size` 未显式传入时会读取 `YConfigProvider`，适合和 Input、Select、Time Picker 保持同一表单密度。
- 表单校验错误应写在 `error` 中，并保持占位文本短小；错误原因不要只依赖红色边框表达。
- 表单容器接入时建议传入稳定 `id` 和 `ariaDescribedby`，让帮助文本、错误文本与内部输入框建立可审计关联。
- 弹层打开关闭可以监听 `visibleChange`，适合埋点、自动保存草稿和调试复杂表单焦点路径。
- 移动端场景优先使用短标签、短占位和单个日期任务；复杂区间筛选交给 Date Range Picker。
- 键盘路径应覆盖打开面板、方向键移动、月份切换、选择日期和关闭面板，确保没有只靠鼠标才能完成的流程。
- 日期范围场景优先使用 `Date Range Picker`，避免在单日期组件里塞入复杂状态。

## Date Picker API {#date-picker-api}

<ComponentApiSection name="YDatePicker" />

## Accessibility {#accessibility}

- 输入框使用原生 `input`，设置 `aria-expanded`、`aria-controls` 和 `aria-haspopup="dialog"`。
- 日历弹层使用 `role="dialog"`，日期区域使用 `role="grid"`。
- 快捷项使用命名按钮组，禁用快捷项同步原生 `disabled`。
- 日期按钮使用 `role="gridcell"` 和 `aria-selected` 表示选中状态。
- 错误信息使用 `role="alert"`，输入框同步设置 `aria-invalid`。
