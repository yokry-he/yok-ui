<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YResult'
})

export type YResultStatus = 'success' | 'info' | 'warning' | 'danger' | '403' | '404' | '500'

interface Props {
  status?: YResultStatus
  title?: string
  subtitle?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'info',
  title: '',
  subtitle: '',
  ariaLabel: 'Result'
})

const statusMeta: Record<YResultStatus, { icon: string; title: string; subtitle: string; tone: 'success' | 'info' | 'warning' | 'danger' }> = {
  success: {
    icon: '✓',
    title: 'Success',
    subtitle: 'The operation has been completed.',
    tone: 'success'
  },
  info: {
    icon: 'i',
    title: 'Information',
    subtitle: 'There is something worth your attention.',
    tone: 'info'
  },
  warning: {
    icon: '!',
    title: 'Warning',
    subtitle: 'Please review the details before continuing.',
    tone: 'warning'
  },
  danger: {
    icon: '×',
    title: 'Something went wrong',
    subtitle: 'The operation could not be completed.',
    tone: 'danger'
  },
  '403': {
    icon: '403',
    title: '403',
    subtitle: 'You do not have permission to view this page.',
    tone: 'warning'
  },
  '404': {
    icon: '404',
    title: '404',
    subtitle: 'The page you are looking for does not exist.',
    tone: 'info'
  },
  '500': {
    icon: '500',
    title: '500',
    subtitle: 'The server is taking a tiny break. Please try again.',
    tone: 'danger'
  }
}

const meta = computed(() => statusMeta[props.status])
const displayTitle = computed(() => props.title || meta.value.title)
const displaySubtitle = computed(() => props.subtitle || meta.value.subtitle)
</script>

<template>
  <section
    class="yok-result"
    :class="`yok-result--${meta.tone}`"
    :aria-label="ariaLabel"
  >
    <div class="yok-result__icon" aria-hidden="true">
      <slot name="icon">
        {{ meta.icon }}
      </slot>
    </div>
    <div class="yok-result__content">
      <h3>{{ displayTitle }}</h3>
      <p v-if="displaySubtitle">{{ displaySubtitle }}</p>
      <div v-if="$slots.extra || $slots.default" class="yok-result__extra">
        <slot name="extra">
          <slot />
        </slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
.yok-result {
  --yok-result-accent: var(--yok-color-primary);
  --yok-result-soft: color-mix(in srgb, var(--yok-result-accent) 10%, var(--yok-color-surface));

  display: grid;
  justify-items: center;
  gap: var(--yok-space-4);
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-result-accent) 22%, var(--yok-color-border));
  border-radius: var(--yok-radius-xl);
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--yok-result-accent) 12%, transparent), transparent 36%),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  color: var(--yok-color-text);
  padding: var(--yok-space-6);
  text-align: center;
}

.yok-result__icon {
  display: grid;
  width: 68px;
  height: 68px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--yok-result-accent) 28%, var(--yok-color-border));
  border-radius: var(--yok-radius-xl);
  background: var(--yok-result-soft);
  color: var(--yok-result-accent);
  font-size: 28px;
  font-weight: 850;
  line-height: 1;
  box-shadow: 0 12px 28px color-mix(in srgb, var(--yok-result-accent) 12%, transparent);
}

.yok-result__content {
  display: grid;
  justify-items: center;
  gap: var(--yok-space-2);
  max-width: 560px;
  min-width: 0;
}

.yok-result h3,
.yok-result p {
  margin: 0;
}

.yok-result h3 {
  color: var(--yok-color-text);
  font-size: clamp(22px, 3vw, 30px);
  line-height: 1.18;
  letter-spacing: 0;
}

.yok-result p {
  color: var(--yok-color-textMuted);
  line-height: 1.7;
}

.yok-result__extra {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--yok-space-2);
  margin-top: var(--yok-space-2);
}

.yok-result--success {
  --yok-result-accent: var(--yok-color-success);
}

.yok-result--info {
  --yok-result-accent: var(--yok-color-primary);
}

.yok-result--warning {
  --yok-result-accent: var(--yok-color-warning);
}

.yok-result--danger {
  --yok-result-accent: var(--yok-color-danger);
}

@media (max-width: 640px) {
  .yok-result {
    padding: var(--yok-space-5) var(--yok-space-4);
  }

  .yok-result__icon {
    width: 58px;
    height: 58px;
    font-size: 24px;
  }
}
</style>
