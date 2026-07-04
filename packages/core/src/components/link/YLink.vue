<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YLink'
})

export type YLinkTone = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'
export type YLinkSize = 'sm' | 'md' | 'lg'
export type YLinkUnderline = 'always' | 'hover' | 'never'

interface Props {
  href?: string
  target?: string
  rel?: string
  tone?: YLinkTone
  size?: YLinkSize
  underline?: YLinkUnderline
  disabled?: boolean
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  href: '',
  target: '',
  rel: '',
  tone: 'primary',
  size: 'md',
  underline: 'hover',
  disabled: false,
  external: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedTarget = computed(() => props.target || (props.external ? '_blank' : undefined))
const resolvedRel = computed(() => {
  if (props.rel) {
    return props.rel
  }

  return resolvedTarget.value === '_blank' ? 'noopener noreferrer' : undefined
})

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>

<template>
  <a
    class="yok-link yok-focus-ring"
    :class="[
      `yok-link--${tone}`,
      `yok-link--${size}`,
      `yok-link--underline-${underline}`,
      { 'yok-link--disabled': disabled }
    ]"
    :href="disabled ? undefined : href"
    :target="disabled ? undefined : resolvedTarget"
    :rel="disabled ? undefined : resolvedRel"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="handleClick"
  >
    <span class="yok-link__content">
      <slot />
    </span>
  </a>
</template>

<style scoped>
.yok-link {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border-radius: var(--yok-radius-sm);
  color: var(--yok-link-color, var(--yok-color-primary));
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  gap: var(--yok-space-1);
  line-height: 1.45;
  text-decoration-color: color-mix(in srgb, currentColor 48%, transparent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
  transition:
    color var(--yok-motion-fast),
    text-decoration-color var(--yok-motion-fast),
    opacity var(--yok-motion-fast);
}

.yok-link:hover,
.yok-link:focus-visible {
  color: color-mix(in srgb, var(--yok-link-color, var(--yok-color-primary)) 82%, var(--yok-color-text));
  text-decoration-color: currentColor;
}

.yok-link--neutral {
  --yok-link-color: var(--yok-color-text);
}

.yok-link--primary {
  --yok-link-color: var(--yok-color-primary);
}

.yok-link--success {
  --yok-link-color: var(--yok-color-success);
}

.yok-link--warning {
  --yok-link-color: var(--yok-color-warning);
}

.yok-link--danger {
  --yok-link-color: var(--yok-color-danger);
}

.yok-link--info {
  --yok-link-color: var(--yok-color-info);
}

.yok-link--sm {
  font-size: 13px;
}

.yok-link--md {
  font-size: 14px;
}

.yok-link--lg {
  font-size: 16px;
}

.yok-link--underline-always {
  text-decoration-line: underline;
}

.yok-link--underline-hover {
  text-decoration-line: none;
}

.yok-link--underline-hover:hover,
.yok-link--underline-hover:focus-visible {
  text-decoration-line: underline;
}

.yok-link--underline-never {
  text-decoration-line: none;
}

.yok-link--disabled {
  cursor: not-allowed;
  opacity: 0.46;
  pointer-events: auto;
}

.yok-link__content {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
