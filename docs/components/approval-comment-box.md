<script setup lang="ts">
import { ref } from 'vue'
import type {
  YApprovalAttachment,
  YApprovalCommentSubmitPayload,
  YApprovalDecision,
  YApprovalSuggestion,
  YReviewWorkflowStep
} from '@yok-ui/admin'

const comment = ref('Please add keyboard notes before release.')
const decision = ref<YApprovalDecision>('requestChanges')
const selectedSuggestions = ref(['keyboard'])
const message = ref('Waiting for review comment.')

const suggestions: YApprovalSuggestion[] = [
  { label: '补充键盘说明', value: 'keyboard' },
  { label: '补充 API 表', value: 'api' },
  { label: '需要视觉复核', value: 'visual', tone: 'warning' }
]

const attachments: YApprovalAttachment[] = [
  { name: 'audit-notes.md', url: '/audit-notes.md', size: '12 KB' }
]

const workflowSteps: YReviewWorkflowStep[] = [
  { title: 'Submitted', value: 'submitted', status: 'Done', tone: 'success', time: '09:12' },
  { title: 'Reviewing', value: 'reviewing', status: 'Active', tone: 'warning', actor: 'Yok' },
  { title: 'Ready', value: 'ready', status: 'Next' }
]

function handleSubmit(payload: YApprovalCommentSubmitPayload) {
  message.value = `${payload.decision}: ${payload.comment}`
}

const approvalSetup = [
  "import { ref } from 'vue'",
  "import { YApprovalCommentBox, YReviewWorkflow, type YApprovalAttachment, type YApprovalCommentSubmitPayload, type YApprovalDecision, type YApprovalSuggestion, type YReviewWorkflowStep } from '@yok-ui/admin'",
  '',
  "const comment = ref('Please add keyboard notes before release.')",
  "const decision = ref<YApprovalDecision>('requestChanges')",
  "const selectedSuggestions = ref(['keyboard'])",
  "const message = ref('Waiting for review comment.')",
  '',
  'const suggestions: YApprovalSuggestion[] = [',
  "  { label: '补充键盘说明', value: 'keyboard' },",
  "  { label: '补充 API 表', value: 'api' },",
  "  { label: '需要视觉复核', value: 'visual', tone: 'warning' }",
  ']',
  '',
  'const attachments: YApprovalAttachment[] = [',
  "  { name: 'audit-notes.md', url: '/audit-notes.md', size: '12 KB' }",
  ']',
  '',
  'const workflowSteps: YReviewWorkflowStep[] = [',
  "  { title: 'Submitted', value: 'submitted', status: 'Done', tone: 'success', time: '09:12' },",
  "  { title: 'Reviewing', value: 'reviewing', status: 'Active', tone: 'warning', actor: 'Yok' },",
  "  { title: 'Ready', value: 'ready', status: 'Next' }",
  ']',
  '',
  'function handleSubmit(payload: YApprovalCommentSubmitPayload) {',
  "  message.value = `${payload.decision}: ${payload.comment}`",
  '}'
].join('\n')

const basicCode = [
  '<YApprovalCommentBox',
  '  v-model="comment"',
  '  v-model:decision="decision"',
  '  v-model:selected-suggestions="selectedSuggestions"',
  '  title="Release review"',
  '  description="Submit a decision with reusable suggestions and audit attachments."',
  '  reviewer="Yok"',
  '  target="YDataTable"',
  '  :suggestions="suggestions"',
  '  :attachments="attachments"',
  '  @submit="handleSubmit"',
  '/>',
  '<p class="demo-note">{{ message }}</p>'
].join('\n')

const workflowCode = [
  '<YReviewWorkflow',
  '  title="Component review"',
  '  active-value="reviewing"',
  '  :items="workflowSteps"',
  '>',
  '  <template #actions>',
  '    <YApprovalCommentBox',
  '      v-model="comment"',
  '      v-model:decision="decision"',
  '      v-model:selected-suggestions="selectedSuggestions"',
  '      :suggestions="suggestions"',
  '      submit-text="Send decision"',
  '      @submit="handleSubmit"',
  '    />',
  '  </template>',
  '</YReviewWorkflow>'
].join('\n')
</script>

# Approval Comment Box

Approval Comment Box 用于审核、审批、发布前复核等场景。它参考主流组件库中 Comment、Form、Textarea 与流程组件的组合方式，把“评论内容、审批结论、建议标签、附件和提交载荷”封装为可复用的 Admin 组件。

组件不直接提交接口，也不改变 `YReviewWorkflow` 的流程状态。业务层应在 `submit` 事件中调用接口、更新流程节点或写入审计日志。

::: tip TIP
`YApprovalCommentBox` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Review decision {#approval-comment-box-review-decision}

<DocDemo
  title="Review decision"
  description="审批评论会返回 decision、comment、selectedSuggestions、attachments、reviewer 和 target，便于业务层写入审计记录。"
  :code="basicCode"
  :setup="approvalSetup"
  :usage="['approval comment', 'decision', 'suggestions', 'attachments']"
>
  <YApprovalCommentBox
    v-model="comment"
    v-model:decision="decision"
    v-model:selected-suggestions="selectedSuggestions"
    title="Release review"
    description="Submit a decision with reusable suggestions and audit attachments."
    reviewer="Yok"
    target="YDataTable"
    :suggestions="suggestions"
    :attachments="attachments"
    @submit="handleSubmit"
  />
  <p class="demo-note">{{ message }}</p>
</DocDemo>

## With Review Workflow {#approval-comment-box-with-review-workflow}

<DocDemo
  title="Workflow comment"
  description="放入 Review Workflow 的 actions 插槽后，审批评论可以替代简单按钮，形成更完整的审核闭环。"
  :code="workflowCode"
  :setup="approvalSetup"
  :usage="['review workflow', 'slot composition', 'audit comment']"
>
  <YReviewWorkflow
    title="Component review"
    active-value="reviewing"
    :items="workflowSteps"
  >
    <template #actions>
      <YApprovalCommentBox
        v-model="comment"
        v-model:decision="decision"
        v-model:selected-suggestions="selectedSuggestions"
        :suggestions="suggestions"
        submit-text="Send decision"
        @submit="handleSubmit"
      />
    </template>
  </YReviewWorkflow>
</DocDemo>

## Approval Comment Box API {#approval-comment-box-api}

<ComponentApiSection name="YApprovalCommentBox" />

## Accessibility {#accessibility}

- 结论选项使用原生 `button` 和 `aria-pressed` 表达当前选择。
- 评论输入复用 `YTextarea`，校验失败时通过 error 文案和 `aria-invalid` 暴露状态。
- 建议标签使用原生 `button`，支持键盘访问和 disabled 状态。
- 提交中使用 `aria-busy` 标记容器状态，并阻止重复提交。
