<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YIcon'
})

export type YIconNamedSize = 'xs' | 'sm' | 'md' | 'lg'
export type YIconSize = YIconNamedSize | number | string

interface Props {
  size?: YIconSize
  color?: string
  label?: string
  spinning?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor',
  label: '',
  spinning: false
})

const sizeMap: Record<YIconNamedSize, string> = {
  xs: '14px',
  sm: '16px',
  md: '20px',
  lg: '24px'
}

const normalizedSize = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }

  return sizeMap[props.size as keyof typeof sizeMap] ?? props.size
})

const iconStyle = computed(() => ({
  '--yok-icon-size': normalizedSize.value,
  color: props.color
}))
</script>

<template>
  <span
    class="yok-icon"
    :class="{ 'yok-icon--spinning': spinning }"
    :style="iconStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <slot />
  </span>
</template>

<style scoped>
.yok-icon {
  display: inline-flex;
  flex: 0 0 var(--yok-icon-size);
  align-items: center;
  justify-content: center;
  width: var(--yok-icon-size);
  height: var(--yok-icon-size);
  font-size: var(--yok-icon-size);
  line-height: 1;
  vertical-align: -0.125em;
}

.yok-icon :deep(svg) {
  display: block;
  flex: none;
  width: 1em;
  height: 1em;
}

.yok-icon--spinning {
  animation: yok-icon-spin 1.2s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .yok-icon--spinning {
    animation-duration: 2.4s;
  }
}

@keyframes yok-icon-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
