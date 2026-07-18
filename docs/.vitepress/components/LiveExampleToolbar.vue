<script setup lang="ts">
import { computed } from 'vue'
import ExampleSourceActions from './ExampleSourceActions.vue'

interface SelectOption {
  label: string
  value: string
}

interface ThemeOption {
  label: string
  name: string
}

interface Props {
  starterOptions: readonly SelectOption[]
  selectedPreset: string
  copyModeOptions: readonly SelectOption[]
  copyMode: string
  sourceLanguageOptions: readonly SelectOption[]
  sourceLanguageMode: string
  themeOptions: readonly ThemeOption[]
  selectedTheme: string
  previewViewportOptions: readonly SelectOption[]
  previewViewport: string
  autoRun: boolean
  hasPendingChanges: boolean
  canResetCode: boolean
  validationError?: string | boolean | null
  showSourcePanel: boolean
  hasStoredDraft: boolean
  copied: boolean
  copiedLabel: string
  copiedRunReport: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedPreset': [value: string]
  'update:copyMode': [value: string]
  'update:sourceLanguageMode': [value: string]
  'update:selectedTheme': [value: string]
  'update:previewViewport': [value: string]
  'apply-starter': []
  'apply-preview-theme': []
  'toggle-auto-run': []
  'build-preview': []
  'format-code': []
  'toggle-source-panel': []
  'clear-draft': []
  'reset-code': []
  'copy-code': []
  'copy-run-report': []
}>()

const runDisabled = computed(() => !props.hasPendingChanges && !props.validationError)
const toolbarSourceActions = computed(() => [
  {
    key: 'copy-code',
    tooltip: props.copied ? `已复制 ${props.copiedLabel}` : '复制代码',
    label: props.copied ? `已复制 ${props.copiedLabel}` : '复制代码',
    glyph: '',
    icon: 'copy',
    text: props.copied ? `已复制 ${props.copiedLabel}` : '复制代码',
    feedback: props.copied,
    feedbackText: `已复制 ${props.copiedLabel}`,
    className: 'live-example-runner__copy-action'
  },
  {
    key: 'reset-code',
    tooltip: props.canResetCode ? '恢复源码' : '源码未修改',
    label: props.canResetCode ? '恢复源码' : '源码未修改',
    glyph: '',
    icon: 'reset',
    text: '恢复源码',
    disabled: !props.canResetCode,
    className: 'live-example-runner__reset-action'
  },
  {
    key: 'toggle-source',
    tooltip: props.showSourcePanel ? '收起源码' : '查看源码',
    label: props.showSourcePanel ? '收起源码' : '查看源码',
    glyph: '',
    icon: 'code',
    text: props.showSourcePanel ? '收起源码' : '查看源码',
    expanded: props.showSourcePanel,
    controls: 'live-example-source-panel',
    className: 'live-example-runner__source-action'
  }
])

function readSelectValue(event: Event) {
  return (event.target as HTMLSelectElement).value
}

function updateSelectedPreset(event: Event) {
  emit('update:selectedPreset', readSelectValue(event))
  emit('apply-starter')
}

function updateCopyMode(event: Event) {
  emit('update:copyMode', readSelectValue(event))
}

function updateSourceLanguageMode(value: string) {
  emit('update:sourceLanguageMode', value)
}

function updateSelectedTheme(event: Event) {
  emit('update:selectedTheme', readSelectValue(event))
  emit('apply-preview-theme')
}

function handleToolbarSourceAction(key: string) {
  if (key === 'toggle-source') {
    emit('toggle-source-panel')
    return
  }

  if (key === 'copy-code') {
    emit('copy-code')
    return
  }

  if (key === 'reset-code' && props.canResetCode) {
    emit('reset-code')
  }
}
</script>

<template>
  <div class="live-example-runner__toolbar" aria-label="Live example controls">
    <div class="live-example-runner__toolbar-primary">
      <details class="live-example-runner__toolbar-settings">
        <summary class="live-example-runner__toolbar-settings-summary">
          <span>示例设置</span>
          <strong>{{ autoRun ? '自动运行' : '手动运行' }}</strong>
        </summary>
        <div class="live-example-runner__toolbar-actions live-example-runner__toolbar-secondary">
          <label class="live-example-runner__starter">
            <span>示例模板</span>
            <select :value="selectedPreset" @change="updateSelectedPreset">
              <option v-for="option in starterOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label class="live-example-runner__starter live-example-runner__starter--compact">
            <span>复制范围</span>
            <select :value="copyMode" @change="updateCopyMode">
              <option v-for="option in copyModeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label class="live-example-runner__starter live-example-runner__starter--compact">
            <span>主题预设</span>
            <select :value="selectedTheme" class="live-example-runner__theme-select" @change="updateSelectedTheme">
              <option v-for="option in themeOptions" :key="option.name" :value="option.name">
                {{ option.label }}
              </option>
            </select>
          </label>
          <div class="live-example-runner__viewport" aria-label="Preview viewport">
            <button
              v-for="option in previewViewportOptions"
              :key="option.value"
              type="button"
              :aria-pressed="previewViewport === option.value ? 'true' : 'false'"
              @click="emit('update:previewViewport', option.value)"
            >
              {{ option.label }}
            </button>
          </div>
          <button type="button" :aria-pressed="autoRun ? 'true' : 'false'" @click="emit('toggle-auto-run')">
            {{ autoRun ? '自动运行' : '手动运行' }}
          </button>
          <button type="button" :disabled="runDisabled" @click="emit('build-preview')">
            运行
          </button>
          <button type="button" @click="emit('format-code')">格式化</button>
          <button type="button" :disabled="!hasStoredDraft" @click="emit('clear-draft')">清除草稿</button>
          <button class="live-example-runner__report-copy" type="button" @click="emit('copy-run-report')">
            {{ copiedRunReport ? '已复制报告' : '复制报告' }}
          </button>
        </div>
      </details>
      <div class="live-example-runner__toolbar-actions live-example-runner__toolbar-main-actions">
        <ExampleSourceActions
          action-attribute="data-live-toolbar-action"
          language-attribute="data-live-toolbar-action"
          language-value-prefix="language-"
          aria-label="Example source actions"
          language-aria-label="Source language"
          tools-aria-label="Example source tools"
          root-class="live-example-runner__example-actions"
          languages-class="live-example-runner__source-language-actions"
          language-class="live-example-runner__source-language-action"
          tools-class="live-example-runner__example-action-tools"
          tool-class="live-example-runner__example-action"
          glyph-class="live-example-runner__example-action-glyph"
          text-class="live-example-runner__example-action-text"
          :active-language="sourceLanguageMode"
          :language-options="sourceLanguageOptions"
          :actions="toolbarSourceActions"
          @update:language="updateSourceLanguageMode"
          @action="handleToolbarSourceAction"
        />
      </div>
    </div>
  </div>
</template>
