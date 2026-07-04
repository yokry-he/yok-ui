---
title: Field Array
---

<script setup lang="ts">
import { computed, ref } from 'vue'
import { YTag } from '@yok-ui/core'

const reviewers = ref([
  { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },
  { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }
])
const reviewerSummary = computed(() => `${reviewers.value.length}/3 reviewers`)

const approvers = ref([
  { id: 'approver-core', name: 'Core owner', role: 'Maintainer' }
])
const approverMessage = computed(() =>
  approvers.value.length >= 2 ? 'Approval route is ready.' : 'Add one more approver before release.'
)

const permissions = ref([
  { id: 'perm-docs', name: 'Docs publish', scope: 'Documentation' },
  { id: 'perm-release', name: 'Release approve', scope: 'Release' }
])

const fieldArraySetup = [
  "import { computed, ref } from 'vue'",
  "import { YButton, YInput, YTag } from '@yok-ui/core'",
  "import { YFieldArray } from '@yok-ui/admin'",
  '',
  'const reviewers = ref([',
  "  { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },",
  "  { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }",
  '])',
  "const reviewerSummary = computed(() => `${reviewers.value.length}/3 reviewers`)",
  '',
  'const approvers = ref([',
  "  { id: 'approver-core', name: 'Core owner', role: 'Maintainer' }",
  '])',
  'const approverMessage = computed(() =>',
  "  approvers.value.length >= 2 ? 'Approval route is ready.' : 'Add one more approver before release.'",
  ')',
  '',
  'const permissions = ref([',
  "  { id: 'perm-docs', name: 'Docs publish', scope: 'Documentation' },",
  "  { id: 'perm-release', name: 'Release approve', scope: 'Release' }",
  '])'
].join('\n')

const reviewerCode = [
  '<YFieldArray',
  '  v-model="reviewers"',
  '  title="Reviewers"',
  '  description="People who need to approve this component."',
  '  add-text="Add reviewer"',
  '  remove-text="Remove reviewer"',
  '  item-label="Reviewer"',
  '  item-key="id"',
  '  :max="3"',
  '  :default-item="{ id: `reviewer-${Date.now()}`, name: \'\', role: \'Core review\' }"',
  '>',
  '  <template #default="{ item, itemKey, update, remove, canRemove }">',
  '    <div class="docs-field-array-row" :data-row-key="itemKey">',
  '      <YInput',
  '        :model-value="String(item.name ?? \'\')"',
  '        placeholder="Reviewer name"',
  '        @update:model-value="update({ ...item, name: $event })"',
  '      />',
  '      <YInput',
  '        :model-value="String(item.role ?? \'\')"',
  '        placeholder="Review role"',
  '        @update:model-value="update({ ...item, role: $event })"',
  '      />',
  '      <YButton type="button" variant="ghost" :disabled="!canRemove" @click="remove()">Remove</YButton>',
  '    </div>',
  '  </template>',
  '</YFieldArray>',
  '<p class="demo-note">{{ reviewerSummary }}</p>'
].join('\n')

const constraintsCode = [
  '<YFieldArray',
  '  v-model="approvers"',
  '  title="Approval route"',
  '  description="Use min and max to keep workflow rules visible in the UI."',
  '  add-text="Add approver"',
  '  remove-text="Remove approver"',
  '  empty-text="No approvers configured"',
  '  item-label="Approver"',
  '  item-key="id"',
  '  :min="1"',
  '  :max="2"',
  '  :default-item="{ id: `approver-${Date.now()}`, name: \'\', role: \'Reviewer\' }"',
  '>',
  '  <template #default="{ item, update, canRemove }">',
  '    <div class="docs-field-array-row docs-field-array-row--compact">',
  '      <YInput',
  '        :model-value="String(item.name ?? \'\')"',
  '        placeholder="Approver"',
  '        @update:model-value="update({ ...item, name: $event })"',
  '      />',
  '      <YInput',
  '        :model-value="String(item.role ?? \'\')"',
  '        placeholder="Role"',
  '        @update:model-value="update({ ...item, role: $event })"',
  '      />',
  '      <YTag :tone="canRemove ? \'warning\' : \'neutral\'">{{ canRemove ? \'removable\' : \'required\' }}</YTag>',
  '    </div>',
  '  </template>',
  '</YFieldArray>',
  '<p class="demo-note">{{ approverMessage }}</p>'
].join('\n')

const headerCode = [
  '<YFieldArray',
  '  v-model="permissions"',
  '  add-text="Add permission"',
  '  remove-text="Remove"',
  '  item-label="Permission"',
  '  item-key="id"',
  '  :default-item="{ id: `perm-${Date.now()}`, name: \'\', scope: \'Custom\' }"',
  '>',
  '  <template #header>',
  '    <div class="docs-field-array-header">',
  '      <div>',
  '        <strong>Permission matrix</strong>',
  '        <p class="demo-note">Stable ids keep row state predictable after add or remove.</p>',
  '      </div>',
  '      <YTag tone="success">{{ permissions.length }} active</YTag>',
  '    </div>',
  '  </template>',
  '  <template #default="{ item, itemKey, update }">',
  '    <div class="docs-field-array-row" :data-row-key="itemKey">',
  '      <YInput',
  '        :model-value="String(item.name ?? \'\')"',
  '        placeholder="Permission name"',
  '        @update:model-value="update({ ...item, name: $event })"',
  '      />',
  '      <YInput',
  '        :model-value="String(item.scope ?? \'\')"',
  '        placeholder="Scope"',
  '        @update:model-value="update({ ...item, scope: $event })"',
  '      />',
  '      <YTag>{{ itemKey }}</YTag>',
  '    </div>',
  '  </template>',
  '</YFieldArray>'
].join('\n')
</script>

# Field Array

Field Array 用于动态字段组，比如审核人、联系人、权限项、规格配置。它只负责数组项的增删和 slot payload，不强制字段结构，因此可以和 `YSchemaForm`、`YFormItem` 或业务控件自由组合。

它的定位接近 Ant Design `Form.List` 和 Element Plus 动态表单项的底层能力：提供列表状态、添加删除约束、稳定行 key 和 slot payload，具体字段控件仍由业务侧决定。

## Basic Usage

<DocDemo
  title="Basic usage"
  description="通过默认插槽接收 item、update、remove 和 canRemove，自行组合行内输入控件。"
  :code="reviewerCode"
  :setup="fieldArraySetup"
  :usage="['dynamic fields', 'slot payload', 'stable item key']"
>
  <YFieldArray
    v-model="reviewers"
    title="Reviewers"
    description="People who need to approve this component."
    add-text="Add reviewer"
    remove-text="Remove reviewer"
    item-label="Reviewer"
    item-key="id"
    :max="3"
    :default-item="{ id: `reviewer-${Date.now()}`, name: '', role: 'Core review' }"
  >
    <template #default="{ item, itemKey, update, remove, canRemove }">
      <div class="docs-field-array-row" :data-row-key="itemKey">
        <YInput
          :model-value="String(item.name ?? '')"
          placeholder="Reviewer name"
          @update:model-value="update({ ...item, name: $event })"
        />
        <YInput
          :model-value="String(item.role ?? '')"
          placeholder="Review role"
          @update:model-value="update({ ...item, role: $event })"
        />
        <YButton type="button" variant="ghost" :disabled="!canRemove" @click="remove()">Remove</YButton>
      </div>
    </template>
  </YFieldArray>
  <p class="demo-note">{{ reviewerSummary }}</p>
</DocDemo>

## Min And Max

<DocDemo
  title="Min and max"
  description="min / max 会同步控制添加和删除能力，适合审批链、联系人、规格项这类有数量规则的字段组。"
  :code="constraintsCode"
  :setup="fieldArraySetup"
  :usage="['min max', 'disabled action', 'workflow rule']"
>
  <YFieldArray
    v-model="approvers"
    title="Approval route"
    description="Use min and max to keep workflow rules visible in the UI."
    add-text="Add approver"
    remove-text="Remove approver"
    empty-text="No approvers configured"
    item-label="Approver"
    item-key="id"
    :min="1"
    :max="2"
    :default-item="{ id: `approver-${Date.now()}`, name: '', role: 'Reviewer' }"
  >
    <template #default="{ item, update, canRemove }">
      <div class="docs-field-array-row docs-field-array-row--compact">
        <YInput
          :model-value="String(item.name ?? '')"
          placeholder="Approver"
          @update:model-value="update({ ...item, name: $event })"
        />
        <YInput
          :model-value="String(item.role ?? '')"
          placeholder="Role"
          @update:model-value="update({ ...item, role: $event })"
        />
        <YTag :tone="canRemove ? 'warning' : 'neutral'">{{ canRemove ? 'removable' : 'required' }}</YTag>
      </div>
    </template>
  </YFieldArray>
  <p class="demo-note">{{ approverMessage }}</p>
</DocDemo>

## Custom Header

<DocDemo
  title="Custom header"
  description="自定义 header 适合把数量、状态或说明放在字段组标题区，同时保持 add 按钮和行 key 逻辑由组件管理。"
  :code="headerCode"
  :setup="fieldArraySetup"
  :usage="['custom header', 'stable id', 'permission matrix']"
>
  <YFieldArray
    v-model="permissions"
    add-text="Add permission"
    remove-text="Remove"
    item-label="Permission"
    item-key="id"
    :default-item="{ id: `perm-${Date.now()}`, name: '', scope: 'Custom' }"
  >
    <template #header>
      <div class="docs-field-array-header">
        <div>
          <strong>Permission matrix</strong>
          <p class="demo-note">Stable ids keep row state predictable after add or remove.</p>
        </div>
        <YTag tone="success">{{ permissions.length }} active</YTag>
      </div>
    </template>
    <template #default="{ item, itemKey, update }">
      <div class="docs-field-array-row" :data-row-key="itemKey">
        <YInput
          :model-value="String(item.name ?? '')"
          placeholder="Permission name"
          @update:model-value="update({ ...item, name: $event })"
        />
        <YInput
          :model-value="String(item.scope ?? '')"
          placeholder="Scope"
          @update:model-value="update({ ...item, scope: $event })"
        />
        <YTag>{{ itemKey }}</YTag>
      </div>
    </template>
  </YFieldArray>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="fieldArray"
  title="在线编辑 Field Array 示例"
  description="运行器覆盖动态新增、删除限制、稳定 item key 和 slot payload，可直接进入 Playground 验证完整 SFC。"
/>

## API

<ComponentApiSection name="YFieldArray" />

## Accessibility

- 区域会使用 `title || itemLabel` 作为 `aria-label`，便于辅助技术识别动态字段组。
- 添加和删除操作使用真实按钮，并在达到 `min` / `max` 时禁用，避免用户执行无效操作。
- 动态项建议传入 `item-key`，通常是 `id` 字段；这样在新增、删除、重排时可以保持焦点、错误提示和行内组件状态稳定。
- 移动端会把标题、按钮和字段内容改为单列，避免动态字段组挤压。

<style scoped>
.docs-field-array-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.docs-field-array-row--compact {
  align-items: end;
}

.docs-field-array-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.docs-field-array-header strong {
  display: block;
  color: var(--yok-color-text);
  font-size: 15px;
}

@media (max-width: 720px) {
  .docs-field-array-row,
  .docs-field-array-header {
    grid-template-columns: 1fr;
  }

  .docs-field-array-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
