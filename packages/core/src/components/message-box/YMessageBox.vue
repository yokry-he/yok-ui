<script lang="ts">
export type YMessageBoxTone = 'info' | 'success' | 'warning' | 'danger'
export type YMessageBoxVariant = 'alert' | 'confirm' | 'prompt'

let messageBoxIdSeed = 0
</script>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useOverlayA11y } from '../../composables/useOverlayA11y'

defineOptions({
  name: 'YMessageBox'
})

interface Props {
  open: boolean
  title: string
  message?: string
  tone?: YMessageBoxTone
  variant?: YMessageBoxVariant
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  closeText?: string
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  promptValue?: string
  promptLabel?: string
  promptPlaceholder?: string
  promptError?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: '',
  tone: 'info',
  variant: 'alert',
  confirmText: 'OK',
  cancelText: 'Cancel',
  showCancel: undefined,
  closeText: 'Close message box',
  closeOnOverlay: true,
  closeOnEscape: true,
  promptValue: '',
  promptLabel: 'Input',
  promptPlaceholder: '',
  promptError: '',
  loading: false
})

const emit = defineEmits<{
  confirm: [value?: string]
  cancel: []
  close: []
  'update:promptValue': [value: string]
}>()

const id = `yok-message-box-${++messageBoxIdSeed}`
const titleId = `${id}-title`
const descriptionId = `${id}-description`
const errorId = `${id}-error`
const dialogRef = ref<HTMLElement | null>(null)
const localPromptValue = ref(props.promptValue)

const isPrompt = computed(() => props.variant === 'prompt')
const shouldShowCancel = computed(() => props.showCancel ?? props.variant !== 'alert')
const dialogRole = computed(() => (props.variant === 'alert' && props.tone !== 'danger' ? 'dialog' : 'alertdialog'))
const describedBy = computed(() => {
  const ids = []

  if (props.message || isPrompt.value) {
    ids.push(descriptionId)
  }

  if (props.promptError) {
    ids.push(errorId)
  }

  return ids.join(' ') || undefined
})

watch(
  () => props.promptValue,
  (value) => {
    localPromptValue.value = value
  }
)

const { layerStyle } = useOverlayA11y({
  open: toRef(props, 'open'),
  container: dialogRef,
  closeOnEscape: toRef(props, 'closeOnEscape'),
  onClose: () => emit('close')
})

function closeFromOverlay() {
  if (props.closeOnOverlay && !props.loading) {
    emit('close')
  }
}

function updatePrompt(event: Event) {
  const value = (event.target as HTMLInputElement).value
  localPromptValue.value = value
  emit('update:promptValue', value)
}

function confirm() {
  if (props.loading) {
    return
  }

  if (isPrompt.value) {
    emit('confirm', localPromptValue.value)
    return
  }

  emit('confirm')
}

function cancel() {
  if (props.loading) {
    return
  }

  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="yok-modal-layer">
      <div v-if="open" class="yok-message-box" :style="layerStyle">
        <button class="yok-message-box__overlay" type="button" aria-label="Close message box" @click="closeFromOverlay" />
        <section
          ref="dialogRef"
          class="yok-message-box__dialog"
          :class="[`yok-message-box__dialog--${tone}`, `yok-message-box__dialog--${variant}`]"
          :role="dialogRole"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="describedBy"
          tabindex="-1"
        >
          <header class="yok-message-box__header">
            <span class="yok-message-box__mark" aria-hidden="true" />
            <div class="yok-message-box__heading">
              <p class="yok-message-box__eyebrow">{{ variant }}</p>
              <h2 :id="titleId" class="yok-message-box__title">{{ title }}</h2>
            </div>
            <button
              class="yok-message-box__close yok-focus-ring"
              type="button"
              :aria-label="closeText"
              :disabled="loading"
              data-message-box-close
              @click="$emit('close')"
            >
              x
            </button>
          </header>

          <div class="yok-message-box__body">
            <p v-if="message" :id="descriptionId" class="yok-message-box__message">{{ message }}</p>
            <p v-else-if="isPrompt" :id="descriptionId" class="yok-sr-only">{{ promptLabel }}</p>

            <label v-if="isPrompt" class="yok-message-box__field">
              <span class="yok-message-box__label">{{ promptLabel }}</span>
              <input
                class="yok-message-box__input yok-focus-ring"
                :value="localPromptValue"
                :placeholder="promptPlaceholder"
                :aria-invalid="promptError ? 'true' : 'false'"
                :aria-describedby="promptError ? errorId : undefined"
                data-message-box-prompt
                @input="updatePrompt"
                @keydown.enter.prevent="confirm"
              />
            </label>
            <p v-if="promptError" :id="errorId" class="yok-message-box__error" role="alert">{{ promptError }}</p>
          </div>

          <footer class="yok-message-box__footer">
            <button
              v-if="shouldShowCancel"
              class="yok-message-box__button yok-message-box__button--secondary yok-focus-ring"
              type="button"
              :disabled="loading"
              data-message-box-cancel
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="yok-message-box__button yok-message-box__button--primary yok-focus-ring"
              type="button"
              :disabled="loading"
              :aria-busy="loading ? 'true' : 'false'"
              data-message-box-confirm
              @click="confirm"
            >
              <span v-if="loading" class="yok-message-box__busy" aria-hidden="true" />
              {{ confirmText }}
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.yok-message-box {
  position: fixed;
  inset: 0;
  z-index: var(--yok-zIndex-modal, 2000);
  display: grid;
  place-items: center;
  padding: var(--yok-space-5);
}

.yok-message-box__overlay {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(37, 48, 45, 0.32);
}

.yok-message-box__dialog {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(440px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-xl);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
  color: var(--yok-color-text);
}

.yok-message-box__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--yok-space-3);
  padding: var(--yok-space-5) var(--yok-space-5) var(--yok-space-3);
}

.yok-message-box__mark {
  width: 12px;
  height: 12px;
  margin-top: 6px;
  border-radius: 999px;
  background: var(--yok-color-primary);
  box-shadow: 0 0 0 6px var(--yok-color-primarySoft);
  flex: 0 0 12px;
}

.yok-message-box__dialog--success .yok-message-box__mark {
  background: var(--yok-color-success);
}

.yok-message-box__dialog--warning .yok-message-box__mark {
  background: var(--yok-color-warning);
}

.yok-message-box__dialog--danger .yok-message-box__mark {
  background: var(--yok-color-danger);
}

.yok-message-box__heading {
  min-width: 0;
}

.yok-message-box__eyebrow,
.yok-message-box__title,
.yok-message-box__message,
.yok-message-box__error {
  margin: 0;
}

.yok-message-box__eyebrow {
  color: var(--yok-color-primary);
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0;
  text-transform: capitalize;
}

.yok-message-box__title {
  margin-top: 2px;
  font-size: 20px;
  line-height: 1.3;
  letter-spacing: 0;
}

.yok-message-box__close {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-textMuted);
  cursor: pointer;
  font: inherit;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  flex: 0 0 32px;
}

.yok-message-box__close:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.yok-message-box__body {
  display: grid;
  gap: var(--yok-space-3);
  padding: 0 var(--yok-space-5) var(--yok-space-4);
}

.yok-message-box__message {
  color: var(--yok-color-textMuted);
  font-size: 14px;
  line-height: 1.7;
}

.yok-message-box__field {
  display: grid;
  gap: var(--yok-space-2);
}

.yok-message-box__label {
  color: var(--yok-color-text);
  font-size: 13px;
  font-weight: 700;
}

.yok-message-box__input {
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  font: inherit;
  padding: 0 var(--yok-space-3);
}

.yok-message-box__input[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-message-box__error {
  color: var(--yok-color-danger);
  font-size: 13px;
  font-weight: 650;
}

.yok-message-box__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--yok-space-2);
  border-top: 1px solid var(--yok-color-border);
  padding: var(--yok-space-4) var(--yok-space-5);
}

.yok-message-box__button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 750;
  letter-spacing: 0;
  padding: 0 var(--yok-space-4);
}

.yok-message-box__button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.yok-message-box__button--secondary {
  background: var(--yok-color-surfaceMuted);
  color: var(--yok-color-text);
}

.yok-message-box__button--primary {
  border-color: transparent;
  background: var(--yok-color-primary);
  color: white;
}

.yok-message-box__busy {
  width: 0.6em;
  height: 0.6em;
  border-radius: 999px;
  background: currentColor;
  animation: yok-message-box-pulse 900ms ease-in-out infinite;
}

@keyframes yok-message-box-pulse {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .yok-message-box {
    align-items: end;
    padding: var(--yok-space-4);
  }

  .yok-message-box__dialog {
    width: 100%;
  }
}
</style>
