<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YSwitch'
})

interface Props {
  modelValue?: boolean
  id?: string
  label?: string
  description?: string
  activeText?: string
  inactiveText?: string
  disabled?: boolean
  loading?: boolean
  invalid?: boolean
  error?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  id: '',
  label: '',
  description: '',
  activeText: '',
  inactiveText: '',
  disabled: false,
  loading: false,
  invalid: false,
  error: '',
  ariaDescribedby: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const hasInvalidState = computed(() => props.invalid || Boolean(props.error))
const stateText = computed(() => props.modelValue ? props.activeText : props.inactiveText)
const describedby = computed(() => props.ariaDescribedby || undefined)

function toggle() {
  if (props.disabled || props.loading) {
    return
  }

  const nextValue = !props.modelValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<template>
  <span class="yok-switch-wrap">
    <button
      :id="id || undefined"
      class="yok-switch yok-focus-ring"
      :class="{
        'yok-switch--checked': modelValue,
        'yok-switch--invalid': hasInvalidState,
        'yok-switch--loading': loading
      }"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-invalid="hasInvalidState ? 'true' : undefined"
      :aria-describedby="describedby"
      :aria-busy="loading ? 'true' : undefined"
      :disabled="disabled || loading"
      @click="toggle"
    >
      <span class="yok-switch__track" aria-hidden="true">
        <span class="yok-switch__thumb">
          <span v-if="loading" class="yok-switch__spinner" />
        </span>
      </span>
      <span v-if="label || description || stateText" class="yok-switch__content">
        <span v-if="label" class="yok-switch__label">{{ label }}</span>
        <span v-if="stateText" class="yok-switch__state">{{ stateText }}</span>
        <span v-if="description" class="yok-switch__description">{{ description }}</span>
      </span>
    </button>
    <span v-if="error" class="yok-switch__error" role="alert">{{ error }}</span>
  </span>
</template>

<style scoped>
.yok-switch-wrap {
  display: inline-grid;
  gap: var(--yok-space-1);
}

.yok-switch {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--yok-space-2);
  border: 0;
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  text-align: left;
}

.yok-switch__track {
  flex: 0 0 42px;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: var(--yok-color-border);
  padding: 3px;
  transition: background var(--yok-motion-fast);
}

.yok-switch__thumb {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: white;
  box-shadow: var(--yok-shadow-soft);
  transition: transform var(--yok-motion-fast);
}

.yok-switch__spinner {
  display: block;
  width: 12px;
  height: 12px;
  margin: 3px;
  border: 2px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  border-top-color: var(--yok-color-primary);
  border-radius: 999px;
  animation: yok-switch-spin 0.8s linear infinite;
}

.yok-switch__content {
  display: grid;
  gap: 2px;
}

.yok-switch__label {
  font-weight: 650;
}

.yok-switch__state,
.yok-switch__description {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.4;
}

.yok-switch--checked .yok-switch__track {
  background: var(--yok-color-primary);
}

.yok-switch--checked .yok-switch__thumb {
  transform: translateX(18px);
}

.yok-switch--invalid .yok-switch__track {
  outline: 2px solid color-mix(in srgb, var(--yok-color-danger) 35%, transparent);
  outline-offset: 2px;
}

.yok-switch:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.yok-switch__error {
  color: var(--yok-color-danger);
  font-size: 12px;
  line-height: 1.5;
}

@keyframes yok-switch-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
