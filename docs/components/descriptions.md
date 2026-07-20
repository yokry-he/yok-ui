<script setup lang="ts">
import type { YDescriptionItem } from '@yok-ui/core'

const details: YDescriptionItem[] = [
  { key: 'component', label: 'Component', value: 'YDescriptions' },
  { key: 'package', label: 'Package', value: '@yok-ui/core' },
  { key: 'status', label: 'Status', value: 'Beta' },
  { key: 'owner', label: 'Owner', value: 'Design system' },
  { key: 'release', label: 'Release', value: '0.1.0' },
  { key: 'notes', label: 'Notes', value: 'Used for readable detail pages and review side panels.', span: 2 }
]

const descriptionsSetup = [
  "import { YButton, YDescriptions, YTag, type YDescriptionItem } from '@yok-ui/core'",
  '',
  'const details: YDescriptionItem[] = [',
  "  { key: 'component', label: 'Component', value: 'YDescriptions' },",
  "  { key: 'package', label: 'Package', value: '@yok-ui/core' },",
  "  { key: 'status', label: 'Status', value: 'Beta' },",
  "  { key: 'owner', label: 'Owner', value: 'Design system' },",
  "  { key: 'release', label: 'Release', value: '0.1.0' },",
  "  { key: 'notes', label: 'Notes', value: 'Used for readable detail pages and review side panels.', span: 2 }",
  ']'
].join('\n')

const basicCode = [
  '<YDescriptions',
  '  title="Component details"',
  '  description="Readable metadata for detail pages."',
  '  :items="details"',
  '/>'
].join('\n')

const borderedCode = [
  '<YDescriptions',
  '  bordered',
  '  layout="vertical"',
  '  title="Release profile"',
  '  description="A denser detail surface for admin pages."',
  '  :column="2"',
  '  :items="details"',
  '>',
  '  <template #extra>',
  '    <YButton size="sm" variant="secondary">Edit</YButton>',
  '  </template>',
  '  <template #item-status>',
  '    <YTag tone="warning">Beta</YTag>',
  '  </template>',
  '</YDescriptions>'
].join('\n')
</script>

# Descriptions

Descriptions 用于展示只读详情信息，例如用户资料、订单详情、审核记录、组件元数据或配置摘要。它参考 Ant Design、Element Plus 中的 Descriptions 模式，但底层使用 `dl` / `dt` / `dd` 语义，适合非表格型详情阅读。

::: tip TIP
`YDescriptions` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Component details {#descriptions-component-details}

<DocDemo
  title="Component details"
  description="只读键值信息使用 dl/dt/dd 语义，适合组件元数据、订单详情和配置摘要。"
  :code="basicCode"
  :setup="descriptionsSetup"
  :usage="['dl/dt/dd', 'metadata', 'span']"
>
  <YDescriptions
    title="Component details"
    description="Readable metadata for detail pages."
    :items="details"
  />
</DocDemo>

## Bordered {#descriptions-bordered}

<DocDemo
  title="Bordered profile"
  description="带边框和垂直布局适合审核侧栏、抽屉详情和密集配置回看。"
  :code="borderedCode"
  :setup="descriptionsSetup"
  :usage="['bordered', 'vertical', 'extra', 'item slot']"
>
  <YDescriptions
    bordered
    layout="vertical"
    title="Release profile"
    description="A denser detail surface for admin pages."
    :column="2"
    :items="details"
  >
    <template #extra>
      <YButton size="sm" variant="secondary">Edit</YButton>
    </template>
    <template #item-status>
      <YTag tone="warning">Beta</YTag>
    </template>
  </YDescriptions>
</DocDemo>

## Usage notes {#descriptions-usage-notes}

- 用 Descriptions 展示少量只读键值信息；如果用户需要排序、筛选、分页或批量操作，应改用 Table。
- 详情页主区域通常使用 2 到 3 列；侧栏、抽屉和移动端优先使用 `layout="vertical"` 或 `:column="1"`。
- `bordered` 适合后台审核、只读配置和密集表单回看；普通资料页可以保持无边框，降低视觉噪音。
- `extra` 插槽只放明确动作或状态，例如编辑、复制、审核状态，不要把主要内容塞到标题区。
- 长说明、备注和变更原因建议通过 `span` 占据更多列，避免值区域被挤压成难读的短行。
- 需要读屏友好时，为组件补充 `aria-label`，并保留 `dl` / `dt` / `dd` 标签和值的语义关系。

## Descriptions API {#descriptions-api}

<ComponentApiSection name="YDescriptions" />

## Accessibility {#accessibility}

- 外层使用具名 `section`。
- 详情内容使用原生 `dl` / `dt` / `dd`，让标签和值保持语义关联。
- 空状态使用 `role="status"`。
- 自定义 `item-{key}` 插槽时，建议仍然只渲染值区域，不重复标签。
