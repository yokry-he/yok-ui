<script setup lang="ts">

const setup = `import { YIcon } from '@yok-ui/core'`
const code = `<YIcon size="lg" color="#0f766e" label="Stable">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
</YIcon>

<YIcon size="lg" color="#d97706" spinning label="Loading">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12a9 9 0 1 1-3-6.7" />
  </svg>
</YIcon>`
</script>

# Icon

Icon 用于统一 SVG 图标的尺寸、颜色、旋转状态和可访问语义。它不绑定具体图标库，可以包裹 lucide、iconfont、自研 SVG 或业务图标组件。

## Example

<DocDemo
  title="SVG wrapper"
  description="默认图标尺寸使用 1em，外层负责稳定宽高和颜色继承。"
  :code="code"
  :setup="setup"
  :usage="['svg slot', 'semantic label', 'spinning']"
>
  <div class="demo-row">
    <YIcon size="lg" color="#0f766e" label="Stable">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </YIcon>
    <YIcon size="lg" color="#d97706" spinning label="Loading">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
      </svg>
    </YIcon>
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="icon"
  title="在线编辑 Icon 示例"
  description="切换装饰图标、命名图标、加载旋转、移动工具栏和图标按钮场景。"
/>

## API

<ComponentApiSection name="YIcon" />

## Accessibility

- 只作为视觉装饰时不要传 `label`，组件会设置 `aria-hidden="true"`。
- 图标本身承载状态或含义时传入 `label`，组件会以具名 `img` 语义暴露。
- 放入按钮时，焦点和操作语义应由按钮承担，图标只作为按钮内容的一部分。
