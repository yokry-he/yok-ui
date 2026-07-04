<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  canDropTreeNode,
  findNode,
  flattenTree,
  getHalfCheckedKeys,
  getTreeCheckState,
  getTreeDropPosition,
  toggleTreeCheckedKeys
} from './tree'
import type {
  YTreeAllowDrop,
  YTreeCheckPayload,
  YTreeDropPayload,
  YTreeDropType,
  YTreeFlatNode,
  YTreeNode,
  YTreeSelectPayload,
  YTreeTogglePayload
} from './types'

defineOptions({
  name: 'YTree'
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
  ariaLabel?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedKey: '',
  expandedKeys: undefined,
  defaultExpandedKeys: () => [],
  checkedKeys: undefined,
  defaultCheckedKeys: () => [],
  checkable: false,
  checkStrictly: false,
  draggable: false,
  allowDrop: undefined,
  ariaLabel: 'Tree',
  emptyText: 'No tree data yet'
})

const emit = defineEmits<{
  'update:selectedKey': [key: string]
  'update:expandedKeys': [keys: string[]]
  'update:checkedKeys': [keys: string[]]
  select: [payload: YTreeSelectPayload]
  toggle: [payload: YTreeTogglePayload]
  check: [payload: YTreeCheckPayload]
  dragStart: [payload: YTreeSelectPayload]
  drop: [payload: YTreeDropPayload]
  dragEnd: [payload: YTreeSelectPayload]
}>()

const treeRef = ref<HTMLDivElement | null>(null)
const internalExpandedKeys = ref<string[]>([...props.defaultExpandedKeys])
const internalCheckedKeys = ref<string[]>([...props.defaultCheckedKeys])
const activeKey = ref('')
const draggingKey = ref('')
const dropTarget = ref<{ key: string; type: YTreeDropType } | null>(null)

const expandedKeysValue = computed(() => props.expandedKeys ?? internalExpandedKeys.value)
const checkedKeysValue = computed(() => props.checkedKeys ?? internalCheckedKeys.value)
const expandedKeySet = computed(() => new Set(expandedKeysValue.value))
const checkedKeySet = computed(() => new Set(checkedKeysValue.value))
const halfCheckedKeys = computed(() => getHalfCheckedKeys(props.nodes, checkedKeySet.value, props.checkStrictly))
const flatNodes = computed(() => flattenTree({
  nodes: props.nodes,
  expandedKeys: expandedKeySet.value,
  selectedKey: props.selectedKey
}))
const activeNode = computed(() => flatNodes.value.find((node) => node.key === activeKey.value))
const draggingNode = computed(() => draggingKey.value ? findNode(props.nodes, draggingKey.value) : null)

watch(flatNodes, (nodes) => {
  if (!nodes.length) {
    activeKey.value = ''
    return
  }

  if (!nodes.some((node) => node.key === activeKey.value)) {
    activeKey.value = props.selectedKey && nodes.some((node) => node.key === props.selectedKey)
      ? props.selectedKey
      : nodes[0].key
  }
}, { immediate: true })

function commitExpandedKeys(keys: string[]) {
  if (!props.expandedKeys) {
    internalExpandedKeys.value = keys
  }

  emit('update:expandedKeys', keys)
}

function commitCheckedKeys(keys: string[]) {
  if (!props.checkedKeys) {
    internalCheckedKeys.value = keys
  }

  emit('update:checkedKeys', keys)
}

function focusActive() {
  nextTick(() => {
    treeRef.value?.querySelector<HTMLElement>('[data-active-treeitem="true"]')?.focus()
  })
}

function setActiveKey(key: string) {
  activeKey.value = key
  focusActive()
}

function toggleNode(flatNode: YTreeFlatNode, expanded = !flatNode.expanded) {
  if (!flatNode.hasChildren || flatNode.disabled) {
    return
  }

  const nextKeys = new Set(expandedKeysValue.value)

  if (expanded) {
    nextKeys.add(flatNode.key)
  } else {
    nextKeys.delete(flatNode.key)
  }

  const keys = Array.from(nextKeys)
  commitExpandedKeys(keys)
  emit('toggle', {
    node: flatNode.node,
    key: flatNode.key,
    expanded
  })
}

function selectNode(flatNode: YTreeFlatNode) {
  if (flatNode.disabled) {
    return
  }

  activeKey.value = flatNode.key
  emit('update:selectedKey', flatNode.key)
  emit('select', {
    node: flatNode.node,
    key: flatNode.key
  })
}

function getCheckState(flatNode: YTreeFlatNode) {
  return getTreeCheckState({
    node: flatNode.node,
    checkedKeys: checkedKeySet.value,
    checkStrictly: props.checkStrictly
  })
}

function toggleCheck(flatNode: YTreeFlatNode) {
  if (!props.checkable || flatNode.disabled) {
    return
  }

  const currentState = getCheckState(flatNode)
  const checked = !currentState.checked
  const checkedKeys = toggleTreeCheckedKeys({
    node: flatNode.node,
    checkedKeys: checkedKeysValue.value,
    checked,
    checkStrictly: props.checkStrictly
  })
  const checkedSet = new Set(checkedKeys)
  const nextHalfCheckedKeys = getHalfCheckedKeys(props.nodes, checkedSet, props.checkStrictly)

  commitCheckedKeys(checkedKeys)
  emit('check', {
    node: flatNode.node,
    key: flatNode.key,
    checked,
    checkedKeys,
    halfCheckedKeys: nextHalfCheckedKeys
  })
}

function handleNodeClick(flatNode: YTreeFlatNode) {
  setActiveKey(flatNode.key)
  selectNode(flatNode)
}

function isDropAllowed(flatNode: YTreeFlatNode, type: YTreeDropType) {
  if (!props.draggable) {
    return false
  }

  const dragging = draggingNode.value
  const baseAllowed = canDropTreeNode({
    draggingNode: dragging,
    dropNode: flatNode.node,
    type
  })

  if (!baseAllowed || !dragging) {
    return false
  }

  return props.allowDrop?.({
    draggingNode: dragging,
    dropNode: flatNode.node,
    type
  }) ?? true
}

function handleDragStart(event: DragEvent, flatNode: YTreeFlatNode) {
  if (!props.draggable || flatNode.disabled) {
    event.preventDefault()
    return
  }

  draggingKey.value = flatNode.key
  activeKey.value = flatNode.key
  event.dataTransfer?.setData('text/plain', flatNode.key)
  event.dataTransfer?.setDragImage?.(event.currentTarget as Element, 16, 16)
  emit('dragStart', {
    node: flatNode.node,
    key: flatNode.key
  })
}

function handleDragOver(event: DragEvent, flatNode: YTreeFlatNode) {
  if (!props.draggable || !draggingNode.value) {
    return
  }

  const target = event.currentTarget as HTMLElement
  const type = getTreeDropPosition({
    offsetY: event.clientY - target.getBoundingClientRect().top,
    height: target.offsetHeight || target.getBoundingClientRect().height || 1
  })

  if (!isDropAllowed(flatNode, type)) {
    dropTarget.value = null
    event.dataTransfer && (event.dataTransfer.dropEffect = 'none')
    return
  }

  event.preventDefault()
  event.dataTransfer && (event.dataTransfer.dropEffect = 'move')
  dropTarget.value = {
    key: flatNode.key,
    type
  }
}

function handleDrop(event: DragEvent, flatNode: YTreeFlatNode) {
  const target = dropTarget.value
  const dragging = draggingNode.value

  if (!target || !dragging || target.key !== flatNode.key || !isDropAllowed(flatNode, target.type)) {
    return
  }

  event.preventDefault()
  emit('drop', {
    draggingNode: dragging,
    draggingKey: dragging.key,
    dropNode: flatNode.node,
    dropKey: flatNode.key,
    type: target.type
  })
  dropTarget.value = null
}

function handleDragEnd() {
  const dragging = draggingNode.value

  if (dragging) {
    emit('dragEnd', {
      node: dragging,
      key: dragging.key
    })
  }

  draggingKey.value = ''
  dropTarget.value = null
}

function moveActive(amount: number) {
  const nodes = flatNodes.value
  const currentIndex = Math.max(0, nodes.findIndex((node) => node.key === activeKey.value))
  const nextNode = nodes[Math.min(Math.max(0, currentIndex + amount), nodes.length - 1)]

  if (nextNode) {
    setActiveKey(nextNode.key)
  }
}

function handleKeydown(event: KeyboardEvent) {
  const node = activeNode.value

  if (!node) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    setActiveKey(flatNodes.value[0]?.key ?? '')
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    setActiveKey(flatNodes.value.at(-1)?.key ?? '')
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()

    if (node.hasChildren && !node.expanded) {
      toggleNode(node, true)
    } else {
      const child = flatNodes.value.find((item) => item.parentKey === node.key)
      if (child) {
        setActiveKey(child.key)
      }
    }

    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()

    if (node.hasChildren && node.expanded) {
      toggleNode(node, false)
    } else if (node.parentKey) {
      setActiveKey(node.parentKey)
    }

    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectNode(node)
  }
}

function getNodeByKey(key: string) {
  return findNode(props.nodes, key)
}

defineExpose({
  getNodeByKey
})
</script>

<template>
  <div class="yok-tree">
    <div
      v-if="flatNodes.length"
      ref="treeRef"
      class="yok-tree__list"
      role="tree"
      :aria-label="ariaLabel"
      @keydown="handleKeydown"
    >
      <div
        v-for="flatNode in flatNodes"
        :key="flatNode.key"
        class="yok-tree__item yok-focus-ring"
        :class="{
          'yok-tree__item--checkable': checkable,
          'yok-tree__item--selected': flatNode.selected,
          'yok-tree__item--disabled': flatNode.disabled,
          'yok-tree__item--dragging': draggingKey === flatNode.key,
          'yok-tree__item--drop-before': dropTarget?.key === flatNode.key && dropTarget.type === 'before',
          'yok-tree__item--drop-inside': dropTarget?.key === flatNode.key && dropTarget.type === 'inside',
          'yok-tree__item--drop-after': dropTarget?.key === flatNode.key && dropTarget.type === 'after'
        }"
        role="treeitem"
        :draggable="draggable && !flatNode.disabled"
        :aria-level="flatNode.level"
        :aria-expanded="flatNode.hasChildren ? (flatNode.expanded ? 'true' : 'false') : undefined"
        :aria-selected="flatNode.selected ? 'true' : 'false'"
        :aria-disabled="flatNode.disabled ? 'true' : undefined"
        :data-active-treeitem="activeKey === flatNode.key ? 'true' : 'false'"
        :tabindex="activeKey === flatNode.key ? 0 : -1"
        :style="{ '--yok-tree-level': flatNode.level }"
        @click="handleNodeClick(flatNode)"
        @dragstart="handleDragStart($event, flatNode)"
        @dragover="handleDragOver($event, flatNode)"
        @dragleave="dropTarget = null"
        @drop="handleDrop($event, flatNode)"
        @dragend="handleDragEnd"
        >
        <button
          v-if="flatNode.hasChildren"
          class="yok-tree__toggle yok-focus-ring"
          type="button"
          :disabled="flatNode.disabled"
          :aria-label="flatNode.expanded ? `Collapse ${flatNode.label}` : `Expand ${flatNode.label}`"
          @click.stop="toggleNode(flatNode)"
        >
          <span aria-hidden="true">{{ flatNode.expanded ? '−' : '+' }}</span>
        </button>
        <span v-else class="yok-tree__spacer" aria-hidden="true" />

        <button
          v-if="checkable"
          class="yok-tree__checkbox yok-focus-ring"
          :class="{
            'yok-tree__checkbox--checked': getCheckState(flatNode).checked,
            'yok-tree__checkbox--indeterminate': getCheckState(flatNode).indeterminate
          }"
          type="button"
          :disabled="flatNode.disabled"
          :aria-label="`${getCheckState(flatNode).checked ? 'Uncheck' : 'Check'} ${flatNode.label}`"
          :aria-checked="getCheckState(flatNode).indeterminate ? 'mixed' : (getCheckState(flatNode).checked ? 'true' : 'false')"
          @click.stop="toggleCheck(flatNode)"
        >
          <span aria-hidden="true">{{ getCheckState(flatNode).indeterminate ? '−' : (getCheckState(flatNode).checked ? '✓' : '') }}</span>
        </button>

        <span class="yok-tree__label">
          <slot name="node" :node="flatNode.node" :flat-node="flatNode">
            {{ flatNode.label }}
          </slot>
        </span>
      </div>
    </div>
    <div v-else class="yok-tree__empty" role="status">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<style scoped>
.yok-tree {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
}

.yok-tree__list {
  display: grid;
  padding: var(--yok-space-2);
}

.yok-tree__item {
  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  min-height: 36px;
  align-items: center;
  gap: var(--yok-space-2);
  border-radius: var(--yok-radius-md);
  cursor: pointer;
  padding: var(--yok-space-1) var(--yok-space-2);
  padding-inline-start: calc(var(--yok-space-2) + (var(--yok-tree-level) - 1) * 18px);
}

.yok-tree__item--checkable {
  grid-template-columns: 28px 20px minmax(0, 1fr);
}

.yok-tree__item:hover:not(.yok-tree__item--disabled) {
  background: var(--yok-color-primarySoft);
}

.yok-tree__item--selected {
  background: color-mix(in srgb, var(--yok-color-primarySoft) 72%, var(--yok-color-surface) 28%);
  color: var(--yok-color-primary);
  font-weight: 800;
}

.yok-tree__item--disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-tree__item--dragging {
  opacity: 0.56;
}

.yok-tree__item--drop-inside {
  background: color-mix(in srgb, var(--yok-color-primarySoft) 82%, var(--yok-color-surface));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--yok-color-primary) 42%, transparent);
}

.yok-tree__item--drop-before::before,
.yok-tree__item--drop-after::after {
  position: absolute;
  inset-inline: var(--yok-space-2);
  height: 2px;
  border-radius: 999px;
  background: var(--yok-color-primary);
  content: '';
}

.yok-tree__item--drop-before::before {
  inset-block-start: 0;
}

.yok-tree__item--drop-after::after {
  inset-block-end: 0;
}

.yok-tree__toggle {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: currentColor;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.yok-tree__toggle:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
}

.yok-tree__spacer {
  width: 24px;
  height: 24px;
}

.yok-tree__checkbox {
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 28%, var(--yok-color-border));
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: var(--yok-color-primary);
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
}

.yok-tree__checkbox--checked,
.yok-tree__checkbox--indeterminate {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primary);
  color: var(--yok-color-onPrimary);
}

.yok-tree__checkbox:disabled {
  cursor: not-allowed;
}

.yok-tree__label {
  min-width: 0;
  overflow: hidden;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-tree__empty {
  display: grid;
  min-height: 120px;
  place-items: center;
  color: var(--yok-color-textMuted);
  padding: var(--yok-space-6);
  text-align: center;
}
</style>
