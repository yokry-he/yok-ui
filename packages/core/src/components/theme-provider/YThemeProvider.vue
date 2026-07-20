<script setup lang="ts">
import type { YokThemeName, YokThemeTokens } from '@yok-ui/themes'
import {
  YConfigProvider,
  type YokConfigDensity,
  type YokFontInput
} from '../config-provider'

defineOptions({
  name: 'YThemeProvider'
})

interface Props {
  theme?: YokThemeName
  density?: YokConfigDensity
  font?: YokFontInput
  tokens?: YokThemeTokens
}

withDefaults(defineProps<Props>(), {
  theme: 'yok-light',
  density: 'comfortable',
  font: 'system'
})
</script>

<template>
  <YConfigProvider
    class="yok-theme-provider"
    :theme="theme"
    :density="density"
    :font="font"
    :tokens="tokens"
  >
    <slot />
  </YConfigProvider>
</template>
