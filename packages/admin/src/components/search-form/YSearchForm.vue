<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { YButton, YDatePicker, YDateRangePicker, YInput, YSelect } from '@yok-ui/core'
import type { YDateRangeShortcut, YDateRangeValue, YDateShortcut, YSelectValue } from '@yok-ui/core'

defineOptions({
  name: 'YSearchForm'
})

export type YSearchFormFieldType = 'input' | 'select' | 'date' | 'dateRange'
export type YSearchFormDensity = 'comfortable' | 'compact'
export type YSearchFormValue = string | YDateRangeValue
export type YSearchFormOptionsLoader = () => YSearchFormOption[] | Promise<YSearchFormOption[]>
export type YSearchFormOptionsSource = YSearchFormOption[] | YSearchFormOptionsLoader

export interface YSearchFormOption {
  label: string
  value: string
  disabled?: boolean
}

export interface YSearchFormField {
  key: string
  label: string
  type?: YSearchFormFieldType
  placeholder?: string
  options?: YSearchFormOptionsSource
  shortcuts?: YDateShortcut[] | YDateRangeShortcut[]
  defaultValue?: YSearchFormValue
  disabled?: boolean
  hidden?: boolean
}

export interface YSearchFormSubmitPayload {
  values: Record<string, YSearchFormValue>
  activeFieldKeys: string[]
}

interface Props {
  modelValue: Record<string, YSearchFormValue>
  fields: YSearchFormField[]
  title?: string
  description?: string
  submitText?: string
  resetText?: string
  collapseText?: string
  expandText?: string
  collapsedCount?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
  density?: YSearchFormDensity
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  submitText: 'Search',
  resetText: 'Reset',
  collapseText: 'Collapse',
  expandText: 'More filters',
  collapsedCount: 3,
  collapsible: true,
  defaultCollapsed: true,
  density: 'comfortable',
  ariaLabel: 'Search form'
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, YSearchFormValue>]
  search: [payload: YSearchFormSubmitPayload]
  reset: [value: Record<string, YSearchFormValue>]
  collapseChange: [collapsed: boolean]
}>()

interface AsyncOptionsState {
  options: YSearchFormOption[]
  loading: boolean
  error: string
}

const collapsed = ref(props.defaultCollapsed)
const asyncOptionsState = ref<Record<string, AsyncOptionsState>>({})
let optionsRequestVersion = 0
const visibleFields = computed(() => props.fields.filter((field) => !field.hidden))
const visibleFieldKeys = computed(() => visibleFields.value.map((field) => field.key))
const shouldShowCollapse = computed(() => props.collapsible && visibleFields.value.length > props.collapsedCount)
const renderedFields = computed(() => {
  if (!shouldShowCollapse.value || !collapsed.value) {
    return visibleFields.value
  }

  return visibleFields.value.slice(0, props.collapsedCount)
})
const activeFieldCount = computed(() => {
  return visibleFields.value.filter((field) => {
    return isActiveValue(props.modelValue[field.key])
  }).length
})
const summaryText = computed(() => {
  if (!activeFieldCount.value) {
    return 'No filters applied'
  }

  return `${activeFieldCount.value} filter${activeFieldCount.value > 1 ? 's' : ''} applied`
})

function isActiveValue(value: YSearchFormValue | undefined) {
  if (Array.isArray(value)) {
    return value.length === 2 && value.every((item) => item.length > 0)
  }

  return typeof value === 'string' && value.length > 0
}

function normalizeFieldValue(field: YSearchFormField, value: YSearchFormValue | YSelectValue): YSearchFormValue {
  if (field.type === 'dateRange') {
    return Array.isArray(value) && value.length === 2 ? [value[0] ?? '', value[1] ?? ''] : []
  }

  return Array.isArray(value) ? value[0] ?? '' : value
}

function isOptionsLoader(options: YSearchFormOptionsSource | undefined): options is YSearchFormOptionsLoader {
  return typeof options === 'function'
}

function getSelectOptions(field: YSearchFormField): YSearchFormOption[] {
  if (Array.isArray(field.options)) {
    return field.options
  }

  return asyncOptionsState.value[field.key]?.options ?? []
}

function isSelectOptionsLoading(field: YSearchFormField) {
  return isOptionsLoader(field.options) && Boolean(asyncOptionsState.value[field.key]?.loading)
}

function getSelectOptionsError(field: YSearchFormField) {
  return isOptionsLoader(field.options) ? asyncOptionsState.value[field.key]?.error ?? '' : ''
}

function getStringValue(value: YSearchFormValue | undefined) {
  return typeof value === 'string' ? value : ''
}

function getRangeValue(value: YSearchFormValue | undefined): YDateRangeValue {
  return Array.isArray(value) && value.length === 2 ? [value[0] ?? '', value[1] ?? ''] : []
}

function getDateShortcuts(field: YSearchFormField): YDateShortcut[] {
  return field.type === 'date' && field.shortcuts ? field.shortcuts as YDateShortcut[] : []
}

function getDateRangeShortcuts(field: YSearchFormField): YDateRangeShortcut[] {
  return field.type === 'dateRange' && field.shortcuts ? field.shortcuts as YDateRangeShortcut[] : []
}

function updateField(field: YSearchFormField, value: YSearchFormValue | YSelectValue) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field.key]: normalizeFieldValue(field, value)
  })
}

function createDefaultValues() {
  return props.fields.reduce<Record<string, YSearchFormValue>>((values, field) => {
    if (field.defaultValue !== undefined) {
      values[field.key] = field.defaultValue
    }

    return values
  }, {})
}

function handleSearch() {
  emit('search', {
    values: { ...props.modelValue },
    activeFieldKeys: visibleFieldKeys.value.filter((key) => {
      return isActiveValue(props.modelValue[key])
    })
  })
}

function handleReset() {
  const nextValues = createDefaultValues()
  emit('update:modelValue', nextValues)
  emit('reset', nextValues)
}

function toggleCollapsed() {
  collapsed.value = !collapsed.value
  emit('collapseChange', collapsed.value)
}

watch(() => props.fields, (fields) => {
  const version = ++optionsRequestVersion

  fields.forEach((field) => {
    if (field.type !== 'select' || !isOptionsLoader(field.options)) {
      return
    }

    asyncOptionsState.value = {
      ...asyncOptionsState.value,
      [field.key]: {
        options: asyncOptionsState.value[field.key]?.options ?? [],
        loading: true,
        error: ''
      }
    }

    Promise.resolve(field.options())
      .then((options) => {
        if (version !== optionsRequestVersion) {
          return
        }

        asyncOptionsState.value = {
          ...asyncOptionsState.value,
          [field.key]: {
            options,
            loading: false,
            error: ''
          }
        }
      })
      .catch(() => {
        if (version !== optionsRequestVersion) {
          return
        }

        asyncOptionsState.value = {
          ...asyncOptionsState.value,
          [field.key]: {
            options: [],
            loading: false,
            error: 'Failed to load presets'
          }
        }
      })
  })
}, { immediate: true })
</script>

<template>
  <form
    class="yok-search-form"
    :class="`yok-search-form--${density}`"
    :aria-label="ariaLabel"
    @submit.prevent="handleSearch"
  >
    <header v-if="title || description || $slots.header" class="yok-search-form__header">
      <slot name="header">
        <div class="yok-search-form__copy">
          <h3 v-if="title">{{ title }}</h3>
          <p v-if="description">{{ description }}</p>
        </div>
      </slot>
      <span class="yok-search-form__summary" role="status" aria-live="polite">
        {{ summaryText }}
      </span>
    </header>

    <div class="yok-search-form__fields">
      <div
        v-for="field in renderedFields"
        :key="field.key"
        class="yok-search-form__field"
      >
        <slot
          :name="`field-${field.key}`"
          :field="field"
          :value="modelValue[field.key] ?? ''"
          :update="(value: YSearchFormValue) => updateField(field, value)"
        >
          <template v-if="field.type === 'select'">
            <YSelect
              :model-value="getStringValue(modelValue[field.key])"
              :label="field.label"
              :placeholder="field.placeholder"
              :options="getSelectOptions(field)"
              :disabled="field.disabled || isSelectOptionsLoading(field)"
              @update:model-value="updateField(field, $event)"
            />
            <p
              v-if="isSelectOptionsLoading(field)"
              class="yok-search-form__field-status"
              role="status"
            >
              Loading presets
            </p>
            <p
              v-else-if="getSelectOptionsError(field)"
              class="yok-search-form__field-status yok-search-form__field-status--error"
              role="alert"
            >
              {{ getSelectOptionsError(field) }}
            </p>
          </template>
          <YDatePicker
            v-else-if="field.type === 'date'"
            :model-value="getStringValue(modelValue[field.key])"
            :label="field.label"
            :placeholder="field.placeholder"
            :shortcuts="getDateShortcuts(field)"
            :disabled="field.disabled"
            @update:model-value="updateField(field, $event)"
          />
          <YDateRangePicker
            v-else-if="field.type === 'dateRange'"
            :model-value="getRangeValue(modelValue[field.key])"
            :label="field.label"
            :placeholder="field.placeholder"
            :shortcuts="getDateRangeShortcuts(field)"
            :disabled="field.disabled"
            @update:model-value="updateField(field, $event)"
          />
          <YInput
            v-else
            :model-value="getStringValue(modelValue[field.key])"
            :label="field.label"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @update:model-value="updateField(field, $event)"
          />
        </slot>
      </div>
    </div>

    <footer class="yok-search-form__actions">
      <div class="yok-search-form__primary-actions">
        <YButton type="submit" variant="primary">{{ submitText }}</YButton>
        <YButton type="button" variant="ghost" @click="handleReset">{{ resetText }}</YButton>
        <YButton
          v-if="shouldShowCollapse"
          type="button"
          variant="secondary"
          :aria-expanded="collapsed ? 'false' : 'true'"
          @click="toggleCollapsed"
        >
          {{ collapsed ? expandText : collapseText }}
        </YButton>
      </div>
      <div v-if="$slots.actions" class="yok-search-form__extra-actions">
        <slot name="actions" />
      </div>
    </footer>
  </form>
</template>

<style scoped>
.yok-search-form {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--yok-color-primarySoft) 52%, transparent),
      transparent 48%
    ),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-4);
}

.yok-search-form--compact {
  gap: var(--yok-space-3);
  padding: var(--yok-space-3);
}

.yok-search-form__header,
.yok-search-form__actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-search-form__copy {
  min-width: 0;
}

.yok-search-form h3,
.yok-search-form p {
  margin: 0;
}

.yok-search-form h3 {
  color: var(--yok-color-text);
  font-size: 16px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-search-form p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-search-form__summary {
  flex: none;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 18%, var(--yok-color-border));
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 72%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 760;
  padding: 5px var(--yok-space-2);
}

.yok-search-form__fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-search-form--compact .yok-search-form__fields {
  gap: var(--yok-space-2);
}

.yok-search-form__field {
  min-width: 0;
}

.yok-search-form__field-status {
  margin: var(--yok-space-1) 0 0;
  color: var(--yok-color-textMuted);
  font-size: 12px;
  line-height: 1.45;
}

.yok-search-form__field-status--error {
  color: var(--yok-color-danger);
}

.yok-search-form__primary-actions,
.yok-search-form__extra-actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
}

.yok-search-form__extra-actions {
  justify-content: flex-end;
}

@media (max-width: 920px) {
  .yok-search-form__fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .yok-search-form__header,
  .yok-search-form__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-search-form__summary {
    width: fit-content;
  }

  .yok-search-form__fields {
    grid-template-columns: 1fr;
  }

  .yok-search-form__extra-actions {
    justify-content: flex-start;
  }
}
</style>
