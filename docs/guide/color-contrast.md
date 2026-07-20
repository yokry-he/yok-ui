# Color Contrast

Yok UI 的主题色既要保持清爽可爱的气质，也要能承担真实产品里的文字、按钮和状态表达。主题包现在提供自动化对比度审计，防止后续改色时破坏 WCAG AA 基线。

## Automated audit

`@yok-ui/themes` 导出对比度工具：

```ts
import { auditContrastPairs, getContrastRatio, yokCandy } from '@yok-ui/themes'

const ratio = getContrastRatio('#ffffff', yokCandy.color.primary)
```

主题测试会检查 12 套内置主题的关键组合：

<div class="docs-table-wrap">

| Pair | Minimum | Reason |
| --- | --- | --- |
| `color.text` on `color.surface` | `4.5:1` | 正文 |
| `color.textMuted` on `color.surface` | `4.5:1` | 辅助说明 |
| `color.text` on `color.surfaceMuted` | `4.5:1` | 面板正文 |
| `color.textMuted` on `color.surfaceMuted` | `4.5:1` | 面板辅助说明 |
| white text on `color.primary` | `4.5:1` | 主按钮 |
| `color.danger` on `color.surface` | `4.5:1` | 错误文本 |
| `color.warning` on `color.surface` | `4.5:1` | 警告文本 |
| `color.success` on `color.surface` | `4.5:1` | 成功文本 |

</div>

## Current theme choices

为了通过 AA，Yok UI 将“可爱感”和“可读性”分层处理：

- `primary`、`danger`、`warning`、`success` 是可作为文字或按钮背景的语义色，必须足够深。
- `primarySoft` 和 accent 色负责轻量背景、提示氛围和视觉亲和力。
- 组件里的正文和辅助文案优先使用 `text` / `textMuted`，避免临时颜色。

## Adding a new theme

新增主题时，把主题加入 `builtinThemes`、CSS 导出和 `packages/themes/src/tokens.test.ts` 的对比度矩阵。若某个颜色只用于装饰，不应进入文字或按钮前景/背景组合；若它会承载文本，就必须通过 `4.5:1`。

```ts
const results = auditContrastPairs([
  {
    name: 'custom: primary button text',
    foreground: '#ffffff',
    background: customTheme.color.primary,
    minimum: 4.5
  }
])
```

## Verification

```bash
pnpm test packages/themes/src/tokens.test.ts
```
