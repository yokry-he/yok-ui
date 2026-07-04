<script setup lang="ts">
defineOptions({
  name: 'YLogoCloud'
})

interface Props {
  title?: string
  logos: string[]
}

withDefaults(defineProps<Props>(), {
  title: ''
})
</script>

<template>
  <section class="yok-logo-cloud" aria-label="Logo cloud">
    <p v-if="title">{{ title }}</p>
    <div class="yok-logo-cloud__items">
      <span v-for="logo in logos" :key="logo">{{ logo }}</span>
    </div>
  </section>
</template>

<style scoped>
.yok-logo-cloud {
  display: grid;
  gap: var(--yok-space-4);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  padding: var(--yok-space-5);
}

.yok-logo-cloud p {
  margin: 0;
  color: var(--yok-color-textMuted);
  font-weight: 750;
  text-align: center;
}

.yok-logo-cloud__items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--yok-space-3);
}

.yok-logo-cloud__items span {
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  font-weight: 800;
  padding: var(--yok-space-3) var(--yok-space-4);
}
</style>
