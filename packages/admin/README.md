# @yok-ui/admin

Admin workflow and data-operation components for Yok UI.

## Install

```bash
pnpm add @yok-ui/admin @yok-ui/core @yok-ui/themes
```

## Full import

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import YokAdmin from '@yok-ui/admin'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/admin/style.css'
import App from './App.vue'

createApp(App).use(YokCore).use(YokAdmin).mount('#app')
```

## On-demand import

```ts
import { YCrudLayout, YDataTable, YMetricCard, YSearchForm } from '@yok-ui/admin'
```

Admin components compose Core primitives for data-heavy pages, filters, saved views, approval comments, review workflows and bulk operations.
