<script setup lang="ts">
defineOptions({
  name: 'YCodeBlock'
})

interface Props {
  code: string
  language?: string
}

withDefaults(defineProps<Props>(), {
  language: 'text'
})
</script>

<template>
  <figure class="yok-code-block">
    <figcaption class="yok-code-block__caption">{{ language }}</figcaption>
    <pre class="yok-code-block__pre"><code>{{ code }}</code></pre>
  </figure>
</template>

<style scoped>
.yok-code-block {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: #25302d;
  color: #f7fffb;
}

.yok-code-block__caption {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: var(--yok-space-2) var(--yok-space-3);
  color: #b9ded4;
  font-size: 12px;
}

.yok-code-block__pre {
  max-width: 100%;
  margin: 0;
  overflow: auto;
  padding: var(--yok-space-4);
}
</style>
