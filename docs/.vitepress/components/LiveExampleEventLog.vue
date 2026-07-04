<script setup lang="ts">
interface EventLogItem {
  id: number
  component: string
  event: string
  payload: string
  rawPayloads?: unknown[]
}

defineProps<{
  eventLogs: readonly EventLogItem[]
  copiedEventRepro: boolean
}>()

defineEmits<{
  'copy-event-repro': []
  'clear-event-log': []
}>()
</script>

<template>
  <section id="live-example-event-log" class="live-example-runner__event-log" aria-live="polite">
    <header>
      <div>
        <span>Event log</span>
        <strong>{{ eventLogs.length ? `${eventLogs.length} captured` : 'Waiting' }}</strong>
      </div>
      <nav class="live-example-runner__event-actions" aria-label="Event log actions">
        <button
          type="button"
          class="live-example-runner__event-repro-copy"
          :disabled="eventLogs.length === 0"
          @click="$emit('copy-event-repro')"
        >
          {{ copiedEventRepro ? '已复制复现' : '复制复现' }}
        </button>
        <button type="button" :disabled="eventLogs.length === 0" @click="$emit('clear-event-log')">清空</button>
      </nav>
    </header>
    <ol v-if="eventLogs.length">
      <li v-for="item in eventLogs" :key="item.id">
        <span>{{ item.component }}</span>
        <strong>@{{ item.event }}</strong>
        <code>{{ item.payload }}</code>
      </li>
    </ol>
    <p v-else>点击按钮、切换输入、选择菜单或触发组件事件后，会在这里看到最近 8 条事件。</p>
  </section>
</template>
