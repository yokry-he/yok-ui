<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'YCheckbox'
})

interface Props {
  modelValue?: boolean
  label?: string
  description?: string
  indeterminate?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  description: '',
  indeterminate: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function syncIndeterminate() {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
}

onMounted(syncIndeterminate)

watch(() => props.indeterminate, syncIndeterminate, { flush: 'post' })
</script>

<template>
  <label class="yok-checkbox" :class="{ 'yok-checkbox--disabled': disabled }">
    <input
      ref="inputRef"
      class="yok-checkbox__input yok-focus-ring"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :aria-checked="indeterminate ? 'mixed' : undefined"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="yok-checkbox__box" aria-hidden="true">
      <span v-if="indeterminate" class="yok-checkbox__check">−</span>
      <span v-else-if="modelValue" class="yok-checkbox__check">✓</span>
    </span>
    <span class="yok-checkbox__content">
      <span v-if="label" class="yok-checkbox__label">{{ label }}</span>
      <span v-if="description" class="yok-checkbox__description">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.yok-checkbox {
  position: relative;
  display: inline-grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: var(--yok-space-2);
  align-items: start;
  color: var(--yok-color-text);
  cursor: pointer;
}

.yok-checkbox__input {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
}

.yok-checkbox__box {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-xs);
  background: var(--yok-color-surface);
  transition:
    background var(--yok-motion-fast),
    border-color var(--yok-motion-fast);
}

.yok-checkbox__input:checked + .yok-checkbox__box {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primary);
  color: white;
}

.yok-checkbox__input:focus-visible + .yok-checkbox__box {
  outline: 3px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  outline-offset: 2px;
}

.yok-checkbox__content {
  display: grid;
  gap: 2px;
}

.yok-checkbox__label {
  font-size: 14px;
  font-weight: 650;
}

.yok-checkbox__description {
  color: var(--yok-color-textMuted);
  font-size: 13px;
}

.yok-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.58;
}
</style>
