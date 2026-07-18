<script setup lang="ts">
import { computed, provide } from 'vue'
import { createThemeVars } from '@yok-ui/themes'
import {
  createYokConfigContext,
  useYokConfig,
  yokConfigInjectionKey,
  type YokConfigProviderProps
} from './context'

defineOptions({
  name: 'YConfigProvider'
})

const props = defineProps<YokConfigProviderProps>()
const parentConfig = useYokConfig()
const config = createYokConfigContext(props, parentConfig)

const providerStyle = computed(() => ({
  ...(config.tokens.value ? createThemeVars(config.tokens.value) : {}),
  '--yok-font-family': config.fontFamily.value,
  '--yok-z-index-base': String(config.zIndex.value),
  '--yok-zIndex-tooltip': String(config.zIndex.value),
  '--yok-zIndex-floating': String(config.zIndex.value + 100),
  '--yok-zIndex-drawer': String(config.zIndex.value + 900),
  '--yok-zIndex-modal': String(config.zIndex.value + 1000),
  '--yok-zIndex-toast': String(config.zIndex.value + 2000)
}))

provide(yokConfigInjectionKey, config)
</script>

<template>
  <div
    class="yok-config-provider"
    :data-yok-size="config.size.value"
    :data-yok-density="config.density.value"
    :data-yok-namespace="config.namespace.value"
    :data-yok-theme="config.theme.value"
    :data-yok-font="config.font.value"
    :data-yok-z-index="config.zIndex.value"
    :lang="config.locale.value"
    :dir="config.direction.value"
    :style="providerStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.yok-config-provider {
  min-width: 0;
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font-family: var(--yok-font-family);
}
</style>
