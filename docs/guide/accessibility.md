# Accessibility

Yok UI 的目标是先建立可访问的默认行为，再逐步补齐更复杂的键盘交互和焦点管理。

## Baseline rules

| Area | Rule |
| --- | --- |
| Semantics | 交互元素优先使用原生 `button` / `input`；复杂选择器使用 WAI-ARIA combobox / listbox 模式 |
| Focus | 所有可交互控件都接入 `yok-focus-ring` |
| Contrast | 文本、主按钮和语义状态色通过 token 管理，并由主题测试检查 AA 对比度 |
| Labels | 表单控件提供 `label` 或通过 `YForm` / `YFormItem` 组合，文件选择保留原生 input 语义 |
| Status | `YAlert`、`YMessage`、`message` service、`YProgress`、`YResult`、表格空状态、加载态和摘要使用状态语义或专用 ARIA 角色 |
| Motion | 弹层动效保持短时长，并通过 `prefers-reduced-motion` 降低视觉运动 |
| Dialog | `YModal`、`YDrawer` 使用 `role="dialog"`、`aria-modal="true"`、Escape 关闭、焦点循环、焦点返回和滚动锁定 |
| Floating dismiss | 点击型非模态弹层支持外部 pointer 和顶层 Escape 关闭，且不会把触发器、弹层内部或更高层弹层内部交互误判为外部点击 |
| Navigation | `YPagination`、`YBreadcrumb` 和 `YSteps` 使用 `nav`、可命名区域和当前项语义 |

## Component notes

这些组件说明会同步沉淀到 `.vitepress/data/interactionContracts.ts` 和 `.vitepress/data/accessibilityEvidence.ts`。凡是包含弹层、选择、树、表格、表单错误恢复、命令面板或后台数据操作的组件，都需要登记键盘路径、焦点行为、ARIA 语义和测试证据；否则成熟度看板会把它标记为待补交互契约。

## Evidence model

Yok UI 现在把可访问性成熟度拆成两层数据：

| Layer | Purpose |
| --- | --- |
| `interactionContracts` | 记录复杂组件的交互模式、键盘路径、焦点恢复、ARIA 语义、文档和测试路径。 |
| `accessibilityEvidence` | 为每个注册组件生成证据档案，按 `native`、`standard`、`complex`、`critical` 风险分层，并统计语义、键盘、焦点、ARIA、对比度、动效降级、文档和测试覆盖。 |
| `docsA11yAuditTargets` | 为官网顶层路由、成熟度页和高风险组件页生成审计目标，声明优先级、桌面/移动视口、检查项、live example 路由和证据路径。 |

新增组件时，至少要满足：

1. 在 `componentRegistry` 中登记 `accessibility` 状态和文档路由。
2. 在组件文档中写 `## Accessibility`，说明语义、键盘、状态和限制。
3. 为组件实现测试文件；如果是弹层、选择器、表格、树、Transfer、命令面板、表单错误恢复或后台数据操作组件，还必须补 `interactionContracts`。
4. 运行 `pnpm docs:a11y`，确保成熟度页展示的文档、测试、审计目标和运行时审计核心都保持可用。

## Docs audit targets

官网本身也进入可访问性治理。`docsA11yAuditTargets` 会覆盖：

| Target type | Coverage |
| --- | --- |
| Top navigation | `/guide/`、`/components/`、`/resources/`、`/playground/` 必须进入结构、真实路由、对比度和响应式检查。 |
| Maturity page | `/resources/maturity` 作为 critical 资源页，必须展示证据、队列和移动端检查状态。 |
| High-risk components | 所有 interaction contract 组件必须进入组件页审计，包含 keyboard、focus、ARIA、responsive 检查。 |
| Critical live examples | `Modal`、`Drawer`、`DatePicker`、`DateRangePicker`、`Table`、`DataTable`、`Transfer`、`Tree`、`CommandPalette` 必须拥有 `#live-example` 审计入口。 |

短期内这套数据先作为静态门禁；运行文档站后，可以用真实 URL 扫描补一层运行时检查：

```bash
DOCS_A11Y_BASE_URL=http://127.0.0.1:5179 pnpm docs:a11y:runtime
```

运行时脚本会读取 `docsA11yAuditTargets`，逐个访问目标页面，检查 HTTP 状态、`main`、`h1`、顶部导航、`#live-example` 锚点和运行时报告结构，并把最近一次真实 URL 扫描写入 `docs/.vitepress/data/a11y-runtime-report.generated.json`。如果本机能找到 Chrome、Chromium 或 Edge，脚本会通过 Chrome DevTools Protocol 额外采集真实 hydrated HTML、控制台 error、桌面/平板/移动视口下的页面横向溢出；被明确滚动容器包住的代码块和 API 表格不会被误判为页面级溢出。

可以通过环境变量调整运行方式：

| Variable | Purpose |
| --- | --- |
| `DOCS_A11Y_BASE_URL` | 指向已启动的文档站，例如 `http://127.0.0.1:5179`。 |
| `DOCS_A11Y_REPORT_PATH` | 覆盖报告输出路径，适合 CI 或临时验收。 |
| `DOCS_A11Y_CHROME_PATH` | 指定浏览器可执行文件路径。 |
| `DOCS_A11Y_BROWSER=0` | 关闭真实浏览器审计，降级为 HTTP 结构检查。 |
| `DOCS_A11Y_ROUTE` | 只扫描一个或多个路由，例如 `/components/input,/components/popover`。 |
| `DOCS_A11Y_LIMIT` | 只扫描前 N 个目标，适合调试单次改动。 |

| Component | Accessibility contract |
| --- | --- |
| `YButton` | 支持 `type`、`disabled`、`aria-busy` |
| `YInput` / `YTextarea` | 支持 label、disabled、error 和 `aria-invalid` |
| `YAutocomplete` | 使用 editable `combobox` / `listbox` / `option` 语义，保留自由文本输入，支持方向键、Enter、Escape、loading 与 empty 状态宣告 |
| `YMention` | 使用 textarea + editable `combobox` / `listbox` / `option` 语义，支持 @/# 前缀提及、方向键、Enter 插入、Escape 关闭和状态宣告 |
| `YSelect` | 使用 `combobox` / `listbox` / `option` 语义，面板通过 Floating UI 定位，支持方向键、Home / End、Enter / Space 和 Escape |
| `YVirtualizedSelect` | 复用 `YSelect` 的 combobox / listbox / option 语义，虚拟化 listbox 使用 `aria-setsize` 暴露完整数量，渲染项使用 `aria-posinset` 暴露完整列表位置 |
| `YTreeSelect` | 使用 `combobox` + `tree` 弹层语义，支持过滤、多选、任意层级选择、方向键移动、ArrowRight / ArrowLeft 展开折叠、Enter / Space 选择和 Escape 返回触发器 |
| `YMessageBox` | 使用 `dialog` / `alertdialog` 和焦点陷阱，支持 Escape、Tab 循环、确认/取消 Promise action、prompt 错误宣告和异步确认 loading |
| `YInputNumber` | 使用原生 `input type="number"`，同步 `min`、`max`、`step` 和 `aria-valuenow`，加减按钮提供明确 `aria-label` |
| `YSlider` | 使用原生 `input type="range"`，同步 `min`、`max`、`step`、`aria-valuenow` 和 `aria-valuetext`，保留浏览器键盘交互 |
| `YSplitter` | 分隔条使用 `role="separator"`、`aria-orientation`、`aria-valuemin`、`aria-valuemax` 和 `aria-valuenow`，支持方向键、Home / End 调整尺寸，折叠按钮使用原生 button |
| `YRate` | 使用 `radiogroup` / `radio` 语义，评分按钮提供 `aria-label` 和 `aria-checked`，支持方向键、Home 和 End |
| `YColorPicker` | 使用原生 `input type="color"` 和文本 input，预设色保留 button 语义，支持 `aria-pressed`、错误宣告和键盘操作 |
| `YColorPickerPanel` | 嵌入式面板使用 `role="group"`，原生色板和 HEX 文本输入共享 `aria-describedby`，预设色按钮使用 `aria-pressed` |
| `YDatePicker` | 输入框使用 combobox-like 触发语义，Floating UI 定位日历面板，面板使用 `role="dialog"` + `role="grid"`，快捷项使用命名按钮组，日期使用 `aria-selected`，支持方向键、Home / End、PageUp / PageDown 和 Escape |
| `YDatePickerPanel` | 独立面板使用 `role="group"`，日历区使用 `role="grid"`，快捷项使用命名按钮组，日期使用 `aria-selected`，支持方向键、Home / End、PageUp / PageDown 并跳过禁用日期 |
| `YDateRangePicker` | 输入框触发 Floating UI 范围日历面板，日期网格使用 `role="grid"`，快捷项使用命名按钮组，起止日期使用 `aria-selected`，支持方向键、Enter / Space、Home / End、PageUp / PageDown 和 Escape |
| `YTimePicker` | 输入框触发 Floating UI 时间面板，面板使用 `role="dialog"` 和双 `listbox`，支持方向键、Enter / Space 和 Escape |
| `YTimeSelect` | 固定时间列表复用 `YSelect` 的 `combobox` / `listbox` 语义，范围禁用项同步设置 disabled 和 `aria-disabled` |
| `YCascader` | 输入框触发 Floating UI 级联面板，列使用 `role="listbox"`，multiple 时同步 `aria-multiselectable`，选项使用 `role="option"` 和 `aria-selected`，支持方向键、Enter / Space 和 Escape；懒加载节点同步 `aria-busy` / `role="status"`，失败节点使用 `role="alert"` 并保持可重试 |
| `YUpload` | 使用原生 `input type="file"`，拖拽模式仍保留可点击按钮，文件数量摘要使用 `aria-live`，空状态使用 `role="status"` |
| `YTransfer` | 使用原生 checkbox 勾选项，左右列表使用 `role="listbox"` 和 `aria-multiselectable`，移动按钮提供明确 `aria-label` |
| `YForm` / `YFormItem` / `YFormSummary` | `YForm` 使用原生 form 和 fieldset，单字段错误使用 `role="alert"`，字段 slot 暴露 `labelFor` 和 `messageId` 用于关联输入控件，表单摘要使用 assertive alert 并支持跳转字段，长表单可启用 `scroll-to-error` 定位首个错误 |
| `YMessage` / `message` service | 默认使用 `role="status"` 和 `aria-atomic="true"`，service 的 warning / danger 使用 `role="alert"` |
| `YProgress` | 使用 `role="progressbar"`、`aria-valuenow`、`aria-valuemin` 和 `aria-valuemax` |
| `YTabs` | 使用 `tablist`、`tab`、`tabpanel` 语义，tab 与 panel 通过 `aria-controls` / `aria-labelledby` 关联，支持 roving tabindex、方向键、Home / End、自动和手动激活 |
| `YBreadcrumb` | 使用 `nav` + 有序列表表达路径层级，当前页使用 `aria-current="page"` |
| `YSteps` | 使用 `nav` + 有序列表表达流程顺序，当前步骤使用 `aria-current="step"` |
| `YTour` | 使用 `role="dialog"`、`aria-modal`、焦点锁定和 Escape 关闭；目标高亮只作为视觉说明并通过 `aria-hidden` 隐藏 |
| `YDropdown` | 使用 `aria-haspopup="menu"`、`aria-expanded`、`menuitem`，支持方向键、Home / End 和 Escape |
| `YTooltip` | hover 与 focus 均可显示，触发元素自动关联 `aria-describedby`，面板通过 Floating UI 定位，支持展示延迟 |
| `YPopover` | 触发器关联面板，面板通过 Floating UI 定位，支持 click、Enter、Space、Escape |
| `YModal` / `YDrawer` | 打开后聚焦弹层内控件，Tab 循环，关闭后返回触发器 |
| `YCommandPalette` | 输入框使用 combobox 语义，方向键移动当前命令，Enter 选择 |
| `YTable` | 使用原生 table、caption、`scope="col"` 和可滚动容器，`maxHeight` 只限制滚动容器并让表头在容器内吸顶，固定表头和固定列只改变视觉定位不改变表格语义，排序表头同步 `aria-sort`，表头筛选使用原生 details、checkbox / radio 和 button，行选择使用原生 checkbox 与全选 indeterminate 状态，加载态同步 `aria-busy` 并用 live status 宣告，空状态插槽仍包裹在 status 容器中，底部摘要可表达总数或选中状态 |
| `YList` | 使用具名 section 和原生 `ul` / `li` 表达条目集合，loading 与 empty 使用 `role="status"`，自定义 item 插槽应保留可读文本和操作按钮语义 |
| `YDescriptions` | 使用具名 section 和原生 `dl` / `dt` / `dd` 表达只读详情，空状态使用 `role="status"`，自定义值插槽不破坏标签和值的语义关联 |
| `YQRCode` | 使用 SVG `role="img"` 和明确 `aria-label` 表达二维码含义，loading 使用 `role="status"` 和 `aria-busy`，expired 使用 `role="alert"`，刷新和下载保持原生 button 键盘路径 |
| `YFloatButton` / `YFloatButtonGroup` | 固定快捷动作使用原生 button 和明确 `aria-label`；按钮组触发器同步 `aria-haspopup="menu"` 与 `aria-expanded`，展开动作使用 `role="menu"` / `role="menuitem"` |
| `YStatistic` | 使用具名 section、`aria-busy` 表达加载状态，数值、前缀和单位均以文本呈现，自定义 formatter 不应只依赖颜色传达含义 |
| `YResult` | 使用具名 section 表达页面级结果，默认图标为装饰性内容并隐藏给辅助技术，状态通过标题和说明文本传达而不只依赖颜色 |
| `YTimeline` | 使用具名 section 和 `ol` / `li` 表达有序事件流，时间文本使用原生 `time`，自定义 dot 默认作为装饰性轴线处理 |
| `YCrudLayout` | 外层使用具名 section，标题区复用 `YPageHeader` 的 heading 结构，侧栏使用 `aside`，主内容不强行声明页面级 landmark，筛选和表格语义由插入组件继承 |
| `YFilterTabs` | 使用 `tablist` / `tab` 语义，当前项同步 `aria-selected`，禁用项保留原生 disabled，支持方向键、Home 和 End 在可用筛选项之间切换 |
| `YSearchForm` | 使用原生 form 和 submit/reset 动作，内置字段继承 label 语义，筛选数量通过 polite status 宣告，展开按钮同步 `aria-expanded` |
| `YDataTable` | 外层同步 `aria-busy`，loading 和错误状态分别使用 live status / `role="alert"`，批量栏复用 `YBulkActionBar` 的 status、原生按钮和清空选择语义，自定义空状态继承内部表格 status 容器并可触发刷新，列设置使用原生 checkbox 并至少保留一列，密度切换使用 `role="group"` 与 `aria-pressed`，remote 模式通过统一请求事件保留清晰状态流，继承 `YTable` / `YPagination` 的 caption、summary、固定表头、表头筛选、排序、选择和分页语义 |
| `YBulkActionBar` | 使用 `role="status"` 和 polite live region 宣告选中状态，批量动作与清空操作保持原生 button，未选中时禁用内置动作避免误触 |
| `YStatusTimeline` | 使用具名 section + `ol` / `li` 表达有序状态流，当前节点同步 `aria-current="step"`，节点操作区保持原生按钮语义 |
| `YReviewWorkflow` | 使用具名 section 和 `aria-busy` 表达审核流程容器状态，流程继承 `YStatusTimeline` 的有序列表语义，内置决策操作保持原生 button 并在 loading / disabled 时阻止重复触发 |
| `YSavedViews` | 使用具名 section、原生 button 列表和 `aria-pressed` 表达当前视图，空状态使用 `role="status"`，创建/保存/管理动作保持原生按钮语义 |
| `YVirtualList` | 使用 `role="list"` / `role="listitem"`、`aria-setsize` 和 `aria-posinset` 表达虚拟化后的完整列表位置 |
| `YTree` | 使用 `role="tree"` / `role="treeitem"`、`aria-level`、`aria-expanded`、`aria-selected`，勾选框使用 `aria-checked` 并支持 mixed 半选状态；异步节点加载暴露 `aria-busy`、`role="status"` 和 `role="alert"`；拖拽模式保留原生 Drag and Drop 与键盘树导航，支持方向键、Home / End、Enter / Space |

## Current gaps

| Gap | Planned direction |
| --- | --- |
| Automated browser audit | 引入 axe / Playwright，对文档站关键页面做持续扫描 |
| Interaction contract depth | 继续把剩余后台组合组件、品牌组件和长尾展示组件按风险登记到 `interactionContracts` |

这些 gap 不阻塞当前组件使用，但会作为后续稳定版本前的重点质量项。主题对比度已经通过 [Color Contrast](/guide/color-contrast) 的自动化测试覆盖，Tooltip 的屏幕阅读器命名关系也已经纳入组件测试。
