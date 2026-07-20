<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  componentFamilies,
  components,
  packageLabels,
  getComponentsByFamily,
  type ComponentPackage,
  type ComponentMeta,
  type ComponentStatus
} from '../data/componentRegistry'
import {
  getComponentVerificationItems,
  getComponentVerificationSummary,
  type ComponentVerificationItem
} from '../data/componentVerification'

const query = ref('')
const selectedPackage = ref<ComponentPackage | 'all'>('all')
const selectedStatus = ref<ComponentStatus | 'all'>('all')
const selectedA11y = ref<ComponentMeta['accessibility'] | 'all'>('all')
const selectedEvidence = ref<'all' | 'example-ready' | 'browser-verified' | 'missing-example'>('all')
const verificationItems = getComponentVerificationItems()
const verificationSummary = getComponentVerificationSummary()
const verificationByComponent = new Map(
  verificationItems.map((item) => [item.component.name, item])
)

const packageOptions = computed(() =>
  Array.from(new Set(components.map((component) => component.packageName)))
)

const statusOptions = computed(() =>
  Array.from(new Set(components.map((component) => component.status)))
)

const a11yOptions = computed(() =>
  Array.from(new Set(components.map((component) => component.accessibility)))
)

const filteredComponents = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  return components.filter((component) => {
    const matchesQuery =
      !normalizedQuery ||
      component.name.toLowerCase().includes(normalizedQuery) ||
      component.title.toLowerCase().includes(normalizedQuery) ||
      component.description.toLowerCase().includes(normalizedQuery)

    const matchesPackage =
      selectedPackage.value === 'all' || component.packageName === selectedPackage.value

    const matchesStatus = selectedStatus.value === 'all' || component.status === selectedStatus.value
    const matchesA11y = selectedA11y.value === 'all' || component.accessibility === selectedA11y.value
    const evidence = verificationByComponent.get(component.name)
    const matchesEvidence =
      selectedEvidence.value === 'all' ||
      (selectedEvidence.value === 'example-ready' && evidence?.exampleReady) ||
      (selectedEvidence.value === 'browser-verified' && evidence?.browserVerified) ||
      (selectedEvidence.value === 'missing-example' && !evidence?.exampleReady)

    return matchesQuery && matchesPackage && matchesStatus && matchesA11y && matchesEvidence
  })
})

const familyCards = computed(() =>
  componentFamilies
    .map((family) => ({
      ...family,
      components: components.filter((component) => component.family === family.id)
    }))
    .filter((family) => family.components.length > 0)
)

const groupedComponents = computed(() =>
  componentFamilies
    .map((family) => ({
      ...family,
      components: getComponentsByFamily(family.id)
    }))
    .filter((family) => family.components.length > 0)
)

const recommendedRoutes = computed(() => [
  {
    title: 'Build a form flow',
    description: 'Start with field primitives, then add validation and submit feedback.',
    links: ['/components/input', '/components/select', '/components/form', '/components/form-summary']
  },
  {
    title: 'Build a data page',
    description: 'Combine table, list, statistic and detail surfaces before adding admin depth.',
    links: ['/components/table', '/components/list', '/components/statistic', '/components/descriptions']
  },
  {
    title: 'Build an admin workflow',
    description: 'Use page shell, filters, saved views, data toolbar and review workflow together.',
    links: ['/components/page-header', '/components/search-form', '/components/data-table', '/components/review-workflow']
  }
])

function getComponentByDocs(docs: string) {
  return components.find((component) => component.docs === docs)
}

function getVerification(component: ComponentMeta) {
  return verificationByComponent.get(component.name)
}

function getEvidenceLabel(evidence?: ComponentVerificationItem) {
  if (evidence?.releaseReady) {
    return 'release ready'
  }

  if (evidence?.browserVerified) {
    return 'browser verified'
  }

  return evidence?.exampleReady ? 'example ready' : 'needs example'
}

function getEvidenceStatus(evidence?: ComponentVerificationItem) {
  if (evidence?.browserVerified) {
    return 'documented'
  }

  return evidence?.exampleReady ? 'beta' : 'needs-review'
}
</script>

<template>
  <section class="catalog-hero" aria-label="Component overview">
    <div>
      <p class="docs-eyebrow">Component routes</p>
      <h2>Browse by family, package, status and accessibility</h2>
      <p>
        Element Plus offers category navigation; Yok UI adds package-aware discovery so Core,
        Product, Admin and Brand components can share one route system without becoming a flat list.
      </p>
    </div>
    <nav class="catalog-jump-nav" aria-label="Component family shortcuts">
      <a v-for="family in groupedComponents" :key="family.id" class="catalog-jump-nav__link" :href="`#family-${family.id}`">
        <span class="catalog-jump-nav__label">{{ family.title }}</span>
        <strong class="catalog-jump-nav__count">{{ family.components.length }}</strong>
      </a>
    </nav>
  </section>

  <section class="catalog-metrics" aria-label="Component metrics">
    <div>
      <strong>{{ components.length }}</strong>
      <span>components</span>
    </div>
    <div>
      <strong>{{ components.filter((component) => component.status === 'Stable').length }}</strong>
      <span>stable</span>
    </div>
    <div>
      <strong>{{ verificationSummary.exampleReadyRoutes }}</strong>
      <span>example ready</span>
    </div>
    <div>
      <strong>{{ verificationSummary.browserVerifiedRoutes }}</strong>
      <span>browser verified</span>
    </div>
    <div>
      <strong>{{ verificationSummary.releaseReadyComponents }}</strong>
      <span>release ready</span>
    </div>
  </section>

  <section class="catalog-route-lanes" aria-label="Recommended component routes">
    <article v-for="route in recommendedRoutes" :key="route.title" class="docs-card">
      <h3>{{ route.title }}</h3>
      <p>{{ route.description }}</p>
      <div class="component-pills">
        <a
          v-for="link in route.links"
          :key="link"
          :href="link"
        >
          {{ getComponentByDocs(link)?.title }}
        </a>
      </div>
    </article>
  </section>

  <section class="docs-card-grid component-family-grid" aria-label="Component families">
    <article v-for="family in familyCards" :key="family.id" class="docs-card">
      <h3>{{ family.title }}</h3>
      <p>{{ family.description }}</p>
      <div class="component-pills">
        <a v-for="component in family.components.slice(0, 6)" :key="component.name" :href="component.docs">
          {{ component.name }}
        </a>
      </div>
    </article>
  </section>

  <section class="catalog-toolbar" aria-label="Component filters">
    <label>
      <span>Search</span>
      <input v-model="query" type="search" placeholder="Search component, scene, status..." />
    </label>
    <div class="catalog-segments" aria-label="Package filter">
      <button :class="{ active: selectedPackage === 'all' }" type="button" @click="selectedPackage = 'all'">
        All
      </button>
      <button
        v-for="packageName in packageOptions"
        :key="packageName"
        :class="{ active: selectedPackage === packageName }"
        type="button"
        @click="selectedPackage = packageName"
      >
        {{ packageLabels[packageName] }}
      </button>
    </div>
    <div class="catalog-segments" aria-label="Status filter">
      <button :class="{ active: selectedStatus === 'all' }" type="button" @click="selectedStatus = 'all'">
        Any status
      </button>
      <button
        v-for="status in statusOptions"
        :key="status"
        :class="{ active: selectedStatus === status }"
        type="button"
        @click="selectedStatus = status"
      >
        {{ status }}
      </button>
    </div>
    <div class="catalog-segments" aria-label="Accessibility filter">
      <button :class="{ active: selectedA11y === 'all' }" type="button" @click="selectedA11y = 'all'">
        Any a11y
      </button>
      <button
        v-for="a11y in a11yOptions"
        :key="a11y"
        :class="{ active: selectedA11y === a11y }"
        type="button"
        @click="selectedA11y = a11y"
      >
        {{ a11y }}
      </button>
    </div>
    <div class="catalog-segments" aria-label="Verification evidence filter">
      <button :class="{ active: selectedEvidence === 'all' }" type="button" @click="selectedEvidence = 'all'">
        Any evidence
      </button>
      <button :class="{ active: selectedEvidence === 'example-ready' }" type="button" @click="selectedEvidence = 'example-ready'">
        Example ready
      </button>
      <button :class="{ active: selectedEvidence === 'browser-verified' }" type="button" @click="selectedEvidence = 'browser-verified'">
        Browser verified
      </button>
      <button :class="{ active: selectedEvidence === 'missing-example' }" type="button" @click="selectedEvidence = 'missing-example'">
        Needs example
      </button>
    </div>
  </section>

  <section class="catalog-overview-groups" aria-label="Grouped component overview">
    <article
      v-for="family in groupedComponents"
      :id="`family-${family.id}`"
      :key="family.id"
      class="catalog-overview-group"
    >
      <header>
        <div>
          <p class="docs-eyebrow">{{ family.id }}</p>
          <h2>{{ family.title }} <span>{{ family.components.length }}</span></h2>
          <p>{{ family.description }}</p>
        </div>
        <a href="#top">Back to top</a>
      </header>
      <div class="catalog-route-grid">
        <a
          v-for="component in family.components"
          :key="component.name"
          class="catalog-route-card"
          :href="component.docs"
        >
          <span class="catalog-route-card__title">{{ component.title }}</span>
          <code>{{ component.name }}</code>
          <span>{{ packageLabels[component.packageName] }} · {{ component.status }}</span>
          <span
            class="coverage-chip"
            :data-coverage="getVerification(component)?.exampleReady ? 'live' : 'missing'"
          >
            {{ getEvidenceLabel(getVerification(component)) }}
          </span>
          <p>{{ component.description }}</p>
        </a>
      </div>
    </article>
  </section>

  <div class="docs-table-wrap component-status-table">
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Package</th>
          <th>Status</th>
          <th>A11y</th>
          <th>Evidence</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="component in filteredComponents" :key="component.name">
          <td>
            <a :href="component.docs"><code>{{ component.name }}</code></a>
          </td>
          <td><code>{{ component.packageName }}</code></td>
          <td>
            <span class="status-badge" :data-status="component.status.toLowerCase()">
              {{ component.status }}
            </span>
          </td>
          <td>
            <span class="status-badge" :data-status="component.accessibility">
              {{ component.accessibility }}
            </span>
          </td>
          <td>
            <span
              class="status-badge"
              :data-status="getEvidenceStatus(getVerification(component))"
            >
              {{ getEvidenceLabel(getVerification(component)) }}
            </span>
          </td>
          <td>{{ component.description }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="filteredComponents.length === 0" class="component-empty-state">
      <strong>No components found</strong>
      <span>Try another package, status, accessibility, evidence filter or search keyword.</span>
    </div>
  </div>
</template>
