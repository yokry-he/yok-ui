<script setup lang="ts">
import { ref } from 'vue'
import type { YReviewWorkflowPayload, YReviewWorkflowStep } from '@yok-ui/admin'

const workflowMessage = ref('Waiting for review decision')

const steps: YReviewWorkflowStep[] = [
  {
    title: 'Submitted',
    value: 'submitted',
    description: 'The component proposal is ready for design system review.',
    time: '09:12',
    actor: 'Yok',
    tone: 'success',
    status: 'Done'
  },
  {
    title: 'Reviewing',
    value: 'reviewing',
    description: 'Accessibility, API shape and visual polish are being checked.',
    time: '10:30',
    actor: 'Design system',
    tone: 'warning',
    status: 'Active'
  },
  {
    title: 'Release',
    value: 'release',
    description: 'Publish docs and package exports after approval.',
    time: 'Next',
    status: 'Pending',
    disabled: true
  }
]

const crudColumns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' }
]

const crudRows = [
  { id: 'search-form', name: 'YSearchForm', status: 'Beta' },
  { id: 'review-workflow', name: 'YReviewWorkflow', status: 'Beta' }
]

function handleDecision(payload: YReviewWorkflowPayload) {
  workflowMessage.value = `${payload.action}: ${payload.activeStep?.title ?? payload.activeValue}`
}

const reviewWorkflowSetup = [
  "import { ref } from 'vue'",
  "import { YButton } from '@yok-ui/core'",
  "import { YCrudLayout, YDataTable, YReviewWorkflow, type YReviewWorkflowPayload, type YReviewWorkflowStep } from '@yok-ui/admin'",
  '',
  "const workflowMessage = ref('Waiting for review decision')",
  '',
  'const steps: YReviewWorkflowStep[] = [',
  '  {',
  "    title: 'Submitted',",
  "    value: 'submitted',",
  "    description: 'The component proposal is ready for design system review.',",
  "    time: '09:12',",
  "    actor: 'Yok',",
  "    tone: 'success',",
  "    status: 'Done'",
  '  },',
  '  {',
  "    title: 'Reviewing',",
  "    value: 'reviewing',",
  "    description: 'Accessibility, API shape and visual polish are being checked.',",
  "    time: '10:30',",
  "    actor: 'Design system',",
  "    tone: 'warning',",
  "    status: 'Active'",
  '  },',
  '  {',
  "    title: 'Release',",
  "    value: 'release',",
  "    description: 'Publish docs and package exports after approval.',",
  "    time: 'Next',",
  "    status: 'Pending',",
  '    disabled: true',
  '  }',
  ']',
  '',
  'const crudColumns = [',
  "  { key: 'name', label: 'Name' },",
  "  { key: 'status', label: 'Status' }",
  ']',
  '',
  'const crudRows = [',
  "  { id: 'search-form', name: 'YSearchForm', status: 'Beta' },",
  "  { id: 'review-workflow', name: 'YReviewWorkflow', status: 'Beta' }",
  ']',
  '',
  'function handleDecision(payload: YReviewWorkflowPayload) {',
  '  workflowMessage.value = `${payload.action}: ${payload.activeStep?.title ?? payload.activeValue}`',
  '}'
].join('\n')

const basicCode = [
  '<YReviewWorkflow',
  '  title="Component review"',
  '  description="Review API, accessibility and release readiness before publishing."',
  '  active-value="reviewing"',
  '  reviewer="Reviewer: Design system"',
  '  due-text="Due today"',
  '  :items="steps"',
  '  @action="handleDecision"',
  '/>',
  '<p class="demo-note">{{ workflowMessage }}</p>'
].join('\n')

const asideCode = [
  '<YCrudLayout',
  '  title="Release queue"',
  '  eyebrow="Admin"',
  '  description="Use workflow context next to the resource table."',
  '>',
  '  <template #table>',
  '    <YDataTable title="Components" :columns="crudColumns" :data="crudRows" />',
  '  </template>',
  '  <template #aside>',
  '    <YReviewWorkflow',
  '      active-value="reviewing"',
  '      reviewer="Reviewer: Yok"',
  '      due-text="Today"',
  '      :items="steps"',
  '      @action="handleDecision"',
  '    >',
  '      <template #stepActions="{ item }">',
  '        <YButton v-if="item.value === \'reviewing\'" size="sm" variant="ghost">Open</YButton>',
  '      </template>',
  '    </YReviewWorkflow>',
  '  </template>',
  '</YCrudLayout>'
].join('\n')
</script>

# Review Workflow

Review Workflow 用于审核、发布、驳回和要求修改等后台流程。它吸收主流组件库中 Steps / Timeline 的流程表达方式，但更偏向业务后台：顶部展示当前状态和负责人，中间呈现流程，底部提供决策操作。

组件不直接改变流程数据，而是通过 `approve`、`requestChanges`、`reject` 和统一的 `action` 事件把决策交给业务层处理。

## Basic

<DocDemo
  title="Review decision flow"
  description="审核流程把当前步骤、负责人、截止时间和决策动作放在同一上下文。"
  :code="basicCode"
  :setup="reviewWorkflowSetup"
  :usage="['workflow status', 'decision events', 'timeline semantics']"
>
  <YReviewWorkflow
    title="Component review"
    description="Review API, accessibility and release readiness before publishing."
    active-value="reviewing"
    reviewer="Reviewer: Design system"
    due-text="Due today"
    :items="steps"
    @action="handleDecision"
  />
  <p class="demo-note">{{ workflowMessage }}</p>
</DocDemo>

## In CRUD Aside

<DocDemo
  title="CRUD aside workflow"
  description="复杂后台页可把流程上下文放在 CRUD aside，主表格负责资源扫描，侧栏负责决策。"
  :code="asideCode"
  :setup="reviewWorkflowSetup"
  :usage="['crud aside', 'step actions slot', 'admin workflow']"
>
  <YCrudLayout
    title="Release queue"
    eyebrow="Admin"
    description="Use workflow context next to the resource table."
  >
    <template #table>
      <YDataTable
        title="Components"
        :columns="crudColumns"
        :data="crudRows"
      />
    </template>
    <template #aside>
      <YReviewWorkflow
        active-value="reviewing"
        reviewer="Reviewer: Yok"
        due-text="Today"
        :items="steps"
        @action="handleDecision"
      >
        <template #stepActions="{ item }">
          <YButton v-if="item.value === 'reviewing'" size="sm" variant="ghost">Open</YButton>
        </template>
      </YReviewWorkflow>
    </template>
  </YCrudLayout>
</DocDemo>

## Live example

<LiveExampleRunner preset="reviewWorkflow" />

## API

<ComponentApiSection name="YReviewWorkflow" />

## Accessibility

- 外层使用具名 `section`，并在 loading 时同步 `aria-busy`。
- 流程步骤继承 `YStatusTimeline` 的 `ol` / `li` 结构和 `aria-current="step"`。
- 内置决策操作使用原生按钮语义，禁用和提交中状态会阻止重复触发。
- 自定义 `actions` 插槽时，应保留键盘可达的决策控件。
