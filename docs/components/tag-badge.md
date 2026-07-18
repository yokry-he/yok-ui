<script setup lang="ts">
import { ref } from 'vue'

const selectedPackages = ref(['core'])

function togglePackage(packageName: string, checked: boolean) {
  selectedPackages.value = checked
    ? Array.from(new Set([...selectedPackages.value, packageName]))
    : selectedPackages.value.filter((item) => item !== packageName)
}

const tagBadgeSetup = [
  "import { ref } from 'vue'",
  "import { YAvatar, YBadge, YButton, YCheckTag, YTag } from '@yok-ui/core'",
  '',
  "const selectedPackages = ref(['core'])",
  '',
  'function togglePackage(packageName: string, checked: boolean) {',
  '  selectedPackages.value = checked',
  '    ? Array.from(new Set([...selectedPackages.value, packageName]))',
  '    : selectedPackages.value.filter((item) => item !== packageName)',
  '}'
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

const checkTagCode = [
  '<div class="demo-row">',
  '  <YCheckTag',
  "    :checked=\"selectedPackages.includes('core')\"",
  '    tone="success"',
  '    label="Toggle Core package"',
  "    @update:checked=\"togglePackage('core', $event)\"",
  '  >',
  '    Core',
  '  </YCheckTag>',
  '  <YCheckTag',
  "    :checked=\"selectedPackages.includes('product')\"",
  '    tone="info"',
  '    label="Toggle Product package"',
  "    @update:checked=\"togglePackage('product', $event)\"",
  '  >',
  '    Product',
  '  </YCheckTag>',
  '  <YCheckTag',
  "    :checked=\"selectedPackages.includes('admin')\"",
  '    tone="warning"',
  '    label="Toggle Admin package"',
  "    @update:checked=\"togglePackage('admin', $event)\"",
  '  >',
  '    Admin',
  '  </YCheckTag>',
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

Tag 表达状态或分类，Check Tag 表达可勾选的轻量选择，Badge 表达计数或短提示。它们都应保持短小，不承担长文本说明。

Badge 的设计参考了 Element Plus、Ant Design Vue 等主流组件库的通知计数和状态角标模式：既可以独立显示短计数，也可以包裹按钮、头像、图标等宿主元素，把徽标定位到角上。

Check Tag 对齐 Element Plus CheckTag、Ant Design CheckableTag 和 TDesign CheckTag 的轻量筛选模式，但使用原生 button 与 `aria-pressed`，让键盘和读屏行为更稳定。

::: tip TIP
`YTag` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Tag tones {#tag-badge-tag-tones}

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

## Check tags {#tag-badge-check-tags}

<DocDemo
  title="Check tags"
  description="可勾选标签适合筛选、偏好和轻量多选；本质是 aria-pressed button。"
  :code="checkTagCode"
  :setup="tagBadgeSetup"
  :usage="['checkable tag', 'v-model checked', 'aria pressed']"
>
  <div class="demo-row">
    <YCheckTag
      :checked="selectedPackages.includes('core')"
      tone="success"
      label="Toggle Core package"
      @update:checked="togglePackage('core', $event)"
    >
      Core
    </YCheckTag>
    <YCheckTag
      :checked="selectedPackages.includes('product')"
      tone="info"
      label="Toggle Product package"
      @update:checked="togglePackage('product', $event)"
    >
      Product
    </YCheckTag>
    <YCheckTag
      :checked="selectedPackages.includes('admin')"
      tone="warning"
      label="Toggle Admin package"
      @update:checked="togglePackage('admin', $event)"
    >
      Admin
    </YCheckTag>
  </div>
</DocDemo>

## Badge count {#tag-badge-badge-count}

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

## Badge on target {#tag-badge-badge-on-target}

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

## Tag & Badge API {#tag-badge-api}

<ComponentApiSection :names="['YTag', 'YCheckTag', 'YBadge']" />

## Accessibility {#accessibility}

- Tag 和 Badge 都应保持短文本，避免把完整说明塞进小型视觉元素。
- 语义色只能作为辅助，稳定、警告、错误等含义需要用文本表达。
- Check Tag 使用原生 button 和 `aria-pressed` 表示选中状态，适合少量轻量选择；复杂表单仍应优先使用 CheckboxGroup。
- Check Tag 的错误状态需要通过 `invalid`、`error` 或 `ariaDescribedby` 连接到明确提示。
- Badge 适合表达数量或状态，不适合承载主要操作入口。
- 包裹按钮、头像或图标时，优先给宿主元素提供完整可访问名称；Badge 自身可以用 `label` 补充“8 条未读消息”“在线”等视觉提示含义。
- `dot` 徽标没有可见文本，必须提供 `label` 或在宿主元素上说明状态。
- `hidden` 用于暂时隐藏徽标内容，不应隐藏宿主按钮或头像。
- `offset` 只调整角标位置，不应用来修正布局问题；移动端优先选择更自然的 `placement`。
- 独立状态点可以使用 `dot text="Online"`，用于图例、在线状态或过滤条件摘要。
