<template>
  <div class="home">
    <div class="container">
      <div class="page-layout">
        <Sidebar :active-category="activeCategory" />
        <main class="page-content">
          <div class="page-content-header">
            <h2 class="page-title">{{ pageTitle }}</h2>
            <SortControl :sort-order="sortOrder" @change="setSortOrder" />
          </div>

          <div v-if="isLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          <div v-else-if="sortedItems.length === 0" class="empty-state">
            <p v-if="activeCategory">该分类下没有文章</p>
            <template v-else>
              <p>欢迎来到 Hello Blog！</p>
              <p>请从左侧选择分类查看文章。</p>
            </template>
          </div>

          <template v-else>
            <div class="posts-container">
              <PostCard v-for="post in pagedItems" :key="`${post.category}-${post.id}`" :post="post" />
            </div>
            <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAllArticles, getArticlesByCategory, getCategoryName, loading } from '@/data/articles';
import { usePagination } from '@/composables/usePagination';

const route = useRoute();
const activeCategory = ref('');

const isLoading = computed(() => loading.value);

const pageTitle = computed(() => {
  if (activeCategory.value) {
    return `${getCategoryName(activeCategory.value)} 文章`;
  }
  return '最新文章';
});

const allPosts = computed(() => {
  if (activeCategory.value) {
    return getArticlesByCategory(activeCategory.value);
  }
  return getAllArticles();
});

const {
  currentPage,
  sortOrder,
  sortedItems,
  totalPages,
  pagedItems,
  setSortOrder,
  resetPage
} = usePagination(allPosts);

watch(() => route.params.category, (newCategory) => {
  activeCategory.value = newCategory || '';
  resetPage();
}, { immediate: true });

onMounted(() => {
  activeCategory.value = route.params.category || '';
});
</script>

<style scoped>
.home {
  padding: var(--spacing-md) 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  gap: var(--spacing-md);
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
