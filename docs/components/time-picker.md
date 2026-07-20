<script setup lang="ts">
import { ref } from 'vue'
import type { YTimePickerOption } from '@yok-ui/core'

const startTime = ref('09:30')
const meetingTime = ref('10:00')
const reviewTime = ref('')
const requiredTime = ref('')
const timeState = ref('等待选择评审时间')
const requiredTimeError = ref('Release time is required.')

const basicCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  '',
  "const startTime = ref('09:30')",
  '</' + 'script>',
  '',
  '<template>',
  '  <YTimePicker v-model="startTime" label="Start time" />',
  '</template>'
].join('\n')

const stepSetup = `import { ref } from 'vue'
import { YTimePicker } from '@yok-ui/core'

const meetingTime = ref('10:00')`

const stepCode = [
  '<template>',
  '  <YTimePicker v-model="meetingTime" label="Meeting time" :minute-step="15" />',
  '</template>'
].join('\n')

const disabledCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import type { YTimePickerOption } from '@yok-ui/core'",
  '',
  "const reviewTime = ref('')",
  '',
  'function disableAfterWork(time: YTimePickerOption) {',
  '  return time.hour >= 18',
  '}',
  '</' + 'script>',
  '',
  '<template>',
  '  <YTimePicker',
  '    v-model="reviewTime"',
  '    label="Review time"',
  '    placeholder="Before 18:00"',
  '    :minute-step="30"',
  '    :disabled-time="disableAfterWork"',
  '  />',
  '</template>'
].join('\n')

const validationCode = [
  '<script setup lang="ts">',
  "import { computed, ref } from 'vue'",
  '',
  "const requiredTime = ref('')",
  "const requiredTimeError = computed(() => requiredTime.value ? '' : 'Release time is required.')",
  '</' + 'script>',
  '',
  '<template>',
  '  <YTimePicker',
  '    id="release-required-time"',
  '    v-model="requiredTime"',
  '    label="Release time"',
  '    placeholder="Required before release"',
  '    aria-describedby="release-required-time-help"',
  '    :minute-step="15"',
  '    :error="requiredTimeError"',
  '  />',
  '  <p id="release-required-time-help">Choose a release time before publishing.</p>',
  '</template>'
].join('\n')

function disableAfterWork(time: YTimePickerOption) {
  return time.hour >= 18
}

function handleReviewTime(value: string) {
  timeState.value = value ? `Review time: ${value}` : '等待选择评审时间'
}

function handleRequiredTimeChange(value: string) {
  requiredTimeError.value = value ? '' : 'Release time is required.'
}
</script>

# Time Picker

Time Picker 用于选择单个时间，适合排期、预约、发布设置和后台筛选条件。

当前版本使用 `HH:mm` 字符串作为值，支持分钟步长、清空、禁用时间和键盘操作。日期时间组合、秒级选择和时间范围会作为后续增强。

::: tip TIP
`YTimePicker` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic time {#time-picker-basic-time}

<DocDemo
  title="Basic time"
  description="基础时间选择返回稳定的 HH:mm 字符串，适合表单提交和筛选条件。"
  :code="basicCode"
  :usage="['HH:mm', 'v-model', 'clearable']"
>
  <YTimePicker v-model="startTime" label="Start time" />
  <p class="demo-note">Selected: {{ startTime }}</p>
</DocDemo>

## Minute step {#time-picker-minute-step}

<DocDemo
  title="Minute step"
  description="通过 minuteStep 控制分钟粒度，常用于会议、预约和排班。"
  :code="stepCode"
  :setup="stepSetup"
  :usage="['minuteStep', '15 minutes', 'bounded options']"
>
  <YTimePicker v-model="meetingTime" label="Meeting time" :minute-step="15" />
  <p class="demo-note">Selected: {{ meetingTime }}</p>
</DocDemo>

## Disabled time {#time-picker-disabled-time}

<DocDemo
  title="Disabled time"
  description="禁用规则适合限制营业时间、值班窗口或发布冻结期。"
  :code="disabledCode"
  :usage="['disabledTime', 'minuteStep', 'change']"
>
  <YTimePicker
    v-model="reviewTime"
    label="Review time"
    placeholder="Before 18:00"
    :minute-step="30"
    :disabled-time="disableAfterWork"
    @change="handleReviewTime"
  />
  <p class="demo-note">{{ timeState }}</p>
</DocDemo>

## Form validation {#time-picker-form-validation}

<DocDemo
  title="Form validation"
  description="时间字段接入表单校验时，应把帮助文本、错误文本和内部 input 关联起来，并让面板打开关闭可被事件日志复现。"
  :code="validationCode"
  :usage="['id', 'ariaDescribedby', 'error', 'visibleChange']"
>
  <YTimePicker
    id="release-required-time"
    v-model="requiredTime"
    label="Release time"
    placeholder="Required before release"
    aria-describedby="release-required-time-help"
    :minute-step="15"
    :error="requiredTimeError"
    @change="handleRequiredTimeChange"
  />
  <p id="release-required-time-help" class="demo-note">Choose a release time before publishing.</p>
</DocDemo>

## Usage notes {#time-picker-usage-notes}

- 使用 `HH:mm` 字符串可以让时间字段直接进入表单、查询参数和配置文件。
- `minuteStep` 会影响分钟列的可选项，建议使用能整除 60 的值。
- `disabledTime` 应保持纯函数，根据 `hour`、`minute` 和 `value` 判定是否禁用。
- `size` 未显式传入时会读取 `YConfigProvider`，适合和 Date Picker、Input、Select 保持同一表单密度。
- 会议、预约和排班场景建议优先使用 15 或 30 分钟步长，避免给用户过多无效时间点。
- 表单校验错误应写入 `error`，并让错误文案说明业务原因，例如必填、冲突或已过期。
- 表单容器接入时建议传入稳定 `id` 和 `ariaDescribedby`，让帮助文本、错误文本与内部输入框建立可审计关联。
- 弹层打开关闭可以监听 `visibleChange`，适合埋点、自动保存草稿和调试复杂表单焦点路径。
- 移动端场景应使用短标签、短占位和较粗时间粒度，避免时间面板在窄屏里变成密集操作。
- 键盘路径应覆盖打开面板、切换小时、移动分钟、确认当前时间和关闭面板。
- 当前组件聚焦单时间点；范围时间和日期时间组合后续以独立组件补齐。

## Time Picker API {#time-picker-api}

<ComponentApiSection name="YTimePicker" />

## Accessibility {#accessibility}

- 输入框使用原生 `input`，设置 `aria-expanded`、`aria-controls` 和 `aria-haspopup="dialog"`。
- 时间弹层使用 `role="dialog"`。
- 小时和分钟列使用 `role="listbox"`，选项使用 `role="option"` 和 `aria-selected`。
- 错误信息使用 `role="alert"`，输入框同步设置 `aria-invalid`。
