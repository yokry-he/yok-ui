<script setup lang="ts">
defineOptions({
  name: 'YIconButton'
})

interface Props {
  label: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="yok-icon-button yok-focus-ring"
    :class="`yok-icon-button--${size}`"
    type="button"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.yok-icon-button {
  display: inline-grid;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  transition:
    transform var(--yok-motion-fast),
    background var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-icon-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--yok-color-primarySoft);
  box-shadow: var(--yok-shadow-soft);
}

.yok-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-icon-button--sm {
  width: 32px;
  height: 32px;
}

.yok-icon-button--md {
  width: 38px;
  height: 38px;
}

.yok-icon-button--lg {
  width: 44px;
  height: 44px;
}
</style>
