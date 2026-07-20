<script setup lang="ts">
import { computed } from 'vue'
import YInternalIcon from '../_internal/YInternalIcon.vue'

defineOptions({
  name: 'YAlert'
})

export type YAlertTone = 'info' | 'success' | 'warning' | 'danger'
export type YAlertRole = 'status' | 'alert'
export type YAlertVariant = 'soft' | 'outline' | 'solid'
export type YAlertSize = 'sm' | 'md' | 'lg'

interface Props {
  tone?: YAlertTone
  title?: string
  closable?: boolean
  role?: YAlertRole
  closeLabel?: string
  closeText?: string
  icon?: string
  showIcon?: boolean
  variant?: YAlertVariant
  size?: YAlertSize
  banner?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'info',
  title: '',
  closable: false,
  role: 'status',
  closeLabel: 'Close alert',
  closeText: '',
  icon: '',
  showIcon: true,
  variant: 'soft',
  size: 'md',
  banner: false
})

defineEmits<{
  close: []
}>()

const toneIconNames = {
  info: 'info',
  success: 'check',
  warning: 'warning',
  danger: 'error'
} as const

const resolvedIconName = computed(() => toneIconNames[props.tone])
const liveMode = computed(() => props.role === 'alert' ? 'assertive' : 'polite')
const alertClasses = computed(() => [
  `yok-alert--${props.tone}`,
  `yok-alert--${props.variant}`,
  `yok-alert--${props.size}`,
  {
    'yok-alert--banner': props.banner
  }
])
</script>

<template>
  <div
    class="yok-alert"
    :class="alertClasses"
    :role="role"
    :aria-live="liveMode"
    aria-atomic="true"
  >
    <span v-if="showIcon" class="yok-alert__icon" aria-hidden="true">
      <slot name="icon">
        <template v-if="icon">{{ icon }}</template>
        <YInternalIcon v-else :name="resolvedIconName" />
      </slot>
    </span>
    <div class="yok-alert__content">
      <strong v-if="title">{{ title }}</strong>
      <p v-if="$slots.default">
        <slot />
      </p>
    </div>
    <div v-if="$slots.action" class="yok-alert__action">
      <slot name="action" />
    </div>
    <button
      v-if="closable"
      class="yok-alert__close yok-focus-ring"
      type="button"
      :aria-label="closeLabel"
      @click="$emit('close')"
    >
      <template v-if="closeText">{{ closeText }}</template>
      <YInternalIcon v-else name="close" />
    </button>
  </div>
</template>

<style scoped>
.yok-alert {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  gap: var(--yok-space-3);
  align-items: flex-start;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  padding: var(--yok-space-4);
}

.yok-alert__icon {
  display: inline-grid;
  width: 24px;
  height: 24px;
  margin-top: 1px;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
}

.yok-alert__content {
  min-width: 0;
}

.yok-alert__content strong,
.yok-alert__content p {
  margin: 0;
}

.yok-alert__content strong {
  display: block;
  margin-bottom: var(--yok-space-1);
  font-size: 14px;
  line-height: 1.4;
}

.yok-alert__content p {
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-alert__action {
  display: flex;
  align-items: center;
  align-self: center;
  flex: 0 0 auto;
}

.yok-alert__close {
  border: 0;
  border-radius: var(--yok-radius-sm);
  background: transparent;
  color: currentColor;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  min-width: 28px;
  min-height: 28px;
  padding: 0 var(--yok-space-2);
}

.yok-alert--info {
  color: var(--yok-color-primary);
}

.yok-alert--success {
  color: var(--yok-color-success);
}

.yok-alert--warning {
  color: var(--yok-color-warning);
}

.yok-alert--danger {
  color: var(--yok-color-danger);
}

.yok-alert--soft {
  border-color: color-mix(in srgb, currentColor 22%, var(--yok-color-border));
  background: color-mix(in srgb, currentColor 8%, var(--yok-color-surface));
}

.yok-alert--outline {
  border-color: color-mix(in srgb, currentColor 42%, var(--yok-color-border));
  background: var(--yok-color-surface);
}

.yok-alert--solid {
  border-color: transparent;
  background: currentColor;
}

.yok-alert--solid .yok-alert__icon,
.yok-alert--solid .yok-alert__content,
.yok-alert--solid .yok-alert__close,
.yok-alert--solid .yok-alert__action {
  color: var(--yok-color-surface);
}

.yok-alert--solid .yok-alert__content p {
  color: color-mix(in srgb, var(--yok-color-surface) 76%, transparent);
}

.yok-alert--sm {
  gap: var(--yok-space-2);
  padding: var(--yok-space-3);
}

.yok-alert--sm .yok-alert__icon {
  width: 20px;
  height: 20px;
  font-size: 12px;
}

.yok-alert--sm .yok-alert__content strong,
.yok-alert--sm .yok-alert__content p {
  font-size: 13px;
}

.yok-alert--lg {
  gap: var(--yok-space-4);
  padding: var(--yok-space-5);
}

.yok-alert--lg .yok-alert__icon {
  width: 30px;
  height: 30px;
  font-size: 15px;
}

.yok-alert--lg .yok-alert__content strong {
  font-size: 16px;
}

.yok-alert--banner {
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}

@media (max-width: 520px) {
  .yok-alert {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .yok-alert__action {
    grid-column: 2 / -1;
    justify-content: flex-start;
  }
}
</style>
