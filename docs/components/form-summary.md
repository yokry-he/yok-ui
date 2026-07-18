<script setup lang="ts">
const errors = [
  { fieldId: 'component-name', label: 'Component name', message: 'Name is required.' },
  { fieldId: 'component-package', label: 'Package', message: 'Choose where this component belongs.' }
]

const summarySetup = [
  "import { YFormItem, YFormSummary } from '@yok-ui/core'",
  '',
  'const errors = [',
  "  { fieldId: 'component-name', label: 'Component name', message: 'Name is required.' },",
  "  { fieldId: 'component-package', label: 'Package', message: 'Choose where this component belongs.' }",
  ']'
].join('\n')

const summaryCode = [
  '<div class="demo-stack">',
  '  <YFormSummary :errors="errors" />',
  '  <YFormItem label="Component name" label-for="component-name" error="Name is required." required>',
  '    <input id="component-name" class="yok-doc-input yok-focus-ring" placeholder="YButton" aria-invalid="true" />',
  '  </YFormItem>',
  '  <YFormItem label="Package" label-for="component-package" error="Choose where this component belongs." required>',
  '    <select id="component-package" class="yok-doc-input yok-focus-ring" aria-invalid="true">',
  '      <option value="">Select package</option>',
  '      <option value="core">Core</option>',
  '      <option value="product">Product</option>',
  '    </select>',
  '  </YFormItem>',
  '</div>'
].join('\n')
</script>

# Form Summary

Form Summary 用于聚合表单错误。它通常放在表单顶部或提交按钮附近，帮助用户快速理解当前有哪些字段需要修正，并能直接跳转到对应控件。

::: tip TIP
`YFormSummary` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Validation summary {#form-summary-validation-summary}

<DocDemo
  title="Validation summary"
  description="表单提交失败时用错误摘要聚合字段问题，并让每条错误能跳转到对应控件。"
  :code="summaryCode"
  :setup="summarySetup"
  :usage="['role=alert', 'field focus', 'aria-invalid']"
>
  <div class="demo-stack">
    <YFormSummary :errors="errors" />
    <YFormItem label="Component name" label-for="component-name" error="Name is required." required>
      <input id="component-name" class="yok-doc-input yok-focus-ring" placeholder="YButton" aria-invalid="true" />
    </YFormItem>
    <YFormItem label="Package" label-for="component-package" error="Choose where this component belongs." required>
      <select id="component-package" class="yok-doc-input yok-focus-ring" aria-invalid="true">
        <option value="">Select package</option>
        <option value="core">Core</option>
        <option value="product">Product</option>
      </select>
    </YFormItem>
  </div>
</DocDemo>

## Form Summary API {#form-summary-api}

<ComponentApiSection name="YFormSummary" />

## Accessibility {#accessibility}

- 使用 `role="alert"` 和 `aria-live="assertive"` 通知当前错误摘要。
- 每条错误都渲染为可聚焦按钮，点击后会聚焦 `fieldId` 对应的字段。
- 字段本身仍应使用 `aria-invalid="true"`，并在单字段区域展示具体错误。
- 当表单提交失败时，建议将焦点先移动到 `YFormSummary` 或提交按钮附近，再让用户逐条跳转。
