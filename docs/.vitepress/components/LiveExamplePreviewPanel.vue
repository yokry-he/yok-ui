<script setup lang="ts">
interface ValidationIssue {
  templateLine: number
  sourceLine: number
  excerpt: string
  suggestion: string
}

defineProps<{
  previewViewport: string
  previewViewportLabel: string
  previewNotice: string
  showImagePreviewAction: boolean
  validationError: string
  validationIssue: ValidationIssue | null
  copiedDiagnostic: boolean
}>()

defineEmits<{
  'open-image-preview': []
  'focus-validation-line': []
  'copy-diagnostic-snippet': []
  'preview-frame-click': [event: MouseEvent]
}>()
</script>

<template>
  <div class="live-example-runner__preview">
    <header>
      <div>
        <span>Preview · {{ previewViewportLabel }}</span>
        <small role="status">{{ previewNotice }}</small>
      </div>
      <button
        v-if="showImagePreviewAction"
        type="button"
        class="live-example-runner__preview-action"
        @click="$emit('open-image-preview')"
      >
        打开预览
      </button>
    </header>
    <div v-if="validationError" class="live-example-runner__error" role="alert">
      <strong>示例无法运行</strong>
      <span>{{ validationError }}</span>
      <div v-if="validationIssue" class="live-example-runner__diagnostic">
        <div>
          <span>定位</span>
          <strong>template 第 {{ validationIssue.templateLine }} 行</strong>
          <span>SFC 第 {{ validationIssue.sourceLine }} 行</span>
        </div>
        <code>{{ validationIssue.excerpt }}</code>
        <p>{{ validationIssue.suggestion }}</p>
        <nav class="live-example-runner__diagnostic-actions" aria-label="Diagnostic actions">
          <button type="button" @click="$emit('focus-validation-line')">定位到编辑器</button>
          <button type="button" @click="$emit('copy-diagnostic-snippet')">
            {{ copiedDiagnostic ? '已复制诊断' : '复制诊断片段' }}
          </button>
        </nav>
      </div>
    </div>
    <div
      class="live-example-runner__stage"
      :class="[
        `live-example-runner__stage--${previewViewport}`,
        { 'live-example-runner__stage--stale': validationError }
      ]"
    >
      <div class="live-example-runner__frame" @click.capture="$emit('preview-frame-click', $event)">
        <slot />
      </div>
    </div>
  </div>
</template>
