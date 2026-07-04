<script setup lang="ts">
import { ref } from 'vue'

const value = ref('button')
const parentValue = ref('core')
const multipleValue = ref(['button', 'select'])
const filterValue = ref('')

const nodes = [
  {
    key: 'core',
    label: 'Core',
    children: [
      { key: 'button', label: 'Button' },
      { key: 'select', label: 'Select' },
      { key: 'tree-select', label: 'Tree Select' }
    ]
  },
  {
    key: 'admin',
    label: 'Admin',
    children: [
      { key: 'users', label: 'Users' },
      { key: 'audit', label: 'Audit log', disabled: true }
    ]
  },
  {
    key: 'product',
    label: 'Product',
    children: [
      { key: 'command-palette', label: 'Command Palette' },
      { key: 'saved-views', label: 'Saved Views' }
    ]
  }
]

const setup = [
  "import { ref } from 'vue'",
  "import { YTreeSelect } from '@yok-ui/core'",
  '',
  "const value = ref('button')",
  "const parentValue = ref('core')",
  "const multipleValue = ref(['button', 'select'])",
  "const filterValue = ref('')",
  '',
  'const nodes = [',
  '  {',
  "    key: 'core',",
  "    label: 'Core',",
  '    children: [',
  "      { key: 'button', label: 'Button' },",
  "      { key: 'select', label: 'Select' },",
  "      { key: 'tree-select', label: 'Tree Select' }",
  '    ]',
  '  },',
  '  {',
  "    key: 'admin',",
  "    label: 'Admin',",
  '    children: [',
  "      { key: 'users', label: 'Users' },",
  "      { key: 'audit', label: 'Audit log', disabled: true }",
  '    ]',
  '  },',
  '  {',
  "    key: 'product',",
  "    label: 'Product',",
  '    children: [',
  "      { key: 'command-palette', label: 'Command Palette' },",
  "      { key: 'saved-views', label: 'Saved Views' }",
  '    ]',
  '  }',
  ']'
].join('\n')

const code = `<YTreeSelect v-model="value" label="Component" :nodes="nodes" :default-expanded-keys="['core']" />
<YTreeSelect v-model="parentValue" label="Any level" :nodes="nodes" check-strictly clearable />
<YTreeSelect v-model="multipleValue" label="Permission scope" :nodes="nodes" multiple clearable collapse-tags :max-collapse-tags="2" :default-expanded-keys="['core']" />
<YTreeSelect v-model="filterValue" label="Search component" :nodes="nodes" filterable search-placeholder="Search tree nodes" empty-text="No node matches" />`
</script>

# Tree Select

Tree Select 用于从树形结构中选择一个或多个节点。它适合组织架构、部门、资源目录、组件分类、权限范围等层级数据，比普通 Select 更能保留上下文，比完整 Tree 更适合放在表单里。

Yok UI 的 Tree Select 复用 `YTreeNode` 数据结构，并使用 Floating UI 处理弹层定位。默认只提交叶子节点；开启 `checkStrictly` 后可以选择任意层级。

## Example

<DocDemo
  title="Tree selector"
  description="覆盖叶子选择、任意层级、多选标签、过滤、禁用节点和空状态。"
  :code="code"
  :setup="setup"
  :usage="['combobox', 'tree popup', 'filterable', 'multiple', 'checkStrictly', 'clearable']"
>
  <div class="demo-stack">
    <YTreeSelect
      v-model="value"
      label="Component"
      :nodes="nodes"
      :default-expanded-keys="['core']"
    />
    <YTreeSelect
      v-model="parentValue"
      label="Any level"
      :nodes="nodes"
      check-strictly
      clearable
    />
    <YTreeSelect
      v-model="multipleValue"
      label="Permission scope"
      :nodes="nodes"
      multiple
      clearable
      collapse-tags
      :max-collapse-tags="2"
      :default-expanded-keys="['core']"
    />
    <YTreeSelect
      v-model="filterValue"
      label="Search component"
      :nodes="nodes"
      filterable
      search-placeholder="Search tree nodes"
      empty-text="No node matches"
    />
  </div>
  <p class="demo-note">Selected: {{ value }} · Parent: {{ parentValue }} · Multiple: {{ multipleValue.join(', ') || 'none' }}</p>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="treeSelect"
  title="在线编辑 Tree Select 示例"
  description="Tree Select 运行器覆盖叶子选择、任意层级、多选、过滤、禁用节点、空结果、移动端和键盘路径，可直接验证 combobox + tree 弹层语义。"
/>

## API

<ComponentApiSection name="YTreeSelect" />

## Accessibility

- 触发器使用 `role="combobox"`、`aria-haspopup="tree"`、`aria-expanded`、`aria-controls` 和 `aria-activedescendant`。
- 弹层内使用 `role="tree"`，节点使用 `role="treeitem"`、`aria-level`、`aria-expanded`、`aria-selected` 和 `aria-disabled`。
- 默认模式下，带子节点的项用于展开折叠，不会提交为值；开启 `checkStrictly` 后任意层级都可以选择。
- 可搜索模式提供 `role="searchbox"`，并通过 `aria-controls` 关联 tree。
- 支持 Enter / Space 打开，方向键移动节点，ArrowRight 展开分支，ArrowLeft 折叠分支，Enter / Space 选择节点，Escape 关闭并返回触发器。
- 多选时 tree 暴露 `aria-multiselectable="true"`，触发器内以标签展示选中节点。
- 禁用节点保持可见上下文，但不会通过鼠标或键盘提交。
- 错误状态通过 `aria-invalid` 暴露，可通过 `ariaDescribedby` 与外部错误信息关联。
