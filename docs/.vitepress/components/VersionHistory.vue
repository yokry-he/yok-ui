<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getReleaseHistorySummary,
  type ReleaseHistoryFilter,
  type ReleaseHistoryItemType
} from '../data/releaseHistory'

const history = computed(() => getReleaseHistorySummary())
const selectedFilter = ref<ReleaseHistoryFilter['key']>('all')

const filteredEntries = computed(() =>
  history.value.entries.map((entry) => ({
    ...entry,
    items: selectedFilter.value === 'all'
      ? entry.items
      : entry.items.filter((item) => item.type === selectedFilter.value)
  }))
)

function selectFilter(filter: ReleaseHistoryFilter['key']) {
  selectedFilter.value = filter
}
</script>

<template>
  <section class="version-history" aria-label="Version history">
    <div class="version-history__hero docs-panel">
      <div>
        <p class="docs-eyebrow">version history</p>
        <h2>Changelog and release trace</h2>
        <p>
          版本记录按主流组件库 changelog 的方式组织：先看版本状态，再看变更类型，
          最后进入 package 作用域和证据链接。Yok UI 会把 Release Center 的候选结果同步到这里。
        </p>
      </div>
      <div class="version-history__filters" aria-label="Changelog filters">
        <button
          v-for="filter in history.filters"
          :key="filter.key"
          type="button"
          :class="{ active: selectedFilter === filter.key }"
          @click="selectFilter(filter.key)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <article
      v-for="entry in filteredEntries"
      :key="entry.version"
      class="version-history__entry docs-card"
    >
      <header class="version-history__entry-header">
        <div>
          <p class="docs-eyebrow">{{ entry.statusLabel }}</p>
          <h2>{{ entry.title }}</h2>
          <p>{{ entry.summary }}</p>
        </div>
        <strong>{{ entry.version }}</strong>
      </header>

      <div v-if="entry.items.length" class="version-history__items">
        <a
          v-for="item in entry.items"
          :key="`${entry.version}-${item.type}-${item.title}`"
          class="version-history__item"
          :data-type="item.type"
          :href="item.href"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.detail }}</small>
        </a>
      </div>
      <p v-else class="version-history__empty" role="status">
        当前版本没有匹配的 changelog 条目。
      </p>

      <div v-if="entry.packageSections.length" class="version-history__packages" aria-label="Package sections">
        <section
          v-for="releasePackage in entry.packageSections"
          :key="releasePackage.packageName"
          class="version-history__package"
        >
          <h3>{{ releasePackage.packageName }}</h3>
          <p>{{ releasePackage.packageLabel }}</p>
          <ul>
            <li v-for="component in releasePackage.items.slice(0, 5)" :key="component.name">
              <a :href="component.docs">{{ component.title }}</a>
              <span>{{ component.status }} -> Stable</span>
            </li>
          </ul>
        </section>
      </div>

      <nav class="version-history__evidence" aria-label="Version evidence links">
        <a v-for="link in entry.evidenceLinks" :key="link.href" :href="link.href">
          {{ link.label }}
        </a>
      </nav>
    </article>
  </section>
</template>
