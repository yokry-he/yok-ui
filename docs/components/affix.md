---
title: Affix
description: 将工具栏、页内导航或提交操作固定在滚动容器边缘。
---

# Affix

Affix 用于长文档、配置页、审批页和局部滚动容器中的固定操作区。它参考 Element Plus Affix 的核心操作模型，保留 `offset`、`target`、`position`、`zIndex`、`change` 和 `scroll`，但实现上优先使用浏览器原生 `position: sticky`，减少滚动过程中的布局计算。

## Example

### Top Toolbar

```vue
<script setup lang="ts">
import { YAffix, YButton, YTag } from '@yok-ui/core'
</script>

<template>
  <YAffix :offset="24" aria-label="Sticky release toolbar">
    <div class="demo-row">
      <YButton variant="primary" size="sm">Publish docs</YButton>
      <YTag tone="info">Top sticky toolbar</YTag>
    </div>
  </YAffix>
</template>
```

### Bottom Action Bar

```vue
<template>
  <YAffix position="bottom" :offset="16" :z-index="120" aria-label="Sticky submit bar">
    <YButton variant="primary" size="sm">Submit review</YButton>
  </YAffix>
</template>
```

### Target Container

```vue
<template>
  <section class="release-scroll-panel">
    <YAffix target=".release-scroll-panel" :offset="12" aria-label="Container toolbar">
      <YButton variant="secondary" size="sm">Sync section</YButton>
    </YAffix>
  </section>
</template>
```

## Live example

<LiveExampleRunner
  preset="affix"
  title="在线编辑 Affix 示例"
  description="调试顶部/底部固定、目标容器、禁用态、移动端操作条和键盘顺序。"
/>

## Usage Notes

- 顶部工具栏适合文档目录、筛选条件、批量操作和发布按钮。
- 底部操作条适合移动端提交区和长表单确认区，但要避免遮挡主要内容。
- `target` 应指向真实滚动容器；目标元素不存在时会回退到 `window`。
- `YAffix` 不负责创建抽屉、弹层或导航菜单，复杂交互应组合 `YDrawer`、`YMenu`、`YTabs` 或业务组件。

## Accessibility

- 根节点使用 `role="region"` 和 `ariaLabel` 描述固定区域。
- 组件不创建额外焦点陷阱，也不会改变插槽内按钮、链接和输入控件的 Tab 顺序。
- 固定区域可能覆盖内容；业务页面需要为主要内容预留足够间距，尤其是底部操作条。
- `change` 和 `scroll` 事件只反馈状态，不应在滚动时强制移动焦点。

## API

<ComponentApiSection name="YAffix" />
