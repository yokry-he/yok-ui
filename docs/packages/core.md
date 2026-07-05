<script setup lang="ts">
const corePreviewSetup = [
  "import { YButton, YDescriptions, YStatistic, YTag } from '@yok-ui/core'",
  '',
  'const coverageItems = [',
  "  { key: 'button', label: 'Actions', value: 'YButton, YIconButton' },",
  "  { key: 'form', label: 'Forms', value: 'Input, Select, VirtualizedSelect, DatePickerPanel, Form' },",
  "  { key: 'data', label: 'Data', value: 'Table, List, Descriptions, Statistic, Timeline, Tree' },",
  "  { key: 'feedback', label: 'Feedback', value: 'Alert, Message, Result, Empty' }",
  ']'
].join('\n')

const corePreviewCode = [
  '<div class="core-preview-metrics">',
  '  <YStatistic title="Core components" :value="50" suffix="ready" tone="success" />',
  '  <YStatistic title="Data display" :value="6" suffix="patterns" tone="info" />',
  '</div>',
  '<YDescriptions',
  '  bordered',
  '  title="Core coverage"',
  '  description="Shared primitives for product, admin and brand packages."',
  '  :column="2"',
  '  :items="coverageItems"',
  '>',
  '  <template #extra>',
  '    <YButton size="sm" variant="primary">Create</YButton>',
  '  </template>',
  '  <template #item-data>',
  '    <YTag tone="success">Table, List, Descriptions, Statistic, Timeline, Tree</YTag>',
  '  </template>',
  '</YDescriptions>'
].join('\n')
</script>

# @yok-ui/core

Core 包提供所有场景共享的组件和交互语言。

## Install

```bash
pnpm add @yok-ui/core @yok-ui/themes
```

## Import

完整引入：

```ts
import { createApp } from 'vue'
import YokCore from '@yok-ui/core'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import App from './App.vue'

createApp(App).use(YokCore).mount('#app')
```

按需导入：

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/style.css'
import { YButton, YDateTimePicker, YDescriptions, YFlex, YInput, YInputOtp, YInputTag, YList, YStatistic, YThemeProvider, YTimeSelect, YVirtualizedSelect } from '@yok-ui/core'
```

## Components

<PackageComponents package-name="@yok-ui/core" />

## Preview

<DocDemo
  title="Core package coverage"
  description="用统计、描述列表和操作按钮展示 Core 包在基础交互、表单、数据展示和反馈场景中的覆盖范围。"
  :code="corePreviewCode"
  :setup="corePreviewSetup"
  :usage="['package preview', 'descriptions', 'statistics']"
>
  <div class="core-preview-metrics">
    <YStatistic title="Core components" :value="50" suffix="ready" tone="success" />
    <YStatistic title="Data display" :value="6" suffix="patterns" tone="info" />
  </div>
  <YDescriptions
    bordered
    title="Core coverage"
    description="Shared primitives for product, admin and brand packages."
    :column="2"
    :items="[
      { key: 'button', label: 'Actions', value: 'YButton, YIconButton' },
      { key: 'form', label: 'Forms', value: 'Input, Select, VirtualizedSelect, TimeSelect, Form, Upload' },
      { key: 'data', label: 'Data', value: 'Table, List, Descriptions, Statistic, Timeline, Tree' },
      { key: 'feedback', label: 'Feedback', value: 'Alert, Message, Result, Empty' }
    ]"
  >
    <template #extra>
      <YButton size="sm" variant="primary">Create</YButton>
    </template>
    <template #item-data>
      <YTag tone="success">Table, List, Descriptions, Statistic, Timeline, Tree</YTag>
    </template>
  </YDescriptions>
</DocDemo>

<style scoped>
.core-preview-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .core-preview-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
