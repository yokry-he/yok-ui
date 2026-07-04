<script setup lang="ts">
import { computed } from 'vue'
import { resolveLayoutSize, type YLayoutSize } from './utils'

defineOptions({
  name: 'YAside'
})

interface Props {
  width?: YLayoutSize
  collapsedWidth?: YLayoutSize
  collapsed?: boolean
  bordered?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '240px',
  collapsedWidth: '72px',
  collapsed: false,
  bordered: false,
  ariaLabel: 'Sidebar'
})

const style = computed(() => {
  const expandedWidth = resolveLayoutSize(props.width)
  const collapsedWidth = resolveLayoutSize(props.collapsedWidth)

  return {
    '--yok-layout-aside-expanded-width': expandedWidth,
    '--yok-layout-aside-width': props.collapsed ? collapsedWidth : expandedWidth
  }
})
</script>

<template>
  <aside
    class="yok-layout-aside"
    :class="{
      'yok-layout-aside--collapsed': collapsed,
      'yok-layout-aside--bordered': bordered
    }"
    :style="style"
    :aria-label="ariaLabel"
  >
    <slot />
  </aside>
</template>

<style scoped>
.yok-layout-aside {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 var(--yok-layout-aside-width);
  flex-direction: column;
  width: var(--yok-layout-aside-width);
  min-width: var(--yok-layout-aside-width);
  min-height: 0;
  overflow: hidden;
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  transition:
    flex-basis var(--yok-motion-fast),
    width var(--yok-motion-fast),
    min-width var(--yok-motion-fast);
}

.yok-layout-aside--bordered {
  border-right: 1px solid var(--yok-color-border);
}
</style>
