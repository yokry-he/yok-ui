<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({
  name: 'YBacktop'
})

const props = withDefaults(defineProps<{
  visibilityHeight?: number
  right?: number
  bottom?: number
}>(), {
  visibilityHeight: 240,
  right: 24,
  bottom: 24
})

const emit = defineEmits<{
  click: []
}>()

const visible = ref(false)

function syncVisible() {
  visible.value = window.scrollY >= props.visibilityHeight
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  emit('click')
}

onMounted(() => {
  syncVisible()
  window.addEventListener('scroll', syncVisible, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncVisible)
})
</script>

<template>
  <button
    v-show="visible"
    class="yok-backtop yok-focus-ring"
    type="button"
    aria-label="Back to top"
    :style="{ right: `${right}px`, bottom: `${bottom}px` }"
    @click="scrollToTop"
  >
    ↑
  </button>
</template>

<style scoped>
.yok-backtop {
  position: fixed;
  z-index: 1200;
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--yok-color-border);
  border-radius: 999px;
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 20px;
  font-weight: 900;
}
</style>
