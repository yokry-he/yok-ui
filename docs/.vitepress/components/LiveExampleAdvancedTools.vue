<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface SummaryItem {
  label: string
  value: string
}

const props = defineProps<{
  summary: string
  description: string
  targetHashes: readonly string[]
  meta: readonly SummaryItem[]
}>()

const normalizedTargetHashes = computed(() => new Set(props.targetHashes.map((hash) => hash.trim()).filter(Boolean)))

function getNormalizedHash() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.hash.split('?')[0]
}

function syncOpenWithHash() {
  if (normalizedTargetHashes.value.has(getNormalizedHash())) {
    open.value = true
  }
}

const open = ref(normalizedTargetHashes.value.has(getNormalizedHash()))

function handleToggle(event: Event) {
  open.value = (event.currentTarget as HTMLDetailsElement).open
}

onMounted(() => {
  syncOpenWithHash()
  window.addEventListener('hashchange', syncOpenWithHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncOpenWithHash)
})
</script>

<template>
  <details class="live-example-runner__advanced-tools" :open="open" @toggle="handleToggle">
    <summary class="live-example-runner__advanced-tools-summary" aria-label="Toggle advanced live example evidence">
      <span class="live-example-runner__advanced-tools-copy">
        <span>Advanced evidence</span>
        <strong>{{ summary }}</strong>
        <small>{{ description }}</small>
      </span>
      <span class="live-example-runner__advanced-tools-meta" aria-label="Advanced evidence summary">
        <span v-for="item in meta" :key="item.label">
          <strong>{{ item.value }}</strong>
          <small>{{ item.label }}</small>
        </span>
      </span>
      <span class="live-example-runner__advanced-tools-chevron" aria-hidden="true"></span>
    </summary>
    <div class="live-example-runner__advanced-tools-body">
      <slot />
    </div>
  </details>
</template>
