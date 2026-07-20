<script setup lang="ts">
import { ref } from 'vue'
import type { YTreeCheckPayload, YTreeDropPayload, YTreeExpose, YTreeLoadErrorPayload, YTreeLoadPayload, YTreeNode, YTreeSelectPayload } from '@yok-ui/core'

const selectedKey = ref('button')
const expandedKeys = ref(['core', 'product'])
const checkedKeys = ref(['button'])
const strictCheckedKeys = ref(['tree'])
const treeRef = ref<YTreeExpose>()
const lastDrop = ref('No drop yet')
const lastCheck = ref('Checked: button')
const lastSelect = ref('Selected: button')
const lastLoad = ref('No async load yet')
const loadVersions = new Map<string, number>()
const largeNodes = Array.from({ length: 160 }, (_, index) => ({
  key: `node-${index + 1}`,
  label: `Component node ${index + 1}`
}))
const lazyNodes: YTreeNode[] = [
  { key: 'remote-core', label: 'Remote core package' },
  { key: 'remote-admin', label: 'Remote admin package' }
]

const nodes = [
  {
    key: 'core',
    label: 'Core',
    children: [
      { key: 'button', label: 'Button' },
      { key: 'date-picker', label: 'Date Picker' },
      { key: 'tree', label: 'Tree' }
    ]
  },
  {
    key: 'product',
    label: 'Product',
    children: [
      { key: 'command-palette', label: 'Command Palette' },
      { key: 'code-block', label: 'Code Block' }
    ]
  },
  {
    key: 'admin',
    label: 'Admin',
    children: [
      { key: 'metric-card', label: 'Metric Card' },
      { key: 'data-toolbar', label: 'Data Toolbar', disabled: true }
    ]
  }
]

const treeCodeSetup = [
  "import { ref } from 'vue'",
  "import { YButton, YTag, YTree, type YTreeCheckPayload, type YTreeDropPayload, type YTreeExpose, type YTreeLoadErrorPayload, type YTreeLoadPayload, type YTreeNode, type YTreeSelectPayload } from '@yok-ui/core'",
  '',
  "const selectedKey = ref('button')",
  "const expandedKeys = ref(['core', 'product'])",
  "const checkedKeys = ref(['button'])",
  "const strictCheckedKeys = ref(['tree'])",
  'const treeRef = ref<YTreeExpose>()',
  "const lastDrop = ref('No drop yet')",
  "const lastCheck = ref('Checked: button')",
  "const lastSelect = ref('Selected: button')",
  "const lastLoad = ref('No async load yet')",
  'const loadVersions = new Map<string, number>()',
  'const largeNodes = Array.from({ length: 160 }, (_, index) => ({',
  '  key: `node-${index + 1}`,',
  '  label: `Component node ${index + 1}`',
  '}))',
  "const lazyNodes: YTreeNode[] = [",
  "  { key: 'remote-core', label: 'Remote core package' },",
  "  { key: 'remote-admin', label: 'Remote admin package' }",
  ']',
  '',
  `const nodes = ${JSON.stringify(nodes, null, 2)}`,
  '',
  'function handleDrop(payload: YTreeDropPayload) {',
  '  lastDrop.value = `${payload.draggingKey} ${payload.type} ${payload.dropKey}`',
  '}',
  '',
  'function handleCheck(payload: YTreeCheckPayload) {',
  "  lastCheck.value = `Checked: ${payload.checkedKeys.join(', ') || 'none'}`",
  '}',
  '',
  'function handleSelect(payload: YTreeSelectPayload) {',
  '  lastSelect.value = `Selected: ${payload.key}`',
  '}',
  '',
  'async function loadRemoteNode(node: YTreeNode) {',
  '  await new Promise((resolve) => setTimeout(resolve, 320))',
  '  const version = (loadVersions.get(node.key) ?? 0) + 1',
  '  loadVersions.set(node.key, version)',
  '',
  "  if (node.key === 'remote-core') {",
  '    return [',
  "      { key: `remote-core-button-${version}`, label: `Button from API v${version}`, isLeaf: true },",
  "      { key: `remote-core-tree-${version}`, label: `Tree from API v${version}`, isLeaf: true }",
  '    ]',
  '  }',
  '',
  '  return [',
  "    { key: `${node.key}-workflow`, label: 'Workflow loaded remotely', isLeaf: true }",
  '  ]',
  '}',
  '',
  'function handleLoad(payload: YTreeLoadPayload) {',
  '  lastLoad.value = `${payload.key}: ${payload.children.length} children loaded`',
  '}',
  '',
  'function handleLoadError(payload: YTreeLoadErrorPayload) {',
  '  lastLoad.value = `${payload.key}: load failed`',
  '}',
  '',
  'async function reloadRemoteCore() {',
  "  const refreshed = await treeRef.value?.reloadNode('remote-core')",
  "  lastLoad.value = refreshed ? 'remote-core refreshed' : 'remote-core is not ready to refresh'",
  '}'
].join('\n')

const basicCode = [
  '<YTree',
  '  v-model:selected-key="selectedKey"',
  '  v-model:expanded-keys="expandedKeys"',
  '  :nodes="nodes"',
  '  aria-label="Yok UI component tree"',
  '  @select="handleSelect"',
  '/>'
].join('\n')

const checkableCode = [
  '<YTree',
  '  v-model:checked-keys="checkedKeys"',
  '  :nodes="nodes"',
  '  checkable',
  '  aria-label="Permission tree"',
  '  @check="handleCheck"',
  '/>'
].join('\n')

const strictCode = [
  '<YTree',
  '  v-model:checked-keys="strictCheckedKeys"',
  '  :nodes="nodes"',
  '  checkable',
  '  check-strictly',
  '  aria-label="Strict tree"',
  '/>'
].join('\n')

const customNodeCode = [
  "<YTree :nodes=\"nodes\" :default-expanded-keys=\"['core']\" aria-label=\"Custom node tree\">",
  '  <template #node="{ node, flatNode }">',
  '    <YTag v-if="flatNode.hasChildren" tone="info">',
  "      {{ flatNode.expanded ? 'open' : 'closed' }}",
  '    </YTag>',
  '    <span>{{ node.label }}</span>',
  '  </template>',
  '</YTree>'
].join('\n')

const draggableCode = [
  '<YTree :nodes="nodes" draggable aria-label="Draggable tree" @drop="handleDrop" />'
].join('\n')

const virtualizedCode = [
  '<YTree',
  '  :nodes="largeNodes"',
  '  virtualized',
  '  :virtual-height="240"',
  '  :virtual-item-height="36"',
  '  :virtual-overscan="3"',
  '  aria-label="Large component tree"',
  '/>'
].join('\n')

const lazyCode = [
  '<YButton size="small" @click="reloadRemoteCore">Reload remote-core</YButton>',
  '<YTree',
  '  ref="treeRef"',
  '  :nodes="lazyNodes"',
  '  lazy',
  '  :load="loadRemoteNode"',
  '  aria-label="Async package tree"',
  '  @load="handleLoad"',
  '  @load-error="handleLoadError"',
  '/>'
].join('\n')

function handleDrop(payload: YTreeDropPayload) {
  lastDrop.value = `${payload.draggingKey} ${payload.type} ${payload.dropKey}`
}

function handleCheck(payload: YTreeCheckPayload) {
  lastCheck.value = `Checked: ${payload.checkedKeys.join(', ') || 'none'}`
}

function handleSelect(payload: YTreeSelectPayload) {
  lastSelect.value = `Selected: ${payload.key}`
}

async function loadRemoteNode(node: YTreeNode) {
  await new Promise((resolve) => setTimeout(resolve, 320))
  const version = (loadVersions.get(node.key) ?? 0) + 1
  loadVersions.set(node.key, version)

  if (node.key === 'remote-core') {
    return [
      { key: `remote-core-button-${version}`, label: `Button from API v${version}`, isLeaf: true },
      { key: `remote-core-tree-${version}`, label: `Tree from API v${version}`, isLeaf: true }
    ]
  }

  return [
    { key: `${node.key}-workflow`, label: 'Workflow loaded remotely', isLeaf: true }
  ]
}

function handleLoad(payload: YTreeLoadPayload) {
  lastLoad.value = `${payload.key}: ${payload.children.length} children loaded`
}

function handleLoadError(payload: YTreeLoadErrorPayload) {
  lastLoad.value = `${payload.key}: load failed`
}

async function reloadRemoteCore() {
  const refreshed = await treeRef.value?.reloadNode('remote-core')
  lastLoad.value = refreshed ? 'remote-core refreshed' : 'remote-core is not ready to refresh'
}
</script>

# Tree

Tree 用于展示层级数据，例如组件分类、权限结构、文件目录、资源分组和后台配置树。

当前版本支持单选、展开折叠、禁用节点、受控展开状态、级联勾选、节点插槽、拖拽事件、异步加载、虚拟滚动和键盘导航。内置重排工具会作为后续增强。

::: tip TIP
`YTree` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Basic tree {#tree-basic-tree}

<DocDemo
  title="Basic tree"
  description="基础树支持受控选中和受控展开，适合组件目录、文件树和资源分组。"
  :code="basicCode"
  :setup="treeCodeSetup"
  :usage="['selectedKey', 'expandedKeys', 'nodes']"
>
  <YTree
    v-model:selected-key="selectedKey"
    v-model:expanded-keys="expandedKeys"
    :nodes="nodes"
    aria-label="Yok UI component tree"
    @select="handleSelect"
  />
  <p class="demo-note">{{ lastSelect }}</p>
</DocDemo>

## Checkable tree {#tree-checkable-tree}

<DocDemo
  title="Checkable tree"
  description="可勾选树默认父子级联，适合权限结构和资源授权；半选状态会通过 payload 暴露。"
  :code="checkableCode"
  :setup="treeCodeSetup"
  :usage="['checkable', 'checkedKeys', 'half checked']"
>
  <YTree
    v-model:checked-keys="checkedKeys"
    :nodes="nodes"
    checkable
    aria-label="Permission tree"
    @check="handleCheck"
  />
  <p class="demo-note">{{ lastCheck }}</p>
</DocDemo>

## Strict check {#tree-strict-check}

<DocDemo
  title="Strict check"
  description="checkStrictly 让父子节点独立勾选，适合不需要级联的标签树和配置树。"
  :code="strictCode"
  :setup="treeCodeSetup"
  :usage="['checkStrictly', 'independent selection', 'controlled']"
>
  <YTree
    v-model:checked-keys="strictCheckedKeys"
    :nodes="nodes"
    checkable
    check-strictly
    aria-label="Strict tree"
  />
</DocDemo>

## Custom node {#tree-custom-node}

<DocDemo
  title="Custom node"
  description="node 插槽可以补充状态标签或图标，但仍复用内置选择、展开、禁用和键盘逻辑。"
  :code="customNodeCode"
  :setup="treeCodeSetup"
  :usage="['node slot', 'flatNode', 'status tag']"
>
  <YTree :nodes="nodes" :default-expanded-keys="['core']" aria-label="Custom node tree">
    <template #node="{ node, flatNode }">
      <YTag v-if="flatNode.hasChildren" tone="info">
        {{ flatNode.expanded ? 'open' : 'closed' }}
      </YTag>
      <span>{{ node.label }}</span>
    </template>
  </YTree>
</DocDemo>

## Drag event {#tree-drag-event}

<DocDemo
  title="Drag event"
  description="draggable 会发出 drop 事件，但不会直接修改 nodes，业务层可以据此重排数据。"
  :code="draggableCode"
  :setup="treeCodeSetup"
  :usage="['draggable', 'drop', 'business controlled']"
>
  <YTree
    :nodes="nodes"
    draggable
    aria-label="Draggable tree"
    @drop="handleDrop"
  />
  <p class="demo-note">{{ lastDrop }}</p>
</DocDemo>

## Virtualized tree {#tree-virtualized-tree}

<DocDemo
  title="Virtualized tree"
  description="大型树可以开启 virtualized，只渲染视口附近节点，同时保留 tree/treeitem 语义和键盘导航。"
  :code="virtualizedCode"
  :setup="treeCodeSetup"
  :usage="['virtualized', 'virtualHeight', 'virtualItemHeight', 'large data']"
>
  <YTree
    :nodes="largeNodes"
    virtualized
    :virtual-height="240"
    :virtual-item-height="36"
    :virtual-overscan="3"
    aria-label="Large component tree"
  />
</DocDemo>

## Lazy loading {#tree-lazy-loading}

<DocDemo
  title="Lazy loading"
  description="lazy + load 可以按需请求远端节点；失败会触发 loadError，已加载节点也可以通过 reloadNode 定向刷新。"
  :code="lazyCode"
  :setup="treeCodeSetup"
  :usage="['lazy', 'load', 'reloadNode', 'loadError']"
>
  <YButton size="small" @click="reloadRemoteCore">Reload remote-core</YButton>
  <YTree
    ref="treeRef"
    :nodes="lazyNodes"
    lazy
    :load="loadRemoteNode"
    aria-label="Async package tree"
    @load="handleLoad"
    @load-error="handleLoadError"
  />
  <p class="demo-note">{{ lastLoad }}</p>
</DocDemo>

## Checkbox selection {#tree-checkbox-selection}

`checkable` 打开后，Tree 会显示节点勾选框。默认父子级联：勾选父节点会勾选可用子节点，部分子节点勾选时父节点进入半选状态。

`checkStrictly` 可以关闭级联，让父子节点独立勾选。受控场景使用 `v-model:checked-keys`。

## Drag and drop {#tree-drag-and-drop}

`draggable` 打开后，Tree 会发出 `drop` 事件，但不会直接修改 `nodes`。使用方可以根据 `draggingKey`、`dropKey` 和 `type` 更新自己的树数据。

`allowDrop` 可以限制放置位置，例如禁止放入某些系统节点或只允许同层排序。

## Usage notes {#tree-usage-notes}

- `nodes` 应保持稳定 key，避免展开、选中和勾选状态丢失。
- 受控模式使用 `selectedKey`、`expandedKeys`、`checkedKeys`；非受控初始值使用 `defaultExpandedKeys` 和 `defaultCheckedKeys`。
- 对于大型树，优先开启 `virtualized`，并让 `virtualItemHeight` 接近实际节点高度；远程目录或超深树再结合懒加载策略。
- `lazy` 模式下，未声明 `children` 且 `isLeaf !== true` 的节点会显示展开入口；远端确认叶子节点时应返回 `isLeaf: true`，避免继续显示展开按钮。
- 已加载的远程节点可以通过组件 ref 调用 `reloadNode(key)` 定向刷新，成功时替换该节点 children，失败时返回 `false` 并触发 `loadError`。

## Tree API {#tree-api}

<ComponentApiSection name="YTree" />

## Accessibility {#accessibility}

- 根容器使用 `role="tree"` 和可配置的 `aria-label`。
- 节点使用 `role="treeitem"`、`aria-level`、`aria-selected` 和 `aria-disabled`。
- 勾选框使用原生 button，提供 `aria-checked="true"`、`false` 或 `mixed`。
- 有子节点的项会暴露 `aria-expanded`。
- 拖拽使用原生 HTML Drag and Drop，键盘树导航保持原有 roving tabindex 行为。
- 树使用 roving tabindex，仅当前活动节点进入 Tab 顺序。
- 开启虚拟滚动时，根节点仍保留 `role="tree"`，可见项保留 `role="treeitem"`，并通过 `aria-setsize` / `aria-posinset` 描述完整集合位置。
- 异步加载时，加载中节点暴露 `aria-busy` 和 `role="status"`；加载失败时使用 `role="alert"` 提示。
