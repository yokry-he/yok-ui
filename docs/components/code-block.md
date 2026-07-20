<script setup lang="ts">
const codeBlockSnippet = "import { YButton } from '@yok-ui/core'"

const codeBlockSetup = [
  "import { YCodeBlock } from '@yok-ui/product'",
  '',
  "const codeBlockSnippet = \"import { YButton } from '@yok-ui/core'\""
].join('\n')

const basicCode = '<YCodeBlock language="ts" :code="codeBlockSnippet" />'
</script>

# Code Block

CodeBlock 用于展示安装命令、导入示例和组件源码片段。

::: tip TIP
`YCodeBlock` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Install snippet {#code-block-install-snippet}

<DocDemo
  title="Install snippet"
  description="代码块示例会同时提供预览、源码展开和复制代码入口。"
  :code="basicCode"
  :setup="codeBlockSetup"
  :usage="['product package', 'syntax highlight', 'copy-ready source']"
>
  <YCodeBlock language="ts" :code="codeBlockSnippet" />
</DocDemo>

## Code Block API {#code-block-api}

<ComponentApiSection :names="['YCodeBlock', 'YCopyButton']" />

## Accessibility {#accessibility}

- 代码内容保留文本节点，支持复制和屏幕阅读器逐行读取。
- 长代码区域横向滚动，不应让整个页面产生横向溢出。
- 复制按钮需要有明确反馈，复制完成后通过事件交给业务层记录状态。

## Design notes {#code-block-design-notes}

- 代码区使用深色表面来增强内容区分度。
- 长代码横向滚动，不撑破文档布局。
