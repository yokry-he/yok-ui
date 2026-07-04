<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  name: 'YImage'
})

export type YImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
export type YImageValue = string

interface Props {
  src?: YImageValue
  alt?: string
  fit?: YImageFit
  width?: string
  height?: string
  radius?: string
  lazy?: boolean
  preview?: boolean
  previewSrcList?: YImageValue[]
  previewOpen?: boolean | null
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  fit: 'cover',
  width: '100%',
  height: 'auto',
  radius: 'var(--yok-radius-lg)',
  lazy: false,
  preview: false,
  previewSrcList: () => [],
  previewOpen: null,
  initialIndex: 0
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
  'preview-open': [index: number]
  'preview-close': []
  'update:previewOpen': [open: boolean]
}>()

const hasLoaded = ref(false)
const hasError = ref(false)
const internalPreviewOpen = ref(false)
const activeIndex = ref(0)

const isControlledPreview = computed(() => props.previewOpen !== null)
const isPreviewOpen = computed(() => (isControlledPreview.value ? Boolean(props.previewOpen) : internalPreviewOpen.value))
const sourceList = computed(() => (props.previewSrcList.length > 0 ? props.previewSrcList : props.src ? [props.src] : []))
const activePreviewSrc = computed(() => sourceList.value[activeIndex.value] || props.src)
const canPreview = computed(() => props.preview && !hasError.value && sourceList.value.length > 0)
const imageStyle = computed(() => ({
  '--yok-image-width': props.width,
  '--yok-image-height': props.height,
  '--yok-image-radius': props.radius
}))
const loadingLabel = computed(() => (props.alt ? `${props.alt} loading` : 'Image loading'))
const errorLabel = computed(() => (props.alt ? `${props.alt} failed to load` : 'Image failed to load'))

function clampIndex(index: number) {
  return Math.max(0, Math.min(index, Math.max(sourceList.value.length - 1, 0)))
}

function setPreviewOpen(open: boolean) {
  if (!isControlledPreview.value) {
    internalPreviewOpen.value = open
  }

  emit('update:previewOpen', open)
}

function openPreview() {
  if (!canPreview.value) {
    return
  }

  activeIndex.value = clampIndex(props.initialIndex)
  setPreviewOpen(true)
  emit('preview-open', activeIndex.value)
}

function closePreview() {
  if (!isPreviewOpen.value) {
    return
  }

  setPreviewOpen(false)
  emit('preview-close')
}

function handleLoad(event: Event) {
  hasLoaded.value = true
  hasError.value = false
  emit('load', event)
}

function handleError(event: Event) {
  hasLoaded.value = false
  hasError.value = true
  emit('error', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closePreview()
  }
}

watch(
  () => props.src,
  () => {
    hasLoaded.value = false
    hasError.value = false
  }
)

watch(isPreviewOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <figure
    class="yok-image"
    :class="[
      `yok-image--${fit}`,
      {
        'yok-image--previewable': canPreview,
        'is-loaded': hasLoaded,
        'is-error': hasError
      }
    ]"
    :style="imageStyle"
  >
    <button
      v-if="canPreview"
      class="yok-image__button"
      type="button"
      :aria-label="alt ? `Preview ${alt}` : 'Preview image'"
      @click="openPreview"
    >
      <span v-if="!hasLoaded && !hasError" class="yok-image__placeholder" role="status" :aria-label="loadingLabel">
        <slot name="placeholder">Loading...</slot>
      </span>
      <img
        v-if="!hasError"
        class="yok-image__media"
        :src="src"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        @load="handleLoad"
        @error="handleError"
      />
    </button>

    <template v-else>
      <span v-if="!hasLoaded && !hasError" class="yok-image__placeholder" role="status" :aria-label="loadingLabel">
        <slot name="placeholder">Loading...</slot>
      </span>
      <img
        v-if="!hasError"
        class="yok-image__media"
        :src="src"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        @load="handleLoad"
        @error="handleError"
      />
    </template>

    <div v-if="hasError" class="yok-image__error" role="img" :aria-label="errorLabel">
      <slot name="error">Image unavailable</slot>
    </div>

    <div
      v-if="isPreviewOpen"
      class="yok-image-preview"
      role="dialog"
      aria-modal="true"
      :aria-label="alt ? `Preview ${alt}` : 'Image preview'"
    >
      <button
        class="yok-image-preview__backdrop"
        type="button"
        aria-label="Close image preview"
        @click.stop.prevent="closePreview"
      />
      <div class="yok-image-preview__panel" @click.stop>
        <img class="yok-image-preview__image" :src="activePreviewSrc" :alt="alt" />
        <div v-if="$slots['preview-footer']" class="yok-image-preview__footer">
          <slot name="preview-footer" :active-index="activeIndex" :src="activePreviewSrc" />
        </div>
        <button
          class="yok-image-preview__close"
          type="button"
          data-image-preview-close
          aria-label="Close image preview"
          @click.stop.prevent="closePreview"
        >
          ×
        </button>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.yok-image {
  position: relative;
  display: inline-grid;
  width: var(--yok-image-width);
  height: var(--yok-image-height);
  min-width: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--yok-color-border) 78%, transparent);
  border-radius: var(--yok-image-radius);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-textMuted);
}

.yok-image__button {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  border-radius: inherit;
  background: transparent;
  color: inherit;
  cursor: zoom-in;
}

.yok-image__button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--yok-color-primary) 40%, transparent);
  outline-offset: -3px;
}

.yok-image__media,
.yok-image__placeholder,
.yok-image__error {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  min-width: 0;
  border-radius: inherit;
}

.yok-image__media {
  display: block;
  object-fit: var(--yok-image-fit, cover);
}

.yok-image--fill {
  --yok-image-fit: fill;
}

.yok-image--contain {
  --yok-image-fit: contain;
}

.yok-image--cover {
  --yok-image-fit: cover;
}

.yok-image--none {
  --yok-image-fit: none;
}

.yok-image--scale-down {
  --yok-image-fit: scale-down;
}

.yok-image__placeholder,
.yok-image__error {
  display: grid;
  place-items: center;
  padding: var(--yok-space-3);
  text-align: center;
}

.yok-image__placeholder {
  z-index: 1;
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 28%,
      color-mix(in srgb, var(--yok-color-surface) 72%, var(--yok-color-primarySoft) 28%) 48%,
      transparent 68%,
      transparent 100%
    ),
    color-mix(in srgb, var(--yok-color-surfaceMuted) 84%, var(--yok-color-primarySoft) 16%);
  background-size: 220% 100%, 100% 100%;
  animation: yok-image-loading 1.35s ease-in-out infinite;
  font-size: 13px;
}

.yok-image.is-loaded .yok-image__placeholder {
  display: none;
}

.yok-image__error {
  background: color-mix(in srgb, var(--yok-color-dangerSoft) 52%, var(--yok-color-surface) 48%);
  color: var(--yok-color-danger);
  font-weight: 700;
}

.yok-image-preview {
  position: fixed;
  z-index: 2400;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--yok-space-6);
}

.yok-image-preview__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(15 23 42 / 72%);
}

.yok-image-preview__panel {
  position: relative;
  z-index: 1;
  display: grid;
  max-width: min(920px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  gap: var(--yok-space-3);
}

.yok-image-preview__image {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 128px);
  border-radius: var(--yok-radius-xl);
  box-shadow: var(--yok-shadow-lg);
  object-fit: contain;
}

.yok-image-preview__footer {
  justify-self: center;
  padding: var(--yok-space-2) var(--yok-space-3);
  border-radius: 999px;
  background: rgb(255 255 255 / 92%);
  color: var(--yok-color-text);
  font-size: 13px;
  box-shadow: var(--yok-shadow-md);
}

.yok-image-preview__close {
  position: absolute;
  top: var(--yok-space-3);
  right: var(--yok-space-3);
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--yok-color-border) 60%, transparent);
  border-radius: 999px;
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  box-shadow: var(--yok-shadow-md);
}

@keyframes yok-image-loading {
  0% {
    background-position: 120% 0, 0 0;
  }

  100% {
    background-position: -120% 0, 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yok-image__placeholder {
    animation: none;
  }
}
</style>
