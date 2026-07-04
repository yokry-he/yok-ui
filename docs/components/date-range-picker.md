<script setup lang="ts">
import { ref } from 'vue'
import type { YDateRangeShortcut, YDateRangeValue } from '@yok-ui/core'

const sprintRange = ref<YDateRangeValue>(['2026-06-13', '2026-06-20'])
const shortcutRange = ref<YDateRangeValue>([])
const bookingRange = ref<YDateRangeValue>([])
const requiredRange = ref<YDateRangeValue>([])
const rangeState = ref('等待选择预约窗口')
const requiredRangeError = ref('Select a complete release window.')
const rangeShortcuts: YDateRangeShortcut[] = [
  { label: 'Sprint', value: ['2026-06-13', '2026-06-20'] },
  { label: 'Release week', value: () => ['2026-07-01', '2026-07-07'], time: '20:30-09:00', description: 'Night release freeze' },
  { label: 'Planning', value: ['2026-06-24', '2026-06-26'], time: '10:00-17:00', description: 'Roadmap workshop' }
]

const dateRangePickerCodeSetup = [
  "import { ref } from 'vue'",
  "import { YDateRangePicker, type YDateRangeShortcut, type YDateRangeValue } from '@yok-ui/core'",
  '',
  "const sprintRange = ref<YDateRangeValue>(['2026-06-13', '2026-06-20'])",
  'const shortcutRange = ref<YDateRangeValue>([])',
  'const bookingRange = ref<YDateRangeValue>([])',
  'const requiredRange = ref<YDateRangeValue>([])',
  "const requiredRangeError = ref('Select a complete release window.')",
  'const rangeShortcuts: YDateRangeShortcut[] = [',
  "  { label: 'Sprint', value: ['2026-06-13', '2026-06-20'] },",
  "  { label: 'Release week', value: () => ['2026-07-01', '2026-07-07'], time: '20:30-09:00', description: 'Night release freeze' },",
  "  { label: 'Planning', value: ['2026-06-24', '2026-06-26'], time: '10:00-17:00', description: 'Roadmap workshop' }",
  ']',
  '',
  'function disablePast(date: Date) {',
  '  return date < new Date(2026, 5, 13)',
  '}',
  '',
  'function handleRequiredRangeChange(value: YDateRangeValue) {',
  "  requiredRangeError.value = value.length === 2 ? '' : 'Select a complete release window.'",
  '}'
].join('\n')

const basicCode = '<YDateRangePicker v-model="sprintRange" label="Sprint range" />'

const shortcutCode = [
  '<YDateRangePicker v-model="shortcutRange" label="Sprint range" :shortcuts="rangeShortcuts" />'
].join('\n')

const disabledCode = [
  '<YDateRangePicker',
  '  v-model="bookingRange"',
  '  label="Booking window"',
  '  placeholder="Choose a date range"',
  '  :disabled-date="disablePast"',
  '/>'
].join('\n')

const validationCode = [
  '<YDateRangePicker',
  '  id="release-window"',
  '  v-model="requiredRange"',
  '  label="Release window"',
  '  placeholder="Choose a complete range"',
  '  aria-describedby="release-window-help"',
  '  :error="requiredRangeError"',
  '  @change="handleRequiredRangeChange"',
  '/>',
  '<p id="release-window-help">Pick both start and end dates before publishing.</p>'
].join('\n')

function disablePast(date: Date) {
  return date < new Date(2026, 5, 13)
}

function handleBookingChange(value: YDateRangeValue) {
  rangeState.value = value.length === 2 ? `Booking: ${value[0]} to ${value[1]}` : '等待选择预约窗口'
}

function handleRequiredRangeChange(value: YDateRangeValue) {
  requiredRangeError.value = value.length === 2 ? '' : 'Select a complete release window.'
}
</script>

# Date Range Picker

Date Range Picker 用于选择开始日期和结束日期，适合报表筛选、预约周期、发布窗口和后台任务区间。

当前版本聚焦单月范围选择：使用 `[start, end]` 数组作为值，选择完整范围后提交，支持清空、禁用日期、快捷范围、范围高亮和键盘导航。

## Example

<DocDemo
  title="Basic range"
  description="基础范围选择返回两个 YYYY-MM-DD 字符串，适合冲刺、报表和发布窗口。"
  :code="basicCode"
  :setup="dateRangePickerCodeSetup"
  :usage="['YDateRangeValue', 'v-model', 'separator']"
>
  <YDateRangePicker v-model="sprintRange" label="Sprint range" />
  <p class="demo-note">Selected: {{ sprintRange.join(' to ') }}</p>
</DocDemo>

<DocDemo
  title="Range shortcuts"
  description="快捷范围适合冲刺周期、发布周、规划期等业务常用区间，也可以展示时间窗口和业务说明。"
  :code="shortcutCode"
  :setup="dateRangePickerCodeSetup"
  :usage="['shortcuts', 'static range', 'factory range', 'time window']"
>
  <YDateRangePicker v-model="shortcutRange" label="Sprint range" :shortcuts="rangeShortcuts" />
  <p class="demo-note">Selected: {{ shortcutRange.length ? shortcutRange.join(' to ') : 'none' }}</p>
</DocDemo>

<DocDemo
  title="Disabled dates"
  description="禁用日期可以排除过去日期、维护窗口或不可预约区间。"
  :code="disabledCode"
  :setup="dateRangePickerCodeSetup"
  :usage="['disabledDate', 'change', 'placeholder']"
>
  <YDateRangePicker
    v-model="bookingRange"
    label="Booking window"
    placeholder="Choose a date range"
    :disabled-date="disablePast"
    @change="handleBookingChange"
  />
  <p class="demo-note">{{ rangeState }}</p>
</DocDemo>

<DocDemo
  title="Form validation"
  description="日期范围校验需要同时表达完整范围、帮助文本、错误文本和面板可见状态，避免用户只看到红框却不知道缺少结束日期。"
  :code="validationCode"
  :setup="dateRangePickerCodeSetup"
  :usage="['id', 'ariaDescribedby', 'error', 'visibleChange']"
>
  <YDateRangePicker
    id="release-window"
    v-model="requiredRange"
    label="Release window"
    placeholder="Choose a complete range"
    aria-describedby="release-window-help"
    :error="requiredRangeError"
    @change="handleRequiredRangeChange"
  />
  <p id="release-window-help" class="demo-note">Pick both start and end dates before publishing.</p>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="dateRangePicker"
  title="在线编辑 Date Range Picker 示例"
  description="运行器支持常规范围、快捷范围、未完成范围、禁用日期、发布冲突、只读归档、移动范围和键盘范围，可快速验证日期区间字段。"
/>

## Usage notes

- 值使用 `[start, end]`，两个值均为 `YYYY-MM-DD` 字符串，便于查询参数和接口提交。
- 用户只选择第一个日期时组件不会提交完整范围，第二次选择后才触发完整值。
- `shortcuts` 可以返回固定范围或函数生成的范围，适合“本周”“发布周”等业务区间；`time` 和 `description` 用于表达“20:30-09:00 冻结窗口”这类带时间的范围 preset。
- `size` 未显式传入时会读取 `YConfigProvider`，适合和 Date Picker、Time Picker、Cascader 保持同一筛选表单密度。
- 表单容器接入时建议传入稳定 `id` 和 `ariaDescribedby`，让帮助文本、错误文本与内部输入框建立可审计关联。
- 弹层打开关闭可以监听 `visibleChange`，适合埋点、焦点路径调试和复杂筛选面板联动。
- Live example 覆盖快捷项、未完成范围、禁用日期、错误冲突、只读归档、移动范围和键盘范围；文档变更时应同时验证草稿态、禁用规则、错误提示、禁用回填、窄屏分隔符和键盘路径。
- 键盘范围场景应能说明 `Enter` / `Space` 打开日历，方向键移动日期，`PageUp` / `PageDown` 切换月份，`Escape` 关闭弹层。
- 大跨度、多月联动和预设范围面板可作为后续高级能力，不混入当前基础行为。

## Live workflow

- “未完成范围”场景用于检查只选开始日期时的草稿态、结束日期提示和未完成说明。
- “禁用日期”场景用于检查 `disabledDate` 纯函数对过去日期或不可预约日期的禁用策略。
- “发布冲突”场景用于检查错误态是否能解释业务冲突，而不只依赖红色边框。
- “键盘范围”场景用于检查打开、移动日期、切换月份、选择范围和关闭弹层的完整键盘路径。

## API

<ComponentApiSection name="YDateRangePicker" />

## Accessibility

- 输入框使用原生 `input`，设置 `aria-expanded`、`aria-controls` 和 `aria-haspopup="dialog"`。
- 日历弹层使用 `role="dialog"`，日期区域使用 `role="grid"`。
- 快捷项使用命名按钮组，禁用快捷项同步原生 `disabled`。
- 日期按钮使用 `role="gridcell"` 和 `aria-selected` 表示范围起止点。
- 禁用日期同步设置 `disabled`，错误信息使用 `role="alert"`。
