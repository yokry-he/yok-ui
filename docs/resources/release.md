# Release Center

Release Center 用于把“组件已经成熟”转换成可执行发布动作。它参考主流组件库常见的 release checklist、changelog、package version 和稳定状态治理方式，但保持 Yok UI 的轻量节奏：候选组件必须先通过 release readiness，再进入版本包、发布命令、changelog 草稿、dry-run 产物和 Stable 提升队列。

<ReleaseDashboard />

## Release policy

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>证据先于状态</h3>
    <p>组件不能只因为页面存在就标为 Stable。必须同时具备结构化 API、Live Example 证据、源码复现、Playground 编辑后分享、主题 token、可访问性说明和成熟度页通过项。</p>
  </section>
  <section class="docs-card">
    <h3>包级发布</h3>
    <p>Core、Product、Admin 和 Brand 分包发布，changelog 按 package 聚合，避免一个组件变更污染整个组件库的版本判断。</p>
  </section>
  <section class="docs-card">
    <h3>发布前验收</h3>
    <p>每次发布前必须先执行 <code>pnpm release:dry-run</code>，再跑 typecheck、test、package build、docs build 和 runtime a11y audit。命令清单在页面中直接生成，方便复制到 PR 或发布记录。</p>
  </section>
</div>
