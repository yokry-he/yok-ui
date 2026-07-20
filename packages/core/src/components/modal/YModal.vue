<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useOverlayA11y } from '../../composables/useOverlayA11y'
import YInternalIcon from '../_internal/YInternalIcon.vue'

defineOptions({
  name: 'YModal'
})

interface Props {
  open: boolean
  title: string
  description?: string
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  closeOnOverlay: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)

function closeFromOverlay() {
  if (props.closeOnOverlay) {
    emit('close')
  }
}

const { layerStyle } = useOverlayA11y({
  open: toRef(props, 'open'),
  container: dialogRef,
  closeOnEscape: toRef(props, 'closeOnEscape'),
  onClose: () => emit('close')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="yok-modal-layer">
      <div v-if="open" class="yok-modal" :style="layerStyle">
        <button class="yok-modal__overlay" type="button" aria-label="Close modal" @click="closeFromOverlay" />
        <section ref="dialogRef" class="yok-modal__dialog" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1">
          <header class="yok-modal__header">
            <div>
              <h2>{{ title }}</h2>
              <p v-if="description">{{ description }}</p>
            </div>
            <button
              class="yok-modal__close yok-focus-ring"
              type="button"
              aria-label="Close modal"
              data-modal-close
              @click="$emit('close')"
            >
              <YInternalIcon name="close" />
            </button>
          </header>
          <div class="yok-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="yok-modal__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.yok-modal {
  position: fixed;
  inset: 0;
  z-index: var(--yok-zIndex-modal, 2000);
  display: grid;
  place-items: center;
  padding: var(--yok-space-5);
}

.yok-modal__overlay {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(37, 48, 45, 0.36);
}

.yok-modal__dialog {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-xl);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
}

.yok-modal__header,
.yok-modal__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-4);
  padding: var(--yok-space-5);
}

.yok-modal__header {
  border-bottom: 1px solid var(--yok-color-border);
}

.yok-modal__header h2,
.yok-modal__header p {
  margin: 0;
}

.yok-modal__header h2 {
  font-size: 20px;
  letter-spacing: 0;
}

.yok-modal__header p {
  margin-top: var(--yok-space-2);
  color: var(--yok-color-textMuted);
}

.yok-modal__close {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.yok-modal__body {
  padding: var(--yok-space-5);
}

.yok-modal__footer {
  border-top: 1px solid var(--yok-color-border);
}
</style>
