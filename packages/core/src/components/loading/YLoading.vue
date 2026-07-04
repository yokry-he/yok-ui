<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YLoading'
})

export type YLoadingTone = 'primary' | 'success' | 'warning' | 'danger'
export type YLoadingSize = 'sm' | 'md' | 'lg'

interface Props {
  loading?: boolean
  overlay?: boolean
  fullscreen?: boolean
  text?: string
  label?: string
  tone?: YLoadingTone
  size?: YLoadingSize
}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  overlay: false,
  fullscreen: false,
  text: 'Loading',
  label: '',
  tone: 'primary',
  size: 'md'
})

const accessibleLabel = computed(() => props.label || props.text || 'Loading')
const isBlocking = computed(() => props.overlay || props.fullscreen)
</script>

<template>
  <div
    class="yok-loading"
    :class="[
      `yok-loading--${tone}`,
      `yok-loading--${size}`,
      {
        'yok-loading--overlay': overlay,
        'yok-loading--fullscreen': fullscreen,
        'yok-loading--active': loading,
        'yok-loading--standalone': !overlay && !fullscreen
      }
    ]"
    :role="isBlocking ? undefined : 'status'"
    :aria-live="isBlocking ? undefined : 'polite'"
    :aria-busy="isBlocking ? loading : undefined"
    :aria-label="accessibleLabel"
  >
    <div v-if="$slots.default" class="yok-loading__content">
      <slot />
    </div>

    <div
      v-if="loading"
      class="yok-loading__mask"
      :role="isBlocking ? 'status' : undefined"
      :aria-live="isBlocking ? 'polite' : undefined"
    >
      <slot name="indicator">
        <span class="yok-loading__spinner" aria-hidden="true" />
      </slot>
      <span v-if="text" class="yok-loading__text">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.yok-loading {
  --yok-loading-color: var(--yok-color-primary);
  position: relative;
  display: inline-grid;
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-loading__content {
  min-width: 0;
}

.yok-loading__mask {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  color: var(--yok-loading-color);
  font-size: 14px;
  font-weight: 750;
  line-height: 1.4;
}

.yok-loading--overlay {
  display: grid;
  width: 100%;
}

.yok-loading--overlay .yok-loading__mask,
.yok-loading--fullscreen .yok-loading__mask {
  position: absolute;
  inset: 0;
  z-index: var(--yok-zIndex-popover, 1000);
  min-height: 96px;
  border-radius: inherit;
  background: color-mix(in srgb, var(--yok-color-surface) 84%, transparent);
  backdrop-filter: blur(3px);
}

.yok-loading--fullscreen {
  position: fixed;
  inset: 0;
  z-index: var(--yok-zIndex-modal, 2000);
  display: grid;
  width: 100vw;
  min-height: 100vh;
}

.yok-loading--fullscreen .yok-loading__mask {
  position: fixed;
  border-radius: 0;
  background: color-mix(in srgb, var(--yok-color-surface) 88%, transparent);
}

.yok-loading__spinner {
  display: inline-block;
  width: var(--yok-loading-spinner-size, 20px);
  height: var(--yok-loading-spinner-size, 20px);
  flex: 0 0 var(--yok-loading-spinner-size, 20px);
  border: 2px solid color-mix(in srgb, var(--yok-loading-color) 22%, transparent);
  border-top-color: var(--yok-loading-color);
  border-radius: 999px;
  animation: yok-loading-spin 0.8s linear infinite;
}

.yok-loading--sm {
  --yok-loading-spinner-size: 16px;
}

.yok-loading--lg {
  --yok-loading-spinner-size: 28px;
}

.yok-loading--success {
  --yok-loading-color: var(--yok-color-success);
}

.yok-loading--warning {
  --yok-loading-color: var(--yok-color-warning);
}

.yok-loading--danger {
  --yok-loading-color: var(--yok-color-danger);
}

@keyframes yok-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .yok-loading__spinner {
    animation: none;
  }
}
</style>
