<script setup lang="ts">
import { builtinThemes, type YokThemeName } from '@yok-ui/themes'

defineOptions({
  name: 'YThemeSwitcher'
})

interface Props {
  modelValue: YokThemeName
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [theme: YokThemeName]
}>()

const themes: Array<{ name: YokThemeName; label: string }> = [
  ...builtinThemes.map((theme) => ({
    name: theme.name,
    label: theme.label
  }))
]
</script>

<template>
  <div class="yok-theme-switcher" aria-label="Theme switcher">
    <button
      v-for="theme in themes"
      :key="theme.name"
      class="yok-theme-switcher__option yok-focus-ring"
      :class="{ 'yok-theme-switcher__option--active': modelValue === theme.name }"
      type="button"
      :data-theme-option="theme.name"
      :aria-pressed="modelValue === theme.name ? 'true' : 'false'"
      @click="$emit('update:modelValue', theme.name)"
    >
      {{ theme.label }}
    </button>
  </div>
</template>

<style scoped>
.yok-theme-switcher {
  display: inline-flex;
  gap: var(--yok-space-1);
  padding: var(--yok-space-1);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
}

.yok-theme-switcher__option {
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  padding: var(--yok-space-2) var(--yok-space-3);
}

.yok-theme-switcher__option--active {
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  box-shadow: var(--yok-shadow-soft);
}
</style>
