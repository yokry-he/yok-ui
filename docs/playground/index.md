# Playground

Playground 是 Yok UI 的演练入口。它把“看组件 API”和“组合出页面”之间的距离缩短：先从组件总览进入单组件，再从 Blocks 进入组合场景，最后回到包结构理解依赖边界。

## Interaction model

<div class="docs-panel">
  <p class="docs-eyebrow">route-driven playground</p>
  <h2>先用文档站完成路线选择，再进入组件页和区块页细看实现</h2>
  <p>
    当前阶段的 Playground 已经支持组件族筛选、组件选择、主题切换、props 调整、实时预览、TypeScript / JavaScript / 安装命令视图切换和当前视图复制。
    基础按钮、输入、数字输入、选择器、滑块、评分、单选/复选、开关、日期、时间、级联、颜色、Table、List、Statistic、Descriptions、Tabs、Steps、Collapse、头像和反馈组件都能从组件文档带着源码跳入工作台。
    从组件示例或 Live runner 打开 Playground 时会同步携带当前主题预设、示例来源、源码语言、场景和导入源码。
    Playground 默认展示轻量的导入来源条，保留返回文档、编辑源码、查看源码、复制代码和恢复生成示例的高频操作；需要复现证据时再展开导入清单复制 manifest。
    分享链接会保留 `theme`、`from`、`language`、`scenario` 和当前编辑后的源码，便于复现组件视觉环境并回到原组件示例。
    每个辅助入口仍然跳到真实页面，而不是页内锚点，保证官网导航逻辑和组件文档一致。
  </p>
</div>

<PlaygroundWorkbench />

## Live runner

<div class="docs-panel">
  <p class="docs-eyebrow">safe live examples</p>
  <h2>用更接近主流组件库文档的方式编辑、运行和检查示例</h2>
  <p>
    Live runner 支持示例模板切换、自动 / 手动运行、当前模板草稿保存、复制当前 SFC、
    仅复制 template、格式化编辑区代码、错误时保留上一次成功预览，并给出 template / SFC
    行号、问题片段和修复建议；同时提供自适应、平板、手机三种预览宽度，
    方便在组件页内快速检查响应式展示。Props panel 和 Scenario matrix 可以复制带 `state`、
    非默认 `theme` 与非默认 `viewport` 的分享链接，让调试后的组件状态在刷新、分享和回归检查时
    恢复到同一份源码、主题与预览宽度。
  </p>
</div>

<LiveExampleRunner />

## Fast routes

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>Theme Lab</h3>
    <p>调主色、表面、圆角和密度，生成可复制 CSS 变量。</p>
    <a href="/resources/theme-lab">Open theme lab</a>
  </section>
  <section class="docs-card">
    <h3>Component overview</h3>
    <p>按组件族、包、状态和可访问性索引查找组件。</p>
    <a href="/components/">Open components</a>
  </section>
  <section class="docs-card">
    <h3>Data page route</h3>
    <p>从 Table、List、Statistic、Descriptions 构建数据页面。</p>
    <div class="component-pills">
      <a href="/components/table">Table</a>
      <a href="/components/list">List</a>
      <a href="/components/statistic">Statistic</a>
      <a href="/components/descriptions">Descriptions</a>
    </div>
  </section>
  <section class="docs-card">
    <h3>Admin route</h3>
    <p>从 PageHeader、SearchForm、DataTable、ReviewWorkflow 进入后台场景。</p>
    <div class="component-pills">
      <a href="/components/page-header">PageHeader</a>
      <a href="/components/search-form">SearchForm</a>
      <a href="/components/data-table">DataTable</a>
      <a href="/components/review-workflow">ReviewWorkflow</a>
    </div>
  </section>
</div>

## Blocks

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>Command Center</h3>
    <p>适合个人工具、开发者控制台和快捷入口。</p>
    <a href="/blocks/command-center">Open command center</a>
  </section>
  <section class="docs-card">
    <h3>Product Settings</h3>
    <p>适合设置页、偏好配置和产品控制面板。</p>
    <a href="/blocks/product-settings">Open product settings</a>
  </section>
</div>

## Scenario lanes

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>表单配置流</h3>
    <p>从输入控件开始，组合校验、提示、弹窗和提交反馈。</p>
    <div class="component-pills">
      <a href="/components/input">Input</a>
      <a href="/components/select">Select</a>
      <a href="/components/form">Form</a>
      <a href="/components/message">Message</a>
    </div>
  </section>
  <section class="docs-card">
    <h3>后台列表流</h3>
    <p>从页面标题进入筛选、表格、分页、批量操作和视图保存。</p>
    <div class="component-pills">
      <a href="/components/page-header">PageHeader</a>
      <a href="/components/search-form">SearchForm</a>
      <a href="/components/data-table">DataTable</a>
      <a href="/components/saved-views">SavedViews</a>
    </div>
  </section>
  <section class="docs-card">
    <h3>品牌展示流</h3>
    <p>从首屏、功能网格、资料卡和 Logo 展示组合个人产品官网。</p>
    <div class="component-pills">
      <a href="/components/brand-hero">BrandHero</a>
      <a href="/components/feature-grid">FeatureGrid</a>
      <a href="/components/profile-card">ProfileCard</a>
      <a href="/components/logo-cloud">LogoCloud</a>
    </div>
  </section>
</div>

## Local app

<div class="docs-panel">
  <p class="docs-eyebrow">workspace app</p>
  <h2>Run the package playground when you need a standalone app shell</h2>
  <p>
    文档站负责组件说明和组合路线；`playground` 工作区负责完整应用壳体验。
    需要单独验证 playground 时可以运行 `pnpm playground:build` 或启动对应 dev 服务。
  </p>
</div>
