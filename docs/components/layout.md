---
title: Layout
description: 页面级 flex 骨架，组织 Header、Aside、Main 和 Footer，适合官网、文档和后台壳层。
---

# Layout

Layout 用于搭建页面的基础骨架。它参考 Element Plus Container 的 `Container / Header / Aside / Main / Footer` 组合方式：外层负责 flex 方向和尺寸，内容交互仍交给 Menu、Table、Form 等组件。

## Example

### Page Shell

```vue
<script setup lang="ts">
import { YFooter, YHeader, YLayout, YMain } from '@yok-ui/core'
</script>

<template>
  <YLayout full-height aria-label="Documentation page shell">
    <YHeader height="56px" bordered>Yok UI</YHeader>
    <YMain>
      Documentation content
    </YMain>
    <YFooter bordered>Released under MIT.</YFooter>
  </YLayout>
</template>
```

### Admin Shell

```vue
<script setup lang="ts">
import { YAside, YHeader, YLayout, YMain, YMenu } from '@yok-ui/core'

const menuItems = [
  { label: 'Dashboard', value: 'dashboard', icon: 'D' },
  { label: 'Components', value: 'components', icon: 'C' },
  { label: 'Resources', value: 'resources', icon: 'R' }
]
</script>

<template>
  <YLayout full-height aria-label="Admin shell">
    <YHeader sticky bordered>Yok UI Workspace</YHeader>
    <YLayout direction="horizontal">
      <YAside width="232px" bordered aria-label="Primary navigation">
        <YMenu :items="menuItems" model-value="components" />
      </YAside>
      <YMain scrollable>
        Workspace
      </YMain>
    </YLayout>
  </YLayout>
</template>
```

### Collapsed Aside

```vue
<script setup lang="ts">
import { YAside, YLayout, YMain } from '@yok-ui/core'
</script>

<template>
  <YLayout direction="horizontal" aria-label="Collapsed shell">
    <YAside width="232px" collapsed-width="72px" collapsed bordered>
      Nav
    </YAside>
    <YMain>Content</YMain>
  </YLayout>
</template>
```

## Live example

<LiveExampleRunner preset="layout" />

## Usage Notes

- `YLayout` 的 `direction="auto"` 会在直接子元素包含 `YHeader` 或 `YFooter` 时使用纵向布局，否则使用横向布局。
- `YAside` 只负责侧栏尺寸与区域语义；真实导航建议组合 `YMenu`，移动端建议放入抽屉或紧凑导航。
- `YMain` 是页面主体区域，默认带内边距；工作台、表格页或嵌套滚动场景可设置 `scrollable` 或 `:padded="false"`。
- `sticky` 顶栏适合文档、后台和长页面工具栏；使用时应确认内容区域不会被遮挡。

## Accessibility

- `YLayout` 使用 `role="group"` 和 `ariaLabel` 描述页面骨架区域。
- `YHeader`、`YAside`、`YMain`、`YFooter` 使用原生语义标签，不额外创建键盘陷阱。
- 焦点顺序由 DOM 顺序决定；布局组件不改变子组件的 Tab 行为。
- `YAside` 应提供能描述导航或补充信息的 `ariaLabel`。

## API

<ComponentApiSection name="YLayout" />
