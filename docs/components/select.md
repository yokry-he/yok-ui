<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const value = ref('core')
const clearableValue = ref('product')
const multipleValue = ref(['core', 'product'])
const collapsedValue = ref(['core', 'product', 'admin'])
const searchableValue = ref('')
const disabledOptionValue = ref('core')
const creatableValue = ref('')
const virtualizedValue = ref('pkg-12')
const groupedValue = ref('select')
const loadingValue = ref('')
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
const largeOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: `Package ${index + 1}`,
  value: `pkg-${index + 1}`
}))
const remoteOptions = [
  { label: 'Loading from npm registry...', value: 'loading', disabled: true }
]

const basicSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const value = ref('core')
const disabledOptionValue = ref('core')

const options = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]
const disabledOptions = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin', disabled: true }
]`

const basicCode = `<YSelect v-model="value" label="Package" :options="options" />
<YSelect v-model="disabledOptionValue" label="Disabled option" :options="disabledOptions" />`

const clearableSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const clearableValue = ref('product')
const options = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]`

const clearableCode = `<YSelect v-model="clearableValue" label="Clearable package" clearable :options="options" />`

const multipleSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const multipleValue = ref(['core', 'product'])
const collapsedValue = ref(['core', 'product', 'admin'])
const options = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]`

const multipleCode = `<YSelect v-model="multipleValue" label="Packages" multiple clearable :options="options" />
<YSelect v-model="collapsedValue" label="Collapsed packages" multiple collapse-tags :max-collapse-tags="2" clearable :options="options" />`

const filterableSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const searchableValue = ref('')
const creatableValue = ref('')
const options = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]`

const filterableCode = `<YSelect v-model="searchableValue" label="Search package" filterable search-placeholder="Search packages" empty-text="No package matches" :options="options" />
<YSelect v-model="creatableValue" label="Creatable tag" filterable allow-create search-placeholder="Search or create tags" :options="options" />`

const remoteSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const loadingValue = ref('')
const remoteOptions = [
  { label: 'Loading from npm registry...', value: 'loading', disabled: true }
]`

const remoteCode = `<YSelect v-model="loadingValue" label="Remote package" filterable loading loading-text="Loading package options..." :options="remoteOptions" />`

const groupedSetup = `import { ref } from 'vue'
import { YSelect } from '@yok-ui/core'

const groupedValue = ref('select')
const virtualizedValue = ref('pkg-12')
const groupedOptions = [
  { label: 'Button', value: 'button', group: 'Basic' },
  { label: 'Divider', value: 'divider', group: 'Basic' },
  { label: 'Input', value: 'input', group: 'Form' },
  { label: 'Select', value: 'select', group: 'Form' },
  { label: 'Tooltip', value: 'tooltip', group: 'Overlay' }
]
const largeOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: \`Package \${index + 1}\`,
  value: \`pkg-\${index + 1}\`
}))`

const groupedCode = `<YSelect v-model="groupedValue" label="Grouped package" :options="groupedOptions" />
<YSelect v-model="virtualizedValue" label="Virtualized package" filterable virtualized :virtual-height="220" :virtual-item-height="36" :virtual-overscan="2" :options="largeOptions" />
`

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
  '}',
  'const options = [',
  "  { label: 'Core package', value: 'core' },",
  "  { label: 'Product package', value: 'product' },",
  "  { label: 'Admin package', value: 'admin' }",
  ']'
].join('\n')

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

# Select

Select 用于从一组选项里选择单个或多个值。当前版本使用 Yok UI 自绘 `combobox + listbox` 结构，并通过 `@floating-ui/vue` 统一处理下拉面板定位、翻转和视口避让。

## Example

<DocDemo
  id="demo-basic-select"
  title="Basic usage"
  description="基础单选适合包类型、状态、权限等固定选项；禁用选项保留在列表中但不可选择。"
  :code="basicCode"
  :setup="basicSetup"
  :usage="['combobox', 'Floating UI', 'disabled-option']"
>
  <div class="demo-stack">
    <YSelect v-model="value" label="Package" :options="options" />
    <YSelect
      v-model="disabledOptionValue"
      label="Disabled option"
      :options="disabledOptions"
    />
  </div>
  <p class="demo-note">Selected: {{ value }} · Disabled option value: {{ disabledOptionValue }}</p>
</DocDemo>

<DocDemo
  title="Clearable"
  description="开启 clearable 后，已选值旁会出现清空按钮，并同步触发 clear、change 和 update:modelValue。"
  :code="clearableCode"
  :setup="clearableSetup"
  :usage="['clearable', 'clear event', 'single value']"
>
  <div class="demo-stack">
    <YSelect v-model="clearableValue" label="Clearable package" clearable :options="options" />
  </div>
  <p class="demo-note">Clearable value: {{ clearableValue || 'empty' }}</p>
</DocDemo>

<DocDemo
  title="Multiple selection"
  description="多选会以标签展示选中项；开启 collapseTags 后可以把长选择结果压缩成摘要。"
  :code="multipleCode"
  :setup="multipleSetup"
  :usage="['multiple', 'collapse-tags', 'remove tag', 'aria-multiselectable']"
>
  <div class="demo-stack">
    <YSelect v-model="multipleValue" label="Packages" multiple clearable :options="options" />
    <YSelect
      v-model="collapsedValue"
      label="Collapsed packages"
      multiple
      collapse-tags
      :max-collapse-tags="2"
      clearable
      :options="options"
    />
  </div>
  <p class="demo-note">Multiple: {{ multipleValue.join(', ') || 'none' }} · Collapsed: {{ collapsedValue.join(', ') }}</p>
</DocDemo>

<DocDemo
  title="Filterable and creatable"
  description="可搜索模式会在弹层中展示 searchbox；开启 allowCreate 时可以把未匹配输入创建为新选项。"
  :code="filterableCode"
  :setup="filterableSetup"
  :usage="['filterable', 'searchbox', 'empty-text', 'allow-create']"
>
  <div class="demo-stack">
    <YSelect
      v-model="searchableValue"
      label="Search package"
      filterable
      search-placeholder="Search packages"
      empty-text="No package matches"
      :options="options"
    />
    <YSelect
      v-model="creatableValue"
      label="Creatable tag"
      filterable
      allow-create
      search-placeholder="Search or create tags"
      :options="options"
    />
  </div>
  <p class="demo-note">Search: {{ searchableValue || 'none' }} · Created: {{ creatableValue || 'none' }}</p>
</DocDemo>

<DocDemo
  title="Remote loading"
  description="远程搜索加载中会暂停旧选项渲染，并通过 role=status 暴露 loading 文案。"
  :code="remoteCode"
  :setup="remoteSetup"
  :usage="['remote-search', 'loading', 'loading-text', 'status']"
>
  <div class="demo-stack">
    <YSelect
      v-model="loadingValue"
      label="Remote package"
      filterable
      loading
      loading-text="Loading package options..."
      :options="remoteOptions"
    />
  </div>
  <p class="demo-note">Remote value: {{ loadingValue || 'waiting for result' }}</p>
</DocDemo>

<DocDemo
  title="Grouped and virtualized"
  description="分组选项适合小规模分类；大列表可以开启 virtualized，保持滚动性能和 listbox 语义。"
  :code="groupedCode"
  :setup="groupedSetup"
  :usage="['grouped', 'virtualized', 'aria-setsize', 'large-list']"
>
  <div class="demo-stack">
    <YSelect
      v-model="groupedValue"
      label="Grouped package"
      :options="groupedOptions"
    />
    <YSelect
      v-model="virtualizedValue"
      label="Virtualized package"
      filterable
      virtualized
      :virtual-height="220"
      :virtual-item-height="36"
      :virtual-overscan="2"
      :options="largeOptions"
    />
  </div>
  <p class="demo-note">Grouped: {{ groupedValue }} · Virtualized: {{ virtualizedValue }}</p>
</DocDemo>

## Form Validation

<DocDemo
  title="Form validation"
  description="Select 的表单校验需要把单选、多选返回值归一化，再触发字段级校验。"
  :code="formCode"
  :setup="formSetup"
  :usage="['YFormItem', 'filterable', 'required']"
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

## Live example

<LiveExampleRunner
  preset="select"
  title="在线编辑 Select 示例"
  description="Select 运行器覆盖包选择、可清空、多选标签、标签折叠、尺寸密度、可搜索、无匹配、分组选项、禁用选项、创建选项、虚拟滚动、远程加载、必填错误、禁用审核、移动选择和键盘选择场景，可直接验证弹层定位与 combobox 语义。"
/>

## API

<ComponentApiSection name="YSelect" />

## Accessibility

- 触发器使用 `role="combobox"`、`aria-expanded`、`aria-controls` 和 `aria-activedescendant`。
- 下拉面板使用 `role="listbox"`，选项使用 `role="option"` 和 `aria-selected`。
- 选项带有 `group` 时会渲染 `role="group"` 与分组标签，同时保持方向键按扁平选项顺序移动。
- 选项带有 `disabled` 时会保留在列表中但不可被点击或键盘选中，方向键只在可用选项之间移动。
- 多选时下拉面板会增加 `aria-multiselectable="true"`，选中项以紧凑标签展示。
- 开启 `collapseTags` 后只展示前 `maxCollapseTags` 个标签，并用带 `aria-label` 的摘要标签提示剩余选中数量。
- 开启 `allowCreate` 时，只有在 `filterable` 搜索词不匹配现有选项时才出现创建项，并以 `role="option"` 暴露给鼠标和键盘路径。
- 开启 `virtualized` 时，listbox 会保留 `role="listbox"`，可见选项仍使用 `role="option"`，并通过 `aria-setsize` 与 `aria-posinset` 描述完整列表位置。
- 可搜索时浮层内会展示 `role="searchbox"`，并通过 `aria-controls` 关联当前 listbox。
- 异步加载时下拉面板使用 `role="status"` 暴露 loading 文案，并暂停渲染旧选项。
- 搜索框支持 `ArrowDown` / `ArrowUp` 进入可选项，`Enter` 选择第一个匹配项，`Escape` 关闭并返回触发器。
- 支持 Enter / Space 打开，方向键移动选项，Home / End 跳转首尾，Escape 关闭并返回触发器。
- 错误状态通过 `aria-invalid` 暴露，可通过 `ariaDescribedby` 与外部错误信息关联。
- `change`、`clear`、`remove`、`visibleChange` 和 `search` 事件可用于表单校验、远程搜索、审计日志和 Playground 复现。
- 弹层定位由 Floating UI 处理，文档示例需要同时覆盖普通、错误、禁用、移动和键盘路径，避免只验证静态触发器。

<ComponentAccessibilityEvidence name="YSelect" />
