<script setup lang="ts">
const cardSetup = "import { YBadge, YButton, YCard, YTag } from '@yok-ui/core'"

const packageCode = [
  '<YCard title="Core package" description="Reusable base components for every package." interactive>',
  '  <div class="demo-row">',
  '    <YTag tone="success">Stable</YTag>',
  '    <YBadge value="23" />',
  '  </div>',
  '  <template #extra>',
  '    <YButton size="sm" variant="ghost">Open</YButton>',
  '  </template>',
  '</YCard>'
].join('\n')

const footerCode = [
  '<YCard title="Release checklist" description="Keep card actions explicit and keyboard reachable.">',
  '  <p class="demo-note">Review accessibility notes, API coverage, and theme tokens before release.</p>',
  '  <template #footer>',
  '    <YButton variant="ghost">Save draft</YButton>',
  '    <YButton variant="primary">Publish</YButton>',
  '  </template>',
  '</YCard>'
].join('\n')
</script>

# Card

Card 用于组织一组相关内容，是文档、设置页、后台概览和品牌展示页都会复用的基础容器。

::: tip TIP
`YCard` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Package card {#card-package-card}

<DocDemo
  title="Package card"
  description="Card 组织同一主题的信息，extra 放轻量入口，interactive 只提供视觉反馈。"
  :code="packageCode"
  :setup="cardSetup"
  :usage="['title', 'description', 'extra', 'interactive']"
>
  <YCard title="Core package" description="Reusable base components for every package." interactive>
    <div class="demo-row">
      <YTag tone="success">Stable</YTag>
      <YBadge value="23" />
    </div>
    <template #extra>
      <YButton size="sm" variant="ghost">Open</YButton>
    </template>
  </YCard>
</DocDemo>

## Footer actions {#card-footer-actions}

<DocDemo
  title="Footer actions"
  description="底部操作应使用真实按钮或链接，不依赖整卡点击来表达可操作区域。"
  :code="footerCode"
  :setup="cardSetup"
  :usage="['footer', 'actions', 'keyboard']"
>
  <YCard title="Release checklist" description="Keep card actions explicit and keyboard reachable.">
    <p class="demo-note">Review accessibility notes, API coverage, and theme tokens before release.</p>
    <template #footer>
      <YButton variant="ghost">Save draft</YButton>
      <YButton variant="primary">Publish</YButton>
    </template>
  </YCard>
</DocDemo>

## Usage notes {#card-usage-notes}

- Card 负责组织一组相关内容，适合概览、设置、列表项和仪表盘区块。
- `extra` 适合放标题栏右侧的轻量入口，例如复制链接、状态切换或更多操作。
- `footer` 适合放底部主要操作，按钮应保持明确文案和可见焦点。
- 不建议把整张 Card 做成隐式按钮；需要点击时，把真实按钮或链接放在 `footer` 或主体内容中。
- 网格卡片要控制信息密度，移动端应减少描述长度，并让操作区自然换行。

## Card API {#card-api}

<ComponentApiSection name="YCard" />

## Accessibility {#accessibility}

- Card 本身是内容容器，不应把整张卡片做成隐式按钮。
- `interactive` 只表达可交互视觉状态，实际点击区域应由内部按钮或链接提供。
- `extra` 插槽中的操作需要有明确文案和可见焦点。
- `footer` 插槽中的按钮应能通过 Tab 到达，避免只依赖 hover 或整卡点击。
