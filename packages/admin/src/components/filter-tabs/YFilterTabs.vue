<script setup lang="ts">
import { computed, nextTick, ref, type ComponentPublicInstance } from 'vue'

defineOptions({
  name: 'YFilterTabs'
})

export type YFilterTabTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export interface YFilterTabItem {
  label: string
  value: string
  count?: number
  tone?: YFilterTabTone
  disabled?: boolean
}

interface Props {
  modelValue: string
  items: YFilterTabItem[]
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Filter tabs'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [item: YFilterTabItem]
}>()

const tabRefs = ref<HTMLButtonElement[]>([])
const enabledItems = computed(() => props.items.filter((item) => !item.disabled))
const activeIndex = computed(() => {
  const index = props.items.findIndex((item) => item.value === props.modelValue)
  return index >= 0 ? index : props.items.findIndex((item) => !item.disabled)
})

function setTabRef(element: Element | ComponentPublicInstance | null, index: number) {
  if (element instanceof HTMLButtonElement) {
    tabRefs.value[index] = element
  }
}

function selectItem(item: YFilterTabItem) {
  if (item.disabled) {
    return
  }

  emit('update:modelValue', item.value)
  emit('change', item)
}

async function focusItem(index: number) {
  await nextTick()
  tabRefs.value[index]?.focus()
}

function moveFocus(direction: 1 | -1) {
  if (!enabledItems.value.length) {
    return
  }

  const currentIndex = activeIndex.value >= 0 ? activeIndex.value : 0
  let nextIndex = currentIndex

  for (let step = 0; step < props.items.length; step += 1) {
    nextIndex = (nextIndex + direction + props.items.length) % props.items.length
    const item = props.items[nextIndex]

    if (item && !item.disabled) {
      selectItem(item)
      void focusItem(nextIndex)
      return
    }
  }
}

function moveToEdge(edge: 'first' | 'last') {
  const index = edge === 'first'
    ? props.items.findIndex((item) => !item.disabled)
    : findLastEnabledIndex()
  const item = props.items[index]

  if (!item) {
    return
  }

  selectItem(item)
  void focusItem(index)
}

function findLastEnabledIndex() {
  for (let index = props.items.length - 1; index >= 0; index -= 1) {
    if (!props.items[index].disabled) {
      return index
    }
  }

  return -1
}
</script>

<template>
  <div class="yok-filter-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="(item, index) in items"
      :key="item.value"
      :ref="(element) => setTabRef(element, index)"
      class="yok-filter-tabs__item yok-focus-ring"
      :class="[
        `yok-filter-tabs__item--${item.tone ?? 'neutral'}`,
        { 'is-active': item.value === modelValue }
      ]"
      type="button"
      role="tab"
      :aria-selected="item.value === modelValue ? 'true' : 'false'"
      :tabindex="index === activeIndex ? 0 : -1"
      :disabled="item.disabled"
      @click="selectItem(item)"
      @keydown.left.prevent="moveFocus(-1)"
      @keydown.up.prevent="moveFocus(-1)"
      @keydown.right.prevent="moveFocus(1)"
      @keydown.down.prevent="moveFocus(1)"
      @keydown.home.prevent="moveToEdge('first')"
      @keydown.end.prevent="moveToEdge('last')"
    >
      <span class="yok-filter-tabs__label">{{ item.label }}</span>
      <span v-if="typeof item.count === 'number'" class="yok-filter-tabs__count">{{ item.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.yok-filter-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--yok-space-1);
  max-width: 100%;
  border: 1px solid color-mix(in srgb, var(--yok-color-border), transparent 20%);
  border-radius: var(--yok-radius-lg);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--yok-color-surface), white 8%), var(--yok-color-surfaceMuted)),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-1);
}

.yok-filter-tabs__item {
  --yok-filter-tab-accent: var(--yok-color-primary);
  --yok-filter-tab-soft: color-mix(in srgb, var(--yok-filter-tab-accent), transparent 88%);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  min-height: 36px;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: calc(var(--yok-radius-lg) - 2px);
  background: transparent;
  color: var(--yok-color-textMuted);
  font: inherit;
  font-weight: 650;
  letter-spacing: 0;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 var(--yok-space-3);
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.yok-filter-tabs__item:hover:not(:disabled) {
  background: var(--yok-filter-tab-soft);
  color: var(--yok-color-text);
}

.yok-filter-tabs__item.is-active {
  border-color: color-mix(in srgb, var(--yok-filter-tab-accent), white 64%);
  background: var(--yok-color-surface);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--yok-filter-tab-accent), transparent 88%);
  color: var(--yok-color-text);
}

.yok-filter-tabs__item:active:not(:disabled) {
  transform: translateY(1px);
}

.yok-filter-tabs__item:disabled {
  cursor: not-allowed;
  opacity: 0.52;
}

.yok-filter-tabs__item--success {
  --yok-filter-tab-accent: var(--yok-color-success);
}

.yok-filter-tabs__item--warning {
  --yok-filter-tab-accent: var(--yok-color-warning);
}

.yok-filter-tabs__item--danger {
  --yok-filter-tab-accent: var(--yok-color-danger);
}

.yok-filter-tabs__item--info {
  --yok-filter-tab-accent: var(--yok-color-info);
}

.yok-filter-tabs__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.yok-filter-tabs__count {
  min-width: 22px;
  border-radius: 999px;
  background: var(--yok-filter-tab-soft);
  color: var(--yok-filter-tab-accent);
  font-size: 12px;
  font-weight: 760;
  line-height: 1;
  padding: 5px 7px;
}

.yok-filter-tabs__item.is-active .yok-filter-tabs__count {
  background: color-mix(in srgb, var(--yok-filter-tab-accent), transparent 84%);
}

@media (max-width: 640px) {
  .yok-filter-tabs {
    display: flex;
    width: 100%;
  }

  .yok-filter-tabs__item {
    flex: 1 1 auto;
    padding-inline: var(--yok-space-2);
  }
}
</style>
