<script setup lang="ts">
import YPageHeader from '../page-header/YPageHeader.vue'

defineOptions({
  name: 'YCrudLayout'
})

export type YCrudLayoutDensity = 'comfortable' | 'compact'

interface Props {
  title: string
  description?: string
  eyebrow?: string
  status?: string
  density?: YCrudLayoutDensity
  stickyHeader?: boolean
  ariaLabel?: string
  headingLevel?: 1 | 2 | 3
}

withDefaults(defineProps<Props>(), {
  description: '',
  eyebrow: '',
  status: '',
  density: 'comfortable',
  stickyHeader: false,
  ariaLabel: '',
  headingLevel: 1
})
</script>

<template>
  <section
    class="yok-crud-layout"
    :class="[
      `yok-crud-layout--${density}`,
      { 'yok-crud-layout--sticky': stickyHeader }
    ]"
    :aria-label="ariaLabel || title"
  >
    <div class="yok-crud-layout__header">
      <YPageHeader
        :title="title"
        :description="description"
        :eyebrow="eyebrow"
        :status="status"
        :heading-level="headingLevel"
      >
        <template v-if="$slots.actions" #actions>
          <slot name="actions" />
        </template>
      </YPageHeader>
    </div>

    <div v-if="$slots.search || $slots.filters || $slots.toolbar" class="yok-crud-layout__controls">
      <div v-if="$slots.search" class="yok-crud-layout__search">
        <slot name="search" />
      </div>
      <div v-if="$slots.filters || $slots.toolbar" class="yok-crud-layout__control-row">
        <div v-if="$slots.filters" class="yok-crud-layout__filters">
          <slot name="filters" />
        </div>
        <div v-if="$slots.toolbar" class="yok-crud-layout__toolbar">
          <slot name="toolbar" />
        </div>
      </div>
    </div>

    <div class="yok-crud-layout__workspace">
      <div class="yok-crud-layout__main">
        <slot name="table">
          <slot />
        </slot>
      </div>
      <aside v-if="$slots.aside" class="yok-crud-layout__aside">
        <slot name="aside" />
      </aside>
    </div>

    <footer v-if="$slots.footer" class="yok-crud-layout__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.yok-crud-layout {
  display: grid;
  gap: var(--yok-space-5);
  min-width: 0;
  color: var(--yok-color-text);
}

.yok-crud-layout--compact {
  gap: var(--yok-space-3);
}

.yok-crud-layout__header {
  z-index: 1;
  border: 1px solid color-mix(in srgb, var(--yok-color-border), transparent 20%);
  border-radius: var(--yok-radius-xl);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--yok-color-primary), transparent 94%), transparent 46%),
    var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-5);
}

.yok-crud-layout--sticky .yok-crud-layout__header {
  position: sticky;
  top: var(--yok-space-3);
}

.yok-crud-layout--compact .yok-crud-layout__header {
  padding: var(--yok-space-4);
}

.yok-crud-layout__controls {
  display: grid;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-crud-layout__search {
  min-width: 0;
}

.yok-crud-layout__control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--yok-space-3);
  min-width: 0;
}

.yok-crud-layout__filters {
  min-width: 0;
}

.yok-crud-layout__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--yok-space-2);
  margin-left: auto;
}

.yok-crud-layout__workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: var(--yok-space-4);
  min-width: 0;
}

.yok-crud-layout__workspace:has(.yok-crud-layout__aside) {
  grid-template-columns: minmax(0, 1fr) minmax(240px, 320px);
}

.yok-crud-layout__main,
.yok-crud-layout__aside,
.yok-crud-layout__footer {
  min-width: 0;
}

.yok-crud-layout__aside,
.yok-crud-layout__footer {
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: var(--yok-space-4);
}

.yok-crud-layout__aside {
  display: grid;
  gap: var(--yok-space-3);
}

.yok-crud-layout--compact .yok-crud-layout__aside,
.yok-crud-layout--compact .yok-crud-layout__footer {
  padding: var(--yok-space-3);
}

@media (max-width: 920px) {
  .yok-crud-layout__workspace:has(.yok-crud-layout__aside) {
    grid-template-columns: 1fr;
  }

  .yok-crud-layout__control-row {
    align-items: stretch;
    flex-direction: column;
  }

  .yok-crud-layout__toolbar {
    justify-content: flex-start;
    margin-left: 0;
  }
}
</style>
