<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDismissableLayer } from '../../composables/useDismissableLayer'
import { useFloatingLayer } from '../../composables/useFloatingLayer'

defineOptions({
  name: 'YPopconfirm'
})

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
}>(), {
  open: undefined,
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

const localOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const { floatingStyles } = useFloatingLayer(triggerRef, panelRef, {
  open: computed(() => localOpen.value),
  placement: computed(() => 'bottom-start'),
  offset: 10
})

watch(
  () => props.open,
  (value) => {
    if (typeof value === 'boolean') {
      localOpen.value = value
    }
  },
  { immediate: true }
)

function setOpen(value: boolean) {
  localOpen.value = value
  emit('update:open', value)
}

const { layerStyle } = useDismissableLayer({
  open: localOpen,
  reference: triggerRef,
  floating: panelRef,
  onDismiss: () => setOpen(false)
})

function confirm() {
  emit('confirm')
  setOpen(false)
}

function cancel() {
  emit('cancel')
  setOpen(false)
}
</script>

<template>
  <span class="yok-popconfirm">
    <span ref="triggerRef" class="yok-popconfirm__trigger" @click="setOpen(!localOpen)">
      <slot name="trigger">
        <slot />
      </slot>
    </span>
    <Transition name="yok-floating-layer">
      <span
        v-if="localOpen"
        ref="panelRef"
        class="yok-popconfirm__panel"
        role="dialog"
        :aria-label="title"
        :style="[floatingStyles, layerStyle]"
      >
        <strong>{{ title }}</strong>
        <span v-if="description">{{ description }}</span>
        <span class="yok-popconfirm__actions">
          <button type="button" class="yok-focus-ring" @click="cancel">{{ cancelText }}</button>
          <button type="button" class="yok-focus-ring yok-popconfirm__confirm" @click="confirm">{{ confirmText }}</button>
        </span>
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.yok-popconfirm {
  display: inline-flex;
}

.yok-popconfirm__trigger {
  display: inline-flex;
}

.yok-popconfirm__panel {
  z-index: var(--yok-zIndex-floating, 1000);
  display: grid;
  gap: var(--yok-space-2);
  width: max-content;
  max-width: min(280px, calc(100vw - 32px));
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-text);
  padding: var(--yok-space-3);
}

.yok-popconfirm__panel > span:not(.yok-popconfirm__actions) {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.6;
}

.yok-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--yok-space-2);
}

.yok-popconfirm__actions button {
  min-height: 30px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  padding: 0 var(--yok-space-3);
}

.yok-popconfirm__actions .yok-popconfirm__confirm {
  border-color: transparent;
  background: var(--yok-color-primary);
  color: white;
}
</style>
