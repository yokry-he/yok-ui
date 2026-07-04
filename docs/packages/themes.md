# Themes

`@yok-ui/themes` 是 Yok UI 的设计 token 与主题 CSS 包。组件包通过 CSS 变量读取颜色、圆角、阴影、间距和状态色，避免把视觉值散落在组件内部。

## Install

```bash
pnpm add @yok-ui/themes
```

## Usage

```ts
import '@yok-ui/themes/yok-light.css'
```

## Theme layers

- `yok-light.css`：默认清爽主题。
- `yok-clean.css`：更克制的文档和后台主题。
- `yok-candy.css`：更可爱的品牌展示主题。

## Boundary

Themes 不包含 Vue 组件逻辑。所有视觉变量应通过主题 CSS、token 文档和组件 class 消费，避免在业务样式中污染组件库内部 DOM。
