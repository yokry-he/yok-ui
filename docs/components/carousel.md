---
title: Carousel
description: 轮播展示区域，支持受控索引、方向键、自动播放、指示器位置和自定义 slide 内容。
---

# Carousel

Carousel 用于在有限空间内展示一组产品亮点、公告、运营内容或文档导览。Yok UI 的实现参考 Element Plus Carousel 的箭头、指示器、自动播放和方向配置，也参考 Ant Design Carousel 的轻量受控使用方式，并补充更明确的键盘与 API Live Example 证据。

## Example

### Basic

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { YCarousel } from '@yok-ui/core'

const active = ref(0)
const items = [
  { title: 'Design tokens', description: 'Theme primitives and semantic colors.', meta: 'Core' },
  { title: 'Live examples', description: 'Runnable examples with API evidence.', meta: 'Docs', tone: 'success' },
  { title: 'Accessibility', description: 'Keyboard and screen reader contracts.', meta: 'A11y', tone: 'warning' }
]
</script>

<template>
  <YCarousel v-model="active" :items="items" aria-label="Yok UI maturity carousel" />
</template>
```

### Autoplay

```vue
<script setup lang="ts">
import { YCarousel } from '@yok-ui/core'

const items = [
  { title: 'Release notes', description: 'Highlight the latest stable components.' },
  { title: 'Playground', description: 'Send the current source into a runnable route.' }
]
</script>

<template>
  <YCarousel :items="items" autoplay :interval="1800" indicator-position="outside" />
</template>
```

### Continuous Autoplay

```vue
<template>
  <YCarousel
    :items="items"
    autoplay
    :interval="1800"
    :pause-on-hover="false"
    aria-label="Always running announcement carousel"
  />
</template>
```

### Custom Item

```vue
<script setup lang="ts">
import { YCarousel, YTag } from '@yok-ui/core'

const items = [
  { title: 'Core', description: 'Base Vue 3 components.', meta: 'Stable' },
  { title: 'Admin', description: 'Workflow components.', meta: 'Beta' }
]
</script>

<template>
  <YCarousel :items="items">
    <template #item="{ item, active }">
      <YTag :tone="active ? 'success' : 'info'">{{ item.meta }}</YTag>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </template>
  </YCarousel>
</template>
```

## Live example

<LiveExampleRunner preset="carousel" />

## Usage Notes

- `modelValue` 表示当前 slide 索引，适合与路由查询、配置面板或外部状态同步。
- `autoplay` 默认会在鼠标悬停时暂停，避免用户阅读内容时继续切换；需要公告墙或屏幕展示时可以设置 `pauseOnHover=false`。
- `indicatorPosition="outside"` 更适合内容密度较高的 slide，避免指示器遮挡正文。
- 长文本轮播应控制数量和内容长度；需要展示完整列表时优先使用 List、Tabs 或独立页面。

## Accessibility

- 根节点使用 `role="region"`，通过 `ariaLabel` 提供轮播区域名称。
- 每个 slide 使用 `role="group"` 和 `aria-roledescription="slide"` 标明当前位置。
- 轮播视口可聚焦，水平模式使用左右方向键，垂直模式使用上下方向键。
- 指示器使用 button 和 `aria-current` 表示当前 slide。

## API

<ComponentApiSection name="YCarousel" />
