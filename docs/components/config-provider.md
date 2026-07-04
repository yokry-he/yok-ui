<script setup lang="ts">
const packageOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Product', value: 'product' },
  { label: 'Admin', value: 'admin' }
]

const cascaderOptions = [
  {
    value: 'core',
    label: 'Core',
    children: [
      { value: 'form', label: 'Form' },
      { value: 'overlay', label: 'Overlay' }
    ]
  },
  {
    value: 'product',
    label: 'Product',
    children: [
      { value: 'copy', label: 'Copy' },
      { value: 'docs', label: 'Docs' }
    ]
  }
]

const setup = `import {
  YButton,
  YCascader,
  YColorPicker,
  YConfigProvider,
  YDatePicker,
  YDateRangePicker,
  YInput,
  YInputNumber,
  YSelect,
  YTextarea,
  YTimePicker
} from '@yok-ui/core'

const packageOptions = ${JSON.stringify(packageOptions, null, 2)}

const cascaderOptions = ${JSON.stringify(cascaderOptions, null, 2)}`

const code = `<YConfigProvider size="lg" density="compact" locale="zh-CN">
  <div class="demo-stack">
    <YInput label="Library name" model-value="Yok UI" />
    <YTextarea label="Release note" model-value="Config applies here too." />
    <YInputNumber label="Version" :model-value="6" />
    <YSelect
      label="Package"
      model-value="core"
      :options="packageOptions"
    />
    <YDatePicker model-value="2026-06-13" label="Release date" />
    <YDateRangePicker :model-value="['2026-06-13', '2026-06-20']" label="Sprint range" />
    <YTimePicker model-value="09:30" label="Review time" />
    <YCascader :model-value="['core', 'form']" :options="cascaderOptions" label="Component path" />
    <YColorPicker model-value="#14B8A6" label="Accent color" />
    <YButton variant="primary">Create with global size</YButton>
  </div>
</YConfigProvider>`
</script>

# Config Provider

Config Provider 用于给一段组件树提供统一配置。它对标 Element Plus、Ant Design Vue 这类主流组件库的全局配置入口，先覆盖 Yok UI 当前最需要稳定传递的 `size`、`density`、`locale` 和 `namespace`。

当前 `size` 已覆盖 Button、Input、Textarea、Input Number、Select、Date Picker、Date Range Picker、Time Picker、Cascader、Color Picker 等高频表单控件；后续新增控件也应优先接入这套上下文，而不是各自维护孤立默认值。

## Example

<DocDemo
  title="Scoped defaults"
  description="子组件没有显式传 size 时，会读取 ConfigProvider 提供的默认值。"
  :code="code"
  :setup="setup"
  :usage="['global size', 'density', 'locale']"
>
  <YConfigProvider size="lg" density="compact" locale="zh-CN">
    <div class="demo-stack">
      <YInput label="Library name" model-value="Yok UI" />
      <YTextarea label="Release note" model-value="Config applies here too." />
      <YInputNumber label="Version" :model-value="6" />
      <YSelect
        label="Package"
        model-value="core"
        :options="packageOptions"
      />
      <YDatePicker model-value="2026-06-13" label="Release date" />
      <YDateRangePicker :model-value="['2026-06-13', '2026-06-20']" label="Sprint range" />
      <YTimePicker model-value="09:30" label="Review time" />
      <YCascader :model-value="['core', 'form']" :options="cascaderOptions" label="Component path" />
      <YColorPicker model-value="#14B8A6" label="Accent color" />
      <YButton variant="primary">Create with global size</YButton>
      <YButton size="sm" variant="secondary">Explicit small button</YButton>
    </div>
  </YConfigProvider>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="configProvider"
  title="在线编辑 Config Provider 示例"
  description="切换全局尺寸、密度、locale、移动默认值和键盘路径，观察子组件如何继承配置。"
/>

## API

<ComponentApiSection name="YConfigProvider" />

## Accessibility

- `YConfigProvider` 不会进入焦点顺序，键盘路径仍由内部按钮、输入框和链接决定。
- `locale` 会写入外层 `lang`，帮助辅助技术选择合适的朗读语言。
- 组件显式传入 `size` 时优先级高于全局配置，避免局部特殊控件被全局设置意外压缩。
- `density="compact"` 会让已接入控件收紧高度和间距，但不会移除原生输入、按钮或 listbox 语义。
