<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import {
  componentApis,
  type ApiRow,
  type ComponentApi
} from '../data/componentRegistry'
import {
  getComponentCoverageQueueItem,
  getComponentRouteContext
} from '../data/componentRouteContext'
import type { LiveExamplePreset, LiveExampleScenario } from '../data/liveExamples'
import { getPlaygroundComponentForPreset } from '../data/playgroundExamples'

type ApiKind = 'props' | 'events' | 'slots' | 'methods' | 'types'

interface ApiGroup {
  componentName: string
  sections: Array<{
    kind: ApiKind
    label: string
    href: string
    rows: Array<{
      name: string
      href: string
    }>
  }>
}

const route = useRoute()
const apiKinds: ApiKind[] = ['props', 'events', 'slots', 'methods', 'types']
const apiKindLabels: Record<ApiKind, string> = {
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  methods: 'Methods',
  types: 'Types'
}
const multiComponentApiRoutes: Record<string, string[]> = {
  '/components/code-block': ['YCodeBlock', 'YCopyButton'],
  '/components/tag-badge': ['YTag', 'YBadge']
}

const context = computed(() => getComponentRouteContext(route.path))
const coverageQueueItem = computed(() => getComponentCoverageQueueItem(route.path))
const shouldShow = computed(() => Boolean(context.value))
const componentNames = computed(() =>
  context.value
    ? multiComponentApiRoutes[context.value.component.docs] ?? [context.value.component.name]
    : []
)
const playgroundComponent = computed(() => {
  const preset = context.value?.liveProfile?.preset

  return preset ? getPlaygroundComponentForPreset(preset as LiveExamplePreset) : undefined
})
const apiReferenceLinks = computed(() => {
  if (!context.value) {
    return []
  }

  const componentName = context.value.component.name
  const createHref = (kind?: ApiKind) => {
    const params = new URLSearchParams()

    params.set('api-q', componentName)
    if (kind) {
      params.set('api-kind', kind)
    }

    return `/resources/api-reference?${params.toString()}`
  }

  return [
    {
      label: 'All API rows',
      href: createHref(),
      meta: componentName
    },
    ...apiKinds
      .filter((kind) => componentNames.value.some((name) => getApiRows(componentApis[name], kind).length > 0))
      .slice(0, 4)
      .map((kind) => ({
        label: apiKindLabels[kind],
        href: createHref(kind),
        meta: 'data center'
      }))
  ]
})

function normalizeAnchorToken(value: string) {
  return value
    .replace(/^@/, '')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function getSectionHref(componentName: string, kind: ApiKind) {
  return componentNames.value.length > 1
    ? `#api-${normalizeAnchorToken(componentName)}-${kind}`
    : `#api-${kind}`
}

function getApiRows(api: ComponentApi | undefined, kind: ApiKind): ApiRow[] {
  return api?.[kind] ?? []
}

const apiGroups = computed<ApiGroup[]>(() =>
  componentNames.value
    .map((componentName) => {
      const api = componentApis[componentName]
      const sections = apiKinds
        .map((kind) => {
          const rows = getApiRows(api, kind)
          const sectionHref = getSectionHref(componentName, kind)

          return {
            kind,
            label: apiKindLabels[kind],
            href: sectionHref,
            rows: rows.slice(0, 5).map((row) => ({
              name: row.name,
              href: `${sectionHref}-${normalizeAnchorToken(row.name)}`
            }))
          }
        })
        .filter((section) => section.rows.length > 0)

      return { componentName, sections }
    })
    .filter((group) => group.sections.length > 0)
)

const liveExampleLinks = computed(() => {
  if (!context.value?.liveProfile) {
    return []
  }

  return [
    { label: 'Live example', href: '#live-example', meta: `${context.value.liveProfile.capabilities.length} capabilities` },
    { label: 'Acceptance', href: '#live-example-acceptance', meta: context.value.liveProfile.scenarioDepth },
    { label: 'API map', href: '#live-example-api-map', meta: 'source linked' },
    ...(context.value.scenarios.length
      ? [{ label: 'Scenario matrix', href: '#live-example-scenarios', meta: `${context.value.scenarios.length} scenes` }]
      : []),
    { label: 'Interaction contract', href: '#live-example-interaction-contract', meta: context.value.interactionContract ? 'documented' : 'pending' }
  ]
})

const pageLinks = computed(() => {
  const links = [
    { label: 'API', href: '#api', meta: `${apiGroups.value.reduce((total, group) => total + group.sections.length, 0)} sections` },
    { label: 'Accessibility', href: '#accessibility', meta: context.value?.component.accessibility ?? 'a11y' }
  ]

  if (playgroundComponent.value) {
    links.push({
      label: 'Playground',
      href: `/playground/?component=${playgroundComponent.value}`,
      meta: 'route handoff'
    })
  }

  return links
})

const scenarioLinks = computed(() => (context.value?.scenarios ?? []).slice(0, 6))

function getScenarioHash(scenario: LiveExampleScenario) {
  return `#live-example?scenario=${encodeURIComponent(scenario.key)}`
}

function openScenario(scenario: LiveExampleScenario) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent('yok-ui:live-example-scenario', {
    detail: {
      preset: context.value?.liveProfile?.preset,
      scenarioKey: scenario.key
    }
  }))
}
</script>

<template>
  <nav v-if="shouldShow" class="component-page-toc" aria-label="Yok UI component page sections">
    <div class="component-page-toc__header">
      <span>Yok Contents</span>
      <strong>{{ context?.component.title }}</strong>
    </div>

    <div v-if="liveExampleLinks.length" class="component-page-toc__group">
      <p>Live example</p>
      <a
        v-for="link in liveExampleLinks"
        :key="link.href"
        :href="link.href"
        class="component-page-toc__link"
      >
        <span>{{ link.label }}</span>
        <em>{{ link.meta }}</em>
      </a>
    </div>

    <div v-if="coverageQueueItem" class="component-page-toc__group component-page-toc__group--maintenance">
      <p>Maintenance</p>
      <a
        class="component-page-toc__link component-page-toc__link--maintenance"
        :data-priority="coverageQueueItem.priority"
        :href="coverageQueueItem.targetHref"
      >
        <span>{{ coverageQueueItem.actionLabel }}</span>
        <em>{{ coverageQueueItem.priority }} · {{ coverageQueueItem.score }}%</em>
      </a>
      <div class="component-page-toc__maintenance-steps">
        <a
          v-for="step in coverageQueueItem.checklist.slice(0, 3)"
          :key="step.href"
          :href="step.href"
        >
          {{ step.label }}
        </a>
      </div>
    </div>

    <div class="component-page-toc__group">
      <p>Page sections</p>
      <a
        v-for="link in pageLinks"
        :key="link.href"
        :href="link.href"
        class="component-page-toc__link"
      >
        <span>{{ link.label }}</span>
        <em>{{ link.meta }}</em>
      </a>
    </div>

    <div v-if="apiGroups.length" class="component-page-toc__group">
      <p>API reference</p>
      <div v-for="group in apiGroups" :key="group.componentName" class="component-page-toc__api-group">
        <strong v-if="apiGroups.length > 1">{{ group.componentName }}</strong>
        <a
          v-for="section in group.sections"
          :key="section.href"
          :href="section.href"
          class="component-page-toc__link component-page-toc__link--api"
        >
          <span>{{ section.label }}</span>
          <em>{{ section.rows.length }} rows</em>
        </a>
        <div class="component-page-toc__rows">
          <a v-for="row in group.sections.flatMap((section) => section.rows)" :key="row.href" :href="row.href">
            {{ row.name }}
          </a>
        </div>
      </div>
    </div>

    <div v-if="apiReferenceLinks.length" class="component-page-toc__group component-page-toc__group--api-reference">
      <p>API data center</p>
      <a
        v-for="link in apiReferenceLinks"
        :key="link.href"
        :href="link.href"
        class="component-page-toc__link"
      >
        <span>{{ link.label }}</span>
        <em>{{ link.meta }}</em>
      </a>
    </div>

    <div v-if="scenarioLinks.length" class="component-page-toc__group">
      <p>Scenarios</p>
      <a
        v-for="scenario in scenarioLinks"
        :key="scenario.key"
        :href="getScenarioHash(scenario)"
        class="component-page-toc__scenario"
        @click="openScenario(scenario)"
      >
        {{ scenario.label }}
      </a>
    </div>
  </nav>
</template>
