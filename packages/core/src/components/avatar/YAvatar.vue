<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'

defineOptions({
  name: 'YAvatar'
})

export type YAvatarFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
export type YAvatarShape = 'circle' | 'square'
export type YAvatarSize = 'sm' | 'md' | 'lg'
export type YAvatarTone = 'primary' | 'success' | 'warning' | 'danger'

interface Props {
  src?: string
  srcSet?: string
  alt?: string
  label?: string
  name?: string
  fit?: YAvatarFit
  size?: YAvatarSize
  shape?: YAvatarShape
  tone?: YAvatarTone
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  srcSet: '',
  alt: '',
  label: '',
  name: '',
  fit: 'cover',
  size: 'md',
  shape: 'circle',
  tone: 'primary'
})

const emit = defineEmits<{
  error: [event: Event]
}>()

const slots = useSlots()
const imageErrored = ref(false)

const hasDefaultSlot = computed(() => Boolean(slots.default))
const shouldRenderImage = computed(() => Boolean(props.src) && !imageErrored.value)
const accessibleLabel = computed(() => props.label || props.alt || props.name)
const imageAlt = computed(() => props.alt || props.label || props.name)
const rootRole = computed(() => (shouldRenderImage.value ? undefined : 'img'))
const rootAriaLabel = computed(() => (shouldRenderImage.value ? undefined : accessibleLabel.value || undefined))
const imageStyle = computed(() => ({
  objectFit: props.fit
}))

const initials = computed(() => {
  const normalizedName = props.name.trim()

  if (!normalizedName) {
    return 'Y'
  }

  return normalizedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
})

watch(
  () => props.src,
  () => {
    imageErrored.value = false
  }
)

function handleImageError(event: Event) {
  imageErrored.value = true
  emit('error', event)
}
</script>

<template>
  <span
    class="yok-avatar"
    :class="[`yok-avatar--${size}`, `yok-avatar--${shape}`, `yok-avatar--${tone}`]"
    :role="rootRole"
    :aria-label="rootAriaLabel"
  >
    <img
      v-if="shouldRenderImage"
      class="yok-avatar__image"
      :src="src"
      :srcset="srcSet || undefined"
      :alt="imageAlt"
      :style="imageStyle"
      @error="handleImageError"
    />
    <span v-else-if="hasDefaultSlot" class="yok-avatar__content">
      <slot />
    </span>
    <span v-else class="yok-avatar__fallback" aria-hidden="true">{{ initials }}</span>
    <span v-if="!shouldRenderImage && !hasDefaultSlot && accessibleLabel" class="yok-sr-only">{{ accessibleLabel }}</span>
  </span>
</template>

<style scoped>
.yok-avatar {
  display: inline-grid;
  flex: none;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 12%, var(--yok-color-border));
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
  font-weight: 800;
  letter-spacing: 0;
  user-select: none;
}

.yok-avatar__content,
.yok-avatar__fallback {
  display: inline-grid;
  min-width: 0;
  place-items: center;
  line-height: 1;
}

.yok-avatar--sm {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

.yok-avatar--md {
  width: 40px;
  height: 40px;
  font-size: 15px;
}

.yok-avatar--lg {
  width: 56px;
  height: 56px;
  font-size: 20px;
}

.yok-avatar--circle {
  border-radius: 999px;
}

.yok-avatar--square {
  border-radius: var(--yok-radius-md);
}

.yok-avatar--success {
  background: color-mix(in srgb, var(--yok-color-success) 12%, white);
  color: var(--yok-color-success);
}

.yok-avatar--warning {
  background: color-mix(in srgb, var(--yok-color-warning) 14%, white);
  color: var(--yok-color-warning);
}

.yok-avatar--danger {
  background: color-mix(in srgb, var(--yok-color-danger) 12%, white);
  color: var(--yok-color-danger);
}

.yok-avatar__image {
  width: 100%;
  height: 100%;
}
</style>
