<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'
import { componentApis, packageLabels } from '../data/componentRegistry'
import {
  getComponentCoverageQueueItem,
  getComponentRouteContext
} from '../data/componentRouteContext'
import type { ApiKind } from '../data/apiLiveCoverage'
import type { LiveExampleScenario } from '../data/liveExamples'

const route = useRoute()

const context = computed(() => getComponentRouteContext(route.path))
const coverageQueueItem = computed(() => getComponentCoverageQueueItem(route.path))
const shouldShow = computed(() => Boolean(context.value))
const copiedMaturity = ref(false)
const apiKinds = ['props', 'events', 'slots', 'methods', 'types'] as const satisfies readonly ApiKind[]
const apiKindLabels: Record<ApiKind, string> = {
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  methods: 'Methods',
  types: 'Types'
}
const maturityReport = computed(() => {
  if (!context.value) {
    return ''
  }

  return [
    '# Yok UI component maturity report',
    '',
    `- Component: ${context.value.component.title}`,
    `- Name: ${context.value.component.name}`,
    `- Package: ${context.value.component.packageName}`,
    `- Docs: ${context.value.component.docs}`,
    `- Status: ${context.value.component.status}`,
    `- Quality score: ${context.value.qualityScore}`,
    `- Scenarios: ${context.value.scenarios.length}`,
    `- Related: ${context.value.relatedComponents.map((component) => component.title).join(', ') || 'n/a'}`,
    '',
    '## Evidence matrix',
    ...context.value.evidenceMatrix.map((item) =>
      `- ${item.label}: ${item.value} - ${item.detail}`
    ),
    '',
    '## Maturity evidence',
    ...context.value.maturityItems.map((item) =>
      `- ${item.label}: ${item.value} - ${item.detail}`
    ),
    '',
    '## Quality gates',
    ...context.value.qualityItems.map((item) =>
      `- ${item.label}: ${item.value} - ${item.detail}`
    )
  ].join('\n')
})
const apiReferenceLinks = computed(() => {
  if (!context.value) {
    return []
  }

  const componentName = context.value.component.name
  const api = componentApis[componentName]
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
      label: 'All rows',
      href: createHref(),
      detail: `${componentName} API data center`
    },
    ...apiKinds
      .filter((kind) => (api?.[kind]?.length ?? 0) > 0)
      .slice(0, 4)
      .map((kind) => ({
        label: apiKindLabels[kind],
        href: createHref(kind),
        detail: `${api?.[kind]?.length ?? 0} rows`
      }))
  ]
})

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

async function copyMaturityReport() {
  if (!navigator.clipboard || !maturityReport.value) {
    return
  }

  await navigator.clipboard.writeText(maturityReport.value)
  copiedMaturity.value = true
  window.setTimeout(() => {
    copiedMaturity.value = false
  }, 1200)
}
</script>

<template>
  <section v-if="shouldShow" class="doc-route-navigator" aria-label="Component route context">
    <div class="doc-route-navigator__meta">
      <a class="doc-route-navigator__crumb" href="/components/">Components</a>
      <span aria-hidden="true">/</span>
      <span>{{ context?.family?.title }}</span>
      <span aria-hidden="true">/</span>
      <strong>{{ context?.component.title }}</strong>
    </div>

    <div class="doc-route-navigator__body">
      <div>
        <span class="doc-route-navigator__eyebrow">Route map</span>
        <p>
          {{ context?.packageLabel }} ·
          {{ context?.component.status }} ·
          {{ context?.component.accessibility }} a11y
        </p>
      </div>
      <div class="doc-route-navigator__actions">
        <a class="doc-route-navigator__overview" href="/components/">Open component overview</a>
        <a class="doc-route-navigator__overview" :href="context?.packageRoute">Open package route</a>
      </div>
    </div>

    <div v-if="context" class="doc-route-navigator__quality" aria-label="Component quality evidence">
      <div class="doc-route-navigator__quality-score">
        <span>Quality</span>
        <strong>{{ context.qualityScore }}</strong>
      </div>
      <ul class="doc-route-navigator__quality-list">
        <li
          v-for="item in context.qualityItems"
          :key="item.key"
          :id="`component-quality-${item.key}`"
          :data-tone="item.tone"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <p>{{ item.detail }}</p>
        </li>
      </ul>
    </div>

    <section
      v-if="coverageQueueItem"
      class="doc-route-navigator__maintenance"
      :data-priority="coverageQueueItem.priority"
      aria-label="Component maintenance queue status"
    >
      <header class="doc-route-navigator__maintenance-header">
        <div>
          <span class="doc-route-navigator__eyebrow">Maintenance queue</span>
          <strong>{{ coverageQueueItem.actionLabel }}</strong>
          <p>{{ coverageQueueItem.actionDetail }}</p>
        </div>
        <a class="doc-route-navigator__maintenance-target" :href="coverageQueueItem.targetHref">
          <span>{{ coverageQueueItem.priority }}</span>
          <strong>Open {{ coverageQueueItem.targetLabel }}</strong>
        </a>
      </header>
      <ol class="doc-route-navigator__maintenance-list">
        <li v-for="step in coverageQueueItem.checklist" :key="step.href">
          <a :href="step.href">
            <strong>{{ step.label }}</strong>
            <span>{{ step.detail }}</span>
          </a>
        </li>
      </ol>
    </section>

    <section v-if="context" class="doc-route-navigator__evidence" aria-label="Component evidence matrix">
      <header class="doc-route-navigator__evidence-header">
        <div>
          <span class="doc-route-navigator__eyebrow">Evidence matrix</span>
          <strong>API、Live、Source、A11y、Theme 和 Route 证据矩阵</strong>
        </div>
        <span class="doc-route-navigator__evidence-count">
          {{ context.evidenceMatrix.filter((item) => item.tone !== 'warning').length }}/{{ context.evidenceMatrix.length }}
        </span>
      </header>
      <ul class="doc-route-navigator__evidence-grid">
        <li
          v-for="item in context.evidenceMatrix"
          :key="item.key"
          :id="`component-evidence-${item.key}`"
          class="doc-route-navigator__evidence-item"
          :data-tone="item.tone"
        >
          <div class="doc-route-navigator__evidence-main">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
          <p>{{ item.detail }}</p>
          <div class="doc-route-navigator__evidence-gates">
            <span
              v-for="gate in [...item.qualityItems, ...item.maturityItems].slice(0, 3)"
              :key="`${item.key}-${gate.key}`"
            >
              {{ gate.label }}
            </span>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="context" class="doc-route-navigator__maturity" aria-label="Component maturity evidence">
      <header class="doc-route-navigator__maturity-header">
        <div>
          <span class="doc-route-navigator__eyebrow">Maturity evidence</span>
          <strong>{{ context.component.title }} 发布成熟度清单</strong>
          <p>API、Live、A11y、Playground、主题包和路由信息来自同一份组件数据源。</p>
        </div>
        <button type="button" class="doc-route-navigator__maturity-copy" @click="copyMaturityReport">
          {{ copiedMaturity ? '已复制报告' : '复制成熟度报告' }}
        </button>
      </header>
      <ul class="doc-route-navigator__maturity-grid">
        <li
          v-for="item in context.maturityItems"
          :key="item.key"
          :id="`component-maturity-${item.key}`"
          class="doc-route-navigator__maturity-item"
          :data-tone="item.tone"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <p>{{ item.detail }}</p>
        </li>
      </ul>
    </section>

    <section
      v-if="apiReferenceLinks.length"
      class="doc-route-navigator__api-reference"
      aria-label="Component API reference handoff"
    >
      <header class="doc-route-navigator__api-reference-header">
        <div>
          <span class="doc-route-navigator__eyebrow">API Reference handoff</span>
          <strong>把 {{ context?.component.title }} 带到结构化 API 数据中心</strong>
          <p>按当前组件预置搜索条件，继续查看 row 级 API 锚点、Live evidence 状态和维护入口。</p>
        </div>
      </header>
      <div class="doc-route-navigator__api-reference-grid">
        <a v-for="link in apiReferenceLinks" :key="link.href" :href="link.href">
          <strong>{{ link.label }}</strong>
          <span>{{ link.detail }}</span>
        </a>
      </div>
    </section>

    <div v-if="context?.scenarios.length" class="doc-route-navigator__scenarios" aria-label="Workflow scenarios">
      <div>
        <span class="doc-route-navigator__eyebrow">Workflow scenarios</span>
        <p>当前组件页的 Live runner 可直接切换这些真实场景。</p>
      </div>
      <div class="doc-route-navigator__scenario-grid">
        <a
          v-for="scenario in context.scenarios"
          :key="scenario.key"
          :href="getScenarioHash(scenario)"
          @click="openScenario(scenario)"
        >
          <strong>{{ scenario.label }}</strong>
          <span>{{ scenario.description }}</span>
        </a>
      </div>
    </div>

    <div v-if="context?.relatedComponents.length" class="doc-route-navigator__related" aria-label="Related components">
      <div>
        <span class="doc-route-navigator__eyebrow">Related {{ context?.family?.title }}</span>
        <p>同一组件族内的常用相邻能力。</p>
      </div>
      <div class="doc-route-navigator__related-grid">
        <a
          v-for="component in context.relatedComponents"
          :key="component.name"
          :href="component.docs"
        >
          <strong>{{ component.title }}</strong>
          <span>{{ component.status }} · {{ packageLabels[component.packageName] }}</span>
        </a>
      </div>
    </div>

    <nav class="doc-route-navigator__pager" aria-label="Adjacent component pages">
      <a
        v-if="context?.previousComponent"
        class="doc-route-navigator__link"
        :href="context.previousComponent.docs"
      >
        <span>Previous</span>
        <strong>{{ context.previousComponent.title }}</strong>
      </a>
      <span v-else class="doc-route-navigator__link is-disabled">
        <span>Previous</span>
        <strong>Start of components</strong>
      </span>

      <a
        v-if="context?.nextComponent"
        class="doc-route-navigator__link doc-route-navigator__link--next"
        :href="context.nextComponent.docs"
      >
        <span>Next</span>
        <strong>{{ context.nextComponent.title }}</strong>
      </a>
      <span v-else class="doc-route-navigator__link doc-route-navigator__link--next is-disabled">
        <span>Next</span>
        <strong>End of components</strong>
      </span>
    </nav>
  </section>
</template>
