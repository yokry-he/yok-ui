---
title: Field Array
---

<script setup lang="ts">
import { ref } from 'vue'

const reviewers = ref([
  { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },
  { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }
])
</script>

# Field Array

Field Array 用于动态字段组，比如审核人、联系人、权限项、规格配置。它只负责数组项的增删和 slot payload，不强制字段结构，因此可以和 `YSchemaForm`、`YFormItem` 或业务控件自由组合。

## Example

<YFieldArray
  v-model="reviewers"
  title="Reviewers"
  description="People who need to approve this component."
  add-text="Add reviewer"
  remove-text="Remove reviewer"
  item-label="Reviewer"
  item-key="id"
  :default-item="{ id: '', name: '', role: 'Core review' }"
>
  <template #default="{ item, itemKey, update, remove, canRemove }">
    <div class="docs-field-array-row" :data-row-key="itemKey">
      <YInput
        :model-value="item.name"
        placeholder="Reviewer name"
        @update:model-value="update({ ...item, name: $event })"
      />
      <YInput
        :model-value="item.role"
        placeholder="Review role"
        @update:model-value="update({ ...item, role: $event })"
      />
      <YButton type="button" variant="ghost" :disabled="!canRemove" @click="remove()">Remove</YButton>
    </div>
  </template>
</YFieldArray>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const reviewers = ref([
  { id: 'reviewer-ada', name: 'Ada', role: 'Design review' }
])
</script>

<template>
  <YFieldArray
    v-model="reviewers"
    title="Reviewers"
    item-key="id"
    :default-item="{ id: '', name: '', role: 'Core review' }"
  >
    <template #default="{ item, update }">
      <YInput
        :model-value="item.name"
        @update:model-value="update({ ...item, name: $event })"
      />
    </template>
  </YFieldArray>
</template>
```

## Live example

<LiveExampleRunner preset="fieldArray" />

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
  align-items: end;
}

@media (max-width: 720px) {
  .docs-field-array-row {
    grid-template-columns: 1fr;
  }
}
</style>
