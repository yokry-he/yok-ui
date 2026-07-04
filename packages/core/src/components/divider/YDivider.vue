<script setup lang="ts">
defineOptions({
  name: 'YDivider'
})

interface Props {
  label?: string
  align?: 'start' | 'center' | 'end'
}

withDefaults(defineProps<Props>(), {
  label: '',
  align: 'center'
})
</script>

<template>
  <div class="yok-divider" :class="`yok-divider--${align}`" role="separator">
    <span v-if="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.yok-divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--yok-space-3);
  align-items: center;
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 650;
}

.yok-divider::before,
.yok-divider::after {
  height: 1px;
  content: "";
  background: var(--yok-color-border);
}

.yok-divider--start {
  grid-template-columns: 32px auto 1fr;
}

.yok-divider--end {
  grid-template-columns: 1fr auto 32px;
}

.yok-divider span {
  white-space: nowrap;
}
</style>
