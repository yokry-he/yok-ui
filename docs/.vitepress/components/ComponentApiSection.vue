<script setup lang="ts">
import { computed } from 'vue'
import { componentApis } from '../data/componentRegistry'
import ApiTable from './ApiTable.vue'

type ApiKind = 'props' | 'events' | 'slots' | 'methods' | 'types'

const props = defineProps<{
  name?: string
  names?: string[]
}>()

const apiKinds: ApiKind[] = ['props', 'events', 'slots', 'methods', 'types']

const componentNames = computed(() => {
  if (props.names?.length) {
    return props.names
  }

  return props.name ? [props.name] : []
})

const sections = computed(() =>
  componentNames.value.map((name) => ({
    name,
    api: componentApis[name]
  }))
)
const hasSingleSection = computed(() => sections.value.length === 1)

function toKebab(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '').toLowerCase()
}

function getApiAnchorId(componentName: string, kind: ApiKind) {
  return `api-${toKebab(componentName)}-${kind}`
}

function getApiAliases(kind: ApiKind) {
  return hasSingleSection.value ? [`api-${kind}`] : []
}

function hasRows(name: string, kind: ApiKind) {
  return Boolean(componentApis[name]?.[kind]?.length)
}
</script>

<template>
  <section class="component-api-section" aria-label="Component API sections">
    <div
      v-for="section in sections"
      :key="section.name"
      class="component-api-section__item"
    >
      <h3 v-if="sections.length > 1" class="component-api-section__title">
        {{ section.name }}
      </h3>

      <template v-if="section.api">
        <ApiTable
          v-for="kind in apiKinds"
          v-show="hasRows(section.name, kind)"
          :key="kind"
          :rows="section.api[kind]"
          :kind="kind"
          :anchor-id="getApiAnchorId(section.name, kind)"
          :aliases="getApiAliases(kind)"
        />
      </template>

      <div v-else class="component-api-section__missing" role="status">
        <strong class="component-api-section__missing-title">{{ section.name }} API 未登记</strong>
        <span class="component-api-section__missing-text">请先在 componentRegistry.ts 的 componentApis 中补充结构化数据。</span>
      </div>
    </div>
  </section>
</template>
