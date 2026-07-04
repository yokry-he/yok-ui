# @yok-ui/brand

Brand, portfolio and landing-page components for Yok UI.

## Install

```bash
pnpm add @yok-ui/brand @yok-ui/core @yok-ui/themes
```

## Full import

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import YokBrand from '@yok-ui/brand'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/brand/style.css'
import App from './App.vue'

createApp(App).use(YokCore).use(YokBrand).mount('#app')
```

## On-demand import

```ts
import { YBrandHero, YFeatureGrid, YLogoCloud, YProfileCard } from '@yok-ui/brand'
```

Brand components keep Yok UI's light, friendly tone while allowing stronger hero, portfolio and product-site composition.
