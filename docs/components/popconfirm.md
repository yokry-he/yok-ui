<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Waiting for action.')
const setup = `import { ref } from 'vue'
import { YButton, YPopconfirm } from '@yok-ui/core'

const message = ref('Waiting for action.')

function archive() {
  message.value = 'Component archived.'
}`
const code = `<YPopconfirm
  title="Archive component?"
  description="Archived components can be restored later."
  @confirm="archive"
>
  <template #trigger>
    <YButton variant="secondary">Archive</YButton>
  </template>
</YPopconfirm>`
</script>

# Popconfirm

Popconfirm 是轻量确认弹层，适合删除、归档、重置等低成本但需要二次确认的操作。

::: tip TIP
`YPopconfirm` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Confirm an action {#popconfirm-confirm-an-action}

<DocDemo
  title="Confirm an action"
  description="比 Modal 更轻，保留用户当前上下文。"
  :code="code"
  :setup="setup"
  :usage="['trigger slot', 'confirm', 'cancel']"
>
  <div class="demo-stack">
    <YPopconfirm
      title="Archive component?"
      description="Archived components can be restored later."
      @confirm="message = 'Component archived.'"
      @cancel="message = 'Archive canceled.'"
    >
      <template #trigger>
        <YButton variant="secondary">Archive</YButton>
      </template>
    </YPopconfirm>
    <p class="demo-note">{{ message }}</p>
  </div>
</DocDemo>

## Usage notes {#popconfirm-usage-notes}

- Popconfirm 适合低成本二次确认；涉及长表单、复杂说明或不可逆高风险流程时应使用 `YModal`。
- 危险操作标题必须写清对象和后果，说明文本补充是否可恢复。
- 取消按钮文案应明确保留当前上下文，例如“继续编辑”或“保留草稿”。
- 移动端确认文案保持短句，避免按钮组和说明文本挤压。
- 触发元素可放在默认插槽中；需要更明确语义时使用 `#trigger` 命名插槽。

## Popconfirm API {#popconfirm-api}

<ComponentApiSection name="YPopconfirm" />

## Accessibility {#accessibility}

- 弹层使用 `role="dialog"` 和标题作为可访问名称。
- 触发元素由业务传入，建议使用原生 button 或 Yok Button。
- 确认和取消动作都是原生 button，支持键盘触发。
- 键盘用户应能通过 Tab 在取消和确认动作之间移动，并用 Enter 激活当前聚焦动作。
