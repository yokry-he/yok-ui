<script setup lang="ts">
import type { YListItem } from '@yok-ui/core'

const tasks: YListItem[] = [
  {
    key: 'docs',
    title: 'Documentation',
    description: 'Write examples, API tables and accessibility notes.',
    meta: 'Core'
  },
  {
    key: 'tests',
    title: 'Test coverage',
    description: 'Cover default rendering, empty states and slot contracts.',
    meta: 'Quality'
  },
  {
    key: 'release',
    title: 'Release notes',
    description: 'Summarize component behavior for the next package changelog.',
    meta: 'DX'
  }
]

const listSetup = [
  "import { YButton, YList, YTag, type YListItem } from '@yok-ui/core'",
  '',
  'const tasks: YListItem[] = [',
  '  {',
  "    key: 'docs',",
  "    title: 'Documentation',",
  "    description: 'Write examples, API tables and accessibility notes.',",
  "    meta: 'Core'",
  '  },',
  '  {',
  "    key: 'tests',",
  "    title: 'Test coverage',",
  "    description: 'Cover default rendering, empty states and slot contracts.',",
  "    meta: 'Quality'",
  '  },',
  '  {',
  "    key: 'release',",
  "    title: 'Release notes',",
  "    description: 'Summarize component behavior for the next package changelog.',",
  "    meta: 'DX'",
  '  }',
  ']'
].join('\n')

const basicCode = [
  '<YList',
  '  title="Release checklist"',
  '  description="Small tasks before a component is ready."',
  '  :items="tasks"',
  '/>'
].join('\n')

const actionsCode = [
  '<YList',
  '  bordered',
  '  title="Review queue"',
  '  description="Actionable rows for compact product and admin surfaces."',
  '  :items="tasks"',
  '>',
  '  <template #extra>',
  '    <YButton size="sm" variant="primary">New task</YButton>',
  '  </template>',
  '  <template #actions="{ item }">',
  '    <YButton size="sm" variant="ghost">Open {{ item.key }}</YButton>',
  '  </template>',
  '  <template #footer>',
  '    3 items in this queue.',
  '  </template>',
  '</YList>'
].join('\n')

const gridCode = [
  '<YList',
  '  layout="vertical"',
  '  :columns="3"',
  '  title="Component tracks"',
  '  description="Use grid lists for compact resource cards."',
  '  :items="tasks"',
  '>',
  '  <template #meta="{ item }">',
  '    <YTag tone="info">{{ item.meta }}</YTag>',
  '  </template>',
  '</YList>'
].join('\n')

const stateCode = [
  '<div class="list-state-grid">',
  '  <YList title="Loading list" loading :items="tasks" />',
  '  <YList title="Empty list" :items="[]" empty-text="No tasks yet">',
  '    <template #empty>',
  '      Everything is clear.',
  '    </template>',
  '  </YList>',
  '</div>'
].join('\n')
</script>

# List

List 用于展示消息、资源、任务、文章、设置项或轻量内容集合。它参考 Ant Design 的 List 模式，保留 header、footer、size、bordered、split、item layout、grid、loading、empty 等常用能力，但在 Yok UI 中保持更轻的 Core 定位：分页、虚拟滚动和远程数据由 `YPagination`、`YVirtualList` 或业务层组合完成。

::: tip TIP
`YList` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic list {#list-basic-list}

<DocDemo
  title="Basic list"
  description="基础列表适合任务、消息和资源摘要，保留原生 ul/li 语义。"
  :code="basicCode"
  :setup="listSetup"
  :usage="['title', 'description', 'ul/li']"
>
  <YList
    title="Release checklist"
    description="Small tasks before a component is ready."
    :items="tasks"
  />
</DocDemo>

## Bordered With Actions {#list-bordered-with-actions}

<DocDemo
  title="Bordered with actions"
  description="带边框列表适合后台和产品面板，操作区应使用真实按钮。"
  :code="actionsCode"
  :setup="listSetup"
  :usage="['bordered', 'extra', 'actions', 'footer']"
>
  <YList
    bordered
    title="Review queue"
    description="Actionable rows for compact product and admin surfaces."
    :items="tasks"
  >
    <template #extra>
      <YButton size="sm" variant="primary">New task</YButton>
    </template>
    <template #actions="{ item }">
      <YButton size="sm" variant="ghost">Open {{ item.key }}</YButton>
    </template>
    <template #footer>
      3 items in this queue.
    </template>
  </YList>
</DocDemo>

## Grid {#list-grid}

<DocDemo
  title="Grid list"
  description="资源网格用 columns 控制列数，移动端应自然回到单列。"
  :code="gridCode"
  :setup="listSetup"
  :usage="['layout=vertical', 'columns', 'meta slot']"
>
  <YList
    layout="vertical"
    :columns="3"
    title="Component tracks"
    description="Use grid lists for compact resource cards."
    :items="tasks"
  >
    <template #meta="{ item }">
      <YTag tone="info">{{ item.meta }}</YTag>
    </template>
  </YList>
</DocDemo>

## Loading And Empty {#list-loading-and-empty}

<DocDemo
  title="Loading and empty"
  description="远程刷新用 loading，筛选无结果用 empty，不渲染空的列表结构。"
  :code="stateCode"
  :setup="listSetup"
  :usage="['loading', 'empty', 'role=status']"
>
  <div class="list-state-grid">
    <YList title="Loading list" loading :items="tasks" />
    <YList title="Empty list" :items="[]" empty-text="No tasks yet">
      <template #empty>
      Everything is clear.
    </template>
  </YList>
  </div>
</DocDemo>

## Usage notes {#list-usage-notes}

- 参考 Ant Design List 的组织方式，List 应覆盖基础列表、纵向详情、栅格资源、加载、空态和分页组合等场景。
- Yok UI 的 `YList` 保持轻量 Core 定位；分页用 `YPagination` 组合，海量数据用 `YVirtualList` 组合。
- 常规任务和消息列表使用 `layout="horizontal"`；文章摘要、资源卡片和移动端优先使用 `layout="vertical"`。
- 资源网格用 `columns` 控制列数，但移动端应回到单列，避免标题、描述和操作按钮被挤压。
- 远程刷新时使用 `loading`；搜索或筛选没有结果时使用空状态，而不是渲染空的 `ul`。
- 列表项被禁用时应保留文本可读，并通过 `aria-disabled` 表达状态；操作区仍应使用真实按钮。

## List API {#list-api}

<ComponentApiSection name="YList" />

## Accessibility {#accessibility}

- 外层使用具名 `section`，默认可访问名称来自 `ariaLabel` 或 `title`。
- 列表内容使用原生 `ul` / `li` 表达条目集合。
- `loading` 和空状态使用 `role="status"`，让状态变化可被辅助技术理解。
- 自定义 `item` 插槽时，应保留可读文本；如果包含操作，请继续使用原生 `button` 或 Yok UI 的按钮组件。

<style scoped>
.list-state-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 760px) {
  .list-state-grid {
    grid-template-columns: 1fr;
  }
}
</style>
