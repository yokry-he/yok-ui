<script setup lang="ts">

const basicSetup = `import { YAlert, YButton } from '@yok-ui/core'`

const basicCode = `<template>
  <YAlert tone="success" variant="soft" title="Theme saved">
    Light and Clean themes are ready for preview.
  </YAlert>
  <YAlert tone="warning" variant="outline" title="Roadmap note" closable close-text="Got it" banner>
    Admin package components are planned for the next phase.
    <template #action>
      <YButton size="sm" variant="ghost">View roadmap</YButton>
    </template>
  </YAlert>
</template>`
</script>

# Alert

Alert 用于展示页面级或区块级反馈，例如保存成功、配置缺失、风险提醒。它比 Toast 更稳定，比 Modal 更轻。

::: tip TIP
`YAlert` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Semantic alerts {#alert-semantic-alerts}

<DocDemo
  title="Semantic alerts"
  description="使用 tone 表达信息语义；closable 只用于用户可以临时忽略的提示。"
  :code="basicCode"
  :setup="basicSetup"
  :usage="['tone', 'variant', 'closable', 'closeText', 'action slot']"
>
  <div class="demo-stack">
    <YAlert tone="success" variant="soft" title="Theme saved">Light and Clean themes are ready for preview.</YAlert>
    <YAlert tone="warning" variant="outline" title="Roadmap note" closable close-text="Got it" banner>
      Admin package components are planned for the next phase.
      <template #action>
        <YButton size="sm" variant="ghost">View roadmap</YButton>
      </template>
    </YAlert>
  </div>
</DocDemo>

## Usage notes {#alert-usage-notes}

- Alert 适合页面级或区块级持久反馈，不会自动消失；短暂操作反馈优先使用 Message。
- 成功、提示和公告类反馈使用 `role="status"`，不要打断当前阅读。
- 表单提交失败、危险阻断或需要立即注意的错误摘要使用 `role="alert"`，并把标题写成可执行的修复方向。
- 可关闭 Alert 必须提供明确的 `closeLabel`，说明关闭的是哪条提示；需要可见文本时使用 `closeText`。
- `variant="soft"` 适合普通页面反馈，`outline` 适合公告和轻量横幅，`solid` 只用于阻断性错误摘要。
- `#action` 用于查看详情、撤销、重试等明确操作；不要把完整表单放进 Alert。
- `showIcon=false` 适合移动端短提示或已有强视觉上下文的区域。
- 移动端提示要保持短标题和短正文，避免关闭按钮被长文本挤压。

## Alert API {#alert-api}

<ComponentApiSection name="YAlert" />

## Accessibility {#accessibility}

- Alert 使用 `role="status"` 表达非阻塞反馈。
- 错误摘要或阻断性反馈可以使用 `role="alert"`，让读屏更及时播报。
- `closable` 按钮提供明确的 `aria-label`。
- `#action` 中的按钮保持原生焦点顺序，关闭按钮仍位于提示末尾。
- `tone` 应只用于真实语义，不建议把 success、warning、danger 当作装饰色。
