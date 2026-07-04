---
title: Anchor
description: 为长文档、设置页和滚动容器提供页内锚点导航。
---

# Anchor

Anchor 用于长页面内的章节导航、文档目录、配置页分段定位和局部滚动容器导航。它参考 Element Plus Anchor 的操作模型，保留基础锚点、横向模式、目标滚动容器、`change` / `click` 事件和 `scrollTo` 方法，同时让可访问性状态、禁用项和嵌套目录在 Yok UI 的文档体系里保持一致。

## Example

### Basic

```vue
<script setup lang="ts">
import { YAnchor } from '@yok-ui/core'

const anchorItems = [
  { title: 'Usage', href: '#usage' },
  {
    title: 'API',
    href: '#api',
    children: [
      { title: 'Props', href: '#props' },
      { title: 'Events', href: '#events' }
    ]
  },
  { title: 'Accessibility', href: '#accessibility' }
]
</script>

<template>
  <YAnchor :items="anchorItems" model-value="#api" aria-label="Component sections" />
</template>
```

### Horizontal

```vue
<template>
  <YAnchor
    :items="anchorItems"
    direction="horizontal"
    type="underline"
    model-value="#usage"
    aria-label="Page sections"
  />
</template>
```

### Scroll Container

```vue
<template>
  <section class="release-scroll-panel">
    <YAnchor
      :items="anchorItems"
      container=".release-scroll-panel"
      :offset="64"
      :bound="15"
      aria-label="Container sections"
    />
  </section>
</template>
```

## Live example

<LiveExampleRunner
  preset="anchor"
  title="在线编辑 Anchor 示例"
  description="调试基础锚点、横向导航、滚动容器、禁用项、移动端排列和键盘顺序。"
/>

## Usage Notes

- 竖向模式适合右侧目录、设置页目录和文档目录，并支持 `children` 子链接。
- 横向模式适合页面顶部的同级章节切换；为避免高度不可控，横向模式只渲染一级链接。
- `container` 应指向真实滚动容器；目标元素不存在时会回退到 `window`。
- `offset` 用于避开固定顶栏，`bound` 用于控制滚动激活判断的提前量。

## Accessibility

- 根节点使用原生 `nav`，并通过 `ariaLabel` 标注目录用途。
- 当前激活链接会设置 `aria-current="location"`。
- 禁用项渲染为不可聚焦文本，不会进入 Tab 顺序。
- 组件不接管焦点移动；键盘用户仍通过原生 Tab 和 Enter 访问链接。

## API

<ComponentApiSection name="YAnchor" />
