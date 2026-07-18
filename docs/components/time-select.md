<script setup lang="ts">
import { ref } from 'vue'

const startTime = ref('09:00')
const reviewTime = ref('10:30')
const startRangeTime = ref('09:00')
const endRangeTime = ref('17:30')
const requiredTime = ref('')
const requiredTimeError = ref('Start time is required.')

const basicCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  '',
  "const startTime = ref('09:00')",
  '</' + 'script>',
  '',
  '<template>',
  '  <YTimeSelect',
  '    v-model="startTime"',
  '    label="Start time"',
  '    start="08:30"',
  '    end="18:30"',
  '    step="00:15"',
  '  />',
  '</template>'
].join('\n')

const formatCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  '',
  "const reviewTime = ref('10:30')",
  '</' + 'script>',
  '',
  '<template>',
  '  <YTimeSelect',
  '    v-model="reviewTime"',
  '    label="Review time"',
  '    start="08:00"',
  '    end="18:00"',
  '    step="00:30"',
  '    format="hh:mm A"',
  '  />',
  '</template>'
].join('\n')

const rangeCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  '',
  "const startRangeTime = ref('09:00')",
  "const endRangeTime = ref('17:30')",
  '</' + 'script>',
  '',
  '<template>',
  '  <div class="demo-grid">',
  '    <YTimeSelect',
  '      v-model="startRangeTime"',
  '      label="Start"',
  '      start="08:30"',
  '      end="18:30"',
  '      step="00:30"',
  '      :max-time="endRangeTime"',
  '    />',
  '    <YTimeSelect',
  '      v-model="endRangeTime"',
  '      label="End"',
  '      start="08:30"',
  '      end="18:30"',
  '      step="00:30"',
  '      :min-time="startRangeTime"',
  '    />',
  '  </div>',
  '</template>'
].join('\n')

const validationCode = [
  '<script setup lang="ts">',
  "import { computed, ref } from 'vue'",
  '',
  "const requiredTime = ref('')",
  "const requiredTimeError = computed(() => requiredTime.value ? '' : 'Start time is required.')",
  '</' + 'script>',
  '',
  '<template>',
  '  <YTimeSelect',
  '    id="release-start-time"',
  '    v-model="requiredTime"',
  '    label="Start time"',
  '    start="08:30"',
  '    end="18:30"',
  '    step="00:15"',
  '    placeholder="Required before release"',
  '    aria-describedby="release-start-time-help"',
  '    :error="requiredTimeError"',
  '  />',
  '  <p id="release-start-time-help">Choose a start time before publishing.</p>',
  '</template>'
].join('\n')

function handleRequiredTimeChange(value: string) {
  requiredTimeError.value = value ? '' : 'Start time is required.'
}
</script>

# Time Select

Time Select 用于从固定时间列表中选择单个 `HH:mm` 值，适合预约、排班、营业时间、后台筛选和开始/结束时间联动。

它对标主流组件库的固定时间选择模式：用 `start`、`end` 和 `step` 生成选项，用 `minTime` / `maxTime` 做范围联动，底层复用 `YSelect` 的 combobox、listbox、键盘路径和 Floating UI 定位。

::: tip TIP
`YTimeSelect` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Fixed time list {#time-select-fixed-time-list}

<DocDemo
  title="Fixed time list"
  description="用 start、end 和 step 生成固定时间列表，选择结果始终返回 HH:mm 字符串。"
  :code="basicCode"
  :usage="['start', 'end', 'step', 'v-model']"
>
  <YTimeSelect
    v-model="startTime"
    label="Start time"
    start="08:30"
    end="18:30"
    step="00:15"
  />
  <p class="demo-note">Selected: {{ startTime }}</p>
</DocDemo>

## 12-hour labels {#time-select-12-hour-labels}

<DocDemo
  title="12-hour labels"
  description="format 只影响选项展示，提交值仍保持 HH:mm，方便和后端或查询参数对齐。"
  :code="formatCode"
  :usage="['format', 'hh:mm A', 'HH:mm value']"
>
  <YTimeSelect
    v-model="reviewTime"
    label="Review time"
    start="08:00"
    end="18:00"
    step="00:30"
    format="hh:mm A"
  />
  <p class="demo-note">Submitted value: {{ reviewTime }}</p>
</DocDemo>

## Fixed time range {#time-select-fixed-time-range}

<DocDemo
  title="Fixed time range"
  description="开始时间和结束时间可以互相约束，避免用户选择反向时间段。"
  :code="rangeCode"
  :usage="['minTime', 'maxTime', 'linked range']"
>
  <div class="demo-grid">
    <YTimeSelect
      v-model="startRangeTime"
      label="Start"
      start="08:30"
      end="18:30"
      step="00:30"
      :max-time="endRangeTime"
    />
    <YTimeSelect
      v-model="endRangeTime"
      label="End"
      start="08:30"
      end="18:30"
      step="00:30"
      :min-time="startRangeTime"
    />
  </div>
  <p class="demo-note">Range: {{ startRangeTime }} - {{ endRangeTime }}</p>
</DocDemo>

## Form validation {#time-select-form-validation}

<DocDemo
  title="Form validation"
  description="固定时间选择也应接入稳定 id、帮助文本、错误文本和 visibleChange 事件，保证表单链路可审计。"
  :code="validationCode"
  :usage="['id', 'ariaDescribedby', 'error', 'visibleChange']"
>
  <YTimeSelect
    id="release-start-time"
    v-model="requiredTime"
    label="Start time"
    start="08:30"
    end="18:30"
    step="00:15"
    placeholder="Required before release"
    aria-describedby="release-start-time-help"
    :error="requiredTimeError"
    @change="handleRequiredTimeChange"
  />
  <p id="release-start-time-help" class="demo-note">Choose a start time before publishing.</p>
</DocDemo>

## Usage notes {#time-select-usage-notes}

- `start`、`end` 和 `step` 都使用 `HH:mm` 字符串，`step="00:15"` 表示每 15 分钟一个选项。
- `modelValue` 始终保持 `HH:mm`，`format="hh:mm A"` 只改变用户看到的选项标签。
- `minTime` 会禁用小于等于该时间的选项，`maxTime` 会禁用大于等于该时间的选项，适合开始/结束时间组合。
- 固定营业时间、预约时间和后台筛选建议优先使用 Time Select；需要自由选择小时/分钟时再使用 Time Picker。
- 表单校验错误应写入 `error`，并通过 `id` / `ariaDescribedby` 关联帮助文本和错误信息。
- 组件继承 `YSelect` 的 Floating UI 弹层定位、combobox 语义和键盘操作路径。

## Time Select API {#time-select-api}

<ComponentApiSection name="YTimeSelect" />

## Accessibility {#accessibility}

- 触发区域复用 `YSelect` 的 `role="combobox"`，选项列表使用 `role="listbox"`。
- 每个时间选项使用 `role="option"` 和 `aria-selected`；由 `minTime` / `maxTime` 禁用的选项同步设置 disabled 与 `aria-disabled`。
- 错误信息通过 `error` 暴露给底层 Select，触发区域同步设置 `aria-invalid`。
- 无可见标签时应传入 `ariaLabel`，保证 combobox 有稳定可访问名称。
