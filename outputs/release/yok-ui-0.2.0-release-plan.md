# Yok UI 0.2.0 release dry-run

> Dry run only. This artifact does not mutate package.json versions and does not publish packages.

## Summary

- Current version: 0.1.0
- Target version: 0.2.0
- Release candidates: 57
- Blocked components: 0
- Package plans: 3
- Generated at: 2026-07-03T23:39:37.528Z

## Package plans

### @yok-ui/core

- Current version: 0.1.0
- Target version: 0.2.0
- Scope: Core

- Affix (YAffix): Beta -> Stable, score 100.
- Anchor (YAnchor): Beta -> Stable, score 100.
- Autocomplete (YAutocomplete): Beta -> Stable, score 100.
- Calendar (YCalendar): Beta -> Stable, score 100.
- Carousel (YCarousel): Beta -> Stable, score 100.
- Cascader (YCascader): Beta -> Stable, score 100.
- Color Picker (YColorPicker): Beta -> Stable, score 100.
- Countdown (YCountdown): Beta -> Stable, score 100.
- Date Picker (YDatePicker): Beta -> Stable, score 100.
- Date Range Picker (YDateRangePicker): Beta -> Stable, score 100.
- Descriptions (YDescriptions): Beta -> Stable, score 100.
- Drawer (YDrawer): Beta -> Stable, score 100.
- Dropdown (YDropdown): Beta -> Stable, score 100.
- Float Button (YFloatButton): Beta -> Stable, score 100.
- Float Button Group (YFloatButtonGroup): Beta -> Stable, score 100.
- Form (YForm): Beta -> Stable, score 100.
- Image (YImage): Beta -> Stable, score 100.
- Input Number (YInputNumber): Beta -> Stable, score 100.
- Layout (YLayout): Beta -> Stable, score 100.
- List (YList): Beta -> Stable, score 100.
- Loading (YLoading): Beta -> Stable, score 100.
- Mention (YMention): Beta -> Stable, score 100.
- Menu (YMenu): Beta -> Stable, score 100.
- Message Box (YMessageBox): Beta -> Stable, score 100.
- Modal (YModal): Beta -> Stable, score 100.
- Notification (YNotification): Beta -> Stable, score 100.
- Popover (YPopover): Beta -> Stable, score 100.
- QRCode (YQRCode): Beta -> Stable, score 100.
- Rate (YRate): Beta -> Stable, score 100.
- Result (YResult): Beta -> Stable, score 100.
- Segmented (YSegmented): Beta -> Stable, score 100.
- Slider (YSlider): Beta -> Stable, score 100.
- Splitter (YSplitter): Beta -> Stable, score 100.
- Statistic (YStatistic): Beta -> Stable, score 100.
- Time Picker (YTimePicker): Beta -> Stable, score 100.
- Timeline (YTimeline): Beta -> Stable, score 100.
- Tooltip (YTooltip): Beta -> Stable, score 100.
- Tour (YTour): Beta -> Stable, score 100.
- Transfer (YTransfer): Beta -> Stable, score 100.
- Tree (YTree): Beta -> Stable, score 100.
- Tree Select (YTreeSelect): Beta -> Stable, score 100.
- Upload (YUpload): Beta -> Stable, score 100.
- Virtual List (YVirtualList): Beta -> Stable, score 100.

### @yok-ui/product

- Current version: 0.1.0
- Target version: 0.2.0
- Scope: Product

- Command Palette (YCommandPalette): Beta -> Stable, score 100.

### @yok-ui/admin

- Current version: 0.1.0
- Target version: 0.2.0
- Scope: Admin

- Bulk Action Bar (YBulkActionBar): Beta -> Stable, score 100.
- CRUD Layout (YCrudLayout): Beta -> Stable, score 100.
- Data Table (YDataTable): Beta -> Stable, score 100.
- Data View (YDataView): Beta -> Stable, score 100.
- Field Array (YFieldArray): Beta -> Stable, score 100.
- Filter Tabs (YFilterTabs): Beta -> Stable, score 100.
- Resource Page (YResourcePage): Beta -> Stable, score 100.
- Review Workflow (YReviewWorkflow): Beta -> Stable, score 100.
- Saved Views (YSavedViews): Beta -> Stable, score 100.
- Schema Form (YSchemaForm): Beta -> Stable, score 100.
- Search Form (YSearchForm): Beta -> Stable, score 100.
- Search Panel (YSearchPanel): Beta -> Stable, score 100.
- Status Timeline (YStatusTimeline): Beta -> Stable, score 100.

## Required verification

- [ ] Release plan dry-run
  - Command: `pnpm release:dry-run`
  - Evidence: 先生成包级 release plan、changelog 草稿和发布门禁记录，确认不会改写 package version。
- [ ] TypeScript package contract
  - Command: `pnpm typecheck`
  - Evidence: 所有 workspace package 必须通过 vue-tsc。
- [ ] Unit and docs data tests
  - Command: `pnpm test`
  - Evidence: 组件行为、文档数据、live example 和资源页测试必须全部通过。
- [ ] Package build artifacts
  - Command: `pnpm build`
  - Evidence: 发布前必须生成每个 package 的 dist、CSS 和声明文件。
- [ ] Documentation production build
  - Command: `pnpm docs:build`
  - Evidence: 官网路由、组件页和资源页需要通过 VitePress SSR 构建。
- [ ] Runtime docs accessibility audit
  - Command: `DOCS_A11Y_BASE_URL=http://127.0.0.1:5173 pnpm docs:a11y:runtime`
  - Evidence: 真实浏览器验收导航、页面结构、live example 锚点和响应式溢出。

## Changelog draft

# Yok UI 0.2.0 release candidate

Release gate evidence: API Live / Workflow Live / Source / Edited Source Share / Theme / A11y

## Stable promotions

### @yok-ui/core
- Affix: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Anchor: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Autocomplete: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Calendar: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Carousel: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Cascader: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Color Picker: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Countdown: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Date Picker: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Date Range Picker: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Descriptions: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Drawer: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Dropdown: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Float Button: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Float Button Group: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Form: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Image: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Input Number: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Layout: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- List: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Loading: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Mention: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Menu: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Message Box: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Modal: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Notification: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Popover: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- QRCode: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Rate: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Result: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Segmented: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Slider: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Splitter: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Statistic: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Time Picker: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Timeline: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Tooltip: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Tour: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Transfer: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Tree: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Tree Select: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Upload: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Virtual List: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.

### @yok-ui/product
- Command Palette: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.

### @yok-ui/admin
- Bulk Action Bar: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- CRUD Layout: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Data Table: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Data View: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Field Array: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Filter Tabs: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Resource Page: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Review Workflow: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Saved Views: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Schema Form: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Search Form: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Search Panel: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.
- Status Timeline: promote Beta -> Stable after API / API Live / Workflow Live / Source / Edited Source Share / Theme / Maturity / A11y / Interaction.

## Required verification

- [ ] Release plan dry-run: `pnpm release:dry-run`
- [ ] TypeScript package contract: `pnpm typecheck`
- [ ] Unit and docs data tests: `pnpm test`
- [ ] Package build artifacts: `pnpm build`
- [ ] Documentation production build: `pnpm docs:build`
- [ ] Runtime docs accessibility audit: `DOCS_A11Y_BASE_URL=http://127.0.0.1:5173 pnpm docs:a11y:runtime`