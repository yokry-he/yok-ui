<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YWatermark'
})

const props = withDefaults(defineProps<{
  content: string
  opacity?: number
  gap?: number
  rotate?: number
  fontSize?: number
}>(), {
  opacity: 0.12,
  gap: 120,
  rotate: -18,
  fontSize: 15
})

const backgroundImage = computed(() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${props.gap}" height="${props.gap}" viewBox="0 0 ${props.gap} ${props.gap}"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" transform="rotate(${props.rotate} ${props.gap / 2} ${props.gap / 2})" fill="currentColor" fill-opacity="${props.opacity}" font-size="${props.fontSize}" font-family="Arial, sans-serif">${props.content}</text></svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})
</script>

<template>
  <div class="yok-watermark">
    <slot />
    <div class="yok-watermark__overlay" aria-hidden="true" :style="{ backgroundImage }" />
  </div>
</template>

<style scoped>
.yok-watermark {
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.yok-watermark__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  color: var(--yok-color-textMuted);
  pointer-events: none;
}
</style>
