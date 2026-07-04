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
  ']'
].join('\n')

const stateCode = `<YAutocomplete v-model="loadingValue" label="Remote component" loading loading-text="Loading remote suggestions..." :options="options" />
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

## Examples

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

<DocDemo
  title="Loading and empty states"
  description="远程搜索可使用 loading 展示加载状态；没有匹配项时使用 emptyText 给出明确反馈。"
  :code="stateCode"
  :setup="stateSetup"
  :usage="['loading', 'loadingText', 'emptyText']"
>
  <div class="docs-demo-grid">
    <YAutocomplete
      v-model="loadingValue"
      label="Remote component"
      loading
      loading-text="Loading remote suggestions..."
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

## Form Validation

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

## Live example

<LiveExampleRunner
  preset="autocomplete"
  title="在线编辑 Autocomplete 示例"
  description="运行器覆盖组件搜索、受控输入、远程加载、无匹配建议、禁用建议、窄屏搜索和键盘补全路径，可直接验证 combobox 语义和建议弹层。"
/>

## API

<ComponentApiSection name="YAutocomplete" />

## Accessibility

- 输入框使用 `role="combobox"`、`aria-autocomplete="list"`、`aria-expanded`、`aria-controls` 和 `aria-activedescendant`。
- 建议面板使用 `role="listbox"`，建议项使用 `role="option"` 和 `aria-selected`。
- `ArrowDown` / `ArrowUp` 在可用建议间移动，`Enter` 选择当前建议，`Escape` 关闭面板。
- 禁用建议会保留可见说明，但不会被鼠标或键盘选中。
- loading 和 empty 状态使用 `role="status"`，便于辅助技术感知建议列表状态变化。
- 错误状态通过 `aria-invalid` 暴露，可通过 `ariaDescribedby` 与外部错误信息关联。
