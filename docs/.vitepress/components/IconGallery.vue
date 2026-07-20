<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getYokIconComponentName,
  getYokIconEntries,
  searchYokIcons,
  YokIcon,
  yokIconCategories,
  type YokIconCategory,
  type YokIconName
} from '@yok-ui/icons'

const query = ref('')
const activeCategory = ref<YokIconCategory | 'all'>('all')
const copiedName = ref<YokIconName | ''>('')

const categoryEntries = computed(() => Object.entries(yokIconCategories) as Array<[YokIconCategory, YokIconName[]]>)
const iconEntries = computed(() => getYokIconEntries())

const filteredIcons = computed(() => {
  return searchYokIcons(query.value, activeCategory.value)
})

async function copyImport(name: YokIconName) {
  const exportName = getYokIconComponentName(name)
  const text = `import { ${exportName} } from '@yok-ui/icons'`

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    copiedName.value = name
    window.setTimeout(() => {
      if (copiedName.value === name) {
        copiedName.value = ''
      }
    }, 1400)
  }
}
</script>

<template>
  <section class="icon-gallery" aria-label="Yok UI icon gallery">
    <div class="icon-gallery__toolbar">
      <label class="icon-gallery__search">
        <span>Search icons</span>
        <input v-model="query" type="search" placeholder="search, calendar, arrow..." />
      </label>

      <div class="icon-gallery__categories" aria-label="Icon categories">
        <button
          type="button"
          class="icon-gallery__category"
          :class="{ 'icon-gallery__category--active': activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          All
          <strong>{{ iconEntries.length }}</strong>
        </button>
        <button
          v-for="[category, names] in categoryEntries"
          :key="category"
          type="button"
          class="icon-gallery__category"
          :class="{ 'icon-gallery__category--active': activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
          <strong>{{ names.length }}</strong>
        </button>
      </div>
    </div>

    <div class="icon-gallery__grid">
      <button
        v-for="icon in filteredIcons"
        :key="icon.name"
        type="button"
        class="icon-gallery__item"
        @click="copyImport(icon.name)"
      >
        <YokIcon :name="icon.name" :title="icon.name" size="24" />
        <span>{{ icon.name }}</span>
        <code>{{ copiedName === icon.name ? 'copied' : getYokIconComponentName(icon.name) }}</code>
      </button>
    </div>
  </section>
</template>

<style scoped>
.icon-gallery {
  display: grid;
  gap: 18px;
}

.icon-gallery__toolbar {
  display: grid;
  gap: 14px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  padding: 16px;
}

.icon-gallery__search {
  display: grid;
  gap: 8px;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 800;
}

.icon-gallery__search input {
  width: 100%;
  min-height: 42px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
  font: inherit;
  font-size: 15px;
  padding: 0 12px;
}

.icon-gallery__search input:focus {
  border-color: var(--yok-color-primary);
  outline: 3px solid var(--yok-color-primarySoft);
}

.icon-gallery__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-gallery__category {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  padding: 0 10px;
}

.icon-gallery__category strong {
  color: var(--yok-color-primary);
  font-size: 12px;
}

.icon-gallery__category--active,
.icon-gallery__category:hover,
.icon-gallery__category:focus-visible {
  border-color: color-mix(in srgb, var(--yok-color-primary) 42%, var(--yok-color-border));
  background: var(--yok-color-primarySoft);
  outline: none;
}

.icon-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
  gap: 10px;
}

.icon-gallery__item {
  display: grid;
  min-width: 0;
  min-height: 118px;
  align-content: center;
  justify-items: center;
  gap: 8px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: color-mix(in srgb, var(--yok-color-surface) 92%, var(--yok-color-primarySoft));
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  padding: 14px 10px;
}

.icon-gallery__item:hover,
.icon-gallery__item:focus-visible {
  border-color: color-mix(in srgb, var(--yok-color-primary) 48%, var(--yok-color-border));
  outline: 3px solid var(--yok-color-primarySoft);
}

.icon-gallery__item span,
.icon-gallery__item code {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-gallery__item span {
  color: var(--yok-color-text);
  font-size: 13px;
  font-weight: 850;
}

.icon-gallery__item code {
  color: var(--yok-color-textMuted);
  font-size: 11px;
}
</style>
