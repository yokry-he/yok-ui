---
title: Schema Form
---

<script setup lang="ts">
import { ref } from 'vue'
import type { YSchemaFormField } from '@yok-ui/admin'

const model = ref({
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
const schema: YSchemaFormField[] = [
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
</script>

# Schema Form

Schema Form 面向后台和配置页：把字段、控件类型、校验规则、条件显隐和错误摘要放进一个 schema，减少表单页面重复拼装。

它不是替代 `YForm`，而是复用 `YForm`、`YFormItem` 和基础控件的高阶组合，适合资源创建、资料维护、配置编辑等页面。

## Example

<YSchemaForm
  v-model="model"
  title="Component profile"
  description="Schema-driven form with validation summary."
  :schema="schema"
  submit-text="Save profile"
  reset-text="Restore"
  summary-title="Fix component profile"
  scroll-to-error
/>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { YSchemaFormField } from '@yok-ui/admin'

const model = ref({
  name: 'YButton',
  packageName: 'core',
  category: 'basic',
  customReason: '',
  enabled: true,
  reviewers: [
    { id: 'reviewer-ada', name: 'Ada', role: 'Design review' }
  ]
})

const schema: YSchemaFormField[] = [
  { key: 'name', label: 'Component name', required: true },
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
    key: 'reviewers',
    label: 'Reviewers',
    type: 'array',
    itemLabel: 'Reviewer',
    defaultItem: { id: '', name: '', role: 'Core review' },
    itemKey: 'id',
    itemFields: [
      { key: 'name', label: 'Reviewer name', required: true },
      { key: 'role', label: 'Review role', helper: 'Choose the review responsibility.' }
    ],
    min: 1
  }
]
</script>

<template>
  <YSchemaForm v-model="model" :schema="schema" scroll-to-error />
</template>
```

## Live example

<LiveExampleRunner preset="schemaForm" />

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
