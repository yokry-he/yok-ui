<script setup lang="ts">
import { computed, provide } from 'vue'
import {
  defaultYokConfig,
  useYokConfig,
  yokConfigInjectionKey,
  type YokConfigProviderProps
} from './context'

defineOptions({
  name: 'YConfigProvider'
})

const props = defineProps<YokConfigProviderProps>()
const parentConfig = useYokConfig()

const config = {
  size: computed(() => props.size ?? parentConfig.size.value ?? defaultYokConfig.size),
  density: computed(() => props.density ?? parentConfig.density.value ?? defaultYokConfig.density),
  locale: computed(() => props.locale ?? parentConfig.locale.value ?? defaultYokConfig.locale),
  namespace: computed(() => props.namespace ?? parentConfig.namespace.value ?? defaultYokConfig.namespace)
}

provide(yokConfigInjectionKey, config)
</script>

<template>
  <div
    class="yok-config-provider"
    :data-yok-size="config.size.value"
    :data-yok-density="config.density.value"
    :data-yok-namespace="config.namespace.value"
    :lang="config.locale.value"
  >
    <slot />
  </div>
</template>

<style scoped>
.yok-config-provider {
  min-width: 0;
  color: var(--yok-color-text);
}
</style>
