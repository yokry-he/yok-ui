# yok-ui 组件库设计蓝图

> 目标：设计一个属于自己的 Vue 3 组件库。它参考主流组件库的成熟经验，但最终服务于个人产品、后台管理和品牌展示三类场景，并形成清爽可爱的自有风格。

## 1. 产品定位

`yok-ui` 是一个 Vue 3 + TypeScript 组件系统，不是单一大包。它由共享底座和三个场景包组成：

- `@yok-ui/core`：基础组件、设计 token、主题能力和可访问性规范。
- `@yok-ui/product`：个人产品、效率工具、桌面工具、轻量 SaaS 页面常用组件。
- `@yok-ui/admin`：后台管理、数据密集型页面、筛选表格和 CRUD 工作流组件。
- `@yok-ui/brand`：个人官网、作品集、产品官网、品牌展示组件。
- `@yok-ui/hooks`：通用 Vue composables。
- `@yok-ui/icons`：图标封装。
- `@yok-ui/themes`：主题预设和 token 输出。

一句话定位：

> 一个清爽可爱、可主题化、可分包引入、适合个人长期复用的 Vue 3 组件库。

## 2. 参考对象与吸收策略

### Element Plus

参考点：Element Plus 明确定位为 Vue 3 组件库，面向设计师和开发者，并将 Guide、Component、Resource 分开组织。`yok-ui` 可以吸收它的完整组件演示、设计指南和资源入口，但不要照搬它偏通用后台的视觉语言。

吸收方式：

- 组件文档必须有清晰 demo、API、slot、event、主题变量。
- 文档站提供设计资源入口，例如 token、Figma 约定、页面模板。
- 基础组件 API 要稳定、直接、适合长期维护。

### Ant Design Vue

参考点：Ant Design Vue 的优势是企业级信息架构、表单/表格/反馈组件体系和设计原则。`yok-ui` 的 `admin` 包应吸收它的严谨性，但视觉上保持更轻、更友好。

吸收方式：

- `@yok-ui/admin` 采用企业级组件分层：筛选、表格、详情、批量操作、状态反馈。
- 复杂组件优先定义数据结构和插槽边界，减少临时拼装。
- 后台组件支持 `compact` 密度，适合高频工作界面。

### PrimeVue

参考点：PrimeVue 强在组件覆盖度、主题模式、区块和模板生态。它强调可定制、丰富组件、styled/unstyled 选择和大量可复制区块。

吸收方式：

- `yok-ui` 文档站不只展示单个组件，也展示可复制的场景区块。
- 为 `brand` 和 `admin` 包提供页面级 blocks，而不是只提供低层按钮和输入框。
- 主题系统从第一天就作为核心能力，而不是后期补丁。

### Naive UI

参考点：Naive UI 在 Vue 3、TypeScript、主题定制和开发体验上很有代表性。`yok-ui` 可以参考它的类型友好、配置式主题和细颗粒度组件 API。

吸收方式：

- 所有组件使用 TypeScript 类型定义 props、emits 和公开类型。
- 主题支持局部覆盖，不要求全局污染。
- 组件默认值清晰，减少使用者心智负担。

### Reka UI / Headless UI

参考点：Reka UI 和 Headless UI 的核心价值是无样式、可访问性、键盘导航、焦点管理和 WAI-ARIA 语义。`yok-ui` 不需要完全无样式，但复杂交互组件应借鉴它们的原语思路。

吸收方式：

- Modal、Drawer、Dropdown、Tooltip、Select、CommandPalette 等交互组件必须重视焦点管理和键盘操作。
- 可以在内部封装 primitive 层，让外部看到的是带 `yok-ui` 风格的成品组件。
- 对复杂组件保留 slot 和 render 扩展点，不把用户锁死在单一 DOM 结构里。

### shadcn/vue

参考点：shadcn/vue 强调“组件是你的起点，而不是黑盒依赖”。它提供可复制、可修改、可扩展的组件和 blocks。

吸收方式：

- `yok-ui` 可以提供两种消费方式：npm 包引入，以及复制组件源码到项目中改造。
- 文档站展示“组件源码结构”和“如何二次改造”。
- 让 `yok-ui` 成为个人项目的设计系统基础，而不是不可触碰的第三方黑盒。

## 3. yok-ui 自己的东西

`yok-ui` 的差异化不应该只是“又一个 Vue 组件库”，而是这几件事：

- 多场景分包：`core / product / admin / brand` 不是按技术拆，而是按使用场景拆。
- 清爽可爱默认主题：轻盈、亲和、干净，但不幼稚。
- 个人效率组件优先：CommandPalette、SettingsPanel、CopyButton、FileDrop、ThemeSwitcher 这类组件要成为特色。
- 文档按场景浏览：用户可以选择“基础组件 / 产品工具 / 后台管理 / 品牌展示”。
- Blocks 优先：组件文档之外，提供实际页面片段，例如后台列表页、设置页、个人主页 hero、项目展示区。
- 可复制可改造：核心包稳定，场景组件允许被复制成项目内组件继续定制。

## 4. 视觉方向

默认主题名：`yok-light`

关键词：

- 清爽：背景接近白色，但带一点暖感或薄荷感。
- 可爱：圆角柔和，状态反馈友好，空状态亲切。
- 轻盈：边框淡、阴影薄、动效短。
- 专业：数据表格、表单、弹窗仍然清晰克制。

建议主题：

- `yok-light`：默认主题，清爽可爱。
- `yok-soft`：更柔和，适合个人主页、作品集、品牌页。
- `yok-clean`：更克制，适合后台管理。
- `yok-dark`：暗色主题，后续阶段补齐。

建议主色：

- Primary：清透蓝绿或薄荷绿。
- Accent：樱桃粉、天空蓝、柠檬黄。
- Neutral：暖白、浅灰、深灰，不使用纯黑。
- Status：柔和但明确的 success、warning、danger、info。

组件形态：

- 按钮：中等圆角，hover 有轻微浮起或色彩变化。
- 输入框：浅边框，focus 使用柔和描边和细微背景变化。
- 卡片：只用于真正的内容容器，避免页面全是卡片。
- 表格：清爽密度，默认舒适，admin 包支持紧凑模式。
- 弹窗：弱遮罩、清晰层级、圆角适中。
- 空状态：图标或轻插画风格，但不要过度装饰。

## 5. 包架构

推荐使用 pnpm workspace：

```txt
yok-ui/
  packages/
    core/
    product/
    admin/
    brand/
    hooks/
    icons/
    themes/
  docs/
  playground/
  examples/
  scripts/
```

每个包保持独立发布能力：

```txt
@yok-ui/core
@yok-ui/product
@yok-ui/admin
@yok-ui/brand
@yok-ui/hooks
@yok-ui/icons
@yok-ui/themes
```

依赖关系：

```txt
themes -> 无依赖
icons -> 无依赖或少量构建依赖
hooks -> Vue
core -> Vue + hooks + themes + icons
product -> core
admin -> core
brand -> core
```

约束：

- `core` 不依赖 `product/admin/brand`。
- 场景包可以依赖 `core`，不能互相依赖。
- 主题变量统一从 `@yok-ui/themes` 生成。
- 所有组件支持 tree-shaking。

## 6. 组件分层

### @yok-ui/core

基础组件：

- Button
- IconButton
- Input
- Textarea
- Select
- Switch
- Checkbox
- Radio
- Tag
- Badge
- Tooltip
- Dropdown
- Modal
- Drawer
- Tabs
- Empty
- Loading
- Divider
- ThemeProvider

布局组件：

- Stack
- Inline
- Grid
- Container
- Panel
- Section

### @yok-ui/product

产品工具组件：

- AppShell
- CommandPalette
- SettingsPanel
- CopyButton
- FileDrop
- CodeBlock
- ShortcutKey
- ThemeSwitcher
- ActionBar
- QuickCreate
- SearchCommand
- NotificationCenter

适用场景：

- 个人工具
- 开发者工具
- 桌面应用
- 小型 SaaS
- 生成器控制台

### @yok-ui/admin

后台组件：

- PageHeader
- DataTable
- SearchForm
- FilterBar
- CrudToolbar
- BatchActions
- Pagination
- StatCard
- MetricGrid
- DetailPanel
- FormSection
- StatusBadge
- AuditTimeline

适用场景：

- 管理后台
- 数据看板
- 用户管理
- 内容管理
- 订单/项目/任务列表

### @yok-ui/brand

品牌展示组件：

- HeroSection
- FeatureGrid
- ShowcaseCard
- PricingSection
- Timeline
- Testimonial
- LogoCloud
- Gallery
- ContactBlock
- ProfileHeader
- ProjectCard
- SocialLinks

适用场景：

- 个人主页
- 作品集
- 产品官网
- 模板站
- 品牌落地页

## 7. 主题 token 设计

Token 分五层：

```txt
primitive tokens   # 原始色值、字号、间距
semantic tokens    # primary、surface、text、border
component tokens   # button.bg、input.border、modal.shadow
state tokens       # hover、active、focus、disabled、error
scene tokens       # admin.compact、brand.hero、product.shell
```

示例：

```ts
export const yokLight = {
  color: {
    primary: '#36c6a3',
    primarySoft: '#e8fbf5',
    accentPink: '#ff8fb3',
    accentBlue: '#7cc7ff',
    accentYellow: '#ffd76d',
    surface: '#fffdfa',
    surfaceMuted: '#f6f8f7',
    text: '#25302d',
    textMuted: '#68736f',
    border: '#dfe8e4',
    danger: '#ef6f7a',
    warning: '#e8a93d',
    success: '#35b985',
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '22px',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
  },
  shadow: {
    soft: '0 8px 24px rgba(37, 48, 45, 0.08)',
    pop: '0 14px 40px rgba(37, 48, 45, 0.12)',
  },
  motion: {
    fast: '120ms ease',
    normal: '180ms ease',
  },
}
```

## 8. 文档站信息架构

文档站用 VitePress。首页不要只是组件列表，而是一个场景入口。

首页结构：

```txt
Yok UI
清爽可爱的 Vue 3 组件系统

[Core 基础组件]
[Product 产品工具]
[Admin 后台管理]
[Brand 品牌展示]
```

导航结构：

```txt
Guide
  Introduction
  Installation
  Quick Start
  Theming
  Accessibility
  Package Strategy

Packages
  Core
  Product
  Admin
  Brand

Components
  All
  Core
  Product
  Admin
  Brand

Blocks
  Product Dashboard
  Admin List Page
  Personal Homepage
  Settings Page

Tokens
  Colors
  Typography
  Radius
  Spacing
  Motion
```

组件页模板：

```txt
Component Name
所属包
适用场景
基础用法
尺寸
状态
可访问性说明
主题变量
Props
Events
Slots
源码结构
相关 Blocks
```

文档站筛选能力：

- 按包筛选：Core / Product / Admin / Brand。
- 按场景筛选：表单、反馈、导航、数据展示、布局、品牌展示。
- 按成熟度筛选：Stable / Beta / Experimental。

## 9. 开发体验

组件规范：

- Vue SFC 使用 `<script setup lang="ts">`。
- props 使用 interface 定义。
- emits 使用类型签名。
- 插槽命名保持简单明确。
- 样式使用 CSS variables，不把颜色写死在组件里。
- 每个组件独立导出，也支持整包安装。

导入方式：

```ts
import { YButton } from '@yok-ui/core'
import { YCommandPalette } from '@yok-ui/product'
import '@yok-ui/themes/yok-light.css'
```

命名规则：

- 组件前缀：`Y`
- CSS class 前缀：`yok-`
- CSS variable 前缀：`--yok-`
- composable 前缀：`useYok`

示例：

```txt
YButton
YInput
YDataTable
YHeroSection
useYokTheme
--yok-color-primary
.yok-button
```

## 10. 可访问性与交互标准

基础要求：

- 所有可点击元素支持键盘操作。
- 所有表单组件有明确 label 或 aria-label。
- Modal、Drawer、Dropdown 需要焦点管理。
- Tooltip 不承载必要信息。
- focus ring 清晰但柔和。
- disabled 状态不能只靠颜色区分。
- 错误信息与输入框有关联。

复杂组件：

- CommandPalette 支持上下键、回车、Esc。
- Modal 打开后焦点进入弹窗，关闭后回到触发按钮。
- Select 和 Dropdown 支持键盘导航。
- DataTable 支持空状态、加载状态、错误状态。

## 11. 一期开发范围

第一阶段建议做 `Design Kernel`，目标是形成完整骨架，而不是一次做完所有组件。

范围：

- monorepo 基础结构
- `@yok-ui/themes`
- `@yok-ui/core`
- `@yok-ui/product`
- docs 文档站
- playground 调试项目

一期组件：

- Core：Button、IconButton、Input、Switch、Tag、Badge、Modal、Tabs、Tooltip、Empty、ThemeProvider。
- Product：CommandPalette、CopyButton、CodeBlock、ThemeSwitcher、SettingsPanel。

一期 Blocks：

- Product Settings Page
- Command Center
- Personal Tool Shell

一期验收标准：

- 可以在 playground 中引入并使用组件。
- docs 可以按 Core/Product 分类浏览。
- 主题 token 可切换 `yok-light` 和 `yok-clean`。
- 每个一期组件有基础 demo、API、状态展示。
- 组件样式来自 CSS variables。
- 构建产物支持按包引入。

## 12. 二期和三期路线

二期：`@yok-ui/admin`

- DataTable
- SearchForm
- FilterBar
- PageHeader
- Pagination
- StatCard
- FormSection
- BatchActions
- Admin List Page block
- Admin Detail Page block

三期：`@yok-ui/brand`

- HeroSection
- FeatureGrid
- ShowcaseCard
- PricingSection
- Timeline
- Gallery
- ProfileHeader
- Personal Homepage block
- Product Landing Page block

四期：生态增强

- 暗色主题
- Figma token 规范
- 组件源码复制 CLI
- 页面模板
- 可视化主题编辑器

## 13. 设计原则

`yok-ui` 后续扩展时遵守这些原则：

1. 先场景，后组件。每个组件都要知道自己解决什么真实页面问题。
2. 先 token，后样式。不要在组件内部随意写死视觉值。
3. 先可访问，后动效。复杂交互先保证键盘和焦点。
4. 先轻量，后完整。不要为了追求大而全牺牲维护性。
5. 先个人特色，后通用覆盖。CommandPalette、SettingsPanel、ThemeSwitcher 这类组件优先做出辨识度。
6. 先文档体验，后生态包装。文档站本身就是组件库的产品体验。

## 14. 推荐下一步

下一步应该进入技术方案和一期实现计划：

1. 确定 monorepo 工具链：pnpm workspace + Vite + tsup/vite library mode。
2. 设计 token 输出格式：CSS variables + TypeScript token object。
3. 定义组件源码模板：组件目录、样式文件、类型文件、测试文件、文档示例。
4. 创建一期组件开发顺序：ThemeProvider -> Button -> Input -> Modal -> Tabs -> CommandPalette。
5. 搭建 docs 和 playground，确保每写一个组件都能立即展示。

## 参考来源

- [Element Plus](https://element-plus.org/en-US/)：Vue 3 组件库、Guide/Component/Resource 文档组织。
- [Ant Design Vue](https://antdv.com/)：企业级 UI 组件体系和后台场景参考。
- [PrimeVue](https://primevue.org/)：主题、组件覆盖、blocks、templates 生态参考。
- [Naive UI](https://www.naiveui.com/en-US/light)：Vue 3、TypeScript、主题定制体验参考。
- [Reka UI](https://reka-ui.com/)：无样式 primitive、可访问性、键盘导航、焦点管理参考。
- [Headless UI for Vue](https://headlessui.com/v1/vue)：无样式可访问组件参考。
- [shadcn/vue](https://www.shadcn-vue.com/)：可复制、可定制、可成为设计系统基础的组件理念参考。
