<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YBadge'
})

export type YBadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type YBadgePlacement = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start'
export type YBadgeSize = 'sm' | 'md' | 'lg'
export type YBadgeOffset = [number, number]

interface YBadgeProps {
  value?: string | number
  max?: number
  dot?: boolean
  hidden?: boolean
  showZero?: boolean
  label?: string
  tone?: YBadgeTone
  placement?: YBadgePlacement
  size?: YBadgeSize
  text?: string
  offset?: YBadgeOffset
}

const props = withDefaults(defineProps<YBadgeProps>(), {
  value: '',
  max: 99,
  dot: false,
  hidden: false,
  showZero: false,
  label: '',
  tone: 'primary',
  placement: 'top-end',
  size: 'md',
  text: '',
  offset: () => [0, 0]
})

const hasContent = computed(() => {
  if (props.hidden) {
    return false
  }

  if (props.text) {
    return true
  }

  if (props.dot) {
    return true
  }

  if (props.value === 0 || props.value === '0') {
    return props.showZero
  }

  return props.value !== '' && typeof props.value !== 'undefined' && props.value !== null
})

const displayValue = computed(() => {
  if (props.text) {
    return props.text
  }

  if (props.dot) {
    return ''
  }

  if (typeof props.value === 'number' && Number.isFinite(props.value) && props.value > props.max) {
    return `${props.max}+`
  }

  return String(props.value)
})

const accessibleLabel = computed(() => {
  if (props.label) {
    return props.label
  }

  if (props.dot) {
    return 'Status indicator'
  }

  return displayValue.value ? `Badge ${displayValue.value}` : undefined
})

const badgeStyle = computed(() => ({
  '--yok-badge-offset-x': `${props.offset[0] ?? 0}px`,
  '--yok-badge-offset-y': `${props.offset[1] ?? 0}px`
}))
</script>

<template>
  <span
    :class="[
      'yok-badge',
      `yok-badge--${placement}`,
      {
        'yok-badge--wrapper': $slots.default,
        'yok-badge--standalone': !$slots.default
      }
    ]"
  >
    <span v-if="$slots.default" class="yok-badge__target">
      <slot />
    </span>

    <span
      v-if="hasContent"
      :class="[
        'yok-badge__content',
        `yok-badge__content--${tone}`,
        `yok-badge__content--${size}`,
        {
          'yok-badge__content--dot': dot,
          'yok-badge__content--with-text': Boolean(text),
          'yok-badge__content--standalone': !$slots.default
        }
      ]"
      :style="badgeStyle"
      role="status"
      aria-live="polite"
      :aria-label="accessibleLabel"
    >
      {{ displayValue }}
    </span>
  </span>
</template>

<style scoped>
.yok-badge {
  position: relative;
  display: inline-flex;
  width: max-content;
  max-width: 100%;
  vertical-align: middle;
}

.yok-badge__target {
  display: inline-flex;
  min-width: 0;
}

.yok-badge__content {
  display: inline-grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 999px;
  padding: 0 var(--yok-space-1);
  border: 2px solid var(--yok-color-surface);
  background: var(--yok-color-accentPink);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  box-shadow: var(--yok-shadow-soft);
  white-space: nowrap;
  pointer-events: none;
}

.yok-badge--wrapper .yok-badge__content {
  position: absolute;
  z-index: 1;
}

.yok-badge--top-end .yok-badge__content {
  top: var(--yok-badge-offset-y);
  right: calc(var(--yok-badge-offset-x) * -1);
  transform: translate(50%, -50%);
}

.yok-badge--top-start .yok-badge__content {
  top: var(--yok-badge-offset-y);
  left: calc(var(--yok-badge-offset-x) * -1);
  transform: translate(-50%, -50%);
}

.yok-badge--bottom-end .yok-badge__content {
  right: calc(var(--yok-badge-offset-x) * -1);
  bottom: calc(var(--yok-badge-offset-y) * -1);
  transform: translate(50%, 50%);
}

.yok-badge--bottom-start .yok-badge__content {
  bottom: calc(var(--yok-badge-offset-y) * -1);
  left: calc(var(--yok-badge-offset-x) * -1);
  transform: translate(-50%, 50%);
}

.yok-badge__content--standalone {
  position: static;
}

.yok-badge__content--dot {
  min-width: 10px;
  width: 10px;
  height: 10px;
  padding: 0;
}

.yok-badge__content--sm {
  min-width: 16px;
  height: 16px;
  font-size: 11px;
}

.yok-badge__content--sm.yok-badge__content--dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
}

.yok-badge__content--lg {
  min-width: 24px;
  height: 24px;
  padding: 0 var(--yok-space-2);
  font-size: 13px;
}

.yok-badge__content--lg.yok-badge__content--dot:not(.yok-badge__content--with-text) {
  min-width: 12px;
  width: 12px;
  height: 12px;
}

.yok-badge__content--with-text {
  width: auto;
}

.yok-badge__content--primary {
  background: var(--yok-color-accentPink);
}

.yok-badge__content--success {
  background: var(--yok-color-success);
}

.yok-badge__content--warning {
  background: var(--yok-color-warning);
  color: var(--yok-color-text);
}

.yok-badge__content--danger {
  background: var(--yok-color-danger);
}

.yok-badge__content--info {
  background: var(--yok-color-accentBlue);
  color: var(--yok-color-text);
}
</style>
