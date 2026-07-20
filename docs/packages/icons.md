# Icons

`@yok-ui/icons` 是 Yok UI 的 SVG 图标资产包。它提供两种使用方式：直接导入具体图标组件，或通过 `YokIcon name` 从注册表渲染。

## Why SVG

Yok UI 默认采用 SVG 图标，而不是字体图标。

- SVG 可以按需打包，直接组件导入时更利于 tree-shaking。
- SVG 默认跟随 `currentColor`，能自然接入主题 token。
- SVG 不依赖字体文件加载，不会出现字体未加载时的空白或错位。
- SVG 可以直接挂载 `title`、`role`、`aria-hidden`，可访问性更明确。

## Install

```bash
pnpm add @yok-ui/icons
```

## Direct import

每个内置图标都提供直接命名导出，命名规则是 `Y` + PascalCase 图标名 + `Icon`。例如 `moreHorizontal` 对应 `YMoreHorizontalIcon`。

```vue
<script setup lang="ts">
import { YMoreHorizontalIcon, YSearchIcon, YSettingsIcon } from '@yok-ui/icons'
</script>

<template>
  <YSearchIcon title="搜索" />
  <YSettingsIcon title="设置" />
  <YMoreHorizontalIcon title="更多操作" />
</template>
```

## Registry import

```vue
<script setup lang="ts">
import { YokIcon } from '@yok-ui/icons'
</script>

<template>
  <YokIcon name="calendar" title="选择日期" />
</template>
```

## Searchable metadata

`getYokIconEntries` 和 `searchYokIcons` 适合构建图标选择器、设计资产面板和内部低代码配置面板。搜索会覆盖图标名、直接导出名、分类和 tags。

```ts
import { getYokIconEntries, searchYokIcons } from '@yok-ui/icons'

const allIcons = getYokIconEntries()
const documentIcons = searchYokIcons('document', 'file')
const businessIcons = searchYokIcons('', 'business')
```

## With Core Icon

`@yok-ui/core` 的 `YIcon` 负责尺寸、颜色、旋转和可访问语义；`@yok-ui/icons` 负责实际 SVG 图形。

```vue
<script setup lang="ts">
import { YIcon } from '@yok-ui/core'
import { YLoadingIcon } from '@yok-ui/icons'
</script>

<template>
  <YIcon size="lg" color="#147a65" label="加载中" spinning>
    <YLoadingIcon />
  </YIcon>
</template>
```

## Gallery

点击图标卡片可以复制对应的直接导入语句。图库当前覆盖系统动作、沟通、箭头、表单、反馈、数据、文件、媒体、布局、商业、电商和品牌场景。

<IconGallery />

## Custom icon

```ts
import { createYokIcon } from '@yok-ui/icons'

export const RocketIcon = createYokIcon('rocket', [
  'M12 2l4 8-4 12-4-12 4-8z'
], {
  strokeWidth: 1.75
})
```

## Accessibility

当传入 `title` 时，图标会以 `role="img"` 暴露给辅助技术；无标题图标默认视为装饰性图形并设置 `aria-hidden="true"`。
