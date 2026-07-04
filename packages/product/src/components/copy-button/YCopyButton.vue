<script setup lang="ts">
import { ref } from 'vue'
import { YButton } from '@yok-ui/core'

defineOptions({
  name: 'YCopyButton'
})

interface Props {
  text: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  copied: [text: string]
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  emit('copied', props.text)
}
</script>

<template>
  <YButton class="yok-copy-button" variant="secondary" size="sm" @click="copy">
    {{ copied ? 'Copied' : 'Copy' }}
  </YButton>
</template>

<style scoped>
.yok-copy-button {
  gap: var(--yok-space-2);
  border-radius: var(--yok-radius-md);
  transition:
    color var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    background var(--yok-motion-fast);
}
</style>
