<script setup lang="ts">
import { computed } from 'vue'
import YSelect from '../select/YSelect.vue'
import type { YSelectOption, YSelectRemoteMethod, YSelectSize, YSelectValue } from '../select'

defineOptions({
  name: 'YVirtualizedSelect'
})

interface Props {
  id?: string
  modelValue?: YSelectValue
  options: YSelectOption[]
  label?: string
  ariaLabel?: string
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
  loading?: boolean
  loadingText?: string
  remoteMethod?: YSelectRemoteMethod
  remoteErrorText?: string
  searchPlaceholder?: string
  emptyText?: string
  size?: YSelectSize
  height?: number
  itemHeight?: number
  overscan?: number
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  ariaLabel: '',
  placeholder: 'Select an option',
  error: '',
  invalid: false,
  ariaDescribedby: '',
  disabled: false,
  clearable: false,
  multiple: false,
  collapseTags: false,
  maxCollapseTags: 1,
  filterable: false,
  loading: false,
  loadingText: 'Loading options',
  remoteErrorText: 'Failed to load options',
  searchPlaceholder: 'Search options',
  emptyText: 'No matching options',
  height: 240,
  itemHeight: 36,
  overscan: 4
})

const emit = defineEmits<{
  'update:modelValue': [value: YSelectValue]
  change: [value: YSelectValue]
  clear: []
  remove: [value: string]
  visibleChange: [open: boolean]
  search: [query: string]
}>()

const normalizedHeight = computed(() => Math.max(1, props.height))
const normalizedItemHeight = computed(() => Math.max(1, props.itemHeight))
const normalizedOverscan = computed(() => Math.max(0, props.overscan))
</script>

<template>
  <div class="yok-virtualized-select">
    <YSelect
      :id="id"
      :model-value="modelValue"
      :options="options"
      :label="label"
      :aria-label="ariaLabel"
      :placeholder="placeholder"
      :error="error"
      :invalid="invalid"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :clearable="clearable"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :max-collapse-tags="maxCollapseTags"
      :filterable="filterable"
      :loading="loading"
      :loading-text="loadingText"
      :remote-method="remoteMethod"
      :remote-error-text="remoteErrorText"
      :search-placeholder="searchPlaceholder"
      :empty-text="emptyText"
      :size="size"
      virtualized
      :virtual-height="normalizedHeight"
      :virtual-item-height="normalizedItemHeight"
      :virtual-overscan="normalizedOverscan"
      @update:model-value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
      @clear="emit('clear')"
      @remove="emit('remove', $event)"
      @visible-change="emit('visibleChange', $event)"
      @search="emit('search', $event)"
    />
  </div>
</template>

<style scoped>
.yok-virtualized-select {
  min-width: 0;
  color: var(--yok-color-text);
}
</style>
