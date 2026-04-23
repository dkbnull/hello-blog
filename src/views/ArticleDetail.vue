<template>
  <div class="article-detail">
    <div class="container article-container">
      <div v-if="isHtmlContent" class="html-content" v-html="articleContent"></div>
      <article v-else class="article-content card">
        <h1 class="article-title">{{ article?.title }}</h1>
        <div class="article-meta">
          <span>{{ article?.date }}</span>
          <span class="meta-separator">·</span>
          <router-link :to="`/category/${article?.category}`" class="meta-category">
            {{ getCategoryName(article?.category) }}
          </router-link>
        </div>
        <div class="article-body" v-html="articleContent"></div>
      </article>
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {getArticleById, getArticleContent, getCategoryName} from '../data/articles';
import {useArticleSeo} from '../composables/useSeo';

const route = useRoute();

const categoryId = ref(route.params.category);
const articleId = ref(route.params.id);

const article = computed(() => getArticleById(categoryId.value, articleId.value));

useArticleSeo(article)

const articleContent = ref('');
const isHtmlContent = ref(false);

const loadArticleContent = async () => {
  try {
    const content = await getArticleContent(categoryId.value, articleId.value);
    isHtmlContent.value = content.startsWith('<!DOCTYPE html>') || content.startsWith('<html');
    articleContent.value = content;
  } catch (error) {
    console.error('加载文章内容失败:', error);
    articleContent.value = `<h1>${article.value?.title || '文章不存在'}</h1><p>文章内容加载失败: ${error.message}</p>`;
    isHtmlContent.value = false;
  }
};

watch(
    [() => route.params.category, () => route.params.id],
    ([newCategory, newId]) => {
      categoryId.value = newCategory;
      articleId.value = newId;
      loadArticleContent();
    }
);

onMounted(() => {
  loadArticleContent();
});
</script>

<style scoped>
.article-detail {
  padding: var(--spacing-xl) 0;
  background-color: var(--color-bg);
  min-height: calc(100vh - var(--header-height));
  transition: background-color var(--transition-normal);
}

.article-container {
  max-width: var(--article-max);
}

.article-content {
  padding: var(--spacing-xl);
}

.article-content:hover {
  transform: none;
  box-shadow: 0 2px 4px var(--color-shadow);
}

.article-title {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  text-align: center;
}

.article-meta {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
}

.meta-separator {
  color: var(--color-text-tertiary);
}

.meta-category {
  color: var(--color-primary);
  text-decoration: none;
}

.meta-category:hover {
  text-decoration: underline;
}

.article-body {
  line-height: 1.8;
  color: var(--color-text);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.article-body :deep(p) {
  margin-bottom: var(--spacing-md);
}

.article-body :deep(code) {
  background-color: var(--color-bg-code);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.article-body :deep(pre) {
  background-color: var(--color-bg-code);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-family: var(--font-mono);
}

.article-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.article-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--spacing-md);
  margin: var(--spacing-md) 0;
  color: var(--color-text-secondary);
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--spacing-md);
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
}

.article-body :deep(th) {
  background-color: var(--color-bg-code);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-md) 0;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color var(--transition-normal);
}

.back-link:hover {
  background-color: var(--color-primary-hover);
  text-decoration: none;
}

.html-content {
  width: 100%;
  min-height: calc(100vh - 120px);
  overflow: hidden;
  color: var(--color-text);
}

.html-content :deep(.container) {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.html-content :deep(.article-content) {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 4px var(--color-shadow);
  padding: var(--spacing-xl);
}

.html-content :deep(code) {
  background-color: var(--color-bg-code);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
}

.html-content :deep(pre) {
  background-color: var(--color-bg-code);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

@media (max-width: 768px) {
  .article-content {
  }

  .article-title {
    font-size: 1.5rem;
  }
}
</style>
