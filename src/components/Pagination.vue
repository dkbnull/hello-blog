<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="page-btn" :disabled="currentPage === 1" @click="changePage(1)" title="首页">
      <Icon icon="chevronsLeft" :size="14" />
    </button>
    <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)" title="上一页">
      <Icon icon="chevronLeft" :size="14" />
    </button>
    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="page-ellipsis">...</span>
      <button v-else class="page-btn" :class="{ active: page === currentPage }" @click="changePage(page)">
        {{ page }}
      </button>
    </template>
    <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" title="下一页">
      <Icon icon="chevronRight" :size="14" />
    </button>
    <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(totalPages)" title="末页">
      <Icon icon="chevronsRight" :size="14" />
    </button>
  </div>
</template>

<script setup>
import Icon from '@/components/Icon.vue'

const currentPage = defineModel('currentPage', { type: Number, required: true })

const props = defineProps({
  totalPages: { type: Number, required: true },
  maxVisible: { type: Number, default: 5 }
})

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = currentPage.value
  const max = props.maxVisible

  if (total <= max + 2) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []
  const half = Math.floor(max / 2)
  let start = Math.max(2, current - half)
  let end = Math.min(total - 1, current + half)

  if (current - half < 2) {
    end = Math.min(total - 1, max + 1)
  }
  if (current + half > total - 1) {
    start = Math.max(2, total - max)
  }

  pages.push(1)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)

  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== currentPage.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md) 0;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
  transition: var(--transition);
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: var(--shadow-glow);
}

.page-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--background-color);
  font-weight: 700;
}

:root[data-theme="dark"] .page-btn.active {
  color: #ffffff;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-ellipsis {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
}

@media (max-width: 768px) {
  .page-btn {
    min-width: 32px;
    height: 32px;
    font-size: var(--font-size-xs);
  }

  .page-ellipsis {
    min-width: 32px;
    height: 32px;
  }
}
</style>
