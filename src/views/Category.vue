<template>
  <div class="home">
    <div class="container">
      <div class="home-content">
        <!-- 左侧导航栏 -->
        <aside class="sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-title">分类</h3>
            <ul class="category-list">
              <li v-for="cat in categories" :key="cat.id">
                <router-link :to="`/category/${cat.id}`">
                  {{ cat.name }}
                  <span class="category-count">({{ getArticleCount(cat.id) }})</span>
                </router-link>
              </li>
            </ul>
          </div>


        </aside>

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
import {getArticleCount, getArticlesByCategory, getCategories, getCategoryName} from '../data/articles';
import PostCard from '../components/PostCard.vue';

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

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.home-content {
  display: flex;
  gap: 2rem;
}

/* 左侧导航栏 */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.dark-mode .sidebar-section {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.sidebar-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.dark-mode .sidebar-title {
  color: #e0e0e0;
  border-bottom-color: #333;
}

.category-list, .recent-articles {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li, .recent-articles li {
  margin-bottom: 0.75rem;
}

.category-list a, .recent-articles a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
  display: block;
  padding: 0.25rem 0;
}

.dark-mode .category-list a, .dark-mode .recent-articles a {
  color: #e0e0e0;
}

.category-list a:hover, .recent-articles a:hover {
  color: #42b883;
}

.category-count {
  font-size: 0.8rem;
  color: #666;
  margin-left: 0.5rem;
}

.dark-mode .category-count {
  color: #999;
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