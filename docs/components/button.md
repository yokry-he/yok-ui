<script setup lang="ts">
import {
  YCheckIcon,
  YCopyIcon,
  YDownloadIcon,
  YLoadingIcon,
  YSearchIcon,
  YUploadIcon
} from '@yok-ui/icons'

const buttonCodeSetup = `import { YButton, YButtonGroup } from '@yok-ui/core'`
const buttonIconSetup = `import { YButton, YButtonGroup } from '@yok-ui/core'
import {
  YCheckIcon,
  YCopyIcon,
  YDownloadIcon,
  YLoadingIcon,
  YSearchIcon,
  YUploadIcon
} from '@yok-ui/icons'`

const basicCode = `<template>
  <YButton>Default</YButton>
  <YButton type="primary">Primary</YButton>
  <YButton type="success">Success</YButton>
  <YButton type="info">Info</YButton>
  <YButton type="warning">Warning</YButton>
  <YButton type="danger">Danger</YButton>
  <YButton auto-insert-space>提交</YButton>
</template>`

const plainCode = `<template>
  <YButton plain>Plain</YButton>
  <YButton type="primary" plain>Primary</YButton>
  <YButton type="success" plain>Success</YButton>
  <YButton type="warning" plain>Warning</YButton>
  <YButton type="danger" plain>Danger</YButton>
</template>`

const disabledCode = `<template>
  <YButton disabled>Default</YButton>
  <YButton type="primary" disabled>Primary</YButton>
  <YButton type="success" disabled>Success</YButton>
  <YButton type="danger" plain disabled>Danger</YButton>
</template>`

const linkCode = `<template>
  <YButton link>Default link</YButton>
  <YButton type="primary" link>Primary link</YButton>
  <YButton type="danger" link disabled>Disabled link</YButton>
</template>`

const textCode = `<template>
  <YButton text>Text button</YButton>
  <YButton type="primary" text>Primary text</YButton>
  <YButton type="primary" text bg>Text with background</YButton>
  <YButton type="danger" text disabled>Disabled text</YButton>
</template>`

const iconCode = `<template>
  <YButton type="primary" :icon="YSearchIcon">Search</YButton>
  <YButton type="success">
    <template #icon>
      <YCheckIcon />
    </template>
    Confirm
  </YButton>
  <YButton circle :icon="YCopyIcon" aria-label="Copy" />
  <YButton circle type="primary" :icon="YDownloadIcon" aria-label="Download" />
</template>`

const groupCode = `<template>
  <YButtonGroup label="Pagination actions" type="primary">
    <YButton>Previous</YButton>
    <YButton>Next</YButton>
  </YButtonGroup>

  <YButtonGroup label="File actions" size="sm">
    <YButton :icon="YUploadIcon">Upload</YButton>
    <YButton :icon="YDownloadIcon">Download</YButton>
  </YButtonGroup>

  <YButtonGroup label="Stacked actions" direction="vertical" size="sm">
    <YButton>Approve</YButton>
    <YButton>Reject</YButton>
  </YButtonGroup>
</template>`

const loadingCode = `<template>
  <YButton type="primary" loading>Loading</YButton>
  <YButton type="primary" :loading-icon="YLoadingIcon" loading>Saving</YButton>
  <YButton type="success" loading>
    <template #loading>
      <YLoadingIcon />
    </template>
    Custom loading
  </YButton>
</template>`

const sizeCode = `<template>
  <YButton size="sm">Small</YButton>
  <YButton>Default</YButton>
  <YButton size="lg">Large</YButton>
  <YButton type="primary" round size="sm">Small</YButton>
  <YButton type="primary" round>Default</YButton>
  <YButton type="primary" round size="lg">Large</YButton>
</template>`

const shapeCode = `<template>
  <YButton round>Round</YButton>
  <YButton type="primary" round>Primary round</YButton>
  <YButton dashed>Dashed</YButton>
  <YButton type="primary" dashed plain>Primary dashed</YButton>
</template>`

const nativeBlockCode = `<template>
  <form class="demo-stack">
    <YButton native-type="submit" type="primary" block>Submit release</YButton>
    <YButton native-type="reset" block text bg>Reset form</YButton>
  </form>
</template>`

const customColorCode = `<template>
  <YButton color="#7c3aed" dark>Violet</YButton>
  <YButton color="#0f766e" plain>Teal plain</YButton>
  <YButton color="#ea580c" text bg>Orange text</YButton>
</template>`
</script>

# Button

按钮用于触发页面中的主要动作。Yok UI 的 Button 对齐 Element Plus 的主流使用模型：视觉类型、朴素按钮、文字按钮、链接按钮、图标按钮、按钮组、加载状态、尺寸、原生类型和自定义颜色都可以通过稳定 props 完成。

::: tip TIP
`YButton` 现在同时支持 Element Plus 风格的 `type`、`plain`、`text`、`link`、`round`、`circle`、`loading` 和 `native-type`，旧版 `variant` 作为兼容别名保留。
:::

## 基础用法 {#button-basic-usage}

使用 `type` 定义按钮语义。默认按钮用于普通操作，`primary` 用于页面主动作，其余类型用于明确的状态反馈。

<DocDemo
  id="button-basic-usage"
  title="基础用法"
  description="同一操作区通常只保留一个 primary，其他按钮按任务语义选择 success、warning 或 danger。"
  :code="basicCode"
  :setup="buttonCodeSetup"
  :usage="['type 视觉类型', 'variant 兼容别名', 'autoInsertSpace 中文双字']"
>
  <div class="demo-row">
    <YButton>Default</YButton>
    <YButton type="primary">Primary</YButton>
    <YButton type="success">Success</YButton>
    <YButton type="info">Info</YButton>
    <YButton type="warning">Warning</YButton>
    <YButton type="danger">Danger</YButton>
    <YButton auto-insert-space>提交</YButton>
  </div>
</DocDemo>

## 朴素按钮 {#button-plain}

设置 `plain` 后按钮会弱化填充，仅保留语义色和边框，适合次级操作或浅色页面区域。

<DocDemo
  title="朴素按钮"
  description="plain 适合和填充按钮配套使用，用于降低操作强度。"
  :code="plainCode"
  :setup="buttonCodeSetup"
  :usage="['plain', 'bordered state', 'lower emphasis']"
>
  <div class="demo-row">
    <YButton plain>Plain</YButton>
    <YButton type="primary" plain>Primary</YButton>
    <YButton type="success" plain>Success</YButton>
    <YButton type="warning" plain>Warning</YButton>
    <YButton type="danger" plain>Danger</YButton>
  </div>
</DocDemo>

## 禁用状态 {#button-disabled}

设置 `disabled` 后按钮不可聚焦触发。禁用状态应只用于权限不足、条件未满足或不可重复执行的动作。

<DocDemo
  title="禁用状态"
  description="disabled 会阻止点击事件触发，同时保留按钮原有尺寸，避免工具栏布局跳动。"
  :code="disabledCode"
  :setup="buttonCodeSetup"
  :usage="['disabled', 'no click', 'stable layout']"
>
  <div class="demo-row">
    <YButton disabled>Default</YButton>
    <YButton type="primary" disabled>Primary</YButton>
    <YButton type="success" disabled>Success</YButton>
    <YButton type="danger" plain disabled>Danger</YButton>
  </div>
</DocDemo>

## 链接按钮 {#button-link}

设置 `link` 后按钮会呈现为文本链接形态，但仍保留 button 语义，适合表格操作和行内弱操作。

<DocDemo
  title="链接按钮"
  description="link 适合行内操作；需要跳转真实页面时仍应优先使用路由链接组件。"
  :code="linkCode"
  :setup="buttonCodeSetup"
  :usage="['link', 'button semantics', 'inline action']"
>
  <div class="demo-row">
    <YButton link>Default link</YButton>
    <YButton type="primary" link>Primary link</YButton>
    <YButton type="danger" link disabled>Disabled link</YButton>
  </div>
</DocDemo>

## 文字按钮 {#button-text}

设置 `text` 后按钮没有边框和填充背景；配合 `bg` 可以恢复轻量背景，适合工具栏或低干扰操作。

<DocDemo
  title="文字按钮"
  description="text 比 link 更偏向动作按钮；bg 可以让文字按钮在工具栏里更容易被识别。"
  :code="textCode"
  :setup="buttonCodeSetup"
  :usage="['text', 'bg', 'low emphasis']"
>
  <div class="demo-row">
    <YButton text>Text button</YButton>
    <YButton type="primary" text>Primary text</YButton>
    <YButton type="primary" text bg>Text with background</YButton>
    <YButton type="danger" text disabled>Disabled text</YButton>
  </div>
</DocDemo>

## 图标按钮 {#button-icons}

通过 `icon` prop 或 `icon` slot 添加图标。只有图标没有文字时，需要提供 `aria-label`。

<DocDemo
  title="图标按钮"
  description="图标按钮必须保持稳定宽高；纯图标按钮需要可访问名称。"
  :code="iconCode"
  :setup="buttonIconSetup"
  :usage="['icon prop', 'icon slot', 'circle icon-only']"
>
  <div class="demo-row">
    <YButton type="primary" :icon="YSearchIcon">Search</YButton>
    <YButton type="success">
      <template #icon>
        <YCheckIcon />
      </template>
      Confirm
    </YButton>
    <YButton circle :icon="YCopyIcon" aria-label="Copy" />
    <YButton circle type="primary" :icon="YDownloadIcon" aria-label="Download" />
  </div>
</DocDemo>

## 按钮组 {#button-group}

`YButtonGroup` 用于组织一组强相关操作，并可以统一下发 `type`、`size` 和排列方向。

<DocDemo
  title="按钮组"
  description="按钮组需要传入 label 作为可访问名称；统一 type 和 size 可以减少重复代码。"
  :code="groupCode"
  :setup="buttonIconSetup"
  :usage="['YButtonGroup', 'direction=vertical', 'vertical 兼容写法']"
>
  <div class="demo-stack">
    <YButtonGroup label="Pagination actions" type="primary">
      <YButton>Previous</YButton>
      <YButton>Next</YButton>
    </YButtonGroup>
    <YButtonGroup label="File actions" size="sm">
      <YButton :icon="YUploadIcon">Upload</YButton>
      <YButton :icon="YDownloadIcon">Download</YButton>
    </YButtonGroup>
    <YButtonGroup label="Stacked actions" direction="vertical" size="sm">
      <YButton>Approve</YButton>
      <YButton>Reject</YButton>
    </YButtonGroup>
  </div>
</DocDemo>

## 加载状态按钮 {#button-loading}

设置 `loading` 后按钮会禁用点击并暴露 `aria-busy`。可以通过 `loading-icon` 或 `loading` slot 替换加载图标。

<DocDemo
  title="加载状态按钮"
  description="loading 会阻止重复提交；自定义 loading slot 适合接入项目统一图标体系。"
  :code="loadingCode"
  :setup="buttonIconSetup"
  :usage="['loading', 'loading-icon', 'loading slot']"
>
  <div class="demo-row">
    <YButton type="primary" loading>Loading</YButton>
    <YButton type="primary" :loading-icon="YLoadingIcon" loading>Saving</YButton>
    <YButton type="success" loading>
      <template #loading>
        <YLoadingIcon />
      </template>
      Custom loading
    </YButton>
  </div>
</DocDemo>

## 调整尺寸 {#button-sizes}

Button 支持 `sm`、`md`、`lg` 三种尺寸，并会跟随 `YConfigProvider` 的全局尺寸配置。

<DocDemo
  id="button-sizes"
  title="调整尺寸"
  description="尺寸覆盖紧凑工具栏、普通表单和强调型操作，保持和 Input、Select 等表单控件同一密度体系。"
  :code="sizeCode"
  :setup="buttonCodeSetup"
  :usage="['sm 工具栏', 'md 默认', 'lg 强调动作']"
>
  <div class="demo-row">
    <YButton size="sm">Small</YButton>
    <YButton>Default</YButton>
    <YButton size="lg">Large</YButton>
    <YButton type="primary" round size="sm">Small</YButton>
    <YButton type="primary" round>Default</YButton>
    <YButton type="primary" round size="lg">Large</YButton>
  </div>
</DocDemo>

## 圆角和虚线按钮 {#button-shape}

设置 `round` 可以得到胶囊按钮，设置 `dashed` 可以得到虚线边框按钮。

<DocDemo
  title="圆角和虚线按钮"
  description="round 用于强调轻快友好的操作，dashed 更适合新增、上传、空状态中的辅助动作。"
  :code="shapeCode"
  :setup="buttonCodeSetup"
  :usage="['round', 'dashed', 'plain dashed']"
>
  <div class="demo-row">
    <YButton round>Round</YButton>
    <YButton type="primary" round>Primary round</YButton>
    <YButton dashed>Dashed</YButton>
    <YButton type="primary" dashed plain>Primary dashed</YButton>
  </div>
</DocDemo>

## 原生类型和块级按钮 {#button-native-type-and-block}

表单按钮应显式声明 `native-type`；`block` 适合移动端底部动作、登录页和单列表单主按钮。

<DocDemo
  title="原生类型和块级按钮"
  description="为了兼容早期版本，Yok UI 仍支持 type='submit'，但新代码推荐使用 native-type。"
  :code="nativeBlockCode"
  :setup="buttonCodeSetup"
  :usage="['native-type=submit', 'native-type=reset', 'autofocus 表单首按钮']"
>
  <form class="demo-stack">
    <YButton native-type="submit" type="primary" block>Submit release</YButton>
    <YButton native-type="reset" block text bg>Reset form</YButton>
  </form>
</DocDemo>

## 自定义颜色 {#button-custom-color}

使用 `color` 可以为单个按钮覆盖主题色；深色背景按钮可设置 `dark` 保证文字对比度。

<DocDemo
  title="自定义颜色"
  description="自定义颜色适合品牌动作或临时业务色，但不建议替代全局主题 token。"
  :code="customColorCode"
  :setup="buttonCodeSetup"
  :usage="['color', 'dark contrast', 'plain custom']"
>
  <div class="demo-row">
    <YButton color="#7c3aed" dark>Violet</YButton>
    <YButton color="#0f766e" plain>Teal plain</YButton>
    <YButton color="#ea580c" text bg>Orange text</YButton>
  </div>
</DocDemo>

## Button API {#button-api}

<ComponentApiSection :names="['YButton', 'YButtonGroup', 'YIconButton']" />

## Accessibility {#accessibility}

- 默认使用原生 button 语义，支持 Enter / Space 触发。
- `loading` 会禁用交互并通过 `aria-busy` 暴露状态。
- `YButtonGroup` 使用 `role="group"` 组织相关操作，建议传入 `label`。
- 纯图标按钮需要提供可访问名称，例如 `aria-label`。
