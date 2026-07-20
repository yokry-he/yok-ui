<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const value = ref('product')
const releaseForm = reactive<Record<string, unknown>>({
  packageName: ''
})
const options = [
  { label: 'Core', value: 'core', description: '基础组件和主题 token。' },
  { label: 'Product', value: 'product', description: '文档、复制和主题工具。' },
  { label: 'Admin', value: 'admin', description: '后台工作台组件。' }
]
const releaseRules: Record<string, YFormRule | YFormRule[]> = {
  packageName: { required: true, message: '请选择一个发布包。', trigger: 'change' }
}
const radioGroupSetup = [
  "import { ref } from 'vue'",
  "import { YRadioGroup } from '@yok-ui/core'",
  '',
  "const value = ref('product')",
  'const options = [',
  "  { label: 'Core', value: 'core', description: '基础组件和主题 token。' },",
  "  { label: 'Product', value: 'product', description: '文档、复制和主题工具。' },",
  "  { label: 'Admin', value: 'admin', description: '后台工作台组件。' }",
  ']'
].join('\n')
const radioGroupCode = [
  '<YRadioGroup',
  '  v-model="value"',
  '  label="Package focus"',
  '  :options="options"',
  '/>'
].join('\n')
const radioFormSetup = [
  "import { reactive } from 'vue'",
  "import { YForm, YFormItem, YRadioGroup, type YFormRule } from '@yok-ui/core'",
  '',
  'const releaseForm = reactive<Record<string, unknown>>({',
  "  packageName: ''",
  '})',
  'const options = [',
  "  { label: 'Core', value: 'core', description: '基础组件和主题 token。' },",
  "  { label: 'Product', value: 'product', description: '文档、复制和主题工具。' },",
  "  { label: 'Admin', value: 'admin', description: '后台工作台组件。' }",
  ']',
  'const releaseRules: Record<string, YFormRule | YFormRule[]> = {',
  "  packageName: { required: true, message: '请选择一个发布包。', trigger: 'change' }",
  '}'
].join('\n')
const radioFormCode = [
  '<YForm :model="releaseForm" :rules="releaseRules">',
  '  <YFormItem prop="packageName" label="Package focus" required v-slot="{ error, invalid, messageId, validate }">',
  '    <YRadioGroup',
  '      :model-value="releaseForm.packageName as string"',
  '      label="Package focus"',
  '      description="选择一个包作为本次发布的主要目标。"',
  '      :options="options"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  '      direction="vertical"',
  "      @update:model-value=\"(nextValue) => { releaseForm.packageName = nextValue; validate('change') }\"",
  '    />',
  '    <p v-if="error" class="demo-note">{{ error }}</p>',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Radio Group

Radio Group 用于从互斥选项中选择一个值。适合包类型、模式、密度、主题范围等设置。

::: tip TIP
`YRadioGroup` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic radio group {#radio-group-basic-radio-group}

<DocDemo
  id="radio-group-basic"
  title="Basic radio group"
  description="用于从互斥选项中选择一个值，适合包类型、模式和密度设置。"
  :code="radioGroupCode"
  :setup="radioGroupSetup"
>
  <YRadioGroup v-model="value" label="Package focus" :options="options" />
</DocDemo>

## Form Validation {#radio-group-form-validation}

<DocDemo
  id="radio-group-form-validation"
  title="Form validation"
  description="与 FormItem 配合时，把 invalid 和 messageId 传给 RadioGroup，并在 change 后触发表单校验。"
  :code="radioFormCode"
  :setup="radioFormSetup"
>
  <YForm :model="releaseForm" :rules="releaseRules">
    <YFormItem prop="packageName" label="Package focus" required v-slot="{ error, invalid, messageId, validate }">
      <YRadioGroup
        :model-value="releaseForm.packageName as string"
        label="Package focus"
        description="选择一个包作为本次发布的主要目标。"
        :options="options"
        :invalid="invalid"
        :aria-describedby="messageId"
        direction="vertical"
        @update:model-value="(nextValue) => { releaseForm.packageName = nextValue; validate('change') }"
      />
      <p v-if="error" class="demo-note">{{ error }}</p>
    </YFormItem>
  </YForm>
</DocDemo>

## Radio Group API {#radio-group-api}

<ComponentApiSection name="YRadioGroup" />

## Accessibility {#accessibility}

- 组件使用 radiogroup 语义，`label` 作为分组名称。
- 每个选项都保留单选按钮语义，键盘用户可用方向键在选项间移动。
- 与 `YFormItem` 配合时，应把 `invalid` 和 `messageId` 传给 `YRadioGroup`，并在 change 后调用 `validate('change')`。
- 禁用选项需要在视觉和语义上同时表达，不应只降低透明度。
