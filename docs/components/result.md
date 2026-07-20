<script setup lang="ts">
const resultSetup = "import { YButton, YResult } from '@yok-ui/core'"

const successCode = [
  '<YResult',
  '  status="success"',
  '  title="Component published"',
  '  subtitle="The documentation and package exports are ready."',
  '>',
  '  <template #extra>',
  '    <YButton variant="primary">Open docs</YButton>',
  '    <YButton variant="secondary">Back to list</YButton>',
  '  </template>',
  '</YResult>'
].join('\n')

const notFoundCode = [
  '<YResult status="404" aria-label="Page not found">',
  '  <template #extra>',
  '    <YButton variant="primary">Go home</YButton>',
  '  </template>',
  '</YResult>'
].join('\n')

const customIconCode = [
  '<YResult',
  '  status="warning"',
  '  title="Review needed"',
  '  subtitle="A few accessibility notes still need attention."',
  '>',
  '  <template #icon>!</template>',
  '  <template #extra>',
  '    <YButton variant="secondary">Review notes</YButton>',
  '  </template>',
  '</YResult>'
].join('\n')
</script>

# Result

Result 用于页面级操作反馈，例如发布成功、提交完成、无权限访问、页面不存在或服务异常。它比 `YAlert` 更适合完整状态页，也比 `YEmpty` 更适合“操作已经结束并需要下一步”的场景。

::: tip TIP
`YResult` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Success {#result-success}

<DocDemo
  title="Success result"
  description="流程结束后的成功页应提供下一步主操作，并保留返回路径。"
  :code="successCode"
  :setup="resultSetup"
  :usage="['status', 'extra', 'page feedback']"
>
  <YResult
    status="success"
    title="Component published"
    subtitle="The documentation and package exports are ready."
  >
    <template #extra>
      <YButton variant="primary">Open docs</YButton>
      <YButton variant="secondary">Back to list</YButton>
    </template>
  </YResult>
</DocDemo>

## Error Pages {#result-error-pages}

<DocDemo
  title="Error page"
  description="404、403、500 等页面级反馈需要明确可访问名称和回退路径。"
  :code="notFoundCode"
  :setup="resultSetup"
  :usage="['404', 'aria-label', 'recovery action']"
>
  <YResult status="404" aria-label="Page not found">
    <template #extra>
      <YButton variant="primary">Go home</YButton>
    </template>
  </YResult>
</DocDemo>

## Usage notes {#result-usage-notes}

- Result 适合页面级或流程结束态；只是一行短反馈时使用 `YMessage` 或 `YAlert`。
- 403 / 404 / 500 应提供明确可访问名称和至少一个回退路径。
- 成功结果页应提供下一步主操作，避免用户停在无出口页面。
- 移动端结果页保持标题和说明短小，操作按钮允许换行或堆叠。
- 操作区可使用默认插槽；需要更明确结构时使用 `#extra`。

## Custom Icon {#result-custom-icon}

<DocDemo
  title="Custom icon"
  description="自定义图标可以强化语气，但状态含义仍应通过标题和说明文本表达。"
  :code="customIconCode"
  :setup="resultSetup"
  :usage="['icon slot', 'warning', 'extra']"
>
  <YResult
    status="warning"
    title="Review needed"
    subtitle="A few accessibility notes still need attention."
  >
    <template #icon>!</template>
    <template #extra>
      <YButton variant="secondary">Review notes</YButton>
    </template>
  </YResult>
</DocDemo>

## Result API {#result-api}

<ComponentApiSection name="YResult" />

## Accessibility {#accessibility}

- 外层使用具名 `section`，通过 `ariaLabel` 提供可访问名称。
- 默认图标为装饰性内容，使用 `aria-hidden` 隐藏。
- 操作区通过 `extra` 插槽承载原生按钮或链接。
- 结果标题和说明保持可读文本，不只依赖颜色表达状态。
- 键盘用户应能按 Tab 顺序进入操作区里的主要和次要动作。
