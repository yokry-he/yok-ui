<script setup lang="ts">
defineProps<{
  snapshot: string
  copied: boolean
}>()

defineEmits<{
  'copy-preview-state': []
}>()
</script>

<template>
  <section class="live-example-runner__state-panel" aria-label="Preview state">
    <header>
      <div>
        <span>Preview state</span>
        <strong>modelValue</strong>
      </div>
      <button type="button" @click="$emit('copy-preview-state')">
        {{ copied ? '已复制状态' : '复制状态' }}
      </button>
    </header>
    <code>{{ snapshot }}</code>
  </section>
</template>
