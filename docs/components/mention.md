<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule } from '@yok-ui/core'

const value = ref('Please review @ad')
const loadingValue = ref('Ask @gr')
const emptyValue = ref('Ask @missing')
const releaseForm = reactive<Record<string, string>>({
  note: ''
})
const releaseRules: Record<string, YFormRule | YFormRule[]> = {
  note: {
    validator: (value) => value.trim().length > 0 || '请输入发布说明。',
    trigger: 'change'
  }
}
const options = [
  { label: 'Ada Lovelace', value: 'ada', description: 'Core maintainer' },
  { label: 'Grace Hopper', value: 'grace', description: 'Compiler team' },
  { label: 'Lin Design', value: 'lin-design', description: 'Design system owner' },
  { label: 'Release Notes', value: 'release-notes', description: 'Documentation topic' },
  { label: 'Blocked User', value: 'blocked', description: 'No longer available', disabled: true }
]

function searchRemoteMentions(query: string, prefix: string) {
  return new Promise<typeof options>((resolve) => {
    globalThis.setTimeout(() => {
      const keyword = query.trim().toLowerCase()
      const source = prefix === '#'
        ? options.filter((option) => option.value === 'release-notes')
        : options
      resolve(source.filter((option) => `${option.label} ${option.value}`.toLowerCase().includes(keyword)))
    }, 360)
  })
}

const basicCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YMention } from '@yok-ui/core'",
  '',
  "const value = ref('Please review @ad')",
  'const options = [',
  "  { label: 'Ada Lovelace', value: 'ada', description: 'Core maintainer' },",
  "  { label: 'Grace Hopper', value: 'grace', description: 'Compiler team' }",
  ']',
  '</' + 'script>',
  '',
  '<template>',
  '  <YMention',
  '    v-model="value"',
  '    label="Release note"',
  '    placeholder="Type @ to mention"',
  '    clearable',
  '    :options="options"',
  '  />',
  '</template>'
].join('\n')

const stateSetup = [
  "import { ref } from 'vue'",
  "import { YMention } from '@yok-ui/core'",
  '',
  "const loadingValue = ref('Ask @gr')",
  "const emptyValue = ref('Ask @missing')",
  'const options = [',
  "  { label: 'Ada Lovelace', value: 'ada', description: 'Core maintainer' },",
  "  { label: 'Grace Hopper', value: 'grace', description: 'Compiler team' },",
  "  { label: 'Lin Design', value: 'lin-design', description: 'Design system owner' },",
  "  { label: 'Blocked User', value: 'blocked', description: 'No longer available', disabled: true }",
  ']',
  '',
  'function searchRemoteMentions(query: string, prefix: string) {',
  '  return new Promise<typeof options>((resolve) => {',
  '    globalThis.setTimeout(() => {',
  '      const keyword = query.trim().toLowerCase()',
  "      const source = prefix === '#'",
  "        ? options.filter((option) => option.value === 'release-notes')",
  '        : options',
  "      resolve(source.filter((option) => `${option.label} ${option.value}`.toLowerCase().includes(keyword)))",
  '    }, 360)',
  '  })',
  '}'
].join('\n')

const stateCode = `<YMention v-model="loadingValue" label="Remote teammate" loading-text="Searching teammates..." remote-error-text="Failed to load remote mentions" :remote-method="searchRemoteMentions" :options="options" />
<YMention v-model="emptyValue" label="Empty mention" empty-text="No teammate matched" clearable :options="options" />`

const formSetup = [
  "import { reactive } from 'vue'",
  "import { YMention, YForm, YFormItem, type YFormRule } from '@yok-ui/core'",
  '',
  'const releaseForm = reactive<Record<string, string>>({',
  "  note: ''",
  '})',
  'const releaseRules: Record<string, YFormRule | YFormRule[]> = {',
  '  note: {',
  "    validator: (value) => value.trim().length > 0 || '请输入发布说明。',",
  "    trigger: 'change'",
  '  }',
  '}',
  'const options = [',
  "  { label: 'Ada Lovelace', value: 'ada', description: 'Core maintainer' },",
  "  { label: 'Grace Hopper', value: 'grace', description: 'Compiler team' },",
  "  { label: 'Lin Design', value: 'lin-design', description: 'Design system owner' },",
  "  { label: 'Release Notes', value: 'release-notes', description: 'Documentation topic' }",
  ']'
].join('\n')

const formCode = [
  '<YForm :model="releaseForm" :rules="releaseRules">',
  '  <YFormItem prop="note" label="Release note" required v-slot="{ error, invalid, labelFor, messageId, validate }">',
  '    <YMention',
  '      :id="labelFor"',
  '      :model-value="releaseForm.note"',
  '      placeholder="Mention reviewers with @"',
  '      clearable',
  '      prefix="@,#"',
  '      :options="options"',
  '      :error="error"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  '      @update:model-value="(value) => { releaseForm.note = value; validate(\'change\') }"',
  '    />',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Mention

Mention 用于在多行文本中快速提及成员、主题或对象。它适合评论、发布说明、协作审核和后台工单备注；如果用户只能从固定集合中选择一个值，应使用 `YSelect` 或 `YAutocomplete`。

::: tip TIP
`YMention` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Team mention {#mention-team-mention}

<DocDemo
  title="Team mention"
  description="输入 @ 后展示成员建议；选择建议会替换当前 token，并保留 textarea 中其他文本。"
  :code="basicCode"
  :usage="['v-model', 'options', 'prefix', 'select', 'search']"
>
  <YMention
    v-model="value"
    label="Release note"
    placeholder="Type @ to mention"
    clearable
    :options="options"
  />
  <p class="demo-note">Current note: {{ value || 'empty' }}</p>
</DocDemo>

## Remote search and empty states {#mention-loading-and-empty-states}

<DocDemo
  title="Remote search and empty states"
  description="远程搜索成员时通过 remoteMethod 接收当前 token 和 prefix；组件会处理加载、失败和过期请求，空结果保留原始文本。"
  :code="stateCode"
  :setup="stateSetup"
  :usage="['remoteMethod', 'prefix', 'loadingText', 'remoteErrorText', 'emptyText']"
>
  <div class="docs-demo-grid">
    <YMention
      v-model="loadingValue"
      label="Remote teammate"
      loading-text="Searching teammates..."
      remote-error-text="Failed to load remote mentions"
      :remote-method="searchRemoteMentions"
      :options="options"
    />
    <YMention
      v-model="emptyValue"
      label="Empty mention"
      empty-text="No teammate matched"
      clearable
      :options="options"
    />
  </div>
</DocDemo>

## Form Validation {#mention-form-validation}

<DocDemo
  title="Form validation"
  description="Mention 在多行文本中插入 token，校验要跟随 textarea 内容变化并同步错误语义。"
  :code="formCode"
  :setup="formSetup"
  :usage="['YFormItem', 'textarea combobox', 'mention token']"
>
  <YForm :model="releaseForm" :rules="releaseRules">
    <YFormItem prop="note" label="Release note" required v-slot="{ error, invalid, labelFor, messageId, validate }">
      <YMention
        :id="labelFor"
        :model-value="releaseForm.note"
        placeholder="Mention reviewers with @"
        clearable
        prefix="@,#"
        :options="options"
        :error="error"
        :invalid="invalid"
        :aria-describedby="messageId"
        @update:model-value="(value) => { releaseForm.note = value; validate('change') }"
      />
    </YFormItem>
  </YForm>
</DocDemo>

## Mention API {#mention-api}

<ComponentApiSection name="YMention" />

## Accessibility {#accessibility}

- textarea 使用 `role="combobox"`、`aria-autocomplete="list"`、`aria-expanded`、`aria-controls` 和 `aria-activedescendant`。
- 建议面板使用 `role="listbox"`，建议项使用 `role="option"` 和 `aria-selected`。
- `ArrowDown` / `ArrowUp` 在可用建议间移动，`Enter` 插入当前建议，`Escape` 关闭面板。
- 禁用建议会保留可见说明，但不会被鼠标或键盘选中。
- loading 和 empty 状态使用 `role="status"`，便于辅助技术感知建议列表状态变化。
- 错误状态通过 `aria-invalid` 暴露，可通过 `ariaDescribedby` 与外部错误信息关联。
