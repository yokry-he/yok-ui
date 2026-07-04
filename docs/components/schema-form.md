---
title: Schema Form
---

<script setup lang="ts">
import { ref } from 'vue'
import type { YSchemaFormField } from '@yok-ui/admin'

const profileModel = ref({
  name: 'YButton',
  packageName: 'core',
  category: 'basic',
  customReason: '',
  enabled: true,
  reviewers: [
    { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },
    { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }
  ]
})
const profileMessage = ref('Waiting for validation.')
const profileSchema: YSchemaFormField[] = [
  {
    key: 'name',
    label: 'Component name',
    placeholder: 'YButton',
    required: true,
    rules: { min: 3, message: 'Name must be at least 3 characters.' }
  },
  {
    key: 'packageName',
    label: 'Package',
    type: 'select',
    required: true,
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Custom', value: 'custom' }
    ]
  },
  {
    key: 'customReason',
    label: 'Custom reason',
    type: 'textarea',
    visibleWhen: (values) => values.category === 'custom',
    rules: {
      validator: (value, values) => values.category !== 'custom' || Boolean(value) || 'Explain the custom category.'
    }
  },
  {
    key: 'enabled',
    label: 'Enable component',
    type: 'switch'
  },
  {
    key: 'reviewers',
    label: 'Reviewers',
    type: 'array',
    itemLabel: 'Reviewer',
    addText: 'Add reviewer',
    removeText: 'Remove reviewer',
    emptyText: 'No reviewers yet',
    defaultItem: { id: '', name: '', role: 'Core review' },
    itemKey: 'id',
    itemFields: [
      { key: 'name', label: 'Reviewer name', placeholder: 'Ada', required: true },
      { key: 'role', label: 'Review role', placeholder: 'Design review', helper: 'Choose the review responsibility.' }
    ],
    min: 1,
    max: 3
  }
]

const compactModel = ref({
  name: 'YSearchForm',
  packageName: 'admin',
  lifecycle: 'beta',
  owner: 'Docs team',
  enabled: true
})
const compactSchema: YSchemaFormField[] = [
  { key: 'name', label: 'Name', required: true, placeholder: 'YSearchForm' },
  {
    key: 'packageName',
    label: 'Package',
    type: 'select',
    required: true,
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Admin', value: 'admin' },
      { label: 'Product', value: 'product' }
    ]
  },
  {
    key: 'lifecycle',
    label: 'Lifecycle',
    type: 'select',
    options: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' },
      { label: 'Review', value: 'review' }
    ]
  },
  { key: 'owner', label: 'Owner', placeholder: 'Docs team' },
  { key: 'enabled', label: 'Enabled', type: 'switch' }
]

const customModel = ref({
  name: 'YMetricCard',
  packageName: 'product',
  category: 'data',
  note: 'Used on dashboard summary pages.',
  enabled: true
})
const customSchema: YSchemaFormField[] = [
  { key: 'name', label: 'Component name', required: true },
  {
    key: 'packageName',
    label: 'Package',
    type: 'select',
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Product', value: 'product' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  {
    key: 'category',
    label: 'Category',
    required: true,
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Data', value: 'data' },
      { label: 'Workflow', value: 'workflow' }
    ]
  },
  {
    key: 'note',
    label: 'Review note',
    type: 'textarea',
    rows: 3,
    helper: 'Explain where this schema-driven form is used.'
  },
  { key: 'enabled', label: 'Publish draft', type: 'switch' }
]

const schemaFormSetup = [
  "import { ref } from 'vue'",
  "import { YButton, YTag } from '@yok-ui/core'",
  "import { YSchemaForm, type YSchemaFormField } from '@yok-ui/admin'",
  '',
  'const profileModel = ref({',
  "  name: 'YButton',",
  "  packageName: 'core',",
  "  category: 'basic',",
  "  customReason: '',",
  '  enabled: true,',
  '  reviewers: [',
  "    { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },",
  "    { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }",
  '  ]',
  '})',
  "const profileMessage = ref('Waiting for validation.')",
  '',
  'const profileSchema: YSchemaFormField[] = [',
  '  {',
  "    key: 'name',",
  "    label: 'Component name',",
  "    placeholder: 'YButton',",
  '    required: true,',
  "    rules: { min: 3, message: 'Name must be at least 3 characters.' }",
  '  },',
  '  {',
  "    key: 'packageName',",
  "    label: 'Package',",
  "    type: 'select',",
  '    required: true,',
  '    options: [',
  "      { label: 'Core', value: 'core' },",
  "      { label: 'Admin', value: 'admin' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'category',",
  "    label: 'Category',",
  "    type: 'select',",
  '    options: [',
  "      { label: 'Basic', value: 'basic' },",
  "      { label: 'Custom', value: 'custom' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'customReason',",
  "    label: 'Custom reason',",
  "    type: 'textarea',",
  "    visibleWhen: (values) => values.category === 'custom',",
  '    rules: {',
  "      validator: (value, values) => values.category !== 'custom' || Boolean(value) || 'Explain the custom category.'",
  '    }',
  '  },',
  "  { key: 'enabled', label: 'Enable component', type: 'switch' },",
  '  {',
  "    key: 'reviewers',",
  "    label: 'Reviewers',",
  "    type: 'array',",
  "    itemLabel: 'Reviewer',",
  "    addText: 'Add reviewer',",
  "    removeText: 'Remove reviewer',",
  "    emptyText: 'No reviewers yet',",
  "    defaultItem: { id: '', name: '', role: 'Core review' },",
  "    itemKey: 'id',",
  '    itemFields: [',
  "      { key: 'name', label: 'Reviewer name', placeholder: 'Ada', required: true },",
  "      { key: 'role', label: 'Review role', placeholder: 'Design review', helper: 'Choose the review responsibility.' }",
  '    ],',
  '    min: 1,',
  '    max: 3',
  '  }',
  ']',
  '',
  'const compactModel = ref({',
  "  name: 'YSearchForm',",
  "  packageName: 'admin',",
  "  lifecycle: 'beta',",
  "  owner: 'Docs team',",
  '  enabled: true',
  '})',
  '',
  'const compactSchema: YSchemaFormField[] = [',
  "  { key: 'name', label: 'Name', required: true, placeholder: 'YSearchForm' },",
  '  {',
  "    key: 'packageName',",
  "    label: 'Package',",
  "    type: 'select',",
  '    required: true,',
  '    options: [',
  "      { label: 'Core', value: 'core' },",
  "      { label: 'Admin', value: 'admin' },",
  "      { label: 'Product', value: 'product' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'lifecycle',",
  "    label: 'Lifecycle',",
  "    type: 'select',",
  '    options: [',
  "      { label: 'Stable', value: 'stable' },",
  "      { label: 'Beta', value: 'beta' },",
  "      { label: 'Review', value: 'review' }",
  '    ]',
  '  },',
  "  { key: 'owner', label: 'Owner', placeholder: 'Docs team' },",
  "  { key: 'enabled', label: 'Enabled', type: 'switch' }",
  ']',
  '',
  'const customModel = ref({',
  "  name: 'YMetricCard',",
  "  packageName: 'product',",
  "  category: 'data',",
  "  note: 'Used on dashboard summary pages.',",
  '  enabled: true',
  '})',
  '',
  'const customSchema: YSchemaFormField[] = [',
  "  { key: 'name', label: 'Component name', required: true },",
  '  {',
  "    key: 'packageName',",
  "    label: 'Package',",
  "    type: 'select',",
  '    options: [',
  "      { label: 'Core', value: 'core' },",
  "      { label: 'Product', value: 'product' },",
  "      { label: 'Admin', value: 'admin' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'category',",
  "    label: 'Category',",
  '    required: true,',
  '    options: [',
  "      { label: 'Basic', value: 'basic' },",
  "      { label: 'Data', value: 'data' },",
  "      { label: 'Workflow', value: 'workflow' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'note',",
  "    label: 'Review note',",
  "    type: 'textarea',",
  '    rows: 3,',
  "    helper: 'Explain where this schema-driven form is used.'",
  '  },',
  "  { key: 'enabled', label: 'Publish draft', type: 'switch' }",
  ']'
].join('\n')

const profileCode = [
  '<YSchemaForm',
  '  v-model="profileModel"',
  '  title="Component profile"',
  '  description="Schema-driven form with validation summary and reviewer array."',
  '  :schema="profileSchema"',
  '  submit-text="Save profile"',
  '  reset-text="Restore"',
  '  summary-title="Fix component profile"',
  '  scroll-to-error',
  '  @finish="profileMessage = \'Profile saved.\'"',
  '  @finish-failed="profileMessage = \'Fix highlighted fields.\'"',
  '/>',
  '<p class="demo-note">{{ profileMessage }}</p>'
].join('\n')

const compactCode = [
  '<YSchemaForm',
  '  v-model="compactModel"',
  '  title="Compact settings"',
  '  description="Use compact density when the form sits inside a drawer or side panel."',
  '  :schema="compactSchema"',
  '  density="compact"',
  '  label-width="108px"',
  '  submit-text="Apply"',
  '  reset-text="Reset"',
  '  :show-summary="false"',
  '/>'
].join('\n')

const customFieldCode = [
  '<YSchemaForm',
  '  v-model="customModel"',
  '  title="Custom category control"',
  '  description="Override field-category while keeping schema validation, reset, and submit behavior."',
  '  :schema="customSchema"',
  '  submit-text="Publish"',
  '  reset-text="Restore"',
  '>',
  '  <template #field-category="{ value, update }">',
  '    <div class="docs-schema-form-choice-grid">',
  '      <YButton',
  '        v-for="item in customSchema.find((field) => field.key === \'category\')?.options"',
  '        :key="item.value"',
  '        type="button"',
  '        :variant="value === item.value ? \'primary\' : \'secondary\'"',
  '        @click="update(item.value)"',
  '      >',
  '        {{ item.label }}',
  '      </YButton>',
  '    </div>',
  '  </template>',
  '  <template #actions>',
  '    <YTag tone="success">Draft</YTag>',
  '    <YButton type="submit" variant="primary">Publish</YButton>',
  '    <YButton type="button" variant="ghost">Preview</YButton>',
  '  </template>',
  '</YSchemaForm>'
].join('\n')
</script>

# Schema Form

Schema Form 面向后台和配置页：把字段、控件类型、校验规则、条件显隐和错误摘要放进一个 schema，减少表单页面重复拼装。

它不是替代 `YForm`，而是复用 `YForm`、`YFormItem`、`YFieldArray` 和基础控件的高阶组合，适合资源创建、资料维护、配置编辑等页面。

## Basic Schema

<DocDemo
  title="Basic schema"
  description="同一个 schema 声明字段、条件显隐、数组字段和提交失败后的错误摘要。"
  :code="profileCode"
  :setup="schemaFormSetup"
  :usage="['schema fields', 'conditional field', 'field array', 'scroll to error']"
>
  <YSchemaForm
    v-model="profileModel"
    title="Component profile"
    description="Schema-driven form with validation summary and reviewer array."
    :schema="profileSchema"
    submit-text="Save profile"
    reset-text="Restore"
    summary-title="Fix component profile"
    scroll-to-error
    @finish="profileMessage = 'Profile saved.'"
    @finish-failed="profileMessage = 'Fix highlighted fields.'"
  />
  <p class="demo-note">{{ profileMessage }}</p>
</DocDemo>

## Compact Density

<DocDemo
  title="Compact density"
  description="紧凑模式适合抽屉、侧栏配置页或密集后台页面，仍然保留 schema 校验和重置能力。"
  :code="compactCode"
  :setup="schemaFormSetup"
  :usage="['compact density', 'label width', 'settings form']"
>
  <YSchemaForm
    v-model="compactModel"
    title="Compact settings"
    description="Use compact density when the form sits inside a drawer or side panel."
    :schema="compactSchema"
    density="compact"
    label-width="108px"
    submit-text="Apply"
    reset-text="Reset"
    :show-summary="false"
  />
</DocDemo>

## Custom Field Slot

<DocDemo
  title="Custom field slot"
  description="通过 field-{key} 插槽替换某个 schema 字段的渲染方式，让业务控件和 schema 校验共存。"
  :code="customFieldCode"
  :setup="schemaFormSetup"
  :usage="['field slot', 'custom control', 'schema validation']"
>
  <YSchemaForm
    v-model="customModel"
    title="Custom category control"
    description="Override field-category while keeping schema validation, reset, and submit behavior."
    :schema="customSchema"
    submit-text="Publish"
    reset-text="Restore"
  >
    <template #field-category="{ value, update }">
      <div class="docs-schema-form-choice-grid">
        <YButton
          v-for="item in customSchema.find((field) => field.key === 'category')?.options"
          :key="item.value"
          type="button"
          :variant="value === item.value ? 'primary' : 'secondary'"
          @click="update(item.value)"
        >
          {{ item.label }}
        </YButton>
      </div>
    </template>
    <template #actions>
      <YTag tone="success">Draft</YTag>
      <YButton type="submit" variant="primary">Publish</YButton>
      <YButton type="button" variant="ghost">Preview</YButton>
    </template>
  </YSchemaForm>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="schemaForm"
  title="在线编辑 Schema Form 示例"
  description="运行器覆盖字段 schema、条件显隐、数组字段、提交校验和错误摘要，可直接进入 Playground 调整完整 SFC。"
/>

## API

<ComponentApiSection name="YSchemaForm" />

## Accessibility

- 每个字段由 `YFormItem` 生成标签、错误信息和 `aria-describedby` 关系。
- `array` 字段复用 `YFieldArray`，适合像 Ant Design `Form.List` 一样声明动态成员、审批人、联系人等可增删字段组。
- `array` 字段可以配置 `itemKey`，通常设为 `id`，用于透传给 `YFieldArray` 的稳定行 key。
- `itemFields` 支持 `required` 和 `rules`，提交失败时会生成包含行号的错误，例如 `Reviewer 1 Reviewer name is required.`。
- 数组行内字段会生成稳定 id，错误摘要点击后可以直接聚焦到对应行内控件，而不是只定位到整组数组字段。
- 数组行内 `helper` 和错误文案会渲染为独立说明，并通过 `aria-describedby` 关联到当前行内控件。
- 提交失败时，`YFormSummary` 使用 `role="alert"` 和可点击字段链接，适合键盘和屏幕阅读器用户定位错误。
- `scroll-to-error` 会滚动到第一个错误字段，适合长表单和移动端配置页。

<style scoped>
.docs-schema-form-choice-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
</style>
