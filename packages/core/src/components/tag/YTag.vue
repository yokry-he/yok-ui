<script setup lang="ts">
defineOptions({
  name: 'YTag'
})

interface Props {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  tone: 'neutral'
})
</script>

<template>
  <span class="yok-tag" :class="`yok-tag--${tone}`">
    <slot />
  </span>
</template>

<style scoped>
.yok-tag {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: var(--yok-radius-sm);
  padding: 0 var(--yok-space-2);
  font-size: 12px;
  font-weight: 650;
  background: var(--yok-color-surfaceMuted);
}

.yok-tag--success {
  color: var(--yok-color-success);
}

.yok-tag--warning {
  color: var(--yok-color-warning);
}

.yok-tag--danger {
  color: var(--yok-color-danger);
}

.yok-tag--info {
  color: var(--yok-color-primary);
}
</style>
