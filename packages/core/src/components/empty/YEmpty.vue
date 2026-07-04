<script setup lang="ts">
defineOptions({
  name: 'YEmpty'
})

interface Props {
  title: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  description: ''
})
</script>

<template>
  <section class="yok-empty">
    <div class="yok-empty__mark" aria-hidden="true">+</div>
    <h3 class="yok-empty__title">{{ title }}</h3>
    <p v-if="description" class="yok-empty__description">{{ description }}</p>
    <div v-if="$slots.action || $slots.default" class="yok-empty__action">
      <slot name="action">
        <slot />
      </slot>
    </div>
  </section>
</template>

<style scoped>
.yok-empty {
  display: grid;
  justify-items: center;
  gap: var(--yok-space-2);
  padding: var(--yok-space-6);
  text-align: center;
  color: var(--yok-color-text);
}

.yok-empty__mark {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
  font-size: 24px;
  font-weight: 700;
}

.yok-empty__title {
  margin: 0;
  font-size: 16px;
}

.yok-empty__description {
  margin: 0;
  color: var(--yok-color-textMuted);
}
</style>
