<script setup lang="ts">
const brandHeroSetup = [
  "import { YBrandHero } from '@yok-ui/brand'"
].join('\n')

const basicCode = [
  '<YBrandHero',
  '  eyebrow="Yok UI"',
  '  title="Fresh cute Vue components"',
  '  description="A multi-package component system with a light, friendly voice."',
  '  primary-text="Get started"',
  '  secondary-text="Browse docs"',
  '/>'
].join('\n')
</script>

# Brand Hero

Brand Hero 用于个人主页、作品集或产品官网首屏，承载品牌名、主张、说明和主要操作。

::: tip TIP
`YBrandHero` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Product hero {#brand-hero-product-hero}

<DocDemo
  title="Product hero"
  description="品牌首屏应直接展示品牌名、主张和两个清晰动作，适合个人主页和轻量产品站。"
  :code="basicCode"
  :setup="brandHeroSetup"
  :usage="['brand package', 'hero', 'primary action']"
>
  <YBrandHero
    eyebrow="Yok UI"
    title="Fresh cute Vue components"
    description="A multi-package component system with a light, friendly voice."
    primary-text="Get started"
    secondary-text="Browse docs"
  />
</DocDemo>

## Brand Hero API {#brand-hero-api}

<ComponentApiSection name="YBrandHero" />

## Accessibility {#accessibility}

- `title` 通常应作为页面首屏主标题，页面中不要再重复另一个同级主标题。
- 主要和次要动作使用真实 button 语义，并通过事件交给业务层处理跳转。
- 自定义 `actions` 插槽应保持清晰的可访问名称和可见焦点。
