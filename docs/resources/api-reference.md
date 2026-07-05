# API Reference

Yok UI 的 API 数据中心把组件文档从“手写表格”升级为结构化数据。当前 84 个注册组件都已接入 `componentRegistry` 的 props、events、slots 或 types 数据；组件页、包页、搜索页和后续 Playground 都应复用同一份来源，避免 API 说明漂移。

数据中心支持按关键词、API 类型、包名和 Live evidence 状态组合筛选。筛选条件会同步到 URL，可以直接复制当前筛选链接给维护者，用来定位某个包、某类 props/events 或缺少 Live evidence 的 API 行。

<ApiReferenceExplorer />

## Maintenance rules

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>先写 registry</h3>
    <p>新增组件或 API 变化时，先更新 `componentApis`，再在组件页引用 `ComponentApiSection`。</p>
  </section>
  <section class="docs-card">
    <h3>保留类型出口</h3>
    <p>复杂 payload、配置项和插槽上下文应从包入口导出 TypeScript 类型。</p>
  </section>
  <section class="docs-card">
    <h3>同步示例</h3>
    <p>当 API 行为变化时，同时更新 DocDemo 示例、源码片段和可访问性说明。</p>
  </section>
</div>
