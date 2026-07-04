<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YStatistic'
})

export type YStatisticTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
export type YStatisticValue = string | number | null | undefined
export type YStatisticFormatter = (value: YStatisticValue) => string | number

interface Props {
  title?: string
  value?: YStatisticValue
  prefix?: string
  suffix?: string
  precision?: number
  groupSeparator?: string
  decimalSeparator?: string
  formatter?: YStatisticFormatter
  loading?: boolean
  tone?: YStatisticTone
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  value: undefined,
  prefix: '',
  suffix: '',
  precision: undefined,
  groupSeparator: ',',
  decimalSeparator: '.',
  formatter: undefined,
  loading: false,
  tone: 'neutral',
  ariaLabel: ''
})

const accessibleName = computed(() => props.ariaLabel || props.title || 'Statistic')

const formattedValue = computed(() => {
  if (props.formatter) {
    return String(props.formatter(props.value))
  }

  if (props.value === null || props.value === undefined || props.value === '') {
    return '-'
  }

  const numericValue = typeof props.value === 'number' ? props.value : Number(props.value)

  if (!Number.isFinite(numericValue)) {
    return String(props.value)
  }

  const precision = typeof props.precision === 'number'
    ? Math.max(0, props.precision)
    : undefined
  const normalized = precision === undefined
    ? String(numericValue)
    : numericValue.toFixed(precision)
  const [integerPart = '', decimalPart] = normalized.split('.')
  const sign = integerPart.startsWith('-') ? '-' : ''
  const unsignedInteger = sign ? integerPart.slice(1) : integerPart
  const groupedInteger = unsignedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)

  return decimalPart === undefined
    ? `${sign}${groupedInteger}`
    : `${sign}${groupedInteger}${props.decimalSeparator}${decimalPart}`
})
</script>

<template>
  <section
    class="yok-statistic"
    :class="[`yok-statistic--${tone}`, { 'is-loading': loading }]"
    :aria-label="accessibleName"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <header v-if="title || $slots.title || $slots.extra" class="yok-statistic__header">
      <div class="yok-statistic__title">
        <slot name="title">
          <span v-if="title">{{ title }}</span>
        </slot>
      </div>
      <div v-if="$slots.extra" class="yok-statistic__extra">
        <slot name="extra" />
      </div>
    </header>

    <div v-if="loading" class="yok-statistic__loading" role="status" aria-live="polite">
      <span class="yok-statistic__skeleton yok-statistic__skeleton--value" />
      <span class="yok-statistic__skeleton yok-statistic__skeleton--unit" />
      <span class="yok-statistic__loading-text">Loading statistic</span>
    </div>

    <div v-else class="yok-statistic__content" aria-live="polite">
      <span v-if="prefix || $slots.prefix" class="yok-statistic__prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <strong class="yok-statistic__value">
        <slot name="value" :value="value" :formatted-value="formattedValue">
          {{ formattedValue }}
        </slot>
      </strong>
      <span v-if="suffix || $slots.suffix" class="yok-statistic__suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </section>
</template>

<style scoped>
.yok-statistic {
  --yok-statistic-accent: var(--yok-color-text);
  --yok-statistic-soft: color-mix(in srgb, var(--yok-statistic-accent) 10%, var(--yok-color-surface));

  display: grid;
  gap: var(--yok-space-2);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-statistic__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-statistic__title {
  min-width: 0;
  color: var(--yok-color-textMuted);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
}

.yok-statistic__extra {
  flex: none;
}

.yok-statistic__content,
.yok-statistic__loading {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--yok-space-2);
  min-width: 0;
}

.yok-statistic__value {
  min-width: 0;
  color: var(--yok-statistic-accent);
  font-size: 28px;
  font-weight: 760;
  letter-spacing: 0;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.yok-statistic__prefix,
.yok-statistic__suffix {
  color: var(--yok-color-textMuted);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.yok-statistic__loading {
  align-items: center;
  min-height: 32px;
}

.yok-statistic__skeleton {
  display: inline-block;
  height: 16px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--yok-statistic-soft),
    color-mix(in srgb, var(--yok-statistic-accent) 14%, var(--yok-color-surface)),
    var(--yok-statistic-soft)
  );
  background-size: 200% 100%;
  animation: yok-statistic-shimmer 1.4s ease-in-out infinite;
}

.yok-statistic__skeleton--value {
  width: min(160px, 54vw);
  height: 28px;
}

.yok-statistic__skeleton--unit {
  width: 48px;
}

.yok-statistic__loading-text {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.yok-statistic--success {
  --yok-statistic-accent: var(--yok-color-success);
}

.yok-statistic--warning {
  --yok-statistic-accent: var(--yok-color-warning);
}

.yok-statistic--danger {
  --yok-statistic-accent: var(--yok-color-danger);
}

.yok-statistic--info {
  --yok-statistic-accent: var(--yok-color-primary);
}

@keyframes yok-statistic-shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yok-statistic__skeleton {
    animation: none;
  }
}
</style>
