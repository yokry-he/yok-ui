<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const checked = ref(true)
const selectedPackages = ref(['core', 'docs'])
const releaseForm = reactive<Record<string, unknown>>({
  packages: []
})
const packageOptions = [
  { label: 'Core', value: 'core', description: '基础组件和主题 token。' },
  { label: 'Docs', value: 'docs', description: '文档示例和 API 表。' },
  { label: 'Admin', value: 'admin', description: '后台工作台组件。' }
]
const releaseRules: Record<string, YFormRule | YFormRule[]> = {
  packages: [
    { required: true, message: '至少选择一个发布包。', trigger: 'change' },
    { max: 2, message: '一次最多选择两个包。', trigger: 'change' }
  ]
}
const basicCheckboxSetup = [
  "import { ref } from 'vue'",
  "import { YCheckbox } from '@yok-ui/core'",
  '',
  'const checked = ref(true)'
].join('\n')
const basicCheckboxCode = [
  '<YCheckbox',
  '  v-model="checked"',
  '  label="Enable fresh cute mode"',
  '  description="Use softer surfaces and friendlier feedback states."',
  '/>'
].join('\n')
const checkboxGroupSetup = [
  "import { ref } from 'vue'",
  "import { YCheckboxGroup } from '@yok-ui/core'",
  '',
  "const selectedPackages = ref(['core', 'docs'])",
  'const packageOptions = [',
  "  { label: 'Core', value: 'core', description: '基础组件和主题 token。' },",
  "  { label: 'Docs', value: 'docs', description: '文档示例和 API 表。' },",
  "  { label: 'Admin', value: 'admin', description: '后台工作台组件。' }",
  ']'
].join('\n')
const checkboxGroupCode = [
  '<YCheckboxGroup',
  '  v-model="selectedPackages"',
  '  label="Release packages"',
  '  description="选择本次发布要覆盖的包，最多选择两个。"',
  '  :options="packageOptions"',
  '  :max="2"',
  '/>'
].join('\n')
const checkboxFormSetup = [
  "import { reactive } from 'vue'",
  "import { YCheckboxGroup, YForm, YFormItem, type YFormRule } from '@yok-ui/core'",
  '',
  'const releaseForm = reactive<Record<string, unknown>>({',
  '  packages: []',
  '})',
  'const packageOptions = [',
  "  { label: 'Core', value: 'core', description: '基础组件和主题 token。' },",
  "  { label: 'Docs', value: 'docs', description: '文档示例和 API 表。' },",
  "  { label: 'Admin', value: 'admin', description: '后台工作台组件。' }",
  ']',
  'const releaseRules: Record<string, YFormRule | YFormRule[]> = {',
  '  packages: [',
  "    { required: true, message: '至少选择一个发布包。', trigger: 'change' },",
  "    { max: 2, message: '一次最多选择两个包。', trigger: 'change' }",
  '  ]',
  '}'
].join('\n')
const checkboxFormCode = [
  '<YForm :model="releaseForm" :rules="releaseRules">',
  '  <YFormItem prop="packages" label="Release packages" required v-slot="{ error, invalid, messageId, validate }">',
  '    <YCheckboxGroup',
  '      :model-value="releaseForm.packages as Array<string | number>"',
  '      label="Release packages"',
  '      description="选择本次发布要覆盖的包，支持 change 触发表单校验。"',
  '      :options="packageOptions"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  '      :max="2"',
  "      @update:model-value=\"(value) => { releaseForm.packages = value; validate('change') }\"",
  '    />',
  '    <p v-if="error" class="demo-note">{{ error }}</p>',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Checkbox

Checkbox 用于多选、确认和偏好设置。它保留原生 input 语义，同时使用 Yok UI 的视觉样式。

::: tip TIP
`YCheckbox` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic checkbox {#checkbox-basic-checkbox}

<DocDemo
  id="checkbox-basic"
  title="Basic checkbox"
  description="用于确认、偏好设置和单个布尔选项，保留原生 checkbox 语义。"
  :code="basicCheckboxCode"
  :setup="basicCheckboxSetup"
>
  <YCheckbox
    v-model="checked"
    label="Enable fresh cute mode"
    description="Use softer surfaces and friendlier feedback states."
  />
</DocDemo>

## Checkbox Group {#checkbox-checkbox-group}

<DocDemo
  id="checkbox-group"
  title="Checkbox group"
  description="用 fieldset 聚合多选项，并用 max 控制本次最多可选数量。"
  :code="checkboxGroupCode"
  :setup="checkboxGroupSetup"
>
  <YCheckboxGroup
    v-model="selectedPackages"
    label="Release packages"
    description="选择本次发布要覆盖的包，最多选择两个。"
    :options="packageOptions"
    :max="2"
  />
</DocDemo>

## Form Validation {#checkbox-form-validation}

<DocDemo
  id="checkbox-form-validation"
  title="Form validation"
  description="与 FormItem 配合时，把 invalid 和 messageId 传给 CheckboxGroup，并在 change 后触发表单校验。"
  :code="checkboxFormCode"
  :setup="checkboxFormSetup"
>
  <YForm :model="releaseForm" :rules="releaseRules">
    <YFormItem prop="packages" label="Release packages" required v-slot="{ error, invalid, messageId, validate }">
      <YCheckboxGroup
        :model-value="releaseForm.packages as Array<string | number>"
        label="Release packages"
        description="选择本次发布要覆盖的包，支持 change 触发表单校验。"
        :options="packageOptions"
        :invalid="invalid"
        :aria-describedby="messageId"
        :max="2"
        @update:model-value="(value) => { releaseForm.packages = value; validate('change') }"
      />
      <p v-if="error" class="demo-note">{{ error }}</p>
    </YFormItem>
  </YForm>
</DocDemo>

## Checkbox API {#checkbox-api}

<ComponentApiSection :names="['YCheckbox', 'YCheckboxGroup']" />

## Accessibility {#accessibility}

- 组件保留原生 checkbox 语义，支持 Space 切换。
- `label` 是主要可访问名称，`description` 用于补充说明。
- `YCheckboxGroup` 使用 `fieldset` 和 `legend` 聚合同组多选项，适合权限、偏好和发布清单。
- 与 `YFormItem` 配合时，应把 `invalid` 和 `messageId` 传给 `YCheckboxGroup`，并在 `change` 后调用 `validate('change')`。
- 禁用状态会同步到原生 input，业务层不要只用视觉样式模拟禁用。
