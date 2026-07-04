<script setup lang="ts">
import { computed } from 'vue'
import { resolveLayoutSize, type YLayoutSize } from './utils'

defineOptions({
  name: 'YHeader'
})

interface Props {
  height?: YLayoutSize
  sticky?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '64px',
  sticky: false,
  bordered: false
})

const style = computed(() => ({
  '--yok-layout-header-height': resolveLayoutSize(props.height)
}))
</script>

<template>
  <header
    class="yok-layout-header"
    :class="{
      'yok-layout-header--sticky': sticky,
      'yok-layout-header--bordered': bordered
    }"
    :style="style"
  >
    <slot />
  </header>
</template>

<style scoped>
.yok-layout-header {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 var(--yok-layout-header-height);
  align-items: center;
  min-width: 0;
  min-height: var(--yok-layout-header-height);
  padding-inline: var(--yok-space-4);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
}

.yok-layout-header--bordered {
  border-bottom: 1px solid var(--yok-color-border);
}

.yok-layout-header--sticky {
  position: sticky;
  top: 0;
  z-index: 20;
}
</style>
