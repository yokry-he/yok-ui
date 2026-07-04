# @yok-ui/icons

Small SVG icon primitives and Vue renderers for Yok UI.

## Install

```bash
pnpm add @yok-ui/icons
```

## Usage

```vue
<script setup lang="ts">
import { YokIcon, createYokIcon } from '@yok-ui/icons'

const SparkIcon = createYokIcon('spark', [
  'M12 3l2.4 5.2L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.6-.8L12 3z'
])
</script>

<template>
  <YokIcon name="check" title="Done" />
  <SparkIcon title="Spark" />
</template>
```
