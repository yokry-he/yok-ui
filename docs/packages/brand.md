<script setup lang="ts">
const brandPreviewSetup = [
  "import { YBrandHero, YLogoCloud } from '@yok-ui/brand'",
  '',
  "const logos = ['Core', 'Product', 'Admin', 'Brand']"
].join('\n')

const brandPreviewCode = [
  '<div class="brand-preview-stack">',
  '  <YBrandHero',
  '    eyebrow="Yok UI"',
  '    title="Fresh cute Vue components"',
  '    description="A multi-package component system for products, admin screens and brand pages."',
  '    primary-text="Get started"',
  '    secondary-text="Browse components"',
  '  />',
  '  <YLogoCloud title="Built for personal products" :logos="logos" />',
  '</div>'
].join('\n')
</script>

# @yok-ui/brand

Brand 包服务个人主页、作品集、产品官网和模板站。它继承 Yok UI 的轻盈和亲和感，但允许更强的视觉表达。

## Install

```bash
pnpm add @yok-ui/brand @yok-ui/core @yok-ui/themes
```

## Import

完整引入：

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

按需导入：

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/brand/style.css'
import { YBrandHero, YFeatureGrid, YProfileCard } from '@yok-ui/brand'
```

## Components

<PackageComponents package-name="@yok-ui/brand" />

## Preview

<DocDemo
  title="Brand landing section"
  description="品牌包示例展示更强视觉表达的首屏组合，同时保持和 Core、Product、Admin 同源的设计语言。"
  :code="brandPreviewCode"
  :setup="brandPreviewSetup"
  :usage="['landing hero', 'logo cloud', 'brand package']"
>
  <div class="brand-preview-stack">
    <YBrandHero
      eyebrow="Yok UI"
      title="Fresh cute Vue components"
      description="A multi-package component system for products, admin screens and brand pages."
      primary-text="Get started"
      secondary-text="Browse components"
    />
    <YLogoCloud title="Built for personal products" :logos="['Core', 'Product', 'Admin', 'Brand']" />
  </div>
</DocDemo>

<style scoped>
.brand-preview-stack {
  display: grid;
  gap: 16px;
}
</style>
