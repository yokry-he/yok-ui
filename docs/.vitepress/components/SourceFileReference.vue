<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { components } from '../data/componentRegistry'
import { createCodeHighlightLines } from '../utils/codeHighlight'

const sourceModules = import.meta.glob('../../../packages/*/src/components/**/*.vue', {
  eager: true,
  import: 'default',
  query: '?raw'
}) as Record<string, string>

const sourceFiles = Object.fromEntries(
  Object.entries(sourceModules).map(([path, source]) => [
    path.replace(/^\.\.\/\.\.\/\.\.\//, ''),
    source
  ])
)

const routeFile = ref('')

if (typeof window !== 'undefined') {
  routeFile.value = new URLSearchParams(window.location.search).get('file') ?? ''
}

const normalizedFile = computed(() =>
  routeFile.value
    .replace(/^\/+/, '')
    .replace(/\.\.\//g, '')
)
const sourceCode = computed(() => sourceFiles[normalizedFile.value] ?? '')
const sourceLines = computed(() => createCodeHighlightLines(sourceCode.value, normalizedFile.value || 'source-file'))
const copiedSource = ref(false)
const isHydrated = ref(false)
const copyButton = ref<HTMLButtonElement | null>(null)
const componentName = computed(() => normalizedFile.value.match(/\/(Y[A-Za-z0-9]+)\.vue$/)?.[1] ?? '')
const componentMeta = computed(() => components.find((item) => item.name === componentName.value))
const componentDocsLabel = computed(() => componentMeta.value ? `返回 ${componentMeta.value.title} 文档` : '返回组件文档')
const clipboardWriteTimeoutMs = 250

onMounted(() => {
  isHydrated.value = true
  copyButton.value?.addEventListener('click', copySourceFile)
})

onBeforeUnmount(() => {
  copyButton.value?.removeEventListener('click', copySourceFile)
})

async function writeClipboardText(text: string) {
  try {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error('Clipboard write timed out')), clipboardWriteTimeoutMs)
      })
    ])
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('aria-hidden', 'true')
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.inset = '0 auto auto 0'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, text.length)

    try {
      return document.execCommand('copy')
    } finally {
      textarea.remove()
    }
  }
}

async function copySourceFile() {
  if (!sourceCode.value) {
    return
  }

  copiedSource.value = await writeClipboardText(sourceCode.value)
}
</script>

<template>
  <section class="source-file-reference" aria-label="Yok UI component source file">
    <p class="docs-eyebrow">component source</p>
    <h1>组件源码</h1>
    <p class="source-file-reference__intro">
      从组件文档示例进入源码文件，检查真实组件实现、props、事件和样式 token。
    </p>
    <div class="source-file-reference__actions">
      <code class="source-file-reference__path">{{ normalizedFile || '未选择源码文件' }}</code>
      <a
        v-if="componentMeta"
        class="source-file-reference__docs-link"
        :href="componentMeta.docs"
      >
        {{ componentDocsLabel }}
      </a>
      <button
        v-if="sourceCode"
        ref="copyButton"
        type="button"
        class="source-file-reference__copy"
        :disabled="!isHydrated"
        :data-hydrated="isHydrated ? 'true' : 'false'"
        aria-label="复制当前源码"
      >
        {{ copiedSource ? '已复制' : isHydrated ? '复制源码' : '准备复制' }}
      </button>
    </div>

    <div v-if="sourceCode" class="source-file-reference__panel">
      <pre class="source-file-reference__code" data-language="vue" aria-label="组件源码"><code>
        <span
          v-for="line in sourceLines"
          :key="line.key"
          class="source-file-reference__line"
        ><span class="source-file-reference__line-number" aria-hidden="true">{{ line.number }}</span><span class="source-file-reference__line-content"><span
              v-for="(token, tokenIndex) in line.tokens"
              :key="`${line.key}-${tokenIndex}`"
              class="source-file-reference__token"
              :class="`source-file-reference__token--${token.kind}`"
            >{{ token.text }}</span></span></span>
      </code></pre>
    </div>

    <div v-else class="source-file-reference__empty" role="status">
      源码文件未收录。请从组件文档的 Live example 工具栏重新进入，或检查 file 参数是否对应 packages 下的组件文件。
    </div>
  </section>
</template>
