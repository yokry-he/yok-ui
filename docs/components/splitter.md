<script setup lang="ts">
import { ref } from 'vue'
import type { YSplitterPanel, YSplitterSizes } from '@yok-ui/core'

const panels: YSplitterPanel[] = [
  { key: 'navigation', label: 'Navigation', size: 28, min: 16, max: 48, collapsible: true, collapsedSize: 8 },
  { key: 'preview', label: 'Preview', size: 72, min: 36 }
]
const controlledSizes = ref<YSplitterSizes>({
  navigation: 34,
  preview: 66
})

const basicCode = [
  '<script setup lang="ts">',
  "import { YSplitter } from '@yok-ui/core'",
  '',
  'const panels = [',
  "  { key: 'navigation', label: 'Navigation', size: 28, min: 16, max: 48, collapsible: true, collapsedSize: 8 },",
  "  { key: 'preview', label: 'Preview', size: 72, min: 36 }",
  ']',
  '</' + 'script>',
  '',
  '<template>',
  '  <YSplitter :panels="panels" height="260px">',
  '    <template #navigation>Navigation</template>',
  '    <template #preview>Preview</template>',
  '  </YSplitter>',
  '</template>'
].join('\n')

const controlledCode = [
  '<script setup lang="ts">',
  "import { ref } from 'vue'",
  "import { YSplitter } from '@yok-ui/core'",
  '',
  "const controlledSizes = ref({ navigation: 34, preview: 66 })",
  '</' + 'script>',
  '',
  '<template>',
  '  <YSplitter v-model="controlledSizes" :panels="panels" />',
  '</template>'
].join('\n')
</script>

# Splitter

Splitter 用于把一个工作区拆成可调整的多个面板。它适合文档导航、编辑器预览、后台详情页和调试台这类需要用户分配空间的场景；如果只是静态页面骨架，优先使用 `YLayout`。

::: tip TIP
`YSplitter` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Workspace panels {#splitter-workspace-panels}

<DocDemo
  title="Workspace panels"
  description="拖拽分隔条调整左右面板。导航面板可以折叠，主内容会自动获得剩余空间。"
  :code="basicCode"
  :usage="['panels', 'named slots', 'collapsible', 'resize']"
>
  <YSplitter :panels="panels" height="260px" aria-label="Documentation workspace">
    <template #navigation>
      <div class="demo-stack">
        <strong>Components</strong>
        <YTag tone="info">Button</YTag>
        <YTag tone="info">Splitter</YTag>
        <YTag tone="info">Table</YTag>
      </div>
    </template>
    <template #preview>
      <div class="demo-stack">
        <strong>Preview</strong>
        <p>Use the separator to resize this panel. The sizes are stored as percentages.</p>
        <YTag tone="success">Resizable</YTag>
      </div>
    </template>
  </YSplitter>
</DocDemo>

## Controlled sizes {#splitter-controlled-sizes}

<DocDemo
  title="Controlled sizes"
  description="使用 v-model 保存面板尺寸，适合从用户偏好、路由状态或本地工作区配置恢复布局。"
  :code="controlledCode"
  :usage="['v-model', 'keyboardStep', 'resizeEnd']"
>
  <YSplitter
    v-model="controlledSizes"
    :panels="panels"
    height="220px"
    :keyboard-step="4"
    aria-label="Controlled splitter"
  >
    <template #navigation>
      <div class="demo-stack">
        <YTag tone="info">Navigation {{ controlledSizes.navigation }}%</YTag>
      </div>
    </template>
    <template #preview>
      <div class="demo-stack">
        <YTag tone="success">Preview {{ controlledSizes.preview }}%</YTag>
      </div>
    </template>
  </YSplitter>
</DocDemo>

## Splitter API {#splitter-api}

<ComponentApiSection name="YSplitter" />

## Accessibility {#accessibility}

- 分隔条使用 `role="separator"`，并根据布局设置 `aria-orientation`。
- 分隔条提供 `aria-valuemin`、`aria-valuemax` 和 `aria-valuenow`，辅助技术可以感知当前尺寸。
- `ArrowLeft` / `ArrowRight` 或 `ArrowUp` / `ArrowDown` 调整相邻面板尺寸，`Home` / `End` 跳到边界。
- 可折叠面板使用原生 button 控制，提供 `aria-pressed` 和清晰的展开/折叠文案。
