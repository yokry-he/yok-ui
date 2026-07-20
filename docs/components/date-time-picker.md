<script setup lang="ts">
import { ref } from 'vue'
import type {
  YDateTimePickerDisabledDate,
  YDateTimePickerDisabledTime,
  YDateTimeShortcut
} from '@yok-ui/core'

const releaseAt = ref('2026-07-04 20:30')
const shortcutAt = ref('')
const reviewAt = ref('')
const requiredAt = ref('')
const dateTimeState = ref('等待选择评审时间')
const requiredAtError = ref('Release date time is required.')
const dateTimeShortcuts: YDateTimeShortcut[] = [
  { label: 'Review', value: '2026-06-15 10:00', description: 'Design and QA review' },
  { label: 'Launch', value: '2026-07-04 20:30', description: 'Low traffic release window' },
  { label: 'Maintenance', value: () => '2026-07-12 02:00', description: 'Low traffic maintenance slot' }
]

const dateTimePickerCodeSetup = [
  "import { ref } from 'vue'",
  "import { YDateTimePicker, type YDateTimePickerDisabledTime, type YDateTimeShortcut } from '@yok-ui/core'",
  '',
  "const releaseAt = ref('2026-07-04 20:30')",
  "const shortcutAt = ref('')",
  "const reviewAt = ref('')",
  "const requiredAt = ref('')",
  "const requiredAtError = ref('Release date time is required.')",
  'const dateTimeShortcuts: YDateTimeShortcut[] = [',
  "  { label: 'Review', value: '2026-06-15 10:00', description: 'Design and QA review' },",
  "  { label: 'Launch', value: '2026-07-04 20:30', description: 'Low traffic release window' },",
  "  { label: 'Maintenance', value: () => '2026-07-12 02:00', description: 'Low traffic maintenance slot' }",
  ']',
  '',
  'function disableWeekends(date: Date) {',
  '  return date.getDay() === 0 || date.getDay() === 6',
  '}',
  '',
  'const disableAfterWork: YDateTimePickerDisabledTime = (time) => time.hour >= 18',
  '',
  'function handleRequiredDateTimeChange(value: string) {',
  "  requiredAtError.value = value ? '' : 'Release date time is required.'",
  '}'
].join('\n')

const basicCode = '<YDateTimePicker v-model="releaseAt" label="Release at" :minute-step="15" />'

const shortcutCode = [
  '<YDateTimePicker',
  '  v-model="shortcutAt"',
  '  label="Release slot"',
  '  placeholder="Pick date and time"',
  '  :minute-step="15"',
  '  :shortcuts="dateTimeShortcuts"',
  '/>'
].join('\n')

const disabledCode = [
  '<YDateTimePicker',
  '  v-model="reviewAt"',
  '  label="Review window"',
  '  placeholder="Weekday before 18:00"',
  '  :minute-step="30"',
  '  :disabled-date="disableWeekends"',
  '  :disabled-time="disableAfterWork"',
  '/>'
].join('\n')

const validationCode = [
  '<YDateTimePicker',
  '  id="release-date-time"',
  '  v-model="requiredAt"',
  '  label="Release date time"',
  '  placeholder="Required before release"',
  '  aria-describedby="release-date-time-help"',
  '  :minute-step="15"',
  '  :error="requiredAtError"',
  '  @change="handleRequiredDateTimeChange"',
  '/>',
  '<p id="release-date-time-help">Choose a release date and time before publishing.</p>'
].join('\n')

const disableWeekends: YDateTimePickerDisabledDate = (date) => date.getDay() === 0 || date.getDay() === 6
const disableAfterWork: YDateTimePickerDisabledTime = (time) => time.hour >= 18

function handleReviewChange(value: string) {
  dateTimeState.value = value ? `Review window: ${value}` : '等待选择评审时间'
}

function handleRequiredDateTimeChange(value: string) {
  requiredAtError.value = value ? '' : 'Release date time is required.'
}
</script>

# Date Time Picker

Date Time Picker 用于选择单个日期时间，适合发布排期、预约窗口、审核节点和后台筛选条件。

当前版本使用 `YYYY-MM-DD HH:mm` 字符串作为值，支持快捷日期时间、禁用日期、禁用时间、清空、表单错误和键盘操作。

::: tip TIP
`YDateTimePicker` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic date time {#date-time-picker-basic-date-time}

<DocDemo
  title="Basic date time"
  description="基础日期时间选择返回稳定的 YYYY-MM-DD HH:mm 字符串，适合表单提交和接口参数。"
  :code="basicCode"
  :setup="dateTimePickerCodeSetup"
  :usage="['YYYY-MM-DD HH:mm', 'v-model', 'minuteStep']"
>
  <YDateTimePicker v-model="releaseAt" label="Release at" :minute-step="15" />
  <p class="demo-note">Selected: {{ releaseAt }}</p>
</DocDemo>

## Shortcuts {#date-time-picker-shortcuts}

<DocDemo
  title="Shortcuts"
  description="快捷项适合评审、上线和维护窗口等高频业务时间点，也可以用函数生成实时值。"
  :code="shortcutCode"
  :setup="dateTimePickerCodeSetup"
  :usage="['shortcuts', 'factory value', 'description']"
>
  <YDateTimePicker
    v-model="shortcutAt"
    label="Release slot"
    placeholder="Pick date and time"
    :minute-step="15"
    :shortcuts="dateTimeShortcuts"
  />
  <p class="demo-note">Selected: {{ shortcutAt || 'none' }}</p>
</DocDemo>

## Disabled date and time {#date-time-picker-disabled-date-and-time}

<DocDemo
  title="Disabled date and time"
  description="同时禁用日期和时间，适合排除周末、下班后、冻结期或不可预约窗口。"
  :code="disabledCode"
  :setup="dateTimePickerCodeSetup"
  :usage="['disabledDate', 'disabledTime', 'change']"
>
  <YDateTimePicker
    v-model="reviewAt"
    label="Review window"
    placeholder="Weekday before 18:00"
    :minute-step="30"
    :disabled-date="disableWeekends"
    :disabled-time="disableAfterWork"
    @change="handleReviewChange"
  />
  <p class="demo-note">{{ dateTimeState }}</p>
</DocDemo>

## Form validation {#date-time-picker-form-validation}

<DocDemo
  title="Form validation"
  description="日期时间字段接入表单校验时，应把帮助文本、错误文本、字段 id 和面板事件放入同一条可追踪链路。"
  :code="validationCode"
  :setup="dateTimePickerCodeSetup"
  :usage="['id', 'ariaDescribedby', 'error', 'visibleChange']"
>
  <YDateTimePicker
    id="release-date-time"
    v-model="requiredAt"
    label="Release date time"
    placeholder="Required before release"
    aria-describedby="release-date-time-help"
    :minute-step="15"
    :error="requiredAtError"
    @change="handleRequiredDateTimeChange"
  />
  <p id="release-date-time-help" class="demo-note">Choose a release date and time before publishing.</p>
</DocDemo>

## Usage notes {#date-time-picker-usage-notes}

- 值使用 `YYYY-MM-DD HH:mm`，便于表单、查询参数、配置文件和接口提交。
- `minuteStep` 会影响分钟列粒度，建议使用 5、10、15 或 30 这类能整除 60 的值。
- `shortcuts` 应返回完整日期时间字符串，适合发布窗口、维护窗口、审核节点等业务 preset。
- `disabledDate` 和 `disabledTime` 应保持纯函数，避免在面板渲染时触发副作用。
- `size` 未显式传入时会读取 `YConfigProvider`，适合和 Input、Select、Date Picker、Time Picker 保持同一表单密度。
- 表单容器接入时建议传入稳定 `id` 和 `ariaDescribedby`，让帮助文本、错误文本与内部输入框建立可审计关联。
- 弹层打开关闭可以监听 `visibleChange`，适合埋点、自动保存草稿和调试复杂表单焦点路径。
- 移动端建议使用短标签、短占位和较粗分钟粒度，避免日期时间面板操作过密。
- 键盘路径应覆盖打开面板、移动日期、切换小时、移动分钟、确认当前日期时间和关闭面板。

## Date Time Picker API {#date-time-picker-api}

<ComponentApiSection name="YDateTimePicker" />

## Accessibility {#accessibility}

- 输入框使用原生 `input`，设置 `aria-expanded`、`aria-controls` 和 `aria-haspopup="dialog"`。
- 日期时间弹层使用 `role="dialog"`，日期区域使用 `role="grid"`。
- 小时和分钟列使用 `role="listbox"`，选项使用 `role="option"` 和 `aria-selected`。
- 快捷项使用命名按钮组，禁用快捷项同步原生 `disabled`。
- 错误信息使用 `role="alert"`，输入框同步设置 `aria-invalid`。
