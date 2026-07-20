<script setup lang="ts">
import { ref } from 'vue'
import type {
  YBulkActionItem,
  YBulkActionMenuItem,
  YBulkActionMenuPayload,
  YBulkActionPayload
} from '@yok-ui/admin'

const selectedRowKeys = ref(['table', 'data-table'])
const tableSelectedRowKeys = ref(['button'])
const message = ref('Waiting for a bulk action')

const actions: YBulkActionItem[] = [
  { label: 'Archive', value: 'archive', tone: 'info' },
  { label: 'Approve', value: 'approve', tone: 'success' },
  { label: 'Delete', value: 'delete', tone: 'danger' }
]

const menuActions: YBulkActionMenuItem[] = [
  { label: 'Publish', value: 'publish', group: 'Workflow', tone: 'success', description: 'Move selected components to stable.' },
  { label: 'Assign owner', value: 'assign', group: 'Workflow', tone: 'info' },
  { label: 'Export CSV', value: 'export', group: 'Export' },
  { label: 'Delete', value: 'delete', group: 'Danger zone', tone: 'danger', requiresConfirm: true, confirmText: 'Confirm delete' }
]

const columns = [
  { key: 'name', label: 'Component' },
  { key: 'package', label: 'Package' },
  { key: 'status', label: 'Status' }
]

const rows = [
  { id: 'button', name: 'YButton', package: 'Core', status: 'Stable' },
  { id: 'table', name: 'YTable', package: 'Core', status: 'Stable' },
  { id: 'data-table', name: 'YDataTable', package: 'Admin', status: 'Beta' }
]

function handleAction(payload: YBulkActionPayload) {
  message.value = `${payload.action.label}: ${payload.selectedRowKeys.join(', ')}`
}

function handleMenuAction(payload: YBulkActionMenuPayload) {
  message.value = `${payload.action.label}: ${payload.selectedRowKeys.join(', ')}`
}

const bulkActionSetup = [
  "import { ref } from 'vue'",
  "import { YBulkActionBar, YBulkActionMenu, YDataTable, type YBulkActionItem, type YBulkActionMenuItem, type YBulkActionMenuPayload, type YBulkActionPayload } from '@yok-ui/admin'",
  '',
  "const selectedRowKeys = ref(['table', 'data-table'])",
  "const tableSelectedRowKeys = ref(['button'])",
  "const message = ref('Waiting for a bulk action')",
  '',
  'const actions: YBulkActionItem[] = [',
  "  { label: 'Archive', value: 'archive', tone: 'info' },",
  "  { label: 'Approve', value: 'approve', tone: 'success' },",
  "  { label: 'Delete', value: 'delete', tone: 'danger' }",
  ']',
  '',
  'const menuActions: YBulkActionMenuItem[] = [',
  "  { label: 'Publish', value: 'publish', group: 'Workflow', tone: 'success', description: 'Move selected components to stable.' },",
  "  { label: 'Assign owner', value: 'assign', group: 'Workflow', tone: 'info' },",
  "  { label: 'Export CSV', value: 'export', group: 'Export' },",
  "  { label: 'Delete', value: 'delete', group: 'Danger zone', tone: 'danger', requiresConfirm: true, confirmText: 'Confirm delete' }",
  ']',
  '',
  'const columns = [',
  "  { key: 'name', label: 'Component' },",
  "  { key: 'package', label: 'Package' },",
  "  { key: 'status', label: 'Status' }",
  ']',
  '',
  'const rows = [',
  "  { id: 'button', name: 'YButton', package: 'Core', status: 'Stable' },",
  "  { id: 'table', name: 'YTable', package: 'Core', status: 'Stable' },",
  "  { id: 'data-table', name: 'YDataTable', package: 'Admin', status: 'Beta' }",
  ']',
  '',
  'function handleAction(payload: YBulkActionPayload) {',
  "  message.value = `${payload.action.label}: ${payload.selectedRowKeys.join(', ')}`",
  '}',
  '',
  'function handleMenuAction(payload: YBulkActionMenuPayload) {',
  "  message.value = `${payload.action.label}: ${payload.selectedRowKeys.join(', ')}`",
  '}'
].join('\n')

const basicCode = [
  '<YBulkActionBar',
  '  :selected-row-keys="selectedRowKeys"',
  '  :actions="actions"',
  '  aria-label="Selected components"',
  '  @clear="selectedRowKeys = []"',
  '  @action="handleAction"',
  '/>',
  '<p class="demo-note">{{ message }}</p>'
].join('\n')

const tableCode = [
  '<YDataTable',
  '  v-model:selected-row-keys="tableSelectedRowKeys"',
  '  title="Component inventory"',
  '  description="Select rows to reveal bulk actions."',
  '  :columns="columns"',
  '  :data="rows"',
  '  selectable',
  '>',
  '  <template #bulkActions="{ selectedRowKeys }">',
  '    <YBulkActionBar',
  '      :selected-row-keys="selectedRowKeys"',
  '      :actions="actions"',
  '      clear-text="Reset"',
  '      @clear="tableSelectedRowKeys = []"',
  '      @action="handleAction"',
  '    />',
  '  </template>',
  '</YDataTable>'
].join('\n')

const menuCode = [
  '<YBulkActionMenu',
  '  :selected-row-keys="selectedRowKeys"',
  '  :actions="menuActions"',
  '  label="More batch actions"',
  '  clear-text="Clear selection"',
  '  @clear="selectedRowKeys = []"',
  '  @action="handleMenuAction"',
  '/>',
  '<p class="demo-note">{{ message }}</p>'
].join('\n')
</script>

# Bulk Action Bar

Bulk Action Bar 用于后台列表页的批量选择反馈和操作区。它参考 Ant Design、Element Plus、Naive UI 等组件库中“表格选择后出现批量动作”的模式，把选中数量、动作按钮和清空选择拆成一个可复用组件。

组件不直接管理表格数据，只通过 `selectedRowKeys` 和事件与业务层协作。这样它既可以放进 `YDataTable` 的 `bulkActions` 插槽，也可以放在 `YCrudLayout` 的 footer 或自定义列表工具区。

::: tip TIP
`YBulkActionBar` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Selected row actions {#bulk-action-bar-selected-row-actions}

<DocDemo
  title="Selected row actions"
  description="批量操作条只消费 selectedRowKeys 和 actions，业务层负责真正的提交、清空和状态记录。"
  :code="basicCode"
  :setup="bulkActionSetup"
  :usage="['selected rows', 'aria-live status', 'bulk actions']"
>
  <YBulkActionBar
    :selected-row-keys="selectedRowKeys"
    :actions="actions"
    aria-label="Selected components"
    @clear="selectedRowKeys = []"
    @action="handleAction"
  />
  <p class="demo-note">{{ message }}</p>
</DocDemo>

## Menu {#bulk-action-bar-menu}

<DocDemo
  title="Grouped action menu"
  description="菜单版本适合批量动作较多的场景，可按业务域分组，并对危险操作做二次确认。"
  :code="menuCode"
  :setup="bulkActionSetup"
  :usage="['grouped actions', 'danger confirm', 'selected row payload']"
>
  <YBulkActionMenu
    :selected-row-keys="selectedRowKeys"
    :actions="menuActions"
    label="More batch actions"
    clear-text="Clear selection"
    @clear="selectedRowKeys = []"
    @action="handleMenuAction"
  />
  <p class="demo-note">{{ message }}</p>
</DocDemo>

## With Data Table {#bulk-action-bar-with-data-table}

<DocDemo
  title="Data table selection"
  description="放进 Data Table 的 bulkActions 插槽时，批量条会跟随表格选择状态同步。"
  :code="tableCode"
  :setup="bulkActionSetup"
  :usage="['data table slot', 'selection sync', 'clear event']"
>
  <YDataTable
    v-model:selected-row-keys="tableSelectedRowKeys"
    title="Component inventory"
    description="Select rows to reveal bulk actions."
    :columns="columns"
    :data="rows"
    selectable
  >
    <template #bulkActions="{ selectedRowKeys }">
      <YBulkActionBar
        :selected-row-keys="selectedRowKeys"
        :actions="actions"
        clear-text="Reset"
        @clear="tableSelectedRowKeys = []"
        @action="handleAction"
      />
    </template>
  </YDataTable>
</DocDemo>

## Bulk Action Bar API {#bulk-action-bar-api}

<ComponentApiSection name="YBulkActionBar" />

<ComponentApiSection name="YBulkActionMenu" />

## Accessibility {#accessibility}

- 外层使用 `role="status"` 和 `aria-live="polite"` 宣告选中状态变化。
- 批量动作与清空操作都使用原生 `button`。
- 没有选中项时，内置动作和清空按钮会进入 disabled 状态。
- 自定义 `actions` 插槽时，业务层仍应保留键盘可达的按钮或菜单控件。
- `YBulkActionMenu` 使用 `aria-haspopup="menu"`、`role="menu"` 和 `role="menuitem"` 表达菜单关系，危险操作可通过 `requiresConfirm` 要求二次点击确认。
