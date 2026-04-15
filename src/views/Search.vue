<template>
  <div class="search-page">
    <div class="container">
      <div class="home-layout">
        <Sidebar :active-category="''"/>
        <main class="content">
          <h2 class="page-title">搜索结果</h2>

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

          <div v-if="results.length > 0" class="posts-container">
            <PostCard v-for="post in results" :key="`${post.category}-${post.id}`" :post="post"/>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {searchArticles} from '../data/articles';
import PostCard from '../components/PostCard.vue';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();
const keyword = ref('');

const results = computed(() => {
  return searchArticles(keyword.value);
});

watch(() => route.query.q, (newQ) => {
  keyword.value = newQ || '';
}, {immediate: true});
</script>

<style scoped>
.search-page {
  padding: var(--spacing-xl) 0;
}

.home-layout {
  display: flex;
  gap: var(--spacing-xl);
}

.content {
  flex: 1;
  min-width: 0;
}

.page-title {
  font-size: 1.75rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
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

.posts-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-text-secondary);
}

.empty-state p {
  margin-bottom: var(--spacing-sm);
}

.empty-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

@media (max-width: 768px) {
  .home-layout {
    flex-direction: column;
  }
}
</style>
