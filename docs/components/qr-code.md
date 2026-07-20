<script setup lang="ts">
const setup = `import { YQRCode } from '@yok-ui/core'`
const basicCode = `<YQRCode
  value="https://yok-ui.dev/components/qr-code"
  label="Yok UI QRCode documentation"
  level="H"
  :size="168"
  downloadable
  download-name="yok-ui-qr-code.svg"
>
  Yok UI QRCode
</YQRCode>`

const statusCode = `<YQRCode
  value="ticket:yok-ui:expired"
  label="Expired ticket QR code"
  status="expired"
  expired-text="Ticket QR code expired"
  refresh-text="Refresh code"
/>`
</script>

# QRCode

QRCode 将链接、票据、支付标识和一次性登录码转换成清晰的 SVG 二维码。组件参考 Ant Design QRCode 的文本转码、颜色和 logo 能力，并补充 Yok UI 文档体系需要的可访问名称、过期刷新、下载和 Live Example 复现能力。

::: tip TIP
`YQRCode` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Document link {#qr-code-document-link}

<DocDemo
  title="Document link"
  description="使用 SVG 渲染二维码，保持高分屏和导出场景下的清晰度。"
  :code="basicCode"
  :setup="setup"
  :usage="['svg render', 'error correction', 'download']"
>
  <YQRCode
    value="https://yok-ui.dev/components/qr-code"
    label="Yok UI QRCode documentation"
    level="H"
    :size="168"
    downloadable
    download-name="yok-ui-qr-code.svg"
  >
    Yok UI QRCode
  </YQRCode>
</DocDemo>

## Expired state {#qr-code-expired-state}

<DocDemo
  title="Expired state"
  description="登录、票据和支付二维码过期时，应展示明确状态并把刷新交给业务层处理。"
  :code="statusCode"
  :setup="setup"
  :usage="['expired', 'refresh event', 'status overlay']"
>
  <YQRCode
    value="ticket:yok-ui:expired"
    label="Expired ticket QR code"
    status="expired"
    expired-text="Ticket QR code expired"
    refresh-text="Refresh code"
  />
</DocDemo>

## Usage notes {#qr-code-usage-notes}

- 业务二维码必须提供稳定 `value` 和明确 `label`，不要只依赖屏幕上的说明文字。
- 带 logo 时建议使用 `level="H"`，并保持 logo 不超过二维码尺寸的三分之一。
- 登录、票据和支付场景使用 `status="expired"` 加 `refresh` 事件，不要静默替换二维码内容。
- 需要导出时开启 `downloadable`，组件会下载当前 SVG。

## QRCode API {#qr-code-api}

<ComponentApiSection name="YQRCode" />

## Accessibility {#accessibility}

- 组件根节点和内部 SVG 都提供可访问名称，默认会根据 `value` 生成。
- 加载状态使用 `role="status"` 和 `aria-busy`，过期状态使用 `role="alert"`。
- 刷新和下载是原生按钮，支持键盘聚焦、Enter 和 Space。
- 中心 logo 仅作为辅助品牌识别，二维码真实含义仍由 `label` 表达。
