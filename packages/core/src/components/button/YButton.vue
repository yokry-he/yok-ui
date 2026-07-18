<script setup lang="ts">
import { computed, inject, ref, useSlots } from 'vue'
import { useYokConfig } from '../config-provider'
import { yokButtonGroupInjectionKey } from './buttonContext'
import {
  Y_BUTTON_NATIVE_TYPES,
  Y_BUTTON_TYPES,
  type YButtonIcon,
  type YButtonNativeType,
  type YButtonSize,
  type YButtonType,
  type YButtonVariant
} from './types'

defineOptions({
  name: 'YButton'
})

interface Props {
  type?: YButtonType | YButtonNativeType
  variant?: YButtonVariant
  size?: YButtonSize
  nativeType?: YButtonNativeType
  plain?: boolean
  text?: boolean
  bg?: boolean
  link?: boolean
  round?: boolean
  circle?: boolean
  dashed?: boolean
  loading?: boolean
  loadingIcon?: YButtonIcon
  disabled?: boolean
  icon?: YButtonIcon
  block?: boolean
  autofocus?: boolean
  autoInsertSpace?: boolean
  color?: string
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  nativeType: undefined,
  plain: undefined,
  text: undefined,
  bg: false,
  link: false,
  round: undefined,
  circle: false,
  dashed: undefined,
  loading: false,
  disabled: false,
  block: false,
  autofocus: false,
  autoInsertSpace: undefined,
  dark: false
})

const yokConfig = useYokConfig()
const groupContext = inject(yokButtonGroupInjectionKey, null)
const slots = useSlots()
const buttonRef = ref<HTMLButtonElement>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedSize = computed<YButtonSize>(() => props.size ?? groupContext?.size.value ?? yokConfig.size.value)
const resolvedVariant = computed(() => props.variant ?? yokConfig.button.value.variant)
const resolvedPlain = computed(() => props.plain ?? yokConfig.button.value.plain ?? false)
const resolvedText = computed(() => props.text ?? yokConfig.button.value.text ?? false)
const resolvedRound = computed(() => props.round ?? yokConfig.button.value.round ?? false)
const resolvedDashed = computed(() => props.dashed ?? yokConfig.button.value.dashed ?? false)
const resolvedAutoInsertSpace = computed(() =>
  props.autoInsertSpace ?? yokConfig.button.value.autoInsertSpace ?? false
)

const resolvedNativeType = computed<YButtonNativeType>(() => {
  if (props.nativeType) return props.nativeType
  if (isNativeButtonType(props.type)) return props.type
  return yokConfig.button.value.nativeType ?? 'button'
})

const resolvedType = computed<YButtonType>(() => {
  if (isVisualButtonType(props.type)) return props.type
  if (props.variant === 'primary') return 'primary'
  if (groupContext?.type.value) return groupContext.type.value
  if (yokConfig.button.value.type) return yokConfig.button.value.type
  return resolvedVariant.value === 'primary' ? 'primary' : 'default'
})

const variantClass = computed(() => resolvedVariant.value
  ? [`yok-button--variant-${resolvedVariant.value}`, `yok-button--${resolvedVariant.value}`]
  : undefined)
const isDisabled = computed(() => props.disabled || props.loading)
const isCustomColor = computed(() => Boolean(props.color))

const defaultSlotText = computed(() => {
  const slot = slots.default?.()
  if (!slot || slot.length !== 1) return ''
  const child = slot[0]?.children
  return typeof child === 'string' ? child.trim() : ''
})

const shouldAddSpace = computed(() => {
  return resolvedAutoInsertSpace.value && /^[\u4e00-\u9fa5]{2}$/.test(defaultSlotText.value)
})

const spacedText = computed(() => defaultSlotText.value.split('').join(' '))

const buttonStyle = computed(() => {
  if (!props.color) return undefined
  return {
    '--yok-button-custom-color': props.color,
    '--yok-button-custom-contrast': props.dark ? '#ffffff' : '#10201d'
  }
})

function isVisualButtonType(value: Props['type']): value is YButtonType {
  return typeof value === 'string' && Y_BUTTON_TYPES.includes(value as YButtonType)
}

function isNativeButtonType(value: Props['type']): value is YButtonNativeType {
  return typeof value === 'string' && Y_BUTTON_NATIVE_TYPES.includes(value as YButtonNativeType)
}

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

defineExpose({
  ref: buttonRef,
  size: resolvedSize,
  type: resolvedType,
  disabled: isDisabled,
  shouldAddSpace
})
</script>

<template>
  <button
    ref="buttonRef"
    class="yok-button yok-focus-ring"
    :class="[
      `yok-button--${resolvedType}`,
      `yok-button--${resolvedSize}`,
      variantClass,
      {
        'yok-button--plain': resolvedPlain,
        'yok-button--text': resolvedText,
        'yok-button--bg': bg,
        'yok-button--link': link,
        'yok-button--round': resolvedRound,
        'yok-button--circle': circle,
        'yok-button--dashed': resolvedDashed,
        'yok-button--loading': loading,
        'yok-button--block': block,
        'yok-button--custom': isCustomColor
      }
    ]"
    :style="buttonStyle"
    :type="resolvedNativeType"
    :disabled="isDisabled"
    :autofocus="autofocus"
    :aria-busy="loading ? 'true' : 'false'"
    @click="handleClick"
  >
    <span v-if="loading" class="yok-button__loading" aria-hidden="true">
      <slot name="loading">
        <component :is="loadingIcon" v-if="loadingIcon" />
        <span v-else class="yok-button__spinner" />
      </slot>
    </span>
    <span v-else-if="$slots.icon || icon" class="yok-button__icon" aria-hidden="true">
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>
    <span v-if="$slots.default || shouldAddSpace" class="yok-button__content">
      <template v-if="shouldAddSpace">{{ spacedText }}</template>
      <slot v-else />
    </span>
  </button>
</template>

<style scoped>
.yok-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  border: 1px solid transparent;
  border-radius: var(--yok-radius-md);
  font-weight: 650;
  letter-spacing: 0;
  color: var(--yok-color-text);
  cursor: pointer;
  transition:
    transform var(--yok-motion-fast),
    background var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--yok-shadow-soft);
}

.yok-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-button--sm {
  min-height: 32px;
  padding: 0 var(--yok-space-3);
  font-size: 13px;
}

.yok-button--md {
  min-height: 38px;
  padding: 0 var(--yok-space-4);
  font-size: 14px;
}

.yok-button--lg {
  min-height: 44px;
  padding: 0 var(--yok-space-5);
  font-size: 15px;
}

.yok-button--default {
  background: var(--yok-color-primarySoft);
  border-color: var(--yok-color-border);
}

.yok-button--primary {
  background: var(--yok-color-primary);
  color: white;
}

.yok-button--success {
  background: #16a34a;
  color: white;
}

.yok-button--info {
  background: #64748b;
  color: white;
}

.yok-button--warning {
  background: #d97706;
  color: white;
}

.yok-button--danger {
  background: #dc2626;
  color: white;
}

.yok-button--secondary {
  background: var(--yok-color-primarySoft);
  border-color: var(--yok-color-border);
}

.yok-button--variant-secondary {
  background: var(--yok-color-primarySoft);
  border-color: var(--yok-color-border);
}

.yok-button--ghost,
.yok-button--variant-ghost {
  background: transparent;
  border-color: transparent;
}

.yok-button--plain {
  background: transparent;
  border-color: currentColor;
  color: var(--yok-color-primary);
}

.yok-button--plain.yok-button--success {
  color: #15803d;
}

.yok-button--plain.yok-button--info {
  color: #475569;
}

.yok-button--plain.yok-button--warning {
  color: #b45309;
}

.yok-button--plain.yok-button--danger {
  color: #b91c1c;
}

.yok-button--text,
.yok-button--link {
  min-height: auto;
  padding: 0;
  background: transparent;
  border-color: transparent;
  color: var(--yok-color-primary);
}

.yok-button--text.yok-button--bg {
  min-height: 32px;
  padding: 0 var(--yok-space-3);
  background: var(--yok-color-primarySoft);
}

.yok-button--link:hover:not(:disabled),
.yok-button--text:hover:not(:disabled) {
  transform: none;
  box-shadow: none;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.yok-button--round {
  border-radius: 999px;
}

.yok-button--circle {
  width: var(--yok-button-circle-size, 38px);
  min-width: var(--yok-button-circle-size, 38px);
  padding: 0;
  border-radius: 999px;
}

.yok-button--sm.yok-button--circle {
  --yok-button-circle-size: 32px;
}

.yok-button--lg.yok-button--circle {
  --yok-button-circle-size: 44px;
}

.yok-button--dashed {
  border-style: dashed;
}

.yok-button--custom:not(.yok-button--text, .yok-button--link, .yok-button--plain) {
  background: var(--yok-button-custom-color);
  color: var(--yok-button-custom-contrast);
}

.yok-button--custom.yok-button--plain,
.yok-button--custom.yok-button--text,
.yok-button--custom.yok-button--link {
  color: var(--yok-button-custom-color);
}

.yok-button--block {
  width: 100%;
}

.yok-button__loading,
.yok-button__icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.yok-button__loading :deep(svg),
.yok-button__icon :deep(svg) {
  width: 1em;
  height: 1em;
}

.yok-button__content {
  display: inline-flex;
  align-items: center;
}

.yok-button__spinner {
  width: 1em;
  height: 1em;
  border-radius: 999px;
  border: 2px solid currentColor;
  border-block-start-color: transparent;
  animation: yok-button-spin 900ms linear infinite;
}

@keyframes yok-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
