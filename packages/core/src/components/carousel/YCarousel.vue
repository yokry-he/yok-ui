<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  name: 'YCarousel'
})

export type YCarouselDirection = 'horizontal' | 'vertical'
export type YCarouselArrow = 'always' | 'never'
export type YCarouselIndicatorPosition = 'inside' | 'outside' | 'none'

export interface YCarouselItem {
  title: string
  description?: string
  image?: string
  alt?: string
  meta?: string
  tone?: 'primary' | 'success' | 'warning' | 'danger'
}

export interface YCarouselChangePayload {
  current: number
  previous: number
  item: YCarouselItem
}

interface Props {
  items: YCarouselItem[]
  modelValue?: number
  ariaLabel?: string
  autoplay?: boolean
  interval?: number
  pauseOnHover?: boolean
  loop?: boolean
  direction?: YCarouselDirection
  arrow?: YCarouselArrow
  indicatorPosition?: YCarouselIndicatorPosition
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Carousel',
  autoplay: false,
  interval: 3000,
  pauseOnHover: true,
  loop: true,
  direction: 'horizontal',
  arrow: 'always',
  indicatorPosition: 'inside',
  height: '240px'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [payload: YCarouselChangePayload]
}>()

const internalActiveIndex = ref(0)
const isControlled = computed(() => props.modelValue !== undefined)
const activeIndex = computed(() => {
  if (props.items.length === 0) {
    return 0
  }

  const value = isControlled.value ? props.modelValue ?? 0 : internalActiveIndex.value

  return Math.min(Math.max(value, 0), props.items.length - 1)
})

const hasItems = computed(() => props.items.length > 0)
const showArrows = computed(() => props.arrow !== 'never' && props.items.length > 1)
const showIndicators = computed(() => props.indicatorPosition !== 'none' && props.items.length > 1)
const isAtStart = computed(() => activeIndex.value === 0)
const isAtEnd = computed(() => activeIndex.value === props.items.length - 1)

let autoplayTimer: number | undefined

function getWrappedIndex(index: number) {
  const length = props.items.length

  if (length === 0) {
    return 0
  }

  if (props.loop) {
    return (index + length) % length
  }

  return Math.min(Math.max(index, 0), length - 1)
}

function setActiveItem(index: number) {
  if (!hasItems.value) {
    return
  }

  const previous = activeIndex.value
  const current = getWrappedIndex(index)

  if (current === previous) {
    return
  }

  if (!isControlled.value) {
    internalActiveIndex.value = current
  }

  emit('update:modelValue', current)
  emit('change', {
    current,
    previous,
    item: props.items[current]
  })
}

function previous() {
  setActiveItem(activeIndex.value - 1)
}

function next() {
  setActiveItem(activeIndex.value + 1)
}

function handleKeydown(event: KeyboardEvent) {
  const previousKeys = props.direction === 'vertical' ? ['ArrowUp'] : ['ArrowLeft']
  const nextKeys = props.direction === 'vertical' ? ['ArrowDown'] : ['ArrowRight']

  if (previousKeys.includes(event.key)) {
    event.preventDefault()
    previous()
  }

  if (nextKeys.includes(event.key)) {
    event.preventDefault()
    next()
  }
}

function stopAutoplay() {
  if (autoplayTimer) {
    window.clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function startAutoplay() {
  stopAutoplay()

  if (!props.autoplay || props.items.length < 2) {
    return
  }

  autoplayTimer = window.setInterval(() => {
    next()
  }, Math.max(props.interval, 800))
}

function handlePointerEnter() {
  if (props.pauseOnHover) {
    stopAutoplay()
  }
}

function handlePointerLeave() {
  if (props.pauseOnHover) {
    startAutoplay()
  }
}

watch(
  () => [props.autoplay, props.interval, props.items.length, activeIndex.value, props.loop] as const,
  startAutoplay,
  { immediate: true }
)

watch(
  () => props.items.length,
  () => {
    internalActiveIndex.value = getWrappedIndex(internalActiveIndex.value)
  }
)

onBeforeUnmount(stopAutoplay)

defineExpose({
  activeIndex,
  next,
  previous,
  setActiveItem
})
</script>

<template>
  <section
    class="yok-carousel"
    :class="[
      `yok-carousel--${direction}`,
      `yok-carousel--indicators-${indicatorPosition}`
    ]"
    role="region"
    :aria-label="ariaLabel"
    :style="{ '--yok-carousel-height': height }"
    @mouseenter="handlePointerEnter"
    @mouseleave="handlePointerLeave"
  >
    <div
      class="yok-carousel__viewport yok-focus-ring"
      tabindex="0"
      aria-live="polite"
      @keydown="handleKeydown"
    >
      <div class="yok-carousel__track">
        <article
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          class="yok-carousel__slide"
          :class="{
            'yok-carousel__slide--active': index === activeIndex,
            [`yok-carousel__slide--${item.tone ?? 'primary'}`]: true
          }"
          role="group"
          aria-roledescription="slide"
          :aria-label="`Slide ${index + 1} of ${items.length}: ${item.title}`"
          :aria-hidden="index === activeIndex ? 'false' : 'true'"
          v-show="index === activeIndex"
        >
          <slot name="item" :item="item" :index="index" :active="index === activeIndex">
            <div class="yok-carousel__content">
              <span v-if="item.meta" class="yok-carousel__meta">{{ item.meta }}</span>
              <h3 class="yok-carousel__title">{{ item.title }}</h3>
              <p v-if="item.description" class="yok-carousel__description">{{ item.description }}</p>
            </div>
            <img
              v-if="item.image"
              class="yok-carousel__image"
              :src="item.image"
              :alt="item.alt ?? ''"
            >
          </slot>
        </article>
      </div>

      <template v-if="showArrows">
        <button
          class="yok-carousel__arrow yok-carousel__arrow--previous yok-focus-ring"
          type="button"
          data-carousel-action="previous"
          aria-label="Previous slide"
          :disabled="!loop && isAtStart"
          @click="previous"
        >
          ‹
        </button>
        <button
          class="yok-carousel__arrow yok-carousel__arrow--next yok-focus-ring"
          type="button"
          data-carousel-action="next"
          aria-label="Next slide"
          :disabled="!loop && isAtEnd"
          @click="next"
        >
          ›
        </button>
      </template>
    </div>

    <div
      v-if="showIndicators"
      class="yok-carousel__indicators"
      role="tablist"
      aria-label="Carousel slides"
    >
      <button
        v-for="(item, index) in items"
        :key="`indicator-${item.title}-${index}`"
        class="yok-carousel__indicator yok-focus-ring"
        :class="{ 'yok-carousel__indicator--active': index === activeIndex }"
        type="button"
        role="tab"
        :aria-selected="index === activeIndex ? 'true' : 'false'"
        :aria-current="index === activeIndex ? 'true' : undefined"
        :aria-label="`Go to slide ${index + 1}: ${item.title}`"
        @click="setActiveItem(index)"
      >
        <span class="yok-carousel__indicator-dot" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.yok-carousel {
  position: relative;
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-carousel__viewport {
  position: relative;
  overflow: hidden;
  min-height: var(--yok-carousel-height);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background:
    radial-gradient(circle at 16% 18%, color-mix(in srgb, var(--yok-color-primary) 12%, transparent), transparent 28%),
    linear-gradient(135deg, var(--yok-color-surface), var(--yok-color-bg-soft));
  box-shadow: var(--yok-shadow-sm);
}

.yok-carousel__track {
  min-height: var(--yok-carousel-height);
}

.yok-carousel__slide {
  min-height: var(--yok-carousel-height);
  padding: var(--yok-space-6);
}

.yok-carousel__slide--success {
  background: color-mix(in srgb, var(--yok-color-success) 9%, transparent);
}

.yok-carousel__slide--warning {
  background: color-mix(in srgb, var(--yok-color-warning) 10%, transparent);
}

.yok-carousel__slide--danger {
  background: color-mix(in srgb, var(--yok-color-danger) 9%, transparent);
}

.yok-carousel__content {
  display: grid;
  gap: var(--yok-space-3);
  max-width: 34rem;
}

.yok-carousel__meta {
  width: fit-content;
  border-radius: var(--yok-radius-full);
  padding: 0.2rem 0.58rem;
  background: color-mix(in srgb, var(--yok-color-primary) 12%, var(--yok-color-surface));
  color: var(--yok-color-primary);
  font-size: var(--yok-font-size-xs);
  font-weight: 750;
}

.yok-carousel__title {
  margin: 0;
  font-size: clamp(1.35rem, 2vw, 2.05rem);
  line-height: 1.14;
}

.yok-carousel__description {
  margin: 0;
  color: var(--yok-color-text-muted);
  font-size: var(--yok-font-size-md);
  line-height: 1.7;
}

.yok-carousel__image {
  position: absolute;
  right: var(--yok-space-6);
  bottom: var(--yok-space-6);
  width: min(34%, 15rem);
  max-height: calc(var(--yok-carousel-height) - var(--yok-space-8));
  object-fit: contain;
  border-radius: var(--yok-radius-md);
}

.yok-carousel__arrow {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-full);
  background: color-mix(in srgb, var(--yok-color-surface) 92%, transparent);
  color: var(--yok-color-text);
  cursor: pointer;
  transform: translateY(-50%);
  transition: border-color 160ms ease, color 160ms ease, transform 160ms ease;
}

.yok-carousel__arrow:hover:not(:disabled) {
  border-color: var(--yok-color-primary);
  color: var(--yok-color-primary);
}

.yok-carousel__arrow:disabled {
  cursor: not-allowed;
  opacity: 0.46;
}

.yok-carousel__arrow--previous {
  left: var(--yok-space-4);
}

.yok-carousel__arrow--next {
  right: var(--yok-space-4);
}

.yok-carousel__indicators {
  display: flex;
  justify-content: center;
  gap: var(--yok-space-2);
  padding: var(--yok-space-3) 0 0;
}

.yok-carousel--indicators-inside .yok-carousel__indicators {
  position: absolute;
  right: var(--yok-space-5);
  bottom: var(--yok-space-4);
  z-index: 2;
  padding: 0;
}

.yok-carousel__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  border: 0;
  border-radius: var(--yok-radius-full);
  background: transparent;
  cursor: pointer;
}

.yok-carousel__indicator-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--yok-radius-full);
  background: var(--yok-color-border-strong);
  transition: width 160ms ease, background 160ms ease;
}

.yok-carousel__indicator--active .yok-carousel__indicator-dot {
  width: 1.25rem;
  background: var(--yok-color-primary);
}

.yok-carousel--vertical .yok-carousel__indicators {
  top: 50%;
  right: var(--yok-space-4);
  bottom: auto;
  flex-direction: column;
  transform: translateY(-50%);
}

.yok-carousel--vertical .yok-carousel__indicator--active .yok-carousel__indicator-dot {
  width: 0.5rem;
  height: 1.25rem;
}

@media (max-width: 720px) {
  .yok-carousel__slide {
    padding: var(--yok-space-5);
  }

  .yok-carousel__title {
    font-size: 1.28rem;
  }

  .yok-carousel__description {
    font-size: var(--yok-font-size-sm);
  }

  .yok-carousel__image {
    position: static;
    width: 100%;
    max-height: 8rem;
    margin-top: var(--yok-space-4);
  }

  .yok-carousel__arrow {
    width: 2rem;
    height: 2rem;
  }
}
</style>
