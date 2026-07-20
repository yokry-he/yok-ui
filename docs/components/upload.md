<script setup lang="ts">
const uploadCodeSetup = [
  "import { YUpload } from '@yok-ui/core'",
  '',
  "const rejectedFiles = [",
  "  {",
  "    id: 'blocked',",
  "    name: 'release-notes.exe',",
  '    size: 128000,',
  "    status: 'error',",
  "    reason: 'accept',",
  "    message: 'Only ZIP or TGZ packages can be published.'",
  '  }',
  ']',
  "const requestFiles = [",
  "  { id: 'one', name: 'release-package.zip', size: 860000, status: 'uploading', progress: 72, message: 'Uploading' },",
  "  { id: 'two', name: 'release-notes.tmp', size: 12000, status: 'error', message: 'Temporary files are blocked before upload.' }",
  ']',
  "const galleryFiles = [",
  '  {',
  "    id: 'cover',",
  "    name: 'component-cover.png',",
  '    size: 640000,',
  "    status: 'success',",
  "    url: '/logo.svg',",
  "    thumbUrl: '/logo.svg'",
  '  },',
  '  {',
  "    id: 'snapshot',",
  "    name: 'docs-snapshot.jpg',",
  '    size: 1260000,',
  "    status: 'success',",
  "    url: '/logo.svg',",
  "    thumbUrl: '/logo.svg'",
  '  }',
  ']',
  '',
  'const checkUploadFile = (file: File) => {',
  "  if (file.name.endsWith('.tmp')) {",
  "    return 'Temporary files are blocked before upload.'",
  '  }',
  '}',
  'const uploadToStorage = async ({ onProgress }: { onProgress: (progress: number) => void }) => {',
  '  onProgress(72)',
  "  return { message: 'Uploaded in demo', response: { id: 'demo-upload' } }",
  '}',
  'const handleDrop = () => {}',
  'const handleExceed = () => {}',
  'const openPreview = () => {}',
  'const downloadAsset = () => {}',
  'const saveOrder = () => {}'
].join('\n')

const basicCode = `<YUpload
  label="Upload component assets"
  description="Choose screenshots, icons, or design notes."
  accept=".png,.jpg,.pdf"
  multiple
  :max-files="3"
/>`
const dragCode = `<YUpload
  label="Drop release package"
  description="Drag a package archive into the area, or click to choose it."
  accept=".zip,.tgz"
  drag
  drop-label="Drop package here"
  @drop="handleDrop"
  @exceed="handleExceed"
/>`
const listCode = `<YUpload
  label="Release files"
  :model-value="[
    { id: 'one', name: 'yok-ui-core.zip', size: 2480000, status: 'success' },
    { id: 'two', name: 'docs-preview.png', size: 820000, status: 'uploading', progress: 68 }
  ]"
/>`
const pictureCode = `<YUpload
  label="Design gallery"
  description="Preview, download, reorder, or clear uploaded images."
  list-type="picture"
  previewable
  downloadable
  sortable
  clearable
  :model-value="galleryFiles"
  @preview="openPreview"
  @download="downloadAsset"
  @reorder="saveOrder"
/>`
const requestCode = `<YUpload
  label="Upload release package"
  description="Use a replaceable request handler for signed upload APIs."
  accept=".zip,.tgz"
  :max-files="1"
  :max-size="1048576"
  auto-upload
  :before-upload="checkUploadFile"
  :custom-request="uploadToStorage"
  :model-value="requestFiles"
/>`
const validationCode = `<YUpload
  id="release-upload"
  label="Publish package"
  description="Attach one production package before release."
  accept=".zip,.tgz"
  :max-files="1"
  invalid
  error="Upload a valid package before publishing."
  :rejected-files="rejectedFiles"
/>`
const rejectedFiles = [
  {
    id: 'blocked',
    name: 'release-notes.exe',
    size: 128000,
    status: 'error',
    reason: 'accept',
    message: 'Only ZIP or TGZ packages can be published.'
  }
]
const requestFiles = [
  { id: 'one', name: 'release-package.zip', size: 860000, status: 'uploading', progress: 72, message: 'Uploading' },
  { id: 'two', name: 'release-notes.tmp', size: 12000, status: 'error', message: 'Temporary files are blocked before upload.' }
]
const galleryFiles = [
  {
    id: 'cover',
    name: 'component-cover.png',
    size: 640000,
    status: 'success',
    url: '/logo.svg',
    thumbUrl: '/logo.svg'
  },
  {
    id: 'snapshot',
    name: 'docs-snapshot.jpg',
    size: 1260000,
    status: 'success',
    url: '/logo.svg',
    thumbUrl: '/logo.svg'
  }
]
const checkUploadFile = (file: File) => {
  if (file.name.endsWith('.tmp')) {
    return 'Temporary files are blocked before upload.'
  }
}
const uploadToStorage = async ({ onProgress }: { onProgress: (progress: number) => void }) => {
  onProgress(72)
  return { message: 'Uploaded in demo', response: { id: 'demo-upload' } }
}
</script>

# Upload

Upload 用于文件选择、文件列表展示、上传状态呈现和可替换请求生命周期。

它对齐主流组件库的受控上传模型：默认只收集文件并展示状态；当需要接入真实上传时，可通过 `beforeUpload`、`customRequest`、`autoUpload`、进度回写、取消和重试接管业务请求。

::: tip TIP
`YUpload` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## File chooser {#upload-file-chooser}

<DocDemo
  title="File chooser"
  description="业务侧可以接入自己的上传服务，并通过 modelValue 更新进度和状态。"
  :code="basicCode"
  :setup="uploadCodeSetup"
  :usage="['native file input', 'multiple', 'maxFiles']"
>
  <YUpload
    label="Upload component assets"
    description="Choose screenshots, icons, or design notes for the package."
    accept=".png,.jpg,.pdf"
    multiple
    :max-files="3"
  />
</DocDemo>

## Drag upload {#upload-drag-upload}

<DocDemo
  title="Drag upload"
  description="drag 开启后，投放区域会接收拖拽文件，并继续复用 accept、multiple 和 maxFiles 规则。"
  :code="dragCode"
  :setup="uploadCodeSetup"
  :usage="['drag', 'drop', 'accept', 'exceed']"
>
  <YUpload
    label="Drop release package"
    description="Drag a package archive into the area, or click to choose it."
    accept=".zip,.tgz"
    drag
    drop-label="Drop package here"
  />
</DocDemo>

## Controlled file list {#upload-controlled-file-list}

<DocDemo
  title="Controlled file list"
  description="受控列表适合展示来自业务上传服务的状态。"
  :code="listCode"
  :setup="uploadCodeSetup"
  :usage="['controlled list', 'progress', 'status']"
>
  <YUpload
    label="Release files"
    description="A controlled list can show upload status from your own service."
    :model-value="[
      { id: 'one', name: 'yok-ui-core.zip', size: 2480000, status: 'success', message: 'Ready' },
      { id: 'two', name: 'docs-preview.png', size: 820000, status: 'uploading', progress: 68 },
      { id: 'three', name: 'token-report.csv', size: 42000, status: 'error', message: 'Needs review' }
    ]"
  />
</DocDemo>

## Picture list actions {#upload-picture-list-actions}

<DocDemo
  title="Picture list actions"
  description="图片列表提供缩略图、预览、下载、排序和清空，适合素材库、附件预览和发布审核场景。"
  :code="pictureCode"
  :setup="uploadCodeSetup"
  :usage="['listType', 'previewable', 'downloadable', 'sortable', 'clearable']"
>
  <YUpload
    label="Design gallery"
    description="Preview, download, reorder, or clear uploaded images."
    list-type="picture"
    previewable
    downloadable
    sortable
    clearable
    :model-value="galleryFiles"
  />
</DocDemo>

## Request lifecycle {#upload-request-lifecycle}

<DocDemo
  title="Request lifecycle"
  description="customRequest 接入签名上传或业务 API；beforeUpload、maxSize 和事件回写负责请求前后状态。"
  :code="requestCode"
  :setup="uploadCodeSetup"
  :usage="['autoUpload', 'beforeUpload', 'customRequest', 'progress', 'abort']"
>
  <YUpload
    label="Upload release package"
    description="Use a replaceable request handler for signed upload APIs."
    accept=".zip,.tgz"
    :max-files="1"
    :max-size="1048576"
    auto-upload
    :before-upload="checkUploadFile"
    :custom-request="uploadToStorage"
    :model-value="requestFiles"
  />
</DocDemo>

## Rejected files and validation {#upload-rejected-files-and-validation}

<DocDemo
  title="Rejected files and validation"
  description="拒绝队列独立于正常 modelValue，适合展示 accept、maxFiles、服务端校验或表单提交失败。"
  :code="validationCode"
  :setup="uploadCodeSetup"
  :usage="['rejectedFiles', 'invalid', 'error', 'aria-describedby']"
>
  <YUpload
    id="release-upload"
    label="Publish package"
    description="Attach one production package before release."
    accept=".zip,.tgz"
    :max-files="1"
    invalid
    error="Upload a valid package before publishing."
    :rejected-files="rejectedFiles"
  />
</DocDemo>

## Usage notes {#upload-usage-notes}

- Upload 默认只负责文件选择和文件列表 UI；传入 `customRequest` 后可接入任意对象存储、签名上传或后端上传服务。
- `modelValue` 应由业务上传流程控制，文件状态可以是 `ready`、`uploading`、`success` 或 `error`。
- `rejectedFiles` 与正常文件列表分离，适合展示文件类型不匹配、数量超出、服务端拒绝或表单校验失败。
- `invalid` 和 `error` 会同步到上传区域与原生文件 input，并通过 `aria-describedby` 关联错误说明。
- `maxFiles` 只限制当前组件接收的文件数量，业务侧仍应在服务端校验文件数量和大小。
- `maxSize` 会在进入文件列表前拒绝超大文件，并触发 `reject(files, 'size')`。
- `beforeUpload` 适合做异步签名、业务权限或文件内容预校验，返回字符串时会作为拒绝原因显示。
- `customRequest` 负责真实请求，可通过 `onProgress`、返回结果、`onSuccess`、`onError` 和 `abort` 句柄同步上传生命周期。
- `listType="picture"` 会使用 `thumbUrl` 或 `url` 渲染缩略图；业务侧可配合 `previewable`、`downloadable`、`sortable` 和 `clearable` 完成素材列表操作。
- 关闭 `autoUpload` 时，可通过组件实例方法 `submit()` 手动提交带 `raw` 的待上传文件，并用 `clearFiles()` 清空队列。
- `drag` 复用同一套文件解析流程，拖拽文件也会触发 `drop`、`change`、`exceed` 和 `reject` 等事件。
- `accept` 会同时用于文件选择和拖拽过滤，拖入不匹配文件会触发 `reject`。
- 真实上传时建议在业务层继续处理重试策略、鉴权、服务端大小校验、MIME 类型校验和病毒扫描。

## Live workflow {#upload-live-workflow}

- “拒绝类型”场景用于检查 `accept` 过滤后的错误队列是否保留文件名、失败原因和可继续操作的上传区。
- “请求生命周期”场景用于检查 `auto-upload`、`customRequest`、`beforeUpload`、进度、取消和失败重试的源码链路。
- “图片列表操作”场景用于检查缩略图、预览、下载、排序和清空按钮是否同步出现在预览和源码中。
- “数量超出”场景用于检查 `max-files` 命中后的队列展示、错误提示和业务侧 `exceed` 处理说明。
- “禁用态”场景用于检查审核锁定时选择按钮、移除按钮和拖拽区域是否一起进入不可操作状态。
- “键盘路径”场景用于检查键盘用户能聚焦选择按钮，并通过空状态文本理解 Enter 会打开原生文件选择器。

## Upload API {#upload-api}

<ComponentApiSection name="YUpload" />

## Accessibility {#accessibility}

- 使用原生 `input type="file"` 作为底层文件选择控件。
- 拖拽模式仍保留可点击按钮，键盘用户可以继续通过原生文件选择器操作。
- 错误提示和拒绝文件列表会以 `role="alert"` 呈现，并和文件 input 建立描述关系。
- 文件数量摘要使用 `aria-live="polite"`。
- 移除按钮包含文件名，例如 `Remove docs-preview.png`。
