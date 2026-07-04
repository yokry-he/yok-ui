<script setup lang="ts">
import { computed } from 'vue'
import { useYokConfig } from '../config-provider'

defineOptions({
  name: 'YButton'
})

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  loading: false,
  disabled: false,
  block: false,
  type: 'button'
})

const yokConfig = useYokConfig()
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="yok-button yok-focus-ring"
    :class="[`yok-button--${variant}`, `yok-button--${resolvedSize}`, { 'yok-button--block': block }]"
    :type="props.type"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : 'false'"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="yok-button__dot" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.yok-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  border: 1px solid transparent;
  border-radius: var(--yok-radius-md);
  font-weight: 650;
  letter-spacing: 0;
  color: var(--yok-color-text);
  cursor: pointer;
  transition:
    transform var(--yok-motion-fast),
    background var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--yok-shadow-soft);
}

.yok-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-button--sm {
  min-height: 32px;
  padding: 0 var(--yok-space-3);
  font-size: 13px;
}

.yok-button--md {
  min-height: 38px;
  padding: 0 var(--yok-space-4);
  font-size: 14px;
}

.yok-button--lg {
  min-height: 44px;
  padding: 0 var(--yok-space-5);
  font-size: 15px;
}

.yok-button--primary {
  background: var(--yok-color-primary);
  color: white;
}

.yok-button--secondary {
  background: var(--yok-color-primarySoft);
  border-color: var(--yok-color-border);
}

.yok-button--ghost {
  background: transparent;
  border-color: transparent;
}

.yok-button--block {
  width: 100%;
}

.yok-button__dot {
  width: 0.6em;
  height: 0.6em;
  border-radius: 999px;
  background: currentColor;
  animation: yok-button-pulse 900ms ease-in-out infinite;
}

@keyframes yok-button-pulse {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 1;
  }
}
</style>
