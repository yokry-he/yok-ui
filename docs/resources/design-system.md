# Design System

Yok UI 的设计系统目标不是做厚重的企业蓝，而是把“清爽可爱”沉淀成稳定、可维护、可扩展的工程语言。

## Token layers

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>Color</h3>
    <p>语义色先服务信息层级：primary、success、warning、danger 只在有明确语义时使用。</p>
  </section>
  <section class="docs-card">
    <h3>Shape</h3>
    <p>默认圆角保持亲和但不胶囊化，业务卡片和工具控件保持稳定尺寸。</p>
  </section>
  <section class="docs-card">
    <h3>Motion</h3>
    <p>动效只用于状态确认、展开收起和轻量反馈，并尊重 reduced motion。</p>
  </section>
  <section class="docs-card">
    <h3>Density</h3>
    <p>文档和品牌页可以舒展，后台与表格场景保持紧凑、可扫描。</p>
  </section>
</div>

## Component quality bar

<div class="docs-table-wrap">
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Requirement</th>
        <th>Evidence</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Usage</td>
        <td>至少一个 DocDemo 示例，并说明适用场景。</td>
        <td>组件页 Examples 区域。</td>
      </tr>
      <tr>
        <td>API</td>
        <td>Props、Events、Slots、Types 进入结构化 registry。</td>
        <td>API Reference 与 ComponentApiSection。</td>
      </tr>
      <tr>
        <td>A11y</td>
        <td>说明键盘、焦点、语义和错误状态。</td>
        <td>组件页 Accessibility 区域。</td>
      </tr>
      <tr>
        <td>Theme</td>
        <td>只使用 Yok token 或组件 props，不污染内部 DOM。</td>
        <td>源码与主题文档。</td>
      </tr>
    </tbody>
  </table>
</div>
