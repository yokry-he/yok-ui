<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'

defineOptions({
  name: 'YUpload'
})

export type YUploadStatus = 'ready' | 'uploading' | 'success' | 'error'
export type YUploadRejectReason = 'accept' | 'disabled' | 'exceed' | 'size' | 'before-upload'

export interface YUploadFile {
  id: string
  name: string
  size: number
  type?: string
  url?: string
  thumbUrl?: string
  status?: YUploadStatus
  progress?: number
  message?: string
  raw?: File
}

export interface YUploadRejectedFile extends YUploadFile {
  reason: YUploadRejectReason
}

export interface YUploadRequestResult {
  message?: string
  response?: unknown
}

export interface YUploadAbortHandle {
  abort: () => void
}

export interface YUploadRequestOptions {
  file: YUploadFile
  nativeFile: File
  signal: AbortSignal
  onProgress: (progress: number) => void
  onSuccess: (response?: unknown) => void
  onError: (error: unknown) => void
}

export type YUploadBeforeUpload = (file: File, files: File[]) => boolean | string | void | Promise<boolean | string | void>
export type YUploadRequestHandler = (options: YUploadRequestOptions) =>
  | void
  | YUploadAbortHandle
  | YUploadRequestResult
  | Promise<void | YUploadAbortHandle | YUploadRequestResult>

interface Props {
  id?: string
  modelValue?: YUploadFile[]
  rejectedFiles?: YUploadRejectedFile[]
  label?: string
  description?: string
  ariaDescribedby?: string
  buttonLabel?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  drag?: boolean
  maxFiles?: number
  maxSize?: number
  emptyText?: string
  dropLabel?: string
  invalid?: boolean
  error?: string
  autoUpload?: boolean
  beforeUpload?: YUploadBeforeUpload
  customRequest?: YUploadRequestHandler
  listType?: 'text' | 'picture'
  previewable?: boolean
  downloadable?: boolean
  sortable?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: () => [],
  rejectedFiles: () => [],
  label: 'Upload files',
  description: '',
  ariaDescribedby: '',
  buttonLabel: 'Choose files',
  accept: '',
  multiple: false,
  disabled: false,
  drag: false,
  maxFiles: 0,
  maxSize: 0,
  emptyText: 'No files selected yet',
  dropLabel: 'Drop files here or click to choose',
  invalid: false,
  error: '',
  autoUpload: false,
  beforeUpload: undefined,
  customRequest: undefined,
  listType: 'text',
  previewable: false,
  downloadable: false,
  sortable: false,
  clearable: false
})

const emit = defineEmits<{
  'update:modelValue': [files: YUploadFile[]]
  change: [files: YUploadFile[]]
  remove: [file: YUploadFile, files: YUploadFile[]]
  drop: [files: YUploadFile[], event: DragEvent]
  exceed: [files: YUploadFile[], maxFiles: number]
  reject: [files: File[], reason: YUploadRejectReason]
  progress: [file: YUploadFile, files: YUploadFile[]]
  success: [file: YUploadFile, response: unknown, files: YUploadFile[]]
  error: [file: YUploadFile, error: unknown, files: YUploadFile[]]
  retry: [file: YUploadFile]
  abort: [file: YUploadFile, files: YUploadFile[]]
  preview: [file: YUploadFile]
  download: [file: YUploadFile]
  reorder: [files: YUploadFile[]]
  clear: [files: YUploadFile[]]
  dismissReject: [file: YUploadRejectedFile, files: YUploadRejectedFile[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const generatedId = useId()
const runtimeRejectedFiles = ref<YUploadRejectedFile[]>([])
const currentFiles = ref<YUploadFile[]>(props.modelValue)
const requestHandles = new Map<string, YUploadAbortHandle>()

watch(() => props.modelValue, (value) => {
  currentFiles.value = value
}, { immediate: true })

const uploadId = computed(() => props.id || `yok-upload-${generatedId}`)
const labelId = computed(() => `${uploadId.value}-label`)
const descriptionId = computed(() => `${uploadId.value}-description`)
const errorId = computed(() => `${uploadId.value}-error`)
const rejectedId = computed(() => `${uploadId.value}-rejected`)
const displayedRejectedFiles = computed(() => [...props.rejectedFiles, ...runtimeRejectedFiles.value])
const hasInvalidState = computed(() => props.invalid || Boolean(props.error) || displayedRejectedFiles.value.length > 0)
const hasListActions = computed(() => props.clearable && props.modelValue.length > 0)
const describedBy = computed(() => [
  props.ariaDescribedby,
  props.description ? descriptionId.value : '',
  props.error ? errorId.value : '',
  displayedRejectedFiles.value.length ? rejectedId.value : ''
].filter(Boolean).join(' ') || undefined)

const selectedCountText = computed(() => {
  const count = props.modelValue.length

  if (count === 0) {
    return props.emptyText
  }

  return `${count} file${count > 1 ? 's' : ''} selected`
})

function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function createUploadFile(file: File, index: number): YUploadFile {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'ready',
    raw: file
  }
}

function createRejectedFile(file: File, reason: YUploadRejectReason, index: number, message: string): YUploadRejectedFile {
  return {
    ...createUploadFile(file, index),
    id: `rejected-${reason}-${file.name}-${file.size}-${file.lastModified}-${index}`,
    status: 'error',
    reason,
    message
  }
}

function getMaxSizeMessage() {
  return `Max file size is ${formatSize(props.maxSize)}.`
}

function isAcceptedFile(file: File) {
  if (!props.accept) {
    return true
  }

  const rules = props.accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  return rules.some((rule) => {
    if (rule.startsWith('.')) {
      return fileName.endsWith(rule)
    }

    if (rule.endsWith('/*')) {
      return fileType.startsWith(rule.slice(0, -1))
    }

    return fileType === rule
  })
}

function commitFiles(files: YUploadFile[]) {
  currentFiles.value = files
  emit('update:modelValue', files)
  emit('change', files)
}

function commitUploadState(fileId: string, patch: Partial<YUploadFile>) {
  const files = currentFiles.value.length ? currentFiles.value : props.modelValue
  const nextFiles = files.map((file) => file.id === fileId ? { ...file, ...patch } : file)
  const updatedFile = nextFiles.find((file) => file.id === fileId)

  commitFiles(nextFiles)

  return {
    file: updatedFile,
    files: nextFiles
  }
}

function emitRejectedFiles(groups: Map<YUploadRejectReason, File[]>) {
  for (const [reason, files] of groups) {
    if (files.length) {
      emit('reject', files, reason)
    }
  }
}

async function resolveNextFiles(nativeFiles: File[]) {
  const nextRejectedFiles: YUploadRejectedFile[] = []
  const rejectedGroups = new Map<YUploadRejectReason, File[]>()
  const acceptedFiles: File[] = []

  function rejectFile(file: File, reason: YUploadRejectReason, message: string) {
    const files = rejectedGroups.get(reason) ?? []

    files.push(file)
    rejectedGroups.set(reason, files)
    nextRejectedFiles.push(createRejectedFile(file, reason, nextRejectedFiles.length, message))
  }

  for (const file of nativeFiles) {
    if (!isAcceptedFile(file)) {
      rejectFile(file, 'accept', props.accept ? `Unsupported file type. Use ${props.accept}.` : 'Unsupported file type.')
      continue
    }

    if (props.maxSize > 0 && file.size > props.maxSize) {
      rejectFile(file, 'size', getMaxSizeMessage())
      continue
    }

    if (props.beforeUpload) {
      const result = await props.beforeUpload(file, nativeFiles)

      if (result === false || typeof result === 'string') {
        rejectFile(file, 'before-upload', typeof result === 'string' ? result : 'File was blocked before upload.')
        continue
      }
    }

    acceptedFiles.push(file)
  }

  emitRejectedFiles(rejectedGroups)

  const selectedFiles = acceptedFiles.map(createUploadFile)
  const nextFiles = props.multiple ? [...props.modelValue, ...selectedFiles] : selectedFiles.slice(0, 1)
  const limitedFiles = props.maxFiles > 0 ? nextFiles.slice(0, props.maxFiles) : nextFiles

  if (props.maxFiles > 0 && nextFiles.length > props.maxFiles) {
    const exceededFiles = nextFiles.slice(props.maxFiles)
    const exceededNativeFiles = exceededFiles.map((file) => file.raw).filter((file): file is File => Boolean(file))

    nextRejectedFiles.push(...exceededFiles.map((file, index) => ({
      ...file,
      id: `rejected-exceed-${file.id}-${index}`,
      status: 'error' as const,
      reason: 'exceed' as const,
      message: `Max ${props.maxFiles} file${props.maxFiles > 1 ? 's' : ''}. Remove one item before adding more.`
    })))
    emit('exceed', selectedFiles, props.maxFiles)
    if (exceededNativeFiles.length) {
      emit('reject', exceededNativeFiles, 'exceed')
    }
  }

  runtimeRejectedFiles.value = nextRejectedFiles

  return limitedFiles
}

function resolveRequestResult(result: void | YUploadAbortHandle | YUploadRequestResult): YUploadRequestResult {
  if (!result || 'abort' in result) {
    return {}
  }

  return result
}

function startUpload(file: YUploadFile) {
  if (!props.customRequest || !file.raw || props.disabled) {
    return
  }

  const controller = new AbortController()
  let settled = false

  const updateUploadingFile = commitUploadState(file.id, {
    status: 'uploading',
    progress: file.progress ?? 0,
    message: 'Uploading'
  }).file

  if (updateUploadingFile) {
    emit('progress', updateUploadingFile, currentFiles.value)
  }

  const failUpload = (error: unknown) => {
    if (settled) {
      return
    }

    settled = true
    requestHandles.delete(file.id)

    const message = error instanceof Error ? error.message : 'Upload failed.'
    const { file: errorFile, files } = commitUploadState(file.id, {
      status: 'error',
      message
    })

    if (errorFile) {
      emit('error', errorFile, error, files)
    }
  }

  const finishUpload = (response?: unknown, message = 'Uploaded') => {
    if (settled) {
      return
    }

    settled = true
    requestHandles.delete(file.id)

    const { file: successFile, files } = commitUploadState(file.id, {
      status: 'success',
      progress: 100,
      message
    })

    if (successFile) {
      emit('success', successFile, response, files)
    }
  }

  Promise.resolve(props.customRequest({
    file,
    nativeFile: file.raw,
    signal: controller.signal,
    onProgress: (progress) => {
      if (settled) {
        return
      }

      const { file: progressFile, files } = commitUploadState(file.id, {
        status: 'uploading',
        progress: Math.min(100, Math.max(0, progress)),
        message: 'Uploading'
      })

      if (progressFile) {
        emit('progress', progressFile, files)
      }
    },
    onSuccess: (response) => finishUpload(response),
    onError: (error) => failUpload(error)
  })).then((result) => {
    if (result && 'abort' in result) {
      requestHandles.set(file.id, result)
      return
    }

    const requestResult = resolveRequestResult(result)

    finishUpload(requestResult.response, requestResult.message)
  }).catch((error) => {
    failUpload(error)
  })

  requestHandles.set(file.id, {
    abort: () => {
      controller.abort()
    }
  })
}

function startAutoUploads(files: YUploadFile[]) {
  if (!props.autoUpload || !props.customRequest) {
    return
  }

  files
    .filter((file) => file.raw && file.status === 'ready')
    .forEach((file) => startUpload(file))
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFiles = Array.from(target.files ?? [])
  const limitedFiles = await resolveNextFiles(selectedFiles)

  commitFiles(limitedFiles)
  startAutoUploads(limitedFiles)
  target.value = ''
}

function removeFile(file: YUploadFile) {
  const nextFiles = props.modelValue.filter((item) => item.id !== file.id)

  emit('update:modelValue', nextFiles)
  emit('remove', file, nextFiles)
}

function clearFiles() {
  const files = [...props.modelValue]

  currentFiles.value = []
  emit('update:modelValue', [])
  emit('change', [])
  emit('clear', files)
}

function dismissRejectedFile(file: YUploadRejectedFile) {
  runtimeRejectedFiles.value = runtimeRejectedFiles.value.filter((item) => item.id !== file.id)
  emit('dismissReject', file, [...runtimeRejectedFiles.value])
}

function retryFile(file: YUploadFile) {
  emit('retry', file)
  startUpload({
    ...file,
    status: 'ready',
    progress: 0,
    message: ''
  })
}

function previewFile(file: YUploadFile) {
  emit('preview', file)
}

function downloadFile(file: YUploadFile) {
  emit('download', file)
}

function moveFile(file: YUploadFile, direction: -1 | 1) {
  const currentIndex = props.modelValue.findIndex((item) => item.id === file.id)
  const nextIndex = currentIndex + direction

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= props.modelValue.length) {
    return
  }

  const nextFiles = [...props.modelValue]
  const [movedFile] = nextFiles.splice(currentIndex, 1)

  nextFiles.splice(nextIndex, 0, movedFile)
  currentFiles.value = nextFiles
  emit('update:modelValue', nextFiles)
  emit('change', nextFiles)
  emit('reorder', nextFiles)
}

async function submit() {
  const files = currentFiles.value.length ? currentFiles.value : props.modelValue

  files
    .filter((file) => file.raw && ['ready', 'error'].includes(file.status || 'ready'))
    .forEach((file) => startUpload({
      ...file,
      status: 'ready',
      progress: 0,
      message: ''
    }))

  await Promise.resolve()
}

function abortFile(file: YUploadFile) {
  requestHandles.get(file.id)?.abort()
  requestHandles.delete(file.id)

  const { file: abortedFile, files } = commitUploadState(file.id, {
    status: 'error',
    message: 'Upload canceled.'
  })

  if (abortedFile) {
    emit('abort', file, files)
  }
}

function openPicker() {
  if (!props.disabled) {
    inputRef.value?.click()
  }
}

function handleDragEnter(event: DragEvent) {
  if (!props.drag) {
    return
  }

  event.preventDefault()

  if (!props.disabled) {
    isDragging.value = true
  }
}

function handleDragOver(event: DragEvent) {
  if (!props.drag) {
    return
  }

  event.preventDefault()

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = props.disabled ? 'none' : 'copy'
  }
}

function handleDragLeave() {
  isDragging.value = false
}

async function handleDrop(event: DragEvent) {
  if (!props.drag) {
    return
  }

  event.preventDefault()
  isDragging.value = false

  const nativeFiles = Array.from(event.dataTransfer?.files ?? [])

  if (props.disabled) {
    if (nativeFiles.length) {
      runtimeRejectedFiles.value = nativeFiles.map((file, index) =>
        createRejectedFile(file, 'disabled', index, 'Upload is disabled.')
      )
      emit('reject', nativeFiles, 'disabled')
    }
    return
  }

  const limitedFiles = await resolveNextFiles(nativeFiles)

  emit('drop', limitedFiles, event)
  commitFiles(limitedFiles)
  startAutoUploads(limitedFiles)
}

defineExpose({
  clearFiles,
  submit
})
</script>

<template>
  <section
    class="yok-upload"
    :class="{ 'yok-upload--disabled': disabled, 'yok-upload--invalid': hasInvalidState }"
    :aria-labelledby="labelId"
    :aria-describedby="describedBy"
    :aria-invalid="hasInvalidState ? 'true' : 'false'"
  >
    <div class="yok-upload__header">
      <div>
        <h3 :id="labelId">{{ label }}</h3>
        <p v-if="description" :id="descriptionId">{{ description }}</p>
      </div>
      <span class="yok-upload__header-actions">
        <span class="yok-upload__count" aria-live="polite">{{ selectedCountText }}</span>
        <button
          v-if="hasListActions"
          class="yok-upload__action yok-focus-ring"
          type="button"
          :disabled="disabled"
          aria-label="Clear all files"
          @click="clearFiles"
        >
          Clear
        </button>
      </span>
    </div>

    <div
      class="yok-upload__control"
      :class="{
        'yok-upload__control--drag': drag,
        'yok-upload__control--dragging': isDragging
      }"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="inputRef"
        class="yok-upload__input"
        type="file"
        :accept="accept || undefined"
        :multiple="multiple"
        :disabled="disabled"
        :aria-label="buttonLabel"
        :aria-describedby="describedBy"
        :aria-invalid="hasInvalidState ? 'true' : 'false'"
        @change="handleFileChange"
      />
      <button
        class="yok-upload__button yok-focus-ring"
        type="button"
        :disabled="disabled"
        @click="openPicker"
      >
        {{ buttonLabel }}
      </button>
      <span v-if="drag" class="yok-upload__drop-label">{{ dropLabel }}</span>
      <span v-if="accept" class="yok-upload__accept">Accepts {{ accept }}</span>
    </div>

    <ul v-if="modelValue.length" class="yok-upload__list" aria-label="Selected files">
      <li
        v-for="file in modelValue"
        :key="file.id"
        class="yok-upload__file"
        :class="[`yok-upload__file--${file.status || 'ready'}`, `yok-upload__file--${listType}`]"
      >
        <span class="yok-upload__file-icon" aria-hidden="true">
          <img
            v-if="listType === 'picture' && (file.thumbUrl || file.url)"
            :src="file.thumbUrl || file.url"
            :alt="`${file.name} preview`"
          />
          <template v-else>↑</template>
        </span>
        <span class="yok-upload__file-main">
          <span class="yok-upload__file-name">{{ file.name }}</span>
          <span class="yok-upload__file-meta">
            {{ formatSize(file.size) }}
            <template v-if="file.message"> · {{ file.message }}</template>
            <template v-else-if="file.progress !== undefined"> · {{ Math.round(file.progress) }}%</template>
          </span>
        </span>
        <span class="yok-upload__actions">
          <button
            v-if="sortable"
            class="yok-upload__icon-action yok-focus-ring"
            type="button"
            :disabled="disabled || modelValue[0]?.id === file.id"
            :aria-label="`Move ${file.name} up`"
            @click="moveFile(file, -1)"
          >
            ↑
          </button>
          <button
            v-if="sortable"
            class="yok-upload__icon-action yok-focus-ring"
            type="button"
            :disabled="disabled || modelValue[modelValue.length - 1]?.id === file.id"
            :aria-label="`Move ${file.name} down`"
            @click="moveFile(file, 1)"
          >
            ↓
          </button>
          <button
            v-if="previewable && (file.url || file.thumbUrl)"
            class="yok-upload__action yok-focus-ring"
            type="button"
            :disabled="disabled"
            :aria-label="`Preview ${file.name}`"
            @click="previewFile(file)"
          >
            Preview
          </button>
          <button
            v-if="downloadable && file.url"
            class="yok-upload__action yok-focus-ring"
            type="button"
            :disabled="disabled"
            :aria-label="`Download ${file.name}`"
            @click="downloadFile(file)"
          >
            Download
          </button>
          <button
            v-if="file.status === 'uploading'"
            class="yok-upload__action yok-focus-ring"
            type="button"
            :disabled="disabled"
            :aria-label="`Cancel ${file.name}`"
            @click="abortFile(file)"
          >
            Cancel
          </button>
          <button
            v-if="file.status === 'error' && file.raw"
            class="yok-upload__action yok-focus-ring"
            type="button"
            :disabled="disabled || !customRequest"
            :aria-label="`Retry ${file.name}`"
            @click="retryFile(file)"
          >
            Retry
          </button>
          <button
            class="yok-upload__remove yok-focus-ring"
            type="button"
            :disabled="disabled"
            :aria-label="`Remove ${file.name}`"
            @click="removeFile(file)"
          >
            ×
          </button>
        </span>
      </li>
    </ul>
    <p v-else class="yok-upload__empty" role="status">{{ emptyText }}</p>
    <p v-if="error" :id="errorId" class="yok-upload__error" role="alert">{{ error }}</p>
    <ul
      v-if="displayedRejectedFiles.length"
      :id="rejectedId"
      class="yok-upload__rejected"
      role="alert"
      aria-label="Rejected files"
    >
      <li
        v-for="file in displayedRejectedFiles"
        :key="file.id"
        class="yok-upload__rejected-file"
      >
        <span class="yok-upload__file-main">
          <span class="yok-upload__file-name">{{ file.name }}</span>
          <span class="yok-upload__file-meta">{{ file.message || file.reason }}</span>
        </span>
        <button
          v-if="runtimeRejectedFiles.some((item) => item.id === file.id)"
          class="yok-upload__remove yok-focus-ring"
          type="button"
          :aria-label="`Dismiss ${file.name}`"
          @click="dismissRejectedFile(file)"
        >
          ×
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.yok-upload {
  display: grid;
  min-width: 0;
  gap: var(--yok-space-4);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  padding: var(--yok-space-4);
}

.yok-upload__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--yok-space-4);
  min-width: 0;
}

.yok-upload__header h3,
.yok-upload__header p,
.yok-upload__empty,
.yok-upload__error {
  margin: 0;
}

.yok-upload__header h3 {
  font-size: 16px;
  letter-spacing: 0;
}

.yok-upload__header p {
  margin-top: var(--yok-space-1);
  color: var(--yok-color-textMuted);
  font-size: 13px;
  line-height: 1.6;
}

.yok-upload__count {
  flex: none;
  color: var(--yok-color-textMuted);
  font-size: 12px;
  font-weight: 750;
}

.yok-upload__header-actions {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-upload__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-3);
  min-width: 0;
  border: 1px dashed color-mix(in srgb, var(--yok-color-primary) 28%, var(--yok-color-border));
  border-radius: var(--yok-radius-lg);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 44%, var(--yok-color-surface));
  padding: var(--yok-space-4);
  transition:
    background var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-upload__control--drag {
  min-height: 116px;
  align-content: center;
  justify-content: center;
  text-align: center;
}

.yok-upload__control--dragging {
  border-color: var(--yok-color-primary);
  background: color-mix(in srgb, var(--yok-color-primarySoft) 72%, var(--yok-color-surface));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--yok-color-primary) 12%, transparent);
}

.yok-upload__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.yok-upload__button {
  min-height: 38px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-weight: 750;
  padding: 0 var(--yok-space-4);
  transition:
    background var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast),
    transform var(--yok-motion-fast);
}

.yok-upload__button:hover:not(:disabled) {
  background: var(--yok-color-primarySoft);
  box-shadow: var(--yok-shadow-soft);
  transform: translateY(-1px);
}

.yok-upload__accept,
.yok-upload__drop-label,
.yok-upload__empty,
.yok-upload__file-meta {
  color: var(--yok-color-textMuted);
  font-size: 13px;
}

.yok-upload__drop-label {
  flex: 1 1 100%;
  min-width: 0;
  line-height: 1.6;
}

.yok-upload__list {
  display: grid;
  gap: var(--yok-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-upload__file {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--yok-space-3);
  align-items: center;
  min-width: 0;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
  padding: var(--yok-space-3);
}

.yok-upload__file-icon {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
  font-weight: 900;
  overflow: hidden;
}

.yok-upload__file-icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.yok-upload__file-main {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.yok-upload__file-name {
  overflow: hidden;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yok-upload__file--success .yok-upload__file-icon {
  background: color-mix(in srgb, var(--yok-color-success) 12%, var(--yok-color-surface));
  color: var(--yok-color-success);
}

.yok-upload__file--error .yok-upload__file-icon {
  background: color-mix(in srgb, var(--yok-color-danger) 12%, var(--yok-color-surface));
  color: var(--yok-color-danger);
}

.yok-upload__error {
  color: var(--yok-color-danger);
  font-size: 13px;
  font-weight: 750;
}

.yok-upload__rejected {
  display: grid;
  gap: var(--yok-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.yok-upload__rejected-file {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--yok-space-3);
  align-items: center;
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--yok-color-danger) 34%, var(--yok-color-border));
  border-radius: var(--yok-radius-lg);
  background: color-mix(in srgb, var(--yok-color-danger) 8%, var(--yok-color-surface));
  padding: var(--yok-space-3);
}

.yok-upload--invalid {
  border-color: color-mix(in srgb, var(--yok-color-danger) 42%, var(--yok-color-border));
}

.yok-upload__actions {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--yok-space-1);
  justify-content: flex-end;
  min-width: 0;
}

.yok-upload__action,
.yok-upload__icon-action {
  min-height: 30px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-size: 12px;
  font-weight: 750;
  padding: 0 var(--yok-space-2);
}

.yok-upload__icon-action {
  display: grid;
  width: 30px;
  padding: 0;
  place-items: center;
}

.yok-upload__action:hover:not(:disabled),
.yok-upload__icon-action:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--yok-color-primary) 44%, var(--yok-color-border));
  color: var(--yok-color-primary);
}

.yok-upload__remove {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.yok-upload__remove:hover:not(:disabled) {
  background: color-mix(in srgb, var(--yok-color-danger) 10%, transparent);
  color: var(--yok-color-danger);
}

.yok-upload button:disabled,
.yok-upload--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 640px) {
  .yok-upload__header {
    display: grid;
  }

  .yok-upload__header-actions {
    justify-self: start;
  }

  .yok-upload__file {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .yok-upload__actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
