<script setup lang="ts">
const tagBadgeSetup = [
  "import { YAvatar, YBadge, YButton, YTag } from '@yok-ui/core'"
].join('\n')

const tagCode = [
  '<div class="demo-row">',
  '  <YTag>Neutral</YTag>',
  '  <YTag tone="success">Stable</YTag>',
  '  <YTag tone="warning">Beta</YTag>',
  '  <YTag tone="danger">Deprecated</YTag>',
  '  <YTag tone="info">Roadmap</YTag>',
  '</div>'
].join('\n')

const badgeCode = [
  '<div class="demo-row">',
  '  <YBadge :value="12" label="12 unread notifications" />',
  '  <YBadge :value="120" :max="99" label="More than 99 unread notifications" />',
  '  <YBadge value="new" tone="info" label="New feature available" />',
  '  <YBadge :value="0" show-zero tone="warning" label="No pending checks" />',
  '</div>'
].join('\n')

const targetCode = [
  '<div class="demo-row">',
  '  <YBadge :value="8" label="Inbox has 8 unread messages">',
  '    <YButton variant="secondary">Inbox</YButton>',
  '  </YBadge>',
  '  <YBadge dot tone="success" label="Online status">',
  '    <YAvatar name="Yok UI" />',
  '  </YBadge>',
  '  <YBadge :value="3" tone="danger" placement="bottom-end" label="3 release blockers">',
  '    <YButton variant="primary">Release</YButton>',
  '  </YBadge>',
  '  <YBadge :value="18" size="lg" :offset="[8, -4]" label="18 selected components">',
  '    <YButton variant="secondary">Selection</YButton>',
  '  </YBadge>',
  '  <YBadge dot text="Online" tone="success" size="lg" label="Online status" />',
  '</div>'
].join('\n')
</script>

# Tag & Badge

Tag 表达状态或分类，Badge 表达计数或短提示。两者都应保持短小，不承担长文本说明。

Badge 的设计参考了 Element Plus、Ant Design Vue 等主流组件库的通知计数和状态角标模式：既可以独立显示短计数，也可以包裹按钮、头像、图标等宿主元素，把徽标定位到角上。

## Examples

<DocDemo
  title="Tag tones"
  description="标签用于短状态和分类，语义色必须配合可读文本。"
  :code="tagCode"
  :setup="tagBadgeSetup"
  :usage="['status label', 'semantic tone', 'short text']"
>
  <div class="demo-row">
    <YTag>Neutral</YTag>
    <YTag tone="success">Stable</YTag>
    <YTag tone="warning">Beta</YTag>
    <YTag tone="danger">Deprecated</YTag>
    <YTag tone="info">Roadmap</YTag>
  </div>
</DocDemo>

<DocDemo
  title="Badge count"
  description="徽标计数适合未读、待处理和短提示，超过 max 时自动收敛显示。"
  :code="badgeCode"
  :setup="tagBadgeSetup"
  :usage="['count badge', 'max value', 'show zero']"
>
  <div class="demo-row">
    <YBadge :value="12" label="12 unread notifications" />
    <YBadge :value="120" :max="99" label="More than 99 unread notifications" />
    <YBadge value="new" tone="info" label="New feature available" />
    <YBadge :value="0" show-zero tone="warning" label="No pending checks" />
  </div>
</DocDemo>

<DocDemo
  title="Badge on target"
  description="包裹按钮、头像或图标时，徽标只补充数量或状态，宿主元素仍需有明确名称。"
  :code="targetCode"
  :setup="tagBadgeSetup"
  :usage="['target badge', 'dot status', 'placement offset']"
>
  <div class="demo-row">
    <YBadge :value="8" label="Inbox has 8 unread messages">
      <YButton variant="secondary">Inbox</YButton>
    </YBadge>
    <YBadge dot tone="success" label="Online status">
      <YAvatar name="Yok UI" />
    </YBadge>
    <YBadge :value="3" tone="danger" placement="bottom-end" label="3 release blockers">
      <YButton variant="primary">Release</YButton>
    </YBadge>
    <YBadge :value="18" size="lg" :offset="[8, -4]" label="18 selected components">
      <YButton variant="secondary">Selection</YButton>
    </YBadge>
    <YBadge dot text="Online" tone="success" size="lg" label="Online status" />
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="tagBadge"
  title="在线编辑 Tag & Badge 示例"
  description="预览短标签语义色和徽标计数，适合状态、分类、通知和路线图提示。"
/>

## API

<ComponentApiSection :names="['YTag', 'YBadge']" />

## Accessibility

- Tag 和 Badge 都应保持短文本，避免把完整说明塞进小型视觉元素。
- 语义色只能作为辅助，稳定、警告、错误等含义需要用文本表达。
- Badge 适合表达数量或状态，不适合承载主要操作入口。
- 包裹按钮、头像或图标时，优先给宿主元素提供完整可访问名称；Badge 自身可以用 `label` 补充“8 条未读消息”“在线”等视觉提示含义。
- `dot` 徽标没有可见文本，必须提供 `label` 或在宿主元素上说明状态。
- `hidden` 用于暂时隐藏徽标内容，不应隐藏宿主按钮或头像。
- `offset` 只调整角标位置，不应用来修正布局问题；移动端优先选择更自然的 `placement`。
- 独立状态点可以使用 `dot text="Online"`，用于图例、在线状态或过滤条件摘要。
