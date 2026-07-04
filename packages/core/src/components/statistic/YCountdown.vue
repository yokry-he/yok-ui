<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'YCountdown'
})

export type YCountdownTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
export type YCountdownValue = string | number | Date

interface Props {
  title?: string
  value: YCountdownValue
  format?: string
  prefix?: string
  suffix?: string
  running?: boolean
  tone?: YCountdownTone
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  format: 'HH:mm:ss',
  prefix: '',
  suffix: '',
  running: true,
  tone: 'neutral',
  ariaLabel: ''
})

const emit = defineEmits<{
  change: [remaining: number]
  finish: []
}>()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined
let finished = false

const accessibleName = computed(() => props.ariaLabel || props.title || 'Countdown')

const targetTime = computed(() => {
  if (props.value instanceof Date) {
    return props.value.getTime()
  }

  if (typeof props.value === 'number') {
    return props.value
  }

  const parsed = Date.parse(props.value)

  return Number.isFinite(parsed) ? parsed : Date.now()
})

const remaining = computed(() => Math.max(0, targetTime.value - now.value))

const formattedValue = computed(() => formatDuration(remaining.value, props.format))

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatDuration(milliseconds: number, format: string) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hoursTotal = Math.floor(totalSeconds / 3600)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return format
    .replace(/DD/g, pad(days))
    .replace(/HH/g, pad(format.includes('DD') ? hours : hoursTotal))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds))
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
}

function tick() {
  now.value = Date.now()
  emit('change', remaining.value)

  if (remaining.value <= 0 && !finished) {
    finished = true
    stopTimer()
    emit('finish')
  }
}

function startTimer() {
  stopTimer()

  if (!props.running || remaining.value <= 0) {
    return
  }

  timer = setInterval(tick, 1000)
}

watch(
  () => [props.value, props.running] as const,
  () => {
    finished = false
    now.value = Date.now()
    startTimer()
  }
)

onMounted(startTimer)
onBeforeUnmount(stopTimer)
</script>

<template>
  <section
    class="yok-countdown"
    :class="[`yok-countdown--${tone}`, { 'is-finished': remaining <= 0 }]"
    role="timer"
    :aria-label="accessibleName"
  >
    <header v-if="title || $slots.title || $slots.extra" class="yok-countdown__header">
      <div class="yok-countdown__title">
        <slot name="title">
          <span v-if="title">{{ title }}</span>
        </slot>
      </div>
      <div v-if="$slots.extra" class="yok-countdown__extra">
        <slot name="extra" />
      </div>
    </header>

    <div class="yok-countdown__content" aria-live="polite">
      <span v-if="prefix || $slots.prefix" class="yok-countdown__prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <strong class="yok-countdown__value">
        <slot name="value" :remaining="remaining" :formatted-value="formattedValue">
          {{ formattedValue }}
        </slot>
      </strong>
      <span v-if="suffix || $slots.suffix" class="yok-countdown__suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </section>
</template>

<style scoped>
.yok-countdown {
  --yok-countdown-accent: var(--yok-color-text);
  --yok-countdown-soft: color-mix(in srgb, var(--yok-countdown-accent) 8%, var(--yok-color-surface));

  display: grid;
  gap: var(--yok-space-2);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-countdown__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-countdown__title {
  min-width: 0;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
}

.yok-countdown__extra {
  flex: none;
}

.yok-countdown__content {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-countdown__value {
  min-width: 0;
  border-radius: var(--yok-radius-sm);
  background: var(--yok-countdown-soft);
  color: var(--yok-countdown-accent);
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  font-weight: 760;
  letter-spacing: 0;
  line-height: 1.15;
  overflow-wrap: anywhere;
  padding: 2px 8px;
}

.yok-countdown__prefix,
.yok-countdown__suffix {
  color: var(--yok-color-textMuted);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.yok-countdown--success {
  --yok-countdown-accent: var(--yok-color-success);
}

.yok-countdown--warning {
  --yok-countdown-accent: var(--yok-color-warning);
}

.yok-countdown--danger {
  --yok-countdown-accent: var(--yok-color-danger);
}

.yok-countdown--info {
  --yok-countdown-accent: var(--yok-color-primary);
}

.yok-countdown.is-finished {
  --yok-countdown-accent: var(--yok-color-textMuted);
}

@media (prefers-reduced-motion: reduce) {
  .yok-countdown__value {
    transition: none;
  }
}
</style>
