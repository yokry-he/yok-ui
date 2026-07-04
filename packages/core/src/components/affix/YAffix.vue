<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'YAffix'
})

export type YAffixPosition = 'top' | 'bottom'

export interface YAffixScrollPayload {
  scrollTop: number
  fixed: boolean
}

interface Props {
  offset?: number
  position?: YAffixPosition
  target?: string
  zIndex?: number
  disabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  offset: 0,
  position: 'top',
  target: '',
  zIndex: 100,
  disabled: false,
  ariaLabel: 'Affix'
})

const emit = defineEmits<{
  change: [fixed: boolean]
  scroll: [payload: YAffixScrollPayload]
}>()

const fixed = ref(false)
const targetElement = ref<Window | HTMLElement | null>(null)

const style = computed(() => ({
  '--yok-affix-offset': `${props.offset}px`,
  '--yok-affix-z-index': String(props.zIndex)
}))

function getTargetElement() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!props.target) {
    return window
  }

  if (typeof document === 'undefined') {
    return window
  }

  return document.querySelector<HTMLElement>(props.target) ?? window
}

function getScrollTop(target: Window | HTMLElement | null) {
  if (!target || typeof window === 'undefined') {
    return 0
  }

  return target === window
    ? window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    : (target as HTMLElement).scrollTop
}

function getFixedState(scrollTop: number) {
  if (props.disabled) {
    return false
  }

  return scrollTop > props.offset
}

function removeScrollListener() {
  targetElement.value?.removeEventListener('scroll', handleScroll)
}

function bindScrollListener() {
  removeScrollListener()
  targetElement.value = getTargetElement()
  targetElement.value?.addEventListener('scroll', handleScroll, { passive: true })
}

function update(emitScroll = true) {
  const scrollTop = getScrollTop(targetElement.value)
  const nextFixed = getFixedState(scrollTop)

  if (emitScroll) {
    emit('scroll', {
      scrollTop,
      fixed: nextFixed
    })
  }

  if (nextFixed !== fixed.value) {
    fixed.value = nextFixed
    emit('change', nextFixed)
  }
}

function handleScroll() {
  update()
}

watch(
  () => [props.target, props.offset, props.disabled] as const,
  () => {
    nextTick(() => {
      bindScrollListener()
      update(false)
    })
  }
)

onMounted(() => {
  bindScrollListener()
  update(false)
})

onBeforeUnmount(() => {
  removeScrollListener()
})

defineExpose({
  update
})
</script>

<template>
  <div
    class="yok-affix"
    :class="[
      `yok-affix--${position}`,
      {
        'yok-affix--fixed': fixed,
        'yok-affix--disabled': disabled
      }
    ]"
    :style="style"
    role="region"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>

<style scoped>
.yok-affix {
  box-sizing: border-box;
  max-width: 100%;
  z-index: var(--yok-affix-z-index);
}

.yok-affix:not(.yok-affix--disabled) {
  position: sticky;
}

.yok-affix--top:not(.yok-affix--disabled) {
  top: var(--yok-affix-offset);
}

.yok-affix--bottom:not(.yok-affix--disabled) {
  bottom: var(--yok-affix-offset);
}
</style>
