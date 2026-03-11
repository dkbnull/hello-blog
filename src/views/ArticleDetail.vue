<template>
  <div class="article-detail">
    <div class="container">
      <div v-if="isHtmlContent" class="html-content" v-html="articleContent"></div>
      <div v-else class="article-content">
        <h1 class="article-title">{{ article?.title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ article?.date }}</span>
          <span class="article-category">{{ getCategoryName(article?.category) }}</span>
        </div>
        <div class="article-body" v-html="articleContent"></div>
        <router-link to="/" class="back-link">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {getArticleById, getArticleContent, getCategoryName} from '../data/articles';

const route = useRoute();

// 使用响应式数据
const categoryId = ref(route.params.category);
const articleId = ref(route.params.id);

// 文章对象（使用计算属性）
const article = computed(() => {
  return getArticleById(categoryId.value, articleId.value);
});

// 获取文章内容
const articleContent = ref('');
const isHtmlContent = ref(false);

// 加载文章内容
const loadArticleContent = async () => {
  try {
    // 调用异步函数加载文章内容
    const content = await getArticleContent(categoryId.value, articleId.value);

    // 检测是否是完整的 HTML 内容
    isHtmlContent.value = content.startsWith('<!DOCTYPE html>') || content.startsWith('<html');
    articleContent.value = content;
  } catch (error) {
    console.error('加载文章内容失败:', error);
    articleContent.value = `
      <div class="article-content">
        <h1>${article.value?.title}</h1>
        <p>文章内容加载失败: ${error.message}</p>
      </div>
    `;
    isHtmlContent.value = false;
  }
};

// 动态设置页面标题
const updateMetaTags = () => {
  if (article.value) {
    document.title = `${article.value.title} | 个人博客`;
  }
};

// 监听路由变化，更新文章内容
watch([() => route.params.category, () => route.params.id], ([newCategory, newId]) => {
  categoryId.value = newCategory;
  articleId.value = newId;
  loadArticleContent();
  updateMetaTags();
});

// 初始化
onMounted(() => {
  loadArticleContent();
  updateMetaTags();
});
</script>

<style scoped>
.article-detail {
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.article-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.dark-mode .article-content {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.article-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.dark-mode .article-title {
  color: #e0e0e0;
}

.article-meta {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.dark-mode .article-meta {
  color: #999;
}

.article-body {
  margin-bottom: 1rem;
  line-height: 1.8;
  color: #333;
}

.dark-mode .article-body {
  color: #e0e0e0;
}

.article-body h1,
.article-body h2,
.article-body h3,
.article-body h4,
.article-body h5,
.article-body h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.dark-mode .article-body h1,
.dark-mode .article-body h2,
.dark-mode .article-body h3,
.dark-mode .article-body h4,
.dark-mode .article-body h5,
.dark-mode .article-body h6 {
  color: #e0e0e0;
}

.article-body p {
  margin-bottom: 1rem;
}

.article-body code {
  background-color: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

.dark-mode .article-body code {
  background-color: #333;
  color: #e0e0e0;
}

.article-body pre {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1rem;
  font-family: 'Courier New', Courier, monospace;
}

.dark-mode .article-body pre {
  background-color: #333;
}

/* 代码块样式 */
.code-block {
  position: relative;
}

.code-block::before {
  content: attr(data-language);
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-bottom-left-radius: 4px;
}

.dark-mode .code-block::before {
  background-color: rgba(255, 255, 255, 0.1);
}

.article-body pre code {
  background-color: transparent;
  padding: 0;
}

.back-link {
  display: inline-block;
  background-color: #f0f0f0;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #e0e0e0;
}

.dark-mode .back-link {
  background-color: #333;
  color: #e0e0e0;
}

.dark-mode .back-link:hover {
  background-color: #444;
}

/* 完整 HTML 内容的样式 */
.html-content {
  width: 100%;
  min-height: 100vh;
}

.html-content body {
  margin: 0;
  padding: 0;
}

/* 确保 HTML 内容中的代码块在深色模式下也能正常显示 */
.dark-mode .html-content {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-mode .html-content code {
  background-color: #333;
  color: #e0e0e0;
}

.dark-mode .html-content pre {
  background-color: #333;
}
</style>