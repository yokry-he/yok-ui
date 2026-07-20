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

::: tip TIP
`YSwitch` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic switch {#switch-basic-switch}

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

## Form Validation {#switch-form-validation}

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

## Switch API {#switch-api}

<ComponentApiSection name="YSwitch" />

## Accessibility {#accessibility}

- 组件使用 `role="switch"` 和 `aria-checked` 表达状态，可通过键盘聚焦。
- 与 `YFormItem` 配合时，应把 `invalid` 和 `messageId` 传给 `YSwitch`，并在 change 后调用 `validate('change')`。
- 加载状态会设置 `aria-busy` 并阻止重复切换，适合异步保存开关设置。
