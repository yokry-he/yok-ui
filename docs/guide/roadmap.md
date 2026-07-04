# Roadmap

Yok UI 的路线图按“可用组件库”的成熟路径推进：先有包结构和基础组件，再补场景包、文档质量、可访问性和发布工程。

## Current status

| Area | Status | Notes |
| --- | --- | --- |
| Themes | Ready | `yok-light`、`yok-clean`、`yok-candy`、主题元数据、token generator |
| Core | Ready | 41 个基础组件，覆盖表单校验、文本/数字输入、滑块、评分、颜色、日期/时间/范围选择、同步/异步层级选择、穿梭选择、反馈、页面结果、弹层、数据展示、列表、详情描述、统计数值、时间线、表格排序/选择、异步/虚拟化树、虚拟滚动和命令式反馈 API |
| Product | Ready | 命令面板、复制、代码块、主题切换 |
| Admin | Ready | 页面标题、指标卡片、筛选面板、SearchForm、CrudLayout、FilterTabs、SavedViews、数据工具栏、DataTable、BulkActionBar、StatusTimeline、ReviewWorkflow 列表与流程组合 |
| Brand | Ready | 首屏、功能网格、个人卡片、Logo Cloud |
| Docs | In progress | 已有 Guide、Packages、Components、Blocks |

## Next milestones

| Milestone | Focus |
| --- | --- |
| `0.2` Quality baseline | 焦点管理、键盘交互、组件 API 稳定性 |
| `0.3` Admin depth | SearchForm date / async presets、review workflow variants、advanced saved-view management、BulkActionMenu |
| `0.4` Brand depth | ShowcaseCard、Timeline、PricingSection、Gallery |
| `0.5` Developer experience | CLI scaffold、typed component metadata、changelog |
| `1.0` Stable release | 可访问性审计、视觉回归、发布文档、版本策略 |

## Component backlog

| Package | Candidates |
| --- | --- |
| Core | Date presets with time |
| Product | SettingsLayout、ShortcutRecorder、CommandGroup |
| Admin | SearchForm date / async presets、SavedViewManager、BulkActionMenu、ApprovalCommentBox |
| Brand | ShowcaseCard、PricingSection、Timeline、Gallery |

## Release principles

- 每个组件必须有文档页、API 表和至少一个测试。
- 场景包必须复用 Core，不复制基础控件。
- 主题能力必须通过 token 和 CSS variables 表达。
- 可访问性问题进入 roadmap，不用视觉 polish 掩盖交互缺口。
