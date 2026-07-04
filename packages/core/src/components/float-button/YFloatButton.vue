<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({
  name: 'YFloatButton'
})

export type YFloatButtonAction = 'button' | 'backtop'
export type YFloatButtonShape = 'circle' | 'square'
export type YFloatButtonType = 'default' | 'primary'

interface Props {
  label: string
  tooltip?: string
  icon?: string
  content?: string
  type?: YFloatButtonType
  shape?: YFloatButtonShape
  action?: YFloatButtonAction
  disabled?: boolean
  right?: number
  bottom?: number
  visibilityHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: '',
  icon: '',
  content: '',
  type: 'default',
  shape: 'circle',
  action: 'button',
  disabled: false,
  right: 24,
  bottom: 24,
  visibilityHeight: 240
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const visible = ref(props.action !== 'backtop')
const isBacktop = computed(() => props.action === 'backtop')
const rootStyle = computed(() => ({
  '--yok-float-button-right': `${props.right}px`,
  '--yok-float-button-bottom': `${props.bottom}px`
}))
const contentText = computed(() => props.content || props.tooltip)

function syncVisible() {
  visible.value = !isBacktop.value || window.scrollY >= props.visibilityHeight
}

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    return
  }

  if (isBacktop.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  emit('click', event)
}

onMounted(() => {
  syncVisible()

  if (isBacktop.value) {
    window.addEventListener('scroll', syncVisible, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (isBacktop.value) {
    window.removeEventListener('scroll', syncVisible)
  }
})
</script>

<template>
  <button
    v-show="visible"
    class="yok-float-button yok-focus-ring"
    :class="[`yok-float-button--${type}`, `yok-float-button--${shape}`, { 'yok-float-button--content': contentText }]"
    :style="rootStyle"
    type="button"
    :aria-label="label"
    :title="tooltip || label"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="yok-float-button__icon" aria-hidden="true">
      <slot name="icon">{{ icon || (isBacktop ? '↑' : '+') }}</slot>
    </span>
    <span v-if="contentText" class="yok-float-button__content">{{ contentText }}</span>
  </button>
</template>

<style scoped>
.yok-float-button {
  position: fixed;
  right: var(--yok-float-button-right);
  bottom: var(--yok-float-button-bottom);
  z-index: var(--yok-zIndex-popover);
  display: inline-grid;
  place-items: center;
  min-width: 46px;
  height: 46px;
  padding: 0 12px;
  border: 1px solid var(--yok-color-border);
  border-radius: 999px;
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  transition:
    transform var(--yok-motion-fast),
    background var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-float-button:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--yok-color-primary) 42%, var(--yok-color-border));
  background: var(--yok-color-primarySoft);
  box-shadow: var(--yok-shadow-lg);
}

.yok-float-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-float-button--primary {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primary);
  color: var(--yok-color-primaryContrast);
}

.yok-float-button--primary:hover:not(:disabled) {
  background: var(--yok-color-primaryHover);
  color: var(--yok-color-primaryContrast);
}

.yok-float-button--square {
  border-radius: var(--yok-radius-xl);
}

.yok-float-button--content {
  grid-auto-flow: column;
  gap: var(--yok-space-2);
}

.yok-float-button__icon {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  font-size: 18px;
  line-height: 1;
}

.yok-float-button__content {
  max-width: 8em;
  overflow: hidden;
  font-size: 0.8125rem;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
