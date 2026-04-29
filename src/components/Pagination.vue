<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="page-btn" :disabled="currentPage === 1" @click="changePage(1)" title="首页">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="11 17 6 12 11 7"/>
        <polyline points="18 17 13 12 18 7"/>
      </svg>
    </button>
    <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)" title="上一页">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="page-ellipsis">...</span>
      <button v-else class="page-btn" :class="{ active: page === currentPage }" @click="changePage(page)">
        {{ page }}
      </button>
    </template>
    <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" title="下一页">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
    <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(totalPages)" title="末页">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="13 17 18 12 13 7"/>
        <polyline points="6 17 11 12 6 7"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  currentPage: {type: Number, required: true},
  totalPages: {type: Number, required: true},
  maxVisible: {type: Number, default: 5}
});

const emit = defineEmits(['update:currentPage']);

const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const max = props.maxVisible;

  if (total <= max + 2) {
    return Array.from({length: total}, (_, i) => i + 1);
  }

  const pages = [];
  const half = Math.floor(max / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  if (current - half < 2) {
    end = Math.min(total - 1, max + 1);
  }
  if (current + half > total - 1) {
    start = Math.max(2, total - max);
  }

  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
};
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
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-card);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.page-btn.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-ellipsis {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .page-btn {
    min-width: 32px;
    height: 32px;
    font-size: var(--font-size-xs);
  }
}
</style>
