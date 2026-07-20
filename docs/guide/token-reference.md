# Token Reference

Yok UI 的主题 token 同时服务 TypeScript 和 CSS variables。`@yok-ui/themes` 提供 12 套内置主题、`builtinThemes` 和 `createThemeVars`，组件侧统一读取 `--yok-*` 变量。

## Color tokens

| Token | Light | Clean | Candy | Usage |
| --- | --- | --- | --- | --- |
| `color.primary` | `#147a65` | `#1f8190` | `#9f345f` | 主按钮、激活态、重点标签 |
| `color.primarySoft` | `#e8fbf5` | `#e7f7fa` | `#fff0f6` | 轻量背景、选中态 |
| `color.accentPink` | `#ff8fb3` | `#ff8fb3` | `#ff9fc4` | 友好强调 |
| `color.accentBlue` | `#7cc7ff` | `#7cc7ff` | `#8bcdf7` | 辅助强调 |
| `color.accentYellow` | `#ffd76d` | `#ffd76d` | `#ffe08a` | 温和提示 |
| `color.surface` | `#fffdfa` | `#ffffff` | `#fffaff` | 页面和卡片背景 |
| `color.surfaceMuted` | `#f6f8f7` | `#f5f7f8` | `#fff0f7` | 次级背景 |
| `color.text` | `#25302d` | `#243033` | `#30272d` | 主文本 |
| `color.textMuted` | `#68736f` | `#68736f` | `#6f5b66` | 辅助文本 |
| `color.border` | `#dfe8e4` | `#dce5e8` | `#ead7e2` | 边框 |
| `color.danger` | `#b83a48` | `#b83a48` | `#b83a48` | 错误和危险 |
| `color.warning` | `#956600` | `#956600` | `#8a6400` | 警告 |
| `color.success` | `#167a59` | `#167a59` | `#167a59` | 成功 |

## Radius tokens

| Token | Light | Clean | Candy | Usage |
| --- | --- | --- | --- | --- |
| `radius.xs` | `6px` | `6px` | `6px` | 小标签、细节 |
| `radius.sm` | `8px` | `8px` | `8px` | 小控件 |
| `radius.md` | `12px` | `10px` | `14px` | 按钮、输入框 |
| `radius.lg` | `16px` | `14px` | `18px` | 卡片、面板 |
| `radius.xl` | `22px` | `22px` | `26px` | 大展示块 |

## Space tokens

| Token | Value | Usage |
| --- | --- | --- |
| `space.1` | `4px` | 极小间距 |
| `space.2` | `8px` | 紧凑控件间距 |
| `space.3` | `12px` | 默认行内间距 |
| `space.4` | `16px` | 默认块间距 |
| `space.5` | `20px` | 面板内边距 |
| `space.6` | `24px` | 大区块间距 |

## Shadow and motion

| Token | Value | Usage |
| --- | --- | --- |
| `shadow.soft` | `0 8px 24px rgba(37, 48, 45, 0.08)` | 普通卡片层级 |
| `shadow.pop` | `0 14px 40px rgba(37, 48, 45, 0.12)` | 弹层和突出卡片 |
| `motion.fast` | `120ms ease` | hover、focus、轻量反馈 |
| `motion.normal` | `180ms ease` | 模态层和较明显的状态切换 |

Yok UI 的弹层动效统一使用 opacity + transform，并通过 `prefers-reduced-motion` 降低运动量。非模态弹层默认使用 `motion.fast`，Modal、Drawer、CommandPalette 默认使用 `motion.normal`。

## Z-index scale

| Token | Value | Usage |
| --- | --- | --- |
| `zIndex.tooltip` | `900` | Tooltip 等轻量说明层 |
| `zIndex.floating` | `1000` | 非模态浮层的默认 fallback |
| `zIndex.drawer` | `1900` | Drawer 默认 fallback |
| `zIndex.modal` | `2000` | Modal / CommandPalette 默认 fallback |
| `zIndex.toast` | `3000` | Message / Toast 栈 |

打开状态下的浮层会通过 `useLayerStack` 在 fallback 基础上追加运行时顺序值，因此后打开的弹层会自动位于更上方。

## Generate CSS variables

```ts
import { createThemeVars, yokCandy } from '@yok-ui/themes'

const vars = createThemeVars(yokCandy)
```

需要在线核对或复制单个变量时，可以进入 Theme Lab 的 Token inspector。它按 token 分组展示生成结果，支持关键词过滤，并且点击变量行即可复制一条完整 CSS 声明。
