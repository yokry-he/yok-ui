<script setup lang="ts">
import { ref } from 'vue'
import type {
  YCascaderLoadPayload,
  YCascaderMultipleValue,
  YCascaderOption,
  YCascaderValue
} from '@yok-ui/core'

const componentPath = ref<YCascaderValue>(['core', 'form', 'cascader'])
const accessScopes = ref<YCascaderMultipleValue>([
  ['core', 'form', 'cascader'],
  ['admin', 'data', 'data-table']
])
const remotePath = ref<YCascaderValue>([])
const loadState = ref('选择远程包节点后加载子级')

const panelOptions: YCascaderOption[] = [
  {
    value: 'core',
    label: 'Core',
    children: [
      {
        value: 'form',
        label: 'Form',
        children: [
          { value: 'cascader', label: 'Cascader' },
          { value: 'select', label: 'Select' }
        ]
      },
      {
        value: 'feedback',
        label: 'Feedback',
        children: [
          { value: 'tooltip', label: 'Tooltip' },
          { value: 'message', label: 'Message' }
        ]
      }
    ]
  },
  {
    value: 'admin',
    label: 'Admin',
    children: [
      {
        value: 'data',
        label: 'Data',
        children: [
          { value: 'data-table', label: 'Data Table' },
          { value: 'resource-page', label: 'Resource Page' }
        ]
      }
    ]
  }
]

const remoteOptions: YCascaderOption[] = [
  { value: 'core', label: 'Core package' },
  { value: 'product', label: 'Product package' },
  { value: 'archived', label: 'Archived package', isLeaf: true }
]

const remoteChildrenByPath: Record<string, YCascaderOption[]> = {
  core: [
    { value: 'form', label: 'Form controls' },
    { value: 'feedback', label: 'Feedback' }
  ],
  'core.form': [
    { value: 'cascader-panel', label: 'Cascader Panel', isLeaf: true },
    { value: 'tree-select', label: 'Tree Select', isLeaf: true }
  ],
  'core.feedback': [
    { value: 'tooltip', label: 'Tooltip', isLeaf: true },
    { value: 'popover', label: 'Popover', isLeaf: true }
  ],
  product: [
    { value: 'command-palette', label: 'Command Palette', isLeaf: true },
    { value: 'theme-switcher', label: 'Theme Switcher', isLeaf: true }
  ]
}

const cascaderPanelCodeSetup = [
  "import { ref } from 'vue'",
  "import { YCascaderPanel, YTag, type YCascaderLoadChildren, type YCascaderMultipleValue, type YCascaderOption, type YCascaderValue } from '@yok-ui/core'",
  '',
  "const componentPath = ref<YCascaderValue>(['core', 'form', 'cascader'])",
  'const accessScopes = ref<YCascaderMultipleValue>([',
  "  ['core', 'form', 'cascader'],",
  "  ['admin', 'data', 'data-table']",
  '])',
  'const remotePath = ref<YCascaderValue>([])',
  '',
  `const panelOptions: YCascaderOption[] = ${JSON.stringify(panelOptions, null, 2)}`,
  '',
  `const remoteOptions: YCascaderOption[] = ${JSON.stringify(remoteOptions, null, 2)}`,
  '',
  `const remoteChildrenByPath: Record<string, YCascaderOption[]> = ${JSON.stringify(remoteChildrenByPath, null, 2)}`,
  '',
  'const loadRemoteOptions: YCascaderLoadChildren = (_option, path) => {',
  "  const pathKey = path.map((item) => item.value).join('.')",
  '  return Promise.resolve(remoteChildrenByPath[pathKey] ?? [])',
  '}'
].join('\n')

const basicCode = [
  '<YCascaderPanel',
  '  v-model="componentPath"',
  '  :options="panelOptions"',
  '  aria-label="Component taxonomy panel"',
  '/>'
].join('\n')

const multipleCode = [
  '<YCascaderPanel',
  '  v-model="accessScopes"',
  '  :options="panelOptions"',
  '  multiple',
  '  aria-label="Access scope panel"',
  '/>'
].join('\n')

const lazyCode = [
  '<YCascaderPanel',
  '  v-model="remotePath"',
  '  :options="remoteOptions"',
  '  lazy',
  '  :load="loadRemoteOptions"',
  '  aria-label="Remote package panel"',
  '  @load="handlePanelLoad"',
  '/>'
].join('\n')

function loadRemoteOptions(_option: YCascaderOption, path: YCascaderOption[]) {
  const pathKey = path.map((item) => item.value).join('.')

  return new Promise<YCascaderOption[]>((resolve) => {
    window.setTimeout(() => {
      resolve(remoteChildrenByPath[pathKey] ?? [])
    }, 360)
  })
}

function handlePanelLoad(payload: YCascaderLoadPayload) {
  loadState.value = `${payload.path.map((item) => item.label).join(' / ')} loaded ${payload.children.length} children`
}
</script>

# Cascader Panel

Cascader Panel 是常驻级联选择面板，适合放进抽屉、配置页、权限矩阵和复杂表单步骤中。它参考 Element Plus CascaderPanel 的使用方式：当层级选择不需要输入框触发器和浮层时，直接把面板嵌入页面。

它和 `YCascader` 共享 `YCascaderOption`、单选路径值、多选路径值、懒加载函数和选择事件载荷；区别是 Panel 不负责浮层定位和输入框展示。

## Example

<DocDemo
  title="Embedded taxonomy"
  description="常驻面板适合在配置页中直接浏览组件分类，不需要先打开弹层。"
  :code="basicCode"
  :setup="cascaderPanelCodeSetup"
  :usage="['embedded panel', 'single path', 'shared cascader options']"
>
  <YCascaderPanel
    v-model="componentPath"
    :options="panelOptions"
    aria-label="Component taxonomy panel"
  />
</DocDemo>

<DocDemo
  title="Multiple scopes"
  description="多选路径适合权限范围、资源分类和组织空间配置。"
  :code="multipleCode"
  :setup="cascaderPanelCodeSetup"
  :usage="['multiple paths', 'permission scope', 'summary']"
>
  <YCascaderPanel
    v-model="accessScopes"
    :options="panelOptions"
    multiple
    aria-label="Access scope panel"
  />
</DocDemo>

<DocDemo
  title="Lazy panel"
  description="懒加载面板适合远程资源树，节点展开后再加载子级。"
  :code="lazyCode"
  :setup="cascaderPanelCodeSetup"
  :usage="['lazy', 'load event', 'remote hierarchy']"
>
  <div class="demo-stack">
    <YCascaderPanel
      v-model="remotePath"
      :options="remoteOptions"
      lazy
      :load="loadRemoteOptions"
      aria-label="Remote package panel"
      @load="handlePanelLoad"
    />
    <YTag tone="info">{{ loadState }}</YTag>
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="cascaderPanel"
  title="在线编辑 Cascader Panel 示例"
/>

## API

<ComponentApiSection name="YCascaderPanel" />

## Accessibility

- 根节点使用 `role="group"` 和 `aria-label` 表达常驻级联面板语义。
- 每一列使用 `role="listbox"`，选项使用 `role="option"`；多选时列会声明 `aria-multiselectable`。
- 方向键在列内和列间移动，`Enter` / `Space` 选择当前叶子节点。
- 懒加载节点使用 `aria-busy`、`role="status"` 和 `role="alert"` 表达加载与失败状态。
