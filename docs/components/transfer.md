<script setup lang="ts">
import { ref } from 'vue'
import type { YTransferChangePayload, YTransferCheckPayload } from '@yok-ui/core'

const selectedPermissions = ref(['docs'])
const selectedMembers = ref(['mira'])
const selectedFiltered = ref(['theme'])
const transferState = ref('等待移动权限')
const checkState = ref('等待勾选成员')

const permissionOptions = [
  { value: 'docs', label: 'Docs editor', description: 'Create and update documentation' },
  { value: 'release', label: 'Release manager', description: 'Publish packages and notes' },
  { value: 'theme', label: 'Theme designer', description: 'Edit tokens and palettes' },
  { value: 'owner', label: 'Owner controls', description: 'Protected role', disabled: true }
]

const memberOptions = [
  { value: 'mira', label: 'Mira', description: 'Design system lead' },
  { value: 'yok', label: 'Yok', description: 'Frontend maintainer' },
  { value: 'nina', label: 'Nina', description: 'Docs writer' },
  { value: 'ops', label: 'Ops group', description: 'Managed outside Yok UI', disabled: true }
]

const transferCodeSetup = [
  "import { ref } from 'vue'",
  "import { YTransfer, type YTransferChangePayload, type YTransferCheckPayload } from '@yok-ui/core'",
  '',
  "const selectedPermissions = ref(['docs'])",
  "const selectedMembers = ref(['mira'])",
  "const selectedFiltered = ref(['theme'])",
  "const transferState = ref('等待移动权限')",
  "const checkState = ref('等待勾选成员')",
  '',
  `const permissionOptions = ${JSON.stringify(permissionOptions, null, 2)}`,
  '',
  `const memberOptions = ${JSON.stringify(memberOptions, null, 2)}`,
  '',
  'function handlePermissionChange(payload: YTransferChangePayload) {',
  "  transferState.value = `${payload.direction === 'right' ? 'Added' : 'Removed'}: ${payload.movedKeys.join(', ') || 'none'}`",
  '}',
  '',
  'function handleMemberCheck(payload: YTransferCheckPayload) {',
  "  checkState.value = `${payload.direction} checked: ${payload.checkedKeys.join(', ') || 'none'}`",
  '}'
].join('\n')

const basicCode = [
  '<YTransfer',
  '  v-model="selectedPermissions"',
  '  :options="permissionOptions"',
  "  :titles=\"['Available', 'Selected']\"",
  '  aria-label="Permission transfer"',
  '  @change="handlePermissionChange"',
  '/>'
].join('\n')

const filterableCode = [
  '<YTransfer',
  '  v-model="selectedFiltered"',
  '  :options="permissionOptions"',
  "  :titles=\"['Available', 'Selected']\"",
  '  filterable',
  '  aria-label="Filterable permission transfer"',
  '/>'
].join('\n')

const eventsCode = [
  '<YTransfer',
  '  v-model="selectedMembers"',
  '  :options="memberOptions"',
  "  :titles=\"['Team', 'Assigned']\"",
  '  aria-label="Member transfer"',
  '  @check="handleMemberCheck"',
  '/>'
].join('\n')

function handlePermissionChange(payload: YTransferChangePayload) {
  transferState.value = `${payload.direction === 'right' ? 'Added' : 'Removed'}: ${payload.movedKeys.join(', ') || 'none'}`
}

function handleMemberCheck(payload: YTransferCheckPayload) {
  checkState.value = `${payload.direction} checked: ${payload.checkedKeys.join(', ') || 'none'}`
}
</script>

# Transfer

Transfer 用于在两个列表之间移动选项，适合权限配置、成员分配、资源绑定和批量筛选。

当前版本提供双栏列表、搜索、全选、禁用项、移动事件和空状态。每个选项都使用原生 checkbox，保证键盘和辅助技术可以稳定操作。

## Example

<DocDemo
  title="Basic transfer"
  description="基础穿梭框使用字符串数组作为值，目标列表中的 key 会同步到 v-model。"
  :code="basicCode"
  :setup="transferCodeSetup"
  :usage="['v-model', 'options', 'disabled option']"
>
  <YTransfer
    v-model="selectedPermissions"
    :options="permissionOptions"
    :titles="['Available', 'Selected']"
    aria-label="Permission transfer"
    @change="handlePermissionChange"
  />
  <p class="demo-note">{{ transferState }}</p>
</DocDemo>

<DocDemo
  title="Filterable lists"
  description="搜索框适合大量成员、权限或资源，左右列表分别过滤当前侧数据。"
  :code="filterableCode"
  :setup="transferCodeSetup"
  :usage="['filterable', 'search', 'empty state']"
>
  <YTransfer
    v-model="selectedFiltered"
    :options="permissionOptions"
    :titles="['Available', 'Selected']"
    filterable
    aria-label="Filterable permission transfer"
  />
</DocDemo>

<DocDemo
  title="Member assignment"
  description="change 和 check 事件能把移动方向、勾选项和移动项交给业务层处理。"
  :code="eventsCode"
  :setup="transferCodeSetup"
  :usage="['change', 'check', 'payload']"
>
  <YTransfer
    v-model="selectedMembers"
    :options="memberOptions"
    :titles="['Team', 'Assigned']"
    aria-label="Member transfer"
    @check="handleMemberCheck"
  />
  <p class="demo-note">{{ checkState }}</p>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="transfer"
  title="在线编辑 Transfer 示例"
  description="运行器内置权限选项，可直接调整 model-value、filterable 和禁用态展示。"
/>

## Usage notes

- `modelValue` 是目标列表 key 数组，适合权限、成员、资源绑定等持久化场景。
- `filterable` 对左右列表分别过滤，不会改变当前已选值。
- 禁用项可以展示在列表中，但不能被勾选或移动，适合保护角色、系统资源和外部托管成员。
- 复杂排序或分组推荐在业务层整理 `options` 后传入，Transfer 保持移动逻辑清晰。

## API

<ComponentApiSection name="YTransfer" />

## Accessibility

- 选项使用原生 `input type="checkbox"`，保留浏览器默认键盘交互。
- 左右列表使用 `role="listbox"` 和 `aria-multiselectable="true"` 表示多选区域。
- 每个选项使用 `role="option"`、`aria-selected` 和 `aria-disabled` 表达状态。
- 空列表使用 `role="status"`，移动按钮使用明确的 `aria-label`。
