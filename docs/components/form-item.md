<script setup lang="ts">
const packageOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Product', value: 'product' }
]

const formItemSetup = [
  "import { YFormItem, YInput, YSelect } from '@yok-ui/core'",
  '',
  'const packageOptions = [',
  "  { label: 'Core', value: 'core' },",
  "  { label: 'Product', value: 'product' }",
  ']'
].join('\n')

const basicCode = [
  '<YFormItem label="Component name" hint="Use a short, readable name." required>',
  '  <YInput model-value="YTable" placeholder="YButton" />',
  '</YFormItem>'
].join('\n')

const errorCode = [
  '<YFormItem label="Package" error="Package is required">',
  '  <YSelect',
  '    model-value=""',
  '    :options="packageOptions"',
  '  />',
  '</YFormItem>'
].join('\n')
</script>

# Form Item

Form Item 用于包裹表单控件，统一标签、必填标记、提示文案和错误状态。它可以单独使用，也可以放在 `YForm` 中通过 `prop` 自动接收校验结果。

::: tip TIP
`YFormItem` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Label and hint {#form-item-label-and-hint}

<DocDemo
  title="Label and hint"
  description="基础字段容器负责 label、必填标记和提示文案，控件本身仍保留原生输入语义。"
  :code="basicCode"
  :setup="formItemSetup"
  :usage="['label', 'hint', 'required']"
>
  <YFormItem label="Component name" hint="Use a short, readable name." required>
    <YInput model-value="YTable" placeholder="YButton" />
  </YFormItem>
</DocDemo>

## Error state {#form-item-error-state}

<DocDemo
  title="Error state"
  description="错误文案由 Form Item 统一展示，内部控件应同步 invalid 与 aria-describedby。"
  :code="errorCode"
  :setup="formItemSetup"
  :usage="['error', 'role=alert', 'field message']"
>
  <YFormItem label="Package" error="Package is required">
    <YSelect
      model-value=""
      :options="packageOptions"
    />
  </YFormItem>
</DocDemo>

## Form Item API {#form-item-api}

<ComponentApiSection name="YFormItem" />

## Accessibility {#accessibility}

- `labelFor` 应指向内部控件 id，让标签和字段建立明确关系。
- `hint` 和 `error` 会帮助字段形成描述文本，错误时应让控件同步 `aria-invalid`。
- `required` 只展示必填提示，真实校验仍由表单规则或业务逻辑负责。
