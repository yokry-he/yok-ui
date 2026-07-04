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

## Example

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

## Live example

<LiveExampleRunner
  preset="card"
  title="在线编辑 Card 示例"
  description="切换信息卡、操作卡、网格卡、移动卡和键盘操作场景，验证 Card 在真实页面里的层级和操作区。"
/>

## Usage notes

- Card 负责组织一组相关内容，适合概览、设置、列表项和仪表盘区块。
- `extra` 适合放标题栏右侧的轻量入口，例如复制链接、状态切换或更多操作。
- `footer` 适合放底部主要操作，按钮应保持明确文案和可见焦点。
- 不建议把整张 Card 做成隐式按钮；需要点击时，把真实按钮或链接放在 `footer` 或主体内容中。
- 网格卡片要控制信息密度，移动端应减少描述长度，并让操作区自然换行。

## API

<ComponentApiSection name="YCard" />

## Accessibility

- Card 本身是内容容器，不应把整张卡片做成隐式按钮。
- `interactive` 只表达可交互视觉状态，实际点击区域应由内部按钮或链接提供。
- `extra` 插槽中的操作需要有明确文案和可见焦点。
- `footer` 插槽中的按钮应能通过 Tab 到达，避免只依赖 hover 或整卡点击。
