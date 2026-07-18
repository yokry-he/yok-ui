---
title: Menu
description: 应用主导航、侧边栏和分组菜单，支持水平/垂直、子菜单、折叠和键盘路径。
---

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('menu')
const lastEvent = ref('ready')
const menuItems = [
  { label: 'Guide', value: 'guide', icon: 'G' },
  {
    label: 'Components',
    value: 'components',
    icon: 'C',
    children: [
      { label: 'Button', value: 'button' },
      { label: 'Menu', value: 'menu' }
    ]
  },
  { label: 'Disabled', value: 'disabled', icon: 'D', disabled: true },
  { label: 'Resources', value: 'resources', icon: 'R' }
]
const topItems = [
  { label: 'Guide', value: 'guide' },
  { label: 'Components', value: 'components' },
  { label: 'Resources', value: 'resources' }
]

const menuSetup = [
  "import { ref } from 'vue'",
  "import { YMenu, YTag } from '@yok-ui/core'",
  '',
  "const active = ref('menu')",
  "const lastEvent = ref('ready')",
  'const menuItems = [',
  "  { label: 'Guide', value: 'guide', icon: 'G' },",
  '  {',
  "    label: 'Components',",
  "    value: 'components',",
  "    icon: 'C',",
  '    children: [',
  "      { label: 'Button', value: 'button' },",
  "      { label: 'Menu', value: 'menu' }",
  '    ]',
  '  },',
  "  { label: 'Disabled', value: 'disabled', icon: 'D', disabled: true },",
  "  { label: 'Resources', value: 'resources', icon: 'R' }",
  ']',
  'const topItems = [',
  "  { label: 'Guide', value: 'guide' },",
  "  { label: 'Components', value: 'components' },",
  "  { label: 'Resources', value: 'resources' }",
  ']',
  '',
  'function handleOpen(_: string, keyPath: string[]) {',
  "  lastEvent.value = `open ${keyPath.join(' / ')}`",
  '}',
  '',
  'function handleClose(_: string, keyPath: string[]) {',
  "  lastEvent.value = `close ${keyPath.join(' / ')}`",
  '}'
].join('\n')

const sideNavigationCode = [
  '<div class="demo-stack">',
  '  <YMenu',
  '    v-model="active"',
  '    :items="menuItems"',
  '    :default-open-keys="[\'components\']"',
  '    aria-label="Docs navigation"',
  '    @open="handleOpen"',
  '    @close="handleClose"',
  '  />',
  '  <YTag tone="info">Active: {{ active }} · {{ lastEvent }}</YTag>',
  '</div>'
].join('\n')

const horizontalCode = [
  '<YMenu',
  '  :items="topItems"',
  '  mode="horizontal"',
  '  model-value="components"',
  '  aria-label="Top navigation"',
  '/>'
].join('\n')

const collapsedCode = [
  '<YMenu',
  '  :items="menuItems"',
  '  model-value="components"',
  '  collapsed',
  '  aria-label="Collapsed navigation"',
  '/>'
].join('\n')

function handleOpen(_: string, keyPath: string[]) {
  lastEvent.value = `open ${keyPath.join(' / ')}`
}

function handleClose(_: string, keyPath: string[]) {
  lastEvent.value = `close ${keyPath.join(' / ')}`
}
</script>

# Menu

Menu 用于应用主导航、后台侧边栏、组件目录和资源分组入口。Yok UI 的实现参考 Element Plus Menu 的水平/垂直模式、子菜单、禁用项和展开事件，也参考 Ant Design Menu 的数据驱动 items、选中 key 与展开 key 思路，优先提供可测试、可复制、可接入路由状态的基础版本。

::: tip TIP
`YMenu` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Side navigation {#menu-side-navigation}

<DocDemo
  id="demo-side-navigation"
  title="Side navigation"
  description="垂直菜单适合文档侧栏和后台导航，选中项、展开项和事件都应与真实路由状态同步。"
  :code="sideNavigationCode"
  :setup="menuSetup"
  :usage="['v-model active key', 'defaultOpenKeys', 'open / close events']"
>
  <div class="demo-stack">
    <YMenu
      v-model="active"
      :items="menuItems"
      :default-open-keys="['components']"
      aria-label="Docs navigation"
      @open="handleOpen"
      @close="handleClose"
    />
    <YTag tone="info">Active: {{ active }} · {{ lastEvent }}</YTag>
  </div>
</DocDemo>

## Horizontal navigation {#menu-horizontal-navigation}

<DocDemo
  id="demo-horizontal-menu"
  title="Horizontal navigation"
  description="水平菜单用于顶部导航。窄屏时应由外层布局切换为抽屉、弹层或紧凑菜单，而不是堆叠整块侧栏。"
  :code="horizontalCode"
  :setup="menuSetup"
  :usage="['mode=horizontal', 'aria-label', 'route key']"
>
  <YMenu
    :items="topItems"
    mode="horizontal"
    model-value="components"
    aria-label="Top navigation"
  />
</DocDemo>

## Collapsed navigation {#menu-collapsed-navigation}

<DocDemo
  id="demo-collapsed-menu"
  title="Collapsed navigation"
  description="折叠菜单保留 icon 和 title 提示，适合后台侧栏收起态；没有 icon 的项不建议直接折叠。"
  :code="collapsedCode"
  :setup="menuSetup"
  :usage="['collapsed', 'icon required', 'stable sidebar width']"
>
  <YMenu
    :items="menuItems"
    model-value="components"
    collapsed
    aria-label="Collapsed navigation"
  />
</DocDemo>

## Usage Notes {#menu-usage-notes}

- `modelValue` 应与真实路由或页面状态同步；点击叶子项后再由业务侧决定是否跳转。
- `defaultOpenKeys` 只控制初始展开，适合从当前路由推导默认展开分组。
- `open` / `close` 适合记录菜单展开轨迹，`open-change` 适合直接同步完整展开集合。
- `collapsed` 模式要求菜单项提供 `icon`，否则只会保留文本的 `title` 提示。
- 移动端不要直接把完整桌面侧边栏堆叠到首屏内容上方，应放入抽屉、弹层或紧凑顶部菜单。

## Menu API {#menu-api}

<ComponentApiSection name="YMenu" />

## Accessibility {#accessibility}

- 根节点使用 `role="navigation"` 和 `ariaLabel` 标明导航区域。
- 菜单项使用原生 `button`，禁用项使用原生 `disabled`。
- 当前叶子项使用 `aria-current="page"`；子菜单使用 `aria-expanded`。
- 方向键移动焦点，Enter 或 Space 选择叶子项或展开子菜单。
