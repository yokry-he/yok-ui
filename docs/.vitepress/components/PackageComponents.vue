<script setup lang="ts">
import { computed } from 'vue'
import {
  getComponentsByPackage,
  packageLabels,
  type ComponentPackage
} from '../data/componentRegistry'

const props = defineProps<{
  packageName: ComponentPackage
}>()

const packageComponents = computed(() => getComponentsByPackage(props.packageName))
</script>

<template>
  <div class="package-summary">
    <div>
      <strong>{{ packageComponents.length }}</strong>
      <span>{{ packageLabels[packageName] }} components</span>
    </div>
    <div>
      <strong>{{ packageComponents.filter((component) => component.status === 'Stable').length }}</strong>
      <span>stable</span>
    </div>
    <div>
      <strong>{{ packageComponents.filter((component) => component.status === 'Beta').length }}</strong>
      <span>beta</span>
    </div>
  </div>

  <div class="docs-table-wrap">
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Status</th>
          <th>Family</th>
          <th>Since</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="component in packageComponents" :key="component.name">
          <td>
            <a :href="component.docs"><code>{{ component.name }}</code></a>
          </td>
          <td>
            <span class="status-badge" :data-status="component.status.toLowerCase()">
              {{ component.status }}
            </span>
          </td>
          <td>{{ component.family }}</td>
          <td>{{ component.since }}</td>
          <td>{{ component.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
