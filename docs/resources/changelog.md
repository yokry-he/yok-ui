# Changelog

Changelog 用于记录 Yok UI 的版本演进、发布候选、包级变更和证据链接。它参考 Element Plus、Ant Design、Arco Design Vue 等主流组件库的独立变更记录入口，但不会把未验证内容写成已发布事实：当前 `0.2.0` 是 release candidate，真实发布仍需要 Release Center 的 `pnpm release:dry-run` 产物和命令门禁通过后再确认。

<VersionHistory />

## Maintenance rule

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>版本状态要明确</h3>
    <p>候选版本、当前基线、正式发布和 hotfix 应使用不同状态，避免把计划、草稿和已发布版本混在一起。</p>
  </section>
  <section class="docs-card">
    <h3>变更要能追溯</h3>
    <p>每条 changelog 都应该链接到 Release Center、Maturity、API Reference 或包页证据，方便复核来源。</p>
  </section>
  <section class="docs-card">
    <h3>按包组织</h3>
    <p>组件库采用 Core、Product、Admin、Brand 多包路线，版本记录需要保留 package scope，避免长列表失去维护边界。</p>
  </section>
</div>
