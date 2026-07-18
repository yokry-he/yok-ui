<script setup lang="ts">
import { ref } from 'vue'

const previewOpen = ref(false)

const imageSetup = [
  "import { ref } from 'vue'",
  "import { YImage } from '@yok-ui/core'",
  '',
  'const previewOpen = ref(false)'
].join('\n')

const basicCode = '<YImage src="/logo.svg" alt="Yok UI logo" fit="contain" width="220px" height="140px" preview />'

const controlledCode = [
  '<YImage',
  '  src="/logo.svg"',
  '  alt="Yok UI logo preview"',
  '  fit="contain"',
  '  width="220px"',
  '  height="140px"',
  '  preview',
  '  v-model:preview-open="previewOpen"',
  '/>',
  '<p class="demo-note">Preview open: {{ previewOpen ? \'yes\' : \'no\' }}</p>'
].join('\n')
</script>

# Image

Image 用于图片展示、加载占位、失败兜底和轻量预览。它吸收 Element Plus Image 的 `fit`、placeholder、error、lazy、preview 思路，也保留 Ant Design Image 的受控预览使用方式。

::: tip TIP
`YImage` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Preview image {#image-preview-image}

<DocDemo
  title="Preview image"
  description="内容图片必须提供 alt，并用稳定宽高避免图片加载前后布局跳动。"
  :code="basicCode"
  :setup="imageSetup"
  :usage="['alt', 'fit', 'preview']"
>
  <YImage src="/logo.svg" alt="Yok UI logo" fit="contain" width="220px" height="140px" preview />
</DocDemo>

## Controlled preview {#image-controlled-preview}

<DocDemo
  title="Controlled preview"
  description="需要同步相册、审核状态或埋点时，使用 v-model:preview-open 控制预览层。"
  :code="controlledCode"
  :setup="imageSetup"
  :usage="['v-model:preview-open', 'dialog', 'keyboard']"
>
  <YImage
    src="/logo.svg"
    alt="Yok UI logo preview"
    fit="contain"
    width="220px"
    height="140px"
    preview
    v-model:preview-open="previewOpen"
  />
  <p class="demo-note">Preview open: {{ previewOpen ? 'yes' : 'no' }}</p>
</DocDemo>

## Usage notes {#image-usage-notes}

- 内容图片必须提供 `alt`；纯装饰图片应由业务层决定是否隐藏给辅助技术。
- 列表图片优先使用 `lazy` 和 `placeholder`，避免首屏被远程图片阻塞。
- 失败状态必须展示可读内容，不要只依赖浏览器破损图片图标。
- 需要预览时使用 `preview`；外部需要同步相册、埋点或审核状态时使用 `previewOpen` 和 `update:previewOpen`。
- `width`、`height` 和 `fit` 应一起使用，避免图片加载前后造成布局跳动。

## Image API {#image-api}

<ComponentApiSection name="YImage" />

## Accessibility {#accessibility}

- 可预览图片使用按钮语义进入焦点路径，屏幕阅读器能听到预览操作名称。
- 预览层使用 `role="dialog"` 和 `aria-modal="true"`，支持点击遮罩或按 Escape 关闭。
- 加载中占位使用 `role="status"`；失败内容使用 `role="img"` 和错误可访问名称。
- 键盘用户应能从图片预览触发器继续移动到相邻操作，预览关闭后业务可自行恢复焦点。
