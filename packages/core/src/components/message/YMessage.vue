<script setup lang="ts">
import YInternalIcon from '../_internal/YInternalIcon.vue'

defineOptions({
  name: 'YMessage'
})

interface Props {
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  closable?: boolean
  role?: 'status' | 'alert'
  closeLabel?: string
}

withDefaults(defineProps<Props>(), {
  tone: 'info',
  title: '',
  closable: false,
  role: 'status',
  closeLabel: 'Close message'
})

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="yok-message" :class="`yok-message--${tone}`" :role="role" aria-atomic="true">
    <span class="yok-message__dot" aria-hidden="true" />
    <div class="yok-message__content">
      <strong v-if="title">{{ title }}</strong>
      <span><slot /></span>
    </div>
    <button v-if="closable" class="yok-message__close yok-focus-ring" type="button" :aria-label="closeLabel" @click="$emit('close')">
      <YInternalIcon name="close" />
    </button>
  </div>
</template>

<style scoped>
.yok-message {
  display: inline-grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--yok-space-3);
  align-items: center;
  max-width: min(520px, calc(100vw - 32px));
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-text);
  padding: var(--yok-space-3) var(--yok-space-4);
}

.yok-message__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: currentColor;
}

.yok-message__content {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-1) var(--yok-space-2);
  min-width: 0;
  line-height: 1.5;
}

.yok-message__content strong {
  font-weight: 800;
}

.yok-message__content span {
  color: var(--yok-color-textMuted);
}

.yok-message__close {
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: currentColor;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.yok-message--info {
  color: var(--yok-color-primary);
}

.yok-message--success {
  color: var(--yok-color-success);
}

.yok-message--warning {
  color: var(--yok-color-warning);
}

.yok-message--danger {
  color: var(--yok-color-danger);
}
</style>
