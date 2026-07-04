# Icons

`@yok-ui/icons` 提供统一的 SVG 图标组件和路径注册表。组件内部应优先使用该包，避免每个组件重复维护图标 SVG。

## Install

```bash
pnpm add @yok-ui/icons
```

## Built-in icon

```vue
<script setup lang="ts">
import { YokIcon } from '@yok-ui/icons'
</script>

<template>
  <YokIcon name="check" title="已完成" />
</template>
```

## Custom icon

```ts
import { createYokIcon } from '@yok-ui/icons'

export const RocketIcon = createYokIcon('RocketIcon', [
  'M12 2l4 8-4 12-4-12 4-8z'
])
```

## Accessibility

当传入 `title` 时，图标会以 `role="img"` 暴露给辅助技术；无标题图标默认视为装饰性图形并设置 `aria-hidden="true"`。
