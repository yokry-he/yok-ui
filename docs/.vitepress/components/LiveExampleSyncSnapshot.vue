<script setup lang="ts">
interface SyncSnapshotSummaryItem {
  label: string
  value: string
  detail: string
}

interface ControlSnapshotItem {
  key: string
  label: string
  valueText: string
  defaultText: string
  changed: boolean
}

defineProps<{
  summaryItems: readonly SyncSnapshotSummaryItem[]
  controlItems: readonly ControlSnapshotItem[]
  hasPropControls: boolean
  changedControlCount: number
  copied: boolean
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <section id="live-example-sync-snapshot" class="live-example-runner__sync-snapshot" aria-label="Live example synchronized context">
    <header class="live-example-runner__sync-snapshot-header">
      <div>
        <span class="live-example-runner__sync-snapshot-eyebrow">Sync snapshot</span>
        <strong>属性、场景、源码和复现包保持同源</strong>
      </div>
      <button type="button" class="live-example-runner__sync-snapshot-copy" @click="emit('copy')">
        {{ copied ? '已复制快照' : '复制同步快照' }}
      </button>
    </header>
    <ul class="live-example-runner__sync-snapshot-grid">
      <li v-for="item in summaryItems" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.detail }}</small>
      </li>
    </ul>
    <div class="live-example-runner__sync-controls" aria-label="Current props diff">
      <header>
        <span>Props diff</span>
        <strong>{{ hasPropControls ? `${changedControlCount} changed` : 'Source first' }}</strong>
      </header>
      <ul v-if="hasPropControls">
        <li
          v-for="control in controlItems"
          :key="control.key"
          :data-changed="control.changed ? 'true' : 'false'"
        >
          <span>{{ control.label }}</span>
          <strong>{{ control.valueText }}</strong>
          <small>default {{ control.defaultText }}</small>
        </li>
      </ul>
      <p v-else>当前示例没有登记可视化 props 控件，Repro bundle 会以源码为主保存当前状态。</p>
    </div>
  </section>
</template>
