# Maturity

Maturity 页面用于持续追踪 Yok UI 的真实交付状态。这里不会把组件登记、文档存在或示例存在直接等同于浏览器验证；公开指标只从当前 registry、DocDemo 源码质量和最近一次运行时审计报告中推导。

成熟度采用五级证据：`registered`、`documented`、`example-ready`、`browser-verified` 和 `release-ready`。只有生成报告同时覆盖桌面、平板和手机视口且全部通过，组件才会进入 browser verified。

这套指标刻意保持保守：没有运行时证据的稳定组件仍会停留在 example ready，避免用内部登记数据制造已经发布就绪的错觉。

<VerificationDashboard />

## How to read this page

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>先补深度</h3>
    <p>主流组件库的优势不只是组件多，而是每个高频组件都有示例、API、可访问性、边界说明和稳定行为。组件文档优先对齐 Element Plus 的示例块结构：真实预览、工具栏、源码展开、复制代码、API 和 Accessibility 证据应稳定共存。</p>
  </section>
  <section class="docs-card">
    <h3>再补广度</h3>
    <p>当 Core/Form/Data/Overlay 的复杂组件达到稳定体验后，再扩展更多长尾组件会更可靠。</p>
  </section>
  <section class="docs-card">
    <h3>持续验收</h3>
    <p>每次新增组件或升级文档，都应该同步更新 registry、API 数据、示例场景矩阵、交互契约、可访问性证据、文档站审计目标、测试和资源说明。成熟度页只展示真实存在的文档与测试路径，避免用空统计掩盖缺口。</p>
  </section>
</div>

## Audit command

```bash
pnpm docs:a11y
```

这个命令会单独验证 interaction contracts、accessibility evidence、docs audit targets 和 runtime audit core，适合在新增复杂组件、调整顶部导航、改成熟度页或重构 DocDemo 示例块后快速确认文档站质量门禁。

文档站运行后可以再跑真实 URL 扫描：

```bash
DOCS_A11Y_BASE_URL=http://127.0.0.1:5179 pnpm docs:a11y:runtime
```

运行时扫描会访问审计目标页面，检查 HTTP 状态、页面结构、顶部导航、DocDemo / API / Accessibility 结构和审计报告格式，并把最新结果写入 `docs/.vitepress/data/a11y-runtime-report.generated.json`。Maturity 页面会读取这份报告展示最近一次真实 URL 验收结果。

当本机存在 Chrome、Chromium 或 Edge 时，脚本会进一步通过 Chrome DevTools Protocol 执行真实浏览器审计：采集 hydrated HTML、控制台 error、桌面/平板/移动视口下的页面横向溢出，并过滤掉代码块、API 表格这类已经被滚动容器承载的内部宽内容。可以用 `DOCS_A11Y_REPORT_PATH=/tmp/yok-ui-a11y.json` 覆盖报告路径，用 `DOCS_A11Y_ROUTE=/components/input,/components/popover` 只复跑指定路由，用 `DOCS_A11Y_BROWSER=0` 临时降级为 HTTP 结构检查，用 `DOCS_A11Y_CHROME_PATH` 指定浏览器路径。
