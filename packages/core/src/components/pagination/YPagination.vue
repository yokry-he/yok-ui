<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'YPagination'
})

interface Props {
  page: number
  pageSize: number
  total: number
  siblingCount?: number
  disabled?: boolean
  hideOnSinglePage?: boolean
  ariaLabel?: string
  previousText?: string
  nextText?: string
}

const props = withDefaults(defineProps<Props>(), {
  siblingCount: 1,
  disabled: false,
  hideOnSinglePage: false,
  ariaLabel: 'Pagination',
  previousText: 'Previous',
  nextText: 'Next'
})

const emit = defineEmits<{
  'update:page': [page: number]
  change: [page: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, props.page - props.siblingCount)
  const end = Math.min(pageCount.value, props.page + props.siblingCount)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (!pages.includes(1)) {
    pages.unshift(1)
  }

  if (!pages.includes(pageCount.value)) {
    pages.push(pageCount.value)
  }

  return pages
})

function updatePage(nextPage: number) {
  if (props.disabled) {
    return
  }

  const normalized = Math.min(Math.max(nextPage, 1), pageCount.value)

  if (normalized === props.page) {
    return
  }

  emit('update:page', normalized)
  emit('change', normalized)
}
</script>

<template>
  <nav
    v-if="!(hideOnSinglePage && pageCount <= 1)"
    class="yok-pagination"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <button
      class="yok-pagination__button yok-focus-ring"
      type="button"
      :disabled="disabled || page <= 1"
      @click="updatePage(page - 1)"
    >
      {{ previousText }}
    </button>
    <div class="yok-pagination__pages">
      <button
        v-for="pageNumber in visiblePages"
        :key="pageNumber"
        class="yok-pagination__page yok-focus-ring"
        :class="{ 'yok-pagination__page--active': pageNumber === page }"
        type="button"
        :disabled="disabled"
        :aria-current="pageNumber === page ? 'page' : undefined"
        @click="updatePage(pageNumber)"
      >
        {{ pageNumber }}
      </button>
    </div>
    <button
      class="yok-pagination__button yok-focus-ring"
      type="button"
      :disabled="disabled || page >= pageCount"
      @click="updatePage(page + 1)"
    >
      {{ nextText }}
    </button>
  </nav>
</template>

<style scoped>
.yok-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yok-space-2);
}

.yok-pagination__pages {
  display: flex;
  flex-wrap: wrap;
  gap: var(--yok-space-1);
}

.yok-pagination__button,
.yok-pagination__page {
  min-height: 34px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  font-weight: 650;
}

.yok-pagination__button {
  padding: 0 var(--yok-space-3);
}

.yok-pagination__page {
  min-width: 34px;
  padding: 0 var(--yok-space-2);
}

.yok-pagination__page--active {
  border-color: var(--yok-color-primary);
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
}

.yok-pagination__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
