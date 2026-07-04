<script setup lang="ts">
defineOptions({
  name: 'YCard'
})

interface Props {
  title?: string
  description?: string
  interactive?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  interactive: false
})
</script>

<template>
  <article class="yok-card" :class="{ 'yok-card--interactive': interactive }">
    <header v-if="title || description || $slots.extra" class="yok-card__header">
      <div>
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div v-if="$slots.extra" class="yok-card__extra">
        <slot name="extra" />
      </div>
    </header>
    <div class="yok-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="yok-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.yok-card {
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  color: var(--yok-color-text);
  transition:
    transform var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-card--interactive:hover {
  border-color: var(--yok-color-primary);
  box-shadow: var(--yok-shadow-pop);
  transform: translateY(-2px);
}

.yok-card__header {
  display: flex;
  justify-content: space-between;
  gap: var(--yok-space-4);
  border-bottom: 1px solid var(--yok-color-border);
  padding: var(--yok-space-4);
}

.yok-card__header h3,
.yok-card__header p {
  margin: 0;
}

.yok-card__header h3 {
  font-size: 18px;
  letter-spacing: 0;
}

.yok-card__header p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-card__extra {
  flex: none;
}

.yok-card__body {
  padding: var(--yok-space-4);
}

.yok-card__footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid var(--yok-color-border);
  padding: var(--yok-space-3) var(--yok-space-4);
}
</style>
