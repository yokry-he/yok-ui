<script setup lang="ts">
defineOptions({
  name: 'YBreadcrumb'
})

export interface YBreadcrumbItem {
  label: string
  href?: string
  current?: boolean
  disabled?: boolean
}

interface Props {
  items: YBreadcrumbItem[]
  separator?: string
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  separator: '/',
  ariaLabel: 'Breadcrumb'
})

const emit = defineEmits<{
  select: [item: YBreadcrumbItem]
}>()

function isCurrent(item: YBreadcrumbItem, index: number, items: YBreadcrumbItem[]) {
  return item.current || index === items.length - 1
}
</script>

<template>
  <nav class="yok-breadcrumb" :aria-label="ariaLabel">
    <ol class="yok-breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="yok-breadcrumb__item"
      >
        <a
          v-if="item.href && !item.disabled && !isCurrent(item, index, items)"
          class="yok-breadcrumb__link yok-focus-ring"
          :href="item.href"
          @click="emit('select', item)"
        >
          {{ item.label }}
        </a>
        <span
          v-else
          class="yok-breadcrumb__text"
          :class="{
            'yok-breadcrumb__text--current': isCurrent(item, index, items),
            'yok-breadcrumb__text--disabled': item.disabled
          }"
          :aria-current="isCurrent(item, index, items) ? 'page' : undefined"
          :aria-disabled="item.disabled ? 'true' : undefined"
        >
          {{ item.label }}
        </span>
        <span
          v-if="index < items.length - 1"
          class="yok-breadcrumb__separator"
          aria-hidden="true"
        >
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.yok-breadcrumb {
  min-width: 0;
  color: var(--yok-color-textMuted);
  font-size: 13px;
}

.yok-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-1);
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-1);
  min-width: 0;
}

.yok-breadcrumb__link,
.yok-breadcrumb__text {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  border-radius: var(--yok-radius-sm);
  color: inherit;
  font-weight: 650;
  line-height: 1.4;
  padding: 0 var(--yok-space-1);
  text-decoration: none;
}

.yok-breadcrumb__link {
  transition:
    background var(--yok-motion-fast),
    color var(--yok-motion-fast);
}

.yok-breadcrumb__link:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-breadcrumb__text--current {
  color: var(--yok-color-text);
}

.yok-breadcrumb__text--disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-breadcrumb__separator {
  color: color-mix(in srgb, var(--yok-color-textMuted) 62%, transparent);
  font-weight: 700;
  user-select: none;
}
</style>
