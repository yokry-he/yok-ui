<script setup lang="ts">
import { computed } from 'vue'
import { YBadge } from '@yok-ui/core'

defineOptions({
  name: 'YSavedViews'
})

export interface YSavedViewItem {
  label: string
  value: string
  description?: string
  count?: number
  pinned?: boolean
  disabled?: boolean
}

interface Props {
  modelValue: string
  items: YSavedViewItem[]
  title?: string
  description?: string
  ariaLabel?: string
  createText?: string
  saveText?: string
  manageText?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Saved views',
  description: '',
  ariaLabel: 'Saved views',
  createText: 'Create view',
  saveText: 'Save current',
  manageText: 'Manage views',
  emptyText: 'No saved views yet'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [item: YSavedViewItem]
  create: []
  save: []
  manage: []
}>()

const pinnedItems = computed(() => props.items.filter((item) => item.pinned))
const regularItems = computed(() => props.items.filter((item) => !item.pinned))
const hasPinnedItems = computed(() => pinnedItems.value.length > 0)

function selectView(item: YSavedViewItem) {
  if (item.disabled) {
    return
  }

  emit('update:modelValue', item.value)
  emit('change', item)
}
</script>

<template>
  <section class="yok-saved-views" :aria-label="ariaLabel">
    <header class="yok-saved-views__header">
      <div class="yok-saved-views__copy">
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <button class="yok-saved-views__save yok-focus-ring" type="button" @click="$emit('save')">
        {{ saveText }}
      </button>
    </header>

    <div v-if="items.length" class="yok-saved-views__groups">
      <div v-if="hasPinnedItems" class="yok-saved-views__group">
        <span class="yok-saved-views__group-label">Pinned</span>
        <button
          v-for="item in pinnedItems"
          :key="item.value"
          class="yok-saved-views__item yok-focus-ring"
          :class="{ 'is-active': item.value === modelValue }"
          type="button"
          :aria-pressed="item.value === modelValue ? 'true' : 'false'"
          :disabled="item.disabled"
          @click="selectView(item)"
        >
          <span class="yok-saved-views__item-main">
            <strong>{{ item.label }}</strong>
            <small v-if="item.description">{{ item.description }}</small>
          </span>
          <YBadge v-if="typeof item.count === 'number'" :value="item.count" />
        </button>
      </div>

      <div class="yok-saved-views__group">
        <span v-if="hasPinnedItems" class="yok-saved-views__group-label">All views</span>
        <button
          v-for="item in regularItems"
          :key="item.value"
          class="yok-saved-views__item yok-focus-ring"
          :class="{ 'is-active': item.value === modelValue }"
          type="button"
          :aria-pressed="item.value === modelValue ? 'true' : 'false'"
          :disabled="item.disabled"
          @click="selectView(item)"
        >
          <span class="yok-saved-views__item-main">
            <strong>{{ item.label }}</strong>
            <small v-if="item.description">{{ item.description }}</small>
          </span>
          <YBadge v-if="typeof item.count === 'number'" :value="item.count" />
        </button>
      </div>
    </div>

    <p v-else class="yok-saved-views__empty" role="status">{{ emptyText }}</p>

    <footer class="yok-saved-views__footer">
      <button class="yok-saved-views__link yok-focus-ring" type="button" @click="$emit('create')">
        {{ createText }}
      </button>
      <button class="yok-saved-views__link yok-focus-ring" type="button" @click="$emit('manage')">
        {{ manageText }}
      </button>
    </footer>
  </section>
</template>

<style scoped>
.yok-saved-views {
  display: grid;
  gap: var(--yok-space-3);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-saved-views__header,
.yok-saved-views__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
}

.yok-saved-views__copy {
  min-width: 0;
}

.yok-saved-views h3,
.yok-saved-views p {
  margin: 0;
}

.yok-saved-views h3 {
  font-size: 16px;
  line-height: 1.35;
  letter-spacing: 0;
}

.yok-saved-views__copy p,
.yok-saved-views__empty {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  line-height: 1.6;
}

.yok-saved-views__save,
.yok-saved-views__link {
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-primary);
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0;
  cursor: pointer;
}

.yok-saved-views__save {
  flex: none;
  background: color-mix(in srgb, var(--yok-color-primary), transparent 90%);
  padding: 7px var(--yok-space-2);
}

.yok-saved-views__link {
  padding: 5px 0;
}

.yok-saved-views__groups,
.yok-saved-views__group {
  display: grid;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-saved-views__group-label {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.yok-saved-views__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  width: 100%;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-border), transparent 14%);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  padding: var(--yok-space-3);
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.yok-saved-views__item:hover:not(:disabled) {
  background: color-mix(in srgb, var(--yok-color-primary), transparent 94%);
}

.yok-saved-views__item.is-active {
  border-color: color-mix(in srgb, var(--yok-color-primary), white 58%);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--yok-color-primary), transparent 90%), transparent 56%),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-saved-views__item:active:not(:disabled) {
  transform: translateY(1px);
}

.yok-saved-views__item:disabled {
  cursor: not-allowed;
  opacity: 0.56;
}

.yok-saved-views__item-main {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.yok-saved-views__item-main strong,
.yok-saved-views__item-main small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-saved-views__item-main strong {
  font-size: 14px;
  line-height: 1.35;
}

.yok-saved-views__item-main small {
  color: var(--yok-color-textMuted);
  font-size: 12px;
  line-height: 1.4;
}

.yok-saved-views__empty {
  border: 1px dashed var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
  padding: var(--yok-space-4);
}

@media (max-width: 640px) {
  .yok-saved-views__header,
  .yok-saved-views__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-saved-views__save {
    width: fit-content;
  }
}
</style>
