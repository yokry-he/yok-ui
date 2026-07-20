# Introduction

Yok UI 是一个清爽可爱的 Vue 3 组件系统。它不是单一大包，而是由 `core`、`product`、`admin` 和 `brand` 组成的多场景组件库。

## Design thesis

<div class="docs-split">
  <section class="docs-panel">
    <p class="docs-eyebrow">direction</p>
    <h2>清爽、可爱、轻盈，但不幼稚</h2>
    <p>
      Yok UI 默认服务个人产品、独立工具、后台控制台和个人品牌页面。
      它保留成熟组件库的完整文档与 API 规范，同时把视觉语言做得更轻、更亲和。
    </p>
  </section>
  <section class="docs-panel">
    <p class="docs-eyebrow">phase one</p>
    <h2>先做可工作的内核</h2>
    <p>
      当前已包含 themes、core、product、admin、brand 和文档站。
      每个包都有可运行组件、单组件文档和官网预览。
    </p>
  </section>
</div>

## What Yok UI learns from mainstream libraries

| Library | What Yok UI absorbs |
| --- | --- |
| Element Plus | Guide、Component、Resource 的清晰文档入口 |
| Ant Design Vue | 企业级组件分类、后台场景和规范化 API |
| PrimeVue | 强组件预览、blocks、templates 和 theme 生态意识 |
| Naive UI | Vue 3、TypeScript、主题配置和开发体验 |
| shadcn/vue | 组件可以作为起点被复制、改造、内化 |

## Engineering principles

Yok UI 的实现优先复用成熟基础库，再在上层沉淀自己的视觉语言、API 和文档系统。弹层定位统一基于 `@floating-ui/vue`，Modal / Drawer 等模态层的焦点循环统一基于 `focus-trap`，组件内部只保留 Yok UI 需要控制的状态、主题 token、事件命名和 Vue 插件导出。

这条原则会继续用于后续大改：虚拟滚动优先使用可维护的虚拟化方案，日期和颜色类复杂交互优先抽象为稳定 composable，表单、表格和树等高复杂组件优先建立数据模型和键盘契约，再写视觉层。

## Package strategy

```txt
@yok-ui/themes   design tokens and css variables
@yok-ui/core     base components
@yok-ui/product  personal product components
@yok-ui/admin    admin page composition components
@yok-ui/brand    brand website composition components
```
