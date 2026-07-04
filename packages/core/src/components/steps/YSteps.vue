<script setup lang="ts">
defineOptions({
  name: 'YSteps'
})

export type YStepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface YStepItem {
  title: string
  description?: string
  status?: YStepStatus
  disabled?: boolean
}

interface Props {
  items: YStepItem[]
  current?: number
  direction?: 'horizontal' | 'vertical'
  selectable?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  direction: 'horizontal',
  selectable: false,
  ariaLabel: 'Steps'
})

const emit = defineEmits<{
  select: [item: YStepItem, index: number]
}>()

function getStatus(item: YStepItem, index: number): YStepStatus {
  if (item.status) {
    return item.status
  }

  if (index < props.current) {
    return 'finish'
  }

  if (index === props.current) {
    return 'process'
  }

  return 'wait'
}

function handleSelect(item: YStepItem, index: number) {
  if (item.disabled) {
    return
  }

  emit('select', item, index)
}
</script>

<template>
  <nav class="yok-steps" :class="`yok-steps--${direction}`" :aria-label="ariaLabel">
    <ol class="yok-steps__list">
      <li
        v-for="(item, index) in items"
        :key="`${item.title}-${index}`"
        class="yok-steps__item"
        :class="[
          `yok-steps__item--${getStatus(item, index)}`,
          {
            'yok-steps__item--current': index === current,
            'yok-steps__item--disabled': item.disabled
          }
        ]"
      >
        <button
          v-if="selectable"
          class="yok-steps__content yok-focus-ring"
          type="button"
          :disabled="item.disabled"
          :aria-current="index === current ? 'step' : undefined"
          @click="handleSelect(item, index)"
        >
          <span class="yok-steps__marker" aria-hidden="true">
            <span v-if="getStatus(item, index) === 'finish'">✓</span>
            <span v-else-if="getStatus(item, index) === 'error'">!</span>
            <span v-else>{{ index + 1 }}</span>
          </span>
          <span class="yok-steps__copy">
            <span class="yok-steps__title">{{ item.title }}</span>
            <span v-if="item.description" class="yok-steps__description">{{ item.description }}</span>
          </span>
        </button>
        <span
          v-else
          class="yok-steps__content"
          :aria-current="index === current ? 'step' : undefined"
          :aria-disabled="item.disabled ? 'true' : undefined"
        >
          <span class="yok-steps__marker" aria-hidden="true">
            <span v-if="getStatus(item, index) === 'finish'">✓</span>
            <span v-else-if="getStatus(item, index) === 'error'">!</span>
            <span v-else>{{ index + 1 }}</span>
          </span>
          <span class="yok-steps__copy">
            <span class="yok-steps__title">{{ item.title }}</span>
            <span v-if="item.description" class="yok-steps__description">{{ item.description }}</span>
          </span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.yok-steps {
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-steps__list {
  display: grid;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-steps--horizontal .yok-steps__list {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.yok-steps--vertical .yok-steps__list {
  gap: var(--yok-space-4);
}

.yok-steps__item {
  position: relative;
  min-width: 0;
}

.yok-steps--horizontal .yok-steps__item:not(:last-child)::after {
  position: absolute;
  top: 15px;
  right: var(--yok-space-3);
  left: 42px;
  height: 2px;
  content: "";
  background: var(--yok-color-border);
}

.yok-steps--vertical .yok-steps__item:not(:last-child)::after {
  position: absolute;
  top: 36px;
  bottom: calc(var(--yok-space-4) * -1);
  left: 15px;
  width: 2px;
  content: "";
  background: var(--yok-color-border);
}

.yok-steps__content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--yok-space-3);
  align-items: flex-start;
  width: 100%;
  border: 0;
  border-radius: var(--yok-radius-lg);
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0 var(--yok-space-4) 0 0;
  text-align: left;
}

button.yok-steps__content {
  cursor: pointer;
}

button.yok-steps__content:hover:not(:disabled) .yok-steps__title {
  color: var(--yok-color-primary);
}

.yok-steps__marker {
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: 999px;
  background: var(--yok-color-surface);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 850;
  transition:
    background var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    color var(--yok-motion-fast);
}

.yok-steps__copy {
  display: grid;
  min-width: 0;
  gap: var(--yok-space-1);
  padding-top: 4px;
}

.yok-steps__title,
.yok-steps__description {
  min-width: 0;
}

.yok-steps__title {
  color: var(--yok-color-text);
  font-weight: 800;
  line-height: 1.35;
}

.yok-steps__description {
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.55;
}

.yok-steps__item--finish .yok-steps__marker {
  border-color: color-mix(in srgb, var(--yok-color-success) 42%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-success) 12%, var(--yok-color-surface));
  color: var(--yok-color-success);
}

.yok-steps__item--process .yok-steps__marker {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primary);
  color: #fff;
}

.yok-steps__item--error .yok-steps__marker {
  border-color: color-mix(in srgb, var(--yok-color-danger) 46%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-color-danger) 12%, var(--yok-color-surface));
  color: var(--yok-color-danger);
}

.yok-steps__item--disabled {
  opacity: 0.55;
}

.yok-steps__item--disabled .yok-steps__content {
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .yok-steps--horizontal .yok-steps__list {
    grid-template-columns: 1fr;
    gap: var(--yok-space-4);
  }

  .yok-steps--horizontal .yok-steps__item:not(:last-child)::after {
    top: 36px;
    bottom: calc(var(--yok-space-4) * -1);
    left: 15px;
    width: 2px;
    height: auto;
  }
}
</style>
