<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const enabled = ref(true)
const releaseForm = reactive<Record<string, unknown>>({
  confirmed: false
})
const releaseRules: Record<string, YFormRule | YFormRule[]> = {
  confirmed: {
    validator: (value) => value === true || '发布前需要开启确认开关。',
    trigger: 'change'
  }
}
const switchSetup = [
  "import { ref } from 'vue'",
  "import { YSwitch } from '@yok-ui/core'",
  '',
  'const enabled = ref(true)'
].join('\n')
const switchCode = [
  '<YSwitch',
  '  v-model="enabled"',
  '  label="Enable fresh cute mode"',
  '  description="开启后会使用更柔和的反馈状态。"',
  '  active-text="Enabled"',
  '  inactive-text="Disabled"',
  '/>'
].join('\n')
const switchFormSetup = [
  "import { reactive } from 'vue'",
  "import { YForm, YFormItem, YSwitch, type YFormRule } from '@yok-ui/core'",
  '',
  'const releaseForm = reactive<Record<string, unknown>>({',
  '  confirmed: false',
  '})',
  'const releaseRules: Record<string, YFormRule | YFormRule[]> = {',
  '  confirmed: {',
  "    validator: (value) => value === true || '发布前需要开启确认开关。',",
  "    trigger: 'change'",
  '  }',
  '}'
].join('\n')
const switchFormCode = [
  '<YForm :model="releaseForm" :rules="releaseRules">',
  '  <YFormItem prop="confirmed" label="Release confirmation" required v-slot="{ error, invalid, messageId, validate }">',
  '    <YSwitch',
  '      :model-value="releaseForm.confirmed as boolean"',
  '      label="Allow release"',
  '      description="发布前必须确认该开关，change 后会触发表单校验。"',
  '      active-text="Ready"',
  '      inactive-text="Required"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  "      @update:model-value=\"(value) => { releaseForm.confirmed = value; validate('change') }\"",
  '    />',
  '    <p v-if="error" class="demo-note">{{ error }}</p>',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Switch

Switch 用于开关类设置，比 checkbox 更适合即时生效的二元状态。

## Example

<DocDemo
  id="switch-basic"
  title="Basic switch"
  description="用于即时生效的二元设置，比 checkbox 更适合开关类偏好。"
  :code="switchCode"
  :setup="switchSetup"
>
  <YSwitch
    v-model="enabled"
    label="Enable fresh cute mode"
    description="开启后会使用更柔和的反馈状态。"
    active-text="Enabled"
    inactive-text="Disabled"
  />
</DocDemo>

## Form Validation

<DocDemo
  id="switch-form-validation"
  title="Form validation"
  description="发布确认类开关可以与 FormItem 配合，在 change 后触发表单校验和错误提示。"
  :code="switchFormCode"
  :setup="switchFormSetup"
>
  <YForm :model="releaseForm" :rules="releaseRules">
    <YFormItem prop="confirmed" label="Release confirmation" required v-slot="{ error, invalid, messageId, validate }">
      <YSwitch
        :model-value="releaseForm.confirmed as boolean"
        label="Allow release"
        description="发布前必须确认该开关，change 后会触发表单校验。"
        active-text="Ready"
        inactive-text="Required"
        :invalid="invalid"
        :aria-describedby="messageId"
        @update:model-value="(value) => { releaseForm.confirmed = value; validate('change') }"
      />
      <p v-if="error" class="demo-note">{{ error }}</p>
    </YFormItem>
  </YForm>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="switch"
  title="在线编辑 Switch 示例"
  description="适合即时生效设置项，检查开关状态和标签文案是否清晰。"
/>

## API

<ComponentApiSection name="YSwitch" />

## Accessibility

- 组件使用 `role="switch"` 和 `aria-checked` 表达状态，可通过键盘聚焦。
- 与 `YFormItem` 配合时，应把 `invalid` 和 `messageId` 传给 `YSwitch`，并在 change 后调用 `validate('change')`。
- 加载状态会设置 `aria-busy` 并阻止重复切换，适合异步保存开关设置。
