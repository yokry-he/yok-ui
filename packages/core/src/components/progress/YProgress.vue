<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YProgress'
})

type ProgressTone = 'primary' | 'success' | 'warning' | 'danger'
type ProgressSize = 'sm' | 'md' | 'lg'

interface Props {
  value: number
  label?: string
  tone?: ProgressTone
  size?: ProgressSize
  showValue?: boolean
  striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Progress',
  tone: 'primary',
  size: 'md',
  showValue: true,
  striped: false
})

const normalizedValue = computed(() => Math.min(100, Math.max(0, props.value)))
const formattedValue = computed(() => `${Math.round(normalizedValue.value)}%`)
const progressStyle = computed(() => ({
  '--yok-progress-value': `${normalizedValue.value}%`
}))
</script>

<template>
  <div
    class="yok-progress"
    :class="[
      `yok-progress--${tone}`,
      `yok-progress--${size}`,
      { 'yok-progress--striped': striped }
    ]"
    :style="progressStyle"
  >
    <div v-if="label || showValue" class="yok-progress__header">
      <span v-if="label" class="yok-progress__label">{{ label }}</span>
      <span v-if="showValue" class="yok-progress__value">{{ formattedValue }}</span>
    </div>
    <div
      class="yok-progress__track"
      role="progressbar"
      :aria-label="label || 'Progress'"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(normalizedValue)"
    >
      <span class="yok-progress__bar" />
    </div>
  </div>
</template>

<style scoped>
.yok-progress {
  display: grid;
  min-width: 0;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-progress__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
}

.yok-progress__label,
.yok-progress__value {
  font-size: 13px;
  font-weight: 750;
  line-height: 1.4;
}

.yok-progress__label {
  min-width: 0;
  overflow: hidden;
  color: var(--yok-color-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-progress__value {
  flex: none;
  color: var(--yok-progress-color, var(--yok-color-primary));
}

.yok-progress__track {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--yok-color-border) 72%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-color-surfaceMuted) 82%, var(--yok-color-primarySoft) 18%);
}

.yok-progress__bar {
  display: block;
  width: var(--yok-progress-value);
  height: 100%;
  border-radius: inherit;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--yok-progress-color) 82%, white 18%), var(--yok-progress-color)),
    var(--yok-progress-color);
  transition: width var(--yok-motion-fast);
}

.yok-progress--sm .yok-progress__track {
  height: 8px;
}

.yok-progress--md .yok-progress__track {
  height: 12px;
}

.yok-progress--lg .yok-progress__track {
  height: 16px;
}

.yok-progress--primary {
  --yok-progress-color: var(--yok-color-primary);
}

.yok-progress--success {
  --yok-progress-color: var(--yok-color-success);
}

.yok-progress--warning {
  --yok-progress-color: var(--yok-color-warning);
}

.yok-progress--danger {
  --yok-progress-color: var(--yok-color-danger);
}

.yok-progress--striped .yok-progress__bar {
  background:
    repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, white 22%, transparent) 0 8px,
      transparent 8px 16px
    ),
    linear-gradient(90deg, color-mix(in srgb, var(--yok-progress-color) 82%, white 18%), var(--yok-progress-color));
}

@media (prefers-reduced-motion: reduce) {
  .yok-progress__bar {
    transition: none;
  }
}
</style>
