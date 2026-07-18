# Release Center

Release Center 用于把“组件具备真实证据”转换成可执行发布动作。候选组件必须处于 Stable，并同时通过 DocDemo 源码质量和桌面、平板、手机三视口浏览器审计。

<ReleaseVerification />

## Release policy

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>证据先于状态</h3>
    <p>组件不能只因为页面存在就进入发布候选。公开队列只读取可复制 DocDemo 源码和最近一次真实浏览器审计结果。</p>
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
