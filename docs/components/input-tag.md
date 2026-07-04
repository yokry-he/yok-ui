<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { YFormRule, YInputTagInvalidPayload } from '@yok-ui/core'

const tags = ref(['Vue', 'TypeScript'])
const releaseTags = ref(['core', 'docs'])
const inputDraft = ref('')
const invalidMessage = ref('')
const formModel = reactive<{ tags: string[] }>({
  tags: []
})
const formRules: Record<string, YFormRule | YFormRule[]> = {
  tags: {
    validator: (value: string[]) => value.length > 0 || '至少需要一个标签。',
    trigger: 'change'
  }
}

function validateReleaseTag(value: string) {
  return value.length >= 3 || '标签至少需要 3 个字符。'
}

function handleInvalid(payload: YInputTagInvalidPayload) {
  invalidMessage.value = payload.message
}

const basicSetup = [
  "import { ref } from 'vue'",
  "import { YInputTag } from '@yok-ui/core'",
  '',
  "const tags = ref(['Vue', 'TypeScript'])"
].join('\n')

const basicCode = '<YInputTag v-model="tags" label="Tech stack" placeholder="Press Enter to add" />'

const validationSetup = [
  "import { ref } from 'vue'",
  "import { YInputTag, type YInputTagInvalidPayload } from '@yok-ui/core'",
  '',
  "const releaseTags = ref(['core', 'docs'])",
  "const invalidMessage = ref('')",
  '',
  'function validateReleaseTag(value: string) {',
  "  return value.length >= 3 || '标签至少需要 3 个字符。'",
  '}',
  '',
  'function handleInvalid(payload: YInputTagInvalidPayload) {',
  '  invalidMessage.value = payload.message',
  '}'
].join('\n')

const validationCode = [
  '<YInputTag',
  '  v-model="releaseTags"',
  '  label="Release tags"',
  '  placeholder="Add tag"',
  '  :max="4"',
  '  :validate-tag="validateReleaseTag"',
  '  @invalid="handleInvalid"',
  '/>',
  '<p v-if="invalidMessage">{{ invalidMessage }}</p>'
].join('\n')

const formSetup = [
  "import { reactive } from 'vue'",
  "import { YForm, YFormItem, YInputTag, type YFormRule } from '@yok-ui/core'",
  '',
  'const formModel = reactive<{ tags: string[] }>({',
  '  tags: []',
  '})',
  'const formRules: Record<string, YFormRule | YFormRule[]> = {',
  '  tags: {',
  "    validator: (value: string[]) => value.length > 0 || '至少需要一个标签。',",
  "    trigger: 'change'",
  '  }',
  '}'
].join('\n')

const formCode = [
  '<YForm :model="formModel" :rules="formRules">',
  '  <YFormItem prop="tags" label="Tags" required v-slot="{ error, invalid, labelFor, messageId, validate }">',
  '    <YInputTag',
  '      :id="labelFor"',
  '      :model-value="formModel.tags"',
  '      placeholder="Add tag"',
  '      :invalid="invalid"',
  '      :aria-describedby="messageId"',
  '      @update:model-value="(value) => { formModel.tags = value; validate(\'change\') }"',
  '    />',
  '    <p v-if="error" class="demo-note">{{ error }}</p>',
  '  </YFormItem>',
  '</YForm>'
].join('\n')
</script>

# Input Tag

Input Tag 用于录入标签、关键词、技能、分类和 release 标记。它比 Select tags 更轻，适合用户自由输入少量短文本。

## Examples

<DocDemo
  title="Basic tags"
  description="输入内容后按 Enter 创建标签，标签数组通过 v-model 同步。"
  :code="basicCode"
  :setup="basicSetup"
  :usage="['v-model', 'Enter', 'remove']"
>
  <YInputTag v-model="tags" label="Tech stack" placeholder="Press Enter to add" />
  <p class="demo-note">Current tags: {{ tags.join(', ') }}</p>
</DocDemo>

<DocDemo
  title="Validation"
  description="max、allowDuplicate 和 validateTag 共同覆盖重复、数量上限和业务规则。"
  :code="validationCode"
  :setup="validationSetup"
  :usage="['max', 'validateTag', 'invalid']"
>
  <YInputTag
    v-model="releaseTags"
    v-model:input-value="inputDraft"
    label="Release tags"
    placeholder="Add tag"
    :max="4"
    :validate-tag="validateReleaseTag"
    @invalid="handleInvalid"
  />
  <p v-if="invalidMessage" class="demo-note">{{ invalidMessage }}</p>
</DocDemo>

## Form Validation

<DocDemo
  title="Form item"
  description="数组字段可以直接接入 YFormItem。提交变化时触发 validate('change')，错误信息通过 aria-describedby 关联到输入框。"
  :code="formCode"
  :setup="formSetup"
  :usage="['YFormItem', 'array value', 'aria-describedby']"
>
  <YForm :model="formModel" :rules="formRules">
    <YFormItem prop="tags" label="Tags" required v-slot="{ error, invalid, labelFor, messageId, validate }">
      <YInputTag
        :id="labelFor"
        :model-value="formModel.tags"
        placeholder="Add tag"
        :invalid="invalid"
        :aria-describedby="messageId"
        @update:model-value="(value) => { formModel.tags = value; validate('change') }"
      />
      <p v-if="error" class="demo-note">{{ error }}</p>
    </YFormItem>
  </YForm>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="inputTag"
  title="在线编辑 Input Tag 示例"
  description="切换基础标签、重复校验、数量上限、表单校验、移动布局和键盘录入场景，验证标签输入在表单和筛选流程里的表现。"
/>

## Usage notes

- 适合少量自由文本标签；如果标签必须从远程数据里选择，优先使用 Select 或 TreeSelect。
- 默认禁止重复标签，避免筛选条件和发布标签出现重复值。
- 达到 `max` 后仍会保留输入焦点，提交时触发 `invalid`，让业务层可以展示明确原因。
- `inputValue` 适合需要保存未提交草稿的编辑器或复杂表单。

## API

<ComponentApiSection name="YInputTag" />

## Accessibility

- 使用原生 `input` 保留文本输入、Tab、Enter、Backspace 等键盘能力。
- 删除按钮有独立 `aria-label`，读屏用户可以知道正在删除哪个标签。
- 错误状态会设置 `aria-invalid="true"`；在 `YFormItem` 中应传入 `messageId` 到 `aria-describedby`。
- `invalid` 事件会给出失败原因和错误文案，便于业务层把校验结果写入 toast、表单摘要或日志。
