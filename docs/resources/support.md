# Support Matrix

Yok UI 的支持矩阵用于回答业务项目接入前最常见的问题：Vue 版本、浏览器边界、构建工具、SSR、主题运行时、可访问性和自动导入是否有明确承诺。

主流 Vue 3 组件库通常会在安装或指南页说明兼容范围。Yok UI 把这些信息独立成资源页，并同步进入 Maturity 看板，避免支持范围只停留在口头约定。

## Runtime

| Surface | Support |
| --- | --- |
| Vue | Vue 3.4+ |
| TypeScript | 包入口输出类型声明，`pnpm typecheck` 作为门禁 |
| Build | Vite library mode，按包输出 `dist/index.js`、`dist/index.d.ts` 和 `style.css` |

## Browsers

Yok UI 面向现代浏览器，基线参考 Vue 3 时代组件库的常见范围：

| Browser | Minimum |
| --- | --- |
| Chrome | 85+ |
| Edge | 85+ |
| Firefox | 79+ |
| Safari | 14.1+ |

Yok UI 不支持 IE。需要更老浏览器时，应由业务项目自行配置 Babel、polyfill 或降级策略。

## Bundlers and Package Managers

| Surface | Support |
| --- | --- |
| Vite | 推荐，当前包构建和文档站均使用 Vite/VitePress |
| Webpack/Rspack | 通过标准 ESM/CSS exports 接入，业务项目需自行处理 CSS 和 Vue SFC 编译 |
| pnpm/npm/yarn | 包安装命令以 pnpm 展示，包发布结构兼容 npm registry 客户端 |
| Auto import | `@yok-ui/resolver` + `unplugin-vue-components` |

## SSR

组件可以在 SSR 应用中渲染基础结构。弹层、焦点恢复、滚动监听、窗口尺寸、上传预览等浏览器能力应在客户端初始化，避免服务端访问 `window`、`document` 或布局测量。

## Theme Runtime

Yok UI 主题依赖 CSS custom properties。`@yok-ui/themes` 输出内置主题 CSS，Theme Lab 和 token tests 会持续验证 token 覆盖、语义色和对比度。

## Accessibility

Yok UI 当前把高风险组件、组件页和文档路由纳入可访问性证据体系。重点检查语义结构、键盘路径、焦点管理、ARIA、响应式和文档说明。

## Evidence

| Evidence | Purpose |
| --- | --- |
| `docs/.vitepress/data/supportMatrix.ts` | 支持矩阵结构化数据 |
| `docs/.vitepress/data/adoptionReadiness.ts` | 安装、自动导入和样式导入门禁 |
| `docs/.vitepress/data/docsA11yAuditTargets.ts` | 文档运行时审计目标 |
| `packages/package-manifest.test.ts` | 包 exports、types 和 style contracts |
| `packages/resolver/src/resolver.test.ts` | 自动导入 resolver |
| `pnpm test` / `pnpm build` / `pnpm docs:a11y` | 回归验证 |
