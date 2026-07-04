<script setup lang="ts">
import { computed } from 'vue'
import { YButton, YTag } from '@yok-ui/core'
import YStatusTimeline from '../status-timeline/YStatusTimeline.vue'
import type { YStatusTimelineTone } from '../status-timeline/YStatusTimeline.vue'

defineOptions({
  name: 'YReviewWorkflow'
})

export type YReviewWorkflowTone = YStatusTimelineTone
export type YReviewWorkflowAction = 'approve' | 'reject' | 'requestChanges'

export interface YReviewWorkflowStep {
  title: string
  value: string
  description?: string
  time?: string
  actor?: string
  tone?: YReviewWorkflowTone
  status?: string
  disabled?: boolean
}

export interface YReviewWorkflowPayload {
  action: YReviewWorkflowAction
  activeValue: string
  activeStep?: YReviewWorkflowStep
}

interface Props {
  items: YReviewWorkflowStep[]
  activeValue?: string
  title?: string
  description?: string
  status?: string
  reviewer?: string
  dueText?: string
  approveText?: string
  rejectText?: string
  requestChangesText?: string
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeValue: '',
  title: 'Review workflow',
  description: '',
  status: '',
  reviewer: '',
  dueText: '',
  approveText: 'Approve',
  rejectText: 'Reject',
  requestChangesText: 'Request changes',
  disabled: false,
  loading: false,
  ariaLabel: 'Review workflow'
})

const emit = defineEmits<{
  approve: [payload: YReviewWorkflowPayload]
  reject: [payload: YReviewWorkflowPayload]
  requestChanges: [payload: YReviewWorkflowPayload]
  action: [payload: YReviewWorkflowPayload]
}>()

const activeStep = computed(() => props.items.find((item) => item.value === props.activeValue))
const statusText = computed(() => props.status || activeStep.value?.status || activeStep.value?.title || 'Pending')
const statusTone = computed<YReviewWorkflowTone>(() => activeStep.value?.tone || 'info')

function createPayload(action: YReviewWorkflowAction): YReviewWorkflowPayload {
  return {
    action,
    activeValue: props.activeValue,
    activeStep: activeStep.value
  }
}

function handleAction(action: YReviewWorkflowAction) {
  if (props.disabled || props.loading) {
    return
  }

  const payload = createPayload(action)
  emit('action', payload)

  if (action === 'approve') {
    emit('approve', payload)
  } else if (action === 'reject') {
    emit('reject', payload)
  } else {
    emit('requestChanges', payload)
  }
}
</script>

<template>
  <section class="yok-review-workflow" :aria-label="ariaLabel" :aria-busy="loading ? 'true' : 'false'">
    <header class="yok-review-workflow__header">
      <div class="yok-review-workflow__copy">
        <div class="yok-review-workflow__title-row">
          <h3>{{ title }}</h3>
          <YTag :tone="statusTone">{{ statusText }}</YTag>
        </div>
        <p v-if="description">{{ description }}</p>
      </div>
      <div v-if="reviewer || dueText || $slots.meta" class="yok-review-workflow__meta">
        <slot name="meta">
          <span v-if="reviewer">{{ reviewer }}</span>
          <time v-if="dueText">{{ dueText }}</time>
        </slot>
      </div>
    </header>

    <YStatusTimeline
      size="sm"
      :items="items"
      :active-value="activeValue"
      aria-label="Review workflow steps"
    >
      <template v-if="$slots.stepActions" #actions="slotProps">
        <slot name="stepActions" v-bind="slotProps" />
      </template>
      <template v-if="$slots.step" #item="slotProps">
        <slot name="step" v-bind="slotProps" />
      </template>
    </YStatusTimeline>

    <footer class="yok-review-workflow__actions">
      <slot name="actions" :active-step="activeStep">
        <YButton
          type="button"
          variant="primary"
          :loading="loading"
          :disabled="disabled"
          @click="handleAction('approve')"
        >
          {{ approveText }}
        </YButton>
        <YButton
          type="button"
          variant="secondary"
          :disabled="disabled || loading"
          @click="handleAction('requestChanges')"
        >
          {{ requestChangesText }}
        </YButton>
        <button
          type="button"
          class="yok-review-workflow__reject yok-focus-ring"
          :disabled="disabled || loading"
          @click="handleAction('reject')"
        >
          {{ rejectText }}
        </button>
      </slot>
    </footer>
  </section>
</template>

<style scoped>
.yok-review-workflow {
  display: grid;
  gap: var(--yok-space-4);
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--yok-color-primarySoft) 58%, transparent),
      transparent 48%
    ),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-4);
}

.yok-review-workflow__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-review-workflow__copy {
  min-width: 0;
}

.yok-review-workflow__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-review-workflow h3,
.yok-review-workflow p {
  margin: 0;
}

.yok-review-workflow h3 {
  color: var(--yok-color-text);
  font-size: 17px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-review-workflow p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.65;
}

.yok-review-workflow__meta {
  display: inline-flex;
  flex: none;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--yok-space-2);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 650;
}

.yok-review-workflow__meta span,
.yok-review-workflow__meta time {
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 76%, var(--yok-color-surface));
  padding: 5px var(--yok-space-2);
}

.yok-review-workflow__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-review-workflow__reject {
  min-height: 38px;
  border: 1px solid color-mix(in srgb, var(--yok-color-danger) 28%, var(--yok-color-border));
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-danger) 8%, var(--yok-color-surface));
  color: var(--yok-color-danger);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  padding: 0 var(--yok-space-4);
  transition:
    background-color var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    transform var(--yok-motion-fast);
}

.yok-review-workflow__reject:hover:not(:disabled) {
  transform: translateY(-1px);
}

.yok-review-workflow__reject:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

@media (max-width: 700px) {
  .yok-review-workflow__header {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-review-workflow__meta {
    justify-content: flex-start;
  }
}
</style>
