<script setup lang="ts">
import { ref } from 'vue'

const confirmOpen = ref(false)
const promptOpen = ref(false)
const branchName = ref('feature/docs')

const confirmSetup = `import { ref } from 'vue'
import { YButton, YMessageBox } from '@yok-ui/core'

const open = ref(false)`

const promptSetup = `import { ref } from 'vue'
import { YMessageBox } from '@yok-ui/core'

const open = ref(true)
const branchName = ref('feature/docs')

function handleCreate() {
  open.value = false
}`

const confirmCode = `<YButton variant="primary" @click="open = true">Publish release</YButton>
<YMessageBox
  :open="open"
  title="Publish release?"
  message="This will make the selected component release visible to users."
  variant="confirm"
  tone="warning"
  confirm-text="Publish"
  cancel-text="Review"
  @confirm="open = false"
  @cancel="open = false"
  @close="open = false"
/>`

const promptCode = `<YMessageBox
  :open="open"
  v-model:prompt-value="branchName"
  title="Create branch"
  message="Branch names must use the feature/ prefix."
  variant="prompt"
  prompt-label="Branch name"
  prompt-error="Use a feature/ prefix."
  @confirm="handleCreate"
/>`

const serviceCode = `<script setup lang="ts">
import { messageBox, YButton } from '@yok-ui/core'

async function confirmDelete() {
  try {
    await messageBox.confirm({
      title: 'Delete draft?',
      message: 'This operation cannot be undone.',
      tone: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    await deleteDraft()
  } catch (result) {
    // result.action is "cancel" or "close"
  }
}

async function deleteDraft() {
  return Promise.resolve()
}
</` + `script>

<template>
  <YButton variant="secondary" @click="confirmDelete">
    Call messageBox.confirm(...)
  </YButton>
</template>`
</script>

# Message Box

Message Box 用于需要 Promise 结果的确认流程，例如发布、删除、离开页面和输入确认。它覆盖 `alert`、`confirm`、`prompt` 三种常见路线；复杂表单和长内容仍应使用 `YModal`。

## Examples

<DocDemo
  title="Confirm"
  description="适合中风险操作。确认、取消和关闭会回到同一个受控 open 状态。"
  :code="confirmCode"
  :setup="confirmSetup"
  :usage="['confirm', 'alertdialog', 'Promise']"
>
  <YButton variant="primary" @click="confirmOpen = true">Publish release</YButton>
  <YMessageBox
    :open="confirmOpen"
    title="Publish release?"
    message="This will make the selected component release visible to users."
    variant="confirm"
    tone="warning"
    confirm-text="Publish"
    cancel-text="Review"
    :close-on-overlay="false"
    @confirm="confirmOpen = false"
    @cancel="confirmOpen = false"
    @close="confirmOpen = false"
  />
</DocDemo>

<DocDemo
  title="Prompt"
  description="适合需要用户输入少量文本再继续的确认流程。"
  :code="promptCode"
  :setup="promptSetup"
  :usage="['prompt', 'validation', 'v-model:promptValue']"
>
  <YButton variant="secondary" @click="promptOpen = true">Create branch</YButton>
  <YMessageBox
    :open="promptOpen"
    v-model:prompt-value="branchName"
    title="Create branch"
    message="Branch names must use the feature/ prefix."
    variant="prompt"
    tone="info"
    prompt-label="Branch name"
    prompt-error="Use a feature/ prefix."
    confirm-text="Create"
    @confirm="promptOpen = false"
    @cancel="promptOpen = false"
    @close="promptOpen = false"
  />
</DocDemo>

## Service API

<DocDemo
  title="Promise service"
  description="确认 resolve，取消或关闭 reject，适合和业务 mutation 串联。"
  :code="serviceCode"
  :usage="['messageBox.confirm', 'messageBox.prompt', 'destroyAll']"
>
  <YButton variant="secondary">Call messageBox.confirm(...)</YButton>
</DocDemo>

`messageBox.alert()`、`messageBox.confirm()` 和 `messageBox.prompt()` 都返回 Promise。确认时 resolve `{ action: 'confirm' }`；取消或关闭时 reject `{ action: 'cancel' }` 或 `{ action: 'close' }`。`messageBox.destroyAll()` 会关闭所有待处理弹窗，并以 close action 拒绝未完成 Promise。

## Live example

<LiveExampleRunner
  preset="messageBox"
  title="在线编辑 Message Box 示例"
  description="预览发布确认、危险删除、输入确认、异步确认、移动弹窗和键盘焦点路径。"
/>

## Usage notes

- 需要用户必须做决定的流程使用 `confirm`；只提示信息使用 `alert`；需要少量输入后继续使用 `prompt`。
- 危险操作应设置 `tone="danger"`，使用明确的标题和不可逆说明，并关闭遮罩误触关闭。
- `onConfirm` 可以返回 Promise；Promise 未结束前组件进入 loading，避免重复提交。
- `prompt` 只适合短文本输入。多字段表单、文件上传或复杂内容应使用 `YModal`。
- service API 只接收安全文本配置，不支持传入任意 HTML 字符串。

## API

<ComponentApiSection name="YMessageBox" />

## Accessibility

- 弹窗使用 `dialog` 或 `alertdialog`，并设置 `aria-modal`、`aria-labelledby` 和 `aria-describedby`。
- 打开后焦点进入弹窗，Tab / Shift + Tab 保持在弹窗内部。
- Escape 关闭只由当前最上层弹窗处理，关闭后恢复到原触发位置。
- Prompt 输入框使用 label、错误状态和 `role="alert"` 错误提示。
- loading 状态会禁用关闭、取消和确认按钮，并在确认按钮上设置 `aria-busy`。
