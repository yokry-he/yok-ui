# Theming

Yok UI 使用 CSS variables 作为主题基础，并提供 TypeScript token 方便后续生成设计资源。

## Built-in themes

<div class="token-grid">
  <section class="token-swatch">
    <span style="background:#36c6a3"></span>
    <strong>yok-light</strong>
    <small>清爽可爱的默认主题</small>
  </section>
  <section class="token-swatch">
    <span style="background:#2aa7b8"></span>
    <strong>yok-clean</strong>
    <small>更克制的后台预览主题</small>
  </section>
  <section class="token-swatch">
    <span style="background:#9f345f"></span>
    <strong>yok-candy</strong>
    <small>柔和糖果粉，但保持 AA 对比度</small>
  </section>
  <section class="token-swatch">
    <span style="background:#ff8fb3"></span>
    <strong>accent pink</strong>
    <small>用于轻量强调</small>
  </section>
  <section class="token-swatch">
    <span style="background:#ffd76d"></span>
    <strong>accent yellow</strong>
    <small>用于柔和提示</small>
  </section>
</div>

## Theme provider

```vue
<YThemeProvider theme="yok-candy" density="comfortable">
  <YButton variant="primary">Create</YButton>
</YThemeProvider>
```

## Live example

<LiveExampleRunner preset="themeProvider" />

## Theme metadata

`@yok-ui/themes` 导出 `builtinThemes`，用于文档、主题切换器和设计工具共享同一份主题列表。

```ts
import { builtinThemes, yokCandy, createThemeVars } from '@yok-ui/themes'

const themes = builtinThemes.map((theme) => theme.label)
const candyVars = createThemeVars(yokCandy)
```

## Theme Lab workflow

[Theme Lab](/resources/theme-lab) 用同一套 token 生成逻辑服务可视化编辑、CSS 导出和对比度审计。它会把 primary、surface、text、radius、density 推导成完整的 `color`、`radius`、`space`、`shadow`、`motion`、`zIndex` 分组，并通过 `auditContrastPairs` 检查正文、弱化文字、品牌色和按钮文字的关键对比度。

主题上线前建议至少完成三步：

1. 在 Theme Lab 中调整 token，并确认 Contrast audit 全部通过。
2. 复制生成的 CSS 到应用入口或局部主题容器。
3. 在 Product、Admin、Brand 三种预览模式下确认密度、圆角和品牌感没有破坏可读性。

## Token groups

| Group | Purpose |
| --- | --- |
| `color` | primary、surface、text、border、status |
| `radius` | 控件、面板和展示块圆角 |
| `space` | 4px 基础间距节奏 |
| `shadow` | 柔和层级 |
| `motion` | 短、轻、稳定的动效 |

## CSS variable naming

Yok UI 运行时使用 `--yok-*` CSS variables。组件内部只读取变量，不写死颜色和空间值。

```css
:root {
  --yok-color-primary: #147a65;
  --yok-radius-md: 12px;
  --yok-space-4: 16px;
}
```

完整 token 列表见 [Token Reference](/guide/token-reference)。
