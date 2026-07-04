# Theme Lab

Theme Lab 是 Yok UI 的主题实验室。它把主流组件库常见的“主题定制”能力简化成少量可解释的 token：品牌主色、表面色、文字色、圆角和密度，并在同一界面提供 CSS 导出、TypeScript token 配置、主题评审报告、组件预览和 WCAG 对比度审计。

<ThemeLab />

## Design boundary

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>品牌色先行</h3>
    <p>先定义 primary，再由它推导 soft、border 和局部层级，避免主题变成一组散乱颜色。</p>
  </section>
  <section class="docs-card">
    <h3>密度独立控制</h3>
    <p>后台和产品页需要更高信息密度；品牌页和展示页可以更舒展。密度通过 spacing token 表达。</p>
  </section>
  <section class="docs-card">
    <h3>语义色不装饰化</h3>
    <p>success、warning、danger 只用于状态含义，不随品牌主题随意变色，保证用户认知稳定。</p>
  </section>
</div>

## Apply generated variables

把生成的 CSS 放到应用入口样式，或者包裹在某个主题容器上。Theme Lab 的 selector 输入框可以直接切换导出目标，例如 `.my-yok-theme` 或 `:root`：

```css
.my-yok-theme {
  --yok-color-primary: #147a65;
  --yok-color-primarySoft: #e8fbf5;
  --yok-color-surface: #fffdfa;
  --yok-color-surfaceMuted: #fbfdfc;
  --yok-color-border: #d3ebe4;
  --yok-radius-md: 12px;
}
```

如果是局部主题，搭配 `YThemeProvider` 或业务容器 class 使用，避免污染全站。

## Use token config

`复制 TS 配置` 会生成一份满足 `YokThemeTokens` 类型的主题对象，适合放进业务项目的 `theme.ts`、设计系统包或后续主题预设文件里。相比只复制 CSS，这份配置保留了 color、radius、space、shadow、motion 和 zIndex 的分组结构，后续可以继续用于生成 CSS 变量、主题包或设计评审报告；也可以直接传给 `YThemeProvider` 的 `tokens` prop 做局部主题预览。

```ts
import type { YokThemeTokens } from '@yok-ui/themes'

export const yokCustomTheme = {
  color: {
    primary: '#147a65'
  },
  radius: {
    md: '12px'
  }
} satisfies YokThemeTokens
```

```vue
<template>
  <YThemeProvider :tokens="yokCustomTheme">
    <YourPage />
  </YThemeProvider>
</template>
```

## Inspect single tokens

Token inspector 用来处理“只需要一个变量”的场景。可以按关键词搜索 `primary`、`radius`、`--yok-space` 这类名称，也可以按 color、radius、space、shadow、motion、zIndex 分组筛选；点击任意一行会复制完整 CSS 声明，例如 `--yok-color-primary: #147a65;`。这让主题页面既能导出完整主题，也能像主流组件库的 token 文档一样支持单个变量查找、核对和复制。

## Review report

`复制报告` 会生成一份 Markdown 主题评审材料，包含 selector、核心颜色、密度、圆角、token 数量、四组对比度结果和完整 CSS 变量。它适合粘到 PR 描述、设计评审记录或主题变更说明里，让主题调整不只停留在截图和口头确认。

## Release gates

`复制发布清单` 会把当前主题转换成上线前检查项，覆盖 token 完整度、WCAG 对比度、selector 范围、density、radius 和语义色。它适合放进主题包发布记录或 PR checklist，帮助团队确认这次主题变更没有污染全局样式、没有降低可读性，也没有绕开 Yok UI 的 token 体系。

## Contrast audit

Theme Lab 会同步检查四组关键对比度：

- Text / Surface
- Muted text / Surface
- Primary / Surface
- Button text / Primary

其中正文与按钮文字按 WCAG AA 4.5:1 检查，品牌色展示按 3:1 检查。若调整后的 primary 或文字色不达标，应优先修正 token，而不是在单个组件里硬覆盖颜色。
