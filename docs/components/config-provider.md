<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useYokConfig } from '@yok-ui/core'

const packageOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Product', value: 'product' },
  { label: 'Admin', value: 'admin' }
]

const ConfigReadout = defineComponent({
  name: 'ConfigReadout',
  setup() {
    const config = useYokConfig()

    return () => h('div', { class: 'demo-stack' }, [
      h('strong', config.t('select.placeholder')),
      h('span', `${config.locale.value} · ${config.direction.value} · ${config.font.value}`)
    ])
  }
})

const scopedSetup = `import {
  YButton,
  YConfigProvider,
  YInput,
  YSelect
} from '@yok-ui/core'

const packageOptions = ${JSON.stringify(packageOptions, null, 2)}`

const scopedCode = `<YConfigProvider size="lg" density="compact" locale="zh-CN">
  <div class="demo-stack">
    <YInput label="组件库名称" model-value="Yok UI" />
    <YSelect
      label="包"
      model-value="core"
      :options="packageOptions"
    />
    <YButton variant="primary">创建组件</YButton>
    <YButton size="sm" variant="secondary">显式小尺寸</YButton>
  </div>
</YConfigProvider>`

const localeSetup = `import { defineComponent, h } from 'vue'
import { YConfigProvider, useYokConfig } from '@yok-ui/core'

const ConfigReadout = defineComponent({
  setup() {
    const config = useYokConfig()

    return () => h('div', { class: 'demo-stack' }, [
      h('strong', config.t('select.placeholder')),
      h('span', \`${'${config.locale.value}'} · ${'${config.direction.value}'}\`)
    ])
  }
})`

const localeCode = `<div class="demo-grid demo-grid--3">
  <YConfigProvider locale="en-US">
    <ConfigReadout />
  </YConfigProvider>
  <YConfigProvider locale="zh-CN">
    <ConfigReadout />
  </YConfigProvider>
  <YConfigProvider locale="ja-JP">
    <ConfigReadout />
  </YConfigProvider>
</div>`

const appearanceSetup = `import { YButton, YConfigProvider } from '@yok-ui/core'`
const appearanceCode = `<div class="demo-grid demo-grid--3">
  <YConfigProvider theme="yok-light" font="system">
    <YButton variant="primary">System</YButton>
  </YConfigProvider>
  <YConfigProvider theme="yok-mint" font="rounded">
    <YButton variant="primary">Rounded</YButton>
  </YConfigProvider>
  <YConfigProvider theme="yok-ink" font="mono">
    <YButton variant="primary">Mono</YButton>
  </YConfigProvider>
</div>`

const buttonSetup = `import { YButton, YConfigProvider } from '@yok-ui/core'

const buttonDefaults = {
  variant: 'primary',
  round: true,
  autoInsertSpace: true
}`

const buttonCode = `<YConfigProvider :button="buttonDefaults">
  <div class="demo-row">
    <YButton>确认发布</YButton>
    <YButton variant="secondary" :round="false">显式覆盖</YButton>
  </div>
</YConfigProvider>`

const buttonDefaults = {
  variant: 'primary' as const,
  round: true,
  autoInsertSpace: true
}
</script>

# Config Provider

Config Provider 为一段组件树提供统一运行时配置。它支持尺寸、密度、语言、文本方向、主题、字体、浮层层级和组件默认值；组件显式传入的 props 始终优先于全局配置。

## 全局配置 {#global-configuration}

通过 Vue 插件参数设置应用级默认值。需要在某个页面切换主题、字体或语言时，再使用 `YConfigProvider` 创建局部配置域。

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

::: tip TIP
组件 props > 最近一层 `YConfigProvider` > 外层 Provider 或插件配置 > Yok UI 内置默认值。
:::

## 局部默认值 {#scoped-defaults}

Provider 只影响自己的后代，不会污染页面上的其他组件。

<DocDemo
  title="局部默认值"
  description="未显式传入 size 的表单控件会继承 lg；最后一个按钮通过自身 props 覆盖为 sm。"
  :code="scopedCode"
  :setup="scopedSetup"
  :usage="['scoped config', 'explicit override', 'density']"
>
  <YConfigProvider size="lg" density="compact" locale="zh-CN">
    <div class="demo-stack">
      <YInput label="组件库名称" model-value="Yok UI" />
      <YSelect label="包" model-value="core" :options="packageOptions" />
      <YButton variant="primary">创建组件</YButton>
      <YButton size="sm" variant="secondary">显式小尺寸</YButton>
    </div>
  </YConfigProvider>
</DocDemo>

## 语言与方向 {#locale-and-direction}

内置 `en-US`、`zh-CN` 和 `ja-JP`。也可以传入符合 `YokLocale` 的自定义语言包；`direction="auto"` 会跟随语言包方向，并可显式设为 `ltr` 或 `rtl`。

<DocDemo
  title="内置语言包"
  description="同一读取组件在三个独立配置域中获得对应文案、lang 和 dir。"
  :code="localeCode"
  :setup="localeSetup"
  :usage="['en-US', 'zh-CN', 'ja-JP']"
>
  <div class="demo-grid demo-grid--3">
    <YConfigProvider locale="en-US"><ConfigReadout /></YConfigProvider>
    <YConfigProvider locale="zh-CN"><ConfigReadout /></YConfigProvider>
    <YConfigProvider locale="ja-JP"><ConfigReadout /></YConfigProvider>
  </div>
</DocDemo>

## 主题与字体 {#theme-and-font}

Yok UI 提供 12 套主题与 5 套无需下载网络字体的字体栈。主题负责颜色、圆角、间距、阴影和动效，字体配置只负责排版，不会改写组件尺寸。

<DocDemo
  title="主题与字体域"
  description="不同配置域可以同时使用各自的主题与字体，适合品牌预览、多租户和编辑器场景。"
  :code="appearanceCode"
  :setup="appearanceSetup"
  :usage="['12 themes', '5 font presets', 'scoped tokens']"
>
  <div class="demo-grid demo-grid--3">
    <YConfigProvider theme="yok-light" font="system"><YButton variant="primary">System</YButton></YConfigProvider>
    <YConfigProvider theme="yok-mint" font="rounded"><YButton variant="primary">Rounded</YButton></YConfigProvider>
    <YConfigProvider theme="yok-ink" font="mono"><YButton variant="primary">Mono</YButton></YConfigProvider>
  </div>
</DocDemo>

| 配置 | 内置值 |
| --- | --- |
| Themes | `yok-light`, `yok-clean`, `yok-candy`, `yok-mint`, `yok-forest`, `yok-ocean`, `yok-sakura`, `yok-peach`, `yok-sunrise`, `yok-lavender`, `yok-slate`, `yok-ink` |
| Fonts | `system`, `humanist`, `rounded`, `serif`, `mono` |

## 组件默认值 {#component-defaults}

组件级配置用于统一产品规范，同时保留单个组件的覆盖能力。目前 `button` 支持 variant、原生 type、plain、text、round、dashed 与中文字符自动空格等默认值。

<DocDemo
  title="Button 默认值"
  description="第一个按钮继承 Provider；第二个按钮显式覆盖 variant 与 round。"
  :code="buttonCode"
  :setup="buttonSetup"
  :usage="['button defaults', 'prop precedence', 'typed config']"
>
  <YConfigProvider :button="buttonDefaults">
    <div class="demo-row">
      <YButton>确认发布</YButton>
      <YButton variant="secondary" :round="false">显式覆盖</YButton>
    </div>
  </YConfigProvider>
</DocDemo>

## 嵌套配置 {#nested-configuration}

嵌套 Provider 仅覆盖传入的字段，其余字段继续继承父级配置。`button` 等对象配置按字段浅合并，适合在页面级默认值上做局部调整。

```vue
<YConfigProvider locale="zh-CN" theme="yok-light" :button="{ round: true }">
  <YConfigProvider font="rounded" :button="{ variant: 'primary' }">
    <!-- locale、theme、round 来自父级；font、variant 来自当前层 -->
    <YButton>提交审核</YButton>
  </YConfigProvider>
</YConfigProvider>
```

## Config Provider API {#config-provider-api}

<ComponentApiSection name="YConfigProvider" />

## Accessibility {#accessibility}

- Provider 本身不进入焦点顺序，键盘路径仍由内部交互组件决定。
- `locale` 与 `direction` 会写入根元素的 `lang`、`dir`，帮助辅助技术选择正确语言和阅读方向。
- 密度和字体只改变视觉呈现，不移除内部控件的语义、焦点样式或键盘能力。
- 自定义主题 token 仍需满足 WCAG 对文本、边框和交互状态的对比度要求。
