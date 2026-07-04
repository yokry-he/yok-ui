<script setup lang="ts">
import { ref } from 'vue'
import type { YStepItem } from '@yok-ui/core'

const selectedStep = ref('Draft')
const publishItems: YStepItem[] = [
  { title: 'Create project', description: 'Choose a package type.' },
  { title: 'Configure theme', description: 'Pick tokens and tone.' },
  { title: 'Publish docs', description: 'Review component examples.' }
]
const workflowItems: YStepItem[] = [
  { title: 'Build packages', description: 'Run tests and bundle output.' },
  { title: 'Review docs', description: 'Check examples and API tables.' },
  { title: 'Publish release', description: 'Tag version and generate notes.' }
]
const errorItems: YStepItem[] = [
  { title: 'Install' },
  { title: 'Typecheck', status: 'error', description: 'Fix the blocking TypeScript issue.' },
  { title: 'Build docs' }
]
const selectableItems: YStepItem[] = [
  { title: 'Draft' },
  { title: 'Review' },
  { title: 'Publish', disabled: true }
]

const stepsSetup = [
  "import { ref } from 'vue'",
  "import { YSteps, type YStepItem } from '@yok-ui/core'",
  '',
  "const selectedStep = ref('Draft')",
  'const publishItems: YStepItem[] = [',
  "  { title: 'Create project', description: 'Choose a package type.' },",
  "  { title: 'Configure theme', description: 'Pick tokens and tone.' },",
  "  { title: 'Publish docs', description: 'Review component examples.' }",
  ']',
  'const workflowItems: YStepItem[] = [',
  "  { title: 'Build packages', description: 'Run tests and bundle output.' },",
  "  { title: 'Review docs', description: 'Check examples and API tables.' },",
  "  { title: 'Publish release', description: 'Tag version and generate notes.' }",
  ']',
  'const errorItems: YStepItem[] = [',
  "  { title: 'Install' },",
  "  { title: 'Typecheck', status: 'error', description: 'Fix the blocking TypeScript issue.' },",
  "  { title: 'Build docs' }",
  ']',
  'const selectableItems: YStepItem[] = [',
  "  { title: 'Draft' },",
  "  { title: 'Review' },",
  "  { title: 'Publish', disabled: true }",
  ']'
].join('\n')

const horizontalCode = '<YSteps :current="1" :items="publishItems" />'

const verticalCode = [
  '<YSteps',
  '  direction="vertical"',
  '  aria-label="Release workflow"',
  '  :current="2"',
  '  :items="workflowItems"',
  '/>'
].join('\n')

const errorCode = '<YSteps :current="1" :items="errorItems" />'

const selectableCode = [
  '<YSteps',
  '  selectable',
  '  :current="0"',
  '  :items="selectableItems"',
  '  @select="(item) => { selectedStep = item.title }"',
  '/>',
  '<p class="demo-note">Selected step: {{ selectedStep }}</p>'
].join('\n')
</script>

# Steps

Steps 用于展示发布向导、配置流程、订单流转和多阶段任务。它强调当前步骤和已完成步骤，比普通进度条更适合有明确阶段名称的流程。

## Example

<DocDemo
  title="Horizontal steps"
  description="横向步骤适合发布向导和配置流程，当前步骤通过 aria-current 表达。"
  :code="horizontalCode"
  :setup="stepsSetup"
  :usage="['current', 'items', 'aria-current']"
>
  <YSteps :current="1" :items="publishItems" />
</DocDemo>

## Live example

<LiveExampleRunner
  preset="steps"
  title="在线编辑 Steps 示例"
  description="验证横向、纵向和当前步骤状态，适合发布向导、配置流程和任务流转。"
/>

## Vertical

<DocDemo
  title="Vertical workflow"
  description="纵向步骤适合空间较窄或描述较长的工作流。"
  :code="verticalCode"
  :setup="stepsSetup"
  :usage="['vertical', 'aria-label', 'workflow']"
>
  <YSteps
    direction="vertical"
    aria-label="Release workflow"
    :current="2"
    :items="workflowItems"
  />
</DocDemo>

## Error state

<DocDemo
  title="Error state"
  description="步骤失败时应在当前节点写清楚阻塞原因，而不是只依赖颜色。"
  :code="errorCode"
  :setup="stepsSetup"
  :usage="['status=error', 'description', 'blocking']"
>
  <YSteps :current="1" :items="errorItems" />
</DocDemo>

## Selectable

<DocDemo
  title="Selectable steps"
  description="开启 selectable 后每个步骤使用按钮语义，禁用步骤不会触发 select。"
  :code="selectableCode"
  :setup="stepsSetup"
  :usage="['selectable', 'select event', 'disabled']"
>
  <YSteps
    selectable
    :current="0"
    :items="selectableItems"
    @select="(item) => { selectedStep = item.title }"
  />
  <p class="demo-note">Selected step: {{ selectedStep }}</p>
</DocDemo>

## Accessibility

Steps 使用 `nav` 和有序列表表达流程顺序，默认 `aria-label` 为 `Steps`。当前步骤会得到 `aria-current="step"`。开启 `selectable` 时，每个步骤会渲染为按钮；禁用步骤使用原生 `disabled`，不会触发 `select`。

## API

<ComponentApiSection name="YSteps" />
