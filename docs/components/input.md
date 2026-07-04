<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const value = ref('Yok UI')
const searchValue = ref('component')
const passwordValue = ref('yok-ui-secret')
const releaseForm = reactive<Record<string, string>>({
  componentName: ''
})
const releaseRules: Record<string, YFormRule | YFormRule[]> = {
  componentName: {
    validator: (value) => value.trim().length > 0 || '组件名称不能为空。',
    trigger: 'change'
  }
}

const inputCodeSetup = [
  "import { ref } from 'vue'",
  "import { YInput } from '@yok-ui/core'",
  '',
  "const value = ref('Yok UI')",
  "const searchValue = ref('component')",
  "const passwordValue = ref('yok-ui-secret')"
].join('\n')

const basicCode = '<YInput v-model="value" label="Library name" placeholder="Enter name" />'

const statesCode = `<template>
  <YInput model-value="" label="Project name" error="Project name is required" />
  <YInput model-value="Readonly plan" label="Plan" disabled />
</template>`

const advancedCode = [
  '<YInput',
  '  v-model="searchValue"',
  '  type="search"',
  '  label="Search components"',
  '  placeholder="Button, table or owner"',
  '  prefix-text="/"',
  '  clearable',
  '  show-count',
  '  :maxlength="24"',
  '/>'
].join('\n')

const passwordCode = [
  '<YInput',
  '  v-model="passwordValue"',
  '  type="password"',
  '  label="Access token"',
  '  placeholder="Enter token"',
  '  show-password',
  '  autocomplete="current-password"',
  '/>'
].join('\n')

const formValidationSetup = [
  "import { reactive } from 'vue'",
  "import { YForm, YFormItem, YInput, type YFormRule } from '@yok-ui/core'",
  '',
  'const releaseForm = reactive<Record<string, string>>({',
  "  componentName: ''",
  '})',
  'const releaseRules: Record<string, YFormRule | YFormRule[]> = {',
  '  componentName: {',
  "    validator: (value) => value.trim().length > 0 || '组件名称不能为空。',",
  "    trigger: 'change'",
  '  }',
  '}'
].join('\n')

const formValidationCode = [
  '<YForm :model="releaseForm" :rules="releaseRules">',
  '  <YFormItem prop="componentName" label="Component name" required v-slot="{ error, invalid, labelFor, messageId, validate }">',
  '    <YInput',
  '      :id="labelFor"',
  '      :model-value="releaseForm.componentName"',
  '      placeholder="YButton"',
  '      clearable',
  '      show-count',
  '      :maxlength="24"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  '      @update:model-value="(value) => { releaseForm.componentName = value; validate(\'change\') }"',
  '    />',
  '    <p v-if="error" class="demo-note">{{ error }}</p>',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Input

输入框用于收集短文本。默认风格强调轻边框、清晰 label 和柔和 focus 状态，适合表单、筛选栏和设置页。

## Examples

<DocDemo
  title="Basic input"
  description="使用 v-model 绑定单行文本，label 会和输入框组成稳定的表单语义。"
  :code="basicCode"
  :setup="inputCodeSetup"
  :usage="['v-model', 'label', 'placeholder']"
>
  <YInput v-model="value" label="Library name" placeholder="Enter name" />
  <p class="demo-note">Current value: {{ value }}</p>
</DocDemo>

<DocDemo
  title="Clearable search and count"
  description="搜索、清空和字数计数是表单页、筛选栏、设置页最常见的输入组合。"
  :code="advancedCode"
  :setup="inputCodeSetup"
  :usage="['type', 'prefixText', 'clearable', 'showCount', 'maxlength']"
>
  <YInput
    v-model="searchValue"
    type="search"
    label="Search components"
    placeholder="Button, table or owner"
    prefix-text="/"
    clearable
    show-count
    :maxlength="24"
  />
  <p class="demo-note">Search value: {{ searchValue || 'empty' }}</p>
</DocDemo>

<DocDemo
  title="Password"
  description="密码和令牌输入可以开启 show-password，让用户在受控场景下确认内容，同时保留原生 password 类型和 autocomplete。"
  :code="passwordCode"
  :setup="inputCodeSetup"
  :usage="['type=password', 'showPassword', 'autocomplete']"
>
  <YInput
    v-model="passwordValue"
    type="password"
    label="Access token"
    placeholder="Enter token"
    show-password
    autocomplete="current-password"
  />
  <p class="demo-note">Length: {{ passwordValue.length }}</p>
</DocDemo>

<DocDemo
  title="Validation and disabled state"
  description="error 会同步错误文案和 aria-invalid；disabled 用于不可编辑但仍需展示的字段。"
  :code="statesCode"
  :setup="inputCodeSetup"
  :usage="['error', 'aria-invalid', 'disabled']"
>
  <div class="docs-demo-grid">
    <YInput model-value="" label="Project name" error="Project name is required" />
    <YInput model-value="Readonly plan" label="Plan" disabled />
  </div>
</DocDemo>

## Form Validation

<DocDemo
  title="Form validation"
  description="结合 YFormItem slot 提供的 labelFor、messageId 和 validate，把输入、错误文案、校验触发绑定在同一条数据流里。"
  :code="formValidationCode"
  :setup="formValidationSetup"
  :usage="['YFormItem', 'validate', 'aria-describedby']"
>
  <YForm :model="releaseForm" :rules="releaseRules">
    <YFormItem prop="componentName" label="Component name" required v-slot="{ error, invalid, labelFor, messageId, validate }">
      <YInput
        :id="labelFor"
        :model-value="releaseForm.componentName"
        placeholder="YButton"
        clearable
        show-count
        :maxlength="24"
        :invalid="invalid"
        :aria-describedby="messageId"
        @update:model-value="(value) => { releaseForm.componentName = value; validate('change') }"
      />
      <p v-if="error" class="demo-note">{{ error }}</p>
    </YFormItem>
  </YForm>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="input"
  title="在线编辑 Input 示例"
  description="运行器会渲染安全白名单内的 Input 模板，适合快速调整 label、placeholder、错误态和默认值。"
/>

## API

<ComponentApiSection name="YInput" />

## Accessibility

- 组件使用原生 `input`，并在有 label 时提供稳定的可读标签。
- 错误状态会设置 `aria-invalid="true"`，错误文案使用 `role="alert"`。
- 在 `YFormItem` 中使用时，建议把 slot 提供的 `labelFor` 和 `messageId` 传给 `id` 与 `aria-describedby`。
- `clearable` 会触发 `update:modelValue`、`change` 和 `clear`，方便表单和筛选栏同步状态。
