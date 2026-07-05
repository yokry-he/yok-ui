<script setup lang="ts">
import { ref } from 'vue'
import type { YTreeCheckPayload, YTreeExpose, YTreeLoadPayload, YTreeNode, YTreeSelectPayload } from '@yok-ui/core'

const selectedKey = ref('node-4')
const checkedKeys = ref(['node-2'])
const treeRef = ref<YTreeExpose>()
const lastSelect = ref('Selected: node-4')
const lastCheck = ref('Checked: node-2')
const lastLoad = ref('Expand remote-core to load children.')
const loadVersions = new Map<string, number>()

const largeNodes: YTreeNode[] = Array.from({ length: 300 }, (_, index) => ({
  key: `node-${index + 1}`,
  label: `Component node ${index + 1}`
}))

const lazyNodes: YTreeNode[] = [
  { key: 'remote-core', label: 'Remote core package' },
  { key: 'remote-admin', label: 'Remote admin package' }
]

const setup = [
  "import { ref } from 'vue'",
  "import { YButton, YTag, YVirtualTree, type YTreeCheckPayload, type YTreeExpose, type YTreeLoadPayload, type YTreeNode, type YTreeSelectPayload } from '@yok-ui/core'",
  '',
  "const selectedKey = ref('node-4')",
  "const checkedKeys = ref(['node-2'])",
  'const treeRef = ref<YTreeExpose>()',
  "const lastSelect = ref('Selected: node-4')",
  "const lastCheck = ref('Checked: node-2')",
  "const lastLoad = ref('Expand remote-core to load children.')",
  'const loadVersions = new Map<string, number>()',
  'const largeNodes: YTreeNode[] = Array.from({ length: 300 }, (_, index) => ({',
  '  key: `node-${index + 1}`,',
  '  label: `Component node ${index + 1}`',
  '}))',
  "const lazyNodes: YTreeNode[] = [",
  "  { key: 'remote-core', label: 'Remote core package' },",
  "  { key: 'remote-admin', label: 'Remote admin package' }",
  ']',
  '',
  'function handleSelect(payload: YTreeSelectPayload) {',
  '  lastSelect.value = `Selected: ${payload.key}`',
  '}',
  '',
  'function handleCheck(payload: YTreeCheckPayload) {',
  "  lastCheck.value = `Checked: ${payload.checkedKeys.join(', ') || 'none'}`",
  '}',
  '',
  'async function loadRemoteNode(node: YTreeNode) {',
  '  await new Promise((resolve) => setTimeout(resolve, 240))',
  '  const version = (loadVersions.get(node.key) ?? 0) + 1',
  '  loadVersions.set(node.key, version)',
  '  return [',
  "    { key: `${node.key}-workflow-${version}`, label: `Workflow v${version}`, isLeaf: true },",
  "    { key: `${node.key}-settings-${version}`, label: `Settings v${version}`, isLeaf: true }",
  '  ]',
  '}',
  '',
  'function handleLoad(payload: YTreeLoadPayload) {',
  '  lastLoad.value = `${payload.key}: ${payload.children.length} children loaded`',
  '}',
  '',
  'async function reloadRemoteCore() {',
  "  const refreshed = await treeRef.value?.reloadNode('remote-core')",
  "  lastLoad.value = refreshed ? 'remote-core refreshed' : 'remote-core is not ready to refresh'",
  '}'
].join('\n')

const basicCode = [
  '<YVirtualTree',
  '  v-model:selected-key="selectedKey"',
  '  :nodes="largeNodes"',
  '  :height="260"',
  '  :item-height="36"',
  '  :overscan="4"',
  '  aria-label="Large component taxonomy"',
  '  @select="handleSelect"',
  '/>'
].join('\n')

const checkableCode = [
  '<YVirtualTree',
  '  v-model:checked-keys="checkedKeys"',
  '  :nodes="largeNodes"',
  '  checkable',
  '  :height="260"',
  '  :item-height="36"',
  '  aria-label="Large permission tree"',
  '  @check="handleCheck"',
  '/>'
].join('\n')

const lazyCode = [
  '<YButton size="small" @click="reloadRemoteCore">Reload remote-core</YButton>',
  '<YVirtualTree',
  '  ref="treeRef"',
  '  :nodes="lazyNodes"',
  '  lazy',
  '  :load="loadRemoteNode"',
  '  :height="220"',
  '  aria-label="Async virtual package tree"',
  '  @load="handleLoad"',
  '/>'
].join('\n')

function handleSelect(payload: YTreeSelectPayload) {
  lastSelect.value = `Selected: ${payload.key}`
}

function handleCheck(payload: YTreeCheckPayload) {
  lastCheck.value = `Checked: ${payload.checkedKeys.join(', ') || 'none'}`
}

async function loadRemoteNode(node: YTreeNode) {
  await new Promise((resolve) => setTimeout(resolve, 240))
  const version = (loadVersions.get(node.key) ?? 0) + 1
  loadVersions.set(node.key, version)

  return [
    { key: `${node.key}-workflow-${version}`, label: `Workflow v${version}`, isLeaf: true },
    { key: `${node.key}-settings-${version}`, label: `Settings v${version}`, isLeaf: true }
  ]
}

function handleLoad(payload: YTreeLoadPayload) {
  lastLoad.value = `${payload.key}: ${payload.children.length} children loaded`
}

async function reloadRemoteCore() {
  const refreshed = await treeRef.value?.reloadNode('remote-core')
  lastLoad.value = refreshed ? 'remote-core refreshed' : 'remote-core is not ready to refresh'
}
</script>

# Virtual Tree

Virtual Tree 是面向大量节点的 Core 组件入口。它复用 `YTree` 的语义、选择、勾选、懒加载和键盘行为，但默认开启固定行高虚拟滚动，适合资源目录、权限树、组件分类和远程节点浏览。

Element Plus 将 Tree V2 作为独立大数据树组件；Yok UI 也提供独立 `YVirtualTree`，让用户不必记住 `YTree virtualized`、`virtualHeight`、`virtualItemHeight` 和 `virtualOverscan` 的组合参数。

## Example

<DocDemo
  title="Large taxonomy"
  description="固定高度虚拟窗口只渲染视口附近节点，同时保留 tree/treeitem 语义和 aria-posinset。"
  :code="basicCode"
  :setup="setup"
  :usage="['large data', 'height', 'itemHeight', 'overscan']"
>
  <YVirtualTree
    v-model:selected-key="selectedKey"
    :nodes="largeNodes"
    :height="260"
    :item-height="36"
    :overscan="4"
    aria-label="Large component taxonomy"
    @select="handleSelect"
  />
  <p class="demo-note">{{ lastSelect }}</p>
</DocDemo>

<DocDemo
  title="Checkable virtual tree"
  description="大量权限节点也可以保留勾选状态和键盘路径，适合后台授权和资源范围选择。"
  :code="checkableCode"
  :setup="setup"
  :usage="['checkable', 'checkedKeys', 'virtual window']"
>
  <YVirtualTree
    v-model:checked-keys="checkedKeys"
    :nodes="largeNodes"
    checkable
    :height="260"
    :item-height="36"
    aria-label="Large permission tree"
    @check="handleCheck"
  />
  <p class="demo-note">{{ lastCheck }}</p>
</DocDemo>

<DocDemo
  title="Lazy virtual tree"
  description="异步节点和 reloadNode 可以继续使用，适合远程资源树和按需加载目录。"
  :code="lazyCode"
  :setup="setup"
  :usage="['lazy', 'load', 'reloadNode']"
>
  <div class="demo-stack">
    <YButton size="small" @click="reloadRemoteCore">Reload remote-core</YButton>
    <YVirtualTree
      ref="treeRef"
      :nodes="lazyNodes"
      lazy
      :load="loadRemoteNode"
      :height="220"
      aria-label="Async virtual package tree"
      @load="handleLoad"
    />
    <YTag tone="info">{{ lastLoad }}</YTag>
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="virtualTree"
  title="在线编辑 Virtual Tree 示例"
  description="调试大数据树、勾选、懒加载、空态、移动视口和键盘路径。"
/>

## API

<ComponentApiSection name="YVirtualTree" />

## Accessibility

- Virtual Tree 继续使用 `role="tree"` / `role="treeitem"`、`aria-level`、`aria-posinset` 和 `aria-setsize`。
- `height` 应给出明确数值，避免虚拟窗口无法计算可见节点数量。
- `itemHeight` 必须接近真实节点高度；如果节点插槽内容很高，应同步调大该值。
- 键盘路径继承 Tree：方向键移动，Home / End 跳转首尾，Enter / Space 选择节点。
- 懒加载节点需要保留清晰的 loading 文案和失败重试路径；远程错误不应让节点永久失效。
- 空态应提供 `emptyText` 或 `empty` 插槽，说明当前筛选或权限为什么没有节点。
