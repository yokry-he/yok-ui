<script setup lang="ts">
import { computed } from 'vue'
import { createCodeHighlightLines } from '../utils/codeHighlight'
import ExampleSourceActions from './ExampleSourceActions.vue'

type SourcePanelMode = 'sfc' | 'template' | 'diff' | 'install' | 'repro'
type SourceLanguageMode = 'ts' | 'js'
type InstallPackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

interface Option<T extends string> {
  value: T
  label: string
}

interface SourceDiffSummary {
  added: number
  removed: number
  unchanged: number
}

const props = defineProps<{
  sourcePanelMode: SourcePanelMode
  sourcePanelModeLabel: string
  sourcePanelOptions: readonly Option<SourcePanelMode>[]
  showSourceLanguageSwitch: boolean
  sourceLanguageMode: SourceLanguageMode
  sourceLanguageOptions: readonly Option<SourceLanguageMode>[]
  copiedSourcePanel: boolean
  sourceDiffSummary: SourceDiffSummary
  installPackageManager: InstallPackageManager
  installPackageManagerOptions: readonly Option<InstallPackageManager>[]
  sourcePanelCode: string
}>()

const sourceCodeLines = computed(() => createCodeHighlightLines(props.sourcePanelCode, `${props.sourcePanelMode}-${props.sourceLanguageMode}`))
const sourcePanelActions = computed(() => [
  {
    key: 'copy-source',
    tooltip: props.copiedSourcePanel ? `已复制 ${props.sourcePanelModeLabel}` : '复制源码',
    label: props.copiedSourcePanel ? `已复制 ${props.sourcePanelModeLabel}` : '复制源码',
    glyph: '',
    icon: 'copy',
    text: 'Copy source',
    className: 'live-example-runner__source-copy',
    feedback: props.copiedSourcePanel,
    feedbackText: '已复制'
  },
  {
    key: 'hide-source',
    tooltip: '隐藏源码',
    label: '隐藏源码',
    glyph: '',
    icon: 'code',
    text: 'Hide source',
    controls: 'live-example-source-panel'
  }
])

const emit = defineEmits<{
  'update:sourcePanelMode': [value: SourcePanelMode]
  'update:sourceLanguageMode': [value: SourceLanguageMode]
  'update:installPackageManager': [value: InstallPackageManager]
  'copy-source': []
  'hide-source': []
}>()

function handleSourceAction(key: string) {
  if (key === 'copy-source') {
    emit('copy-source')
    return
  }

  if (key === 'hide-source') {
    emit('hide-source')
  }
}
</script>

<template>
  <div
    id="live-example-source-panel"
    class="live-example-runner__source-panel"
    data-source-panel="element-plus"
    tabindex="-1"
    aria-label="Formatted source code"
  >
    <ul
      v-if="sourcePanelMode === 'diff'"
      class="live-example-runner__diff-summary"
      aria-label="Source diff summary"
    >
      <li>
        <span>Added</span>
        <strong>{{ sourceDiffSummary.added }}</strong>
      </li>
      <li>
        <span>Removed</span>
        <strong>{{ sourceDiffSummary.removed }}</strong>
      </li>
      <li>
        <span>Unchanged</span>
        <strong>{{ sourceDiffSummary.unchanged }}</strong>
      </li>
    </ul>
    <div class="live-example-runner__source-code-shell" data-source-panel="element-plus">
      <div class="live-example-runner__source-modebar" data-source-placement="code-top-left">
        <div class="live-example-runner__source-tabs" role="tablist" aria-label="Source view">
          <button
            v-for="option in sourcePanelOptions"
            :key="option.value"
            type="button"
            class="live-example-runner__source-tab"
            role="tab"
            :aria-selected="sourcePanelMode === option.value ? 'true' : 'false'"
            @click="emit('update:sourcePanelMode', option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <div
          v-if="sourcePanelMode === 'install'"
          class="live-example-runner__package-managers"
          aria-label="Package manager"
        >
          <button
            v-for="option in installPackageManagerOptions"
            :key="option.value"
            type="button"
            class="live-example-runner__package-manager"
            :aria-pressed="installPackageManager === option.value ? 'true' : 'false'"
            @click="emit('update:installPackageManager', option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      <ExampleSourceActions
        data-source-placement="code-top-right"
        action-attribute="data-live-source-action"
        language-attribute="data-live-source-action"
        language-value-prefix="language-"
        aria-label="Element style source actions"
        language-aria-label="Source language"
        tools-aria-label="Source panel actions"
        root-class="live-example-runner__source-chrome"
        languages-class="live-example-runner__source-languages"
        language-class="live-example-runner__source-language"
        tools-class="live-example-runner__source-tools"
        tool-class="live-example-runner__source-tool"
        glyph-class="live-example-runner__source-tool-glyph"
        text-class="live-example-runner__source-tool-text"
        :active-language="sourceLanguageMode"
        :language-options="showSourceLanguageSwitch ? sourceLanguageOptions : []"
        :actions="sourcePanelActions"
        @update:language="emit('update:sourceLanguageMode', $event as SourceLanguageMode)"
        @action="handleSourceAction"
      />
      <pre
        class="live-example-runner__source-code"
        :data-language="showSourceLanguageSwitch ? sourceLanguageMode : sourcePanelMode"
        aria-label="当前示例源码"
      ><code>
        <span
          v-for="line in sourceCodeLines"
          :key="line.key"
          class="live-example-runner__source-code-line"
        ><span class="live-example-runner__source-line-number" aria-hidden="true">{{ line.number }}</span><span class="live-example-runner__source-line-content"><span
              v-for="(token, tokenIndex) in line.tokens"
              :key="`${line.key}-${tokenIndex}`"
              class="live-example-runner__source-token"
              :class="`live-example-runner__source-token--${token.kind}`"
            >{{ token.text }}</span></span></span>
      </code></pre>
    </div>
    <footer class="live-example-runner__source-footer" data-source-placement="bottom-collapse" aria-label="Source panel footer">
      <button
        type="button"
        class="live-example-runner__source-collapse"
        aria-label="隐藏源代码"
        aria-controls="live-example-source-panel"
        aria-expanded="false"
        @click="emit('hide-source')"
      >
        <span class="live-example-runner__source-collapse-icon" aria-hidden="true"></span>
        <span>隐藏源代码</span>
      </button>
    </footer>
  </div>
</template>
