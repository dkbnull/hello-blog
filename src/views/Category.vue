<template>
  <div class="home">
    <div class="container">
      <div class="home-content">
        <!-- 左侧导航栏 -->
        <Sidebar :active-category="category"/>

        <!-- 右侧内容区 -->
        <main class="content">
          <h2 class="page-title">{{ getCategoryName(category) }} 文章</h2>
          <div v-if="categoryArticles.length === 0" class="no-results">
            <p>该分类下没有文章</p>
          </div>
          <div v-else class="posts-container">
            <PostCard v-for="article in categoryArticles" :key="`${article.category}-${article.id}`" :post="article"/>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {getArticlesByCategory, getCategories, getCategoryName} from '../data/articles';
import PostCard from '../components/PostCard.vue';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();
const categories = getCategories();

// 使用响应式数据
const category = ref(route.params.category);

// 分类文章（使用计算属性）
const categoryArticles = computed(() => {
  return getArticlesByCategory(category.value);
});

// 监听路由变化，更新分类
watch(() => route.params.category, (newCategory) => {
  category.value = newCategory || '';
});
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.home-content {
  display: flex;
  gap: 2rem;
}

/* 右侧内容区 */
.content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.dark-mode .page-title {
  color: #e0e0e0;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-results, .welcome-message {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

.dark-mode .no-results, .dark-mode .welcome-message {
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .sidebar-section {
    margin-bottom: 1rem;
  }
}
</style>