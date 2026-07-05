<script setup lang="ts">
import { ref } from 'vue'

const selectedPackage = ref('pkg-42')
const searchablePackage = ref('')
const multiplePackages = ref(['pkg-1', 'pkg-18', 'pkg-42'])
const lockedPackage = ref('pkg-8')

const largeOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: `Package ${index + 1}`,
  value: `pkg-${index + 1}`
}))

const virtualizedSelectSetup = [
  "import { ref } from 'vue'",
  "import { YVirtualizedSelect } from '@yok-ui/core'",
  '',
  "const selectedPackage = ref('pkg-42')",
  "const searchablePackage = ref('')",
  "const multiplePackages = ref(['pkg-1', 'pkg-18', 'pkg-42'])",
  "const lockedPackage = ref('pkg-8')",
  'const largeOptions = Array.from({ length: 1000 }, (_, index) => ({',
  '  label: `Package ${index + 1}`,',
  '  value: `pkg-${index + 1}`',
  '}))'
].join('\n')

const basicCode = [
  '<YVirtualizedSelect',
  '  v-model="selectedPackage"',
  '  label="Package"',
  '  :options="largeOptions"',
  '  :height="240"',
  '  :item-height="36"',
  '/>'
].join('\n')

const filterableCode = [
  '<YVirtualizedSelect',
  '  v-model="searchablePackage"',
  '  label="Search package"',
  '  filterable',
  '  search-placeholder="Search packages"',
  '  empty-text="No package matches"',
  '  :options="largeOptions"',
  '/>'
].join('\n')

const multipleCode = [
  '<YVirtualizedSelect',
  '  v-model="multiplePackages"',
  '  label="Packages"',
  '  multiple',
  '  collapse-tags',
  '  clearable',
  '  :max-collapse-tags="2"',
  '  :options="largeOptions"',
  '/>'
].join('\n')

const disabledCode = [
  '<YVirtualizedSelect',
  '  v-model="lockedPackage"',
  '  label="Locked package"',
  '  disabled',
  '  :options="largeOptions"',
  '/>'
].join('\n')
</script>

# Virtualized Select

Virtualized Select 面向千级以上选项选择场景。它默认启用虚拟滚动，避免一次性渲染所有 option，同时保留 `YSelect` 的 combobox、listbox、键盘和表单校验语义。

它参考 Element Plus Select V2 的定位：当选项数量很大时，给开发者一个明确的虚拟化组件，而不是要求在普通 Select 上记住一组虚拟滚动参数。

## Examples

<DocDemo
  title="Large option set"
  description="默认只渲染当前视口附近的选项，但 aria-setsize 仍暴露完整选项数量。"
  :code="basicCode"
  :setup="virtualizedSelectSetup"
  :usage="['1000 options', 'virtualized', 'combobox']"
>
  <YVirtualizedSelect
    v-model="selectedPackage"
    label="Package"
    :options="largeOptions"
    :height="240"
    :item-height="36"
  />
  <p class="demo-note">Selected: {{ selectedPackage }}</p>
</DocDemo>

<DocDemo
  title="Filterable"
  description="搜索框仍由 listbox 内部管理，适合包名、用户、地区、资源等大列表快速定位。"
  :code="filterableCode"
  :setup="virtualizedSelectSetup"
  :usage="['filterable', 'search event', 'empty state']"
>
  <YVirtualizedSelect
    v-model="searchablePackage"
    label="Search package"
    filterable
    search-placeholder="Search packages"
    empty-text="No package matches"
    :options="largeOptions"
  />
  <p class="demo-note">Search selection: {{ searchablePackage || 'none' }}</p>
</DocDemo>

<DocDemo
  title="Multiple"
  description="多选场景建议开启 collapseTags，避免大量已选项撑开触发器。"
  :code="multipleCode"
  :setup="virtualizedSelectSetup"
  :usage="['multiple', 'collapseTags', 'clearable']"
>
  <YVirtualizedSelect
    v-model="multiplePackages"
    label="Packages"
    multiple
    collapse-tags
    clearable
    :max-collapse-tags="2"
    :options="largeOptions"
  />
  <p class="demo-note">Selected count: {{ multiplePackages.length }}</p>
</DocDemo>

<DocDemo
  title="Disabled"
  description="禁用状态仍保留当前值展示，但不会打开 listbox。"
  :code="disabledCode"
  :setup="virtualizedSelectSetup"
  :usage="['disabled', 'read-only workflow']"
>
  <YVirtualizedSelect
    v-model="lockedPackage"
    label="Locked package"
    disabled
    :options="largeOptions"
  />
</DocDemo>

## Live example

<LiveExampleRunner
  preset="virtualizedSelect"
  title="在线编辑 Virtualized Select 示例"
  description="切换海量选项、搜索、多选、禁用、移动端和键盘场景，验证虚拟化选择器。"
/>

## Usage notes

- 普通几十个选项继续使用 `YSelect`；千级以上选项或远程大列表使用 `YVirtualizedSelect`。
- `height`、`itemHeight` 和 `overscan` 会映射到底层虚拟 listbox。`itemHeight` 应与真实选项高度一致，否则滚动位置会不准确。
- 当前版本复用 `YSelect` 的过滤逻辑，适合本地大列表。远程搜索可监听 `search` 事件并结合 `loading` / `loadingText`。
- 选项分组和 allow-create 属于普通 `YSelect` 的能力；虚拟化场景优先保持扁平列表，保证滚动计算稳定。
- 多选时建议同时开启 `collapseTags`，避免触发器被大量已选标签撑开。

## API

<ComponentApiSection name="YVirtualizedSelect" />

## Accessibility

- 触发器沿用 `YSelect` 的 `role="combobox"`、`aria-expanded`、`aria-controls` 和 `aria-activedescendant`。
- 弹层使用 `role="listbox"`，选项使用 `role="option"`。
- 虚拟化 listbox 使用 `aria-setsize` 暴露完整选项数量，选项使用 `aria-posinset` 暴露在完整列表中的位置。
- 过滤、加载、空状态和错误状态沿用 `YSelect` 的 searchbox、status 和 alert 语义。
