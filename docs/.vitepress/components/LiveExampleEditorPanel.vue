<script setup lang="ts">
import { ref } from 'vue'

interface EditorLiveStats {
  lines: number
  status: string
}

interface ValidationIssue {
  sourceLine: number
}

defineProps<{
  modelValue: string
  lineNumbers: readonly number[]
  editorScrollTop: number
  liveStats: EditorLiveStats
  validationIssue: ValidationIssue | null
  copiedDiagnostic: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'editor-scroll': [event: Event]
  'focus-validation-line': []
  'copy-diagnostic-snippet': []
}>()

const textarea = ref<HTMLTextAreaElement | null>(null)

defineExpose({
  textarea
})
</script>

<template>
  <section class="live-example-runner__editor" aria-label="Editable SFC source editor">
    <header class="live-example-runner__editor-header">
      <div class="live-example-runner__editor-title">
        <span>Editable SFC</span>
        <strong>{{ liveStats.lines }} lines · {{ liveStats.status }}</strong>
      </div>
      <div class="live-example-runner__editor-actions" aria-label="Editor actions">
        <button type="button" :disabled="!validationIssue" @click="$emit('focus-validation-line')">定位错误</button>
        <button type="button" :disabled="!validationIssue" @click="$emit('copy-diagnostic-snippet')">
          {{ copiedDiagnostic ? '已复制诊断' : '复制诊断' }}
        </button>
      </div>
    </header>
    <div class="live-example-runner__editor-shell">
      <ol
        class="live-example-runner__line-gutter"
        aria-hidden="true"
        :style="{ transform: `translateY(-${editorScrollTop}px)` }"
      >
        <li
          v-for="line in lineNumbers"
          :key="line"
          :data-active="validationIssue?.sourceLine === line ? 'true' : 'false'"
        >
          {{ line }}
        </li>
      </ol>
      <textarea
        ref="textarea"
        :value="modelValue"
        spellcheck="false"
        wrap="off"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        @scroll="emit('editor-scroll', $event)"
      />
    </div>
  </section>
</template>
