---
title: Carousel
description: 轮播展示区域，支持受控索引、方向键、自动播放、指示器位置和自定义 slide 内容。
---

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(0)
const basicItems = [
  { title: 'Design tokens', description: 'Theme primitives and semantic colors.', meta: 'Core' },
  { title: 'Live examples', description: 'Runnable examples with API evidence.', meta: 'Docs', tone: 'success' },
  { title: 'Accessibility', description: 'Keyboard and screen reader contracts.', meta: 'A11y', tone: 'warning' }
]
const releaseItems = [
  { title: 'Release notes', description: 'Highlight the latest stable components.', meta: 'Stable' },
  { title: 'Source', description: 'Copy the current source into a reproducible example.', meta: 'DX', tone: 'success' }
]
const packageItems = [
  { title: 'Core', description: 'Base Vue 3 components.', meta: 'Stable', tone: 'success' },
  { title: 'Admin', description: 'Workflow components.', meta: 'Beta', tone: 'warning' }
]

const carouselSetup = [
  "import { ref } from 'vue'",
  "import { YCarousel, YTag } from '@yok-ui/core'",
  '',
  'const active = ref(0)',
  'const basicItems = [',
  "  { title: 'Design tokens', description: 'Theme primitives and semantic colors.', meta: 'Core' },",
  "  { title: 'Live examples', description: 'Runnable examples with API evidence.', meta: 'Docs', tone: 'success' },",
  "  { title: 'Accessibility', description: 'Keyboard and screen reader contracts.', meta: 'A11y', tone: 'warning' }",
  ']',
  'const releaseItems = [',
  "  { title: 'Release notes', description: 'Highlight the latest stable components.', meta: 'Stable' },",
  "  { title: 'Source', description: 'Copy the current source into a reproducible example.', meta: 'DX', tone: 'success' }",
  ']',
  'const packageItems = [',
  "  { title: 'Core', description: 'Base Vue 3 components.', meta: 'Stable', tone: 'success' },",
  "  { title: 'Admin', description: 'Workflow components.', meta: 'Beta', tone: 'warning' }",
  ']'
].join('\n')

const basicCode = [
  '<div class="demo-stack">',
  '  <YCarousel',
  '    v-model="active"',
  '    :items="basicItems"',
  '    aria-label="Yok UI maturity carousel"',
  '  />',
  '  <YTag tone="info">Active slide: {{ active + 1 }}</YTag>',
  '</div>'
].join('\n')

const autoplayCode = [
  '<YCarousel',
  '  :items="releaseItems"',
  '  autoplay',
  '  :interval="1800"',
  '  indicator-position="outside"',
  '  aria-label="Release update carousel"',
  '/>'
].join('\n')

const continuousCode = [
  '<YCarousel',
  '  :items="releaseItems"',
  '  autoplay',
  '  :interval="1800"',
  '  :pause-on-hover="false"',
  '  aria-label="Always running announcement carousel"',
  '/>'
].join('\n')

const customItemCode = [
  '<YCarousel :items="packageItems" indicator-position="outside">',
  '  <template #item="{ item, active }">',
  '    <div class="demo-stack">',
  "      <YTag :tone=\"active ? item.tone ?? 'success' : 'info'\">{{ item.meta }}</YTag>",
  '      <h3>{{ item.title }}</h3>',
  '      <p>{{ item.description }}</p>',
  '    </div>',
  '  </template>',
  '</YCarousel>'
].join('\n')
</script>

# Carousel

Carousel 用于在有限空间内展示一组产品亮点、公告、运营内容或文档导览。Yok UI 的实现参考 Element Plus Carousel 的箭头、指示器、自动播放和方向配置，也参考 Ant Design Carousel 的轻量受控使用方式，并补充更明确的键盘与 API Live Example 证据。

::: tip TIP
`YCarousel` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic carousel {#carousel-basic-carousel}

<DocDemo
  id="demo-basic-carousel"
  title="Basic carousel"
  description="受控索引用于把当前 slide 同步到外部状态，适合配置面板、路由查询或埋点。"
  :code="basicCode"
  :setup="carouselSetup"
  :usage="['v-model active index', 'aria-label', 'indicator buttons']"
>
  <div class="demo-stack">
    <YCarousel
      v-model="active"
      :items="basicItems"
      aria-label="Yok UI maturity carousel"
    />
    <YTag tone="info">Active slide: {{ active + 1 }}</YTag>
  </div>
</DocDemo>

## Autoplay {#carousel-autoplay}

<DocDemo
  id="demo-autoplay-carousel"
  title="Autoplay"
  description="自动播放适合公告、发布动态和运营展示；默认 hover 暂停，避免用户阅读时被强制切换。"
  :code="autoplayCode"
  :setup="carouselSetup"
  :usage="['autoplay', 'interval', 'indicatorPosition=outside']"
>
  <YCarousel
    :items="releaseItems"
    autoplay
    :interval="1800"
    indicator-position="outside"
    aria-label="Release update carousel"
  />
</DocDemo>

## Continuous autoplay {#carousel-continuous-autoplay}

<DocDemo
  id="demo-continuous-autoplay"
  title="Continuous autoplay"
  description="公告墙或大屏展示可以关闭 hover 暂停；普通内容轮播仍建议保留 pauseOnHover。"
  :code="continuousCode"
  :setup="carouselSetup"
  :usage="['pauseOnHover=false', 'announcement wall', 'looping display']"
>
  <YCarousel
    :items="releaseItems"
    autoplay
    :interval="1800"
    :pause-on-hover="false"
    aria-label="Always running announcement carousel"
  />
</DocDemo>

## Custom item {#carousel-custom-item}

<DocDemo
  id="demo-custom-item"
  title="Custom item"
  description="item slot 适合展示包状态、产品卡片或图文内容；保持单个 slide 信息量可扫描。"
  :code="customItemCode"
  :setup="carouselSetup"
  :usage="['item slot', 'active slot prop', 'custom slide content']"
>
  <YCarousel :items="packageItems" indicator-position="outside">
    <template #item="{ item, active }">
      <div class="demo-stack">
        <YTag :tone="active ? item.tone ?? 'success' : 'info'">{{ item.meta }}</YTag>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </YCarousel>
</DocDemo>

## Usage Notes {#carousel-usage-notes}

- `modelValue` 表示当前 slide 索引，适合与路由查询、配置面板或外部状态同步。
- `autoplay` 默认会在鼠标悬停时暂停，避免用户阅读内容时继续切换；需要公告墙或屏幕展示时可以设置 `pauseOnHover=false`。
- `indicatorPosition="outside"` 更适合内容密度较高的 slide，避免指示器遮挡正文。
- 长文本轮播应控制数量和内容长度；需要展示完整列表时优先使用 List、Tabs 或独立页面。

## Carousel API {#carousel-api}

<ComponentApiSection name="YCarousel" />

## Accessibility {#accessibility}

- 根节点使用 `role="region"`，通过 `ariaLabel` 提供轮播区域名称。
- 每个 slide 使用 `role="group"` 和 `aria-roledescription="slide"` 标明当前位置。
- 轮播视口可聚焦，水平模式使用左右方向键，垂直模式使用上下方向键。
- 指示器使用 button 和 `aria-current` 表示当前 slide。
