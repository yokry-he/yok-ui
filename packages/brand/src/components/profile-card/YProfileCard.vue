<script setup lang="ts">
import { YTag } from '@yok-ui/core'

defineOptions({
  name: 'YProfileCard'
})

interface Props {
  name: string
  role?: string
  bio?: string
  avatarText?: string
  tags?: string[]
}

withDefaults(defineProps<Props>(), {
  role: '',
  bio: '',
  avatarText: '',
  tags: () => []
})
</script>

<template>
  <article class="yok-profile-card">
    <div class="yok-profile-card__avatar" aria-hidden="true">{{ avatarText || name.slice(0, 1) }}</div>
    <div class="yok-profile-card__body">
      <h3>{{ name }}</h3>
      <p v-if="role" class="yok-profile-card__role">{{ role }}</p>
      <p v-if="bio" class="yok-profile-card__bio">{{ bio }}</p>
      <div v-if="tags.length" class="yok-profile-card__tags">
        <YTag v-for="tag in tags" :key="tag" tone="info">{{ tag }}</YTag>
      </div>
    </div>
  </article>
</template>

<style scoped>
.yok-profile-card {
  display: flex;
  gap: var(--yok-space-4);
  align-items: flex-start;
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-5);
}

.yok-profile-card__avatar {
  display: grid;
  flex: none;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 22px;
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
  font-size: 28px;
  font-weight: 900;
}

.yok-profile-card__body {
  min-width: 0;
}

.yok-profile-card h3,
.yok-profile-card p {
  margin: 0;
}

.yok-profile-card h3 {
  color: var(--yok-color-text);
  font-size: 22px;
  letter-spacing: 0;
}

.yok-profile-card__role {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-primary);
  font-weight: 750;
}

.yok-profile-card__bio {
  margin-top: var(--yok-space-3);
  color: var(--yok-color-textMuted);
  line-height: 1.7;
}

.yok-profile-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  margin-top: var(--yok-space-4);
}
</style>
