<script setup lang="ts">
import { ref } from 'vue'
import YTree from './YTree.vue'
import type {
  YTreeAllowDrop,
  YTreeCheckPayload,
  YTreeDropPayload,
  YTreeExpose,
  YTreeLoadChildren,
  YTreeLoadErrorPayload,
  YTreeLoadPayload,
  YTreeNode,
  YTreeSelectPayload,
  YTreeTogglePayload
} from './types'

defineOptions({
  name: 'YVirtualTree'
})

interface Props {
  nodes: YTreeNode[]
  selectedKey?: string
  expandedKeys?: string[]
  defaultExpandedKeys?: string[]
  checkedKeys?: string[]
  defaultCheckedKeys?: string[]
  checkable?: boolean
  checkStrictly?: boolean
  draggable?: boolean
  allowDrop?: YTreeAllowDrop
  lazy?: boolean
  load?: YTreeLoadChildren
  height?: number
  itemHeight?: number
  overscan?: number
  ariaLabel?: string
  emptyText?: string
}

withDefaults(defineProps<Props>(), {
  selectedKey: '',
  expandedKeys: undefined,
  defaultExpandedKeys: () => [],
  checkedKeys: undefined,
  defaultCheckedKeys: () => [],
  checkable: false,
  checkStrictly: false,
  draggable: false,
  allowDrop: undefined,
  lazy: false,
  load: undefined,
  height: 280,
  itemHeight: 36,
  overscan: 4,
  ariaLabel: 'Virtual tree',
  emptyText: 'No tree data yet'
})

defineEmits<{
  'update:selectedKey': [key: string]
  'update:expandedKeys': [keys: string[]]
  'update:checkedKeys': [keys: string[]]
  select: [payload: YTreeSelectPayload]
  toggle: [payload: YTreeTogglePayload]
  check: [payload: YTreeCheckPayload]
  dragStart: [payload: YTreeSelectPayload]
  drop: [payload: YTreeDropPayload]
  dragEnd: [payload: YTreeSelectPayload]
  load: [payload: YTreeLoadPayload]
  loadError: [payload: YTreeLoadErrorPayload]
}>()

const treeRef = ref<YTreeExpose>()

defineExpose<YTreeExpose>({
  getNodeByKey: (key) => treeRef.value?.getNodeByKey(key) ?? null,
  reloadNode: async (key) => treeRef.value?.reloadNode(key) ?? false
})
</script>

<template>
  <YTree
    ref="treeRef"
    class="yok-virtual-tree"
    :nodes="nodes"
    :selected-key="selectedKey"
    :expanded-keys="expandedKeys"
    :default-expanded-keys="defaultExpandedKeys"
    :checked-keys="checkedKeys"
    :default-checked-keys="defaultCheckedKeys"
    :checkable="checkable"
    :check-strictly="checkStrictly"
    :draggable="draggable"
    :allow-drop="allowDrop"
    :lazy="lazy"
    :load="load"
    :virtual-height="height"
    :virtual-item-height="itemHeight"
    :virtual-overscan="overscan"
    :aria-label="ariaLabel"
    :empty-text="emptyText"
    virtualized
    @update:selected-key="$emit('update:selectedKey', $event)"
    @update:expanded-keys="$emit('update:expandedKeys', $event)"
    @update:checked-keys="$emit('update:checkedKeys', $event)"
    @select="$emit('select', $event)"
    @toggle="$emit('toggle', $event)"
    @check="$emit('check', $event)"
    @drag-start="$emit('dragStart', $event)"
    @drop="$emit('drop', $event)"
    @drag-end="$emit('dragEnd', $event)"
    @load="$emit('load', $event)"
    @load-error="$emit('loadError', $event)"
  >
    <template #node="slotProps">
      <slot name="node" v-bind="slotProps">
        {{ slotProps.node.label }}
      </slot>
    </template>
    <template #empty>
      <slot name="empty">{{ emptyText }}</slot>
    </template>
  </YTree>
</template>

<style scoped>
.yok-virtual-tree {
  --yok-virtual-tree-border-color: var(--yok-color-border);
  --yok-virtual-tree-shadow: var(--yok-shadow-sm);

  box-shadow: inset 0 -1px 0 var(--yok-virtual-tree-border-color), var(--yok-virtual-tree-shadow);
}
</style>
