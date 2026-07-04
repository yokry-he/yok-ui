# Installation

Yok UI 使用分包安装。最小组合是 themes + core，需要具体场景时再加 product、admin 或 brand。和主流 Vue 组件库一样，Yok UI 同时支持全量注册、分包注册和按需导入。

```bash
pnpm add @yok-ui/core @yok-ui/themes
```

## Compatibility

Yok UI 面向 Vue 3.4+ 和现代浏览器。浏览器基线为 Chrome 85+、Edge 85+、Firefox 79+、Safari 14.1+，不支持 IE。完整运行时、SSR、构建工具、CSS 变量和自动导入边界见 [Support Matrix](/resources/support)。

## Package presets

```bash
# personal product
pnpm add @yok-ui/core @yok-ui/product @yok-ui/themes

# admin console
pnpm add @yok-ui/core @yok-ui/admin @yok-ui/themes

# brand website
pnpm add @yok-ui/core @yok-ui/brand @yok-ui/themes

# full system
pnpm add @yok-ui/core @yok-ui/product @yok-ui/admin @yok-ui/brand @yok-ui/themes
```

## Styles

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/themes/yok-clean.css'
import '@yok-ui/themes/yok-candy.css'
import '@yok-ui/core/style.css'
import '@yok-ui/product/style.css'
import '@yok-ui/admin/style.css'
import '@yok-ui/brand/style.css'
```

主题包只提供 token CSS。`@yok-ui/core/style.css` 提供 Core 组件样式、基础工具和 focus ring。Product、Admin、Brand 包各自提供 `style.css`，只需要在使用对应包时导入一次。

## Full import

适合原型、文档站、内部后台和希望快速启动的项目。

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import App from './App.vue'

createApp(App).use(YokCore).mount('#app')
```

## Package plugins

按业务场景组合分包时，先安装 Core，再安装场景包。Product、Admin 和 Brand 包不会替你重复注册 Core 组件，这样可以保持包边界清晰，也方便未来做按包裁剪。

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import YokProduct from '@yok-ui/product'
import YokAdmin from '@yok-ui/admin'
import YokBrand from '@yok-ui/brand'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/product/style.css'
import '@yok-ui/admin/style.css'
import '@yok-ui/brand/style.css'
import App from './App.vue'

createApp(App)
  .use(YokCore)
  .use(YokProduct)
  .use(YokAdmin)
  .use(YokBrand)
  .mount('#app')
```

每个包也提供命名插件导出，适合需要更明确命名的应用入口：

```ts
import { YokCore } from '@yok-ui/core'
import { YokAdmin } from '@yok-ui/admin'
```

## On-demand import

适合正式产品页面和组件级示例。只导入实际使用的组件，交给构建工具做 Tree Shaking。

```vue
<script setup lang="ts">
import { YButton, YInput, YThemeProvider } from '@yok-ui/core'
</script>

<template>
  <YThemeProvider theme="yok-candy">
    <YInput label="Project name" />
    <YButton variant="primary">Create</YButton>
  </YThemeProvider>
</template>
```

## Auto import

适合中大型项目。Yok UI 提供 `@yok-ui/resolver`，可以接入 `unplugin-vue-components`，让模板中的 `YButton`、`YDataTable`、`YBrandHero` 自动解析到正确分包，并默认带上对应 `style.css`。

```bash
pnpm add -D unplugin-vue-components @yok-ui/resolver
```

```ts
import Components from 'unplugin-vue-components/vite'
import { YokUiResolver } from '@yok-ui/resolver'

export default {
  plugins: [
    Components({
      resolvers: [YokUiResolver()]
    })
  ]
}
```

如果你的应用入口已经手动导入了所有 Yok UI 样式，可以关闭 resolver 的样式 side effect：

```ts
YokUiResolver({ importStyle: false })
```

## Scene packages

```vue
<script setup lang="ts">
import { YPageHeader, YMetricCard } from '@yok-ui/admin'
import { YBrandHero, YFeatureGrid } from '@yok-ui/brand'
</script>
```

## Export contract

Yok UI 的包入口经过测试约束：文档 registry 登记的组件必须能从对应包根入口导入，每个 `src/components/*/index.ts` 也必须被包根入口导出。新增组件时如果忘记补 `src/index.ts`，`pnpm test` 会直接失败。

## Package choices

| Need | Install |
| --- | --- |
| 基础按钮、表单、标签、主题 | `@yok-ui/core @yok-ui/themes` |
| 命令面板、复制按钮、代码展示 | `@yok-ui/product` |
| 后台管理组件 | `@yok-ui/admin` |
| 官网/作品集组件 | `@yok-ui/brand` |
