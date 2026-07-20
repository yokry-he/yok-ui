---
title: Layout
description: 页面级 flex 骨架，组织 Header、Aside、Main 和 Footer，适合官网、文档和后台壳层。
---

<script setup lang="ts">
import { ref } from 'vue'

const activeMenu = ref('components')
const menuItems = [
  { label: 'Dashboard', value: 'dashboard', icon: 'D' },
  { label: 'Components', value: 'components', icon: 'C' },
  { label: 'Resources', value: 'resources', icon: 'R' }
]

const pageShellCode = [
  '<script setup lang="ts">',
  "import { YFooter, YHeader, YLayout, YMain } from '@yok-ui/core'",
  '</' + 'script>',
  '',
  '<template>',
  '  <YLayout class="layout-demo-shell" aria-label="Documentation page shell">',
  '    <YHeader height="56px" bordered>Yok UI</YHeader>',
  '    <YMain>',
  '      <div class="layout-demo-content">',
  '        <strong>Documentation content</strong>',
  '        <p>Use Header, Main and Footer to compose a stable documentation page.</p>',
  '      </div>',
  '    </YMain>',
  '    <YFooter bordered>Released under MIT.</YFooter>',
  '  </YLayout>',
  '</' + 'template>',
  '',
  '<style scoped>',
  '.layout-demo-shell {',
  '  min-height: 320px;',
  '  overflow: hidden;',
  '  border: 1px solid var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '}',
  '',
  '.layout-demo-content {',
  '  display: grid;',
  '  gap: 8px;',
  '  min-height: 140px;',
  '  border: 1px dashed var(--yok-color-border);',
  '  border-radius: var(--yok-radius-md);',
  '  background: var(--yok-color-surface);',
  '  padding: 20px;',
  '}',
  '',
  '.layout-demo-content p {',
  '  margin: 0;',
  '  color: var(--yok-color-textMuted);',
  '}',
  '</' + 'style>'
].join('\n')

const adminShellCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YAside, YHeader, YLayout, YMain, YMenu, type YMenuItem } from '@yok-ui/core'",
  '',
  "const activeMenu = ref('components')",
  'const menuItems: YMenuItem[] = [',
  "  { label: 'Dashboard', value: 'dashboard', icon: 'D' },",
  "  { label: 'Components', value: 'components', icon: 'C' },",
  "  { label: 'Resources', value: 'resources', icon: 'R' }",
  ']',
  '</' + 'script>',
  '',
  '<template>',
  '  <YLayout class="layout-demo-shell" aria-label="Admin shell">',
  '    <YHeader sticky bordered>Yok UI Workspace</YHeader>',
  '    <YLayout direction="horizontal">',
  '      <YAside width="232px" bordered aria-label="Primary navigation">',
  '        <YMenu v-model="activeMenu" :items="menuItems" />',
  '      </YAside>',
  '      <YMain scrollable>',
  '        <div class="layout-demo-content">',
  '          <strong>Workspace</strong>',
  '          <p>Current route: {{ activeMenu }}</p>',
  '        </div>',
  '      </YMain>',
  '    </YLayout>',
  '  </YLayout>',
  '</' + 'template>',
  '',
  '<style scoped>',
  '.layout-demo-shell {',
  '  min-height: 360px;',
  '  overflow: hidden;',
  '  border: 1px solid var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '}',
  '',
  '.layout-demo-content {',
  '  display: grid;',
  '  gap: 8px;',
  '  min-height: 180px;',
  '  border: 1px dashed var(--yok-color-border);',
  '  border-radius: var(--yok-radius-md);',
  '  background: var(--yok-color-surface);',
  '  padding: 20px;',
  '}',
  '',
  '.layout-demo-content p {',
  '  margin: 0;',
  '  color: var(--yok-color-textMuted);',
  '}',
  '</' + 'style>'
].join('\n')

const collapsedAsideCode = [
  '<script setup lang="ts">',
  "import { YAside, YLayout, YMain } from '@yok-ui/core'",
  '</' + 'script>',
  '',
  '<template>',
  '  <YLayout class="layout-demo-shell layout-demo-shell--compact" direction="horizontal" aria-label="Collapsed shell">',
  '    <YAside width="232px" collapsed-width="72px" collapsed bordered aria-label="Collapsed navigation">',
  '      <div class="layout-demo-aside">Nav</div>',
  '    </YAside>',
  '    <YMain>',
  '      <div class="layout-demo-content">',
  '        <strong>Content</strong>',
  '        <p>Collapsed sidebars preserve the expanded width token while rendering the compact width.</p>',
  '      </div>',
  '    </YMain>',
  '  </YLayout>',
  '</' + 'template>',
  '',
  '<style scoped>',
  '.layout-demo-shell {',
  '  min-height: 280px;',
  '  overflow: hidden;',
  '  border: 1px solid var(--yok-color-border);',
  '  border-radius: var(--yok-radius-lg);',
  '}',
  '',
  '.layout-demo-aside {',
  '  display: grid;',
  '  place-items: center;',
  '  min-height: 100%;',
  '  color: var(--yok-color-textMuted);',
  '  font-weight: 700;',
  '}',
  '',
  '.layout-demo-content {',
  '  display: grid;',
  '  gap: 8px;',
  '  min-height: 140px;',
  '  border: 1px dashed var(--yok-color-border);',
  '  border-radius: var(--yok-radius-md);',
  '  background: var(--yok-color-surface);',
  '  padding: 20px;',
  '}',
  '',
  '.layout-demo-content p {',
  '  margin: 0;',
  '  color: var(--yok-color-textMuted);',
  '}',
  '</' + 'style>'
].join('\n')
</script>

# Layout

Layout 用于搭建页面的基础骨架。它参考 Element Plus Container 的 `Container / Header / Aside / Main / Footer` 组合方式：外层负责 flex 方向和尺寸，内容交互仍交给 Menu、Table、Form 等组件。

::: tip TIP
`YLayout` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Page Shell {#layout-page-shell}

<DocDemo
  title="Page shell"
  description="Header、Main、Footer 组成纵向页面骨架，适合文档页、官网详情页和内容页。"
  :code="pageShellCode"
  :usage="['header', 'main', 'footer', 'vertical layout']"
>
  <YLayout class="docs-layout-demo-shell" aria-label="Documentation page shell">
    <YHeader height="56px" bordered>Yok UI</YHeader>
    <YMain>
      <div class="docs-layout-demo-content">
        <strong>Documentation content</strong>
        <p>Use Header, Main and Footer to compose a stable documentation page.</p>
      </div>
    </YMain>
    <YFooter bordered>Released under MIT.</YFooter>
  </YLayout>
</DocDemo>

## Admin Shell {#layout-admin-shell}

<DocDemo
  title="Admin shell"
  description="嵌套横向 Layout 可以组织顶栏、侧栏和主体工作区，适合后台、控制台和文档站壳层。"
  :code="adminShellCode"
  :usage="['nested layout', 'sticky header', 'aside navigation', 'scrollable main']"
>
  <YLayout class="docs-layout-demo-shell" aria-label="Admin shell">
    <YHeader sticky bordered>Yok UI Workspace</YHeader>
    <YLayout direction="horizontal">
      <YAside width="232px" bordered aria-label="Primary navigation">
        <YMenu v-model="activeMenu" :items="menuItems" />
      </YAside>
      <YMain scrollable>
        <div class="docs-layout-demo-content">
          <strong>Workspace</strong>
          <p>Current route: {{ activeMenu }}</p>
        </div>
      </YMain>
    </YLayout>
  </YLayout>
</DocDemo>

## Collapsed Aside {#layout-collapsed-aside}

<DocDemo
  title="Collapsed aside"
  description="collapsed 侧栏适合图标导航、编辑器面板和工作台紧凑模式。"
  :code="collapsedAsideCode"
  :usage="['aside', 'collapsed width', 'horizontal layout']"
>
  <YLayout class="docs-layout-demo-shell docs-layout-demo-shell--compact" direction="horizontal" aria-label="Collapsed shell">
    <YAside width="232px" collapsed-width="72px" collapsed bordered aria-label="Collapsed navigation">
      <div class="docs-layout-demo-aside">Nav</div>
    </YAside>
    <YMain>
      <div class="docs-layout-demo-content">
        <strong>Content</strong>
        <p>Collapsed sidebars preserve the expanded width token while rendering the compact width.</p>
      </div>
    </YMain>
  </YLayout>
</DocDemo>

## Usage Notes {#layout-usage-notes}

- `YLayout` 的 `direction="auto"` 会在直接子元素包含 `YHeader` 或 `YFooter` 时使用纵向布局，否则使用横向布局。
- `YAside` 只负责侧栏尺寸与区域语义；真实导航建议组合 `YMenu`，移动端建议放入抽屉或紧凑导航。
- `YMain` 是页面主体区域，默认带内边距；工作台、表格页或嵌套滚动场景可设置 `scrollable` 或 `:padded="false"`。
- `sticky` 顶栏适合文档、后台和长页面工具栏；使用时应确认内容区域不会被遮挡。

## Layout API {#layout-api}

<ComponentApiSection name="YLayout" />

<style scoped>
.docs-layout-demo-shell {
  min-height: 320px;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
}

.docs-layout-demo-shell--compact {
  min-height: 280px;
}

.docs-layout-demo-content {
  display: grid;
  gap: 8px;
  min-height: 140px;
  border: 1px dashed var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  padding: 20px;
}

.docs-layout-demo-content p {
  margin: 0;
  color: var(--yok-color-textMuted);
}

.docs-layout-demo-aside {
  display: grid;
  place-items: center;
  min-height: 100%;
  color: var(--yok-color-textMuted);
  font-weight: 700;
}

@media (max-width: 720px) {
  .docs-layout-demo-shell {
    min-height: 260px;
  }
}
</style>

## Accessibility {#accessibility}

- `YLayout` 使用 `role="group"` 和 `ariaLabel` 描述页面骨架区域。
- `YHeader`、`YAside`、`YMain`、`YFooter` 使用原生语义标签，不额外创建键盘陷阱。
- 焦点顺序由 DOM 顺序决定；布局组件不改变子组件的 Tab 行为。
- `YAside` 应提供能描述导航或补充信息的 `ariaLabel`。
