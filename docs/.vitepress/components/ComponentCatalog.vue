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
import { liveExampleDocs } from '../data/liveExamples'

const query = ref('')
const selectedPackage = ref<ComponentPackage | 'all'>('all')
const selectedStatus = ref<ComponentStatus | 'all'>('all')
const selectedA11y = ref<ComponentMeta['accessibility'] | 'all'>('all')
const selectedLive = ref<'all' | 'covered' | 'missing'>('all')

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
    const matchesLive =
      selectedLive.value === 'all' ||
      (selectedLive.value === 'covered' && liveExampleDocs.has(component.docs)) ||
      (selectedLive.value === 'missing' && !liveExampleDocs.has(component.docs))

    return matchesQuery && matchesPackage && matchesStatus && matchesA11y && matchesLive
  })
})

const liveExampleComponents = computed(() =>
  components.filter((component) => liveExampleDocs.has(component.docs))
)

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
      <strong>{{ packageOptions.length }}</strong>
      <span>packages</span>
    </div>
    <div>
      <strong>{{ components.filter((component) => component.status === 'Stable').length }}</strong>
      <span>stable</span>
    </div>
    <div>
      <strong>{{ components.filter((component) => component.accessibility !== 'needs-review').length }}</strong>
      <span>a11y tracked</span>
    </div>
    <div>
      <strong>{{ liveExampleComponents.length }}</strong>
      <span>live examples</span>
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
    <div class="catalog-segments" aria-label="Live example filter">
      <button :class="{ active: selectedLive === 'all' }" type="button" @click="selectedLive = 'all'">
        Any live
      </button>
      <button :class="{ active: selectedLive === 'covered' }" type="button" @click="selectedLive = 'covered'">
        Has live
      </button>
      <button :class="{ active: selectedLive === 'missing' }" type="button" @click="selectedLive = 'missing'">
        Needs live
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
            :data-coverage="liveExampleDocs.has(component.docs) ? 'live' : 'missing'"
          >
            {{ liveExampleDocs.has(component.docs) ? 'Live example' : 'Needs live example' }}
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
          <th>Live</th>
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
              :data-status="liveExampleDocs.has(component.docs) ? 'documented' : 'needs-review'"
            >
              {{ liveExampleDocs.has(component.docs) ? 'covered' : 'missing' }}
            </span>
          </td>
          <td>{{ component.description }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="filteredComponents.length === 0" class="component-empty-state">
      <strong>No components found</strong>
      <span>Try another package, status, accessibility, live example filter or search keyword.</span>
    </div>
  </div>
</template>
