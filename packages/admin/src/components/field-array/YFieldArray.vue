<script setup lang="ts">
import { computed } from 'vue'
import { YButton } from '@yok-ui/core'

defineOptions({
  name: 'YFieldArray'
})

export type YFieldArrayItem = Record<string, unknown>
export type YFieldArrayValue = YFieldArrayItem[]
export type YFieldArrayItemKey = string | ((item: YFieldArrayItem, index: number) => string | number)

export interface YFieldArrayPayload {
  index: number
  item: YFieldArrayItem
  items: YFieldArrayValue
}

interface Props {
  modelValue: YFieldArrayValue
  title?: string
  description?: string
  addText?: string
  removeText?: string
  emptyText?: string
  itemLabel?: string
  defaultItem?: YFieldArrayItem
  itemKey?: YFieldArrayItemKey
  min?: number
  max?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  addText: 'Add item',
  removeText: 'Remove item',
  emptyText: 'No items yet',
  itemLabel: 'Item',
  defaultItem: () => ({}),
  itemKey: '',
  min: 0,
  max: Number.POSITIVE_INFINITY,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [items: YFieldArrayValue]
  add: [payload: YFieldArrayPayload]
  remove: [payload: YFieldArrayPayload]
  itemChange: [payload: YFieldArrayPayload]
}>()

const canAdd = computed(() => !props.disabled && props.modelValue.length < props.max)
const canRemove = computed(() => !props.disabled && props.modelValue.length > props.min)

function cloneItem(item: YFieldArrayItem) {
  return JSON.parse(JSON.stringify(item)) as YFieldArrayItem
}

function getItemKey(item: YFieldArrayItem, index: number) {
  if (typeof props.itemKey === 'function') {
    return String(props.itemKey(item, index))
  }

  if (props.itemKey) {
    const value = item[props.itemKey]

    if (value !== undefined && value !== null && value !== '') {
      return String(value)
    }
  }

  return String(index)
}

function emitItems(items: YFieldArrayValue) {
  emit('update:modelValue', items)
}

function addItem() {
  if (!canAdd.value) {
    return
  }

  const item = cloneItem(props.defaultItem)
  const items = [...props.modelValue, item]

  emitItems(items)
  emit('add', {
    index: items.length - 1,
    item,
    items
  })
}

function updateItem(index: number, item: YFieldArrayItem) {
  const items = props.modelValue.map((current, currentIndex) => currentIndex === index ? item : current)

  emitItems(items)
  emit('itemChange', {
    index,
    item,
    items
  })
}

function removeItem(index: number) {
  if (!canRemove.value) {
    return
  }

  const item = props.modelValue[index]
  const items = props.modelValue.filter((_current, currentIndex) => currentIndex !== index)

  emitItems(items)
  emit('remove', {
    index,
    item,
    items
  })
}
</script>

<template>
  <section class="yok-field-array" :aria-label="title || itemLabel">
    <header v-if="title || description || $slots.header" class="yok-field-array__header">
      <slot name="header">
        <div class="yok-field-array__copy">
          <h3 v-if="title">{{ title }}</h3>
          <p v-if="description">{{ description }}</p>
        </div>
      </slot>
      <YButton
        class="yok-field-array__add"
        type="button"
        variant="secondary"
        :disabled="!canAdd"
        @click="addItem"
      >
        {{ addText }}
      </YButton>
    </header>

    <p v-if="!modelValue.length" class="yok-field-array__empty">{{ emptyText }}</p>

    <ol v-else class="yok-field-array__list">
      <li
        v-for="(item, index) in modelValue"
        :key="getItemKey(item, index)"
        class="yok-field-array__item"
        :data-item-key="getItemKey(item, index)"
      >
        <div class="yok-field-array__item-header">
          <strong>{{ itemLabel }} {{ index + 1 }}</strong>
          <YButton
            class="yok-field-array__remove"
            type="button"
            variant="ghost"
            size="sm"
            :disabled="!canRemove"
            @click="removeItem(index)"
          >
            {{ removeText }}
          </YButton>
        </div>
        <div class="yok-field-array__item-body">
          <slot
            :item="item"
            :item-key="getItemKey(item, index)"
            :index="index"
            :items="modelValue"
            :can-add="canAdd"
            :can-remove="canRemove"
            :update="(nextItem: YFieldArrayItem) => updateItem(index, nextItem)"
            :remove="() => removeItem(index)"
          >
            <pre>{{ item }}</pre>
          </slot>
        </div>
      </li>
    </ol>

    <footer v-if="!title && !$slots.header" class="yok-field-array__footer">
      <YButton
        class="yok-field-array__add"
        type="button"
        variant="secondary"
        :disabled="!canAdd"
        @click="addItem"
      >
        {{ addText }}
      </YButton>
    </footer>
  </section>
</template>

<style scoped>
.yok-field-array {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
}

.yok-field-array__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-field-array__copy {
  min-width: 0;
}

.yok-field-array h3,
.yok-field-array p {
  margin: 0;
}

.yok-field-array h3 {
  color: var(--yok-color-text);
  font-size: 16px;
  letter-spacing: 0;
}

.yok-field-array__copy p,
.yok-field-array__empty {
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-field-array__list {
  display: grid;
  gap: var(--yok-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-field-array__item {
  display: grid;
  gap: var(--yok-space-3);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  padding: var(--yok-space-4);
}

.yok-field-array__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
}

.yok-field-array__item-header strong {
  color: var(--yok-color-text);
  font-size: 14px;
}

.yok-field-array__item-body {
  min-width: 0;
}

.yok-field-array__item-body pre {
  overflow: auto;
  margin: 0;
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  padding: var(--yok-space-3);
}

.yok-field-array__footer {
  display: flex;
  justify-content: flex-start;
}

@media (max-width: 640px) {
  .yok-field-array__header,
  .yok-field-array__item-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
