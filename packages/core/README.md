# @yok-ui/core

Fresh, cute and production-minded Vue 3 core components for Yok UI.

## Install

```bash
pnpm add @yok-ui/core @yok-ui/themes
```

## Full import

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import App from './App.vue'

createApp(App).use(YokCore).mount('#app')
```

## On-demand import

```vue
<script setup lang="ts">
import { YButton, YInput, YInputOtp, YInputTag, YThemeProvider } from '@yok-ui/core'
import type { YokThemeTokens } from '@yok-ui/themes'

const yokCustomTheme = {
  color: {
    primary: '#147a65',
    primarySoft: '#e8fbf5',
    accentPink: '#ff8fb3',
    accentBlue: '#7cc7ff',
    accentYellow: '#ffd76d',
    surface: '#fffdfa',
    surfaceMuted: '#f6f8f7',
    text: '#25302d',
    textMuted: '#68736f',
    border: '#dfe8e4',
    danger: '#b83a48',
    warning: '#956600',
    success: '#167a59'
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '22px'
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px'
  },
  shadow: {
    soft: '0 8px 24px rgba(37, 48, 45, 0.08)',
    pop: '0 14px 40px rgba(37, 48, 45, 0.12)'
  },
  motion: {
    fast: '120ms ease',
    normal: '180ms ease'
  },
  zIndex: {
    tooltip: '900',
    floating: '1000',
    drawer: '1900',
    modal: '2000',
    toast: '3000'
  }
} satisfies YokThemeTokens
</script>

<template>
  <YThemeProvider theme="yok-light" :tokens="yokCustomTheme">
    <YInput label="Project name" />
    <YInputOtp label="Verification code" :length="6" />
    <YInputTag label="Tags" placeholder="Press Enter to add" />
    <YButton variant="primary">Create</YButton>
  </YThemeProvider>
</template>
```

Use `@yok-ui/core/styles/base.css` only when you need the base focus ring and shared utilities without the full component CSS.
