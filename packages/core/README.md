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

createApp(App).use(YokCore, {
  locale: 'zh-CN',
  size: 'md',
  density: 'comfortable',
  button: {
    autoInsertSpace: true
  }
}).mount('#app')
```

Application-level options are inherited by every component. Wrap a subtree in `YConfigProvider` when a page needs its own locale, direction, theme, font, z-index baseline, token overrides or component defaults.

## On-demand import

```vue
<script setup lang="ts">
import { YButton, YCheckTag, YConfigProvider, YDateTimePicker, YInput, YInputOtp, YInputTag, YTimeSelect } from '@yok-ui/core'
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
  <YConfigProvider locale="en-US" theme="yok-light" font="system" :tokens="yokCustomTheme">
    <YInput label="Project name" />
    <YDateTimePicker label="Release at" model-value="2026-07-04 20:30" />
    <YTimeSelect label="Start time" model-value="09:00" start="08:30" end="18:30" step="00:15" />
    <YInputOtp label="Verification code" :length="6" />
    <YInputTag label="Tags" placeholder="Press Enter to add" />
    <YCheckTag checked tone="success">Core</YCheckTag>
    <YButton variant="primary">Create</YButton>
  </YConfigProvider>
</template>
```

`YThemeProvider` remains available as a compatibility facade for existing theme-only usage.

Use `@yok-ui/core/styles/base.css` only when you need the base focus ring and shared utilities without the full component CSS.

## Interaction foundations

Yok UI does not hand-roll critical floating and overlay behavior when a mature library is a better fit.

| Area | Foundation | Used by |
| --- | --- | --- |
| Floating positioning | `@floating-ui/vue` | Tooltip, Popover, Dropdown, Select, Cascader, TreeSelect, DatePicker, TimePicker |
| Modal focus management | `focus-trap` | Modal, Drawer, MessageBox, Tour |
| Layer order | `useLayerStack` | Floating layers, overlays and toast-like surfaces |
| Outside dismiss | `useDismissableLayer` | Click-triggered non-modal floating layers |

The wrapper composables keep Yok UI's public API stable while delegating collision handling, auto updates and focus trapping to battle-tested primitives.
