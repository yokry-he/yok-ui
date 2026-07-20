---
title: Affix
description: 将工具栏、页内导航或提交操作固定在滚动容器边缘。
---

<script setup lang="ts">
import { ref } from 'vue'

const topFixed = ref(false)
const topScroll = ref(0)
const targetFixed = ref(false)

const topToolbarCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YAffix, YButton, YTag } from '@yok-ui/core'",
  '',
  'const fixed = ref(false)',
  'const scrollTop = ref(0)',
  '</' + 'script>',
  '',
  '<template>',
  '  <YAffix',
  '    :offset="24"',
  '    aria-label="Sticky release toolbar"',
  '    @change="fixed = $event"',
  '    @scroll="scrollTop = $event.scrollTop"',
  '  >',
  '    <div class="affix-demo-toolbar">',
  '      <YButton variant="primary" size="sm">Publish docs</YButton>',
  '      <YButton variant="secondary" size="sm">Preview</YButton>',
  '      <YTag :tone="fixed ? \'success\' : \'info\'">{{ fixed ? \'Pinned\' : \'Ready\' }}</YTag>',
  '    </div>',
  '  </YAffix>',
  '  <p class="affix-demo-note">Window scroll: {{ scrollTop }}px</p>',
  '</template>',
  '',
  '<style scoped>',
  '.affix-demo-toolbar {',
  '  display: flex;',
  '  flex-wrap: wrap;',
  '  align-items: center;',
  '  gap: 8px;',
  '  min-width: 0;',
  '  border: 1px solid var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '  background: var(--yok-color-surface);',
  '  padding: 10px;',
  '  box-shadow: var(--yok-shadow-soft);',
  '}',
  '',
  '.affix-demo-note {',
  '  margin: 12px 0 0;',
  '  color: var(--yok-color-textMuted);',
  '}',
  '</' + 'style>'
].join('\n')

const bottomBarCode = [
  '<script setup lang="ts">',
  "import { YAffix, YButton, YTag } from '@yok-ui/core'",
  '</' + 'script>',
  '',
  '<template>',
  '  <div class="affix-demo-panel">',
  '    <div class="affix-demo-card">',
  '      <strong>Review changes</strong>',
  '      <span class="affix-demo-card-copy">Long forms can keep the submit action visible near the viewport edge.</span>',
  '    </div>',
  '    <YAffix position="bottom" :offset="16" :z-index="120" aria-label="Sticky submit bar">',
  '      <div class="affix-demo-bottom-bar">',
  '        <YTag tone="warning">3 pending checks</YTag>',
  '        <YButton variant="primary" size="sm">Submit review</YButton>',
  '      </div>',
  '    </YAffix>',
  '  </div>',
  '</template>',
  '',
  '<style scoped>',
  '.affix-demo-panel {',
  '  display: grid;',
  '  gap: 12px;',
  '  min-height: 260px;',
  '}',
  '',
  '.affix-demo-card {',
  '  display: grid;',
  '  gap: 8px;',
  '  min-height: 160px;',
  '  border: 1px dashed var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '  background: var(--yok-color-surfaceMuted);',
  '  padding: 16px;',
  '}',
  '',
  '.affix-demo-card-copy {',
  '  color: var(--yok-color-textMuted);',
  '}',
  '',
  '.affix-demo-bottom-bar {',
  '  display: flex;',
  '  justify-content: space-between;',
  '  gap: 8px;',
  '  border: 1px solid var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '  background: var(--yok-color-surface);',
  '  padding: 10px;',
  '  box-shadow: var(--yok-shadow-soft);',
  '}',
  '</' + 'style>'
].join('\n')

const targetContainerCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YAffix, YButton, YTag } from '@yok-ui/core'",
  '',
  'const fixed = ref(false)',
  '</' + 'script>',
  '',
  '<template>',
  '  <section class="affix-demo-target-panel">',
  '    <YAffix',
  '      target=".affix-demo-target-panel"',
  '      :offset="12"',
  '      aria-label="Container toolbar"',
  '      @change="fixed = $event"',
  '    >',
  '      <div class="affix-demo-toolbar">',
  '        <YButton variant="secondary" size="sm">Sync section</YButton>',
  '        <YTag :tone="fixed ? \'success\' : \'info\'">{{ fixed ? \'Pinned in panel\' : \'Panel toolbar\' }}</YTag>',
  '      </div>',
  '    </YAffix>',
  '    <div class="affix-demo-target-content">',
  '      <p v-for="item in 8" :key="item" class="affix-demo-target-item">Release checklist item {{ item }}</p>',
  '    </div>',
  '  </section>',
  '</template>',
  '',
  '<style scoped>',
  '.affix-demo-target-panel {',
  '  height: 260px;',
  '  overflow: auto;',
  '  border: 1px solid var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '  background: var(--yok-color-background);',
  '  padding: 12px;',
  '}',
  '',
  '.affix-demo-toolbar {',
  '  display: flex;',
  '  flex-wrap: wrap;',
  '  align-items: center;',
  '  gap: 8px;',
  '  min-width: 0;',
  '  border: 1px solid var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '  background: var(--yok-color-surface);',
  '  padding: 10px;',
  '  box-shadow: var(--yok-shadow-soft);',
  '}',
  '',
  '.affix-demo-target-content {',
  '  display: grid;',
  '  gap: 10px;',
  '  padding-block: 14px;',
  '}',
  '',
  '.affix-demo-target-item {',
  '  margin: 0;',
  '  border: 1px dashed var(--yok-color-border);',
  '  border-radius: var(--yok-radius-md);',
  '  background: var(--yok-color-surfaceMuted);',
  '  padding: 14px;',
  '  color: var(--yok-color-textMuted);',
  '}',
  '</' + 'style>'
].join('\n')
</script>

# Affix

Affix 用于长文档、配置页、审批页和局部滚动容器中的固定操作区。它参考 Element Plus Affix 的核心操作模型，保留 `offset`、`target`、`position`、`zIndex`、`change` 和 `scroll`，但实现上优先使用浏览器原生 `position: sticky`，减少滚动过程中的布局计算。

::: tip TIP
`YAffix` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Top Toolbar {#affix-top-toolbar}

<DocDemo
  title="Top toolbar"
  description="顶部固定工具栏适合发布按钮、筛选条件、页内导航和批量操作。"
  :code="topToolbarCode"
  :usage="['top position', 'offset', 'change event', 'scroll event']"
>
  <YAffix
    :offset="24"
    aria-label="Sticky release toolbar"
    @change="topFixed = $event"
    @scroll="topScroll = $event.scrollTop"
  >
    <div class="docs-affix-demo-toolbar">
      <YButton variant="primary" size="sm">Publish docs</YButton>
      <YButton variant="secondary" size="sm">Preview</YButton>
      <YTag :tone="topFixed ? 'success' : 'info'">{{ topFixed ? 'Pinned' : 'Ready' }}</YTag>
    </div>
  </YAffix>
  <p class="docs-affix-demo-note">Window scroll: {{ topScroll }}px</p>
</DocDemo>

## Bottom Action Bar {#affix-bottom-action-bar}

<DocDemo
  title="Bottom action bar"
  description="底部固定操作条适合长表单提交和移动端确认操作，需要为内容预留空间避免遮挡。"
  :code="bottomBarCode"
  :usage="['bottom position', 'z-index', 'submit bar']"
>
  <div class="docs-affix-demo-panel">
    <div class="docs-affix-demo-card">
      <strong>Review changes</strong>
      <span class="docs-affix-demo-card-copy">Long forms can keep the submit action visible near the viewport edge.</span>
    </div>
    <YAffix position="bottom" :offset="16" :z-index="120" aria-label="Sticky submit bar">
      <div class="docs-affix-demo-bottom-bar">
        <YTag tone="warning">3 pending checks</YTag>
        <YButton variant="primary" size="sm">Submit review</YButton>
      </div>
    </YAffix>
  </div>
</DocDemo>

## Target Container {#affix-target-container}

<DocDemo
  title="Target container"
  description="target 指向局部滚动容器时，固定状态跟随容器滚动，而不是页面滚动。"
  :code="targetContainerCode"
  :usage="['target container', 'local scroll', 'sticky section toolbar']"
>
  <section class="docs-affix-demo-target-panel">
    <YAffix
      target=".docs-affix-demo-target-panel"
      :offset="12"
      aria-label="Container toolbar"
      @change="targetFixed = $event"
    >
      <div class="docs-affix-demo-toolbar">
        <YButton variant="secondary" size="sm">Sync section</YButton>
        <YTag :tone="targetFixed ? 'success' : 'info'">{{ targetFixed ? 'Pinned in panel' : 'Panel toolbar' }}</YTag>
      </div>
    </YAffix>
    <div class="docs-affix-demo-target-content">
      <p v-for="item in 8" :key="item" class="docs-affix-demo-target-item">Release checklist item {{ item }}</p>
    </div>
  </section>
</DocDemo>

## Usage Notes {#affix-usage-notes}

- 顶部工具栏适合文档目录、筛选条件、批量操作和发布按钮。
- 底部操作条适合移动端提交区和长表单确认区，但要避免遮挡主要内容。
- `target` 应指向真实滚动容器；目标元素不存在时会回退到 `window`。
- `YAffix` 不负责创建抽屉、弹层或导航菜单，复杂交互应组合 `YDrawer`、`YMenu`、`YTabs` 或业务组件。

## Affix API {#affix-api}

<ComponentApiSection name="YAffix" />

<style scoped>
.docs-affix-demo-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  padding: 10px;
  box-shadow: var(--yok-shadow-soft);
}

.docs-affix-demo-note {
  margin: 12px 0 0;
  color: var(--yok-color-textMuted);
}

.docs-affix-demo-panel {
  display: grid;
  gap: 12px;
  min-height: 260px;
}

.docs-affix-demo-card {
  display: grid;
  gap: 8px;
  min-height: 160px;
  border: 1px dashed var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
  padding: 16px;
}

.docs-affix-demo-card-copy {
  color: var(--yok-color-textMuted);
}

.docs-affix-demo-bottom-bar {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  padding: 10px;
  box-shadow: var(--yok-shadow-soft);
}

.docs-affix-demo-target-panel {
  height: 260px;
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-background);
  padding: 12px;
}

.docs-affix-demo-target-content {
  display: grid;
  gap: 10px;
  padding-block: 14px;
}

.docs-affix-demo-target-item {
  margin: 0;
  border: 1px dashed var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  padding: 14px;
  color: var(--yok-color-textMuted);
}

@media (max-width: 520px) {
  .docs-affix-demo-bottom-bar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

## Accessibility {#accessibility}

- 根节点使用 `role="region"` 和 `ariaLabel` 描述固定区域。
- 组件不创建额外焦点陷阱，也不会改变插槽内按钮、链接和输入控件的 Tab 顺序。
- 固定区域可能覆盖内容；业务页面需要为主要内容预留足够间距，尤其是底部操作条。
- `change` 和 `scroll` 事件只反馈状态，不应在滚动时强制移动焦点。
