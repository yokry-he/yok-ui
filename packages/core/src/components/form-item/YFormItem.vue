<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import type { YFormContext, YFormValidateTrigger } from '../form'

defineOptions({
  name: 'YFormItem'
})

interface Props {
  prop?: string
  label?: string
  labelFor?: string
  hint?: string
  error?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  prop: '',
  label: '',
  labelFor: '',
  hint: '',
  error: '',
  required: false
})

const form = inject<YFormContext | null>('yokForm', null)
const fieldId = computed(() => props.labelFor || (props.prop ? `yok-form-field-${props.prop.replace(/\W+/g, '-')}` : ''))
const messageId = computed(() => props.prop ? `yok-form-message-${props.prop.replace(/\W+/g, '-')}` : undefined)
const formError = computed(() => props.prop ? form?.getFieldError(props.prop) ?? '' : '')
const resolvedError = computed(() => props.error || formError.value)
const hasLabelGrid = computed(() => Boolean(form?.labelWidth && props.label))
const formItemRef = ref<HTMLElement | null>(null)
function clearValidate() {
  if (props.prop) {
    form?.clearValidate(props.prop)
  }
}

function validate(trigger?: YFormValidateTrigger) {
  if (!props.prop) {
    return Promise.resolve(true)
  }

  return form?.validateField(props.prop, trigger) ?? Promise.resolve(true)
}

const slotState = computed(() => ({
  error: resolvedError.value,
  invalid: Boolean(resolvedError.value),
  labelFor: fieldId.value,
  messageId: messageId.value,
  validate,
  clearValidate
}))

onMounted(() => {
  if (!form || !props.prop) {
    return
  }

  form.registerField({
    prop: props.prop,
    element: formItemRef.value,
    clearValidate,
    resetField: clearValidate,
    validate
  })
})

onUnmounted(() => {
  if (props.prop) {
    form?.unregisterField(props.prop)
  }
})

defineExpose({
  clearValidate,
  validate
})
</script>

<template>
  <div
    ref="formItemRef"
    class="yok-form-item"
    :class="{ 'yok-form-item--invalid': resolvedError, 'yok-form-item--label-grid': hasLabelGrid }"
  >
    <label v-if="label" class="yok-form-item__label" :for="fieldId || undefined">
      <span>{{ label }}</span>
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <div class="yok-form-item__control">
      <slot v-bind="slotState" />
    </div>
    <p v-if="resolvedError" :id="messageId" class="yok-form-item__message" role="alert">{{ resolvedError }}</p>
    <p v-else-if="hint" class="yok-form-item__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.yok-form-item {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-form-item__label {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-1);
  color: var(--yok-color-text);
  font-size: 13px;
  font-weight: 750;
}

.yok-form-item__label span:last-child {
  color: var(--yok-color-danger);
}

.yok-form-item__control {
  min-width: 0;
}

.yok-form-item--label-grid {
  grid-template-columns: var(--yok-form-label-width) minmax(0, 1fr);
  align-items: start;
  column-gap: var(--yok-space-3);
}

.yok-form-item--label-grid .yok-form-item__label {
  min-height: 38px;
  align-items: center;
}

.yok-form-item--label-grid .yok-form-item__message,
.yok-form-item--label-grid .yok-form-item__hint {
  grid-column: 2;
}

.yok-form-item__message,
.yok-form-item__hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.yok-form-item__message {
  color: var(--yok-color-danger);
}

.yok-form-item__hint {
  color: var(--yok-color-textMuted);
}
</style>
