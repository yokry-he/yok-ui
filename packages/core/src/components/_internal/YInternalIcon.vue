<script setup lang="ts">
defineOptions({
  name: 'YInternalIcon'
})

export type YInternalIconName =
  | 'calendar'
  | 'check'
  | 'clock'
  | 'close'
  | 'error'
  | 'chevronDown'
  | 'chevronLeft'
  | 'chevronRight'
  | 'info'
  | 'minus'
  | 'plus'
  | 'warning'

const iconPaths: Record<YInternalIconName, string[]> = {
  calendar: ['M7 3v4', 'M17 3v4', 'M4 9h16', 'M5 5h14v16H5z'],
  check: ['M20 6 9 17l-5-5'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  close: ['M18 6 6 18', 'M6 6l12 12'],
  error: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M15 9l-6 6', 'M9 9l6 6'],
  chevronDown: ['M6 9l6 6 6-6'],
  chevronLeft: ['M15 18l-6-6 6-6'],
  chevronRight: ['M9 18l6-6-6-6'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16v-4', 'M12 8h.01'],
  minus: ['M5 12h14'],
  plus: ['M12 5v14', 'M5 12h14'],
  warning: ['M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', 'M12 9v4', 'M12 17h.01']
}

defineProps<{
  name: YInternalIconName
}>()
</script>

<template>
  <svg
    class="yok-internal-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-for="path in iconPaths[name]"
      :key="path"
      :d="path"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
</template>

<style scoped>
.yok-internal-icon {
  display: block;
  flex: 0 0 1em;
  width: 1em;
  height: 1em;
  pointer-events: none;
}
</style>
