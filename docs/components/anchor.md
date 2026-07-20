---
title: Anchor
description: 为长文档、设置页和滚动容器提供页内锚点导航。
---

<script setup lang="ts">
const anchorItems = [
  { title: 'Usage', href: '#anchor-demo-usage' },
  {
    title: 'API',
    href: '#anchor-demo-api',
    children: [
      { title: 'Props', href: '#anchor-demo-props' },
      { title: 'Events', href: '#anchor-demo-events', disabled: true }
    ]
  },
  { title: 'Accessibility', href: '#anchor-demo-accessibility' }
]

const containerItems = [
  { title: 'Release', href: '#anchor-demo-release' },
  { title: 'Checklist', href: '#anchor-demo-checklist' },
  { title: 'Evidence', href: '#anchor-demo-evidence' }
]

const anchorSetup = [
  "import { YAnchor } from '@yok-ui/core'",
  '',
  'const anchorItems = [',
  "  { title: 'Usage', href: '#anchor-demo-usage' },",
  '  {',
  "    title: 'API',",
  "    href: '#anchor-demo-api',",
  '    children: [',
  "      { title: 'Props', href: '#anchor-demo-props' },",
  "      { title: 'Events', href: '#anchor-demo-events', disabled: true }",
  '    ]',
  '  },',
  "  { title: 'Accessibility', href: '#anchor-demo-accessibility' }",
  ']',
  '',
  'const containerItems = [',
  "  { title: 'Release', href: '#anchor-demo-release' },",
  "  { title: 'Checklist', href: '#anchor-demo-checklist' },",
  "  { title: 'Evidence', href: '#anchor-demo-evidence' }",
  ']'
].join('\n')

const basicCode = [
  '<YAnchor',
  '  :items="anchorItems"',
  '  model-value="#anchor-demo-api"',
  '  aria-label="Component sections"',
  '/>'
].join('\n')

const horizontalCode = [
  '<YAnchor',
  '  :items="anchorItems"',
  '  direction="horizontal"',
  '  type="underline"',
  '  model-value="#anchor-demo-usage"',
  '  aria-label="Page sections"',
  '/>'
].join('\n')

const scrollContainerCode = [
  '<section class="anchor-demo-scroll-panel">',
  '  <YAnchor',
  '    :items="containerItems"',
  '    container=".anchor-demo-scroll-panel"',
  '    :offset="64"',
  '    :bound="15"',
  '    aria-label="Container sections"',
  '  />',
  '  <div class="anchor-demo-scroll-content">',
  '    <section id="anchor-demo-release">Release</section>',
  '    <section id="anchor-demo-checklist">Checklist</section>',
  '    <section id="anchor-demo-evidence">Evidence</section>',
  '  </div>',
  '</section>'
].join('\n')
</script>

# Anchor

Anchor 用于长页面内的章节导航、文档目录、配置页分段定位和局部滚动容器导航。它参考 Element Plus Anchor 的操作模型，保留基础锚点、横向模式、目标滚动容器、`change` / `click` 事件和 `scrollTo` 方法，同时让可访问性状态、禁用项和嵌套目录在 Yok UI 的文档体系里保持一致。

::: tip TIP
`YAnchor` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic navigation {#anchor-basic-navigation}

<DocDemo
  title="Basic navigation"
  description="竖向目录适合文档右侧栏、设置页分段和长表单导航；当前项通过 modelValue 受控。"
  :code="basicCode"
  :setup="anchorSetup"
  :usage="['nested items', 'modelValue', 'aria-current']"
>
  <YAnchor
    :items="anchorItems"
    model-value="#anchor-demo-api"
    aria-label="Component sections"
  />
</DocDemo>

## Horizontal sections {#anchor-horizontal-sections}

<DocDemo
  title="Horizontal sections"
  description="横向模式适合页面顶部的同级章节切换，只渲染一级链接以保持高度稳定。"
  :code="horizontalCode"
  :setup="anchorSetup"
  :usage="['direction=horizontal', 'type=underline', 'top sections']"
>
  <YAnchor
    :items="anchorItems"
    direction="horizontal"
    type="underline"
    model-value="#anchor-demo-usage"
    aria-label="Page sections"
  />
</DocDemo>

## Scroll container {#anchor-scroll-container}

<DocDemo
  title="Scroll container"
  description="局部滚动容器适合发布面板、设置抽屉和内容区域内的分段定位。"
  :code="scrollContainerCode"
  :setup="anchorSetup"
  :usage="['container selector', 'offset', 'bound']"
>
  <section class="anchor-demo-scroll-panel">
    <YAnchor
      :items="containerItems"
      container=".anchor-demo-scroll-panel"
      :offset="64"
      :bound="15"
      aria-label="Container sections"
    />
    <div class="anchor-demo-scroll-content">
      <section id="anchor-demo-release">Release notes</section>
      <section id="anchor-demo-checklist">Checklist</section>
      <section id="anchor-demo-evidence">Evidence</section>
    </div>
  </section>
</DocDemo>

## Usage Notes {#anchor-usage-notes}

- 竖向模式适合右侧目录、设置页目录和文档目录，并支持 `children` 子链接。
- 横向模式适合页面顶部的同级章节切换；为避免高度不可控，横向模式只渲染一级链接。
- `container` 应指向真实滚动容器；目标元素不存在时会回退到 `window`。
- `offset` 用于避开固定顶栏，`bound` 用于控制滚动激活判断的提前量。

## Anchor API {#anchor-api}

<ComponentApiSection name="YAnchor" />

<style scoped>
.anchor-demo-scroll-panel {
  display: grid;
  max-height: 260px;
  grid-template-columns: minmax(128px, 0.34fr) minmax(0, 1fr);
  gap: var(--yok-space-4);
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  padding: var(--yok-space-4);
}

.anchor-demo-scroll-content {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
}

.anchor-demo-scroll-content section {
  min-height: 120px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-bg-soft);
  color: var(--yok-color-text);
  font-weight: 750;
  padding: var(--yok-space-4);
}

@media (max-width: 720px) {
  .anchor-demo-scroll-panel {
    grid-template-columns: 1fr;
  }
}
</style>

## Accessibility {#accessibility}

- 根节点使用原生 `nav`，并通过 `ariaLabel` 标注目录用途。
- 当前激活链接会设置 `aria-current="location"`。
- 禁用项渲染为不可聚焦文本，不会进入 Tab 顺序。
- 组件不接管焦点移动；键盘用户仍通过原生 Tab 和 Enter 访问链接。
