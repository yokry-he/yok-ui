<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useOverlayA11y } from '../../composables/useOverlayA11y'

defineOptions({
  name: 'YDrawer'
})

interface Props {
  open: boolean
  title: string
  description?: string
  placement?: 'left' | 'right'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  placement: 'right',
  closeOnOverlay: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement | null>(null)

function closeFromOverlay() {
  if (props.closeOnOverlay) {
    emit('close')
  }
}

const { layerStyle } = useOverlayA11y({
  open: toRef(props, 'open'),
  container: panelRef,
  closeOnEscape: toRef(props, 'closeOnEscape'),
  onClose: () => emit('close')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="yok-drawer-layer">
      <div v-if="open" class="yok-drawer" :class="`yok-drawer--${placement}`" :style="layerStyle">
        <button class="yok-drawer__overlay" type="button" aria-label="Close drawer" @click="closeFromOverlay" />
        <aside ref="panelRef" class="yok-drawer__panel" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1">
          <header class="yok-drawer__header">
            <div>
              <h2>{{ title }}</h2>
              <p v-if="description">{{ description }}</p>
            </div>
            <button
              class="yok-drawer__close yok-focus-ring"
              type="button"
              aria-label="Close drawer"
              data-drawer-close
              @click="$emit('close')"
            >
              ×
            </button>
          </header>
          <div class="yok-drawer__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="yok-drawer__footer">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.yok-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--yok-zIndex-drawer, 1900);
  display: flex;
}

.yok-drawer--left {
  justify-content: flex-start;
}

.yok-drawer--right {
  justify-content: flex-end;
}

.yok-drawer__overlay {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(37, 48, 45, 0.32);
}

.yok-drawer__panel {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(420px, calc(100vw - 28px));
  height: 100%;
  border-left: 1px solid var(--yok-color-border);
  background: var(--yok-color-surface);
  box-shadow: -20px 0 70px rgba(37, 48, 45, 0.16);
}

.yok-drawer--left .yok-drawer__panel {
  border-right: 1px solid var(--yok-color-border);
  border-left: 0;
  box-shadow: 20px 0 70px rgba(37, 48, 45, 0.16);
}

.yok-drawer__header,
.yok-drawer__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-4);
  padding: var(--yok-space-5);
}

.yok-drawer__header {
  border-bottom: 1px solid var(--yok-color-border);
}

.yok-drawer__header h2,
.yok-drawer__header p {
  margin: 0;
}

.yok-drawer__header h2 {
  font-size: 20px;
  letter-spacing: 0;
}

.yok-drawer__header p {
  margin-top: var(--yok-space-2);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-drawer__close {
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

.yok-drawer__body {
  min-width: 0;
  overflow: auto;
  padding: var(--yok-space-5);
}

.yok-drawer__footer {
  border-top: 1px solid var(--yok-color-border);
}
</style>
