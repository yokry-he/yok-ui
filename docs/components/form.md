<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule, YFormValidateResult } from '@yok-ui/core'

const formRef = ref<{
  validate: () => Promise<YFormValidateResult>
  resetFields: () => void
  scrollToField: (prop: string) => boolean
}>()

const formModel = reactive<Record<string, unknown>>({
  name: '',
  packageName: '',
  description: ''
})

const formRules: Record<string, YFormRule | YFormRule[]> = {
  name: [
    { required: true, message: 'Component name is required.', trigger: 'submit' },
    { min: 3, message: 'Use at least 3 characters.', trigger: 'submit' }
  ],
  packageName: { required: true, message: 'Choose a package.', trigger: 'submit' },
  description: {
    validator: (value) => String(value || '').includes('Vue') || 'Mention Vue in the description.',
    trigger: 'submit'
  }
}

const packageOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Product', value: 'product' },
  { label: 'Admin', value: 'admin' }
]

const summaryErrors = ref<Array<{ fieldId: string; label: string; message: string }>>([])
const submitState = ref('Ready to validate.')

const formCode = [
  '<script setup lang="ts">',
  "import { reactive, ref } from 'vue'",
  "import type { YFormRule, YFormValidateResult } from '@yok-ui/core'",
  '',
  'const formRef = ref<{ validate: () => Promise<YFormValidateResult>; resetFields: () => void; scrollToField: (prop: string) => boolean }>()',
  'const model = reactive<Record<string, unknown>>({',
  "  name: '',",
  "  packageName: '',",
  "  description: ''",
  '})',
  '',
  'const rules: Record<string, YFormRule | YFormRule[]> = {',
  '  name: [',
  "    { required: true, message: 'Component name is required.' },",
  "    { min: 3, message: 'Use at least 3 characters.' }",
  '  ],',
  "  packageName: { required: true, message: 'Choose a package.' }",
  '}',
  '</' + 'script>',
  '',
  '<template>',
  '  <YForm ref="formRef" :model="model" :rules="rules" scroll-to-error @submit="handleSubmit">',
  '    <YFormItem prop="name" label="Component name" required v-slot="{ error, labelFor, messageId }">',
  '      <YInput :id="labelFor" v-model="model.name" :invalid="Boolean(error)" :aria-describedby="messageId" />',
  '    </YFormItem>',
  '    <YButton type="submit" variant="primary">Submit</YButton>',
  '  </YForm>',
  '</template>'
].join('\n')

function syncSummary(result: YFormValidateResult) {
  summaryErrors.value = result.errors.map((error) => ({
    fieldId: `yok-form-field-${error.prop.replace(/\W+/g, '-')}`,
    label: error.prop,
    message: error.messages[0]
  }))
}

function handleSubmit(result: YFormValidateResult) {
  syncSummary(result)
  submitState.value = result.valid ? 'Looks good. The component draft can be saved.' : 'Please fix the highlighted fields.'
}

async function validateManually() {
  if (!formRef.value) {
    return
  }

  const result = await formRef.value.validate()
  handleSubmit(result)
}

function resetForm() {
  formRef.value?.resetFields()
  summaryErrors.value = []
  submitState.value = 'Ready to validate.'
}

function focusDescription() {
  formRef.value?.scrollToField('description')
}
</script>

# Form

Form 负责管理表单数据、校验规则和字段错误。它参考主流组件库的 `rules`、`validate`、`validateField`、`resetFields` 模式，适合配置页、创建流程和后台筛选表单。

::: tip TIP
`YForm` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Validation flow {#form-validation-flow}

<DocDemo
  title="Validation flow"
  description="Form 管理校验生命周期，FormItem 把 label、错误、描述 id 交给具体输入控件。"
  :code="formCode"
  :usage="['rules', 'validate', 'resetFields', 'FormSummary']"
>
  <YForm ref="formRef" :model="formModel" :rules="formRules" label-width="132px" scroll-to-error @submit="handleSubmit">
    <YFormSummary :errors="summaryErrors" />
    <YFormItem prop="name" label="Component name" required v-slot="{ error, labelFor, messageId }">
      <YInput
        :id="labelFor"
        v-model="formModel.name"
        placeholder="YSmartPanel"
        :invalid="Boolean(error)"
        :aria-describedby="messageId"
      />
    </YFormItem>
    <YFormItem prop="packageName" label="Package" required v-slot="{ error, labelFor, messageId }">
      <YSelect
        :id="labelFor"
        v-model="formModel.packageName"
        :options="packageOptions"
        :invalid="Boolean(error)"
        :aria-describedby="messageId"
      />
    </YFormItem>
    <YFormItem prop="description" label="Description" hint="Keep it short and product-facing." v-slot="{ error, labelFor, messageId }">
      <YTextarea
        :id="labelFor"
        v-model="formModel.description"
        placeholder="A Vue component for..."
        :invalid="Boolean(error)"
        :aria-describedby="messageId"
        :rows="3"
      />
    </YFormItem>
    <div class="demo-actions">
      <YButton type="submit" variant="primary">Submit</YButton>
      <YButton type="button" @click="validateManually">Validate</YButton>
      <YButton type="button" variant="secondary" @click="focusDescription">Go to description</YButton>
      <YButton type="button" variant="ghost" @click="resetForm">Reset</YButton>
    </div>
    <p class="demo-note">{{ submitState }}</p>
  </YForm>
</DocDemo>

## Form API {#form-api}

<ComponentApiSection name="YForm" />

## Accessibility {#accessibility}

- `YForm` 使用原生 `form` 与 `fieldset`，提交时会阻止浏览器默认刷新并触发校验。
- `YFormItem` 的 slot 会提供 `labelFor`、`messageId`、`error`、`invalid`、`validate` 和 `clearValidate`，建议把 id 与状态传给输入控件，并在 change / blur 后调用对应触发器校验。
- 多字段错误可以和 `YFormSummary` 组合，提交失败时给用户一个可跳转的错误摘要。
- 长表单可以启用 `scroll-to-error`，让错误提示和用户当前视口建立明确关系。
- 键盘路径应保留原生控件语义：Tab 依次进入字段和按钮，Enter 激活 `type="submit"` 按钮，错误摘要使用可读链接帮助回到对应字段。
