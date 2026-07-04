<script setup lang="ts">
const skeletonSetup = "import { YSkeleton } from '@yok-ui/core'"

const profileCode = [
  '<div class="demo-stack" role="status" aria-label="Loading profile card">',
  '  <div class="demo-row">',
  '    <YSkeleton variant="circle" label="Loading profile avatar" />',
  '    <div class="demo-stack" style="min-width: 220px;">',
  '      <YSkeleton :rows="3" label="Loading profile summary" />',
  '    </div>',
  '  </div>',
  '  <YSkeleton variant="rect" height="120px" label="Loading card preview" />',
  '</div>'
].join('\n')

const variantsCode = [
  '<div class="demo-stack">',
  '  <YSkeleton :rows="2" width="280px" label="Loading text content" />',
  '  <YSkeleton variant="circle" size="lg" label="Loading large avatar" />',
  '  <YSkeleton variant="rect" height="96px" :animated="false" label="Loading static chart" />',
  '</div>'
].join('\n')
</script>

# Skeleton

Skeleton 用于内容加载前的占位反馈，适合卡片、列表、头像和表格区域。Yok UI 的 Skeleton 保持轻量，不绑定异步状态；业务侧可以在数据加载完成后切换为真实内容。

## Example

<DocDemo
  title="Profile loading"
  description="组合头像、文本和卡片占位时，尺寸应接近最终内容，避免加载完成后明显跳动。"
  :code="profileCode"
  :setup="skeletonSetup"
  :usage="['rows', 'circle', 'rect', 'status']"
>
  <div class="demo-stack" role="status" aria-label="Loading profile card">
    <div class="demo-row">
      <YSkeleton variant="circle" label="Loading profile avatar" />
      <div class="demo-stack" style="min-width: 220px;">
        <YSkeleton :rows="3" label="Loading profile summary" />
      </div>
    </div>
    <YSkeleton variant="rect" height="120px" label="Loading card preview" />
  </div>
</DocDemo>

<DocDemo
  title="Variants"
  description="文本、头像和矩形占位应分别匹配内容形态；必要时可关闭动画。"
  :code="variantsCode"
  :setup="skeletonSetup"
  :usage="['text', 'circle', 'rect', 'animated=false']"
>
  <div class="demo-stack">
    <YSkeleton :rows="2" width="280px" label="Loading text content" />
    <YSkeleton variant="circle" size="lg" label="Loading large avatar" />
    <YSkeleton variant="rect" height="96px" :animated="false" label="Loading static chart" />
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="skeleton"
  title="在线编辑 Skeleton 示例"
  description="切换详情卡片、远程列表、快速返回、移动端和读屏状态，检查加载占位是否接近真实内容结构。"
/>

## Usage notes

- Skeleton 应该尽量接近最终 DOM 的视觉尺寸，避免真实内容出现时产生明显跳动。
- 远程列表可以渲染少量重复占位，但不要生成过多骨架项；通常 3 到 5 条足够表达加载状态。
- 接口很快返回时，不要立即闪一下骨架屏；可以在业务层增加短延迟，只有慢请求才显示占位。
- 移动端 Skeleton 要减少高度和行数，保留核心结构即可，避免加载态占满首屏。
- 多个装饰性 Skeleton 默认隐藏给读屏；如果需要宣布加载状态，应把它们包在一个 `role="status"` 容器里，或只给最外层传入清晰的 `label`。

## Patterns

| Pattern | Recommendation |
| --- | --- |
| Text | 使用 `rows` 表达段落行数，最后一行会自动缩短 |
| Avatar | 使用 `variant="circle"`，可配合 `size` 控制头像尺寸 |
| Card / chart | 使用 `variant="rect"`，通过 `height` 保持布局稳定 |
| List loading | 使用少量重复骨架项模拟远程列表，不要无限追加 |
| Fast response | 业务层延迟显示 Skeleton，减少快速请求导致的闪烁 |
| Accessibility | 装饰性占位默认 `aria-hidden`；需要表达加载状态时传入 `label` |
| Motion | 动画默认开启，并尊重 `prefers-reduced-motion` |

## API

<ComponentApiSection name="YSkeleton" />

## Accessibility

- 不传 `label` 时 Skeleton 作为装饰隐藏，避免读屏用户听到无意义占位。
- 需要表达加载状态时传入 `label`，由业务容器控制真实内容何时出现。
- 多个 Skeleton 组合成页面加载态时，优先在外层使用一个 `role="status"` 或一个清晰 `label`，不要让每一行都被播报。
- 动画尊重 `prefers-reduced-motion`，避免对敏感用户造成干扰。
