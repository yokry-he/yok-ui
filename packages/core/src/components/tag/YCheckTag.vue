<script setup lang="ts">
import { computed } from 'vue'
import YInternalIcon from '../_internal/YInternalIcon.vue'
import { useYokConfig, type YokConfigSize } from '../config-provider'

defineOptions({
  name: 'YCheckTag'
})

export type YCheckTagTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

interface Props {
  checked?: boolean
  disabled?: boolean
  tone?: YCheckTagTone
  label?: string
  invalid?: boolean
  error?: string
  ariaDescribedby?: string
  size?: YokConfigSize
}

const props = withDefaults(defineProps<Props>(), {
  checked: false,
  disabled: false,
  tone: 'neutral',
  label: '',
  invalid: false,
  error: '',
  ariaDescribedby: ''
})

const emit = defineEmits<{
  'update:checked': [value: boolean]
  change: [value: boolean]
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const yokConfig = useYokConfig()
const resolvedSize = computed(() => props.size ?? yokConfig.size.value)
const hasInvalidState = computed(() => Boolean(props.invalid || props.error))

function toggleChecked(event: MouseEvent) {
  if (props.disabled) {
    return
  }

  const nextValue = !props.checked

  emit('update:checked', nextValue)
  emit('change', nextValue)
  emit('click', event)
}
</script>

<template>
  <span class="yok-check-tag-wrap">
    <button
      class="yok-check-tag yok-focus-ring"
      :class="[
        `yok-check-tag--${tone}`,
        `yok-check-tag--${resolvedSize}`,
        {
          'yok-check-tag--checked': checked,
          'yok-check-tag--disabled': disabled,
          'yok-check-tag--invalid': hasInvalidState
        }
      ]"
      type="button"
      :disabled="disabled"
      :aria-pressed="checked ? 'true' : 'false'"
      :aria-label="label || undefined"
      :aria-invalid="hasInvalidState ? 'true' : 'false'"
      :aria-describedby="ariaDescribedby || undefined"
      @click="toggleChecked"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
      <span class="yok-check-tag__indicator" aria-hidden="true">
        <YInternalIcon v-if="checked" name="check" />
      </span>
      <span class="yok-check-tag__content"><slot /></span>
    </button>
    <span v-if="error" class="yok-check-tag__error" role="alert">{{ error }}</span>
  </span>
</template>

<style scoped>
.yok-check-tag-wrap {
  display: inline-grid;
  gap: var(--yok-space-1);
  max-width: 100%;
}

.yok-check-tag {
  --yok-check-tag-color: var(--yok-color-textMuted);
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-1);
  min-height: 30px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-sm);
  background: var(--yok-color-surface);
  color: var(--yok-check-tag-color);
  cursor: pointer;
  padding: 0 var(--yok-space-3);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  transition:
    background var(--yok-motion-duration-fast) var(--yok-motion-ease),
    border-color var(--yok-motion-duration-fast) var(--yok-motion-ease),
    color var(--yok-motion-duration-fast) var(--yok-motion-ease),
    transform var(--yok-motion-duration-fast) var(--yok-motion-ease);
}

.yok-check-tag:hover {
  border-color: color-mix(in srgb, var(--yok-check-tag-color) 28%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-check-tag-color) 8%, var(--yok-color-surface));
}

.yok-check-tag--checked {
  border-color: color-mix(in srgb, var(--yok-check-tag-color) 45%, var(--yok-color-border));
  background: color-mix(in srgb, var(--yok-check-tag-color) 12%, var(--yok-color-surface));
  color: var(--yok-check-tag-color);
}

.yok-check-tag--checked:hover {
  transform: translateY(-1px);
}

.yok-check-tag--neutral {
  --yok-check-tag-color: var(--yok-color-text);
}

.yok-check-tag--success {
  --yok-check-tag-color: var(--yok-color-success);
}

.yok-check-tag--warning {
  --yok-check-tag-color: var(--yok-color-warning);
}

.yok-check-tag--danger {
  --yok-check-tag-color: var(--yok-color-danger);
}

.yok-check-tag--info {
  --yok-check-tag-color: var(--yok-color-primary);
}

.yok-check-tag--invalid {
  border-color: var(--yok-color-danger);
}

.yok-check-tag--disabled {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

.yok-check-tag__indicator {
  display: inline-grid;
  flex: 0 0 14px;
  width: 14px;
  height: 14px;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--yok-check-tag-color) 12%, transparent);
  font-size: 10px;
  line-height: 1;
}

.yok-check-tag__content {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-check-tag__error {
  display: block;
  color: var(--yok-color-danger);
  font-size: 12px;
  font-weight: 650;
}

.yok-check-tag--sm {
  min-height: 26px;
  padding: 0 var(--yok-space-2);
  font-size: 12px;
}

.yok-check-tag--lg {
  min-height: 36px;
  padding: 0 var(--yok-space-4);
  font-size: 14px;
}
</style>
