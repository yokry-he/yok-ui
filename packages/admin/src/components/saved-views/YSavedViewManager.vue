<script setup lang="ts">
import { computed } from 'vue'
import { YBadge, YButton, YCheckbox, YInput, YTextarea } from '@yok-ui/core'
import type { YSavedViewItem } from './YSavedViews.vue'

defineOptions({
  name: 'YSavedViewManager'
})

export interface YSavedViewManagerPayload {
  item: YSavedViewItem
  items: YSavedViewItem[]
}

export interface YSavedViewManagerSavePayload {
  items: YSavedViewItem[]
  activeValue: string
  defaultValue: string
}

export interface YSavedViewManagerRenamePayload {
  item: YSavedViewItem
  label: string
}

export interface YSavedViewManagerDescriptionPayload {
  item: YSavedViewItem
  description: string
}

export interface YSavedViewManagerPinPayload {
  item: YSavedViewItem
  pinned: boolean
}

interface Props {
  modelValue: string
  defaultValue?: string
  items: YSavedViewItem[]
  title?: string
  description?: string
  ariaLabel?: string
  createText?: string
  saveText?: string
  duplicateText?: string
  deleteText?: string
  defaultText?: string
  currentText?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: '',
  title: 'Manage saved views',
  description: 'Rename, pin, duplicate, delete and choose the default view.',
  ariaLabel: 'Manage saved views',
  createText: 'Create view',
  saveText: 'Save changes',
  duplicateText: 'Duplicate',
  deleteText: 'Delete',
  defaultText: 'Set default',
  currentText: 'Current',
  emptyText: 'No saved views to manage'
})

const emit = defineEmits<{
  'update:items': [items: YSavedViewItem[]]
  'update:modelValue': [value: string]
  'update:defaultValue': [value: string]
  change: [item: YSavedViewItem]
  create: []
  save: [payload: YSavedViewManagerSavePayload]
  rename: [payload: YSavedViewManagerRenamePayload]
  descriptionChange: [payload: YSavedViewManagerDescriptionPayload]
  duplicate: [payload: YSavedViewManagerPayload]
  delete: [item: YSavedViewItem]
  pinChange: [payload: YSavedViewManagerPinPayload]
  setDefault: [item: YSavedViewItem]
}>()

const activeItem = computed(() => props.items.find((item) => item.value === props.modelValue))

function updateItem(item: YSavedViewItem, patch: Partial<YSavedViewItem>) {
  const nextItems = props.items.map((current) => current.value === item.value ? { ...current, ...patch } : current)
  emit('update:items', nextItems)
  return nextItems
}

function renameItem(item: YSavedViewItem, label: string) {
  updateItem(item, { label })
  emit('rename', { item, label })
}

function updateDescription(item: YSavedViewItem, description: string) {
  updateItem(item, { description })
  emit('descriptionChange', { item, description })
}

function updatePinned(item: YSavedViewItem, pinned: boolean) {
  updateItem(item, { pinned })
  emit('pinChange', { item, pinned })
}

function selectItem(item: YSavedViewItem) {
  if (item.disabled) {
    return
  }

  emit('update:modelValue', item.value)
  emit('change', item)
}

function createCopyValue(item: YSavedViewItem) {
  const usedValues = new Set(props.items.map((current) => current.value))
  const baseValue = `${item.value}-copy`

  if (!usedValues.has(baseValue)) {
    return baseValue
  }

  let index = 2
  while (usedValues.has(`${baseValue}-${index}`)) {
    index += 1
  }

  return `${baseValue}-${index}`
}

function duplicateItem(item: YSavedViewItem) {
  if (item.disabled) {
    return
  }

  const copy: YSavedViewItem = {
    ...item,
    label: `${item.label} copy`,
    value: createCopyValue(item),
    pinned: false,
    disabled: false
  }
  const index = props.items.findIndex((current) => current.value === item.value)
  const nextItems = [
    ...props.items.slice(0, index + 1),
    copy,
    ...props.items.slice(index + 1)
  ]

  emit('update:items', nextItems)
  emit('duplicate', { item, items: nextItems })
}

function deleteItem(item: YSavedViewItem) {
  if (item.disabled) {
    return
  }

  const nextItems = props.items.filter((current) => current.value !== item.value)
  emit('update:items', nextItems)
  emit('delete', item)
}

function setDefault(item: YSavedViewItem) {
  if (item.disabled) {
    return
  }

  emit('update:defaultValue', item.value)
  emit('setDefault', item)
}

function saveChanges() {
  emit('save', {
    items: props.items,
    activeValue: props.modelValue,
    defaultValue: props.defaultValue
  })
}
</script>

<template>
  <section class="yok-saved-view-manager" :aria-label="ariaLabel">
    <header class="yok-saved-view-manager__header">
      <div class="yok-saved-view-manager__copy">
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div class="yok-saved-view-manager__header-actions">
        <YButton class="yok-saved-view-manager__create" type="button" variant="secondary" @click="$emit('create')">
          {{ createText }}
        </YButton>
        <YButton class="yok-saved-view-manager__save" type="button" variant="primary" @click="saveChanges">
          {{ saveText }}
        </YButton>
      </div>
    </header>

    <p v-if="activeItem" class="yok-saved-view-manager__summary" role="status">
      {{ currentText }}: {{ activeItem.label }}
    </p>

    <div v-if="items.length" class="yok-saved-view-manager__list">
      <article
        v-for="item in items"
        :key="item.value"
        class="yok-saved-view-manager__item"
        :class="{
          'yok-saved-view-manager__item--active': item.value === modelValue,
          'yok-saved-view-manager__item--disabled': item.disabled
        }"
      >
        <div class="yok-saved-view-manager__item-main">
          <button
            class="yok-saved-view-manager__select yok-focus-ring"
            type="button"
            :aria-pressed="item.value === modelValue ? 'true' : 'false'"
            :disabled="item.disabled"
            @click="selectItem(item)"
          >
            <span class="yok-saved-view-manager__select-copy">
              <strong>{{ item.label }}</strong>
              <small v-if="item.description">{{ item.description }}</small>
            </span>
            <YBadge v-if="typeof item.count === 'number'" :value="item.count" />
          </button>
          <span v-if="item.value === defaultValue" class="yok-saved-view-manager__default-badge">
            Default
          </span>
        </div>

        <div class="yok-saved-view-manager__editor">
          <YInput
            :model-value="item.label"
            label="View name"
            :disabled="item.disabled"
            @update:model-value="renameItem(item, $event)"
          />
          <YTextarea
            :model-value="item.description ?? ''"
            label="Description"
            :rows="2"
            :disabled="item.disabled"
            @update:model-value="updateDescription(item, $event)"
          />
        </div>

        <div class="yok-saved-view-manager__row-actions">
          <YCheckbox
            :model-value="Boolean(item.pinned)"
            label="Pinned"
            :disabled="item.disabled"
            @update:model-value="updatePinned(item, $event)"
          />
          <button
            class="yok-saved-view-manager__default-action yok-focus-ring"
            type="button"
            :disabled="item.disabled || item.value === defaultValue"
            @click="setDefault(item)"
          >
            {{ defaultText }}
          </button>
          <button
            class="yok-saved-view-manager__duplicate yok-focus-ring"
            type="button"
            :disabled="item.disabled"
            @click="duplicateItem(item)"
          >
            {{ duplicateText }}
          </button>
          <button
            class="yok-saved-view-manager__delete yok-focus-ring"
            type="button"
            :disabled="item.disabled"
            @click="deleteItem(item)"
          >
            {{ deleteText }}
          </button>
        </div>
      </article>
    </div>

    <p v-else class="yok-saved-view-manager__empty" role="status">{{ emptyText }}</p>
  </section>
</template>

<style scoped>
.yok-saved-view-manager {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-saved-view-manager__header,
.yok-saved-view-manager__item-main,
.yok-saved-view-manager__row-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-saved-view-manager__copy {
  min-width: 0;
}

.yok-saved-view-manager h3,
.yok-saved-view-manager p {
  margin: 0;
}

.yok-saved-view-manager h3 {
  font-size: 16px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-saved-view-manager__copy p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-saved-view-manager__header-actions {
  display: inline-flex;
  flex: none;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  justify-content: flex-end;
}

.yok-saved-view-manager__summary,
.yok-saved-view-manager__default-badge {
  width: fit-content;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 18%, var(--yok-color-border));
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 70%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 760;
  padding: 5px var(--yok-space-2);
}

.yok-saved-view-manager__list {
  display: grid;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-saved-view-manager__item {
  display: grid;
  gap: var(--yok-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-border), transparent 12%);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  padding: var(--yok-space-4);
}

.yok-saved-view-manager__item--active {
  border-color: color-mix(in srgb, var(--yok-color-primary), white 58%);
  box-shadow: var(--yok-shadow-soft);
}

.yok-saved-view-manager__item--disabled {
  opacity: 0.68;
}

.yok-saved-view-manager__select {
  display: inline-flex;
  align-items: flex-start;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 15px;
  font-weight: 760;
  gap: var(--yok-space-2);
  letter-spacing: 0;
  padding: 0;
  text-align: left;
}

.yok-saved-view-manager__select:disabled {
  cursor: not-allowed;
}

.yok-saved-view-manager__select-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.yok-saved-view-manager__select-copy strong,
.yok-saved-view-manager__select-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-saved-view-manager__select-copy small {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 500;
}

.yok-saved-view-manager__editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-saved-view-manager__row-actions {
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.yok-saved-view-manager__default-action,
.yok-saved-view-manager__duplicate,
.yok-saved-view-manager__delete {
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0;
  padding: 6px var(--yok-space-2);
}

.yok-saved-view-manager__delete {
  color: var(--yok-color-danger);
}

.yok-saved-view-manager__default-action:disabled,
.yok-saved-view-manager__duplicate:disabled,
.yok-saved-view-manager__delete:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.yok-saved-view-manager__empty {
  border: 1px dashed var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-textMuted);
  padding: var(--yok-space-4);
}

@media (max-width: 760px) {
  .yok-saved-view-manager__header,
  .yok-saved-view-manager__item-main {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-saved-view-manager__header-actions {
    justify-content: flex-start;
  }

  .yok-saved-view-manager__editor {
    grid-template-columns: 1fr;
  }
}
</style>
