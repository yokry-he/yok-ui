<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue'
import {
  cloneFormModel,
  getFormValue,
  setFormValue,
  validateForm,
  validateFormField
} from './form'
import type {
  YFormContext,
  YFormFieldContext,
  YFormRules,
  YFormScrollIntoViewOptions,
  YFormValidateResult,
  YFormValidateTrigger
} from './types'

defineOptions({
  name: 'YForm'
})

interface Props {
  model: Record<string, unknown>
  rules?: YFormRules
  labelWidth?: string
  disabled?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: YFormScrollIntoViewOptions
}

const props = withDefaults(defineProps<Props>(), {
  rules: () => ({}),
  labelWidth: '',
  disabled: false,
  scrollToError: false,
  scrollIntoViewOptions: () => ({
    block: 'center',
    behavior: 'smooth'
  })
})

const emit = defineEmits<{
  validate: [result: YFormValidateResult]
  submit: [result: YFormValidateResult, event: SubmitEvent]
}>()

const fields = new Map<string, YFormFieldContext>()
const errors = reactive<Record<string, string[]>>({})
const initialModel = ref<Record<string, unknown>>({})

function setFieldErrors(prop: string, messages: string[]) {
  if (messages.length) {
    errors[prop] = messages
    return
  }

  delete errors[prop]
}

function normalizeProps(targets?: string | string[]) {
  if (!targets) {
    return Array.from(fields.keys())
  }

  return Array.isArray(targets) ? targets : [targets]
}

function getFieldError(prop: string) {
  return errors[prop]?.[0] ?? ''
}

function clearValidate(targets?: string | string[]) {
  normalizeProps(targets).forEach((prop) => {
    delete errors[prop]
  })
}

function scrollToField(prop: string, options = props.scrollIntoViewOptions) {
  const field = fields.get(prop)
  const element = field?.element

  if (!element?.scrollIntoView) {
    return false
  }

  element.scrollIntoView(options)
  return true
}

async function validateField(prop: string, trigger?: YFormValidateTrigger) {
  const messages = await validateFormField(props.model, props.rules, prop, trigger)
  setFieldErrors(prop, messages)
  return messages.length === 0
}

async function validate(trigger?: YFormValidateTrigger) {
  const result = await validateForm(props.model, props.rules, Array.from(fields.keys()), trigger)
  clearValidate()
  result.errors.forEach((error) => setFieldErrors(error.prop, error.messages))
  emit('validate', result)

  if (props.scrollToError && result.errors[0]) {
    scrollToField(result.errors[0].prop)
  }

  return result
}

function resetFields(targets?: string | string[]) {
  normalizeProps(targets).forEach((prop) => {
    setFormValue(props.model, prop, getFormValue(initialModel.value, prop))
    delete errors[prop]
  })
}

function registerField(field: YFormFieldContext) {
  fields.set(field.prop, field)
}

function unregisterField(prop: string) {
  fields.delete(prop)
  delete errors[prop]
}

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault()
  const result = await validate('submit')
  emit('submit', result, event)
}

onMounted(() => {
  initialModel.value = cloneFormModel(props.model)
})

provide<YFormContext>('yokForm', {
  model: props.model,
  labelWidth: props.labelWidth,
  getFieldError,
  registerField,
  unregisterField,
  validateField,
  clearValidate,
  scrollToField
})

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField
})
</script>

<template>
  <form
    class="yok-form"
    :class="{ 'yok-form--disabled': disabled }"
    :style="{ '--yok-form-label-width': labelWidth || undefined }"
    novalidate
    @submit="handleSubmit"
  >
    <fieldset class="yok-form__fieldset" :disabled="disabled">
      <slot />
    </fieldset>
  </form>
</template>

<style scoped>
.yok-form {
  display: grid;
  gap: var(--yok-space-4);
  color: var(--yok-color-text);
}

.yok-form__fieldset {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  margin: 0;
  border: 0;
  padding: 0;
}

.yok-form--disabled {
  cursor: not-allowed;
}
</style>
