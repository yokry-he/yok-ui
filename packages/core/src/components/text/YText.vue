<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YText'
})

export type YTextTone = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
export type YTextSize = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
  tag?: string
  tone?: YTextTone
  size?: YTextSize
  strong?: boolean
  italic?: boolean
  underline?: boolean
  deleted?: boolean
  mark?: boolean
  code?: boolean
  truncated?: boolean
  lineClamp?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'span',
  tone: 'neutral',
  size: 'md',
  strong: false,
  italic: false,
  underline: false,
  deleted: false,
  mark: false,
  code: false,
  truncated: false,
  lineClamp: undefined
})

const resolvedTag = computed(() => (props.code ? 'code' : props.tag))
const clampValue = computed(() => {
  if (!props.lineClamp) {
    return undefined
  }

  const value = Number(props.lineClamp)

  return Number.isFinite(value) && value > 0 ? String(Math.floor(value)) : undefined
})
const textStyle = computed(() => (clampValue.value ? { '--yok-text-line-clamp': clampValue.value } : undefined))
</script>

<template>
  <component
    :is="resolvedTag"
    class="yok-text"
    :class="[
      `yok-text--${tone}`,
      `yok-text--${size}`,
      {
        'yok-text--strong': strong,
        'yok-text--italic': italic,
        'yok-text--underline': underline,
        'yok-text--deleted': deleted,
        'yok-text--mark': mark,
        'yok-text--code': code,
        'yok-text--truncated': truncated,
        'yok-text--line-clamp': clampValue
      }
    ]"
    :style="textStyle"
  >
    <slot />
  </component>
</template>

<style scoped>
.yok-text {
  color: var(--yok-text-color, var(--yok-color-text));
  font-size: var(--yok-text-size, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: 1.65;
  text-decoration: none;
}

.yok-text--xs {
  --yok-text-size: 12px;
}

.yok-text--sm {
  --yok-text-size: 13px;
}

.yok-text--md {
  --yok-text-size: 14px;
}

.yok-text--lg {
  --yok-text-size: 16px;
}

.yok-text--neutral {
  --yok-text-color: var(--yok-color-text);
}

.yok-text--secondary {
  --yok-text-color: var(--yok-color-textMuted);
}

.yok-text--primary {
  --yok-text-color: var(--yok-color-primary);
}

.yok-text--success {
  --yok-text-color: var(--yok-color-success);
}

.yok-text--warning {
  --yok-text-color: var(--yok-color-warning);
}

.yok-text--danger {
  --yok-text-color: var(--yok-color-danger);
}

.yok-text--info {
  --yok-text-color: var(--yok-color-info);
}

.yok-text--strong {
  font-weight: 800;
}

.yok-text--italic {
  font-style: italic;
}

.yok-text--underline {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}

.yok-text--deleted {
  text-decoration: line-through;
}

.yok-text--mark {
  border-radius: var(--yok-radius-sm);
  background: color-mix(in srgb, var(--yok-color-warning) 18%, transparent);
  color: var(--yok-color-text);
  padding: 0 0.2em;
}

.yok-text--code {
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surfaceSoft);
  color: var(--yok-color-primary);
  font-family: var(--vp-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace);
  font-size: 0.92em;
  padding: 0.12em 0.36em;
}

.yok-text--truncated {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.yok-text--line-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--yok-text-line-clamp);
}
</style>
