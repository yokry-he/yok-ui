<script setup lang="ts">
interface CollapseItem {
  label: string
  value: string
  content?: string
  disabled?: boolean
}

defineOptions({
  name: 'YCollapse'
})

const props = withDefaults(defineProps<{
  items: CollapseItem[]
  modelValue?: string[]
  accordion?: boolean
}>(), {
  modelValue: () => [],
  accordion: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

function isOpen(value: string) {
  return props.modelValue.includes(value)
}

function toggle(item: CollapseItem) {
  if (item.disabled) {
    return
  }

  const nextValue = isOpen(item.value)
    ? props.modelValue.filter((value) => value !== item.value)
    : props.accordion
      ? [item.value]
      : [...props.modelValue, item.value]

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<template>
  <div class="yok-collapse">
    <section v-for="item in items" :key="item.value" class="yok-collapse__item">
      <button
        class="yok-collapse__trigger yok-focus-ring"
        type="button"
        :disabled="item.disabled"
        :aria-expanded="isOpen(item.value)"
        :aria-controls="`yok-collapse-panel-${item.value}`"
        @click="toggle(item)"
      >
        <span>
          <slot :name="`label-${item.value}`" :item="item">{{ item.label }}</slot>
        </span>
        <span aria-hidden="true">{{ isOpen(item.value) ? '-' : '+' }}</span>
      </button>
      <div
        v-show="isOpen(item.value)"
        :id="`yok-collapse-panel-${item.value}`"
        class="yok-collapse__panel"
      >
        <slot :name="`panel-${item.value}`" :item="item">{{ item.content }}</slot>
      </div>
    </section>
  </div>
</template>

<style scoped>
.yok-collapse {
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
}

.yok-collapse__item + .yok-collapse__item {
  border-top: 1px solid var(--yok-color-border);
}

.yok-collapse__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  width: 100%;
  min-height: 48px;
  border: 0;
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  font: inherit;
  font-weight: 750;
  text-align: left;
  padding: 0 var(--yok-space-4);
}

.yok-collapse__trigger:disabled {
  cursor: not-allowed;
  opacity: 0.56;
}

.yok-collapse__panel {
  color: var(--yok-color-textMuted);
  line-height: 1.7;
  padding: 0 var(--yok-space-4) var(--yok-space-4);
}
</style>
