<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  YButton,
  YForm,
  YFormItem,
  YFormSummary,
  YInput,
  YSelect,
  YSwitch,
  YTextarea
} from '@yok-ui/core'
import { YFieldArray } from '../field-array'
import type { YFieldArrayItem, YFieldArrayItemKey, YFieldArrayValue } from '../field-array'
import type {
  YFormRule,
  YFormRules,
  YFormSummaryItem,
  YFormValidateResult,
  YFormValue,
  YSelectOption
} from '@yok-ui/core'

defineOptions({
  name: 'YSchemaForm'
})

export type YSchemaFormFieldType = 'input' | 'textarea' | 'select' | 'switch' | 'array'
export type YSchemaFormArrayItemFieldType = Exclude<YSchemaFormFieldType, 'array'>
export type YSchemaFormDensity = 'comfortable' | 'compact'

export interface YSchemaFormArrayItemField {
  key: string
  label: string
  type?: YSchemaFormArrayItemFieldType
  placeholder?: string
  helper?: string
  options?: YSelectOption[]
  required?: boolean
  rules?: YFormRule | YFormRule[]
  disabled?: boolean
  rows?: number
}

export interface YSchemaFormField {
  key: string
  label: string
  type?: YSchemaFormFieldType
  placeholder?: string
  helper?: string
  options?: YSelectOption[]
  required?: boolean
  rules?: YFormRule | YFormRule[]
  disabled?: boolean
  hidden?: boolean
  visibleWhen?: (model: Record<string, unknown>) => boolean
  rows?: number
  addText?: string
  removeText?: string
  emptyText?: string
  itemLabel?: string
  defaultItem?: YFieldArrayItem
  itemKey?: YFieldArrayItemKey
  itemFields?: YSchemaFormArrayItemField[]
  min?: number
  max?: number
}

interface Props {
  modelValue: Record<string, unknown>
  schema: YSchemaFormField[]
  title?: string
  description?: string
  submitText?: string
  resetText?: string
  summaryTitle?: string
  labelWidth?: string
  density?: YSchemaFormDensity
  disabled?: boolean
  scrollToError?: boolean
  showSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  submitText: 'Submit',
  resetText: 'Reset',
  summaryTitle: 'Please fix the following fields',
  labelWidth: '',
  density: 'comfortable',
  disabled: false,
  scrollToError: false,
  showSummary: true
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  submit: [result: YFormValidateResult]
  finish: [value: Record<string, unknown>]
  finishFailed: [result: YFormValidateResult]
  validate: [result: YFormValidateResult]
  reset: [value: Record<string, unknown>]
}>()

const formRef = ref<InstanceType<typeof YForm> | null>(null)
const initialModel = ref<Record<string, unknown>>({ ...props.modelValue })
const workingModel = ref<Record<string, unknown>>({ ...props.modelValue })
const validationResult = ref<YFormValidateResult>({
  valid: true,
  errors: []
})

watch(
  () => props.modelValue,
  (model) => {
    workingModel.value = { ...model }
  },
  { deep: true }
)

const visibleFields = computed(() =>
  props.schema.filter((field) => {
    if (field.hidden) {
      return false
    }

    return field.visibleWhen ? field.visibleWhen(workingModel.value) : true
  })
)
const rules = computed<YFormRules>(() =>
  visibleFields.value.reduce<YFormRules>((ruleMap, field) => {
    const fieldRules = normalizeRules(field.rules)

    if (field.required) {
      fieldRules.unshift({
        required: true,
        message: `${field.label} is required.`
      })
    }

    fieldRules.push(...createArrayItemRules(field))

    if (fieldRules.length) {
      ruleMap[field.key] = fieldRules
    }

    return ruleMap
  }, {})
)
const summaryItems = computed<YFormSummaryItem[]>(() =>
  validationResult.value.errors.flatMap((error) => {
    const field = props.schema.find((item) => item.key === error.prop)
    const label = field?.label ?? error.prop

    return error.messages.map((message) => ({
      fieldId: getSummaryFieldId(error.prop, message),
      label,
      message
    }))
  })
)

function normalizeRules(rule?: YFormRule | YFormRule[]) {
  if (!rule) {
    return []
  }

  return Array.isArray(rule) ? [...rule] : [rule]
}

function isSchemaValueEmpty(value: YFormValue) {
  return value === undefined
    || value === null
    || value === ''
    || (Array.isArray(value) && value.length === 0)
}

function getSchemaValueLength(value: YFormValue) {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length
  }

  if (typeof value === 'number') {
    return value
  }

  return 0
}

function getArrayItemLabel(field: YSchemaFormField, index: number) {
  return `${field.itemLabel || field.label} ${index + 1}`
}

function getSafeFieldKey(key: string) {
  return key.replace(/\W+/g, '-')
}

function getArrayItemValue(item: YFieldArrayItem, itemField: YSchemaFormArrayItemField) {
  return item[itemField.key] as YFormValue
}

function getArrayItemFieldId(field: YSchemaFormField, itemField: YSchemaFormArrayItemField, index: number) {
  return `${getFieldId(field.key)}-${index}-${getSafeFieldKey(itemField.key)}`
}

function getArrayItemFieldMessageId(field: YSchemaFormField, itemField: YSchemaFormArrayItemField, index: number) {
  return `${getArrayItemFieldId(field, itemField, index)}-message`
}

function isArrayItemFieldError(
  field: YSchemaFormField,
  itemField: YSchemaFormArrayItemField,
  index: number,
  message: string
) {
  const prefix = `${getArrayItemLabel(field, index)} `

  if (!message.startsWith(prefix)) {
    return false
  }

  return message.includes(itemField.label)
    || field.itemFields?.findIndex((current) => current.key === itemField.key) === 0
}

function getArrayItemFieldError(field: YSchemaFormField, itemField: YSchemaFormArrayItemField, index: number) {
  return validationResult.value.errors
    .find((error) => error.prop === field.key)
    ?.messages.find((message) => isArrayItemFieldError(field, itemField, index, message)) ?? ''
}

function getArrayItemFieldMessage(field: YSchemaFormField, itemField: YSchemaFormArrayItemField, index: number) {
  return getArrayItemFieldError(field, itemField, index) || itemField.helper || ''
}

function getArrayItemFieldDescribedBy(field: YSchemaFormField, itemField: YSchemaFormArrayItemField, index: number) {
  return getArrayItemFieldMessage(field, itemField, index)
    ? getArrayItemFieldMessageId(field, itemField, index)
    : ''
}

function getArrayErrorFieldId(prop: string, message: string) {
  const field = props.schema.find((item) => item.key === prop)
  const items = field ? getArrayValue(field) : []

  if (!field || field.type !== 'array' || !field.itemFields?.length || !items.length) {
    return ''
  }

  for (const [index] of items.entries()) {
    const itemField = field.itemFields.find((current) => isArrayItemFieldError(field, current, index, message))

    if (itemField) {
      return getArrayItemFieldId(field, itemField, index)
    }
  }

  return ''
}

function getSummaryFieldId(prop: string, message: string) {
  return getArrayErrorFieldId(prop, message) || getFieldId(prop)
}

function createArrayItemRules(field: YSchemaFormField): YFormRule[] {
  if (field.type !== 'array' || !field.itemFields?.length) {
    return []
  }

  return field.itemFields.flatMap((itemField) => {
    const itemFieldRules = normalizeRules(itemField.rules)

    if (itemField.required) {
      itemFieldRules.unshift({
        required: true,
        message: `${itemField.label} is required.`
      })
    }

    return itemFieldRules.map((rule) => ({
      validator: async (value, model) => validateArrayItemRule(field, itemField, rule, value, model)
    }))
  })
}

async function validateArrayItemRule(
  field: YSchemaFormField,
  itemField: YSchemaFormArrayItemField,
  rule: YFormRule,
  value: YFormValue,
  model: Record<string, unknown>
) {
  const items = Array.isArray(value) ? value as YFieldArrayValue : []

  for (const [index, item] of items.entries()) {
    const itemValue = getArrayItemValue(item, itemField)
    const message = await validateArrayItemFieldRule(field, itemField, rule, item, itemValue, index, model)

    if (message) {
      return message
    }
  }

  return true
}

async function validateArrayItemFieldRule(
  field: YSchemaFormField,
  itemField: YSchemaFormArrayItemField,
  rule: YFormRule,
  item: YFieldArrayItem,
  value: YFormValue,
  index: number,
  model: Record<string, unknown>
) {
  if (rule.required && isSchemaValueEmpty(value)) {
    return `${getArrayItemLabel(field, index)} ${rule.message || `${itemField.label} is required.`}`
  }

  if (!isSchemaValueEmpty(value)) {
    const length = getSchemaValueLength(value)

    if (typeof rule.len === 'number' && length !== rule.len) {
      return `${getArrayItemLabel(field, index)} ${rule.message || `${itemField.label} must be ${rule.len} characters.`}`
    }

    if (typeof rule.min === 'number' && length < rule.min) {
      return `${getArrayItemLabel(field, index)} ${rule.message || `${itemField.label} must be at least ${rule.min}.`}`
    }

    if (typeof rule.max === 'number' && length > rule.max) {
      return `${getArrayItemLabel(field, index)} ${rule.message || `${itemField.label} must be at most ${rule.max}.`}`
    }

    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return `${getArrayItemLabel(field, index)} ${rule.message || `${itemField.label} is invalid.`}`
    }
  }

  if (rule.validator) {
    const result = await rule.validator(value, {
      ...model,
      $arrayKey: field.key,
      $item: item,
      $index: index
    })

    if (typeof result === 'string') {
      return `${getArrayItemLabel(field, index)} ${result}`
    }

    if (!result) {
      return `${getArrayItemLabel(field, index)} ${rule.message || `${itemField.label} is invalid.`}`
    }
  }

  return ''
}

function getFieldId(key: string) {
  return `yok-schema-form-field-${getSafeFieldKey(key)}`
}

function getArrayValue(field: YSchemaFormField): YFieldArrayValue {
  const value = workingModel.value[field.key]

  return Array.isArray(value) ? value as YFieldArrayValue : []
}

function updateArrayItemField(
  field: YSchemaFormField,
  index: number,
  item: YFieldArrayItem,
  itemField: YSchemaFormArrayItemField,
  value: YFormValue
) {
  const nextItem = {
    ...item,
    [itemField.key]: value
  }
  const nextValue = getArrayValue(field).map((currentItem, currentIndex) =>
    currentIndex === index ? nextItem : currentItem
  )

  updateField(field, nextValue)
}

function updateField(field: YSchemaFormField, value: YFormValue) {
  workingModel.value = {
    ...workingModel.value,
    [field.key]: value
  }
  emit('update:modelValue', {
    ...workingModel.value,
    [field.key]: value
  })
}

function handleSubmit(result: YFormValidateResult) {
  validationResult.value = result
  emit('validate', result)
  emit('submit', result)

  if (result.valid) {
    emit('finish', { ...workingModel.value })
    return
  }

  emit('finishFailed', result)
}

async function submitForm() {
  const result = await formRef.value?.validate()

  if (result) {
    handleSubmit(result)
  }
}

function handleReset() {
  const nextModel = { ...initialModel.value }

  workingModel.value = nextModel
  validationResult.value = {
    valid: true,
    errors: []
  }
  formRef.value?.clearValidate()
  emit('update:modelValue', nextModel)
  emit('reset', nextModel)
}

defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: handleReset,
  clearValidate: () => {
    validationResult.value = {
      valid: true,
      errors: []
    }
    formRef.value?.clearValidate()
  },
  scrollToField: (key: string) => formRef.value?.scrollToField(key)
})
</script>

<template>
  <section class="yok-schema-form" :class="`yok-schema-form--${density}`">
    <header v-if="title || description || $slots.header" class="yok-schema-form__header">
      <slot name="header">
        <div>
          <h3 v-if="title">{{ title }}</h3>
          <p v-if="description">{{ description }}</p>
        </div>
      </slot>
    </header>

    <YForm
      ref="formRef"
      :model="workingModel"
      :rules="rules"
      :label-width="labelWidth"
      :disabled="disabled"
      :scroll-to-error="scrollToError"
      @submit="handleSubmit"
      @validate="validationResult = $event"
    >
      <YFormSummary
        v-if="showSummary"
        :errors="summaryItems"
        :title="summaryTitle"
      />

      <div class="yok-schema-form__grid">
        <YFormItem
          v-for="field in visibleFields"
          :key="field.key"
          :prop="field.key"
          :label="field.label"
          :label-for="getFieldId(field.key)"
          :hint="field.helper"
          :required="field.required"
          v-slot="{ error, invalid, labelFor, messageId }"
        >
          <slot
            :name="`field-${field.key}`"
            :field="field"
            :value="workingModel[field.key]"
            :error="error"
            :invalid="invalid"
            :update="(value: YFormValue) => updateField(field, value)"
          >
            <YFieldArray
              v-if="field.type === 'array'"
              :model-value="getArrayValue(field)"
              :add-text="field.addText"
              :remove-text="field.removeText"
              :empty-text="field.emptyText"
              :item-label="field.itemLabel || field.label"
              :default-item="field.defaultItem"
              :item-key="field.itemKey"
              :min="field.min"
              :max="field.max"
              :disabled="disabled || field.disabled"
              @update:model-value="updateField(field, $event)"
            >
              <template
                v-if="field.itemFields?.length"
                #default="{ item, index }"
              >
                <div class="yok-schema-form__array-grid">
                  <div
                    v-for="itemField in field.itemFields"
                    :key="itemField.key"
                    class="yok-schema-form__array-field"
                    :class="{ 'yok-schema-form__array-field--wide': itemField.type === 'textarea' }"
                  >
                    <label
                      class="yok-schema-form__array-label"
                      :for="getArrayItemFieldId(field, itemField, index)"
                    >
                      {{ itemField.label }}
                      <span v-if="itemField.required" aria-hidden="true">*</span>
                    </label>
                    <YSelect
                      v-if="itemField.type === 'select'"
                      :id="getArrayItemFieldId(field, itemField, index)"
                      :model-value="String(item[itemField.key] ?? '')"
                      :options="itemField.options ?? []"
                      :placeholder="itemField.placeholder"
                      :invalid="Boolean(getArrayItemFieldError(field, itemField, index))"
                      :aria-describedby="getArrayItemFieldDescribedBy(field, itemField, index)"
                      :disabled="disabled || field.disabled || itemField.disabled"
                      @update:model-value="updateArrayItemField(field, index, item, itemField, $event)"
                    />
                    <YSwitch
                      v-else-if="itemField.type === 'switch'"
                      :model-value="Boolean(item[itemField.key])"
                      :label="itemField.label"
                      :disabled="disabled || field.disabled || itemField.disabled"
                      @update:model-value="updateArrayItemField(field, index, item, itemField, $event)"
                    />
                    <YTextarea
                      v-else-if="itemField.type === 'textarea'"
                      :id="getArrayItemFieldId(field, itemField, index)"
                      :model-value="String(item[itemField.key] ?? '')"
                      :placeholder="itemField.placeholder"
                      :rows="itemField.rows"
                      :invalid="Boolean(getArrayItemFieldError(field, itemField, index))"
                      :aria-describedby="getArrayItemFieldDescribedBy(field, itemField, index)"
                      :disabled="disabled || field.disabled || itemField.disabled"
                      @update:model-value="updateArrayItemField(field, index, item, itemField, $event)"
                    />
                    <YInput
                      v-else
                      :id="getArrayItemFieldId(field, itemField, index)"
                      :model-value="String(item[itemField.key] ?? '')"
                      :placeholder="itemField.placeholder"
                      :invalid="Boolean(getArrayItemFieldError(field, itemField, index))"
                      :aria-describedby="getArrayItemFieldDescribedBy(field, itemField, index)"
                      :disabled="disabled || field.disabled || itemField.disabled"
                      @update:model-value="updateArrayItemField(field, index, item, itemField, $event)"
                    />
                    <p
                      v-if="getArrayItemFieldMessage(field, itemField, index)"
                      :id="getArrayItemFieldMessageId(field, itemField, index)"
                      class="yok-schema-form__array-message"
                      :class="{ 'yok-schema-form__array-message--error': getArrayItemFieldError(field, itemField, index) }"
                      :role="getArrayItemFieldError(field, itemField, index) ? 'alert' : undefined"
                    >
                      {{ getArrayItemFieldMessage(field, itemField, index) }}
                    </p>
                  </div>
                </div>
              </template>
            </YFieldArray>
            <YSelect
              v-else-if="field.type === 'select'"
              :id="labelFor"
              :model-value="String(workingModel[field.key] ?? '')"
              :options="field.options ?? []"
              :placeholder="field.placeholder"
              :error="error"
              :invalid="invalid"
              :aria-describedby="messageId"
              :disabled="disabled || field.disabled"
              @update:model-value="updateField(field, $event)"
            />
            <YSwitch
              v-else-if="field.type === 'switch'"
              :model-value="Boolean(workingModel[field.key])"
              :label="field.label"
              :disabled="disabled || field.disabled"
              @update:model-value="updateField(field, $event)"
            />
            <YTextarea
              v-else-if="field.type === 'textarea'"
              :id="labelFor"
              :model-value="String(workingModel[field.key] ?? '')"
              :placeholder="field.placeholder"
              :helper="field.helper"
              :rows="field.rows"
              :error="error"
              :invalid="invalid"
              :aria-describedby="messageId"
              :disabled="disabled || field.disabled"
              @update:model-value="updateField(field, $event)"
            />
            <YInput
              v-else
              :id="labelFor"
              :model-value="String(workingModel[field.key] ?? '')"
              :placeholder="field.placeholder"
              :error="error"
              :invalid="invalid"
              :aria-describedby="messageId"
              :disabled="disabled || field.disabled"
              @update:model-value="updateField(field, $event)"
            />
          </slot>
        </YFormItem>
      </div>

      <footer class="yok-schema-form__actions">
        <slot name="actions">
          <YButton type="button" variant="primary" @click="submitForm">{{ submitText }}</YButton>
          <YButton type="button" variant="ghost" @click="handleReset">{{ resetText }}</YButton>
        </slot>
      </footer>
    </YForm>
  </section>
</template>

<style scoped>
.yok-schema-form {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-5);
}

.yok-schema-form--compact {
  gap: var(--yok-space-3);
  padding: var(--yok-space-4);
}

.yok-schema-form__header h3,
.yok-schema-form__header p {
  margin: 0;
}

.yok-schema-form__header h3 {
  color: var(--yok-color-text);
  font-size: 18px;
  letter-spacing: 0;
}

.yok-schema-form__header p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-schema-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--yok-space-4);
  min-width: 0;
}

.yok-schema-form--compact .yok-schema-form__grid {
  gap: var(--yok-space-3);
}

.yok-schema-form__array-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-schema-form__array-field {
  display: grid;
  gap: var(--yok-space-1);
  min-width: 0;
}

.yok-schema-form__array-label {
  color: var(--yok-color-text);
  font-size: 13px;
  font-weight: 700;
}

.yok-schema-form__array-label span {
  margin-left: 2px;
  color: var(--yok-color-danger);
}

.yok-schema-form__array-message {
  margin: 0;
  color: var(--yok-color-textMuted);
  font-size: 12px;
  line-height: 1.5;
}

.yok-schema-form__array-message--error {
  color: var(--yok-color-danger);
}

.yok-schema-form__array-field--wide {
  grid-column: 1 / -1;
}

.yok-schema-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  justify-content: flex-end;
}

@media (max-width: 720px) {
  .yok-schema-form {
    padding: var(--yok-space-4);
  }

  .yok-schema-form__grid {
    grid-template-columns: 1fr;
  }

  .yok-schema-form__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 520px) {
  .yok-schema-form__array-grid {
    grid-template-columns: 1fr;
  }
}
</style>
