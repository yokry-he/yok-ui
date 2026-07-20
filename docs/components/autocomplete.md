<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const value = ref('auto')
const emptyValue = ref('missing')
const loadingValue = ref('data')
const releaseForm = reactive<Record<string, string>>({
  componentName: ''
})
const releaseRules: Record<string, YFormRule | YFormRule[]> = {
  componentName: {
    validator: (value) => value.trim().length > 0 || '请输入组件名称。',
    trigger: 'change'
  }
}
const options = [
  { label: 'Button', value: 'button', description: 'Basic action component.' },
  { label: 'Autocomplete', value: 'autocomplete', description: 'Free text input with suggestions.' },
  { label: 'Select', value: 'select', description: 'Bounded option picker.' },
  { label: 'Cascader', value: 'cascader', description: 'Hierarchical path picker.' },
  { label: 'Data Table', value: 'data-table', description: 'Admin data workflow component.' },
  { label: 'Tour', value: 'tour', description: 'Step-by-step guidance overlay.' },
  { label: 'Experimental Remote Item', value: 'remote-item', description: 'Visible but disabled during loading.', disabled: true }
]

function searchRemoteComponents(query: string) {
  return new Promise<typeof options>((resolve) => {
    globalThis.setTimeout(() => {
      const keyword = query.trim().toLowerCase()
      resolve(options.filter((option) => `${option.label} ${option.value}`.toLowerCase().includes(keyword)))
    }, 360)
  })
}

const basicCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YAutocomplete } from '@yok-ui/core'",
  '',
  "const value = ref('auto')",
  'const options = [',
  "  { label: 'Autocomplete', value: 'autocomplete', description: 'Free text input with suggestions.' },",
  "  { label: 'Select', value: 'select', description: 'Bounded option picker.' }",
  ']',
  '</' + 'script>',
  '',
  '<template>',
  '  <YAutocomplete',
  '    v-model="value"',
  '    label="Component"',
  '    placeholder="Search components"',
  '    clearable',
  '    :options="options"',
  '  />',
  '</template>'
].join('\n')

const stateSetup = [
  "import { ref } from 'vue'",
  "import { YAutocomplete } from '@yok-ui/core'",
  '',
  "const loadingValue = ref('data')",
  "const emptyValue = ref('missing')",
  'const options = [',
  "  { label: 'Button', value: 'button', description: 'Basic action component.' },",
  "  { label: 'Autocomplete', value: 'autocomplete', description: 'Free text input with suggestions.' },",
  "  { label: 'Select', value: 'select', description: 'Bounded option picker.' },",
  "  { label: 'Experimental Remote Item', value: 'remote-item', description: 'Visible but disabled during loading.', disabled: true }",
  ']',
  '',
  'function searchRemoteComponents(query: string) {',
  '  return new Promise<typeof options>((resolve) => {',
  '    globalThis.setTimeout(() => {',
  '      const keyword = query.trim().toLowerCase()',
  "      resolve(options.filter((option) => `${option.label} ${option.value}`.toLowerCase().includes(keyword)))",
  '    }, 360)',
  '  })',
  '}'
].join('\n')

const stateCode = `<YAutocomplete v-model="loadingValue" label="Remote component" loading-text="Loading remote suggestions..." remote-error-text="Failed to load remote suggestions" :remote-method="searchRemoteComponents" :options="options" />
<YAutocomplete v-model="emptyValue" label="Empty result" empty-text="No component suggestions" clearable :options="options" />`

const formSetup = [
  "import { reactive } from 'vue'",
  "import { YAutocomplete, YForm, YFormItem, type YFormRule } from '@yok-ui/core'",
  '',
  'const releaseForm = reactive<Record<string, string>>({',
  "  componentName: ''",
  '})',
  'const releaseRules: Record<string, YFormRule | YFormRule[]> = {',
  '  componentName: {',
  "    validator: (value) => value.trim().length > 0 || '请输入组件名称。',",
  "    trigger: 'change'",
  '  }',
  '}',
  'const options = [',
  "  { label: 'Button', value: 'button', description: 'Basic action component.' },",
  "  { label: 'Autocomplete', value: 'autocomplete', description: 'Free text input with suggestions.' },",
  "  { label: 'Select', value: 'select', description: 'Bounded option picker.' },",
  "  { label: 'Cascader', value: 'cascader', description: 'Hierarchical path picker.' }",
  ']'
].join('\n')

const formCode = [
  '<YForm :model="releaseForm" :rules="releaseRules">',
  '  <YFormItem prop="componentName" label="Component name" required v-slot="{ error, invalid, labelFor, messageId, validate }">',
  '    <YAutocomplete',
  '      :id="labelFor"',
  '      :model-value="releaseForm.componentName"',
  '      placeholder="Button or custom component"',
  '      clearable',
  '      :options="options"',
  '      :error="error"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  '      @update:model-value="(value) => { releaseForm.componentName = value; validate(\'change\') }"',
  '    />',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Autocomplete

Autocomplete 用于“用户可以自由输入，但系统同时提供建议”的场景，例如组件搜索、命令补全、对象快速定位和远程搜索。固定选项选择应继续使用 `YSelect`。

::: tip TIP
`YAutocomplete` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Component search {#autocomplete-component-search}

<DocDemo
  title="Component search"
  description="输入时按 label 和 value 过滤建议；选择建议会写入 value，但手动输入的自由文本也会保留。"
  :code="basicCode"
  :usage="['v-model', 'options', 'clearable', 'select', 'search']"
>
  <YAutocomplete
    v-model="value"
    label="Component"
    placeholder="Search components"
    clearable
    :options="options"
  />
  <p class="demo-note">Current text: {{ value || 'empty' }}</p>
</DocDemo>

## Remote search and empty states {#autocomplete-loading-and-empty-states}

<DocDemo
  title="Remote search and empty states"
  description="远程搜索直接通过 remoteMethod 返回建议；组件会处理加载、失败和过期请求，空结果继续使用 emptyText 反馈。"
  :code="stateCode"
  :setup="stateSetup"
  :usage="['remoteMethod', 'loadingText', 'remoteErrorText', 'emptyText']"
>
  <div class="docs-demo-grid">
    <YAutocomplete
      v-model="loadingValue"
      label="Remote component"
      loading-text="Loading remote suggestions..."
      remote-error-text="Failed to load remote suggestions"
      :remote-method="searchRemoteComponents"
      :options="options"
    />
    <YAutocomplete
      v-model="emptyValue"
      label="Empty result"
      empty-text="No component suggestions"
      clearable
      :options="options"
    />
  </div>
</DocDemo>

## Form Validation {#autocomplete-form-validation}

<DocDemo
  title="Form validation"
  description="Autocomplete 可接受自由文本，表单校验应绑定输入更新事件而不是只等待建议项选择。"
  :code="formCode"
  :setup="formSetup"
  :usage="['YFormItem', 'free text', 'combobox error']"
>
  <YForm :model="releaseForm" :rules="releaseRules">
    <YFormItem prop="componentName" label="Component name" required v-slot="{ error, invalid, labelFor, messageId, validate }">
      <YAutocomplete
        :id="labelFor"
        :model-value="releaseForm.componentName"
        placeholder="Button or custom component"
        clearable
        :options="options"
        :error="error"
        :invalid="invalid"
        :aria-describedby="messageId"
        @update:model-value="(value) => { releaseForm.componentName = value; validate('change') }"
      />
    </YFormItem>
  </YForm>
</DocDemo>

## Autocomplete API {#autocomplete-api}

<ComponentApiSection name="YAutocomplete" />

## Accessibility {#accessibility}

- 输入框使用 `role="combobox"`、`aria-autocomplete="list"`、`aria-expanded`、`aria-controls` 和 `aria-activedescendant`。
- 建议面板使用 `role="listbox"`，建议项使用 `role="option"` 和 `aria-selected`。
- `ArrowDown` / `ArrowUp` 在可用建议间移动，`Enter` 选择当前建议，`Escape` 关闭面板。
- 禁用建议会保留可见说明，但不会被鼠标或键盘选中。
- loading 和 empty 状态使用 `role="status"`，便于辅助技术感知建议列表状态变化。
- 错误状态通过 `aria-invalid` 暴露，可通过 `ariaDescribedby` 与外部错误信息关联。
