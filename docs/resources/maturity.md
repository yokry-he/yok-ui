# Maturity

Maturity 页面用于持续追踪 Yok UI 和主流组件库之间的差距。这里不会粉饰进度：组件数量、API 数据、在线示例、guided 示例深度、workflow 场景矩阵、键盘焦点交互契约、可访问性证据档案、文档站审计目标、稳定状态、覆盖率百分比和后续队列都会从当前 registry、live example 覆盖表、interaction contract、accessibility evidence 与 docs audit target 数据中自动汇总。

从当前版本开始，页面还会维护 `mainstream parity benchmark`：把 Element Plus 官方的组件总览、示例源码操作、Playground 交接、Table、Cascader、DatePicker、ConfigProvider i18n 和 Guide / Component / Resource 信息架构拆成外部基准项，再映射到 Yok UI 的组件、文档路由、Live Example、API evidence 和资源页证据。这样即使内部成熟度指标已经满分，也能继续用外部参照发现下一批追赶方向。

<MaturityDashboard />

## How to read this page

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>先补深度</h3>
    <p>主流组件库的优势不只是组件多，而是每个高频组件都有示例、API、可访问性、边界说明和稳定行为。复杂组件的 live example 需要登记基础态、受控回填、异常态、空态、加载态、批量操作、键盘路径和响应式场景，并在 live acceptance 面板里直接暴露通过项和缺口，而不只是单个 props 调试。</p>
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

这个命令会单独验证 interaction contracts、accessibility evidence、docs audit targets 和 runtime audit core，适合在新增复杂组件、调整顶部导航、改成熟度页或重构 live example 后快速确认文档站质量门禁。

文档站运行后可以再跑真实 URL 扫描：

```bash
DOCS_A11Y_BASE_URL=http://127.0.0.1:5179 pnpm docs:a11y:runtime
```

运行时扫描会访问审计目标页面，检查 HTTP 状态、页面结构、顶部导航、`#live-example` 锚点和审计报告格式，并把最新结果写入 `docs/.vitepress/data/a11y-runtime-report.generated.json`。Maturity 页面会读取这份报告展示最近一次真实 URL 验收结果。

当本机存在 Chrome、Chromium 或 Edge 时，脚本会进一步通过 Chrome DevTools Protocol 执行真实浏览器审计：采集 hydrated HTML、控制台 error、桌面/平板/移动视口下的页面横向溢出，并过滤掉代码块、API 表格这类已经被滚动容器承载的内部宽内容。可以用 `DOCS_A11Y_REPORT_PATH=/tmp/yok-ui-a11y.json` 覆盖报告路径，用 `DOCS_A11Y_ROUTE=/components/input,/components/popover` 只复跑指定路由，用 `DOCS_A11Y_BROWSER=0` 临时降级为 HTTP 结构检查，用 `DOCS_A11Y_CHROME_PATH` 指定浏览器路径。
