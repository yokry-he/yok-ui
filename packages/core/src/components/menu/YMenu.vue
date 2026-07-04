<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

defineOptions({
  name: 'YMenu'
})

export type YMenuMode = 'vertical' | 'horizontal'
export type YMenuKey = string

export interface YMenuItem {
  label: string
  value: YMenuKey
  icon?: string
  disabled?: boolean
  children?: YMenuItem[]
}

export interface YMenuSelectPayload {
  item: YMenuItem
  keyPath: YMenuKey[]
}

interface FlatMenuItem {
  item: YMenuItem
  keyPath: YMenuKey[]
  level: number
  type: 'item' | 'submenu'
}

interface Props {
  items: YMenuItem[]
  modelValue?: YMenuKey
  defaultOpenKeys?: YMenuKey[]
  mode?: YMenuMode
  collapsed?: boolean
  accordion?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultOpenKeys: () => [],
  mode: 'vertical',
  collapsed: false,
  accordion: false,
  ariaLabel: 'Menu'
})

const emit = defineEmits<{
  'update:modelValue': [value: YMenuKey]
  select: [payload: YMenuSelectPayload]
  'open-change': [openKeys: YMenuKey[]]
  open: [key: YMenuKey, keyPath: YMenuKey[], openKeys: YMenuKey[]]
  close: [key: YMenuKey, keyPath: YMenuKey[], openKeys: YMenuKey[]]
}>()

const internalActiveKey = ref<YMenuKey>(props.modelValue ?? '')
const openKeySet = ref(new Set(props.defaultOpenKeys))
const menuRoot = ref<HTMLElement | null>(null)

const isControlled = computed(() => props.modelValue !== undefined)
const activeKey = computed(() => (isControlled.value ? props.modelValue ?? '' : internalActiveKey.value))

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      internalActiveKey.value = value
    }
  }
)

watch(
  () => props.defaultOpenKeys,
  (value) => {
    openKeySet.value = new Set(value)
  }
)

const flatItems = computed(() => {
  const result: FlatMenuItem[] = []

  function collect(items: YMenuItem[], parentPath: YMenuKey[] = [], level = 1) {
    items.forEach((item) => {
      const keyPath = [...parentPath, item.value]
      const hasChildren = Boolean(item.children?.length)

      result.push({
        item,
        keyPath,
        level,
        type: hasChildren ? 'submenu' : 'item'
      })

      if (hasChildren && isOpen(item.value)) {
        collect(item.children ?? [], keyPath, level + 1)
      }
    })
  }

  collect(props.items)

  return result
})

function isOpen(value: YMenuKey) {
  return openKeySet.value.has(value)
}

function findItem(value: YMenuKey, items = props.items, parentPath: YMenuKey[] = []): YMenuSelectPayload | undefined {
  for (const item of items) {
    const keyPath = [...parentPath, item.value]

    if (item.value === value) {
      return { item, keyPath }
    }

    if (item.children?.length) {
      const child = findItem(value, item.children, keyPath)

      if (child) {
        return child
      }
    }
  }

  return undefined
}

function setOpenKeys(keys: YMenuKey[]) {
  openKeySet.value = new Set(keys)
  emit('open-change', keys)
}

function toggleSubmenu(item: YMenuItem, keyPath: YMenuKey[]) {
  if (item.disabled) {
    return
  }

  const next = new Set(openKeySet.value)
  const willClose = next.has(item.value)

  if (willClose) {
    next.delete(item.value)
  } else {
    if (props.accordion) {
      keyPath.slice(0, -1).forEach((key) => next.add(key))
      Array.from(next).forEach((key) => {
        if (!keyPath.includes(key)) {
          next.delete(key)
        }
      })
    }

    next.add(item.value)
  }

  const openKeys = Array.from(next)

  setOpenKeys(openKeys)

  if (willClose) {
    emit('close', item.value, keyPath, openKeys)
  } else {
    emit('open', item.value, keyPath, openKeys)
  }
}

function selectItem(item: YMenuItem, keyPath: YMenuKey[]) {
  if (item.disabled || item.children?.length) {
    return
  }

  if (!isControlled.value) {
    internalActiveKey.value = item.value
  }

  emit('update:modelValue', item.value)
  emit('select', { item, keyPath })
}

function getButtonSelector(value: YMenuKey) {
  return `[data-menu-value="${CSS.escape(value)}"], [data-menu-submenu="${CSS.escape(value)}"]`
}

function focusByIndex(index: number) {
  const enabledItems = flatItems.value.filter(({ item }) => !item.disabled)

  if (!enabledItems.length) {
    return
  }

  const normalizedIndex = (index + enabledItems.length) % enabledItems.length
  const target = enabledItems[normalizedIndex]

  nextTick(() => {
    const element = menuRoot.value?.querySelector<HTMLButtonElement>(getButtonSelector(target.item.value))
    element?.focus()
  })
}

function focusRelative(value: YMenuKey, offset: number) {
  const enabledItems = flatItems.value.filter(({ item }) => !item.disabled)
  const currentIndex = enabledItems.findIndex(({ item }) => item.value === value)

  focusByIndex(currentIndex + offset)
}

function handleKeydown(event: KeyboardEvent, item: YMenuItem, keyPath: YMenuKey[]) {
  const previousKey = props.mode === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = props.mode === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

  if (event.key === previousKey) {
    event.preventDefault()
    focusRelative(item.value, -1)
    return
  }

  if (event.key === nextKey) {
    event.preventDefault()
    focusRelative(item.value, 1)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    focusByIndex(0)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    focusByIndex(flatItems.value.length - 1)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    if (item.children?.length) {
      toggleSubmenu(item, keyPath)
    } else {
      selectItem(item, keyPath)
    }
  }
}
</script>

<template>
  <nav
    ref="menuRoot"
    class="yok-menu"
    :class="[
      `yok-menu--${mode}`,
      { 'yok-menu--collapsed': collapsed }
    ]"
    role="navigation"
    :aria-label="ariaLabel"
  >
    <ul class="yok-menu__list" role="menubar" :aria-orientation="mode">
      <template v-for="entry in flatItems" :key="entry.item.value">
        <li
          class="yok-menu__entry"
          :class="[
            `yok-menu__entry--level-${entry.level}`,
            { 'yok-menu__entry--child': entry.level > 1 }
          ]"
          role="none"
        >
          <button
            v-if="entry.type === 'submenu'"
            class="yok-menu__item yok-menu__submenu yok-focus-ring"
            type="button"
            role="menuitem"
            :data-menu-submenu="entry.item.value"
            :disabled="entry.item.disabled"
            :aria-expanded="isOpen(entry.item.value) ? 'true' : 'false'"
            :title="collapsed ? entry.item.label : undefined"
            :style="{ '--yok-menu-level': entry.level }"
            @click="toggleSubmenu(entry.item, entry.keyPath)"
            @keydown="handleKeydown($event, entry.item, entry.keyPath)"
          >
            <span v-if="entry.item.icon" class="yok-menu__icon" aria-hidden="true">{{ entry.item.icon }}</span>
            <span class="yok-menu__label">{{ entry.item.label }}</span>
            <span class="yok-menu__chevron" aria-hidden="true">⌄</span>
          </button>
          <button
            v-else
            class="yok-menu__item yok-focus-ring"
            :class="{ 'yok-menu__item--active': activeKey === entry.item.value }"
            type="button"
            role="menuitem"
            :data-menu-value="entry.item.value"
            :disabled="entry.item.disabled"
            :aria-current="activeKey === entry.item.value ? 'page' : undefined"
            :title="collapsed ? entry.item.label : undefined"
            :style="{ '--yok-menu-level': entry.level }"
            @click="selectItem(entry.item, entry.keyPath)"
            @keydown="handleKeydown($event, entry.item, entry.keyPath)"
          >
            <span v-if="entry.item.icon" class="yok-menu__icon" aria-hidden="true">{{ entry.item.icon }}</span>
            <span class="yok-menu__label">{{ entry.item.label }}</span>
          </button>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style scoped>
.yok-menu {
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-menu__list {
  display: grid;
  gap: var(--yok-space-1);
  min-width: 0;
  margin: 0;
  padding: var(--yok-space-1);
  list-style: none;
}

.yok-menu--horizontal .yok-menu__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
}

.yok-menu--vertical .yok-menu__list {
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
}

.yok-menu__entry {
  min-width: 0;
}

.yok-menu__item {
  display: grid;
  width: 100%;
  min-height: 38px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--yok-space-2);
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-weight: 750;
  padding: 0 var(--yok-space-3);
  padding-inline-start: calc(var(--yok-space-3) + (var(--yok-menu-level) - 1) * 18px);
  text-align: start;
  transition:
    background var(--yok-motion-fast),
    color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-menu--horizontal .yok-menu__item {
  width: auto;
  padding-inline-start: var(--yok-space-3);
}

.yok-menu__item:hover:not(:disabled),
.yok-menu__item--active {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-menu__item--active {
  box-shadow: inset 3px 0 0 var(--yok-color-primary);
}

.yok-menu--horizontal .yok-menu__item--active {
  box-shadow: inset 0 -3px 0 var(--yok-color-primary);
}

.yok-menu__item:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.yok-menu__icon {
  display: inline-grid;
  width: 1.35rem;
  height: 1.35rem;
  flex: 0 0 1.35rem;
  place-items: center;
}

.yok-menu__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-menu__chevron {
  transition: transform var(--yok-motion-fast);
}

.yok-menu__submenu[aria-expanded='true'] .yok-menu__chevron {
  transform: rotate(180deg);
}

.yok-menu__entry--child .yok-menu__item {
  min-height: 34px;
  font-size: 13px;
}

.yok-menu--collapsed {
  width: 4.25rem;
}

.yok-menu--collapsed .yok-menu__item {
  grid-template-columns: 1fr;
  justify-items: center;
  padding-inline: var(--yok-space-2);
}

.yok-menu--collapsed .yok-menu__label,
.yok-menu--collapsed .yok-menu__chevron {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 720px) {
  .yok-menu--horizontal .yok-menu__list {
    display: grid;
  }

  .yok-menu--horizontal .yok-menu__item {
    width: 100%;
  }
}
</style>
