<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getAccessibilityEvidence,
  type AccessibilityEvidenceCategory,
  type AccessibilityEvidenceRisk
} from '../data/accessibilityEvidence'

const props = defineProps<{
  name: string
}>()

const copied = ref(false)
const profile = computed(() => getAccessibilityEvidence(props.name))

const riskLabels: Record<AccessibilityEvidenceRisk, string> = {
  native: 'Native',
  standard: 'Documented',
  complex: 'Complex',
  critical: 'Critical'
}

const categoryLabels: Record<AccessibilityEvidenceCategory, string> = {
  native: 'Native',
  semantics: 'Semantics',
  keyboard: 'Keyboard',
  focus: 'Focus',
  aria: 'ARIA',
  contrast: 'Contrast',
  motion: 'Motion',
  docs: 'Docs',
  tests: 'Tests'
}

function evidenceHref(path: string) {
  if (!path.startsWith('docs/')) {
    return ''
  }

  return path
    .replace(/^docs/, '')
    .replace(/\.md$/, '')
}

function createEvidenceManifest() {
  if (!profile.value) {
    return ''
  }

  const contract = profile.value.contract
  const lines = [
    `# ${profile.value.componentName} accessibility evidence`,
    '',
    `- Title: ${profile.value.title}`,
    `- Package: ${profile.value.packageName}`,
    `- Risk: ${profile.value.risk}`,
    `- Categories: ${profile.value.categories.map((category) => categoryLabels[category]).join(', ')}`,
    `- Summary: ${profile.value.summary}`
  ]

  if (contract) {
    lines.push(
      '',
      `## ${contract.pattern}`,
      '',
      ...contract.keyboard.map((item) => `- Keyboard: ${item}`),
      `- Focus: ${contract.focus}`,
      ...contract.semantics.map((item) => `- Semantics: ${item}`)
    )
  }

  lines.push(
    '',
    '## Docs',
    '',
    ...profile.value.evidence.docs.map((item) => `- ${item}`),
    '',
    '## Tests',
    '',
    ...profile.value.evidence.tests.map((item) => `- ${item}`)
  )

  return lines.join('\n')
}

async function writeClipboardText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // Embedded browser shells may expose Clipboard API while blocking writes.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'readonly')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus({ preventScroll: true })
  textarea.select()

  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

async function copyEvidence() {
  if (!profile.value) {
    return
  }

  await writeClipboardText(createEvidenceManifest())
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1400)
}
</script>

<template>
  <section
    v-if="profile"
    class="component-a11y-evidence"
    :data-risk="profile.risk"
    aria-label="Accessibility evidence"
  >
    <header class="component-a11y-evidence__header">
      <div>
        <p class="component-a11y-evidence__eyebrow">Accessibility evidence</p>
        <h3 class="component-a11y-evidence__title">{{ profile.title }}</h3>
      </div>
      <div class="component-a11y-evidence__actions">
        <span class="component-a11y-evidence__risk">{{ riskLabels[profile.risk] }}</span>
        <button type="button" class="component-a11y-evidence__copy" @click="copyEvidence">
          {{ copied ? '已复制证据' : '复制证据' }}
        </button>
      </div>
    </header>

    <p class="component-a11y-evidence__summary">{{ profile.summary }}</p>

    <div class="component-a11y-evidence__category-list" aria-label="Evidence categories">
      <span
        v-for="category in profile.categories"
        :key="category"
        class="component-a11y-evidence__category"
      >
        {{ categoryLabels[category] }}
      </span>
    </div>

    <div v-if="profile.contract" class="component-a11y-evidence__contract">
      <div class="component-a11y-evidence__contract-main">
        <span class="component-a11y-evidence__label">Pattern</span>
        <strong>{{ profile.contract.pattern }}</strong>
      </div>
      <div class="component-a11y-evidence__contract-grid">
        <section>
          <h4>Keyboard</h4>
          <ul>
            <li v-for="item in profile.contract.keyboard" :key="item">{{ item }}</li>
          </ul>
        </section>
        <section>
          <h4>Focus</h4>
          <p>{{ profile.contract.focus }}</p>
        </section>
        <section>
          <h4>ARIA</h4>
          <ul>
            <li v-for="item in profile.contract.semantics" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>
    </div>

    <div class="component-a11y-evidence__proof">
      <section>
        <h4>Docs evidence</h4>
        <ul>
          <li v-for="item in profile.evidence.docs" :key="item">
            <a v-if="evidenceHref(item)" :href="evidenceHref(item)">{{ item }}</a>
            <code v-else>{{ item }}</code>
          </li>
        </ul>
      </section>
      <section>
        <h4>Test evidence</h4>
        <ul>
          <li v-for="item in profile.evidence.tests" :key="item">
            <code>{{ item }}</code>
          </li>
        </ul>
      </section>
    </div>
  </section>

  <section v-else class="component-a11y-evidence__missing" role="status">
    {{ name }} 可访问性证据未登记。
  </section>
</template>
