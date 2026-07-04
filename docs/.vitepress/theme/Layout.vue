<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ComponentPageToc from '../components/ComponentPageToc.vue'
import DocRouteNavigator from '../components/DocRouteNavigator.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      <ComponentPageToc />
    </template>
    <template #doc-after>
      <DocRouteNavigator />
    </template>
  </Layout>
</template>
