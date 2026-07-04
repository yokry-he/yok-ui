<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YSkeleton'
})

type SkeletonVariant = 'text' | 'circle' | 'rect'
type SkeletonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: SkeletonVariant
  size?: SkeletonSize
  rows?: number
  animated?: boolean
  width?: string
  height?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  size: 'md',
  rows: 1,
  animated: true,
  width: '',
  height: '',
  label: ''
})

const safeRows = computed(() => Math.max(1, Math.min(props.rows, 8)))

const skeletonStyle = computed(() => ({
  '--yok-skeleton-width': props.width || undefined,
  '--yok-skeleton-height': props.height || undefined
}))
</script>

<template>
  <div
    class="yok-skeleton"
    :class="[
      `yok-skeleton--${variant}`,
      `yok-skeleton--${size}`,
      { 'yok-skeleton--animated': animated }
    ]"
    :style="skeletonStyle"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label || undefined"
    :role="label ? 'status' : undefined"
  >
    <template v-if="variant === 'text'">
      <span
        v-for="row in safeRows"
        :key="row"
        class="yok-skeleton__line"
        :style="{ '--yok-skeleton-row-ratio': row === safeRows && safeRows > 1 ? '72%' : '100%' }"
      />
    </template>
    <span v-else class="yok-skeleton__block" />
  </div>
</template>

<style scoped>
.yok-skeleton {
  --yok-skeleton-base: color-mix(in srgb, var(--yok-color-surfaceMuted) 84%, var(--yok-color-primarySoft) 16%);
  --yok-skeleton-sheen: color-mix(in srgb, var(--yok-color-surface) 72%, var(--yok-color-primarySoft) 28%);
  display: grid;
  width: var(--yok-skeleton-width, 100%);
  min-width: 0;
  gap: var(--yok-space-2);
}

.yok-skeleton__line,
.yok-skeleton__block {
  display: block;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--yok-color-border) 68%, transparent);
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 28%,
      var(--yok-skeleton-sheen) 48%,
      transparent 68%,
      transparent 100%
    ),
    var(--yok-skeleton-base);
  background-size: 220% 100%, 100% 100%;
}

.yok-skeleton__line {
  width: var(--yok-skeleton-row-ratio, 100%);
  height: var(--yok-skeleton-height, 14px);
  border-radius: 999px;
}

.yok-skeleton__block {
  width: 100%;
  height: var(--yok-skeleton-height, 92px);
  border-radius: var(--yok-radius-lg);
}

.yok-skeleton--sm .yok-skeleton__line {
  height: var(--yok-skeleton-height, 10px);
}

.yok-skeleton--lg .yok-skeleton__line {
  height: var(--yok-skeleton-height, 18px);
}

.yok-skeleton--circle {
  width: var(--yok-skeleton-width, 44px);
}

.yok-skeleton--circle .yok-skeleton__block {
  width: var(--yok-skeleton-width, 44px);
  height: var(--yok-skeleton-height, 44px);
  border-radius: 999px;
}

.yok-skeleton--circle.yok-skeleton--sm .yok-skeleton__block {
  width: var(--yok-skeleton-width, 32px);
  height: var(--yok-skeleton-height, 32px);
}

.yok-skeleton--circle.yok-skeleton--lg .yok-skeleton__block {
  width: var(--yok-skeleton-width, 56px);
  height: var(--yok-skeleton-height, 56px);
}

.yok-skeleton--rect.yok-skeleton--sm .yok-skeleton__block {
  height: var(--yok-skeleton-height, 64px);
}

.yok-skeleton--rect.yok-skeleton--lg .yok-skeleton__block {
  height: var(--yok-skeleton-height, 128px);
}

.yok-skeleton--animated .yok-skeleton__line,
.yok-skeleton--animated .yok-skeleton__block {
  animation: yok-skeleton-shimmer 1.35s ease-in-out infinite;
}

@keyframes yok-skeleton-shimmer {
  0% {
    background-position: 120% 0, 0 0;
  }

  100% {
    background-position: -120% 0, 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yok-skeleton--animated .yok-skeleton__line,
  .yok-skeleton--animated .yok-skeleton__block {
    animation: none;
  }
}
</style>
