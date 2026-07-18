# Component API Conventions

Yok UI 的组件 API 文档采用统一结构，目标是让每个组件页面都能像主流组件库一样稳定、可搜索、可维护。

## Documentation shape

每个组件页面建议保持同一套顺序：

1. 简短说明：组件解决什么问题，适合什么场景。
2. Examples：覆盖基础用法、常见状态、组合方式。
3. Static demos：使用 Element Plus 风格示例块，提供真实预览、TS / JS 切换、复制代码和展开源码。
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

组件页底部的 route context 由 `.vitepress/data/componentRouteContext.ts` 汇总，它会把 registry、API 数据、DocDemo evidence、interaction contract 和源码页链接合并成同一份页面证据。这样单个组件页不仅能显示前后路由和相关组件，还能展示质量分、API/A11y/Theme/Keyboard 状态，以及复杂组件的真实 workflow 说明。组件页不再以内嵌 playground 或 LiveExampleRunner 作为默认标准；可编辑运行器应作为独立 sandbox 能力重新设计，避免把复杂编辑器状态塞进每一个组件文档页面。

## Demo coverage

静态示例统一使用 `.vitepress/components/DocDemo.vue`。`DocDemo` 的展示逻辑参考 Element Plus：上方展示真实组件预览，关闭源码时在预览下方提供 TS / JS 切换、复制代码和展开源码；展开源码后，同一组工具条必须进入源码容器顶部并右对齐，成为源码区域的一部分，避免工具条和源码割裂。源码容器需要标记 `data-source-panel="element-plus"`，工具条使用 `data-source-placement="code-top-right"`，底部整行收起条使用 `data-source-placement="bottom-collapse"`，这样后续视觉迭代和浏览器验证可以直接检查结构契约。每个示例 section 必须拥有稳定 `id` 和标题 permalink；默认由标题生成 `demo-<slug>`，需要和 API 行、场景链接或外部文档长期绑定时应显式传入 `id`，避免标题调整导致深链接失效。每个工具按钮都要保留 `data-demo-action` / `data-demo-language` 契约，方便测试和后续视觉迭代验证真实交互，而不是依赖图标顺序猜测行为；视觉上使用紧凑 glyph，语义上使用 `aria-label`、`title`、`data-tooltip` 和隐藏文本保留完整动作名称。复制成功状态必须扩展当前复制按钮自身的稳定宽度，不得把“已复制”挤进普通图标按钮尺寸里。源码区必须拥有稳定 `id="<demo-id>-source-panel"`、`tabindex="-1"`、行号和轻量语法高亮；展开源码按钮和底部收起按钮必须通过 `aria-controls="<demo-id>-source-panel"` 关联源码区，展开后滚动并聚焦源码区，收起后把焦点还给 `data-demo-action="toggle-source"`。`DocDemo` 和 `/source/` 源码页必须复用 `.vitepress/utils/codeHighlight.ts`，避免静态示例和真实组件源码的代码阅读体验漂移；复制和测试断言仍以原始 SFC 字符串为准，不能把行号或展示 token 写入复制内容。Markdown 页面可以直接传完整 `.vue` 源码；如果只传模板片段，应同时传 `setup` / `jsSetup`，由 `DocDemo` 组装成 `<script setup lang="ts">`、`<script setup>` 和 `<template>` 三种可复制源码视图。

旧式 `<div class="demo-box">` 只能作为迁移前的临时遗留，不再作为新增组件文档的合格示例格式。`.vitepress/data/docDemoSourceQuality.ts` 会把没有 DocDemo 的组件页标记为 `needs-doc-demo`，把已迁移 DocDemo 但缺少 `setup` 或完整 SFC 的组件页标记为 `needs-handoff`，并在成熟度看板中显示 raw demo-box 队列。新增组件页或补示例时，应先把基础示例迁移到 DocDemo，再补 code、setup、source 和稳定 id；不要继续增加裸 demo-box，因为它无法提供 Element Plus 风格的源码展开和复制代码入口。

API 表格里的 coverage badge 按证据强度跳转：`Example` 指向当前组件页中维护过的 DocDemo 静态示例锚点，适合展示基础 API 在真实源码中的写法；`Source` 指向受控源码页；`Contract` 指向键盘、ARIA、主题或测试证据。新增 `Example` badge 时必须先在 `apiLiveCoverage.ts` 的 DocDemo coverage hints 中登记目标 API，再确认对应 Markdown 的 DocDemo 源码真实包含该 prop、event、slot 或类型名称，避免因为普通文案命中导致 API 行跳到不相关示例。DocDemo coverage 会读取 `const code = \`...\`` 和 `const code = [...].join('\n')` 两类源码绑定；若 API 已有交互契约、事件日志、slot source 或类型 map 等更强证据，API 表格应继续展示更强 badge，不要为了增加 `Example` 数量降低证据质量。

## Optional sandbox boundary

未来如果重新开发可编辑 sandbox，它必须是独立路由或独立应用，不再嵌入每个组件文档。sandbox 应承担在线编辑、依赖版本、状态分享、主题切换和复现包；组件文档只负责像 Element Plus 一样展示稳定示例、源码展开、复制代码、API 和 Accessibility。这样可以避免组件页性能、滚动体验和示例维护成本被运行器拖累。

## Quality contract

组件质量数据由 `.vitepress/data/componentQuality.ts` 自动汇总，包括结构化 API、DocDemo 示例、可访问性、主题 token 和键盘交互状态。新增组件时，只要同步维护 `components`、`componentApis`、DocDemo 示例源码、必要的 API coverage hints 和高风险组件的 `interactionContracts`，成熟度看板、组件总览和 API Reference 就会使用同一套证据，避免页面状态和真实数据脱节。

组件 Markdown 页面还会经过 `.vitepress/data/componentDocs.test.ts` 的完整性门禁。每个 `/components/*` 页面都必须同时具备 `<DocDemo>`、`## API`、结构化 API 渲染（`<ComponentApiSection>`）和 `## Accessibility`。这条测试用于防止文档回退到只有说明文字或手写表格的状态，也让新增组件时的最低文档标准更接近主流组件库。

包入口导出也有独立门禁。`packages/package-exports.test.ts` 会枚举 `packages/*/src/components/*/index.ts`，确保每个组件目录都被对应 package 的 `src/index.ts` 导出；同时会读取 docs registry，确认登记在文档里的组件名称可以从 `@yok-ui/core`、`@yok-ui/product`、`@yok-ui/admin` 或 `@yok-ui/brand` 根入口直接导入。`packages/package-install.test.ts` 会验证每个分包都提供默认 Vue 插件和命名插件导出，并且可以通过 `app.use(...)` 注册组件。`packages/package-manifest.test.ts` 会检查 package metadata、README、`files` 白名单、根入口、样式入口和文档里出现的 CSS import 是否都能被 package exports 支撑。新增组件时应遵循固定顺序：先创建组件目录和目录级 `index.ts`，再更新 package 根入口和 package plugin 的组件数组，最后登记 `componentRegistry` 和组件文档。这样官网、API Reference、包发布产物、全量注册、样式入口和用户 import 路径会始终保持一致。

发布级样式入口统一使用 `@yok-ui/<package>/style.css`。Core 的 `@yok-ui/core/style.css` 来自构建后的 `dist/index.css`，包含 Core 组件样式、base 工具和 SFC scoped 样式；`@yok-ui/core/styles/base.css` 只保留给高级场景，用于单独加载 focus ring、屏幕阅读器工具类和基础交互动效。Product、Admin、Brand 包也各自导出 `style.css`，文档示例必须随着使用的分包同步导入对应样式。

自动导入能力由 `@yok-ui/resolver` 提供。Resolver 的组件映射必须覆盖 docs registry 中每一个组件，并且只解析真实组件名，不解析 API 类型名，例如 `YTableColumn` 或 `YFormRule`。`packages/resolver/src/resolver.test.ts` 会把 resolver map 和 `componentRegistry` 做全量比对，新增组件时如果没有同步 resolver，会直接失败。

## Docs performance

文档站主题入口 `.vitepress/theme/index.ts` 只同步注册轻量基础渲染组件，例如 `ComponentApiSection` 和 `DocDemo`。`ApiTable` 只作为 `ComponentApiSection` 的内部实现，不再暴露为 Markdown 全局组件。页面级组件，例如 `ThemeLab`、`VerificationDashboard`、`ComponentCatalog`、`ApiReferenceExplorer` 和 `PackageComponents`，必须通过 `defineAsyncComponent` 异步注册。这样普通指南页、组件说明页和包页不会因为成熟度看板或大型交互工具而加载过大的主题主包；如果 `pnpm docs:build` 再次出现 chunk size 警告，应优先检查是否有新的重型文档组件被同步 import 到主题入口。

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
