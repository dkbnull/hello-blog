<template>
  <div class="home">
    <div class="container">
      <div class="home-layout">
        <Sidebar :active-category="activeCategory"/>
        <main class="content">
          <h2 class="page-title">{{ pageTitle }}</h2>

          <div v-if="displayPosts.length === 0" class="empty-state">
            <p v-if="activeCategory">该分类下没有文章</p>
            <template v-else>
              <p>欢迎来到 Hello Blog！</p>
              <p>请从左侧选择分类查看文章。</p>
            </template>
          </div>

          <div v-else class="posts-container">
            <PostCard v-for="post in displayPosts" :key="`${post.category}-${post.id}`" :post="post"/>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {getAllArticles, getArticlesByCategory, getCategoryName} from '../data/articles';
import PostCard from '../components/PostCard.vue';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();
const activeCategory = ref('');

const pageTitle = computed(() => {
  if (activeCategory.value) {
    return `${getCategoryName(activeCategory.value)} 文章`;
  }
  return '最新文章';
});

const displayPosts = computed(() => {
  if (activeCategory.value) {
    return getArticlesByCategory(activeCategory.value);
  }
  return getAllArticles().sort((a, b) => new Date(b.date) - new Date(a.date));
});

watch(() => route.params.category, (newCategory) => {
  activeCategory.value = newCategory || '';
}, {immediate: true});

onMounted(() => {
  activeCategory.value = route.params.category || '';
});
</script>

<style scoped>
.home {
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
  margin-bottom: var(--spacing-xl);
  color: var(--color-text);
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

@media (max-width: 768px) {
  .home-layout {
    flex-direction: column;
  }
}
</style>
