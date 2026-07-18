<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ComponentPageToc from '../components/ComponentPageToc.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      <ComponentPageToc />
    </template>
  </Layout>
</template>
