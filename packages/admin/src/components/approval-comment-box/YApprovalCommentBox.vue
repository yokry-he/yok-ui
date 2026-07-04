<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { YButton, YTag, YTextarea } from '@yok-ui/core'

defineOptions({
  name: 'YApprovalCommentBox'
})

export type YApprovalDecision = 'approve' | 'requestChanges' | 'reject'
export type YApprovalSuggestionTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export interface YApprovalSuggestion {
  label: string
  value: string
  tone?: YApprovalSuggestionTone
  disabled?: boolean
}

export interface YApprovalAttachment {
  name: string
  url?: string
  size?: string
}

export interface YApprovalCommentSubmitPayload {
  decision: YApprovalDecision
  comment: string
  selectedSuggestions: string[]
  suggestions: YApprovalSuggestion[]
  attachments: YApprovalAttachment[]
  reviewer: string
  target: string
}

interface Props {
  modelValue?: string
  decision?: YApprovalDecision
  selectedSuggestions?: string[]
  suggestions?: YApprovalSuggestion[]
  attachments?: YApprovalAttachment[]
  title?: string
  description?: string
  reviewer?: string
  target?: string
  placeholder?: string
  maxLength?: number
  required?: boolean
  disabled?: boolean
  loading?: boolean
  submitText?: string
  cancelText?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  decision: 'approve',
  selectedSuggestions: () => [],
  suggestions: () => [],
  attachments: () => [],
  title: 'Approval comment',
  description: '',
  reviewer: '',
  target: '',
  placeholder: 'Write a clear review comment...',
  maxLength: 500,
  required: true,
  disabled: false,
  loading: false,
  submitText: 'Submit review',
  cancelText: 'Cancel',
  ariaLabel: 'Approval comment'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:decision': [value: YApprovalDecision]
  'update:selectedSuggestions': [value: string[]]
  submit: [payload: YApprovalCommentSubmitPayload]
  cancel: []
  invalid: [message: string]
}>()

const errorMessage = ref('')
const commentLength = computed(() => props.modelValue.length)
const remaining = computed(() => Math.max(props.maxLength - commentLength.value, 0))
const selectedSuggestionItems = computed(() =>
  props.suggestions.filter((suggestion) => props.selectedSuggestions.includes(suggestion.value))
)
const decisionOptions: Array<{ label: string; value: YApprovalDecision; tone: YApprovalSuggestionTone }> = [
  { label: 'Approve', value: 'approve', tone: 'success' },
  { label: 'Request changes', value: 'requestChanges', tone: 'warning' },
  { label: 'Reject', value: 'reject', tone: 'danger' }
]

function updateComment(value: string) {
  if (props.disabled || props.loading) {
    return
  }

  errorMessage.value = ''
  emit('update:modelValue', value.slice(0, props.maxLength))
}

function updateDecision(value: YApprovalDecision) {
  if (props.disabled || props.loading) {
    return
  }

  emit('update:decision', value)
}

function toggleSuggestion(suggestion: YApprovalSuggestion) {
  if (props.disabled || props.loading || suggestion.disabled) {
    return
  }

  const selected = new Set(props.selectedSuggestions)

  if (selected.has(suggestion.value)) {
    selected.delete(suggestion.value)
  } else {
    selected.add(suggestion.value)
  }

  emit('update:selectedSuggestions', Array.from(selected))
}

function submitComment() {
  if (props.disabled || props.loading) {
    return
  }

  const comment = props.modelValue.trim()

  if (props.required && !comment) {
    errorMessage.value = 'Comment is required.'
    emit('invalid', errorMessage.value)
    return
  }

  errorMessage.value = ''
  emit('submit', {
    decision: props.decision,
    comment,
    selectedSuggestions: [...props.selectedSuggestions],
    suggestions: selectedSuggestionItems.value,
    attachments: [...props.attachments],
    reviewer: props.reviewer,
    target: props.target
  })
}

watch(
  () => props.modelValue,
  () => {
    if (errorMessage.value) {
      errorMessage.value = ''
    }
  }
)
</script>

<template>
  <section class="yok-approval-comment-box" :aria-label="ariaLabel" :aria-busy="loading ? 'true' : 'false'">
    <header class="yok-approval-comment-box__header">
      <div class="yok-approval-comment-box__copy">
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div v-if="reviewer || target" class="yok-approval-comment-box__meta">
        <YTag v-if="reviewer" tone="info">{{ reviewer }}</YTag>
        <YTag v-if="target">{{ target }}</YTag>
      </div>
    </header>

    <div class="yok-approval-comment-box__decisions" role="group" aria-label="Review decision">
      <button
        v-for="option in decisionOptions"
        :key="option.value"
        type="button"
        :class="[
          'yok-approval-comment-box__decision',
          'yok-focus-ring',
          `yok-approval-comment-box__decision--${option.tone}`,
          { 'yok-approval-comment-box__decision--active': decision === option.value }
        ]"
        :aria-pressed="decision === option.value ? 'true' : 'false'"
        :disabled="disabled || loading"
        @click="updateDecision(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <YTextarea
      :model-value="modelValue"
      label="Comment"
      :placeholder="placeholder"
      :rows="4"
      :disabled="disabled || loading"
      :error="errorMessage"
      @update:model-value="updateComment"
    />

    <div class="yok-approval-comment-box__footer-row">
      <span class="yok-approval-comment-box__counter" :data-limit="remaining === 0 ? 'true' : undefined">
        {{ commentLength }} / {{ maxLength }}
      </span>
      <span v-if="required" class="yok-approval-comment-box__required">Required</span>
    </div>

    <div v-if="suggestions.length" class="yok-approval-comment-box__suggestions" aria-label="Comment suggestions">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.value"
        type="button"
        :class="[
          'yok-approval-comment-box__suggestion',
          'yok-focus-ring',
          `yok-approval-comment-box__suggestion--${suggestion.tone || 'neutral'}`,
          { 'yok-approval-comment-box__suggestion--selected': selectedSuggestions.includes(suggestion.value) }
        ]"
        :aria-pressed="selectedSuggestions.includes(suggestion.value) ? 'true' : 'false'"
        :disabled="disabled || loading || suggestion.disabled"
        @click="toggleSuggestion(suggestion)"
      >
        {{ suggestion.label }}
      </button>
    </div>

    <ul v-if="attachments.length" class="yok-approval-comment-box__attachments" aria-label="Review attachments">
      <li v-for="attachment in attachments" :key="attachment.name">
        <a v-if="attachment.url" :href="attachment.url">{{ attachment.name }}</a>
        <span v-else>{{ attachment.name }}</span>
        <small v-if="attachment.size">{{ attachment.size }}</small>
      </li>
    </ul>

    <footer class="yok-approval-comment-box__actions">
      <YButton
        class="yok-approval-comment-box__submit"
        type="button"
        variant="primary"
        :loading="loading"
        :disabled="disabled || loading"
        @click="submitComment"
      >
        {{ submitText }}
      </YButton>
      <YButton
        class="yok-approval-comment-box__cancel"
        type="button"
        variant="secondary"
        @click="$emit('cancel')"
      >
        {{ cancelText }}
      </YButton>
    </footer>
  </section>
</template>

<style scoped>
.yok-approval-comment-box {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--yok-color-primarySoft) 58%, transparent),
      transparent 52%
    ),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  color: var(--yok-color-text);
  padding: var(--yok-space-4);
}

.yok-approval-comment-box__header,
.yok-approval-comment-box__footer-row,
.yok-approval-comment-box__actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-approval-comment-box__copy {
  min-width: 0;
}

.yok-approval-comment-box h3,
.yok-approval-comment-box p {
  margin: 0;
}

.yok-approval-comment-box h3 {
  font-size: 17px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-approval-comment-box p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-approval-comment-box__meta,
.yok-approval-comment-box__decisions,
.yok-approval-comment-box__suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-approval-comment-box__meta {
  flex: none;
  justify-content: flex-end;
}

.yok-approval-comment-box__decision,
.yok-approval-comment-box__suggestion {
  min-height: 32px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 740;
  letter-spacing: 0;
  padding: 0 var(--yok-space-3);
}

.yok-approval-comment-box__decision--active,
.yok-approval-comment-box__suggestion--selected {
  border-color: color-mix(in srgb, var(--yok-color-primary) 32%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-primarySoft) 72%, var(--yok-color-surface));
  color: var(--yok-color-primary);
}

.yok-approval-comment-box__decision--success.yok-approval-comment-box__decision--active,
.yok-approval-comment-box__suggestion--success.yok-approval-comment-box__suggestion--selected {
  border-color: color-mix(in srgb, var(--yok-color-success) 32%, var(--yok-color-border));
  color: var(--yok-color-success);
}

.yok-approval-comment-box__decision--warning.yok-approval-comment-box__decision--active,
.yok-approval-comment-box__suggestion--warning.yok-approval-comment-box__suggestion--selected {
  border-color: color-mix(in srgb, var(--yok-color-warning) 34%, var(--yok-color-border));
  color: var(--yok-color-warning);
}

.yok-approval-comment-box__decision--danger.yok-approval-comment-box__decision--active,
.yok-approval-comment-box__suggestion--danger.yok-approval-comment-box__suggestion--selected {
  border-color: color-mix(in srgb, var(--yok-color-danger) 32%, var(--yok-color-border));
  color: var(--yok-color-danger);
}

.yok-approval-comment-box__decision:disabled,
.yok-approval-comment-box__suggestion:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.yok-approval-comment-box__counter,
.yok-approval-comment-box__required {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 700;
}

.yok-approval-comment-box__counter[data-limit='true'] {
  color: var(--yok-color-danger);
}

.yok-approval-comment-box__attachments {
  display: grid;
  gap: var(--yok-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-approval-comment-box__attachments li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 70%, var(--yok-color-surface));
  padding: var(--yok-space-2) var(--yok-space-3);
}

.yok-approval-comment-box__attachments a,
.yok-approval-comment-box__attachments span {
  min-width: 0;
  overflow: hidden;
  color: var(--yok-color-primary);
  font-weight: 740;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-approval-comment-box__attachments small {
  flex: none;
  color: var(--yok-color-textMuted);
}

.yok-approval-comment-box__actions {
  flex-wrap: wrap;
  justify-content: flex-start;
}

@media (max-width: 620px) {
  .yok-approval-comment-box__header,
  .yok-approval-comment-box__footer-row {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-approval-comment-box__meta {
    justify-content: flex-start;
  }
}
</style>
