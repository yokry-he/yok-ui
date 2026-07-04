<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'YAnchor'
})

export type YAnchorDirection = 'vertical' | 'horizontal'
export type YAnchorType = 'default' | 'underline'
export type YAnchorContainer = Window | HTMLElement | string

export interface YAnchorItem {
  title: string
  href: string
  disabled?: boolean
  children?: YAnchorItem[]
}

export interface YAnchorClickPayload {
  item: YAnchorItem
  event: MouseEvent
}

interface Props {
  items: YAnchorItem[]
  modelValue?: string
  container?: YAnchorContainer
  offset?: number
  bound?: number
  duration?: number
  marker?: boolean
  direction?: YAnchorDirection
  type?: YAnchorType
  selectScrollTop?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  container: undefined,
  offset: 0,
  bound: 15,
  duration: 300,
  marker: true,
  direction: 'vertical',
  type: 'default',
  selectScrollTop: false,
  ariaLabel: 'Anchor'
})

const emit = defineEmits<{
  'update:modelValue': [href: string]
  change: [href: string]
  click: [payload: YAnchorClickPayload]
}>()

const internalValue = ref('')
const scrollContainer = ref<Window | HTMLElement | null>(null)

const visibleItems = computed(() =>
  props.direction === 'horizontal'
    ? props.items.map((item) => ({ ...item, children: [] }))
    : props.items
)

const flatItems = computed(() => flattenItems(props.items))
const activeHref = computed(() => props.modelValue ?? internalValue.value)

function flattenItems(items: YAnchorItem[]): YAnchorItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenItems(item.children) : [])
  ])
}

function normalizeHash(href: string) {
  return href.startsWith('#') ? href.slice(1) : href
}

function getContainer() {
  if (typeof window === 'undefined') {
    return null
  }

  const { container } = props

  if (!container) {
    return window
  }

  if (typeof container === 'string') {
    return document.querySelector<HTMLElement>(container) ?? window
  }

  return container
}

function getScrollTop(container: Window | HTMLElement | null) {
  if (!container || typeof window === 'undefined') {
    return 0
  }

  return container === window
    ? window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    : (container as HTMLElement).scrollTop
}

function getTargetElement(href: string) {
  if (typeof document === 'undefined') {
    return null
  }

  return document.getElementById(normalizeHash(href))
}

function getTargetTop(target: HTMLElement) {
  return target.offsetTop
}

function setActive(href: string) {
  if (!href || href === activeHref.value) {
    return
  }

  internalValue.value = href
  emit('update:modelValue', href)
  emit('change', href)
}

function scrollTo(href: string) {
  const container = scrollContainer.value ?? getContainer()
  const target = getTargetElement(href)

  if (!container || !target) {
    setActive(href)
    return
  }

  const top = Math.max(getTargetTop(target) - props.offset, 0)
  const behavior = props.duration === 0 ? 'auto' : 'smooth'

  if (container === window) {
    window.scrollTo({ top, behavior })
  } else {
    ;(container as HTMLElement).scrollTo({ top, behavior })
  }

  setActive(href)
}

function handleLinkClick(item: YAnchorItem, event: MouseEvent) {
  event.preventDefault()

  if (item.disabled) {
    return
  }

  emit('click', { item, event })
  scrollTo(item.href)
}

function updateActiveFromScroll() {
  const scrollTop = getScrollTop(scrollContainer.value)
  const threshold = scrollTop + props.offset + props.bound
  const candidates = flatItems.value
    .filter((item) => !item.disabled)
    .map((item) => ({
      item,
      target: getTargetElement(item.href)
    }))
    .filter((entry): entry is { item: YAnchorItem; target: HTMLElement } => Boolean(entry.target))

  const selected = props.selectScrollTop && scrollTop <= props.bound
    ? candidates[0]
    : candidates
        .filter((entry) => getTargetTop(entry.target) <= threshold)
        .at(-1)

  if (selected) {
    setActive(selected.item.href)
  }
}

function removeScrollListener() {
  scrollContainer.value?.removeEventListener('scroll', updateActiveFromScroll)
}

function bindScrollListener() {
  removeScrollListener()
  scrollContainer.value = getContainer()
  scrollContainer.value?.addEventListener('scroll', updateActiveFromScroll, { passive: true })
}

watch(
  () => [props.container, props.offset, props.bound] as const,
  () => {
    nextTick(() => {
      bindScrollListener()
      updateActiveFromScroll()
    })
  }
)

onMounted(() => {
  bindScrollListener()
  updateActiveFromScroll()
})

onBeforeUnmount(() => {
  removeScrollListener()
})

defineExpose({
  scrollTo,
  update: updateActiveFromScroll
})
</script>

<template>
  <nav
    class="yok-anchor"
    :class="[
      `yok-anchor--${direction}`,
      `yok-anchor--${type}`,
      {
        'yok-anchor--marker-hidden': !marker
      }
    ]"
    :aria-label="ariaLabel"
  >
    <ul class="yok-anchor__list">
      <li v-for="item in visibleItems" :key="item.href" class="yok-anchor__item">
        <span
          v-if="item.disabled"
          class="yok-anchor__link yok-anchor__link--disabled"
          aria-disabled="true"
        >
          {{ item.title }}
        </span>
        <a
          v-else
          class="yok-anchor__link yok-focus-ring"
          :class="{ 'yok-anchor__link--active': activeHref === item.href }"
          :href="item.href"
          :aria-current="activeHref === item.href ? 'location' : undefined"
          @click="handleLinkClick(item, $event)"
        >
          {{ item.title }}
        </a>
        <ul
          v-if="direction === 'vertical' && item.children?.length"
          class="yok-anchor__sublist"
        >
          <li v-for="child in item.children" :key="child.href" class="yok-anchor__item yok-anchor__item--child">
            <span
              v-if="child.disabled"
              class="yok-anchor__link yok-anchor__link--disabled"
              aria-disabled="true"
            >
              {{ child.title }}
            </span>
            <a
              v-else
              class="yok-anchor__link yok-focus-ring"
              :class="{ 'yok-anchor__link--active': activeHref === child.href }"
              :href="child.href"
              :aria-current="activeHref === child.href ? 'location' : undefined"
              @click="handleLinkClick(child, $event)"
            >
              {{ child.title }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.yok-anchor {
  --yok-anchor-marker-width: 2px;

  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.45;
}

.yok-anchor__list,
.yok-anchor__sublist {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-anchor--vertical .yok-anchor__list,
.yok-anchor__sublist {
  flex-direction: column;
}

.yok-anchor--horizontal .yok-anchor__list {
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-anchor__item {
  min-width: 0;
}

.yok-anchor__sublist {
  margin-left: var(--yok-space-4);
}

.yok-anchor__link {
  position: relative;
  display: inline-flex;
  min-height: 30px;
  max-width: 100%;
  align-items: center;
  border-radius: var(--yok-radius-sm);
  color: inherit;
  font-weight: 650;
  padding: 0 var(--yok-space-2);
  text-decoration: none;
  transition:
    background var(--yok-motion-fast),
    color var(--yok-motion-fast);
}

.yok-anchor--vertical:not(.yok-anchor--marker-hidden) .yok-anchor__link {
  padding-left: var(--yok-space-3);
}

.yok-anchor--vertical:not(.yok-anchor--marker-hidden) .yok-anchor__link::before {
  position: absolute;
  top: 7px;
  bottom: 7px;
  left: 0;
  width: var(--yok-anchor-marker-width);
  border-radius: 999px;
  background: transparent;
  content: '';
}

.yok-anchor__link:hover {
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-anchor__link--active {
  color: var(--yok-color-primary);
}

.yok-anchor--vertical:not(.yok-anchor--marker-hidden) .yok-anchor__link--active::before {
  background: var(--yok-color-primary);
}

.yok-anchor--underline .yok-anchor__link--active {
  box-shadow: inset 0 -2px 0 var(--yok-color-primary);
}

.yok-anchor__link--disabled {
  cursor: not-allowed;
  opacity: 0.52;
}
</style>
