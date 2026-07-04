<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YBulkActionBar'
})

export type YBulkActionTone = 'neutral' | 'danger' | 'warning' | 'success' | 'info'

export interface YBulkActionItem {
  label: string
  value: string
  tone?: YBulkActionTone
  disabled?: boolean
}

export interface YBulkActionPayload {
  action: YBulkActionItem
  selectedRowKeys: string[]
}

interface Props {
  selectedRowKeys: string[]
  actions?: YBulkActionItem[]
  title?: string
  clearText?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  title: '',
  clearText: 'Clear',
  ariaLabel: 'Bulk actions'
})

const emit = defineEmits<{
  clear: []
  action: [payload: YBulkActionPayload]
}>()

const selectedCount = computed(() => props.selectedRowKeys.length)
const hasSelection = computed(() => selectedCount.value > 0)
const summaryText = computed(() => props.title || `${selectedCount.value} selected`)

function getActionClass(action: YBulkActionItem) {
  return [
    'yok-bulk-action-bar__action',
    'yok-focus-ring',
    `yok-bulk-action-bar__action--${action.tone || 'neutral'}`
  ]
}

function handleAction(action: YBulkActionItem) {
  if (!hasSelection.value || action.disabled) {
    return
  }

  emit('action', {
    action,
    selectedRowKeys: [...props.selectedRowKeys]
  })
}
</script>

<template>
  <section
    class="yok-bulk-action-bar"
    role="status"
    aria-live="polite"
    :aria-label="ariaLabel"
    :data-empty="hasSelection ? undefined : 'true'"
  >
    <div class="yok-bulk-action-bar__summary">
      <span class="yok-bulk-action-bar__dot" aria-hidden="true" />
      <slot name="summary" :selected-count="selectedCount" :selected-row-keys="selectedRowKeys">
        <span>{{ summaryText }}</span>
      </slot>
    </div>

    <div class="yok-bulk-action-bar__actions">
      <slot name="actions" :selected-row-keys="selectedRowKeys" :selected-count="selectedCount">
        <button
          v-for="action in actions"
          :key="action.value"
          type="button"
          :class="getActionClass(action)"
          :disabled="!hasSelection || action.disabled"
          @click="handleAction(action)"
        >
          {{ action.label }}
        </button>
      </slot>
      <button
        type="button"
        class="yok-bulk-action-bar__clear yok-focus-ring"
        :disabled="!hasSelection"
        @click="$emit('clear')"
      >
        {{ clearText }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.yok-bulk-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 24%, var(--yok-color-border));
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--yok-color-primarySoft) 70%, var(--yok-color-surface)),
      var(--yok-color-surface)
    );
  color: var(--yok-color-text);
  padding: var(--yok-space-3) var(--yok-space-4);
}

.yok-bulk-action-bar[data-empty='true'] {
  border-color: var(--yok-color-border);
  background: var(--yok-color-surface);
}

.yok-bulk-action-bar__summary {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  min-width: 0;
  color: var(--yok-color-text);
  font-size: 13px;
  font-weight: 760;
}

.yok-bulk-action-bar__dot {
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--yok-color-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--yok-color-primarySoft) 72%, transparent);
}

.yok-bulk-action-bar[data-empty='true'] .yok-bulk-action-bar__dot {
  background: var(--yok-color-textMuted);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--yok-color-border) 60%, transparent);
}

.yok-bulk-action-bar__actions {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--yok-space-2);
}

.yok-bulk-action-bar__action,
.yok-bulk-action-bar__clear {
  min-height: 32px;
  border: 1px solid transparent;
  border-radius: var(--yok-radius-md);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 740;
  padding: 0 var(--yok-space-3);
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.yok-bulk-action-bar__action:hover:not(:disabled),
.yok-bulk-action-bar__clear:hover:not(:disabled) {
  transform: translateY(-1px);
}

.yok-bulk-action-bar__action:disabled,
.yok-bulk-action-bar__clear:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.yok-bulk-action-bar__action--neutral {
  border-color: var(--yok-color-border);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
}

.yok-bulk-action-bar__action--info {
  border-color: color-mix(in srgb, var(--yok-color-primary) 24%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-primarySoft) 72%, var(--yok-color-surface));
  color: var(--yok-color-primary);
}

.yok-bulk-action-bar__action--success {
  border-color: color-mix(in srgb, var(--yok-color-success) 28%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-success) 10%, var(--yok-color-surface));
  color: var(--yok-color-success);
}

.yok-bulk-action-bar__action--warning {
  border-color: color-mix(in srgb, var(--yok-color-warning) 32%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-warning) 10%, var(--yok-color-surface));
  color: var(--yok-color-warning);
}

.yok-bulk-action-bar__action--danger {
  border-color: color-mix(in srgb, var(--yok-color-danger) 30%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-danger) 9%, var(--yok-color-surface));
  color: var(--yok-color-danger);
}

.yok-bulk-action-bar__clear {
  border-color: transparent;
  background: transparent;
  color: var(--yok-color-textMuted);
}

.yok-bulk-action-bar__clear:hover:not(:disabled) {
  background: color-mix(in srgb, var(--yok-color-border) 36%, transparent);
  color: var(--yok-color-text);
}

@media (max-width: 620px) {
  .yok-bulk-action-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-bulk-action-bar__actions {
    justify-content: flex-start;
  }
}
</style>
