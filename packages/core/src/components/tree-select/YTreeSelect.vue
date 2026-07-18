<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'
import YInternalIcon from '../_internal/YInternalIcon.vue'
import { flattenTree, findNode, getNodeChildren } from '../tree/tree'
import type { YTreeFlatNode, YTreeNode } from '../tree/types'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YTreeSelect'
})

export interface YTreeSelectNode extends YTreeNode {}

export type YTreeSelectSize = 'small' | 'medium' | 'large'
export type YTreeSelectValue = string | string[]

export interface YTreeSelectChangePayload {
  value: YTreeSelectValue
  node: YTreeSelectNode | null
  selectedNodes: YTreeSelectNode[]
}

const treeSelectSizeByConfig: Record<YokConfigSize, YTreeSelectSize> = {
  sm: 'small',
  md: 'medium',
  lg: 'large'
}

interface Props {
  id?: string
  modelValue?: YTreeSelectValue
  nodes: YTreeSelectNode[]
  label?: string
  placeholder?: string
  error?: string
  invalid?: boolean
  ariaDescribedby?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  collapseTags?: boolean
  maxCollapseTags?: number
  filterable?: boolean
  checkStrictly?: boolean
  expandedKeys?: string[]
  defaultExpandedKeys?: string[]
  emptyText?: string
  searchPlaceholder?: string
  treeAriaLabel?: string
  size?: YTreeSelectSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  placeholder: 'Select a node',
  error: '',
  invalid: false,
  ariaDescribedby: '',
  disabled: false,
  clearable: false,
  multiple: false,
  collapseTags: false,
  maxCollapseTags: 1,
  filterable: false,
  checkStrictly: false,
  expandedKeys: undefined,
  defaultExpandedKeys: () => [],
  emptyText: 'No matching nodes',
  searchPlaceholder: 'Search nodes',
  treeAriaLabel: '',
  size: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: YTreeSelectValue]
  'update:expandedKeys': [keys: string[]]
  change: [value: YTreeSelectValue]
  select: [payload: YTreeSelectChangePayload]
  clear: []
  remove: [value: string]
  visibleChange: [open: boolean]
  search: [query: string]
}>()

const generatedId = useId()
const yokConfig = useYokConfig()
const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const treeRef = ref<HTMLDivElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])
const query = ref('')
const activeKey = ref('')
const internalExpandedKeys = ref<string[]>([...props.defaultExpandedKeys])
const pendingFocus = ref<'tree' | 'search' | null>(null)

const fieldId = computed(() => props.id || `yok-tree-select-${generatedId}`)
const resolvedSize = computed(() => props.size ?? treeSelectSizeByConfig[yokConfig.size.value])
const resolvedDensity = computed(() => yokConfig.density.value)
const labelId = computed(() => `${fieldId.value}-label`)
const treeId = computed(() => `${fieldId.value}-tree`)
const selectedValues = computed(() =>
  props.multiple
    ? Array.isArray(props.modelValue)
      ? props.modelValue
      : props.modelValue
        ? [props.modelValue]
        : []
    : []
)
const expandedKeysValue = computed(() => props.expandedKeys ?? internalExpandedKeys.value)
const expandedKeySet = computed(() => new Set(expandedKeysValue.value))
const normalizedQuery = computed(() => query.value.trim().toLowerCase())

function filterNodes(nodes: YTreeSelectNode[]): YTreeSelectNode[] {
  if (!normalizedQuery.value) {
    return nodes
  }

  return nodes.flatMap((node) => {
    const children = filterNodes(getNodeChildren(node) as YTreeSelectNode[])
    const matchesSelf = node.label.toLowerCase().includes(normalizedQuery.value)

    if (matchesSelf || children.length) {
      return [{
        ...node,
        children
      }]
    }

    return []
  })
}

const visibleNodes = computed(() => filterNodes(props.nodes))
const effectiveExpandedKeys = computed(() => {
  if (!normalizedQuery.value) {
    return expandedKeySet.value
  }

  const keys = new Set<string>()

  function walk(nodes: YTreeSelectNode[]) {
    nodes.forEach((node) => {
      if (getNodeChildren(node).length) {
        keys.add(node.key)
        walk(getNodeChildren(node) as YTreeSelectNode[])
      }
    })
  }

  walk(visibleNodes.value)
  return keys
})
const flatNodes = computed(() => flattenTree({
  nodes: visibleNodes.value,
  expandedKeys: effectiveExpandedKeys.value,
  selectedKey: props.multiple ? '' : String(props.modelValue || '')
}))
const selectableFlatNodes = computed(() => flatNodes.value.filter((node) => isNodeSelectable(node)))
const activeNode = computed(() => flatNodes.value.find((node) => node.key === activeKey.value))
const selectedNode = computed(() =>
  props.multiple || !props.modelValue
    ? null
    : findNode(props.nodes, String(props.modelValue)) as YTreeSelectNode | null
)
const selectedNodes = computed(() =>
  props.multiple
    ? selectedValues.value
      .map((value) => findNode(props.nodes, value) as YTreeSelectNode | null)
      .filter((node): node is YTreeSelectNode => Boolean(node))
    : selectedNode.value
      ? [selectedNode.value]
      : []
)
const visibleSelectedNodes = computed(() => {
  if (!props.multiple || !props.collapseTags) {
    return selectedNodes.value
  }

  return selectedNodes.value.slice(0, Math.max(1, props.maxCollapseTags))
})
const collapsedSelectedCount = computed(() =>
  props.multiple && props.collapseTags
    ? Math.max(0, selectedNodes.value.length - visibleSelectedNodes.value.length)
    : 0
)
const hasSelection = computed(() => selectedNodes.value.length > 0)
const displayText = computed(() => selectedNode.value?.label || props.placeholder)
const hasInvalidState = computed(() => Boolean(props.error) || props.invalid)
const describedBy = computed(() => props.ariaDescribedby || undefined)
const resolvedTreeAriaLabel = computed(() => props.treeAriaLabel || `${props.label || 'Tree select'} options`)
const activeDescendantId = computed(() => open.value && activeKey.value ? `${fieldId.value}-node-${activeKey.value}` : undefined)

const { floatingStyles } = useFloatingLayer(triggerRef, panelRef, {
  open,
  placement: computed(() => 'bottom-start'),
  offset: 6,
  matchReferenceWidth: true
})

const { layerStyle } = useDismissableLayer({
  open,
  reference: triggerRef,
  floating: panelRef,
  onDismiss: closeAndFocusTrigger
})

function isNodeSelectable(flatNode: YTreeFlatNode) {
  return !flatNode.disabled && (props.checkStrictly || !flatNode.hasChildren)
}

function isNodeSelected(key: string) {
  return props.multiple ? selectedValues.value.includes(key) : props.modelValue === key
}

function setItemRef(element: HTMLElement | null, index: number) {
  if (element) {
    itemRefs.value[index] = element
  }
}

function commitExpandedKeys(keys: string[]) {
  if (!props.expandedKeys) {
    internalExpandedKeys.value = keys
  }

  emit('update:expandedKeys', keys)
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

  commitExpandedKeys(Array.from(nextKeys))
}

function setOpen(value: boolean) {
  if (props.disabled) {
    return
  }

  open.value = value
}

function focusTrigger() {
  void nextTick(() => triggerRef.value?.focus())
}

function focusActive() {
  void nextTick(() => {
    const activeIndex = flatNodes.value.findIndex((node) => node.key === activeKey.value)
    itemRefs.value[activeIndex]?.focus()
  })
}

function setActiveKey(key: string) {
  activeKey.value = key
  focusActive()
}

function focusFirstTreeItem() {
  const firstNode = flatNodes.value[0]

  if (firstNode) {
    setActiveKey(firstNode.key)
  }
}

function openAndFocus(target: 'tree' | 'search' = props.filterable ? 'search' : 'tree') {
  pendingFocus.value = target
  setOpen(true)
}

function closeAndFocusTrigger() {
  setOpen(false)
  focusTrigger()
}

function emitChange(value: YTreeSelectValue, node: YTreeSelectNode | null) {
  const nextSelectedNodes = Array.isArray(value)
    ? value
      .map((item) => findNode(props.nodes, item) as YTreeSelectNode | null)
      .filter((item): item is YTreeSelectNode => Boolean(item))
    : value
      ? [node].filter((item): item is YTreeSelectNode => Boolean(item))
      : []

  emit('change', value)
  emit('select', {
    value,
    node,
    selectedNodes: nextSelectedNodes
  })
}

function clearSelection(event?: MouseEvent) {
  event?.preventDefault()
  event?.stopPropagation()

  if (props.disabled || !hasSelection.value) {
    return
  }

  const value = props.multiple ? [] : ''
  emit('update:modelValue', value)
  emitChange(value, null)
  emit('clear')
  setOpen(false)
  focusTrigger()
}

function removeNode(node: YTreeSelectNode, event?: MouseEvent) {
  event?.preventDefault()
  event?.stopPropagation()

  if (props.disabled || !props.multiple) {
    return
  }

  const value = selectedValues.value.filter((item) => item !== node.key)
  emit('update:modelValue', value)
  emitChange(value, node)
  emit('remove', node.key)
}

function selectNode(flatNode: YTreeFlatNode) {
  if (!isNodeSelectable(flatNode)) {
    if (flatNode.hasChildren) {
      toggleNode(flatNode)
    }
    return
  }

  if (props.multiple) {
    const value = selectedValues.value.includes(flatNode.key)
      ? selectedValues.value.filter((item) => item !== flatNode.key)
      : [...selectedValues.value, flatNode.key]

    emit('update:modelValue', value)
    emitChange(value, flatNode.node as YTreeSelectNode)

    if (selectedValues.value.includes(flatNode.key)) {
      emit('remove', flatNode.key)
    }
    return
  }

  emit('update:modelValue', flatNode.key)
  emitChange(flatNode.key, flatNode.node as YTreeSelectNode)
  setOpen(false)
  query.value = ''
  focusTrigger()
}

function moveActive(amount: number) {
  const nodes = flatNodes.value
  const currentIndex = Math.max(0, nodes.findIndex((node) => node.key === activeKey.value))
  const nextNode = nodes[Math.min(Math.max(0, currentIndex + amount), nodes.length - 1)]

  if (nextNode) {
    setActiveKey(nextNode.key)
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (['Enter', ' '].includes(event.key)) {
    event.preventDefault()
    open.value ? closeAndFocusTrigger() : openAndFocus()
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openAndFocus('tree')
    return
  }

  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    closeAndFocusTrigger()
  }
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusFirstTreeItem()
    return
  }

  if (event.key === 'Enter') {
    const firstSelectable = selectableFlatNodes.value[0]
    if (firstSelectable) {
      event.preventDefault()
      selectNode(firstSelectable)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeAndFocusTrigger()
  }
}

function handleTreeKeydown(event: KeyboardEvent) {
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
    }
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (node.hasChildren && node.expanded) {
      toggleNode(node, false)
    }
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectNode(node)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeAndFocusTrigger()
  }
}

watch(open, (isOpen) => {
  emit('visibleChange', isOpen)

  if (!isOpen) {
    itemRefs.value = []
    pendingFocus.value = null
    query.value = ''
    return
  }

  void nextTick(() => {
    const selected = props.multiple ? selectedValues.value[0] : String(props.modelValue || '')
    activeKey.value = selected && flatNodes.value.some((node) => node.key === selected)
      ? selected
      : flatNodes.value[0]?.key ?? ''

    if (pendingFocus.value === 'search' && props.filterable) {
      searchRef.value?.focus()
      return
    }

    focusActive()
  })
})

watch(query, (value) => {
  emit('search', value)
  itemRefs.value = []
  void nextTick(() => {
    if (!flatNodes.value.some((node) => node.key === activeKey.value)) {
      activeKey.value = flatNodes.value[0]?.key ?? ''
    }
  })
})
</script>

<template>
  <div
    class="yok-tree-select"
    :class="[
      `yok-tree-select--${resolvedSize}`,
      `yok-tree-select--${resolvedDensity}`,
      { 'yok-tree-select--disabled': disabled, 'yok-tree-select--multiple': multiple }
    ]"
  >
    <span v-if="label" :id="labelId" class="yok-tree-select__label">{{ label }}</span>
    <div class="yok-tree-select__control-wrap">
      <div
        :id="fieldId"
        ref="triggerRef"
        class="yok-tree-select__control yok-focus-ring"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        aria-haspopup="tree"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="treeId"
        :aria-activedescendant="activeDescendantId"
        :aria-labelledby="label ? `${labelId} ${fieldId}` : undefined"
        :aria-label="label ? undefined : placeholder"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :aria-describedby="describedBy"
        @click="setOpen(!open)"
        @keydown="handleTriggerKeydown"
      >
        <span v-if="multiple && selectedNodes.length" class="yok-tree-select__tags">
          <span v-for="node in visibleSelectedNodes" :key="node.key" class="yok-tree-select__tag">
            <span class="yok-tree-select__tag-label">{{ node.label }}</span>
            <button
              class="yok-tree-select__tag-remove"
              type="button"
              tabindex="-1"
              :aria-label="`Remove ${node.label}`"
              @click="removeNode(node, $event)"
            >
              <YInternalIcon name="close" />
            </button>
          </span>
          <span
            v-if="collapsedSelectedCount"
            class="yok-tree-select__tag yok-tree-select__tag-summary"
            :aria-label="`${collapsedSelectedCount} more selected nodes`"
          >
            +{{ collapsedSelectedCount }}
          </span>
        </span>
        <span v-else class="yok-tree-select__value" :class="{ 'yok-tree-select__value--placeholder': !selectedNode }">
          {{ displayText }}
        </span>
        <span class="yok-tree-select__chevron" aria-hidden="true">
          <YInternalIcon name="chevronDown" />
        </span>
      </div>
      <button
        v-if="clearable && hasSelection && !disabled"
        class="yok-tree-select__clear yok-focus-ring"
        type="button"
        aria-label="Clear selection"
        @click="clearSelection"
      >
        <YInternalIcon name="close" />
      </button>
    </div>
    <Transition name="yok-floating-layer">
      <div
        v-if="open"
        ref="panelRef"
        class="yok-tree-select__panel"
        :style="[floatingStyles, layerStyle]"
      >
        <label v-if="filterable" class="yok-tree-select__search">
          <span class="yok-tree-select__search-label">{{ searchPlaceholder }}</span>
          <input
            ref="searchRef"
            v-model="query"
            class="yok-tree-select__search-input yok-focus-ring"
            type="search"
            role="searchbox"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            :aria-controls="treeId"
            autocomplete="off"
            @keydown="handleSearchKeydown"
          >
        </label>
        <div
          v-if="flatNodes.length"
          :id="treeId"
          ref="treeRef"
          class="yok-tree-select__tree"
          role="tree"
          :aria-label="resolvedTreeAriaLabel"
          :aria-multiselectable="multiple ? 'true' : undefined"
          @keydown="handleTreeKeydown"
        >
          <div
            v-for="flatNode in flatNodes"
            :id="`${fieldId}-node-${flatNode.key}`"
            :key="flatNode.key"
            :ref="(element) => setItemRef(element as HTMLElement | null, flatNode.index)"
            class="yok-tree-select__item yok-focus-ring"
            :class="{
              'yok-tree-select__item--selected': isNodeSelected(flatNode.key),
              'yok-tree-select__item--disabled': flatNode.disabled,
              'yok-tree-select__item--branch': flatNode.hasChildren,
              'yok-tree-select__item--readonly-branch': flatNode.hasChildren && !checkStrictly
            }"
            role="treeitem"
            :aria-level="flatNode.level"
            :aria-expanded="flatNode.hasChildren ? (flatNode.expanded ? 'true' : 'false') : undefined"
            :aria-selected="isNodeSelected(flatNode.key) ? 'true' : 'false'"
            :aria-disabled="flatNode.disabled ? 'true' : undefined"
            :data-tree-select-key="flatNode.key"
            :tabindex="activeKey === flatNode.key ? 0 : -1"
            :style="{ '--yok-tree-select-level': flatNode.level }"
            @click="selectNode(flatNode)"
          >
            <button
              v-if="flatNode.hasChildren"
              class="yok-tree-select__toggle yok-focus-ring"
              type="button"
              :disabled="flatNode.disabled"
              :aria-label="flatNode.expanded ? `Collapse ${flatNode.label}` : `Expand ${flatNode.label}`"
              @click.stop="toggleNode(flatNode)"
            >
              <YInternalIcon :name="flatNode.expanded ? 'minus' : 'chevronRight'" />
            </button>
            <span v-else class="yok-tree-select__spacer" aria-hidden="true" />
            <span class="yok-tree-select__item-label">{{ flatNode.label }}</span>
            <span v-if="isNodeSelected(flatNode.key)" class="yok-tree-select__check" aria-hidden="true">
              <YInternalIcon name="check" />
            </span>
          </div>
        </div>
        <span v-else class="yok-tree-select__empty" role="status">{{ emptyText }}</span>
      </div>
    </Transition>
    <span v-if="error" class="yok-tree-select__error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.yok-tree-select {
  --yok-tree-select-control-min-height: 38px;
  --yok-tree-select-control-padding-inline: var(--yok-space-3);
  --yok-tree-select-font-size: 14px;
  --yok-tree-select-option-min-height: 36px;

  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
  font-size: var(--yok-tree-select-font-size);
}

.yok-tree-select--small {
  --yok-tree-select-control-min-height: 32px;
  --yok-tree-select-control-padding-inline: var(--yok-space-2);
  --yok-tree-select-font-size: 13px;
  --yok-tree-select-option-min-height: 32px;
}

.yok-tree-select--large {
  --yok-tree-select-control-min-height: 44px;
  --yok-tree-select-control-padding-inline: var(--yok-space-4);
  --yok-tree-select-font-size: 15px;
  --yok-tree-select-option-min-height: 40px;
}

.yok-tree-select--compact {
  --yok-tree-select-option-min-height: 32px;
}

.yok-tree-select__label {
  color: var(--yok-color-text);
  font-weight: 760;
}

.yok-tree-select__control-wrap {
  position: relative;
  min-width: 0;
}

.yok-tree-select__control {
  display: flex;
  min-height: var(--yok-tree-select-control-min-height);
  align-items: center;
  gap: var(--yok-space-2);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-xs);
  cursor: pointer;
  padding: 4px calc(var(--yok-tree-select-control-padding-inline) + 22px) 4px var(--yok-tree-select-control-padding-inline);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.yok-tree-select__control:hover {
  border-color: color-mix(in srgb, var(--yok-color-primary) 48%, var(--yok-color-border));
}

.yok-tree-select--disabled .yok-tree-select__control {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-tree-select__value {
  min-width: 0;
  overflow: hidden;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-tree-select__value--placeholder {
  color: var(--yok-color-textMuted);
}

.yok-tree-select__tags {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
  gap: var(--yok-space-1);
}

.yok-tree-select__tag {
  display: inline-flex;
  max-width: 160px;
  align-items: center;
  gap: var(--yok-space-1);
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 22%, var(--yok-color-border));
  border-radius: 999px;
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 760;
  line-height: 1;
  padding: 5px 8px;
}

.yok-tree-select__tag-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-tree-select__tag-remove {
  display: grid;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  font: inherit;
  line-height: 1;
  padding: 0;
}

.yok-tree-select__tag-remove:hover {
  background: color-mix(in srgb, var(--yok-color-primary) 12%, transparent);
}

.yok-tree-select__chevron,
.yok-tree-select__clear {
  position: absolute;
  inset-block-start: 50%;
  transform: translateY(-50%);
}

.yok-tree-select__chevron {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  inset-inline-end: var(--yok-tree-select-control-padding-inline);
  color: var(--yok-color-textMuted);
  font-size: 16px;
  line-height: 1;
  pointer-events: none;
}

.yok-tree-select__clear {
  display: grid;
  width: 22px;
  height: 22px;
  inset-inline-end: calc(var(--yok-tree-select-control-padding-inline) + 22px);
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: var(--yok-color-muted);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}

.yok-tree-select__panel {
  width: var(--yok-floating-reference-width, auto);
  max-height: 360px;
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-lg);
  padding: var(--yok-space-2);
}

.yok-tree-select__search {
  display: grid;
  gap: var(--yok-space-1);
  margin-block-end: var(--yok-space-2);
}

.yok-tree-select__search-label {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 760;
}

.yok-tree-select__search-input {
  width: 100%;
  min-height: 34px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-muted);
  color: var(--yok-color-text);
  font: inherit;
  padding: 0 var(--yok-space-3);
}

.yok-tree-select__tree {
  display: grid;
  gap: 2px;
}

.yok-tree-select__item {
  position: relative;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 18px;
  min-height: var(--yok-tree-select-option-min-height);
  align-items: center;
  gap: var(--yok-space-2);
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  cursor: pointer;
  padding: var(--yok-space-1) var(--yok-space-2);
  padding-inline-start: calc(var(--yok-space-2) + (var(--yok-tree-select-level) - 1) * 18px);
}

.yok-tree-select__item:hover:not(.yok-tree-select__item--disabled) {
  background: var(--yok-color-primarySoft);
}

.yok-tree-select__item--selected {
  background: color-mix(in srgb, var(--yok-color-primarySoft) 74%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-weight: 820;
}

.yok-tree-select__item--readonly-branch {
  color: var(--yok-color-textMuted);
}

.yok-tree-select__item--disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-tree-select__toggle {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: currentColor;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 820;
  line-height: 1;
  padding: 0;
}

.yok-tree-select__spacer {
  width: 22px;
  height: 22px;
}

.yok-tree-select__item-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-tree-select__check {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  color: var(--yok-color-primary);
  font-size: 16px;
  font-weight: 900;
  text-align: center;
}

.yok-tree-select__empty {
  display: grid;
  min-height: 96px;
  place-items: center;
  color: var(--yok-color-textMuted);
  padding: var(--yok-space-5);
  text-align: center;
}

.yok-tree-select__error {
  color: var(--yok-color-danger);
  font-size: 13px;
  font-weight: 680;
}
</style>
