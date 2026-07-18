<script setup lang="ts">
type ApiSectionKey = 'props' | 'events' | 'slots' | 'methods' | 'types'

interface LiveExampleApiSectionItem {
  key: ApiSectionKey
  label: string
  total: number
  used: number
  status: 'covered' | 'partial' | 'empty'
  detail: string
  samples: Array<{
    name: string
    href: string
  }>
  href: string
}

interface LiveExampleApiMapSummary {
  total: number
  used: number
  sections: number
  score: number
  componentCount: number
}

defineProps<{
  summary: LiveExampleApiMapSummary
  items: LiveExampleApiSectionItem[]
  copied: boolean
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <section id="live-example-api-map" class="live-example-runner__api-map" aria-label="Live example API map">
    <header class="live-example-runner__api-map-header">
      <div>
        <span class="live-example-runner__api-map-eyebrow">API map</span>
        <strong>{{ summary.used }}/{{ summary.total }} API rows referenced</strong>
        <p>
          当前示例关联 {{ summary.componentCount }} 个组件、{{ summary.sections }} 个 API 分区；
          源码、场景和可复现证据会共用这份结构化数据。
        </p>
      </div>
      <button type="button" class="live-example-runner__api-map-copy" @click="emit('copy')">
        {{ copied ? '已复制 API 清单' : '复制 API 清单' }}
      </button>
    </header>
    <ul class="live-example-runner__api-map-grid">
      <li
        v-for="item in items"
        :key="item.key"
        class="live-example-runner__api-map-item"
        :data-status="item.status"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.used }}/{{ item.total }}</strong>
        <small>{{ item.detail }}</small>
        <div v-if="item.samples.length" class="live-example-runner__api-map-samples">
          <a v-for="sample in item.samples" :key="sample.name" :href="sample.href">
            {{ sample.name }}
          </a>
        </div>
        <em v-else>等待 API 数据</em>
        <a class="live-example-runner__api-map-link" :href="item.href">
          查看 {{ item.label }}
        </a>
      </li>
    </ul>
  </section>
</template>
