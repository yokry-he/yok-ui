<script setup lang="ts">
import { computed, provide } from 'vue'
import { yokButtonGroupInjectionKey } from './buttonContext'
import type { YButtonGroupDirection, YButtonSize, YButtonType } from './types'

defineOptions({
  name: 'YButtonGroup'
})

const props = withDefaults(defineProps<{
  label?: string
  direction?: YButtonGroupDirection
  size?: YButtonSize
  type?: YButtonType
  vertical?: boolean
}>(), {
  label: '',
  direction: undefined,
  size: undefined,
  type: undefined,
  vertical: false
})

const resolvedDirection = computed<YButtonGroupDirection>(() => {
  return props.direction ?? (props.vertical ? 'vertical' : 'horizontal')
})

provide(yokButtonGroupInjectionKey, {
  size: computed(() => props.size),
  type: computed(() => props.type)
})
</script>

<template>
  <div
    class="yok-button-group"
    :class="[
      `yok-button-group--${resolvedDirection}`,
      { 'yok-button-group--vertical': resolvedDirection === 'vertical' }
    ]"
    role="group"
    :aria-label="label || undefined"
  >
    <slot />
  </div>
</template>

<style scoped>
.yok-button-group {
  display: inline-flex;
  inline-size: fit-content;
  max-inline-size: 100%;
  align-items: stretch;
  vertical-align: middle;
}

.yok-button-group--vertical {
  flex-direction: column;
}

.yok-button-group :deep(.yok-button) {
  position: relative;
  flex: 0 0 auto;
  border-radius: 0;
}

.yok-button-group :deep(.yok-button:focus-visible) {
  z-index: 1;
}

.yok-button-group:not(.yok-button-group--vertical) :deep(.yok-button + .yok-button) {
  margin-inline-start: -1px;
}

.yok-button-group:not(.yok-button-group--vertical) :deep(.yok-button:first-child) {
  border-start-start-radius: var(--yok-radius-md);
  border-end-start-radius: var(--yok-radius-md);
}

.yok-button-group:not(.yok-button-group--vertical) :deep(.yok-button:last-child) {
  border-start-end-radius: var(--yok-radius-md);
  border-end-end-radius: var(--yok-radius-md);
}

.yok-button-group--vertical :deep(.yok-button + .yok-button) {
  margin-block-start: -1px;
}

.yok-button-group--vertical :deep(.yok-button:first-child) {
  border-start-start-radius: var(--yok-radius-md);
  border-start-end-radius: var(--yok-radius-md);
}

.yok-button-group--vertical :deep(.yok-button:last-child) {
  border-end-start-radius: var(--yok-radius-md);
  border-end-end-radius: var(--yok-radius-md);
}
</style>
