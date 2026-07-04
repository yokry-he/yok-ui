<script setup lang="ts">
import { computed } from 'vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YTextarea'
})

interface Props {
  id?: string
  modelValue?: string
  label?: string
  placeholder?: string
  helper?: string
  error?: string
  invalid?: boolean
  ariaDescribedby?: string
  rows?: number
  disabled?: boolean
  size?: YokConfigSize
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  label: '',
  placeholder: '',
  helper: '',
  error: '',
  invalid: false,
  ariaDescribedby: '',
  rows: 4,
  disabled: false
})

const yokConfig = useYokConfig()
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const resolvedDensity = computed(() => yokConfig.density.value)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="yok-textarea" :class="[`yok-textarea--${resolvedSize}`, `yok-textarea--${resolvedDensity}`]">
    <span v-if="label" class="yok-textarea__label">{{ label }}</span>
    <textarea
      :id="id || undefined"
      class="yok-textarea__control yok-focus-ring"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :aria-invalid="error || invalid ? 'true' : 'false'"
      :aria-describedby="ariaDescribedby || undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="error" class="yok-textarea__error">{{ error }}</span>
    <span v-else-if="helper" class="yok-textarea__helper">{{ helper }}</span>
  </label>
</template>

<style scoped>
.yok-textarea {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-textarea__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-textarea__control {
  width: 100%;
  resize: vertical;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  line-height: 1.6;
}

.yok-textarea--sm .yok-textarea__control {
  min-height: 80px;
  font-size: 13px;
  padding: var(--yok-space-2);
}

.yok-textarea--md .yok-textarea__control {
  min-height: 96px;
  font-size: 14px;
  padding: var(--yok-space-3);
}

.yok-textarea--lg .yok-textarea__control {
  min-height: 112px;
  font-size: 15px;
  padding: var(--yok-space-4);
}

.yok-textarea--compact {
  gap: var(--yok-space-1);
}

.yok-textarea--compact.yok-textarea--sm .yok-textarea__control {
  min-height: 72px;
}

.yok-textarea--compact.yok-textarea--md .yok-textarea__control {
  min-height: 84px;
  padding: var(--yok-space-2);
}

.yok-textarea--compact.yok-textarea--lg .yok-textarea__control {
  min-height: 96px;
  padding: var(--yok-space-3);
}

.yok-textarea__control[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-textarea__helper,
.yok-textarea__error {
  font-size: 12px;
}

.yok-textarea__helper {
  color: var(--yok-color-textMuted);
}

.yok-textarea__error {
  color: var(--yok-color-danger);
}
</style>
