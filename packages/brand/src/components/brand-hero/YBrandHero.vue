<script setup lang="ts">
import { YButton, YTag } from '@yok-ui/core'

defineOptions({
  name: 'YBrandHero'
})

interface Props {
  eyebrow?: string
  title: string
  description?: string
  primaryText?: string
  secondaryText?: string
}

withDefaults(defineProps<Props>(), {
  eyebrow: '',
  description: '',
  primaryText: '',
  secondaryText: ''
})

defineEmits<{
  primary: []
  secondary: []
}>()
</script>

<template>
  <section class="yok-brand-hero">
    <div class="yok-brand-hero__copy">
      <YTag v-if="eyebrow" tone="info">{{ eyebrow }}</YTag>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
      <div v-if="primaryText || secondaryText || $slots.actions" class="yok-brand-hero__actions">
        <YButton v-if="primaryText" variant="primary" size="lg" @click="$emit('primary')">{{ primaryText }}</YButton>
        <YButton v-if="secondaryText" variant="secondary" size="lg" @click="$emit('secondary')">{{ secondaryText }}</YButton>
        <slot name="actions" />
      </div>
    </div>
    <div class="yok-brand-hero__visual" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  </section>
</template>

<style scoped>
.yok-brand-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  gap: var(--yok-space-6);
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-xl);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--yok-color-primarySoft) 72%, white 28%), transparent 58%),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  padding: clamp(28px, 5vw, 56px);
}

.yok-brand-hero__copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.yok-brand-hero h1,
.yok-brand-hero p {
  margin: 0;
}

.yok-brand-hero h1 {
  margin-top: var(--yok-space-4);
  color: var(--yok-color-text);
  font-size: clamp(42px, 8vw, 84px);
  line-height: 0.96;
  letter-spacing: 0;
}

.yok-brand-hero p {
  max-width: 680px;
  margin-top: var(--yok-space-5);
  color: var(--yok-color-textMuted);
  font-size: 18px;
  line-height: 1.8;
}

.yok-brand-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-3);
  margin-top: var(--yok-space-6);
}

.yok-brand-hero__visual {
  position: relative;
  min-height: 320px;
}

.yok-brand-hero__visual span {
  position: absolute;
  border: 1px solid var(--yok-color-border);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-brand-hero__visual span:nth-child(1) {
  inset: 36px 24px 36px 56px;
  border-radius: 34px;
  background: var(--yok-color-surface);
}

.yok-brand-hero__visual span:nth-child(2) {
  right: 8px;
  bottom: 22px;
  width: 46%;
  height: 36%;
  border-radius: 24px;
  background: var(--yok-color-primarySoft);
}

.yok-brand-hero__visual span:nth-child(3) {
  top: 18px;
  left: 18px;
  width: 34%;
  height: 28%;
  border-radius: 22px;
  background: var(--yok-color-accentYellow);
}

@media (max-width: 820px) {
  .yok-brand-hero {
    grid-template-columns: 1fr;
  }

  .yok-brand-hero__visual {
    min-height: 220px;
  }
}
</style>
