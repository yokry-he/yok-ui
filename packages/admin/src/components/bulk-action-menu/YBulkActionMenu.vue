<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'YBulkActionMenu'
})

export type YBulkActionMenuTone = 'neutral' | 'danger' | 'warning' | 'success' | 'info'

export interface YBulkActionMenuItem {
  label: string
  value: string
  group?: string
  tone?: YBulkActionMenuTone
  description?: string
  disabled?: boolean
  requiresConfirm?: boolean
  confirmText?: string
}

export interface YBulkActionMenuPayload {
  action: YBulkActionMenuItem
  selectedRowKeys: string[]
}

interface Props {
  selectedRowKeys: string[]
  actions?: YBulkActionMenuItem[]
  open?: boolean
  label?: string
  selectedText?: string
  clearText?: string
  ariaLabel?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  open: undefined,
  label: 'More actions',
  selectedText: 'selected',
  clearText: 'Clear',
  ariaLabel: 'Bulk action menu',
  disabled: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  action: [payload: YBulkActionMenuPayload]
  clear: []
}>()

const internalOpen = ref(false)
const confirmingValue = ref('')
const isControlled = computed(() => props.open !== undefined)
const selectedCount = computed(() => props.selectedRowKeys.length)
const hasSelection = computed(() => selectedCount.value > 0)
const menuDisabled = computed(() => props.disabled || !hasSelection.value)
const isOpen = computed(() => (menuDisabled.value ? false : isControlled.value ? Boolean(props.open) : internalOpen.value))
const selectedSummary = computed(() => `${selectedCount.value} ${props.selectedText}`)
const groupedActions = computed(() => {
  const groups: Array<{ label: string; actions: YBulkActionMenuItem[] }> = []

  props.actions.forEach((action) => {
    const groupLabel = action.group || 'Actions'
    let group = groups.find((item) => item.label === groupLabel)

    if (!group) {
      group = { label: groupLabel, actions: [] }
      groups.push(group)
    }

    group.actions.push(action)
  })

  return groups
})

function setOpen(value: boolean) {
  if (menuDisabled.value) {
    return
  }

  if (!isControlled.value) {
    internalOpen.value = value
  }

  if (!value) {
    confirmingValue.value = ''
  }

  emit('update:open', value)
}

function toggleOpen() {
  setOpen(!isOpen.value)
}

function getActionClass(action: YBulkActionMenuItem) {
  return [
    'yok-bulk-action-menu__item',
    'yok-focus-ring',
    `yok-bulk-action-menu__item--${action.tone || 'neutral'}`,
    {
      'yok-bulk-action-menu__item--confirming': confirmingValue.value === action.value
    }
  ]
}

function selectAction(action: YBulkActionMenuItem) {
  if (menuDisabled.value || action.disabled) {
    return
  }

  if (action.requiresConfirm && confirmingValue.value !== action.value) {
    confirmingValue.value = action.value
    return
  }

  emit('action', {
    action,
    selectedRowKeys: [...props.selectedRowKeys]
  })
  setOpen(false)
}

function clearSelection() {
  if (!hasSelection.value) {
    return
  }

  emit('clear')
  setOpen(false)
}

function handleMenuKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    setOpen(false)
  }
}

watch(
  () => props.selectedRowKeys,
  () => {
    if (!hasSelection.value) {
      confirmingValue.value = ''
      internalOpen.value = false
    }
  }
)
</script>

<template>
  <div class="yok-bulk-action-menu" :data-open="isOpen ? 'true' : undefined">
    <div class="yok-bulk-action-menu__summary" role="status" aria-live="polite">
      <span class="yok-bulk-action-menu__count">{{ selectedSummary }}</span>
    </div>

    <button
      class="yok-bulk-action-menu__trigger yok-focus-ring"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :disabled="menuDisabled"
      @click="toggleOpen"
    >
      {{ label }}
      <span class="yok-bulk-action-menu__chevron" aria-hidden="true">⌄</span>
    </button>

    <div v-if="isOpen" class="yok-bulk-action-menu__popover">
      <div class="yok-bulk-action-menu__panel" role="menu" :aria-label="label" @keydown="handleMenuKeydown">
        <section v-for="group in groupedActions" :key="group.label" class="yok-bulk-action-menu__group">
          <p class="yok-bulk-action-menu__group-label">{{ group.label }}</p>
          <button
            v-for="action in group.actions"
            :key="action.value"
            type="button"
            role="menuitem"
            :class="getActionClass(action)"
            :disabled="action.disabled || menuDisabled"
            @click="selectAction(action)"
          >
            <span class="yok-bulk-action-menu__item-copy">
              <strong>
                {{ confirmingValue === action.value ? action.confirmText || 'Confirm' : action.label }}
              </strong>
              <small v-if="action.description">{{ action.description }}</small>
            </span>
          </button>
        </section>

        <button
          class="yok-bulk-action-menu__clear yok-focus-ring"
          type="button"
          role="menuitem"
          :disabled="!hasSelection"
          @click="clearSelection"
        >
          {{ clearText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.yok-bulk-action-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-bulk-action-menu__summary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 700;
  padding: 0 var(--yok-space-2);
}

.yok-bulk-action-menu__count {
  color: var(--yok-color-primary);
  font-weight: 820;
}

.yok-bulk-action-menu__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  min-height: 34px;
  border: 1px solid color-mix(in srgb, var(--yok-color-primary) 24%, var(--yok-color-border));
  border-radius: var(--yok-radius-md);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 70%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 760;
  letter-spacing: 0;
  padding: 0 var(--yok-space-3);
}

.yok-bulk-action-menu__trigger:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.yok-bulk-action-menu__chevron {
  color: currentColor;
}

.yok-bulk-action-menu__popover {
  position: absolute;
  z-index: var(--yok-zIndex-floating, 1000);
  top: calc(100% + var(--yok-space-2));
  right: 0;
  min-width: 260px;
}

.yok-bulk-action-menu__panel {
  display: grid;
  gap: var(--yok-space-2);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: var(--yok-space-2);
}

.yok-bulk-action-menu__group {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.yok-bulk-action-menu__group-label {
  margin: 0;
  color: var(--yok-color-textMuted);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0;
  padding: 4px var(--yok-space-2);
  text-transform: uppercase;
}

.yok-bulk-action-menu__item,
.yok-bulk-action-menu__clear {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 36px;
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  letter-spacing: 0;
  padding: 8px var(--yok-space-2);
  text-align: left;
}

.yok-bulk-action-menu__item:hover:not(:disabled),
.yok-bulk-action-menu__clear:hover:not(:disabled),
.yok-bulk-action-menu__item--confirming {
  background: var(--yok-color-primarySoft);
}

.yok-bulk-action-menu__item:disabled,
.yok-bulk-action-menu__clear:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.yok-bulk-action-menu__item-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.yok-bulk-action-menu__item-copy strong {
  font-size: 13px;
  font-weight: 760;
}

.yok-bulk-action-menu__item-copy small {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  line-height: 1.5;
}

.yok-bulk-action-menu__item--info {
  color: var(--yok-color-primary);
}

.yok-bulk-action-menu__item--success {
  color: var(--yok-color-success);
}

.yok-bulk-action-menu__item--warning {
  color: var(--yok-color-warning);
}

.yok-bulk-action-menu__item--danger,
.yok-bulk-action-menu__item--confirming {
  color: var(--yok-color-danger);
}

.yok-bulk-action-menu__clear {
  color: var(--yok-color-textMuted);
  font-weight: 740;
}

@media (max-width: 620px) {
  .yok-bulk-action-menu {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-bulk-action-menu__trigger,
  .yok-bulk-action-menu__summary {
    width: 100%;
  }

  .yok-bulk-action-menu__popover {
    right: auto;
    left: 0;
    width: min(320px, 100vw - var(--yok-space-4));
  }
}
</style>
