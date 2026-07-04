<script setup lang="ts">
import { ref } from 'vue'
import type { YSavedViewItem } from '@yok-ui/admin'

const currentView = ref('release')
const defaultView = ref('stable')

const views: YSavedViewItem[] = [
  {
    label: 'Release queue',
    value: 'release',
    description: 'Beta components ready for review',
    count: 8,
    pinned: true
  },
  {
    label: 'Stable core',
    value: 'stable',
    description: 'Core components marked stable',
    count: 18
  },
  {
    label: 'Needs accessibility review',
    value: 'a11y',
    description: 'Components with documented gaps',
    count: 4
  }
]

const managedViews = ref<YSavedViewItem[]>([...views])

const savedViewsSetup = [
  "import { ref } from 'vue'",
  "import { YSavedViewManager, YSavedViews, type YSavedViewItem } from '@yok-ui/admin'",
  '',
  "const currentView = ref('release')",
  "const defaultView = ref('stable')",
  '',
  'const views: YSavedViewItem[] = [',
  '  {',
  "    label: 'Release queue',",
  "    value: 'release',",
  "    description: 'Beta components ready for review',",
  '    count: 8,',
  '    pinned: true',
  '  },',
  '  {',
  "    label: 'Stable core',",
  "    value: 'stable',",
  "    description: 'Core components marked stable',",
  '    count: 18',
  '  },',
  '  {',
  "    label: 'Needs accessibility review',",
  "    value: 'a11y',",
  "    description: 'Components with documented gaps',",
  '    count: 4',
  '  }',
  ']',
  '',
  'const managedViews = ref<YSavedViewItem[]>([...views])'
].join('\n')

const basicCode = [
  '<YSavedViews',
  '  v-model="currentView"',
  '  title="Component views"',
  '  description="Switch release-ready filters quickly."',
  '  aria-label="Component saved views"',
  '  :items="views"',
  '/>',
  '<p class="demo-note">Current view: {{ currentView }}</p>'
].join('\n')

const managerCode = [
  '<YSavedViewManager',
  '  v-model="currentView"',
  '  v-model:default-value="defaultView"',
  '  v-model:items="managedViews"',
  '  title="Manage component views"',
  '  description="Rename, pin, duplicate, delete and choose a default view."',
  '/>',
  '<p class="demo-note">Default view: {{ defaultView }}</p>'
].join('\n')
</script>

# Saved Views

Saved Views 用于后台列表页的筛选方案保存和快速切换。它参考主流后台产品里的 saved filters / table views 模式，适合放在 `YCrudLayout` 的侧栏或列表工具区。

组件只负责 UI 与事件，不持久化数据。业务层可以把视图保存到接口、localStorage 或用户配置中心。轻量切换使用 `YSavedViews`，完整管理使用 `YSavedViewManager`。

## Example

<DocDemo
  title="Saved filter views"
  description="保存视图适合把高频筛选方案固定在列表侧边或工具区。"
  :code="basicCode"
  :setup="savedViewsSetup"
  :usage="['admin package', 'saved filters', 'aria-pressed current view']"
>
  <YSavedViews
    v-model="currentView"
    title="Component views"
    description="Switch release-ready filters quickly."
    aria-label="Component saved views"
    :items="views"
  />
  <p class="demo-note">Current view: {{ currentView }}</p>
</DocDemo>

<DocDemo
  title="Manage saved views"
  description="管理器适合放在抽屉、设置页或侧栏中，用于编辑视图名称、说明、默认视图和固定状态。"
  :code="managerCode"
  :setup="savedViewsSetup"
  :usage="['view manager', 'rename', 'duplicate', 'default view']"
>
  <YSavedViewManager
    v-model="currentView"
    v-model:default-value="defaultView"
    v-model:items="managedViews"
    title="Manage component views"
    description="Rename, pin, duplicate, delete and choose a default view."
  />
  <p class="demo-note">Default view: {{ defaultView }}</p>
</DocDemo>

## Live example

<LiveExampleRunner preset="savedViews" />

## API

<ComponentApiSection name="YSavedViews" />

<ComponentApiSection name="YSavedViewManager" />

## Accessibility

- 外层使用具名 `section`。
- 每个保存视图都是原生 `button`，当前视图通过 `aria-pressed` 表达。
- 空状态使用 `role="status"`。
- 创建、保存和管理动作都通过事件交给业务层，不隐藏键盘可达的操作。
- 管理器中的名称、说明和固定状态复用基础输入、文本域和复选框组件，默认视图按钮禁用时仍保留可读状态。
