<template>
  <div class="home">
    <div class="container">
      <div class="page-layout">
        <Sidebar :active-category="activeCategory"/>
        <main class="page-content">
          <div class="page-content-header">
            <h2 class="page-title">{{ pageTitle }}</h2>
            <SortControl :sort-order="sortOrder" @change="setSortOrder"/>
          </div>

          <div v-if="sortedItems.length === 0" class="empty-state">
            <p v-if="activeCategory">该分类下没有文章</p>
            <template v-else>
              <p>欢迎来到 Hello Blog！</p>
              <p>请从左侧选择分类查看文章。</p>
            </template>
          </div>

          <template v-else>
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
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {getAllArticles, getArticlesByCategory, getCategoryName} from '../data/articles';
import {usePagination} from '../composables/usePagination';
import PostCard from '../components/PostCard.vue';
import Sidebar from '../components/Sidebar.vue';
import Pagination from '../components/Pagination.vue';
import SortControl from '../components/SortControl.vue';

const route = useRoute();
const activeCategory = ref('');

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

const {currentPage, sortOrder, sortedItems, totalPages, pagedItems, setSortOrder, resetPage} = usePagination(allPosts);

watch(() => route.params.category, (newCategory) => {
  activeCategory.value = newCategory || '';
  resetPage();
}, {immediate: true});

onMounted(() => {
  activeCategory.value = route.params.category || '';
});
</script>

<style scoped>
.home {
  padding: var(--spacing-xl) 0;
}
</style>
