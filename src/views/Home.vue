<template>
  <div class="home">
    <div class="container">
      <div class="home-content">
        <!-- 左侧导航栏 -->
        <aside class="sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-title">分类</h3>
            <ul class="category-list">
              <li v-for="category in categories" :key="category.id">
                <router-link :to="`/category/${category.id}`">
                  {{ category.name }}
                  <span class="category-count">({{ getArticleCount(category.id) }})</span>
                </router-link>
              </li>
            </ul>
          </div>


        </aside>

        <!-- 右侧内容区 -->
        <main class="content">
          <h2 class="page-title">
            {{ searchQuery ? `搜索结果: ${searchQuery}` : '最新文章' }}
          </h2>
          <div v-if="filteredPosts.length === 0 && !searchQuery" class="welcome-message">
            <p>欢迎来到个人博客！</p>
            <p>请从左侧选择分类查看文章。</p>
          </div>
          <div v-else-if="filteredPosts.length === 0" class="no-results">
            <p>没有找到匹配的文章</p>
          </div>
          <div v-else class="posts-container">
            <PostCard v-for="post in filteredPosts" :key="post.id" :post="post"/>
          </div>

          <!-- 分类文章 -->
          <div v-if="selectedCategory && categoryArticles.length > 0" class="category-articles">
            <h3 class="category-title">{{ getCategoryName(selectedCategory) }} 文章</h3>
            <div class="posts-container">
              <PostCard v-for="article in categoryArticles" :key="`${article.category}-${article.id}`" :post="article"/>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {getAllArticles, getArticleCount, getArticlesByCategory, getCategories, getCategoryName} from '../data/articles';
import PostCard from '../components/PostCard.vue';

const route = useRoute();
const searchQuery = ref('');
const categories = getCategories();
const selectedCategory = ref('');

// 过滤文章
const filteredPosts = computed(() => {
  const allArticles = getAllArticles();
  const sortedArticles = allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!searchQuery.value) {
    return sortedArticles;
  }
  const query = searchQuery.value.toLowerCase();
  return sortedArticles.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
  );
});

// 分类文章
const categoryArticles = computed(() => {
  if (!selectedCategory.value) {
    return [];
  }
  return getArticlesByCategory(selectedCategory.value);
});


// 监听路由变化，更新搜索查询和选中分类
watch(() => route.params.category, (newCategory) => {
  selectedCategory.value = newCategory || '';
});

watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch || '';
});

// 初始化搜索查询和选中分类
onMounted(() => {
  searchQuery.value = route.query.search || '';
  selectedCategory.value = route.params.category || '';
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

.category-title {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: #333;
}

.dark-mode .category-title {
  color: #e0e0e0;
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