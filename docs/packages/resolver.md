# @yok-ui/resolver

Resolver 包服务自动导入生态。它为 `unplugin-vue-components` 提供 Yok UI 组件解析能力，让业务项目可以在模板中直接使用组件，同时自动注入对应包的样式入口。

## Install

```bash
pnpm add -D unplugin-vue-components @yok-ui/resolver
```

## Vite

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

## Result

```vue
<template>
  <YButton variant="primary">Create</YButton>
  <YDataTable :columns="columns" :data="rows" />
  <YBrandHero title="Yok UI" />
</template>
```

Resolver 会把这些组件分别解析到 `@yok-ui/core`、`@yok-ui/admin` 和 `@yok-ui/brand`，并默认返回对应的 `style.css` side effect。

## Options

```ts
YokUiResolver({
  importStyle: true,
  packages: ['@yok-ui/core', '@yok-ui/admin'],
  exclude: ['YButton']
})
```

<div class="docs-table-wrap">

| Option | Description |
| --- | --- |
| `importStyle` | 默认为 `true`。设为 `false` 时只解析组件，不返回样式 side effect。 |
| `packages` | 限制可解析的 Yok UI 包，适合只启用 Core 或 Admin 的项目。 |
| `exclude` | 指定不自动解析的组件名，交给项目手写 import 或自定义 resolver 处理。 |

</div>
