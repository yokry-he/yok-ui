<script setup lang="ts">
const buttonCodeSetup = `import { YButton, YIconButton } from '@yok-ui/core'`

const variantsCode = `<template>
  <YButton variant="primary">发布版本</YButton>
  <YButton variant="secondary">保存草稿</YButton>
  <YButton variant="ghost">稍后处理</YButton>
</template>`

const variantsJsCode = `<template>
  <YButton variant="primary">Publish</YButton>
  <YButton variant="secondary">Save draft</YButton>
  <YButton variant="ghost">Later</YButton>
</template>`

const statesCode = `<template>
  <YButton size="sm">Small</YButton>
  <YButton size="md">Medium</YButton>
  <YButton size="lg">Large</YButton>
</template>`

const loadingDisabledCode = `<template>
  <YButton size="sm">Small</YButton>
  <YButton loading>Loading</YButton>
  <YButton disabled>Disabled</YButton>
</template>`

const nativeBlockCode = `<template>
  <form class="demo-stack">
    <YButton type="submit" variant="primary" block>Submit release</YButton>
    <YButton type="reset" variant="ghost" block>Reset form</YButton>
  </form>
</template>`

const iconButtonCode = `<template>
  <YIconButton label="Copy command">C</YIconButton>
  <YIconButton label="Refresh preview">R</YIconButton>
  <YIconButton label="Open settings" disabled>S</YIconButton>
</template>`
</script>

# Button

按钮用于触发页面中的主要动作。Yok UI 的按钮参考主流组件库的视觉等级和状态模型，同时保留清爽、轻快、不过度装饰的默认气质。

## When to use

<div class="docs-card-grid">
  <section class="docs-card">
    <h3>主要任务</h3>
    <p>提交、保存、创建、确认等页面核心动作使用 <code>primary</code>。</p>
  </section>
  <section class="docs-card">
    <h3>辅助任务</h3>
    <p>取消、导出、预览等次要动作使用 <code>secondary</code>，避免抢主按钮焦点。</p>
  </section>
  <section class="docs-card">
    <h3>轻量操作</h3>
    <p>工具栏、空状态和列表行里的低风险动作使用 <code>ghost</code>。</p>
  </section>
</div>

## Examples

<DocDemo
  title="Variants"
  description="按钮的视觉等级应该和任务优先级一致，一个操作区通常只保留一个 primary。"
  :code="variantsCode"
  :js-code="variantsJsCode"
  :setup="buttonCodeSetup"
  :usage="['primary = 强动作', 'secondary = 默认动作', 'ghost = 轻动作']"
>
  <div class="demo-row">
    <YButton variant="primary">发布版本</YButton>
    <YButton variant="secondary">保存草稿</YButton>
    <YButton variant="ghost">稍后处理</YButton>
  </div>
</DocDemo>

<DocDemo
  id="demo-sizes-and-states"
  title="Sizes"
  description="尺寸覆盖紧凑工具栏、普通表单和强调型操作，保持和 Input、Select 等表单控件同一密度体系。"
  :code="statesCode"
  :setup="buttonCodeSetup"
  :usage="['sm 工具栏', 'md 默认', 'lg 强调动作']"
>
  <div class="demo-row">
    <YButton size="sm">Small</YButton>
    <YButton size="md">Medium</YButton>
    <YButton size="lg">Large</YButton>
  </div>
</DocDemo>

<DocDemo
  title="Loading and disabled"
  description="loading 会禁用点击并暴露 aria-busy；disabled 用于权限不足、条件未满足或不可重复执行的动作。"
  :code="loadingDisabledCode"
  :setup="buttonCodeSetup"
  :usage="['loading 禁用点击', 'aria-busy', 'disabled 权限门禁']"
>
  <div class="demo-row">
    <YButton loading>Loading</YButton>
    <YButton disabled>Disabled</YButton>
  </div>
</DocDemo>

<DocDemo
  title="Native type and block"
  description="表单按钮应显式声明原生 type；block 适合移动端底部动作、登录页和单列表单主按钮。"
  :code="nativeBlockCode"
  :setup="buttonCodeSetup"
  :usage="['type=submit', 'type=reset', 'block full width']"
>
  <form class="demo-stack">
    <YButton type="submit" variant="primary" block>Submit release</YButton>
    <YButton type="reset" variant="ghost" block>Reset form</YButton>
  </form>
</DocDemo>

<DocDemo
  title="Icon buttons"
  description="图标按钮必须提供可访问名称；禁用状态同样保留固定尺寸，避免工具栏布局跳动。"
  :code="iconButtonCode"
  :setup="buttonCodeSetup"
  :usage="['YIconButton', 'aria-label', 'stable square size']"
>
  <div class="demo-row">
    <YIconButton label="Copy command">C</YIconButton>
    <YIconButton label="Refresh preview">R</YIconButton>
    <YIconButton label="Open settings" disabled>S</YIconButton>
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="button"
  title="在线编辑 Button 示例"
  description="直接调整按钮组合、尺寸和视觉等级，预览结果后复制到项目中。"
/>

## API

<ComponentApiSection :names="['YButton', 'YIconButton']" />

## Accessibility

- 默认使用原生 button 语义，支持 Enter / Space 触发。
- `loading` 会禁用交互并通过 `aria-busy` 暴露状态。
- 图标按钮必须提供可访问名称，例如 `aria-label` 或隐藏文本。

<ComponentAccessibilityEvidence name="YButton" />
