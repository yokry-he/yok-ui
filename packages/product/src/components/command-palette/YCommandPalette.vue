<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

defineOptions({
  name: 'YCommandPalette'
})

export interface YokCommand {
  id: string
  label: string
}

interface Props {
  open: boolean
  commands: YokCommand[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  select: [command: YokCommand]
}>()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)
const filteredCommands = computed(() => {
  const value = query.value.trim().toLowerCase()

  if (!value) {
    return props.commands
  }

  return props.commands.filter((command) => command.label.toLowerCase().includes(value))
})
const activeCommand = computed(() => filteredCommands.value[activeIndex.value])
const activeDescendant = computed(() => (activeCommand.value ? `yok-command-${activeCommand.value.id}` : undefined))

function select(command: YokCommand) {
  emit('select', command)
}

function moveActiveIndex(direction: 1 | -1) {
  if (filteredCommands.value.length === 0) {
    return
  }

  activeIndex.value =
    (activeIndex.value + direction + filteredCommands.value.length) % filteredCommands.value.length
}

function selectActiveCommand() {
  if (activeCommand.value) {
    select(activeCommand.value)
  }
}

function resetActiveIndex() {
  activeIndex.value = 0
}

watch(filteredCommands, resetActiveIndex)

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = ''
      resetActiveIndex()
      void nextTick(() => inputRef.value?.focus())
    }
  },
  { immediate: true }
)
</script>

<template>
  <Transition name="yok-modal-layer">
    <div v-if="open" class="yok-command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="yok-command-palette__panel">
        <input
          ref="inputRef"
          v-model="query"
          class="yok-command-palette__input yok-focus-ring"
          placeholder="Search commands"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="yok-command-list"
          :aria-expanded="open ? 'true' : 'false'"
          :aria-activedescendant="activeDescendant"
          @keydown.down.prevent="moveActiveIndex(1)"
          @keydown.up.prevent="moveActiveIndex(-1)"
          @keydown.enter.prevent="selectActiveCommand"
          @keydown.esc="$emit('close')"
        />
        <div id="yok-command-list" class="yok-command-palette__list" role="listbox">
          <button
            v-for="(command, index) in filteredCommands"
            :id="`yok-command-${command.id}`"
            :key="command.id"
            class="yok-command-palette__item yok-focus-ring"
            :class="{ 'yok-command-palette__item--active': activeIndex === index }"
            type="button"
            role="option"
            :aria-selected="activeIndex === index ? 'true' : 'false'"
            :data-command-id="command.id"
            @mouseenter="activeIndex = index"
            @click="select(command)"
          >
            {{ command.label }}
          </button>
          <div v-if="filteredCommands.length === 0" class="yok-command-palette__empty" role="status">
            No commands found
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.yok-modal-layer-enter-active,
.yok-modal-layer-leave-active {
  transition: opacity var(--yok-motion-normal, 180ms ease);
}

.yok-modal-layer-enter-active .yok-command-palette__panel,
.yok-modal-layer-leave-active .yok-command-palette__panel {
  transition: transform var(--yok-motion-normal, 180ms ease);
}

.yok-modal-layer-enter-from,
.yok-modal-layer-leave-to {
  opacity: 0;
}

.yok-modal-layer-enter-from .yok-command-palette__panel,
.yok-modal-layer-leave-to .yok-command-palette__panel {
  transform: translateY(8px) scale(0.96);
}

.yok-command-palette {
  position: fixed;
  inset: 0;
  z-index: var(--yok-zIndex-modal, 2000);
  display: grid;
  place-items: start center;
  padding-top: 12vh;
  background: rgba(37, 48, 45, 0.28);
}

@media (prefers-reduced-motion: reduce) {
  .yok-modal-layer-enter-active,
  .yok-modal-layer-leave-active,
  .yok-modal-layer-enter-active .yok-command-palette__panel,
  .yok-modal-layer-leave-active .yok-command-palette__panel {
    transition-duration: 1ms;
  }
}

.yok-command-palette__panel {
  display: grid;
  width: min(560px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-xl);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
}

.yok-command-palette__input {
  min-height: 52px;
  border: 0;
  border-bottom: 1px solid var(--yok-color-border);
  padding: 0 var(--yok-space-4);
  color: var(--yok-color-text);
}

.yok-command-palette__item {
  min-height: 44px;
  border: 0;
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  padding: 0 var(--yok-space-4);
  text-align: left;
}

.yok-command-palette__list {
  display: grid;
}

.yok-command-palette__item:hover,
.yok-command-palette__item--active {
  background: var(--yok-color-primarySoft);
}

.yok-command-palette__empty {
  color: var(--yok-color-textMuted);
  padding: var(--yok-space-4);
}
</style>
