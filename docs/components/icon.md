<script setup lang="ts">
import { YCheckIcon, YLoadingIcon, YMoreHorizontalIcon, YSearchIcon, YSettingsIcon } from '@yok-ui/icons'

const setup = `import { YIcon } from '@yok-ui/core'
import { YCheckIcon, YLoadingIcon } from '@yok-ui/icons'`
const code = `<YIcon size="lg" color="#0f766e" label="Stable">
  <YCheckIcon />
</YIcon>

<YIcon size="lg" color="#d97706" spinning label="Loading">
  <YLoadingIcon />
</YIcon>`

const namedSetup = `import { YMoreHorizontalIcon, YSearchIcon, YSettingsIcon } from '@yok-ui/icons'`
const namedCode = `<YSearchIcon title="Search" />
<YSettingsIcon title="Settings" />
<YMoreHorizontalIcon title="More actions" />`
</script>

# Icon

Icon 用于统一 SVG 图标的尺寸、颜色、旋转状态和可访问语义。Yok UI 推荐使用 `@yok-ui/icons` 的 SVG 图标组件，不推荐把字体图标作为默认方案。

::: tip TIP
`YIcon` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## SVG wrapper {#icon-svg-wrapper}

<DocDemo
  title="SVG wrapper"
  description="默认图标尺寸使用 1em，外层负责稳定宽高和颜色继承。"
  :code="code"
  :setup="setup"
  :usage="['svg slot', 'semantic label', 'spinning']"
>
  <div class="demo-row">
    <YIcon size="lg" color="#0f766e" label="Stable">
      <YCheckIcon />
    </YIcon>
    <YIcon size="lg" color="#d97706" spinning label="Loading">
      <YLoadingIcon />
    </YIcon>
  </div>
</DocDemo>

## Named icons {#icon-named-icons}

<DocDemo
  title="Named icons"
  description="@yok-ui/icons 提供常用图标的直接组件导出，适合在业务代码里按需导入。"
  :code="namedCode"
  :setup="namedSetup"
  :usage="['direct import', 'tree-shaking', 'svg']"
>
  <div class="demo-row">
    <YSearchIcon title="Search" />
    <YSettingsIcon title="Settings" />
    <YMoreHorizontalIcon title="More actions" />
  </div>
</DocDemo>

## Icon gallery {#icon-gallery}

点击图标卡片可以复制对应的按需导入语句。图库按系统动作、沟通、箭头、表单、反馈、数据、文件、媒体、布局、商业、电商和品牌场景分组；搜索由 `searchYokIcons` 驱动，可按图标名、导出名、分类和 tags 命中。

<IconGallery />

## Icon API {#icon-api}

<ComponentApiSection name="YIcon" />

## Accessibility {#accessibility}

- 只作为视觉装饰时不要传 `label`，组件会设置 `aria-hidden="true"`。
- 图标本身承载状态或含义时传入 `label`，组件会以具名 `img` 语义暴露。
- 放入按钮时，焦点和操作语义应由按钮承担，图标只作为按钮内容的一部分。
