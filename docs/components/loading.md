<script setup lang="ts">
const loadingSetup = [
  "import { YLoading } from '@yok-ui/core'"
].join('\n')

const basicCode = [
  '<YLoading loading text="Refreshing component list" overlay>',
  '  <div class="loading-demo-panel">',
  '    <strong>Component release queue</strong>',
  '    <span>Button, Table, Loading are syncing documentation evidence.</span>',
  '  </div>',
  '</YLoading>'
].join('\n')
</script>

# Loading

Loading 用于表达容器、页面片段或全屏流程正在处理中。Yok UI 的 Loading 参考 Element Plus 的容器遮罩和服务式 Loading 思路，也参考 Ant Design / Naive UI 的 Spin 类组件用法；当前先提供稳定的组件化版本，后续可以在同一语义上扩展 directive 或 service。

::: tip TIP
`YLoading` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Container overlay {#loading-container-overlay}

<DocDemo
  title="Container overlay"
  description="容器遮罩保留原内容结构，并通过 aria-busy 和 status 文案说明正在刷新什么。"
  :code="basicCode"
  :setup="loadingSetup"
  :usage="['container overlay', 'aria-busy', 'status text']"
>
  <YLoading loading text="Refreshing component list" overlay>
    <div class="loading-demo-panel">
      <strong>Component release queue</strong>
      <span>Button、Table、Loading 正在同步文档证据。</span>
    </div>
  </YLoading>
</DocDemo>

## Usage notes {#loading-usage-notes}

- `overlay` 适合表格、卡片、详情区域刷新，内容仍然保留在 DOM 中，并通过 `aria-busy` 表达忙碌状态。
- `fullscreen` 适合首屏初始化、发布任务、路由切换等阻断流程；不要用它替代普通按钮 loading。
- 很短的请求不要立刻显示 Loading，业务层可以增加短延迟，避免闪烁。
- Loading 表示“正在处理”；如果需要表达具体完成百分比，使用 Progress；如果需要占位最终布局，使用 Skeleton。
- 文案应说明正在处理什么，而不是只写“Loading...”。例如 “Refreshing table” 比 “Loading” 更有帮助。

## Patterns {#loading-patterns}

| Pattern | Recommendation |
| --- | --- |
| Inline | 用于按钮旁或局部状态提示，默认 `role="status"` |
| Container overlay | 设置 `overlay` 并包裹内容，适合局部刷新 |
| Fullscreen | 设置 `fullscreen`，适合初始化和阻断流程 |
| Retry state | 用 `tone="warning"` 或 `tone="danger"` 表达重试和失败前状态 |
| Custom indicator | 通过 `indicator` 插槽替换默认 spinner |
| Accessibility | 提供清晰 `text` 或 `label`，避免读屏只听到泛泛的 Loading |

## Loading API {#loading-api}

<ComponentApiSection name="YLoading" />

## Accessibility {#accessibility}

- 内联模式使用 `role="status"` 和 `aria-live="polite"`，适合非阻断状态。
- 遮罩和全屏模式会对根节点标记 `aria-busy`，同时在遮罩内提供 status 区域。
- 包裹内容不会被移除，避免加载完成后焦点上下文完全丢失。
- 动画遵循 `prefers-reduced-motion`，减少对动作敏感用户的影响。

<style scoped>
.loading-demo-panel {
  display: grid;
  gap: 10px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  padding: 18px;
}

.loading-demo-panel span {
  color: var(--yok-color-textMuted);
}
</style>
