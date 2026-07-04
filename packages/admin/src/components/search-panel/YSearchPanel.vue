<script setup lang="ts">
import { YButton, YInput, YSelect } from '@yok-ui/core'
import type { YSelectValue } from '@yok-ui/core'

defineOptions({
  name: 'YSearchPanel'
})

export interface YSearchField {
  key: string
  label: string
  type?: 'input' | 'select'
  placeholder?: string
  options?: Array<{ label: string; value: string; disabled?: boolean }>
}

interface Props {
  modelValue: Record<string, string>
  fields: YSearchField[]
  submitText?: string
  resetText?: string
}

const props = withDefaults(defineProps<Props>(), {
  submitText: 'Search',
  resetText: 'Reset'
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
  search: [value: Record<string, string>]
  reset: []
}>()

function normalizeFieldValue(value: YSelectValue) {
  return Array.isArray(value) ? value[0] ?? '' : value
}

function updateField(key: string, value: YSelectValue) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: normalizeFieldValue(value)
  })
}

function resetFields() {
  emit('update:modelValue', {})
  emit('reset')
}
</script>

<template>
  <form class="yok-search-panel" @submit.prevent="$emit('search', modelValue)">
    <div class="yok-search-panel__fields">
      <template v-for="field in fields" :key="field.key">
        <YSelect
          v-if="field.type === 'select'"
          :model-value="modelValue[field.key] ?? ''"
          :label="field.label"
          :placeholder="field.placeholder"
          :options="field.options ?? []"
          @update:model-value="updateField(field.key, $event)"
        />
        <YInput
          v-else
          :model-value="modelValue[field.key] ?? ''"
          :label="field.label"
          :placeholder="field.placeholder"
          @update:model-value="updateField(field.key, $event)"
        />
      </template>
    </div>
    <div class="yok-search-panel__actions">
      <YButton type="submit" variant="primary">{{ submitText }}</YButton>
      <YButton type="button" variant="ghost" @click="resetFields">{{ resetText }}</YButton>
      <slot name="actions" />
    </div>
  </form>
</template>

<style scoped>
.yok-search-panel {
  display: grid;
  gap: var(--yok-space-4);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-4);
}

.yok-search-panel__fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--yok-space-3);
}

.yok-search-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
}

@media (max-width: 840px) {
  .yok-search-panel__fields {
    grid-template-columns: 1fr;
  }
}
</style>
