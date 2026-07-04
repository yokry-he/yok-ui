<script setup lang="ts">
import { computed, watch } from 'vue'
import { createQRCode, type QRCodeErrorCorrectionLevel } from './qr-engine'

defineOptions({
  name: 'YQRCode'
})

export type YQRCodeLevel = Extract<QRCodeErrorCorrectionLevel, 'L' | 'M' | 'Q' | 'H'>
export type YQRCodeStatus = 'active' | 'loading' | 'expired'

interface QRCodeReadyPayload {
  value: string
  size: number
  level: YQRCodeLevel
  moduleCount: number
}

interface Props {
  value: string
  label?: string
  size?: number | string
  level?: YQRCodeLevel
  foreground?: string
  background?: string
  margin?: number | string
  status?: YQRCodeStatus
  expiredText?: string
  loadingText?: string
  refreshText?: string
  logoSrc?: string
  logoAlt?: string
  logoSize?: number | string
  downloadable?: boolean
  downloadText?: string
  downloadName?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  size: 160,
  level: 'M',
  foreground: '#087f6d',
  background: '#ffffff',
  margin: 2,
  status: 'active',
  expiredText: 'QR code expired',
  loadingText: 'Generating QR code',
  refreshText: 'Refresh',
  logoSrc: '',
  logoAlt: '',
  logoSize: 36,
  downloadable: false,
  downloadText: 'Download SVG',
  downloadName: 'yok-qr-code.svg'
})

const emit = defineEmits<{
  ready: [payload: QRCodeReadyPayload]
  refresh: []
  error: [error: Error]
  download: [filename: string]
}>()

const resolvedSize = computed(() => normalizeNumber(props.size, 160, 72, 320))
const resolvedMargin = computed(() => normalizeNumber(props.margin, 2, 0, 8))
const resolvedLogoSize = computed(() => normalizeNumber(props.logoSize, 36, 16, Math.floor(resolvedSize.value / 3)))
const accessibleLabel = computed(() => props.label || `QR code for ${props.value}`)
const isLoading = computed(() => props.status === 'loading')
const isExpired = computed(() => props.status === 'expired')
const rootStyle = computed(() => ({
  '--yok-qr-size': `${resolvedSize.value}px`,
  '--yok-qr-foreground': props.foreground,
  '--yok-qr-background': props.background
}))

const qrModel = computed(() => {
  try {
    return {
      code: createQRCode(props.value || ' ', {
        errorCorrectionLevel: props.level
      }),
      error: null
    }
  } catch (error) {
    return {
      code: null,
      error: error instanceof Error ? error : new Error(String(error))
    }
  }
})

const moduleCount = computed(() => qrModel.value.code?.modules.size ?? 0)
const viewBoxSize = computed(() => moduleCount.value + resolvedMargin.value * 2)
const modulePath = computed(() => {
  const code = qrModel.value.code

  if (!code) {
    return ''
  }

  const { modules } = code
  const margin = resolvedMargin.value
  const path: string[] = []

  for (let row = 0; row < modules.size; row += 1) {
    for (let col = 0; col < modules.size; col += 1) {
      if (modules.get(row, col)) {
        path.push(`M${col + margin} ${row + margin}h1v1h-1z`)
      }
    }
  }

  return path.join('')
})
const logoPosition = computed(() => {
  const viewBox = viewBoxSize.value
  const ratio = resolvedLogoSize.value / resolvedSize.value
  const boxSize = Math.max(4, Number((viewBox * ratio).toFixed(3)))
  const x = Number(((viewBox - boxSize) / 2).toFixed(3))

  return {
    x,
    y: x,
    size: boxSize,
    radius: Number((boxSize * 0.22).toFixed(3))
  }
})
const hasUsableCode = computed(() => Boolean(qrModel.value.code && modulePath.value))
const svgMarkup = computed(() => {
  if (!hasUsableCode.value) {
    return ''
  }

  const logo = props.logoSrc
    ? `<rect x="${logoPosition.value.x}" y="${logoPosition.value.y}" width="${logoPosition.value.size}" height="${logoPosition.value.size}" rx="${logoPosition.value.radius}" fill="${escapeAttribute(props.background)}"/><image href="${escapeAttribute(props.logoSrc)}" x="${logoPosition.value.x}" y="${logoPosition.value.y}" width="${logoPosition.value.size}" height="${logoPosition.value.size}" preserveAspectRatio="xMidYMid slice"/>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize.value} ${viewBoxSize.value}" width="${resolvedSize.value}" height="${resolvedSize.value}" role="img" aria-label="${escapeAttribute(accessibleLabel.value)}"><rect width="100%" height="100%" fill="${escapeAttribute(props.background)}"/><path d="${modulePath.value}" fill="${escapeAttribute(props.foreground)}"/>${logo}</svg>`
})

function normalizeNumber(value: number | string, fallback: number, min: number, max: number) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(max, Math.max(min, parsed))
}

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function handleRefresh() {
  emit('refresh')
}

function handleDownload() {
  if (!svgMarkup.value || typeof window === 'undefined') {
    return
  }

  const blob = new Blob([svgMarkup.value], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = props.downloadName
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
  emit('download', props.downloadName)
}

watch(
  () => qrModel.value,
  (model) => {
    if (model.error) {
      emit('error', model.error)
      return
    }

    if (model.code) {
      emit('ready', {
        value: props.value,
        size: resolvedSize.value,
        level: props.level,
        moduleCount: model.code.modules.size
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <figure
    class="yok-qr-code"
    :class="[
      `yok-qr-code--${status}`,
      {
        'yok-qr-code--with-logo': logoSrc,
        'yok-qr-code--downloadable': downloadable
      }
    ]"
    :style="rootStyle"
    :aria-label="accessibleLabel"
    :aria-busy="isLoading ? 'true' : 'false'"
  >
    <div class="yok-qr-code__surface">
      <svg
        v-if="hasUsableCode"
        class="yok-qr-code__svg"
        :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`"
        :width="resolvedSize"
        :height="resolvedSize"
        role="img"
        :aria-label="accessibleLabel"
      >
        <rect data-yok-qr-background width="100%" height="100%" :fill="background" />
        <path data-yok-qr-modules :d="modulePath" :fill="foreground" />
        <template v-if="logoSrc">
          <rect
            data-yok-qr-logo-well
            :x="logoPosition.x"
            :y="logoPosition.y"
            :width="logoPosition.size"
            :height="logoPosition.size"
            :rx="logoPosition.radius"
            :fill="background"
          />
          <image
            data-yok-qr-logo
            :href="logoSrc"
            :x="logoPosition.x"
            :y="logoPosition.y"
            :width="logoPosition.size"
            :height="logoPosition.size"
            preserveAspectRatio="xMidYMid slice"
            :aria-label="logoAlt || undefined"
          />
        </template>
      </svg>

      <div v-else class="yok-qr-code__fallback" role="alert">
        QR code could not be generated.
      </div>

      <div v-if="isLoading" class="yok-qr-code__status" role="status">
        <span class="yok-qr-code__spinner" aria-hidden="true" />
        <span>{{ loadingText }}</span>
      </div>

      <div v-else-if="isExpired" class="yok-qr-code__status" role="alert">
        <span>{{ expiredText }}</span>
        <button
          class="yok-qr-code__action yok-focus-ring"
          type="button"
          data-yok-qr-refresh
          @click="handleRefresh"
        >
          {{ refreshText }}
        </button>
      </div>
    </div>

    <figcaption v-if="$slots.default || downloadable" class="yok-qr-code__caption">
      <slot />
      <button
        v-if="downloadable"
        class="yok-qr-code__download yok-focus-ring"
        type="button"
        data-yok-qr-download
        @click="handleDownload"
      >
        {{ downloadText }}
      </button>
    </figcaption>
  </figure>
</template>

<style scoped>
.yok-qr-code {
  display: inline-flex;
  flex-direction: column;
  gap: var(--yok-space-3);
  width: max-content;
  max-width: 100%;
  margin: 0;
  color: var(--yok-qr-foreground);
}

.yok-qr-code__surface {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--yok-qr-size);
  max-width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--yok-qr-foreground) 16%, transparent);
  border-radius: var(--yok-radius-xl);
  background: var(--yok-qr-background);
  box-shadow: var(--yok-shadow-sm);
}

.yok-qr-code__svg {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.yok-qr-code__fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: var(--yok-space-4);
  color: var(--yok-color-danger-700);
  text-align: center;
  background: var(--yok-color-danger-50);
}

.yok-qr-code__status {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  padding: var(--yok-space-4);
  color: var(--yok-color-text);
  font-weight: 700;
  text-align: center;
  background: color-mix(in srgb, var(--yok-qr-background) 88%, transparent);
  backdrop-filter: blur(6px);
}

.yok-qr-code__spinner {
  width: 24px;
  height: 24px;
  border: 3px solid color-mix(in srgb, var(--yok-qr-foreground) 16%, transparent);
  border-top-color: var(--yok-qr-foreground);
  border-radius: 999px;
  animation: yok-qr-code-spin 800ms linear infinite;
}

.yok-qr-code__action,
.yok-qr-code__download {
  border: 1px solid color-mix(in srgb, var(--yok-qr-foreground) 18%, transparent);
  border-radius: var(--yok-radius-pill);
  background: var(--yok-color-surface);
  color: var(--yok-qr-foreground);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.yok-qr-code__action {
  padding: 8px 14px;
}

.yok-qr-code__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-2);
  color: var(--yok-color-text-secondary);
  font-size: 0.875rem;
}

.yok-qr-code__download {
  flex: 0 0 auto;
  padding: 6px 12px;
}

.yok-qr-code__action:hover,
.yok-qr-code__download:hover {
  border-color: color-mix(in srgb, var(--yok-qr-foreground) 38%, transparent);
  background: color-mix(in srgb, var(--yok-qr-foreground) 8%, var(--yok-color-surface));
}

@keyframes yok-qr-code-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
