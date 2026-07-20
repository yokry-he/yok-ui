<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const basicValue = ref('')
const optionsValue = ref('')
const disabledOptionValue = ref('')
const disabledValue = ref('core')
const clearableValue = ref('product')
const sizeValue = ref('core')
const multipleValue = ref(['core', 'product'])
const customLabelValue = ref('core')
const groupedValue = ref('select')
const filterableValue = ref('')
const remoteValue = ref('')
const creatableValue = ref('')
const valueKeyValue = ref('component-select')
const collapsedValue = ref(['core', 'product', 'admin'])
const loadingValue = ref('')
const emptyValue = ref('')
const virtualizedValue = ref('pkg-12')
const releaseForm = reactive<Record<string, string>>({
  packageName: ''
})
const releaseRules: Record<string, YFormRule | YFormRule[]> = {
  packageName: {
    validator: (value) => Boolean(value) || '发布前需要选择一个包。',
    trigger: 'change'
  }
}

const options = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]
const aliasOptions = [
  { label: 'Core package · 基础组件', value: 'core' },
  { label: 'Product package · 业务组件', value: 'product' },
  { label: 'Admin package · 管理端组件', value: 'admin' }
]
const disabledOptions = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin', disabled: true }
]
const groupedOptions = [
  { label: 'Button', value: 'button', group: 'Basic' },
  { label: 'Divider', value: 'divider', group: 'Basic' },
  { label: 'Input', value: 'input', group: 'Form' },
  { label: 'Select', value: 'select', group: 'Form' },
  { label: 'Tooltip', value: 'tooltip', group: 'Overlay' }
]
const packageOptions = [
  { label: 'Component Select', value: 'component-select' },
  { label: 'Component Cascader', value: 'component-cascader' },
  { label: 'Component Tree', value: 'component-tree' }
]
const remotePackageOptions = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' },
  { label: 'Design token package', value: 'design-token' },
  { label: 'Virtualized select package', value: 'virtualized-select' }
]
const loadingOptions = [
  { label: 'Loading from npm registry...', value: 'loading', disabled: true }
]
function searchRemotePackages(query: string) {
  return new Promise<typeof remotePackageOptions>((resolve) => {
    globalThis.setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase()
      resolve(remotePackageOptions.filter((option) =>
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.value.toLowerCase().includes(normalizedQuery)
      ))
    }, 480)
  })
}
const largeOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: `Package ${index + 1}`,
  value: `pkg-${index + 1}`
}))
const emptyOptions: typeof options = []

const selectExampleSetup = [
  "import { ref } from 'vue'",
  "import { YSelect } from '@yok-ui/core'",
  '',
  "const basicValue = ref('')",
  "const optionsValue = ref('')",
  "const disabledOptionValue = ref('')",
  "const disabledValue = ref('core')",
  "const clearableValue = ref('product')",
  "const sizeValue = ref('core')",
  "const multipleValue = ref(['core', 'product'])",
  "const customLabelValue = ref('core')",
  "const groupedValue = ref('select')",
  "const filterableValue = ref('')",
  "const remoteValue = ref('')",
  "const creatableValue = ref('')",
  "const valueKeyValue = ref('component-select')",
  "const collapsedValue = ref(['core', 'product', 'admin'])",
  "const loadingValue = ref('')",
  "const emptyValue = ref('')",
  "const virtualizedValue = ref('pkg-12')",
  '',
  'const options = [',
  "  { label: 'Core package', value: 'core' },",
  "  { label: 'Product package', value: 'product' },",
  "  { label: 'Admin package', value: 'admin' }",
  ']',
  'const aliasOptions = [',
  "  { label: 'Core package · 基础组件', value: 'core' },",
  "  { label: 'Product package · 业务组件', value: 'product' },",
  "  { label: 'Admin package · 管理端组件', value: 'admin' }",
  ']',
  'const disabledOptions = [',
  "  { label: 'Core package', value: 'core' },",
  "  { label: 'Product package', value: 'product' },",
  "  { label: 'Admin package', value: 'admin', disabled: true }",
  ']',
  'const groupedOptions = [',
  "  { label: 'Button', value: 'button', group: 'Basic' },",
  "  { label: 'Divider', value: 'divider', group: 'Basic' },",
  "  { label: 'Input', value: 'input', group: 'Form' },",
  "  { label: 'Select', value: 'select', group: 'Form' },",
  "  { label: 'Tooltip', value: 'tooltip', group: 'Overlay' }",
  ']',
  'const packageOptions = [',
  "  { label: 'Component Select', value: 'component-select' },",
  "  { label: 'Component Cascader', value: 'component-cascader' },",
  "  { label: 'Component Tree', value: 'component-tree' }",
  ']',
  'const remotePackageOptions = [',
  "  { label: 'Core package', value: 'core' },",
  "  { label: 'Product package', value: 'product' },",
  "  { label: 'Admin package', value: 'admin' },",
  "  { label: 'Design token package', value: 'design-token' },",
  "  { label: 'Virtualized select package', value: 'virtualized-select' }",
  ']',
  'const loadingOptions = [',
  "  { label: 'Loading from npm registry...', value: 'loading', disabled: true }",
  ']',
  'function searchRemotePackages(query) {',
  '  return new Promise((resolve) => {',
  '    globalThis.setTimeout(() => {',
  '      const normalizedQuery = query.trim().toLowerCase()',
  '      resolve(remotePackageOptions.filter((option) =>',
  '        option.label.toLowerCase().includes(normalizedQuery) ||',
  '        option.value.toLowerCase().includes(normalizedQuery)',
  '      ))',
  '    }, 480)',
  '  })',
  '}',
  'const largeOptions = Array.from({ length: 1000 }, (_, index) => ({',
  '  label: `Package ${index + 1}`,',
  '  value: `pkg-${index + 1}`',
  '}))',
  'const emptyOptions = []'
].join('\n')

const optionsSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const value = ref('')
const options = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]`

const disabledOptionsSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const value = ref('')
const disabledOptions = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin', disabled: true }
]`

const groupedSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const value = ref('select')
const groupedOptions = [
  { label: 'Button', value: 'button', group: 'Basic' },
  { label: 'Divider', value: 'divider', group: 'Basic' },
  { label: 'Input', value: 'input', group: 'Form' },
  { label: 'Select', value: 'select', group: 'Form' },
  { label: 'Tooltip', value: 'tooltip', group: 'Overlay' }
]`

const multipleSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const value = ref(['core', 'product'])
const options = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]`

const formSetup = [
  "import { reactive } from 'vue'",
  "import { YForm, YFormItem, YSelect, type YFormRule } from '@yok-ui/core'",
  '',
  'const releaseForm = reactive<Record<string, string>>({',
  "  packageName: ''",
  '})',
  'const releaseRules: Record<string, YFormRule | YFormRule[]> = {',
  '  packageName: {',
  "    validator: (value) => Boolean(value) || '发布前需要选择一个包。',",
  "    trigger: 'change'",
  '  }',
  '}'
].join('\n')

const basicCode = `<YSelect v-model="basicValue" placeholder="Select" :options="options" style="width: 240px" />`
const optionsCode = `<YSelect v-model="optionsValue" placeholder="Select" :options="aliasOptions" style="width: 240px" />`
const disabledOptionCode = `<YSelect v-model="disabledOptionValue" placeholder="Select" :options="disabledOptions" style="width: 240px" />`
const disabledCode = `<YSelect v-model="disabledValue" disabled placeholder="Select" :options="options" style="width: 240px" />`
const clearableCode = `<YSelect v-model="clearableValue" clearable placeholder="Select" :options="options" style="width: 240px" />`
const sizeCode = `<div class="demo-stack demo-stack--inline">
  <YSelect v-model="sizeValue" size="large" placeholder="Large" :options="options" style="width: 220px" />
  <YSelect v-model="sizeValue" placeholder="Default" :options="options" style="width: 220px" />
  <YSelect v-model="sizeValue" size="small" placeholder="Small" :options="options" style="width: 220px" />
</div>`
const multipleCode = `<YSelect v-model="multipleValue" multiple clearable placeholder="Select" :options="options" style="width: 320px" />`
const customLabelCode = `<YSelect v-model="customLabelValue" placeholder="Select" :options="aliasOptions" style="width: 320px" />`
const groupedCode = `<YSelect v-model="groupedValue" placeholder="Select" :options="groupedOptions" style="width: 280px" />`
const filterableCode = `<YSelect
  v-model="filterableValue"
  filterable
  search-placeholder="Search packages"
  empty-text="No package matches"
  placeholder="Select"
  :options="options"
  style="width: 280px"
/>`
const remoteCode = `<YSelect
  v-model="remoteValue"
  filterable
  search-placeholder="Search remote packages"
  loading-text="Loading remote packages..."
  remote-error-text="Remote search failed"
  :remote-method="searchRemotePackages"
  placeholder="Select"
  :options="remotePackageOptions"
  style="width: 280px"
/>`
const creatableCode = `<YSelect
  v-model="creatableValue"
  filterable
  allow-create
  search-placeholder="Search or create"
  placeholder="Select"
  :options="options"
  style="width: 280px"
/>`
const valueKeyCode = `<YSelect v-model="valueKeyValue" placeholder="Select" :options="packageOptions" style="width: 280px" />`
const collapseTagsCode = `<YSelect
  v-model="collapsedValue"
  multiple
  collapse-tags
  :max-collapse-tags="2"
  clearable
  placeholder="Select"
  :options="options"
  style="width: 360px"
/>`
const loadingCode = `<YSelect
  v-model="loadingValue"
  loading
  loading-text="正在加载组件..."
  placeholder="Select"
  :options="loadingOptions"
  style="width: 280px"
/>`
const emptyCode = `<YSelect
  v-model="emptyValue"
  filterable
  empty-text="没有匹配的组件"
  placeholder="Select"
  :options="emptyOptions"
  style="width: 280px"
/>`
const virtualCode = `<YSelect
  v-model="virtualizedValue"
  filterable
  virtualized
  :virtual-height="220"
  :virtual-item-height="36"
  :virtual-overscan="2"
  placeholder="Select"
  :options="largeOptions"
  style="width: 320px"
/>`
const formCode = [
  '<YForm :model="releaseForm" :rules="releaseRules">',
  '  <YFormItem prop="packageName" label="Release package" required v-slot="{ error, invalid, labelFor, messageId, validate }">',
  '    <YSelect',
  '      :id="labelFor"',
  '      :model-value="releaseForm.packageName"',
  '      placeholder="Choose package"',
  '      clearable',
  '      filterable',
  '      search-placeholder="Search release package"',
  '      :options="options"',
  '      :error="error"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  "      @update:model-value=\"(value) => { releaseForm.packageName = Array.isArray(value) ? value[0] ?? '' : value; validate('change') }\"",
  '    />',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Select 选择器

当选项过多时，使用下拉菜单展示并选择内容。Yok UI 的 Select 保持 `combobox + listbox` 语义，并通过统一的弹层定位能力处理翻转、视口避让和键盘焦点。

::: tip TIP
`YSelect` 会尽量继承容器宽度。用于行内表单、工具栏或窄布局时，建议像 Element Plus 文档中一样为组件或外层容器设置稳定宽度，避免弹层宽度和触发器宽度不一致。
:::

## 基础用法 {#basic-usage}

适用广泛的基础单选，`v-model` 的值为当前被选中的 `option.value`。

<DocDemo
  id="select-basic-usage"
  title="基础用法"
  description="通过 options 提供列表数据，选择后同步更新 v-model。"
  :code="basicCode"
  :setup="selectExampleSetup"
  :usage="['v-model', 'options', 'single select']"
>
  <YSelect v-model="basicValue" placeholder="Select" :options="options" style="width: 240px" />
</DocDemo>

## Options 属性 {#options-attributes}

`YSelect` 以 `options` 数组作为数据源。每一项包含 `label` 和 `value`，也可以附加 `group`、`disabled` 等字段。

<DocDemo
  id="select-options-attributes"
  title="Options 属性"
  description="通过 label 定义展示文本，通过 value 定义提交值。"
  :code="optionsCode"
  :setup="selectExampleSetup"
  :usage="['label', 'value', 'data driven']"
>
  <YSelect v-model="optionsValue" placeholder="Select" :options="aliasOptions" style="width: 240px" />
</DocDemo>

## 有禁用选项 {#disabled-option}

在 `options` 中为单个选项设置 `disabled: true` 后，该选项会保留在列表中，但不可被选择。

<DocDemo
  id="select-disabled-option"
  title="有禁用选项"
  description="适合展示暂不可用、无权限或仍在规划中的选项。"
  :code="disabledOptionCode"
  :setup="selectExampleSetup"
  :usage="['disabled option', 'listbox']"
>
  <YSelect v-model="disabledOptionValue" placeholder="Select" :options="disabledOptions" style="width: 240px" />
</DocDemo>

## 禁用状态 {#disabled}

为组件设置 `disabled` 后，触发器不可聚焦、不可展开，也不会触发值变更事件。

<DocDemo
  id="select-disabled"
  title="禁用状态"
  description="禁用状态用于只读配置、权限不足或流程未完成的场景。"
  :code="disabledCode"
  :setup="selectExampleSetup"
  :usage="['disabled', 'readonly flow']"
>
  <YSelect v-model="disabledValue" disabled placeholder="Select" :options="options" style="width: 240px" />
</DocDemo>

## 可清空 {#clearable}

使用 `clearable` 属性即可得到一个可清空的选择器。清空时会触发 `clear`、`change` 和 `update:modelValue`。

<DocDemo
  id="select-clearable"
  title="可清空"
  description="适合筛选项、可选配置项和非必填表单项。"
  :code="clearableCode"
  :setup="selectExampleSetup"
  :usage="['clearable', 'clear event']"
>
  <YSelect v-model="clearableValue" clearable placeholder="Select" :options="options" style="width: 240px" />
</DocDemo>

## 尺寸 {#sizes}

通过 `size` 控制选择器尺寸；未指定时会继承 `YConfigProvider` 的全局尺寸。

<DocDemo
  id="select-sizes"
  title="尺寸"
  description="提供 large、medium、small 三种尺寸，用于表单、工具栏和紧凑配置面板。"
  :code="sizeCode"
  :setup="selectExampleSetup"
  :usage="['size', 'config provider']"
>
  <div class="demo-stack demo-stack--inline">
    <YSelect v-model="sizeValue" size="large" placeholder="Large" :options="options" style="width: 220px" />
    <YSelect v-model="sizeValue" placeholder="Default" :options="options" style="width: 220px" />
    <YSelect v-model="sizeValue" size="small" placeholder="Small" :options="options" style="width: 220px" />
  </div>
</DocDemo>

## 基础多选 {#multiple}

设置 `multiple` 后，`v-model` 使用字符串数组，选中项以标签形式展示。

<DocDemo
  id="select-multiple"
  title="基础多选"
  description="适合包类型、状态集合、权限范围等多值选择。"
  :code="multipleCode"
  :setup="selectExampleSetup"
  :usage="['multiple', 'tags', 'aria-multiselectable']"
>
  <YSelect v-model="multipleValue" multiple clearable placeholder="Select" :options="options" style="width: 320px" />
</DocDemo>

## 自定义模板 {#custom-template}

Element Plus 使用插槽自定义选项模板；Yok UI 当前版本采用数据驱动，优先通过 `label` 和 `group` 组织展示内容。需要完全自定义 option 渲染时，应在组件能力中新增 `option` slot 后再承诺文档 API。

<DocDemo
  id="select-custom-template"
  title="自定义模板"
  description="当前以更明确的 label 文案表达选项状态，保持文档和真实 API 一致。"
  :code="customLabelCode"
  :setup="selectExampleSetup"
  :usage="['label', 'structured option', 'api honest']"
>
  <YSelect v-model="customLabelValue" placeholder="Select" :options="aliasOptions" style="width: 320px" />
</DocDemo>

## 将选项进行分组 {#option-group}

为选项提供相同的 `group` 字段后，下拉面板会按组展示。

<DocDemo
  id="select-option-group"
  title="将选项进行分组"
  description="适合组件库、权限域、业务线等具有明显分类的选项。"
  :code="groupedCode"
  :setup="selectExampleSetup"
  :usage="['group', 'option category']"
>
  <YSelect v-model="groupedValue" placeholder="Select" :options="groupedOptions" style="width: 280px" />
</DocDemo>

## 筛选选项 {#filterable}

设置 `filterable` 后，下拉面板会显示搜索框，并按 `label` 本地过滤。

<DocDemo
  id="select-filterable"
  title="筛选选项"
  description="本地筛选适合数量不大但需要快速定位的固定选项列表。"
  :code="filterableCode"
  :setup="selectExampleSetup"
  :usage="['filterable', 'searchbox', 'empty text']"
>
  <YSelect
    v-model="filterableValue"
    filterable
    search-placeholder="Search packages"
    empty-text="No package matches"
    placeholder="Select"
    :options="options"
    style="width: 280px"
  />
</DocDemo>

## 远程搜索 {#remote-search}

远程搜索通过 `filterable` 和 `remote-method` 组合完成。输入变化后组件会调用远程方法、自动展示加载态，并忽略过期返回，避免旧请求覆盖新结果。

<DocDemo
  id="select-remote-search"
  title="远程搜索"
  description="输入关键词后异步返回选项；search 事件仍可用于日志、埋点或外部状态复现。"
  :code="remoteCode"
  :setup="selectExampleSetup"
  :usage="['remote-method', 'loading state', 'stale request guard']"
>
  <YSelect
    v-model="remoteValue"
    filterable
    search-placeholder="Search remote packages"
    loading-text="Loading remote packages..."
    remote-error-text="Remote search failed"
    :remote-method="searchRemotePackages"
    placeholder="Select"
    :options="remotePackageOptions"
    style="width: 280px"
  />
</DocDemo>

## 创建新的选项 {#allow-create}

设置 `allow-create` 后，搜索词没有命中现有选项时，可以创建并选中该值。

<DocDemo
  id="select-allow-create"
  title="创建新的选项"
  description="适合标签、临时分类和配置项快速录入。"
  :code="creatableCode"
  :setup="selectExampleSetup"
  :usage="['allow-create', 'filterable']"
>
  <YSelect
    v-model="creatableValue"
    filterable
    allow-create
    search-placeholder="Search or create"
    placeholder="Select"
    :options="options"
    style="width: 280px"
  />
</DocDemo>

## 使用值键 value-key 属性 {#value-key}

Element Plus 的 `value-key` 用于对象值场景。Yok UI 当前 `YSelectValue` 为 `string | string[]`，因此推荐把稳定业务主键写入 `value` 字段。

<DocDemo
  id="select-value-key"
  title="使用值键 value-key 属性"
  description="当前以稳定 value 字段替代对象值 value-key，避免比较对象引用导致状态不稳定。"
  :code="valueKeyCode"
  :setup="selectExampleSetup"
  :usage="['stable value', 'business key']"
>
  <YSelect v-model="valueKeyValue" placeholder="Select" :options="packageOptions" style="width: 280px" />
</DocDemo>

## 自定义标签 {#custom-tag}

多选场景下可以使用 `collapse-tags` 和 `max-collapse-tags` 控制标签展示数量。

<DocDemo
  id="select-custom-tag"
  title="自定义标签"
  description="折叠标签能避免工具栏或表单行被大量选中项撑开。"
  :code="collapseTagsCode"
  :setup="selectExampleSetup"
  :usage="['collapse-tags', 'max-collapse-tags']"
>
  <YSelect
    v-model="collapsedValue"
    multiple
    collapse-tags
    :max-collapse-tags="2"
    clearable
    placeholder="Select"
    :options="options"
    style="width: 360px"
  />
</DocDemo>

## 自定义加载 {#custom-loading}

通过 `loading` 和 `loading-text` 定义加载状态文案。

<DocDemo
  id="select-custom-loading"
  title="自定义加载"
  description="加载中会暂停可选项渲染，并向用户说明当前状态。"
  :code="loadingCode"
  :setup="selectExampleSetup"
  :usage="['loading', 'loading-text']"
>
  <YSelect
    v-model="loadingValue"
    loading
    loading-text="正在加载组件..."
    placeholder="Select"
    :options="loadingOptions"
    style="width: 280px"
  />
</DocDemo>

## 空值配置 {#empty-values}

过滤后无匹配项或没有可用数据时，可以用 `empty-text` 配置空状态文案。

<DocDemo
  id="select-empty-values"
  title="空值配置"
  description="用于无匹配结果、权限下无选项或数据尚未配置的场景。"
  :code="emptyCode"
  :setup="selectExampleSetup"
  :usage="['empty-text', 'empty options']"
>
  <YSelect
    v-model="emptyValue"
    filterable
    empty-text="没有匹配的组件"
    placeholder="Select"
    :options="emptyOptions"
    style="width: 280px"
  />
</DocDemo>

## 大数据列表 {#virtualized}

当选项数量很大时，可以开启 `virtualized`，只渲染视口附近的选项。

<DocDemo
  id="select-virtualized"
  title="大数据列表"
  description="虚拟滚动适合千级以上选项，同时保留 listbox / option 的可访问结构。"
  :code="virtualCode"
  :setup="selectExampleSetup"
  :usage="['virtualized', 'large list', 'performance']"
>
  <YSelect
    v-model="virtualizedValue"
    filterable
    virtualized
    :virtual-height="220"
    :virtual-item-height="36"
    :virtual-overscan="2"
    placeholder="Select"
    :options="largeOptions"
    style="width: 320px"
  />
</DocDemo>

## 表单校验 {#form-validation}

与 `YForm` 和 `YFormItem` 配合时，需要把 `error`、`invalid`、`aria-describedby` 和值更新显式传入 Select。

<DocDemo
  id="select-form-validation"
  title="表单校验"
  description="表单项负责校验时机，Select 负责展示无效状态并保持可访问关联。"
  :code="formCode"
  :setup="formSetup"
  :usage="['YForm', 'aria-describedby', 'validation']"
>
  <YForm :model="releaseForm" :rules="releaseRules">
    <YFormItem prop="packageName" label="Release package" required v-slot="{ error, invalid, labelFor, messageId, validate }">
      <YSelect
        :id="labelFor"
        :model-value="releaseForm.packageName"
        placeholder="Choose package"
        clearable
        filterable
        search-placeholder="Search release package"
        :options="options"
        :error="error"
        :invalid="invalid"
        :aria-describedby="messageId"
        @update:model-value="(value) => { releaseForm.packageName = Array.isArray(value) ? value[0] ?? '' : value; validate('change') }"
      />
    </YFormItem>
  </YForm>
</DocDemo>

## Select API {#select-api}

Yok UI 的 Select API 和示例保持同源维护，以下数据来自组件注册表。

<ComponentApiSection name="YSelect" />

## Accessibility {#accessibility}

- 触发器使用 `combobox` 语义，并通过 `aria-expanded`、`aria-controls`、`aria-activedescendant` 关联弹层。
- 弹层使用 `listbox` 和 `option` 语义，多选状态会同步到 `aria-selected`。
- 可搜索模式使用独立 `searchbox`，并保持 Escape、Enter、方向键和 Tab 的键盘流程。
- 表单校验场景通过 `aria-invalid` 和 `aria-describedby` 暴露错误信息。
