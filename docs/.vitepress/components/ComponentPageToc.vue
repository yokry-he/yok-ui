<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { getComponentRouteContext } from '../data/componentRouteContext'

interface TocLink {
  label: string
  href: string
  meta?: string
  nested?: boolean
}

const route = useRoute()
const renderedHeadingLinks = ref<TocLink[]>([])
let headingObserver: MutationObserver | null = null
let headingFrame = 0

const context = computed(() => getComponentRouteContext(route.path))
const shouldShow = computed(() => Boolean(context.value))
const sectionTocLinks = computed(() => renderedHeadingLinks.value)
const hasSectionTocLinks = computed(() => sectionTocLinks.value.length > 0)

function getRenderedDocRoot() {
  if (typeof document === 'undefined') {
    return null
  }

  return document.querySelector<HTMLElement>('.VPDoc .content-container .vp-doc')
    ?? document.querySelector<HTMLElement>('.vp-doc')
}

function getDirectDocHeadings(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
    .filter((element): element is HTMLElement => {
      const tagName = element.tagName.toLowerCase()

      return Boolean(element.id)
        && (tagName === 'h2' || tagName === 'h3')
        && !element.closest('.doc-demo')
        && !element.closest('.live-example-runner')
    })
}

function getHeadingLabel(heading: HTMLElement) {
  return heading.textContent?.replace(/\s+/g, ' ').replace(/#$/, '').trim() ?? ''
}

function collectRenderedHeadings() {
  const root = getRenderedDocRoot()

  renderedHeadingLinks.value = root
    ? getDirectDocHeadings(root)
      .map((heading) => ({
        label: getHeadingLabel(heading),
        href: `#${heading.id}`,
        nested: heading.tagName.toLowerCase() === 'h3'
      }))
      .filter((link) => link.label)
    : []
}

function scheduleHeadingCollection() {
  if (typeof window === 'undefined') {
    return
  }

  if (headingFrame) {
    window.cancelAnimationFrame(headingFrame)
  }

  headingFrame = window.requestAnimationFrame(() => {
    headingFrame = 0
    collectRenderedHeadings()
    observeRenderedHeadings()
  })
}

function observeRenderedHeadings() {
  if (typeof MutationObserver === 'undefined') {
    return
  }

  const root = getRenderedDocRoot()

  headingObserver?.disconnect()
  headingObserver = null

  if (!root) {
    return
  }

  headingObserver = new MutationObserver(() => {
    collectRenderedHeadings()
  })
  headingObserver.observe(root, {
    childList: true,
    subtree: true
  })
}

onMounted(async () => {
  await nextTick()
  scheduleHeadingCollection()
})

watch(() => route.path, async () => {
  renderedHeadingLinks.value = []
  await nextTick()
  scheduleHeadingCollection()
})

onBeforeUnmount(() => {
  headingObserver?.disconnect()
  headingObserver = null

  if (headingFrame && typeof window !== 'undefined') {
    window.cancelAnimationFrame(headingFrame)
  }
})
</script>

<template>
  <nav v-if="shouldShow" class="component-page-toc" aria-label="Yok UI component page sections">
    <div class="component-page-toc__header">
      <span>CONTENTS</span>
    </div>

    <div v-if="hasSectionTocLinks" class="component-page-toc__group component-page-toc__group--sections">
      <a
        v-for="link in sectionTocLinks"
        :key="link.href"
        :href="link.href"
        class="component-page-toc__section-link"
        :class="{ 'component-page-toc__section-link--nested': link.nested }"
      >
        <span>{{ link.label }}</span>
        <em v-if="link.meta">{{ link.meta }}</em>
      </a>
    </div>
  </nav>
</template>
