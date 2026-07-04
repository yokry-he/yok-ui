<script setup lang="ts">
import { computed } from 'vue'
import { createThemeVars, type YokThemeName, type YokThemeTokens } from '@yok-ui/themes'

defineOptions({
  name: 'YThemeProvider'
})

interface Props {
  theme?: YokThemeName
  density?: 'comfortable' | 'compact'
  tokens?: YokThemeTokens
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'yok-light',
  density: 'comfortable'
})

const themeVars = computed(() => (props.tokens ? createThemeVars(props.tokens) : undefined))
</script>

<template>
  <div
    class="yok-theme-provider"
    :data-yok-theme="theme"
    :data-yok-density="density"
    :style="themeVars"
  >
    <slot />
  </div>
</template>

<style scoped>
.yok-theme-provider {
  color: var(--yok-color-text);
  background: var(--yok-color-surface);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}
</style>
