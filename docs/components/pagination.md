<script setup lang="ts">
import { ref } from 'vue'

const page = ref(2)
const setup = [
  "import { ref } from 'vue'",
  "import { YPagination, YTag } from '@yok-ui/core'",
  '',
  'const page = ref(2)'
].join('\n')
const code = `<template>
  <YPagination v-model:page="page" :page-size="10" :total="72" />
  <YTag tone="info">Current page: {{ page }}</YTag>
</template>`
</script>

# Pagination

Pagination 用于长列表翻页，是表格、资源列表和后台页面的基础导航组件。

::: tip TIP
`YPagination` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Paged list {#pagination-paged-list}

<DocDemo
  title="Paged list"
  description="和 Table、DataTable、List 组合时保持页码状态由业务层控制。"
  :code="code"
  :setup="setup"
  :usage="['v-model:page', 'page-size', 'total']"
>
  <div class="demo-stack">
    <YPagination v-model:page="page" :page-size="10" :total="72" />
    <YTag tone="info">Current page: {{ page }}</YTag>
  </div>
</DocDemo>

## Usage notes {#pagination-usage-notes}

- 参考 Element Plus 的分页文档，Pagination 不只是页码按钮，还要覆盖少量页、大量页、完整列表控制和禁用态。
- 业务层应持有当前页状态；组件只负责页码导航和 `update:page` / `change` 事件。
- 远程表格或列表刷新时使用 `disabled`，避免用户在请求未完成时连续翻页。
- 搜索结果只有一页时使用 `hide-on-single-page`，让空结果、少量结果页更安静。
- 移动端优先减少 `sibling-count`，让上一页、当前页和下一页按钮保持可点。
- 使用 `aria-label` 区分页面上的多个分页器，例如表格分页、审核队列分页或搜索结果分页。

## Pagination API {#pagination-api}

<ComponentApiSection name="YPagination" />

## Accessibility {#accessibility}

- 分页区域应有清晰的导航语义，页码按钮保留原生 button 行为。
- 当前页需要通过视觉状态和 `aria-current` 同时表达。
- 与表格或列表组合时，页码变化后的结果数量应由列表区域补充状态说明。
