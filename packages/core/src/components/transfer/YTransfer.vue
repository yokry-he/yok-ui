<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  filterTransferOptions,
  getEnabledTransferKeys,
  mergeTransferValues,
  removeTransferValues,
  splitTransferOptions
} from './transfer'
import type { YTransferChangePayload, YTransferCheckPayload, YTransferDirection, YTransferOption } from './types'

defineOptions({
  name: 'YTransfer'
})

interface Props {
  modelValue?: string[]
  options: YTransferOption[]
  titles?: [string, string]
  filterable?: boolean
  disabled?: boolean
  emptyText?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  titles: () => ['Source', 'Target'],
  filterable: false,
  disabled: false,
  emptyText: 'No options',
  ariaLabel: 'Transfer options'
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [payload: YTransferChangePayload]
  check: [payload: YTransferCheckPayload]
}>()

const leftChecked = ref<string[]>([])
const rightChecked = ref<string[]>([])
const leftQuery = ref('')
const rightQuery = ref('')

const optionGroups = computed(() => splitTransferOptions(props.options, props.modelValue))
const leftOptions = computed(() => optionGroups.value.source)
const rightOptions = computed(() => optionGroups.value.target)
const filteredLeftOptions = computed(() => filterTransferOptions(leftOptions.value, leftQuery.value))
const filteredRightOptions = computed(() => filterTransferOptions(rightOptions.value, rightQuery.value))
const leftEnabledKeys = computed(() => getEnabledTransferKeys(filteredLeftOptions.value))
const rightEnabledKeys = computed(() => getEnabledTransferKeys(filteredRightOptions.value))
const leftCheckedEnabledKeys = computed(() => leftChecked.value.filter((key) => leftEnabledKeys.value.includes(key)))
const rightCheckedEnabledKeys = computed(() => rightChecked.value.filter((key) => rightEnabledKeys.value.includes(key)))
const canMoveRight = computed(() => !props.disabled && leftCheckedEnabledKeys.value.length > 0)
const canMoveLeft = computed(() => !props.disabled && rightCheckedEnabledKeys.value.length > 0)
const leftAllChecked = computed(() => leftEnabledKeys.value.length > 0 && leftCheckedEnabledKeys.value.length === leftEnabledKeys.value.length)
const rightAllChecked = computed(() => rightEnabledKeys.value.length > 0 && rightCheckedEnabledKeys.value.length === rightEnabledKeys.value.length)
const leftIndeterminate = computed(() => leftCheckedEnabledKeys.value.length > 0 && !leftAllChecked.value)
const rightIndeterminate = computed(() => rightCheckedEnabledKeys.value.length > 0 && !rightAllChecked.value)

watch(() => props.modelValue, () => {
  const valueSet = new Set(props.modelValue)

  leftChecked.value = leftChecked.value.filter((key) => !valueSet.has(key))
  rightChecked.value = rightChecked.value.filter((key) => valueSet.has(key))
})

function emitCheck(direction: YTransferDirection, checkedKeys: string[]) {
  emit('check', {
    direction,
    checkedKeys
  })
}

function setChecked(direction: YTransferDirection, keys: string[]) {
  if (direction === 'left') {
    leftChecked.value = keys
  } else {
    rightChecked.value = keys
  }

  emitCheck(direction, keys)
}

function toggleKey(direction: YTransferDirection, key: string, checked: boolean) {
  const current = direction === 'left' ? leftChecked.value : rightChecked.value
  const next = checked ? Array.from(new Set([...current, key])) : current.filter((item) => item !== key)

  setChecked(direction, next)
}

function toggleAll(direction: YTransferDirection, checked: boolean) {
  const keys = direction === 'left' ? leftEnabledKeys.value : rightEnabledKeys.value

  setChecked(direction, checked ? keys : [])
}

function commitMove(direction: YTransferDirection, movedKeys: string[], value: string[]) {
  emit('update:modelValue', value)
  emit('change', {
    value,
    movedKeys,
    direction
  })
}

function moveRight() {
  const movedKeys = leftCheckedEnabledKeys.value

  if (!movedKeys.length) {
    return
  }

  leftChecked.value = []
  commitMove('right', movedKeys, mergeTransferValues(props.modelValue, movedKeys))
}

function moveLeft() {
  const movedKeys = rightCheckedEnabledKeys.value

  if (!movedKeys.length) {
    return
  }

  rightChecked.value = []
  commitMove('left', movedKeys, removeTransferValues(props.modelValue, movedKeys))
}
</script>

<template>
  <div class="yok-transfer" :class="{ 'yok-transfer--disabled': disabled }" role="group" :aria-label="ariaLabel">
    <section class="yok-transfer__panel" :aria-label="titles[0]">
      <header class="yok-transfer__header">
        <label class="yok-transfer__select-all">
          <input
            class="yok-transfer__checkbox yok-focus-ring"
            type="checkbox"
            :checked="leftAllChecked"
            :disabled="disabled || leftEnabledKeys.length === 0"
            :aria-checked="leftIndeterminate ? 'mixed' : leftAllChecked ? 'true' : 'false'"
            @change="toggleAll('left', ($event.target as HTMLInputElement).checked)"
          />
          <span>{{ titles[0] }}</span>
        </label>
        <span class="yok-transfer__count">{{ leftCheckedEnabledKeys.length }}/{{ leftOptions.length }}</span>
      </header>

      <input
        v-if="filterable"
        v-model="leftQuery"
        class="yok-transfer__search yok-focus-ring"
        type="search"
        :disabled="disabled"
        :placeholder="`Search ${titles[0]}`"
      />

      <div v-if="filteredLeftOptions.length" class="yok-transfer__list" role="listbox" aria-multiselectable="true">
        <label
          v-for="option in filteredLeftOptions"
          :key="option.value"
          class="yok-transfer__item"
          :class="{ 'yok-transfer__item--disabled': disabled || option.disabled }"
          role="option"
          :aria-selected="leftChecked.includes(option.value) ? 'true' : 'false'"
          :aria-disabled="disabled || option.disabled ? 'true' : undefined"
        >
          <input
            class="yok-transfer__checkbox yok-focus-ring"
            type="checkbox"
            :checked="leftChecked.includes(option.value)"
            :disabled="disabled || option.disabled"
            @change="toggleKey('left', option.value, ($event.target as HTMLInputElement).checked)"
          />
          <span class="yok-transfer__item-content">
            <span class="yok-transfer__item-label">{{ option.label }}</span>
            <span v-if="option.description" class="yok-transfer__item-description">{{ option.description }}</span>
          </span>
        </label>
      </div>
      <div v-else class="yok-transfer__empty" role="status">{{ emptyText }}</div>
    </section>

    <div class="yok-transfer__actions">
      <button class="yok-transfer__action yok-focus-ring" type="button" :disabled="!canMoveRight" aria-label="Move selected to target" @click="moveRight">
        <span aria-hidden="true">›</span>
      </button>
      <button class="yok-transfer__action yok-focus-ring" type="button" :disabled="!canMoveLeft" aria-label="Move selected to source" @click="moveLeft">
        <span aria-hidden="true">‹</span>
      </button>
    </div>

    <section class="yok-transfer__panel" :aria-label="titles[1]">
      <header class="yok-transfer__header">
        <label class="yok-transfer__select-all">
          <input
            class="yok-transfer__checkbox yok-focus-ring"
            type="checkbox"
            :checked="rightAllChecked"
            :disabled="disabled || rightEnabledKeys.length === 0"
            :aria-checked="rightIndeterminate ? 'mixed' : rightAllChecked ? 'true' : 'false'"
            @change="toggleAll('right', ($event.target as HTMLInputElement).checked)"
          />
          <span>{{ titles[1] }}</span>
        </label>
        <span class="yok-transfer__count">{{ rightCheckedEnabledKeys.length }}/{{ rightOptions.length }}</span>
      </header>

      <input
        v-if="filterable"
        v-model="rightQuery"
        class="yok-transfer__search yok-focus-ring"
        type="search"
        :disabled="disabled"
        :placeholder="`Search ${titles[1]}`"
      />

      <div v-if="filteredRightOptions.length" class="yok-transfer__list" role="listbox" aria-multiselectable="true">
        <label
          v-for="option in filteredRightOptions"
          :key="option.value"
          class="yok-transfer__item"
          :class="{ 'yok-transfer__item--disabled': disabled || option.disabled }"
          role="option"
          :aria-selected="rightChecked.includes(option.value) ? 'true' : 'false'"
          :aria-disabled="disabled || option.disabled ? 'true' : undefined"
        >
          <input
            class="yok-transfer__checkbox yok-focus-ring"
            type="checkbox"
            :checked="rightChecked.includes(option.value)"
            :disabled="disabled || option.disabled"
            @change="toggleKey('right', option.value, ($event.target as HTMLInputElement).checked)"
          />
          <span class="yok-transfer__item-content">
            <span class="yok-transfer__item-label">{{ option.label }}</span>
            <span v-if="option.description" class="yok-transfer__item-description">{{ option.description }}</span>
          </span>
        </label>
      </div>
      <div v-else class="yok-transfer__empty" role="status">{{ emptyText }}</div>
    </section>
  </div>
</template>

<style scoped>
.yok-transfer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr);
  gap: var(--yok-space-3);
  align-items: center;
  color: var(--yok-color-text);
}

.yok-transfer__panel {
  display: grid;
  min-width: 0;
  min-height: 260px;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-transfer__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
  border-bottom: 1px solid var(--yok-color-border);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 34%, var(--yok-color-surface));
  padding: var(--yok-space-3);
}

.yok-transfer__select-all,
.yok-transfer__item {
  display: grid;
  min-width: 0;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: var(--yok-space-2);
  align-items: start;
}

.yok-transfer__select-all {
  font-size: 14px;
  font-weight: 750;
}

.yok-transfer__count {
  flex: 0 0 auto;
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 700;
}

.yok-transfer__checkbox {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--yok-color-primary);
  cursor: pointer;
}

.yok-transfer__search {
  min-height: 34px;
  margin: var(--yok-space-3) var(--yok-space-3) 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  padding: 0 var(--yok-space-3);
}

.yok-transfer__search::placeholder {
  color: var(--yok-color-textMuted);
}

.yok-transfer__list {
  display: grid;
  max-height: 260px;
  overflow: auto;
  padding: var(--yok-space-2);
}

.yok-transfer__item {
  border-radius: var(--yok-radius-md);
  cursor: pointer;
  padding: var(--yok-space-2);
}

.yok-transfer__item:hover:not(.yok-transfer__item--disabled) {
  background: var(--yok-color-primarySoft);
}

.yok-transfer__item-content {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.yok-transfer__item-label {
  overflow: hidden;
  font-size: 14px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-transfer__item-description {
  overflow: hidden;
  color: var(--yok-color-textMuted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-transfer__item--disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-transfer__empty {
  display: grid;
  min-height: 160px;
  place-items: center;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  padding: var(--yok-space-5);
  text-align: center;
}

.yok-transfer__actions {
  display: grid;
  gap: var(--yok-space-2);
  justify-items: center;
}

.yok-transfer__action {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 20px;
  font-weight: 800;
}

.yok-transfer__action:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-transfer__action:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.yok-transfer--disabled {
  opacity: 0.68;
}

@media (max-width: 720px) {
  .yok-transfer {
    grid-template-columns: minmax(0, 1fr);
  }

  .yok-transfer__actions {
    grid-template-columns: repeat(2, 36px);
    justify-content: center;
  }
}
</style>
