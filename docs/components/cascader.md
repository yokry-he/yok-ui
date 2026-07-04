<script setup lang="ts">
import { ref } from 'vue'
import type {
  YCascaderMultipleSelectPayload,
  YCascaderMultipleValue,
  YCascaderSelectPayload,
  YCascaderValue
} from '@yok-ui/core'

const region = ref<YCascaderValue>(['asia', 'china', 'shanghai'])
const category = ref<YCascaderValue>([])
const disabledPath = ref<YCascaderValue>([])
const customPath = ref<YCascaderValue>(['core', 'form', 'cascader'])
const accessScopes = ref<YCascaderMultipleValue>([
  ['core', 'form', 'date-picker'],
  ['core', 'form', 'cascader']
])
const cascaderState = ref('等待选择组件路径')
const accessState = ref('已选择 2 条权限路径')

const options = [
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'china',
        label: 'China',
        children: [
          { value: 'shanghai', label: 'Shanghai' },
          { value: 'beijing', label: 'Beijing' }
        ]
      },
      {
        value: 'japan',
        label: 'Japan',
        children: [
          { value: 'tokyo', label: 'Tokyo' }
        ]
      }
    ]
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'france',
        label: 'France',
        children: [
          { value: 'paris', label: 'Paris' }
        ]
      }
    ]
  }
]

const categoryOptions = [
  {
    value: 'core',
    label: 'Core',
    children: [
      {
        value: 'form',
        label: 'Form',
        children: [
          { value: 'date-picker', label: 'Date Picker' },
          { value: 'cascader', label: 'Cascader' }
        ]
      },
      {
        value: 'feedback',
        label: 'Feedback',
        children: [
          { value: 'tooltip', label: 'Tooltip' },
          { value: 'popover', label: 'Popover' }
        ]
      }
    ]
  },
  {
    value: 'admin',
    label: 'Admin',
    disabled: true,
    children: [
      {
        value: 'data',
        label: 'Data',
        children: [
          { value: 'toolbar', label: 'Toolbar' }
        ]
      }
    ]
  }
]

const cascaderCodeSetup = [
  "import { ref } from 'vue'",
  "import { YCascader, YTag, type YCascaderMultipleValue, type YCascaderValue } from '@yok-ui/core'",
  '',
  "const region = ref<YCascaderValue>(['asia', 'china', 'shanghai'])",
  'const disabledPath = ref<YCascaderValue>([])',
  "const customPath = ref<YCascaderValue>(['core', 'form', 'cascader'])",
  'const accessScopes = ref<YCascaderMultipleValue>([',
  "  ['core', 'form', 'date-picker'],",
  "  ['core', 'form', 'cascader']",
  '])',
  '',
  `const options = ${JSON.stringify(options, null, 2)}`,
  '',
  `const categoryOptions = ${JSON.stringify(categoryOptions, null, 2)}`
].join('\n')

const basicCode = [
  '<YCascader v-model="region" :options="options" label="Region" />'
].join('\n')

const disabledCode = [
  '<YCascader',
  '  v-model="disabledPath"',
  '  :options="categoryOptions"',
  '  label="Component category"',
  '  placeholder="Choose category"',
  '/>'
].join('\n')

const multipleCode = [
  '<YCascader v-model="accessScopes" :options="categoryOptions" label="Scopes" multiple />'
].join('\n')

const customSlotCode = [
  '<YCascader v-model="customPath" :options="categoryOptions" label="Component path">',
  '  <template #option="{ option, level }">',
  '    <YTag tone="info">L{{ level + 1 }}</YTag>',
  '    <span>{{ option.label }}</span>',
  '  </template>',
  '</YCascader>'
].join('\n')

function handleCategoryChange(payload: YCascaderSelectPayload) {
  cascaderState.value = payload.labels.join(' / ')
}

function handleAccessChange(payload: YCascaderMultipleSelectPayload) {
  accessState.value = `已选择 ${payload.value.length} 条权限路径`
}
</script>

# Cascader

Cascader 用于选择层级路径，例如地区、分类、组织结构、权限范围和资源目录。

当前版本支持单选路径和多选叶子路径：单选使用 `string[]`，多选使用 `string[][]`，只在叶子节点提交或切换选择。组件的浮层定位、翻转和视口避让统一由 `@floating-ui/vue` 承担，和 Select、Tooltip、Popover 等弹层组件保持同一套行为基础。

## Example

<DocDemo
  title="Basic path"
  description="基础路径选择适合地区、组织层级和资源目录。选中后会提交完整路径值。"
  :code="basicCode"
  :setup="cascaderCodeSetup"
  :usage="['single path', 'v-model', 'Floating UI']"
>
  <YCascader v-model="region" :options="options" label="Region" />
  <p class="demo-note">Selected: {{ region.join(' / ') }}</p>
</DocDemo>

<DocDemo
  title="Disabled branch"
  description="禁用分支适合未开放权限、灰度功能或不可选分类；用户仍能理解路径结构，但不能选中该分支。"
  :code="disabledCode"
  :setup="cascaderCodeSetup"
  :usage="['disabled option', 'change payload', 'placeholder']"
>
  <YCascader
    v-model="disabledPath"
    :options="categoryOptions"
    label="Component category"
    placeholder="Choose category"
    @change="handleCategoryChange"
  />
  <p class="demo-note">{{ cascaderState }}</p>
</DocDemo>

<DocDemo
  title="Multiple leaf paths"
  description="多选模式只切换叶子节点，避免中间节点产生含混权限值，适合权限范围和资源授权。"
  :code="multipleCode"
  :setup="cascaderCodeSetup"
  :usage="['multiple', 'leaf selection', 'string[][]']"
>
  <YCascader
    v-model="accessScopes"
    :options="categoryOptions"
    label="Scopes"
    multiple
    @change="handleAccessChange"
  />
  <p class="demo-note">{{ accessState }}</p>
</DocDemo>

<DocDemo
  title="Custom option slot"
  description="通过 option 插槽补充层级标记、图标或状态标签，但仍复用组件内置的键盘、选中和禁用逻辑。"
  :code="customSlotCode"
  :setup="cascaderCodeSetup"
  :usage="['option slot', 'level', 'option']"
>
  <YCascader v-model="customPath" :options="categoryOptions" label="Component path">
    <template #option="{ option, level }">
      <span class="demo-inline">
        <YTag tone="info">L{{ level + 1 }}</YTag>
        <span>{{ option.label }}</span>
      </span>
    </template>
  </YCascader>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="cascader"
  title="在线编辑 Cascader 示例"
  description="运行器内置层级选项，可切换单路径、多选权限、禁用错误、移动级联和键盘级联，快速验证真实文档场景。"
/>

## Usage notes

- 单选 Cascader 适合用户需要明确到一条末级路径的场景，例如地区、分类、组织和资源目录。
- 多选 Cascader 适合权限授权、资源范围和批量分类，当前实现只允许切换叶子节点，便于后端保存稳定路径值。
- `size` 未显式传入时会读取 `YConfigProvider`，适合和 Select、Date Picker、Color Picker 保持同一筛选表单密度。
- Live example 覆盖移动级联和键盘级联场景，文档变更时应同时验证窄屏触发器可读性、`Enter` / `Space` 打开面板、方向键跨层级移动和 `Escape` 关闭。
- 禁用错误回填场景用于审核流：既要保留当前路径可读，也要把错误文案和不可编辑状态同时呈现给用户。
- 如果同一页面同时存在 Select、Tooltip、Popover、Cascader 等弹层，它们会共享浮层基础设施和 z-index 栈，避免遮挡顺序失控。
- 复杂远程数据、搜索和懒加载会作为后续增强进入 Cascader 的高级能力，而不是混入基础示例。

## API

<ComponentApiSection name="YCascader" />

## Accessibility

- 输入框使用原生 `input`，设置 `aria-expanded`、`aria-controls` 和 `aria-haspopup="dialog"`。
- 面板使用 `role="dialog"`。
- 每一列使用 `role="listbox"`；multiple 时同步设置 `aria-multiselectable`。
- 选项使用 `role="option"` 和 `aria-selected`，多选叶子项提供可视化勾选状态。
- 禁用项同步设置 `disabled` 和 `aria-disabled`。
