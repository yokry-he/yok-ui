# @yok-ui/icons

SVG icon primitives and curated Vue renderers for Yok UI.

Yok UI uses SVG icons instead of icon fonts. SVG keeps icons crisp, tree-shakable, theme-friendly through `currentColor`, and accessible without loading a font file.

## Install

```bash
pnpm add @yok-ui/icons
```

## Named icon

Every built-in icon has a direct named export. The export name is `Y` + PascalCase icon name + `Icon`, for example `moreHorizontal` becomes `YMoreHorizontalIcon`.

```vue
<script setup lang="ts">
import { YMoreHorizontalIcon, YSearchIcon } from '@yok-ui/icons'
</script>

<template>
  <YSearchIcon title="Search" />
  <YMoreHorizontalIcon title="More actions" />
</template>
```

## Registry icon

```vue
<script setup lang="ts">
import { YokIcon } from '@yok-ui/icons'
</script>

<template>
  <YokIcon name="calendar" title="Pick date" />
</template>
```

## Searchable metadata

Use `getYokIconEntries` to build icon pickers, or `searchYokIcons` to search by icon name, component export name, category, and tags.

```ts
import { getYokIconEntries, searchYokIcons } from '@yok-ui/icons'

const allIcons = getYokIconEntries()
const documentIcons = searchYokIcons('document', 'file')
```

## With `@yok-ui/core`

```vue
<script setup lang="ts">
import { YIcon } from '@yok-ui/core'
import { YSettingsIcon } from '@yok-ui/icons'
</script>

<template>
  <YIcon size="lg" label="Settings">
    <YSettingsIcon />
  </YIcon>
</template>
```

## Custom icon

```ts
import { createYokIcon } from '@yok-ui/icons'

export const RocketIcon = createYokIcon('rocket', [
  'M12 2l4 8-4 12-4-12 4-8z'
], {
  strokeWidth: 1.75
})
```

## Categories

`yokIconCategories` groups built-in icons by usage:

- `system`
- `arrow`
- `form`
- `feedback`
- `data`
- `file`
- `media`
- `layout`
- `commerce`
- `business`
- `brand`

## Accessibility

Pass `title` when the icon itself communicates meaning. Omit `title`, or pass `decorative`, when the icon is only visual decoration inside another labelled control.
