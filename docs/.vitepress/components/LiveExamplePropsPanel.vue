<script setup lang="ts">
import { computed } from 'vue'

type LiveControlType = 'text' | 'number' | 'boolean' | 'select' | 'range'

interface LiveControlOption {
  label: string
  value: string
}

interface LiveControlField {
  key: string
  label: string
  type: LiveControlType
  defaultValue: string | number | boolean
  helper?: string
  min?: number
  max?: number
  step?: number
  options?: readonly LiveControlOption[]
}

interface Props {
  title: string
  description: string
  controls: readonly LiveControlField[]
  controlState: Record<string, string | number | boolean>
  copiedStateLink: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'copy-state-link': []
  'reset-controls': []
  'update-control': [payload: { control: LiveControlField, value: string | number | boolean }]
}>()

const hasPropControls = computed(() => props.controls.length > 0)

function readControlValue(control: LiveControlField, event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  return ['number', 'range'].includes(control.type) ? Number(target.value) : target.value
}

function updateControl(control: LiveControlField, event: Event) {
  emit('update-control', {
    control,
    value: readControlValue(control, event)
  })
}

function updateBooleanControl(control: LiveControlField, event: Event) {
  emit('update-control', {
    control,
    value: (event.target as HTMLInputElement).checked
  })
}
</script>

<template>
  <section
    class="live-example-runner__prop-panel"
    :class="{ 'live-example-runner__prop-panel--empty': !hasPropControls }"
    aria-label="Live example props panel"
  >
    <header>
      <div>
        <span>Props panel</span>
        <strong>{{ title }}</strong>
      </div>
      <nav v-if="hasPropControls" class="live-example-runner__prop-actions" aria-label="Props panel actions">
        <button type="button" class="live-example-runner__state-link-copy" @click="emit('copy-state-link')">
          {{ copiedStateLink ? '已复制状态链接' : '复制状态链接' }}
        </button>
        <button type="button" @click="emit('reset-controls')">重置属性</button>
      </nav>
    </header>
    <p>{{ description }}</p>
    <div v-if="hasPropControls" class="live-example-runner__controls">
      <label v-for="control in controls" :key="control.key" class="live-example-runner__control">
        <span>{{ control.label }}</span>
        <select
          v-if="control.type === 'select'"
          :value="controlState[control.key]"
          @change="updateControl(control, $event)"
        >
          <option
            v-for="option in control.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <input
          v-else-if="control.type === 'boolean'"
          type="checkbox"
          :checked="Boolean(controlState[control.key])"
          @change="updateBooleanControl(control, $event)"
        />
        <input
          v-else-if="control.type === 'number' || control.type === 'range'"
          :type="control.type === 'range' ? 'range' : 'number'"
          :min="control.min"
          :max="control.max"
          :step="control.step"
          :value="controlState[control.key]"
          @input="updateControl(control, $event)"
        />
        <input
          v-else
          type="text"
          :value="controlState[control.key]"
          @input="updateControl(control, $event)"
        />
        <small v-if="control.type === 'range'">{{ controlState[control.key] }}</small>
        <small v-else-if="control.helper">{{ control.helper }}</small>
      </label>
    </div>
  </section>
</template>
