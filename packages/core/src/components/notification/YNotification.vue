<script setup lang="ts">
import YInternalIcon from '../_internal/YInternalIcon.vue'

defineOptions({
  name: 'YNotification'
})

export type YNotificationTone = 'info' | 'success' | 'warning' | 'danger'
export type YNotificationRole = 'status' | 'alert'

interface Props {
  tone?: YNotificationTone
  title?: string
  closable?: boolean
  role?: YNotificationRole
  closeLabel?: string
}

withDefaults(defineProps<Props>(), {
  tone: 'info',
  title: '',
  closable: true,
  role: 'status',
  closeLabel: 'Close notification'
})

defineEmits<{
  close: []
}>()
</script>

<template>
  <article
    class="yok-notification"
    :class="`yok-notification--${tone}`"
    :role="role"
    aria-atomic="true"
  >
    <span class="yok-notification__mark" aria-hidden="true" />
    <div class="yok-notification__content">
      <h3 v-if="title" class="yok-notification__title">{{ title }}</h3>
      <div class="yok-notification__body">
        <slot />
      </div>
    </div>
    <button
      v-if="closable"
      class="yok-notification__close yok-focus-ring"
      type="button"
      :aria-label="closeLabel"
      @click.stop="$emit('close')"
    >
      <YInternalIcon name="close" />
    </button>
  </article>
</template>

<style scoped>
.yok-notification {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--yok-space-3);
  width: 100%;
  max-width: 380px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-text);
  padding: var(--yok-space-4);
}

.yok-notification__mark {
  width: 10px;
  height: 10px;
  margin-top: 7px;
  border-radius: 999px;
  background: currentColor;
  flex: 0 0 10px;
}

.yok-notification__content {
  min-width: 0;
}

.yok-notification__title {
  margin: 0;
  color: var(--yok-color-text);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: 0;
}

.yok-notification__body {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  font-size: 14px;
  line-height: 1.6;
}

.yok-notification__close {
  align-self: start;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  flex: 0 0 28px;
  font-size: 20px;
  line-height: 1;
}

.yok-notification__close:hover {
  color: var(--yok-color-text);
}

.yok-notification--info {
  color: var(--yok-color-primary);
}

.yok-notification--success {
  color: var(--yok-color-success);
}

.yok-notification--warning {
  color: var(--yok-color-warning);
}

.yok-notification--danger {
  color: var(--yok-color-danger);
}
</style>
