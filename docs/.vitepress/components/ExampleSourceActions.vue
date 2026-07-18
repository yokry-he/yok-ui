<script setup lang="ts">
interface SourceLanguageOption {
  label: string
  value: string
}

export interface ExampleSourceActionItem {
  key: string
  href?: string
  tooltip: string
  label: string
  glyph: string
  icon?: 'source' | 'copy' | 'external' | 'code' | 'reset'
  text: string
  className?: string
  glyphClassName?: string
  textClassName?: string
  stateText?: string
  stateClassName?: string
  feedback?: boolean
  feedbackText?: string
  feedbackClassName?: string
  pressed?: boolean
  expanded?: boolean
  controls?: string
  target?: string
  rel?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  actionAttribute: string
  languageAttribute?: string
  languageValuePrefix?: string
  ariaLabel?: string
  languageAriaLabel?: string
  toolsAriaLabel?: string
  rootClass?: string
  languagesClass?: string
  languageClass?: string
  toolsClass?: string
  toolClass?: string
  glyphClass?: string
  textClass?: string
  activeLanguage?: string
  languageOptions?: readonly SourceLanguageOption[]
  actions: readonly ExampleSourceActionItem[]
}>(), {
  languageAttribute: 'data-example-source-language',
  languageValuePrefix: '',
  ariaLabel: '示例操作',
  languageAriaLabel: '代码语言',
  toolsAriaLabel: '源码操作',
  rootClass: '',
  languagesClass: '',
  languageClass: '',
  toolsClass: '',
  toolClass: '',
  glyphClass: '',
  textClass: '',
  activeLanguage: '',
  languageOptions: () => []
})

const emit = defineEmits<{
  'update:language': [value: string]
  action: [key: string, event: MouseEvent]
}>()

function languageAttrs(value: string) {
  return {
    [props.languageAttribute]: `${props.languageValuePrefix}${value}`
  }
}

function actionAttrs(key: string) {
  return {
    [props.actionAttribute]: key
  }
}
</script>

<template>
  <div class="example-source-actions" :class="rootClass" :aria-label="ariaLabel">
    <div
      v-if="languageOptions.length"
      class="example-source-actions__languages"
      :class="languagesClass"
      role="tablist"
      :aria-label="languageAriaLabel"
    >
      <button
        v-for="option in languageOptions"
        :key="option.value"
        v-bind="languageAttrs(option.value)"
        type="button"
        class="example-source-actions__language"
        :class="[languageClass, { active: activeLanguage === option.value }]"
        role="tab"
        :aria-selected="activeLanguage === option.value ? 'true' : 'false'"
        :aria-pressed="activeLanguage === option.value ? 'true' : 'false'"
        @click="emit('update:language', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <div class="example-source-actions__tools" :class="toolsClass" :aria-label="toolsAriaLabel">
      <component
        :is="action.href ? 'a' : 'button'"
        v-for="action in actions"
        :key="action.key"
        v-bind="actionAttrs(action.key)"
        class="example-source-actions__tool"
        :class="[toolClass, action.className]"
        :type="action.href ? undefined : 'button'"
        :href="action.href"
        :target="action.target"
        :rel="action.rel"
        :disabled="action.disabled"
        :data-tooltip="action.tooltip"
        :title="action.tooltip"
        :aria-label="action.label"
        :aria-pressed="typeof action.pressed === 'boolean' ? String(action.pressed) : undefined"
        :aria-expanded="typeof action.expanded === 'boolean' ? String(action.expanded) : undefined"
        :aria-controls="action.controls"
        @click="emit('action', action.key, $event)"
      >
        <span
          v-if="action.feedback && action.feedbackText"
          class="example-source-actions__feedback"
          :class="action.feedbackClassName"
        >
          {{ action.feedbackText }}
        </span>
        <template v-else>
          <span
            class="example-source-actions__glyph"
            :class="[glyphClass, action.glyphClassName]"
            :data-icon="action.icon || undefined"
            aria-hidden="true"
          >
            {{ action.glyph }}
          </span>
          <span class="example-source-actions__text" :class="[textClass, action.textClassName]">{{ action.text }}</span>
        </template>
        <span v-if="action.stateText" class="example-source-actions__state" :class="action.stateClassName">
          {{ action.stateText }}
        </span>
      </component>
    </div>
  </div>
</template>
