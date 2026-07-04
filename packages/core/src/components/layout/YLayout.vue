<script setup lang="ts">
import { Comment, Fragment, Text, computed, type VNode, type VNodeChild } from 'vue'

defineOptions({
  name: 'YLayout'
})

export type YLayoutDirection = 'auto' | 'horizontal' | 'vertical'

interface Props {
  direction?: YLayoutDirection
  fullHeight?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'auto',
  fullHeight: false,
  ariaLabel: 'Layout'
})

const slots = defineSlots<{
  default?: () => VNodeChild[]
}>()

function flattenChildren(children: VNodeChild[]): VNode[] {
  return children.flatMap((child) => {
    if (Array.isArray(child)) {
      return flattenChildren(child)
    }

    if (typeof child !== 'object' || child === null) {
      return []
    }

    if (child.type === Fragment && Array.isArray(child.children)) {
      return flattenChildren(child.children as VNodeChild[])
    }

    if (child.type === Comment) {
      return []
    }

    if (child.type === Text && typeof child.children === 'string' && !child.children.trim()) {
      return []
    }

    return [child]
  })
}

function getComponentName(node: VNode) {
  if (typeof node.type === 'object' && node.type !== null && 'name' in node.type) {
    return String(node.type.name)
  }

  return ''
}

const resolvedDirection = computed(() => {
  if (props.direction !== 'auto') {
    return props.direction
  }

  const children = flattenChildren(slots.default?.() ?? [])
  const hasVerticalChrome = children.some((child) => {
    const name = getComponentName(child)

    return name === 'YHeader' || name === 'YFooter'
  })

  return hasVerticalChrome ? 'vertical' : 'horizontal'
})
</script>

<template>
  <div
    class="yok-layout"
    :class="[
      `yok-layout--${resolvedDirection}`,
      { 'yok-layout--full-height': fullHeight }
    ]"
    role="group"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>

<style scoped>
.yok-layout {
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
  color: var(--yok-color-text);
}

.yok-layout--horizontal {
  flex-direction: row;
}

.yok-layout--vertical {
  flex-direction: column;
}

.yok-layout--full-height {
  min-height: 100vh;
}

.yok-layout :deep(.yok-layout) {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
