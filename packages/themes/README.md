# @yok-ui/themes

Theme tokens, theme CSS files and contrast helpers for Yok UI.

## Install

```bash
pnpm add @yok-ui/themes
```

## Theme CSS

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/themes/yok-clean.css'
import '@yok-ui/themes/yok-candy.css'
```

## Token helpers

```ts
import { builtinThemes, createThemeVars, auditContrastPairs } from '@yok-ui/themes'
```

Themes are data-first: CSS files expose runtime variables, while TypeScript exports provide token metadata and contrast utilities for docs, design tooling and theme editors.
