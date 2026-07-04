# Resources

Resources 汇总 Yok UI 的包结构、质量文档、主题资产和演进计划。这里放“如何理解和维护组件库”的材料，避免把组件使用文档和工程资源混在一起。

## Documentation map

<div class="docs-panel">
  <p class="docs-eyebrow">docs architecture</p>
  <h2>像主流组件库一样分层，但保持 yok-ui 的轻量节奏</h2>
  <p>
    顶部导航负责真实路由切换：指南沉淀设计原则，组件承载 API 和示例，
    资源聚合包结构与质量材料，Playground 串联真实组合路径。左侧菜单只展示当前分区相关条目，
    避免用户在组件页看到安装、包说明和区块入口混杂在一起。
  </p>
  <div class="component-pills">
    <a href="/guide/">Guide route</a>
    <a href="/components/">Component route</a>
    <a href="/resources/">Resource route</a>
    <a href="/playground/">Playground route</a>
    <a href="/resources/api-reference">API data</a>
    <a href="/resources/design-system">Design system</a>
    <a href="/resources/theme-lab">Theme lab</a>
    <a href="/resources/maturity">Maturity</a>
    <a href="/resources/release">Release center</a>
    <a href="/resources/changelog">Changelog</a>
  </div>
</div>

## Package map

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>Core</h3>
    <p>基础组件、主题容器、数据展示和反馈组件。</p>
    <a href="/packages/core">Open Core</a>
  </section>
  <section class="docs-card">
    <h3>Product</h3>
    <p>命令面板、复制按钮、代码块和主题切换等产品效率组件。</p>
    <a href="/packages/product">Open Product</a>
  </section>
  <section class="docs-card">
    <h3>Admin</h3>
    <p>后台页面、筛选、表格、批量操作、审核流程和视图管理。</p>
    <a href="/packages/admin">Open Admin</a>
  </section>
  <section class="docs-card">
    <h3>Brand</h3>
    <p>个人主页、品牌首屏、功能网格、资料卡和 Logo 展示。</p>
    <a href="/packages/brand">Open Brand</a>
  </section>
</div>

## Quality resources

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>API Reference</h3>
    <p>结构化 props、events、slots 和 types 数据中心。</p>
    <a href="/resources/api-reference">View API data</a>
  </section>
  <section class="docs-card">
    <h3>Design System</h3>
    <p>清爽可爱的 token 层级、组件质量门槛和维护规则。</p>
    <a href="/resources/design-system">View design rules</a>
  </section>
  <section class="docs-card">
    <h3>Theme Lab</h3>
    <p>调主色、圆角和密度，生成可复制的 Yok UI CSS 变量。</p>
    <a href="/resources/theme-lab">Open theme lab</a>
  </section>
  <section class="docs-card">
    <h3>Maturity</h3>
    <p>追踪组件数量、结构化 API、在线示例和下一批补齐队列。</p>
    <a href="/resources/maturity">View maturity</a>
  </section>
  <section class="docs-card">
    <h3>Support Matrix</h3>
    <p>查看 Vue、浏览器、SSR、构建工具、主题运行时和自动导入的支持边界。</p>
    <a href="/resources/support">View support matrix</a>
  </section>
  <section class="docs-card">
    <h3>Live Examples</h3>
    <p>集中查看每个组件示例的场景覆盖、运行门禁、复现导出和待复核队列。</p>
    <a href="/resources/live-examples">View live matrix</a>
  </section>
  <section class="docs-card">
    <h3>Release Center</h3>
    <p>把发布候选组件组织成 package 计划、Stable 提升队列、changelog 草稿、dry-run 产物和发布命令门禁。</p>
    <a href="/resources/release">View release workflow</a>
  </section>
  <section class="docs-card">
    <h3>Changelog</h3>
    <p>查看版本状态、变更类型、包级记录和每条变更的证据链接。</p>
    <a href="/resources/changelog">View version history</a>
  </section>
  <section class="docs-card">
    <h3>Token Reference</h3>
    <p>颜色、圆角、间距、阴影和动效 token 的完整说明。</p>
    <a href="/guide/token-reference">View tokens</a>
  </section>
  <section class="docs-card">
    <h3>Color Contrast</h3>
    <p>主题 token 的 WCAG AA 对比度检查和新增主题规则。</p>
    <a href="/guide/color-contrast">View contrast</a>
  </section>
  <section class="docs-card">
    <h3>Accessibility</h3>
    <p>组件语义、键盘、焦点和后续改进计划。</p>
    <a href="/guide/accessibility">View accessibility</a>
  </section>
  <section class="docs-card">
    <h3>Roadmap</h3>
    <p>从可用组件库走向稳定版本的阶段计划。</p>
    <a href="/guide/roadmap">View roadmap</a>
  </section>
</div>

## Blocks and examples

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>Command Center</h3>
    <p>命令面板、按钮、代码块和复制动作组成的效率入口。</p>
    <a href="/blocks/command-center">Open block</a>
  </section>
  <section class="docs-card">
    <h3>Product Settings</h3>
    <p>用于产品配置页的组合式表单与设置面板示例。</p>
    <a href="/blocks/product-settings">Open block</a>
  </section>
</div>

## Maintenance checklist

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>新增组件</h3>
    <p>先更新 registry，再补组件页、API 表、可访问性说明和对应包页，确保索引自动同步。</p>
  </section>
  <section class="docs-card">
    <h3>新增主题</h3>
    <p>先补 token，再跑对比度检查，最后在 Theming 与 Token Reference 中记录使用边界。</p>
  </section>
  <section class="docs-card">
    <h3>新增区块</h3>
    <p>先沉淀页面模式，再判断是否需要把复用片段提升成 Product 或 Admin 组件。</p>
  </section>
</div>
