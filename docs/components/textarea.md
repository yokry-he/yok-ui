<script setup lang="ts">
import { ref } from 'vue'

const text = ref('Yok UI is fresh, cute, and practical.')

const textareaSetup = [
  "import { ref } from 'vue'",
  "import { YTextarea } from '@yok-ui/core'",
  '',
  "const text = ref('Yok UI is fresh, cute, and practical.')"
].join('\n')

const basicCode = [
  '<YTextarea v-model="text" label="Description" helper="Keep it short and useful." />',
  '<p class="demo-note">Characters: {{ text.length }}</p>'
].join('\n')

const errorCode = [
  '<YTextarea',
  '  model-value=""',
  '  label="Release notes"',
  '  error="Release notes are required"',
  '  :rows="4"',
  '/>'
].join('\n')
</script>

# Textarea

Textarea 用于多行文本输入，适合说明、备注、描述和配置内容。

::: tip TIP
`YTextarea` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic textarea {#textarea-basic-textarea}

<DocDemo
  title="Basic textarea"
  description="多行文本输入适合说明、备注和描述字段，helper 用于补充输入期望。"
  :code="basicCode"
  :setup="textareaSetup"
  :usage="['v-model', 'helper', 'rows']"
>
  <YTextarea v-model="text" label="Description" helper="Keep it short and useful." />
  <p class="demo-note">Characters: {{ text.length }}</p>
</DocDemo>

## Error state {#textarea-error-state}

<DocDemo
  title="Error state"
  description="错误态会同步 aria-invalid，并把错误文案作为可感知反馈。"
  :code="errorCode"
  :setup="textareaSetup"
  :usage="['error', 'aria-invalid', 'rows']"
>
  <YTextarea
    model-value=""
    label="Release notes"
    error="Release notes are required"
    :rows="4"
  />
</DocDemo>

## Textarea API {#textarea-api}

<ComponentApiSection name="YTextarea" />

## Accessibility {#accessibility}

- `label` 会作为多行输入的可访问名称，避免只依赖 placeholder。
- `helper` 和 `error` 应与输入框建立描述关系，错误态需要同步 `aria-invalid`。
- `rows` 只影响显示高度，不应限制用户输入完整内容。
- `size` 未显式传入时会读取 `YConfigProvider`，便于整段表单统一压缩或放大。
