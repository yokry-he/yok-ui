---
layout: home
hero:
  name: Yok UI
  text: Fresh cute Vue 3 components
  tagline: 一个面向个人产品、后台管理和品牌展示的多包组件系统。像主流组件库一样清晰，但默认气质更轻、更亲和。
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: Browse Components
      link: /components/
features:
  - title: Multi-package
    details: Core、Product、Admin、Brand 按场景拆包，逐步覆盖主流组件库的基础能力。
  - title: Theme first
    details: 使用 CSS variables 和 TypeScript token，让清爽可爱的默认主题可以长期扩展。
  - title: Quality layer
    details: 补齐 token reference、accessibility 和 roadmap，让文档像真正的组件库产品。
---

<div class="docs-hero-grid">
  <section class="docs-panel">
    <p class="docs-eyebrow">inspired by mature libraries</p>
    <h2>参考成熟组件库的信息架构，保留自己的视觉性格</h2>
    <p>
      Yok UI 吸收 Element Plus 的 Guide / Component / Resource 结构、PrimeVue 的组件预览和 blocks 生态、
      Ant Design Vue 的场景化组织，以及 Naive UI 的 Vue 3 + TypeScript + theme 体验。
    </p>
    <div class="docs-actions">
      <a href="/guide/installation"><YButton variant="primary" size="lg">Start reading</YButton></a>
      <a href="/guide/roadmap"><YButton variant="secondary" size="lg">View roadmap</YButton></a>
    </div>
  </section>

  <section class="preview-shell" aria-label="Yok UI preview">
    <div class="preview-window">
      <div class="preview-line strong"></div>
      <div class="preview-line"></div>
      <div class="preview-line short"></div>
      <div class="preview-tiles">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="demo-row">
        <YTag tone="success">Core ready</YTag>
        <YTag tone="info">Product ready</YTag>
        <YTag tone="warning">Admin ready</YTag>
        <YTag tone="success">Brand ready</YTag>
        <YBadge value="37" />
      </div>
    </div>
  </section>
</div>

## Quality docs

<div class="docs-card-grid">
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
    <p>记录当前组件的语义、键盘、焦点和后续改进计划。</p>
    <a href="/guide/accessibility">View accessibility</a>
  </section>
  <section class="docs-card">
    <h3>API Conventions</h3>
    <p>统一 Props、Slots、Events 和 Types 表格，让文档持续可维护。</p>
    <a href="/guide/component-api">View API rules</a>
  </section>
  <section class="docs-card">
    <h3>Roadmap</h3>
    <p>从组件覆盖走向稳定版本的阶段计划。</p>
    <a href="/guide/roadmap">View roadmap</a>
  </section>
</div>

## Package map

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>Core</h3>
    <p>基础组件和主题容器，所有场景共享。</p>
    <div class="component-pills">
      <span>YButton</span><span>YInput</span><span>YSelect</span><span>YModal</span>
    </div>
  </section>
  <section class="docs-card">
    <h3>Product</h3>
    <p>个人产品、效率工具和开发者工具组件。</p>
    <div class="component-pills">
      <span>YCommandPalette</span><span>YCopyButton</span>
    </div>
  </section>
  <section class="docs-card">
    <h3>Admin</h3>
    <p>后台管理场景组件进入 Phase 2，可组合出列表页和控制台。</p>
    <div class="component-pills">
      <span>YPageHeader</span><span>YMetricCard</span><span>YSearchPanel</span>
    </div>
  </section>
  <section class="docs-card">
    <h3>Brand</h3>
    <p>品牌展示组件进入 Phase 3，可组合个人主页、作品集和产品官网首屏。</p>
    <div class="component-pills">
      <span>YBrandHero</span><span>YFeatureGrid</span><span>YProfileCard</span>
    </div>
  </section>
</div>
