# Packages

Yok UI 按使用场景拆成多个包：基础控件留在 Core，组合逻辑沉淀到 Hooks，图标资产进入 Icons，产品效率组件进入 Product，后台业务组件进入 Admin，品牌展示组件进入 Brand。这样的边界能让个人项目、小型 SaaS、后台系统和作品集页面按需引入。

## Package routes

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>@yok-ui/core</h3>
    <p>基础组件、表单控件、数据展示、反馈和主题容器，适合所有项目共享。</p>
    <a href="/packages/core">Open Core</a>
  </section>
  <section class="docs-card">
    <h3>@yok-ui/product</h3>
    <p>面向个人产品和开发者工具的命令面板、代码块、复制动作与主题切换。</p>
    <a href="/packages/product">Open Product</a>
  </section>
  <section class="docs-card">
    <h3>@yok-ui/admin</h3>
    <p>后台管理场景的页面标题、筛选、表格、批量操作、审核流程和视图管理。</p>
    <a href="/packages/admin">Open Admin</a>
  </section>
  <section class="docs-card">
    <h3>@yok-ui/brand</h3>
    <p>品牌官网、个人主页、作品集和营销展示所需的首屏、资料卡与内容模块。</p>
    <a href="/packages/brand">Open Brand</a>
  </section>
  <section class="docs-card">
    <h3>@yok-ui/hooks</h3>
    <p>组件内部可复用的受控状态、命名空间和 DOM 事件组合逻辑。</p>
    <a href="/packages/hooks">Open Hooks</a>
  </section>
  <section class="docs-card">
    <h3>@yok-ui/icons</h3>
    <p>统一的 SVG 图标组件和内置图标路径，避免各组件重复维护图标结构。</p>
    <a href="/packages/icons">Open Icons</a>
  </section>
  <section class="docs-card">
    <h3>@yok-ui/themes</h3>
    <p>设计 token、主题 CSS 和语义化变量，是组件视觉一致性的基础层。</p>
    <a href="/packages/themes">Open Themes</a>
  </section>
  <section class="docs-card">
    <h3>@yok-ui/resolver</h3>
    <p>面向 unplugin-vue-components 的自动导入 resolver，同步解析组件包和 style.css。</p>
    <a href="/packages/resolver">Open Resolver</a>
  </section>
</div>

## Dependency direction

<div class="docs-panel">
  <p class="docs-eyebrow">boundary rule</p>
  <h2>Core 向下沉淀，场景包向上组合</h2>
  <p>
    Themes、Hooks、Icons 是无场景基础层；Product、Admin、Brand 可以依赖 Core 的基础能力；Core 不依赖任何场景包。
    当一个组件既能服务后台也能服务普通产品时，优先沉淀到 Core 或 Product，避免 Admin 变成杂物包。
  </p>
</div>
