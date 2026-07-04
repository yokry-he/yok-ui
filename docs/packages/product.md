<script setup lang="ts">
const productPreviewSetup = [
  "import { YCodeBlock, YCopyButton, YThemeSwitcher } from '@yok-ui/product'",
  '',
  "const installCommand = 'pnpm add @yok-ui/product @yok-ui/core @yok-ui/themes'"
].join('\n')

const productPreviewCode = [
  '<YCodeBlock language="bash" :code="installCommand" />',
  '<div class="product-preview-actions">',
  '  <YCopyButton :text="installCommand" />',
  '  <YThemeSwitcher model-value="yok-light" />',
  '</div>'
].join('\n')
</script>

# @yok-ui/product

Product 包服务个人产品、效率工具、开发者工具和轻量 SaaS 页面。

## Install

```bash
pnpm add @yok-ui/product @yok-ui/core @yok-ui/themes
```

## Import

完整引入：

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

按需导入：

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import '@yok-ui/product/style.css'
import { YCodeBlock, YCommandPalette, YCopyButton, YThemeSwitcher } from '@yok-ui/product'
```

## Components

<PackageComponents package-name="@yok-ui/product" />

## Preview

<DocDemo
  title="Product install helper"
  description="产品包的文档示例直接提供安装命令、复制入口和主题切换预览。"
  :code="productPreviewCode"
  :setup="productPreviewSetup"
  :usage="['install command', 'copy action', 'theme switch']"
>
  <YCodeBlock language="bash" code="pnpm add @yok-ui/product @yok-ui/core @yok-ui/themes" />
  <div class="product-preview-actions">
    <YCopyButton text="pnpm add @yok-ui/product @yok-ui/core @yok-ui/themes" />
    <YThemeSwitcher model-value="yok-light" />
  </div>
</DocDemo>

<style scoped>
.product-preview-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
</style>
