<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { components } from '../data/componentRegistry'
import { getComponentThemeEvidence } from '../data/componentThemeEvidence'
import { getPlaygroundComponentForDocsRoute } from '../data/playgroundExamples'
import { createCodeHighlightLines } from '../utils/codeHighlight'
import ExampleSourceActions from './ExampleSourceActions.vue'

interface CodePanel {
  label: string
  language?: string
  code: string
}

const props = withDefaults(defineProps<{
  id?: string
  title: string
  description?: string
  code?: string
  jsCode?: string
  setup?: string
  jsSetup?: string
  source?: string
  usage?: string[]
}>(), {
  id: '',
  description: '',
  code: '',
  jsCode: '',
  setup: '',
  jsSetup: '',
  source: '',
  usage: () => []
})

const isCodeOpen = ref(false)
const activePanel = ref('TS')
const copied = ref(false)
const playgroundHandoffStoragePrefix = 'yok-ui:playground-handoff'
const clipboardWriteTimeoutMs = 320
const demoId = computed(() => {
  const explicitId = createDemoSlug(props.id)

  if (explicitId) {
    return explicitId
  }

  const titleSlug = createDemoSlug(props.title)

  return titleSlug ? `demo-${titleSlug}` : `demo-${createStableHash(props.title || 'example')}`
})
const titleId = computed(() => `${demoId.value}-title`)
const sourcePanelId = computed(() => `${demoId.value}-source-panel`)
const permalinkLabel = computed(() => `Permalink to ${props.title} example`)
const permalinkTitle = computed(() => `复制或打开 ${props.title} 示例链接`)

function createDemoSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function indentTemplate(value: string) {
  return value
    .split('\n')
    .map((line) => line ? `  ${line}` : '')
    .join('\n')
}

function createSfcSource(template: string, setup: string, useTypeScript: boolean) {
  const trimmedTemplate = template.trim()
  const trimmedSetup = setup.trim()
  const hasScript = /<script\b/i.test(trimmedTemplate)
  const hasTemplate = /^<template(?:\s+(?![#:@]|v-slot)[^>]*)?>/i.test(trimmedTemplate)

  if (hasScript) {
    return trimmedTemplate
  }

  if (hasTemplate) {
    return [
      trimmedSetup ? `<script setup${useTypeScript ? ' lang="ts"' : ''}>` : '',
      trimmedSetup,
      trimmedSetup ? '</' + 'script>' : '',
      trimmedSetup ? '' : '',
      trimmedTemplate
    ].filter((line, index, lines) => line || (index > 0 && lines[index - 1])).join('\n').trim()
  }

  return [
    trimmedSetup ? `<script setup${useTypeScript ? ' lang="ts"' : ''}>` : '',
    trimmedSetup,
    trimmedSetup ? '</' + 'script>' : '',
    trimmedSetup ? '' : '',
    '<template>',
    indentTemplate(trimmedTemplate),
    '</template>'
  ].filter((line, index, lines) => line || (index > 0 && lines[index - 1])).join('\n').trim()
}

function createStableHash(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash).toString(36)
}

function navigateToPlayground(href: string) {
  const testNavigate = (window as Window & {
    __YOK_DOCS_DEMO_NAVIGATE__?: (targetHref: string) => void
  }).__YOK_DOCS_DEMO_NAVIGATE__

  if (testNavigate) {
    testNavigate(href)
    return
  }

  window.location.href = href
}

const codePanels = computed<CodePanel[]>(() => {
  const panels: CodePanel[] = []

  if (props.code) {
    const trimmedCode = createSfcSource(props.code, props.setup, true)

    panels.push({
      label: 'TS',
      language: 'vue',
      code: trimmedCode
    })

    panels.push({
      label: 'JS',
      language: 'vue',
      code: createSfcSource(props.jsCode || props.code, props.jsSetup || props.setup, false)
    })
  }

  if (!props.code && props.jsCode) {
    panels.push({
      label: 'JS',
      language: 'vue',
      code: props.jsCode.trim()
    })
  }

  return panels
})

const activeCode = computed(() => {
  return codePanels.value.find((panel) => panel.label === activePanel.value)?.code || codePanels.value[0]?.code || ''
})
const activeCodeLines = computed(() => {
  return createCodeHighlightLines(activeCode.value, activePanel.value)
})
const activeCodeLineCount = computed(() => activeCode.value ? activeCode.value.split('\n').length : 0)
const sourceMetaLabel = computed(() => `Vue SFC source, ${activePanel.value}, ${activeCodeLineCount.value} lines`)
const sourceLanguageOptions = computed(() =>
  codePanels.value.map((panel) => ({
    label: panel.label,
    value: panel.label
  }))
)
const sourceStateText = computed(() => isCodeOpen.value ? '隐藏源代码' : '查看源代码')
const sourceBarPlacement = computed(() => isCodeOpen.value ? 'code-top-right' : 'preview-bottom')
const sourceChrome = computed(() => isCodeOpen.value ? 'floating-right' : 'inline-bottom')
const docsRoute = computed(() => {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.pathname.replace(/\/$/, '')
})
const playgroundComponent = computed(() => {
  if (typeof window === 'undefined') {
    return ''
  }

  return getPlaygroundComponentForDocsRoute(window.location.pathname)
})
const inferredSourceHref = computed(() => {
  const routeComponent = components.find((component) => component.docs.replace(/\/$/, '') === docsRoute.value)

  if (!routeComponent) {
    return ''
  }

  const sourcePath = getComponentThemeEvidence(routeComponent.name)?.sourcePath

  return sourcePath ? `/source/?file=${sourcePath}` : ''
})
const sourceHref = computed(() => props.source || inferredSourceHref.value)
const sourceTarget = computed(() => sourceHref.value.startsWith('http') ? '_blank' : undefined)
const sourceRel = computed(() => sourceTarget.value ? 'noreferrer' : undefined)
const playgroundLanguage = computed(() => activePanel.value.toLowerCase())
const playgroundHandoffKey = computed(() => [
  'docs-demo',
  playgroundComponent.value || 'custom',
  playgroundLanguage.value,
  createStableHash(activeCode.value)
].join('-'))
const playgroundHandoffHref = computed(() => {
  const params = new URLSearchParams()

  if (playgroundComponent.value) {
    params.set('component', playgroundComponent.value)
  }

  params.set('handoff', playgroundHandoffKey.value)

  return `/playground/?${params.toString()}`
})
const playgroundFallbackHref = computed(() => {
  const params = new URLSearchParams()

  if (playgroundComponent.value) {
    params.set('component', playgroundComponent.value)
  }

  params.set('source', activeCode.value)
  params.set('title', props.title)
  params.set('from', 'docs-demo')
  params.set('language', playgroundLanguage.value)
  params.set('docsHash', `#${demoId.value}`)

  return `/playground/?${params.toString()}`
})
const sourceActions = computed(() => {
  const actions = [
    {
      key: 'playground',
      href: playgroundHandoffHref.value,
      tooltip: '在 Playground 中编辑',
      label: '在 Playground 中编辑',
      glyph: '',
      icon: 'playground',
      text: 'Playground',
      className: 'doc-demo__playground',
      glyphClassName: 'doc-demo__tool-glyph--playground'
    }
  ]

  if (sourceHref.value) {
    actions.push({
      key: 'source-file',
      href: sourceHref.value,
      tooltip: '查看组件源码',
      label: '查看组件源码',
      glyph: '',
      icon: 'source',
      text: 'Source file',
      target: sourceTarget.value,
      rel: sourceRel.value,
      className: 'doc-demo__source',
      glyphClassName: 'doc-demo__tool-glyph--source'
    })
  }

  actions.push(
    {
      key: 'copy',
      tooltip: copied.value ? '已复制' : '复制代码',
      label: copied.value ? '已复制代码' : '复制代码',
      glyph: '',
      icon: 'copy',
      text: 'Copy code',
      feedback: copied.value,
      feedbackText: '已复制',
      feedbackClassName: 'doc-demo__copied',
      className: copied.value ? 'doc-demo__copy doc-demo__copy--copied' : 'doc-demo__copy',
      glyphClassName: 'doc-demo__tool-glyph--copy'
    },
    {
      key: 'toggle-source',
      tooltip: sourceStateText.value,
      label: sourceStateText.value,
      glyph: '',
      icon: 'code',
      text: 'Toggle source',
      stateText: sourceStateText.value,
      stateClassName: 'doc-demo__source-state doc-demo__source-state--inline',
      expanded: isCodeOpen.value,
      controls: sourcePanelId.value,
      className: 'doc-demo__toggle',
      glyphClassName: 'doc-demo__tool-glyph--code'
    }
  )

  return actions
})

function handleSourceAction(key: string, event: MouseEvent) {
  if (key === 'playground') {
    persistPlaygroundHandoff(event)
    return
  }

  if (key === 'copy') {
    void copyCode()
    return
  }

  if (key === 'toggle-source') {
    void toggleCodePanel()
  }
}

async function toggleCodePanel() {
  const willOpen = !isCodeOpen.value

  isCodeOpen.value = willOpen

  await nextTick()

  if (willOpen) {
    const codePanel = document.getElementById(sourcePanelId.value)

    codePanel?.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    })
    codePanel?.focus({ preventScroll: true })
    return
  }

  focusSourceToggle()
}

async function hideCodePanel() {
  isCodeOpen.value = false

  await nextTick()
  focusSourceToggle()
}

function focusSourceToggle() {
  const demo = document.getElementById(demoId.value)
  const toggle = demo?.querySelector<HTMLElement>('[data-demo-action="toggle-source"]')

  toggle?.focus({ preventScroll: true })
}

function persistPlaygroundHandoff(event: MouseEvent) {
  if (!activeCode.value || typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(`${playgroundHandoffStoragePrefix}:${playgroundHandoffKey.value}`, JSON.stringify({
      version: 1,
      component: playgroundComponent.value || null,
      source: activeCode.value,
      origin: 'docs-demo',
      language: playgroundLanguage.value,
      docsHash: `#${demoId.value}`,
      createdAt: new Date().toISOString()
    }))

    event.preventDefault()
    navigateToPlayground(playgroundHandoffHref.value)
  } catch {
    if (event.currentTarget instanceof HTMLAnchorElement) {
      event.currentTarget.setAttribute('href', playgroundFallbackHref.value)
    }

    event.preventDefault()
    navigateToPlayground(playgroundFallbackHref.value)
  }
}

async function copyCode() {
  if (!activeCode.value || typeof window === 'undefined') {
    return
  }

  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1400)

  if (navigator.clipboard?.writeText) {
    let clipboardWrite: Promise<void> | void

    try {
      clipboardWrite = navigator.clipboard.writeText(activeCode.value)
    } catch {
      clipboardWrite = undefined
    }

    const wroteWithClipboard = await Promise.race([
      Promise.resolve(clipboardWrite).then(() => true).catch(() => false),
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), clipboardWriteTimeoutMs)
      })
    ])

    if (!wroteWithClipboard) {
      fallbackCopy(activeCode.value)
    }
  } else {
    fallbackCopy(activeCode.value)
  }
}

function fallbackCopy(value: string) {
  const textarea = document.createElement('textarea')

  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus({ preventScroll: true })
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
</script>

<template>
  <section class="doc-demo" :id="demoId" :data-demo-id="demoId" :aria-labelledby="titleId">
    <header class="doc-demo__intro">
      <h3 :id="titleId">
        <span>{{ title }}</span>
        <a class="doc-demo__permalink" :href="`#${demoId}`" :aria-label="permalinkLabel" :title="permalinkTitle">#</a>
      </h3>
      <p v-if="description">{{ description }}</p>
    </header>

    <div class="doc-demo__shell" :data-source-open="isCodeOpen ? 'true' : 'false'">
      <div class="doc-demo__preview">
        <slot />
      </div>

      <div
        v-if="codePanels.length && !isCodeOpen"
        class="doc-demo__source-bar"
        :data-source-placement="sourceBarPlacement"
        :data-source-chrome="sourceChrome"
      >
        <ExampleSourceActions
          data-source-action-layout="element-plus-compact"
          action-attribute="data-demo-action"
          language-attribute="data-demo-language"
          aria-label="示例操作"
          language-aria-label="代码语言"
          tools-aria-label="示例操作"
          root-class="doc-demo__source-actions"
          languages-class="doc-demo__source-language"
          language-class="doc-demo__language"
          tools-class="doc-demo__actions doc-demo__tools"
          tool-class="doc-demo__tool"
          glyph-class="doc-demo__tool-glyph"
          text-class="doc-demo__tool-text"
          :active-language="activePanel"
          :language-options="sourceLanguageOptions"
          :actions="sourceActions"
          @update:language="activePanel = $event"
          @action="handleSourceAction"
        />
      </div>

      <div
        v-if="codePanels.length && isCodeOpen"
        :id="sourcePanelId"
        class="doc-demo__code"
        :data-language="activePanel"
        data-source-panel="element-plus"
        tabindex="-1"
      >
        <div
          class="doc-demo__source-bar"
          :data-source-placement="sourceBarPlacement"
          :data-source-chrome="sourceChrome"
        >
          <div
            class="doc-demo__source-meta"
            data-source-kind="vue-sfc"
            :data-source-language="activePanel"
            :data-source-lines="String(activeCodeLineCount)"
            :aria-label="sourceMetaLabel"
          >
            <span class="doc-demo__source-meta-item">SFC</span>
            <span class="doc-demo__source-meta-separator" aria-hidden="true">/</span>
            <span class="doc-demo__source-meta-item">{{ activePanel }}</span>
            <span class="doc-demo__source-meta-separator" aria-hidden="true">/</span>
            <span class="doc-demo__source-meta-item">{{ activeCodeLineCount }} lines</span>
          </div>
          <ExampleSourceActions
            data-source-action-layout="element-plus-compact"
            action-attribute="data-demo-action"
            language-attribute="data-demo-language"
            aria-label="示例操作"
            language-aria-label="代码语言"
            tools-aria-label="示例操作"
            root-class="doc-demo__source-actions"
            languages-class="doc-demo__source-language"
            language-class="doc-demo__language"
            tools-class="doc-demo__actions doc-demo__tools"
            tool-class="doc-demo__tool"
            glyph-class="doc-demo__tool-glyph"
            text-class="doc-demo__tool-text"
            :active-language="activePanel"
            :language-options="sourceLanguageOptions"
            :actions="sourceActions"
            @update:language="activePanel = $event"
            @action="handleSourceAction"
          />
        </div>
        <pre class="doc-demo__code-grid" aria-label="示例源代码"><code>
          <span
            v-for="line in activeCodeLines"
            :key="line.key"
            class="doc-demo__code-line"
          ><span class="doc-demo__line-number" aria-hidden="true">{{ line.number }}</span><span class="doc-demo__line-content"><span
              v-for="(token, tokenIndex) in line.tokens"
              :key="`${line.key}-${tokenIndex}`"
              class="doc-demo__token"
              :class="`doc-demo__token--${token.kind}`"
            >{{ token.text }}</span></span></span>
        </code></pre>
      </div>

      <button
        v-if="codePanels.length && isCodeOpen"
        type="button"
        class="doc-demo__collapse"
        data-source-placement="bottom-collapse"
        :aria-controls="sourcePanelId"
        aria-expanded="false"
        @click="hideCodePanel"
      >
        <span class="doc-demo__collapse-icon" aria-hidden="true"></span>
        <span class="doc-demo__source-state">{{ sourceStateText }}</span>
      </button>

      <footer v-if="usage.length" class="doc-demo__footer">
        <div class="doc-demo__usage" aria-label="Usage notes">
          <span v-for="item in usage" :key="item">{{ item }}</span>
        </div>
      </footer>
    </div>
  </section>
</template>
