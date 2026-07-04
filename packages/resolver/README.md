# @yok-ui/resolver

Auto-import resolver for Yok UI Vue 3 component packages.

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

The resolver maps `YButton`, `YDataTable`, `YBrandHero` and every documented Yok UI component to the correct package root. It also returns package-level `style.css` side effects by default.

## Options

```ts
YokUiResolver({
  importStyle: true,
  packages: ['@yok-ui/core', '@yok-ui/admin'],
  exclude: ['YButton']
})
```

- `importStyle`: set to `false` if your app imports Yok UI styles manually.
- `packages`: limit auto imports to selected Yok UI packages.
- `exclude`: keep specific component names unresolved.
