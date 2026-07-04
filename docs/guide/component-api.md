# Component API Conventions

Yok UI 的组件 API 文档采用统一结构，目标是让每个组件页面都能像主流组件库一样稳定、可搜索、可维护。

## Documentation shape

每个组件页面建议保持同一套顺序：

1. 简短说明：组件解决什么问题，适合什么场景。
2. Examples：覆盖基础用法、常见状态、组合方式。
3. Live example：提供可编辑、可运行、可复制、可展开源码的安全示例。
4. API：Props、Events、Slots、Types 分区展示，使用结构化数据和统一表格组件。
5. Design notes：记录视觉、交互和可访问性细节。

## API table fields

<div class="docs-table-wrap">

| Field | Used by | Description |
| --- | --- | --- |
| `name` | Props / Slots / Events / Types | API 名称，保持和源码导出或 prop 名一致。 |
| `type` | All | TypeScript 类型，联合类型用单引号。 |
| `defaultValue` | Props | 默认值，没有默认值时显示 `-`。 |
| `required` | Props | 必填项显示 `required` 标记。 |
| `description` | All | 用一句话说明用途，不重复字段名。 |

</div>

## Registry first

组件基础信息统一维护在 `.vitepress/data/componentRegistry.ts`：

```ts
export const components = [
  {
    name: 'YButton',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/button',
    accessibility: 'native'
  }
]
```

这份 registry 会驱动：

- Components 总览页
- Package 组件表
- 组件数量和 stable / beta 统计
- 可访问性状态展示
- 后续组件搜索、版本标记和发布清单

组件页底部的 route context 由 `.vitepress/data/componentRouteContext.ts` 汇总，它会把 registry、API 数据、Live example profile、workflow scenarios 和 interaction contract 合并成同一份页面证据。这样单个组件页不仅能显示前后路由和相关组件，还能直接展示质量分、API/Live/A11y/Theme/Keyboard 状态，以及复杂组件的可切换 workflow 场景。Workflow scenario 链接使用 `#live-example?scenario=<scenario-key>` 形式生成可分享 hash，同时派发 `yok-ui:live-example-scenario` 页面事件，由 `.vitepress/components/LiveExampleRunner.vue` 按 preset 和 scenario key 接收并同步切换 props panel、源码和预览；runner 内部点击 Scenario matrix 也会同步更新 hash，并提供“复制场景链接”操作。Props panel 的状态分享使用 `#live-example?scenario=<scenario-key>&state=<json>` 形式，仅恢复当前 preset 已登记的控件 key，并按控件类型校验后同步源码和预览，避免在每个 Markdown 页面里手写重复交互。Live example 的主题预设由同一个 runner toolbar 控制，使用 `YThemeProvider` 包裹预览区；当用户切换到非默认主题时，状态链接和场景链接会追加 `theme=<theme-name>`，复制的运行报告也会记录当前主题。预览宽度同样属于可复现环境：当用户切换到平板或手机预览时，状态链接和场景链接会追加 `viewport=tablet|mobile`，刷新后恢复同一份源码、主题与响应式预览宽度。

## Live example coverage

可编辑示例由 `.vitepress/components/LiveExampleRunner.vue` 和 `.vitepress/data/liveExamples.ts` 共同驱动。它现在包含安全模板编辑、预览 viewport、源码复制、可视化 props 面板、事件日志、本地草稿、示例能力账本和 live acceptance 验收面板。新增组件文档时应同步完成五件事：

1. 在 `LiveExamplePreset` 中新增 preset 名称，并在 `liveExampleCoverage` 里登记文档路由。
2. 在 `LiveExampleRunner.vue` 中加入组件白名单、默认示例源码和必要的默认数据。
3. 如果组件属于高频控件、复杂表单、弹层导航、数据展示、上传或后台工作流组件，在 `liveExampleRecipes` 中登记属性面板，并同步把 preset 放入 `visualControlPresets`，让读者可以不用改源码就调试核心 props。
4. 如果组件需要 workflow 级示例，在 `scenarioRichPresets` 和 `liveExampleScenarios` 中登记场景，并确认 `getLiveExampleValidationSummary` 能在 live acceptance 面板中显示场景切换、工作流状态、响应式、异常/空态和键盘路径的通过或缺口。
5. 在组件 Markdown 页的 API 前加入 `<LiveExampleRunner preset="..." />`。
6. 如果组件适合进入 `/playground/` 做跨文档调试，同步维护 `playgroundExamples.ts` 的共享映射、`PlaygroundWorkbench.vue` 的预览分支、SFC 生成逻辑、TS/JS/安装命令视图和 `LiveExampleRunner.vue` 的 Playground 深链。当前 Button、Input、Input Number、Select、Slider、Rate、Checkbox、Radio Group、Switch、Date Picker、Date Range Picker、Time Picker、Cascader、Color Picker、Table、List、Statistic、Descriptions、Tabs、Steps、Collapse、Avatar、Tag、Progress 和 Alert 都支持从 live example 通过 `component` 与短 `handoff` 查询参数进入 Playground；源码、场景、主题、viewport 和 controls 存入本地 handoff payload，只有 storage 不可用时才回退到 `source` 查询参数，后续新增组件不能只补静态示例。

静态示例统一使用 `.vitepress/components/DocDemo.vue`。`DocDemo` 的展示逻辑参考 Element Plus：上方展示真实组件预览，关闭源码时在预览下方提供 TS / JS 切换、在 Playground 中编辑、查看源文件、复制代码和展开源码；展开源码后，同一组工具条必须进入源码容器顶部并右对齐，成为源码区域的一部分，避免工具条和源码割裂。源码容器需要标记 `data-source-panel="element-plus"`，工具条使用 `data-source-placement="code-top-right"`，底部整行收起条使用 `data-source-placement="bottom-collapse"`，这样后续视觉迭代和浏览器验证可以直接检查结构契约。每个示例 section 必须拥有稳定 `id` 和标题 permalink；默认由标题生成 `demo-<slug>`，需要和 API 行、场景链接或外部文档长期绑定时应显式传入 `id`，避免标题调整导致深链接失效。每个工具按钮都要保留 `data-demo-action` / `data-demo-language` 契约，方便测试和后续视觉迭代验证真实交互，而不是依赖图标顺序猜测行为；视觉上使用紧凑 glyph，语义上使用 `aria-label`、`title`、`data-tooltip` 和隐藏文本保留完整动作名称。复制成功状态必须扩展当前复制按钮自身的稳定宽度，不得把“已复制”挤进普通图标按钮尺寸里；Playground 动作图标使用实验/烧杯语义，保持和“在 Playground 中编辑”的操作心智一致。源码区必须拥有稳定 `id="<demo-id>-source-panel"`、`tabindex="-1"`、行号和轻量语法高亮；展开源码按钮和底部收起按钮必须通过 `aria-controls="<demo-id>-source-panel"` 关联源码区，展开后滚动并聚焦源码区，收起后把焦点还给 `data-demo-action="toggle-source"`。`DocDemo`、`LiveExampleSourcePanel` 和 `/source/` 源码页必须复用 `.vitepress/utils/codeHighlight.ts`，避免静态示例、live example 和真实组件源码的代码阅读体验漂移；复制、Playground 跳转和测试断言仍以原始 SFC 字符串为准，不能把行号或展示 token 写入复制内容。Markdown 页面可以直接传完整 `.vue` 源码；如果只传模板片段，应同时传 `setup` / `jsSetup`，由 `DocDemo` 组装成 `<script setup lang="ts">`、`<script setup>` 和 `<template>` 三种可复制、可跳转的源码视图。工具栏里的 Playground 链接必须使用真实 `/playground/?component=<name>&handoff=<key>` 路由，并在点击时写入完整 SFC handoff payload；只有本地存储不可用时才允许回退到 `source` 查询参数，不允许退回页内锚点或只复制片段。

旧式 `<div class="demo-box">` 只能作为迁移前的临时遗留，不再作为新增组件文档的合格示例格式。`.vitepress/data/docDemoSourceQuality.ts` 会把没有 DocDemo 的组件页标记为 `needs-doc-demo`，把已迁移 DocDemo 但缺少 `setup` 或完整 SFC 的组件页标记为 `needs-handoff`，并在成熟度看板中显示 raw demo-box 队列。新增组件页或补示例时，应先把基础示例迁移到 DocDemo，再补 code、setup、source 和稳定 id；不要继续增加裸 demo-box，因为它无法提供 Element Plus 风格的源码展开、复制代码和 Playground 编辑入口。

Live example 顶部工具条必须直接提供 `data-live-toolbar-action="playground"`、`data-live-toolbar-action="source-file"` 和 `data-live-toolbar-action="copy-playground-link"`，让读者不展开源码也能进入 Playground、打开真实组件源码或复制可分享编辑入口；顶部动作顺序必须保持 TS / JS、Playground、查看组件源码、复制代码、复制导入链接、查看源码，贴近 Element Plus 示例工具条的信息流。点击顶部“查看源码”后必须在源码面板渲染完成后滚动并聚焦到 `#live-example-source-panel`，源码面板需要保留 `tabindex="-1"`，让键盘和屏幕阅读器用户也能立即感知展开结果；顶部 `data-live-toolbar-action="toggle-source"`、源码面板右上角 `data-live-source-action="hide-source"` 和底部“隐藏源代码”按钮都必须通过 `aria-controls="live-example-source-panel"` 明确关联受控区域。从源码面板点击“隐藏源代码”后必须收起面板并把焦点还给顶部 `data-live-toolbar-action="toggle-source"` 按钮，形成可连续操作的焦点闭环。Playground 与复制导入链接必须和源码面板里的对应动作共用同一个 handoff payload、语言、主题、场景和 `docsHash`，并额外携带 `sourcePanel.mode`、`sourcePanel.label`、`sourcePanel.language` 和 `sourcePanel.installPackageManager`，让从 Repro bundle、Install、Diff 或 SFC 视图发起的导入在 Playground 里仍可追溯来源；`source-file` 必须和源码面板共用同一个 `/source/?file=packages/<package>/src/components/<component-dir>/<Component>.vue` 受控源码页。Live example 展开源码后的工具栏也必须进入源码代码容器内部并定位到右上角，按 TS / JS、Playground、查看组件源码、复制源码、复制导入链接、隐藏源码的固定顺序展示；操作区使用紧凑图标按钮，但每个按钮必须保留 `aria-label`、`title` 和 `data-tooltip`，避免为了视觉接近主流官网而牺牲键盘和屏幕阅读器语义。其中“查看组件源码”链接到 `/source/?file=packages/<package>/src/components/<component-dir>/<Component>.vue`，并由 `SourceFileReference` 通过受控源码清单展示真实 `.vue` 文件；源码页还必须根据组件文件名回连 registry 中的组件文档，并提供复制当前源码按钮，让“文档示例、Playground 编辑、真实源码查看”形成闭环。

运行器只解析安全的展示模板，不执行编辑器里的脚本、事件处理器或插值表达式。需要数组型数据的组件应由 runner 注入默认数据，保持示例可预览、可编辑、可复制、可展开源码、可查看事件、可恢复草稿、可复制状态链接、可复制 Repro bundle、可切换主题；复杂组件还应覆盖禁用、密度、分页、可清空、折叠、多选、弹层打开关闭、菜单对齐、树节点 keys、穿梭框目标值等真实使用状态，避免让文档读者先写复杂 setup 代码。高频表单和导航组件，例如 Input Number、Radio Group、Switch、Tabs、Steps、Collapse，也必须提供 guided 属性面板，读者应能先通过控件理解 API，再决定是否展开源码。当前登记在 `liveExampleCoverage` 的组件页在线示例都应保持 guided 模式；复杂组件还要逐步登记到 `scenarioRichPresets` 和 `liveExampleScenarios`，用可统计、可点击、可分享的场景矩阵覆盖基础态、受控回填、异常态、空态、加载态、批量操作、键盘路径和响应式状态。每个 `LiveExampleScenario` 应绑定 `controlValue`，让 runner 内的 Scenario matrix 按钮、组件页 route context 的场景入口、浏览器刷新、`hashchange`、“复制场景链接”和“复制状态链接”都可以通过 `#live-example` 深链接同步 props panel、源码、预览、非默认主题和非默认 preview viewport。Live acceptance 面板会把 `safe-template`、`editable-source`、`responsive-preview`、`source-copy`、`repro-bundle`、`event-log`、`visual-props`、`scenario-switching`、`workflow-states`、`responsive`、`error-state` 和 `keyboard-path` 汇总成可见验收项；Source quality 看板还会单独统计 `playground-edit-share`，确保用户从文档进入 Playground 后编辑源码，再复制分享链接时不会继续指向旧 handoff payload。未覆盖的项应作为后续补齐队列，而不是藏在示例正文里。若未来新增 source-first 兜底示例，必须在成熟度看板里显式暴露为待补深度。

API 表格里的 coverage badge 按证据强度跳转：`Scenario` 指向可切换的 Live Example workflow 场景并派发 `yok-ui:live-example-scenario`；`Example` 指向当前组件页中维护过的 DocDemo 静态示例锚点，适合展示基础 API 在真实源码中的写法；`Live prop` 指向可视化属性面板或 API map。新增 `Example` badge 时必须先在 `apiLiveCoverage.ts` 的 DocDemo coverage hints 中登记目标 API，再确认对应 Markdown 的 DocDemo 源码真实包含该 prop、event、slot 或类型名称，避免因为普通文案命中导致 API 行跳到不相关示例。DocDemo coverage 会读取 `const code = \`...\`` 和 `const code = [...].join('\n')` 两类源码绑定；若 API 已有 workflow scenario、事件日志、slot source 或类型 map 等更强证据，API 表格应继续展示更强 badge，不要为了增加 `Example` 数量降低证据质量。

Playground 接收组件页导入源码后应优先展示可编辑源码 textarea，而不是只展示内部生成片段。代码区工具条必须参考 Element Plus 的示例操作：TS / JS / Install 作为语言段控件，编辑、查看源码、查看真实组件源码、复制 Playground 链接和复制代码使用紧凑图标按钮，并通过 `data-playground-code-action`、`data-icon`、`aria-label`、`title` 和 `data-tooltip` 保留完整语义；其中真实组件源码入口使用 `data-playground-code-action="source-file"`，链接到 `/source/?file=<component source path>`。导入源码切到源码视图后，`PlaygroundWorkbench` 必须切换为浅色源码阅读面板：`.playground-workbench__code` 标记 `data-source-display="source"`，工具条固定为 `data-source-placement="code-top-right"`，源码 `<pre>` 使用 `.playground-workbench__source-view[data-source-panel="element-plus"]`，底部提供整行 `.playground-workbench__source-footer[data-source-placement="bottom-collapse"]` 和 `data-playground-code-action="return-edit"` 返回编辑，不允许把“编辑 / 查看源码 / 复制代码”拆到互不关联的卡片里。Playground 桌面端可以保留组件选择 rail，但移动端不得把完整桌面侧栏直接堆到工作台首屏；窄屏必须使用 `.playground-workbench__mobile-picker` 这类折叠式紧凑选择器承载组件切换，并隐藏桌面 rail，让当前组件参数、预览和代码区优先出现。Live Example 展开源码后，源码面板必须保持“浅色代码块 + 右上角工具条 + 底部收起条”的示例阅读形态，外层 `#live-example-source-panel` 和 `.live-example-runner__source-code-shell` 都必须标记 `data-source-panel="element-plus"`，不再渲染独立的 Source header、Playground handoff 摘要或说明卡片；完整 SFC、Template、Diff、Install、Repro bundle 等视图切换放在代码块左上角的紧凑模式栏。TS / JS、Playground、查看源码、复制源码、复制导入链接和隐藏源码必须进入代码容器右上角，同时保留一整条底部 `bottom-collapse` 收起栏，文案使用“隐藏源代码”，不要回退成普通小按钮。复制代码、复制链接和导入清单都必须基于用户当前编辑后的源码；“恢复导入源码”用于回到文档页传入的原始 SFC，“恢复工作台生成”用于退出 source-first 模式并回到参数驱动的内置示例。从 DocDemo 打开 Playground 时，handoff payload 和 fallback query 都必须携带 `docsHash`，让导入区的文档链接能回到 `/components/<name>#demo-...` 的具体示例，而不是只回到组件页顶部。从 Live example 打开 Playground 时，导入区必须显示来源、当前语言、源码面板来源、场景和返回文档的链接；若已选中 workflow scenario，handoff payload、fallback query 和分享链接都必须保留 `docsHash=#live-example?scenario=<key>`，让读者从 Playground 回到同一个 live scenario，而不是只回到普通 `#live-example`。分享链接也必须保留 `from=live-example`、`language=ts|js` 与场景参数；导入清单还必须显示 `Source panel`，例如 `Repro bundle`、`Install` 或 `完整 SFC`，便于团队复现用户从哪一种源码视图进入 Playground。这样组件文档的“查看源代码、复制代码、在 Playground 中编辑”三条路径会共享同一份源码，不会出现文档示例和 Playground 示例不一致。

Playground 导入源码的 TS / JS 切换必须作用于可编辑 textarea、源码阅读视图和复制结果，而不是只切换按钮高亮。JS 示例切到 TS 时需要把 `<script setup>` 规范化为 `<script setup lang="ts">`；TS 示例切到 JS 时需要移除 `lang="ts"`，确保用户复制、编辑和分享的源码与当前语言段控件一致。源码阅读面板必须拥有稳定 `id="playground-workbench-source-panel"` 和 `tabindex="-1"`；“查看源代码”和底部“返回编辑”操作都必须通过 `aria-controls` 关联该面板。点击“查看源代码”后聚焦源码面板，点击底部返回后聚焦顶部“查看源代码”按钮，保证键盘用户可以连续完成编辑、查看源码、返回编辑的操作链路。紧凑 `handoff` 链接只适用于未编辑的导入源码；一旦用户修改了 Playground textarea，复制分享链接必须改为携带当前源码、来源、语言、场景和文档 hash 的普通 `/playground/?source=...` 路由，不能继续指向旧 handoff payload。若 URL 携带 handoff 但本地 payload 已不存在，Playground 必须显示失效提示、保留 component/from/language/docsHash 元数据和返回文档锚点，不能静默退回内部生成示例。

## Quality contract

组件质量数据由 `.vitepress/data/componentQuality.ts` 自动汇总，包括结构化 API、Live example、可访问性、主题 token 和键盘交互状态。新增组件时，只要同步维护 `components`、`componentApis`、`liveExampleCoverage`、必要的 `scenarioRichPresets` / `liveExampleScenarios` 和高风险组件的 `interactionContracts`，成熟度看板、组件总览和 API Reference 就会使用同一套证据，避免页面状态和真实数据脱节。

组件 Markdown 页面还会经过 `.vitepress/data/componentDocs.test.ts` 的完整性门禁。每个 `/components/*` 页面都必须同时具备 `<LiveExampleRunner>`、`## API`、结构化 API 渲染（`<ComponentApiSection>`）和 `## Accessibility`。这条测试用于防止文档回退到只有静态示例或手写表格的状态，也让新增组件时的最低文档标准更接近主流组件库。

包入口导出也有独立门禁。`packages/package-exports.test.ts` 会枚举 `packages/*/src/components/*/index.ts`，确保每个组件目录都被对应 package 的 `src/index.ts` 导出；同时会读取 docs registry，确认登记在文档里的组件名称可以从 `@yok-ui/core`、`@yok-ui/product`、`@yok-ui/admin` 或 `@yok-ui/brand` 根入口直接导入。`packages/package-install.test.ts` 会验证每个分包都提供默认 Vue 插件和命名插件导出，并且可以通过 `app.use(...)` 注册组件。`packages/package-manifest.test.ts` 会检查 package metadata、README、`files` 白名单、根入口、样式入口和文档里出现的 CSS import 是否都能被 package exports 支撑。新增组件时应遵循固定顺序：先创建组件目录和目录级 `index.ts`，再更新 package 根入口和 package plugin 的组件数组，最后登记 `componentRegistry` 和组件文档。这样官网、API Reference、包发布产物、全量注册、样式入口和用户 import 路径会始终保持一致。

发布级样式入口统一使用 `@yok-ui/<package>/style.css`。Core 的 `@yok-ui/core/style.css` 来自构建后的 `dist/index.css`，包含 Core 组件样式、base 工具和 SFC scoped 样式；`@yok-ui/core/styles/base.css` 只保留给高级场景，用于单独加载 focus ring、屏幕阅读器工具类和基础交互动效。Product、Admin、Brand 包也各自导出 `style.css`，文档示例必须随着使用的分包同步导入对应样式。

自动导入能力由 `@yok-ui/resolver` 提供。Resolver 的组件映射必须覆盖 docs registry 中每一个组件，并且只解析真实组件名，不解析 API 类型名，例如 `YTableColumn` 或 `YFormRule`。`packages/resolver/src/resolver.test.ts` 会把 resolver map 和 `componentRegistry` 做全量比对，新增组件时如果没有同步 resolver，会直接失败。

## Docs performance

文档站主题入口 `.vitepress/theme/index.ts` 只同步注册轻量基础渲染组件，例如 `ComponentApiSection` 和 `DocDemo`。`ApiTable` 只作为 `ComponentApiSection` 的内部实现，不再暴露为 Markdown 全局组件。页面级或重交互组件，例如 `LiveExampleRunner`、`PlaygroundWorkbench`、`ThemeLab`、`MaturityDashboard`、`ComponentCatalog`、`ApiReferenceExplorer` 和 `PackageComponents`，必须通过 `defineAsyncComponent` 异步注册。这样普通指南页、组件说明页和包页不会因为 playground、在线运行器或成熟度看板而加载过大的主题主包；如果 `pnpm docs:build` 再次出现 chunk size 警告，应优先检查是否有新的重型文档组件被同步 import 到主题入口。

## API data

组件 API 已统一登记在结构化数据中。新增或修改组件 API 时，应先更新 `componentApis`，再让组件页、API Reference 和成熟度看板复用同一份数据：

```ts
export const componentApis = {
  YButton: {
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost'",
        defaultValue: "'secondary'",
        description: '按钮视觉等级。'
      }
    ]
  }
}
```

页面里用统一组件渲染。`ComponentApiSection` 会按组件名称自动读取结构化 API，并提供分区标题、行数、搜索过滤、空状态和 required 标记；组件页不要再手写 API Markdown 表，避免 registry、总览页和单页文档数据不一致。

```md
<ComponentApiSection name="YButton" />
```

多组件页面使用 `names` 一次渲染多个 API 分组：

```md
<ComponentApiSection :names="['YButton', 'YIconButton']" />
```

## Status rules

<div class="docs-table-wrap">

| Status | Meaning |
| --- | --- |
| Stable | API 命名、主题 token、基础可访问性约定已经稳定。 |
| Beta | 可以使用，但键盘交互、边界场景或 API 命名仍可能调整。 |
| Planned | 已进入路线图，但还没有可用实现。 |

</div>

## Accessibility status

<div class="docs-table-wrap">

| Status | Meaning |
| --- | --- |
| native | 主要依赖原生语义，组件只做样式增强。 |
| documented | 已在文档或测试中记录语义、焦点或状态约定。 |
| needs-review | 可用但还需要更完整的键盘、焦点或屏幕阅读器审查。 |

</div>
