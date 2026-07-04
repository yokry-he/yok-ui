<script setup lang="ts">
defineOptions({
  name: 'YFormSummary'
})

export interface YFormSummaryItem {
  fieldId: string
  label: string
  message: string
}

interface Props {
  errors: YFormSummaryItem[]
  title?: string
  focusOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Please fix the following fields',
  focusOnClick: true
})

function focusField(fieldId: string) {
  if (!props.focusOnClick || typeof document === 'undefined') {
    return
  }

  const field = document.getElementById(fieldId)

  if (field instanceof HTMLElement) {
    field.focus()
    field.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
  }
}
</script>

<template>
  <section v-if="errors.length" class="yok-form-summary" role="alert" aria-live="assertive" tabindex="-1">
    <strong>{{ title }}</strong>
    <ul>
      <li v-for="error in errors" :key="`${error.fieldId}-${error.message}`">
        <button class="yok-form-summary__link yok-focus-ring" type="button" @click="focusField(error.fieldId)">
          <span>{{ error.label }}</span>
          <span>{{ error.message }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.yok-form-summary {
  display: grid;
  gap: var(--yok-space-3);
  border: 1px solid color-mix(in srgb, var(--yok-color-danger) 42%, var(--yok-color-border));
  border-radius: var(--yok-radius-lg);
  background: color-mix(in srgb, var(--yok-color-danger) 8%, var(--yok-color-surface));
  color: var(--yok-color-text);
  padding: var(--yok-space-4);
}

.yok-form-summary strong {
  color: var(--yok-color-danger);
  font-size: 14px;
}

.yok-form-summary ul {
  display: grid;
  gap: var(--yok-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-form-summary__link {
  display: grid;
  width: 100%;
  gap: var(--yok-space-1);
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: var(--yok-space-2);
  text-align: left;
}

.yok-form-summary__link:hover {
  background: color-mix(in srgb, var(--yok-color-danger) 10%, transparent);
}

.yok-form-summary__link span:first-child {
  font-weight: 750;
}

.yok-form-summary__link span:last-child {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.5;
}
</style>
