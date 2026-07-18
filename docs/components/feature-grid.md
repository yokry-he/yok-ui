<script setup lang="ts">
const features = [
  { title: 'Multi-package', description: 'Core, Product, Admin and Brand are split by usage context.', meta: '01' },
  { title: 'Theme first', description: 'CSS variables and typed tokens keep the visual language scalable.', meta: '02' },
  { title: 'Docs as product', description: 'Every package gets examples, API tables and previews.', meta: '03' }
]

const compactFeatures = [
  { title: 'Core', description: 'Stable primitives for every package.', meta: 'C' },
  { title: 'Product', description: 'Documentation and workflow components.', meta: 'P' },
  { title: 'Brand', description: 'Marketing surfaces with Yok personality.', meta: 'B' }
]

const featureGridSetup = [
  "import { YFeatureGrid } from '@yok-ui/brand'",
  '',
  'const features = [',
  "  { title: 'Multi-package', description: 'Core, Product, Admin and Brand are split by usage context.', meta: '01' },",
  "  { title: 'Theme first', description: 'CSS variables and typed tokens keep the visual language scalable.', meta: '02' },",
  "  { title: 'Docs as product', description: 'Every package gets examples, API tables and previews.', meta: '03' }",
  ']',
  '',
  'const compactFeatures = [',
  "  { title: 'Core', description: 'Stable primitives for every package.', meta: 'C' },",
  "  { title: 'Product', description: 'Documentation and workflow components.', meta: 'P' },",
  "  { title: 'Brand', description: 'Marketing surfaces with Yok personality.', meta: 'B' }",
  ']'
].join('\n')

const basicCode = '<YFeatureGrid :features="features" />'

const compactCode = '<YFeatureGrid :features="compactFeatures" />'
</script>

# Feature Grid

Feature Grid 用于展示产品能力、服务价值或作品特点，是品牌页中最常见的基础区块之一。

::: tip TIP
`YFeatureGrid` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Product features {#feature-grid-product-features}

<DocDemo
  title="Product features"
  description="品牌页能力区块需要标题、说明和短 meta，不应只依赖图标或编号。"
  :code="basicCode"
  :setup="featureGridSetup"
  :usage="['brand package', 'feature list', 'responsive grid']"
>
  <YFeatureGrid :features="features" />
</DocDemo>

## Package tracks {#feature-grid-package-tracks}

<DocDemo
  title="Package tracks"
  description="紧凑能力组适合首页首屏后的信息摘要，移动端会自动回到单列。"
  :code="compactCode"
  :setup="featureGridSetup"
  :usage="['compact copy', 'meta', 'mobile single column']"
>
  <YFeatureGrid :features="compactFeatures" />
</DocDemo>

## Feature Grid API {#feature-grid-api}

<ComponentApiSection name="YFeatureGrid" />

## Accessibility {#accessibility}

- 每个功能项都应有明确 `title` 和 `description`，不要只用图标或编号表达含义。
- `meta` 适合放编号或短标签，不能作为唯一说明。
- 大量功能项应由页面补充分组标题，方便辅助技术用户按区域浏览。
