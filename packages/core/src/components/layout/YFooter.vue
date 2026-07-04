<script setup lang="ts">
import { computed } from 'vue'
import { resolveLayoutSize, type YLayoutSize } from './utils'

defineOptions({
  name: 'YFooter'
})

interface Props {
  height?: YLayoutSize
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '56px',
  bordered: false
})

const style = computed(() => ({
  '--yok-layout-footer-height': resolveLayoutSize(props.height)
}))
</script>

<template>
  <footer
    class="yok-layout-footer"
    :class="{ 'yok-layout-footer--bordered': bordered }"
    :style="style"
  >
    <slot />
  </footer>
</template>

<style scoped>
.yok-layout-footer {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 var(--yok-layout-footer-height);
  align-items: center;
  min-width: 0;
  min-height: var(--yok-layout-footer-height);
  padding-inline: var(--yok-space-4);
  background: var(--yok-color-surface);
  color: var(--yok-color-textMuted);
}

.yok-layout-footer--bordered {
  border-top: 1px solid var(--yok-color-border);
}
</style>
