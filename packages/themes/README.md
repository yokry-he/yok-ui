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
import '@yok-ui/themes/yok-mint.css'
import '@yok-ui/themes/yok-ocean.css'
import '@yok-ui/themes/yok-sakura.css'
import '@yok-ui/themes/yok-lavender.css'
import '@yok-ui/themes/yok-sunrise.css'
import '@yok-ui/themes/yok-forest.css'
import '@yok-ui/themes/yok-ink.css'
import '@yok-ui/themes/yok-peach.css'
import '@yok-ui/themes/yok-slate.css'
```

## Token helpers

```ts
import { builtinThemes, createThemeVars, auditContrastPairs } from '@yok-ui/themes'
```

Yok UI ships 12 built-in themes: Light, Clean, Candy, Mint, Ocean, Sakura, Lavender, Sunrise, Forest, Ink, Peach and Slate.

Themes are data-first: CSS files expose runtime variables, while TypeScript exports provide token metadata and contrast utilities for docs, design tooling and theme editors. New themes must be added to `builtinThemes`, exported as CSS entries and covered by AA contrast tests before release.
