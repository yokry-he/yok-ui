# @yok-ui/product

Productivity and developer-experience components for Yok UI.

## Install

```bash
pnpm add @yok-ui/product @yok-ui/core @yok-ui/themes
```

## Full import

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import YokProduct from '@yok-ui/product'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/product/style.css'
import App from './App.vue'

createApp(App).use(YokCore).use(YokProduct).mount('#app')
```

## On-demand import

```ts
import { YCodeBlock, YCommandPalette, YCopyButton, YThemeSwitcher } from '@yok-ui/product'
```

Product components depend on Core tokens and base interaction styles, so import a theme and Core styles once in your app entry.
