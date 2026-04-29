<template>
  <div class="search-page">
    <div class="container">
      <div class="page-layout">
        <Sidebar :active-category="''"/>
        <main class="page-content">
          <div class="page-content-header">
            <h2 class="page-title">搜索结果</h2>
            <SortControl v-if="keyword && results.length > 0" :sort-order="sortOrder" @change="setSortOrder"/>
          </div>

          <div v-if="keyword" class="search-info">
            <span>关键词：</span>
            <span class="search-keyword">{{ keyword }}</span>
            <span class="search-count">（共 {{ results.length }} 篇文章）</span>
          </div>

          <div v-if="keyword && results.length === 0" class="empty-state">
            <p>未找到与 "{{ keyword }}" 相关的文章</p>
            <p class="empty-hint">请尝试其他关键词，或使用分类名称、标签进行搜索</p>
          </div>

          <div v-if="!keyword" class="empty-state">
            <p>请输入关键词进行搜索</p>
            <p class="empty-hint">支持按文章标题、分类、标签进行模糊匹配</p>
          </div>

          <template v-if="results.length > 0">
            <div class="posts-container">
              <PostCard v-for="post in pagedItems" :key="`${post.category}-${post.id}`" :post="post"/>
            </div>
            <Pagination v-model:current-page="currentPage" :total-pages="totalPages"/>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {searchArticles} from '../data/articles';
import {usePagination} from '../composables/usePagination';
import PostCard from '../components/PostCard.vue';
import Sidebar from '../components/Sidebar.vue';
import Pagination from '../components/Pagination.vue';
import SortControl from '../components/SortControl.vue';

const route = useRoute();
const keyword = ref('');

const results = computed(() => {
  return searchArticles(keyword.value);
});

const {currentPage, sortOrder, totalPages, pagedItems, setSortOrder, resetPage} = usePagination(results);

watch(() => route.query.q, (newQ) => {
  keyword.value = newQ || '';
  resetPage();
}, {immediate: true});
</script>

<style scoped>
.search-page {
  padding: var(--spacing-xl) 0;
}

.search-info {
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.search-keyword {
  display: inline-block;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  font-weight: 500;
}

.search-count {
  color: var(--color-text-tertiary);
  margin-left: var(--spacing-xs);
}
</style>
