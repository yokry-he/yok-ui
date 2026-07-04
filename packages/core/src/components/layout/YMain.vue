<script setup lang="ts">
defineOptions({
  name: 'YMain'
})

interface Props {
  padded?: boolean
  scrollable?: boolean
}

withDefaults(defineProps<Props>(), {
  padded: true,
  scrollable: false
})
</script>

<template>
  <main
    class="yok-layout-main"
    :class="{
      'yok-layout-main--unpadded': !padded,
      'yok-layout-main--scrollable': scrollable
    }"
  >
    <slot />
  </main>
</template>

<style scoped>
.yok-layout-main {
  box-sizing: border-box;
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  padding: var(--yok-space-5);
  background: var(--yok-color-background);
  color: var(--yok-color-text);
}

.yok-layout-main--unpadded {
  padding: 0;
}

.yok-layout-main--scrollable {
  overflow: auto;
}
</style>
