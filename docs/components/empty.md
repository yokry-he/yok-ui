<script setup lang="ts">
const emptySetup = "import { YButton, YEmpty } from '@yok-ui/core'"

const createCode = [
  '<YEmpty title="No components yet" description="Start by creating your first Yok UI component.">',
  '  <template #action>',
  '    <YButton variant="primary">Create component</YButton>',
  '  </template>',
  '</YEmpty>'
].join('\n')

const searchCode = [
  '<YEmpty title="No results" description="Try another keyword or clear current filters.">',
  '  <template #action>',
  '    <YButton variant="secondary">Clear filters</YButton>',
  '  </template>',
  '</YEmpty>'
].join('\n')
</script>

# Empty

Empty 用于空列表、未创建资源和路线图占位。Yok UI 的空状态保持友好，但必须提供下一步动作。

::: tip TIP
`YEmpty` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## First creation {#empty-first-creation}

<DocDemo
  title="First creation"
  description="首次创建空态要说明价值并提供明确下一步，不只展示“暂无数据”。"
  :code="createCode"
  :setup="emptySetup"
  :usage="['title', 'description', 'action']"
>
  <YEmpty title="No components yet" description="Start by creating your first Yok UI component.">
    <template #action>
      <YButton variant="primary">Create component</YButton>
    </template>
  </YEmpty>
</DocDemo>

## Search empty {#empty-search-empty}

<DocDemo
  title="Search empty"
  description="搜索无结果时优先提供清除筛选或调整关键词的入口。"
  :code="searchCode"
  :setup="emptySetup"
  :usage="['empty result', 'secondary action', 'filters']"
>
  <YEmpty title="No results" description="Try another keyword or clear current filters.">
    <template #action>
      <YButton variant="secondary">Clear filters</YButton>
    </template>
  </YEmpty>
</DocDemo>

## Usage notes {#empty-usage-notes}

- Empty 必须说明为什么没有内容，并给出下一步；不要只展示图形或一句 “暂无数据”。
- 首次创建空态应强调价值和创建入口；搜索无结果应优先提供清除筛选或修改关键词。
- 权限空态应解释访问限制，并提供申请权限、联系管理员或返回入口。
- 移动端空态保持短标题和单一主操作，避免把整页变成大面积空白。
- 操作区可使用默认插槽；需要更明确结构时使用 `#action`。

## Empty API {#empty-api}

<ComponentApiSection name="YEmpty" />

## Accessibility {#accessibility}

- 空状态标题和说明应明确解释当前为什么没有内容。
- `action` 插槽中的下一步操作应使用真实按钮或链接语义。
- 空状态不应只展示装饰图形，必须提供可读文本。
- 键盘用户应能按 Tab 到达空态中的主操作。
