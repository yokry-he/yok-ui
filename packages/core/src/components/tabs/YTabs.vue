<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

defineOptions({
  name: 'YTabs'
})

export type YTabsActivationMode = 'auto' | 'manual'
export type YTabsOrientation = 'horizontal' | 'vertical'
export type YTabsSize = 'sm' | 'md' | 'lg'
export type YTabsVariant = 'line' | 'card' | 'segment'

export interface YTabItem {
  label: string
  value: string
  disabled?: boolean
  closable?: boolean
  badge?: string | number
  icon?: string
}

interface Props {
  modelValue: string
  tabs: YTabItem[]
  id?: string
  ariaLabel?: string
  activationMode?: YTabsActivationMode
  orientation?: YTabsOrientation
  size?: YTabsSize
  variant?: YTabsVariant
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  ariaLabel: 'Tabs',
  activationMode: 'auto',
  orientation: 'horizontal',
  size: 'md',
  variant: 'segment'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  tabClick: [tab: YTabItem]
  close: [value: string]
}>()

const generatedId = `yok-tabs-${Math.random().toString(36).slice(2, 8)}`
const rootId = computed(() => props.id || generatedId)
const enabledTabs = computed(() => props.tabs.filter((tab) => !tab.disabled))
const activeTab = computed(() =>
  props.tabs.find((tab) => tab.value === props.modelValue) ??
  enabledTabs.value[0] ??
  props.tabs[0]
)
const focusedValue = ref(activeTab.value?.value ?? '')
const panelId = computed(() => `${rootId.value}-panel`)
const activeTabId = computed(() => activeTab.value ? getTabId(activeTab.value.value) : undefined)
const tabButtonRefs = ref<Record<string, HTMLButtonElement | null>>({})
const tablistClasses = computed(() => [
  `yok-tabs__list--${props.orientation}`,
  `yok-tabs__list--${props.variant}`,
  `yok-tabs__list--${props.size}`
])

watch(
  () => props.modelValue,
  () => {
    focusedValue.value = activeTab.value?.value ?? ''
  }
)

function getTabId(value: string) {
  return `${rootId.value}-tab-${value}`
}

function isActive(tab: YTabItem) {
  return activeTab.value?.value === tab.value
}

function isFocusable(tab: YTabItem) {
  if (tab.disabled) {
    return false
  }

  if (focusedValue.value) {
    return focusedValue.value === tab.value
  }

  return isActive(tab)
}

function setTabButtonRef(value: string, element: HTMLButtonElement | null) {
  tabButtonRefs.value[value] = element
}

function activateTab(tab: YTabItem) {
  if (tab.disabled || props.modelValue === tab.value) {
    return
  }

  emit('update:modelValue', tab.value)
  emit('change', tab.value)
}

function handleTabClick(tab: YTabItem) {
  if (tab.disabled) {
    return
  }

  focusedValue.value = tab.value
  emit('tabClick', tab)
  activateTab(tab)
}

function getFocusedIndex() {
  const current = enabledTabs.value.findIndex((tab) => tab.value === focusedValue.value)

  if (current >= 0) {
    return current
  }

  const active = enabledTabs.value.findIndex((tab) => tab.value === activeTab.value?.value)

  return Math.max(active, 0)
}

async function focusTab(tab: YTabItem) {
  focusedValue.value = tab.value
  await nextTick()
  tabButtonRefs.value[tab.value]?.focus()

  if (props.activationMode === 'auto') {
    activateTab(tab)
  }
}

function getNextTab(key: string) {
  const tabs = enabledTabs.value

  if (!tabs.length) {
    return undefined
  }

  const currentIndex = getFocusedIndex()
  const lastIndex = tabs.length - 1

  if (key === 'Home') {
    return tabs[0]
  }

  if (key === 'End') {
    return tabs[lastIndex]
  }

  const isForward = props.orientation === 'vertical'
    ? key === 'ArrowDown'
    : key === 'ArrowRight'
  const isBackward = props.orientation === 'vertical'
    ? key === 'ArrowUp'
    : key === 'ArrowLeft'

  if (isForward) {
    return tabs[(currentIndex + 1) % tabs.length]
  }

  if (isBackward) {
    return tabs[(currentIndex - 1 + tabs.length) % tabs.length]
  }

  return undefined
}

function handleTabKeydown(event: KeyboardEvent, tab: YTabItem) {
  const nextTab = getNextTab(event.key)

  if (nextTab) {
    event.preventDefault()
    void focusTab(nextTab)
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && props.activationMode === 'manual') {
    event.preventDefault()
    activateTab(tab)
  }
}

function handleClose(event: MouseEvent, tab: YTabItem) {
  event.stopPropagation()
  emit('close', tab.value)
}
</script>

<template>
  <div
    class="yok-tabs"
    :class="[
      `yok-tabs--${orientation}`,
      `yok-tabs--${variant}`,
      `yok-tabs--${size}`
    ]"
  >
    <div
      class="yok-tabs__list"
      :class="tablistClasses"
      role="tablist"
      :aria-label="ariaLabel"
      :aria-orientation="orientation"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :ref="(element) => setTabButtonRef(tab.value, element as HTMLButtonElement | null)"
        class="yok-tabs__tab yok-focus-ring"
        :class="{ 'yok-tabs__tab--active': isActive(tab), 'yok-tabs__tab--closable': tab.closable }"
        type="button"
        role="tab"
        :data-tab-value="tab.value"
        :id="getTabId(tab.value)"
        :aria-selected="isActive(tab) ? 'true' : 'false'"
        :aria-controls="panelId"
        :tabindex="isFocusable(tab) ? 0 : -1"
        :disabled="tab.disabled"
        @click="handleTabClick(tab)"
        @keydown="handleTabKeydown($event, tab)"
      >
        <span v-if="tab.icon" class="yok-tabs__tab-icon" aria-hidden="true">{{ tab.icon }}</span>
        <span class="yok-tabs__tab-label">{{ tab.label }}</span>
        <span v-if="typeof tab.badge !== 'undefined'" class="yok-tabs__tab-badge">{{ tab.badge }}</span>
        <span
          v-if="tab.closable"
          class="yok-tabs__tab-close"
          role="button"
          tabindex="-1"
          :data-tab-close="tab.value"
          :aria-label="`Close ${tab.label}`"
          @click="handleClose($event, tab)"
        >
          ×
        </span>
      </button>
    </div>
    <div
      :id="panelId"
      class="yok-tabs__panel"
      role="tabpanel"
      tabindex="0"
      :aria-labelledby="activeTabId"
    >
      <slot :active="activeTab?.value ?? modelValue" :tab="activeTab" />
    </div>
  </div>
</template>

<style scoped>
.yok-tabs {
  display: grid;
  gap: var(--yok-space-4);
}

.yok-tabs--vertical {
  grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
  align-items: start;
}

.yok-tabs__list {
  display: flex;
  gap: var(--yok-space-1);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
  padding: var(--yok-space-1);
}

.yok-tabs__list--horizontal {
  flex-wrap: wrap;
}

.yok-tabs__list--vertical {
  flex-direction: column;
}

.yok-tabs__list--line {
  gap: 0;
  border-width: 0 0 1px;
  border-radius: 0;
  background: transparent;
  padding: 0;
}

.yok-tabs__list--card {
  background: transparent;
}

.yok-tabs__tab {
  display: inline-flex;
  min-width: 0;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-weight: 650;
  padding: 0 var(--yok-space-3);
  transition:
    background var(--yok-motion-fast),
    color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-tabs--sm .yok-tabs__tab {
  min-height: 32px;
  padding-inline: var(--yok-space-2);
  font-size: 13px;
}

.yok-tabs--lg .yok-tabs__tab {
  min-height: 42px;
  padding-inline: var(--yok-space-4);
  font-size: 15px;
}

.yok-tabs__tab--active {
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  box-shadow: var(--yok-shadow-soft);
}

.yok-tabs--line .yok-tabs__tab {
  border-radius: 0;
  box-shadow: inset 0 -2px transparent;
}

.yok-tabs--line .yok-tabs__tab--active {
  background: transparent;
  color: var(--yok-color-primary);
  box-shadow: inset 0 -2px var(--yok-color-primary);
}

.yok-tabs--card .yok-tabs__tab {
  border: 1px solid var(--yok-color-border);
  background: var(--yok-color-surfaceMuted);
}

.yok-tabs--card .yok-tabs__tab--active {
  border-color: color-mix(in srgb, var(--yok-color-primary) 35%, var(--yok-color-border));
  background: var(--yok-color-surface);
}

.yok-tabs__tab:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.yok-tabs__tab-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-tabs__tab-icon,
.yok-tabs__tab-close {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  line-height: 1;
}

.yok-tabs__tab-badge {
  min-width: 20px;
  border-radius: var(--yok-radius-pill);
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  padding: 4px 6px;
}

.yok-tabs__tab-close {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  color: var(--yok-color-textMuted);
}

.yok-tabs__tab-close:hover {
  background: color-mix(in srgb, var(--yok-color-danger) 12%, transparent);
  color: var(--yok-color-danger);
}

.yok-tabs__panel {
  min-width: 0;
  border-radius: var(--yok-radius-md);
}

@media (max-width: 720px) {
  .yok-tabs--vertical {
    grid-template-columns: 1fr;
  }
}
</style>
