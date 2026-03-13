<template>
  <div class="post-card card">
    <div class="post-image">
      <img :src="post.image || '/src/assets/favicon.svg'" :alt="post.title"/>
    </div>
    <div class="post-content">
      <h2 class="post-title">
        <router-link :to="getPostLink">{{ post.title }}</router-link>
      </h2>
      <div class="post-meta">
        <span class="post-date">{{ post.date }}</span>
        <span v-if="post.author" class="post-author">作者: {{ post.author }}</span>
        <span class="post-category">
          <router-link :to="`/category/${post.category}`">{{ getCategoryName(post.category) }}</router-link>
        </span>
      </div>
      <div class="post-excerpt" v-html="excerpt"></div>
      <div class="post-tags" v-if="post.tags && post.tags.length > 0">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <router-link :to="getPostLink" class="read-more">阅读更多</router-link>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {getCategoryName} from '../data/articles';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

// 获取文章链接
const getPostLink = computed(() => {
  // 检查是否是来自 articles 目录的文章
  if (props.post.id && props.post.category) {
    return `/article/${props.post.category}/${props.post.id}`;
  }
});

// 提取文章摘要
const excerpt = computed(() => {
  if (props.post.content) {
    // 提取文章摘要，去除 Markdown 标记
    const plainText = props.post.content.replace(/#{1,6}\s/g, '').replace(/```[\s\S]*?```/g, '').replace(/\n/g, ' ');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  }
  return '点击查看文章内容...';
});
</script>

<style scoped>
.post-card {
  @extend .card;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.post-image {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  flex: 1;
}

.post-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.post-title a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.dark-mode .post-title a {
  color: #e0e0e0;
}

.post-title a:hover {
  color: #42b883;
}

.post-meta {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.dark-mode .post-meta {
  color: #999;
}

.post-category a {
  color: #42b883;
  text-decoration: none;
}

.post-excerpt {
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.5;
}

.dark-mode .post-excerpt {
  color: #e0e0e0;
}

.post-tags {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #666;
}

.dark-mode .tag {
  background-color: #333;
  color: #e0e0e0;
}

.read-more {
  display: inline-block;
  background-color: #42b883;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.read-more:hover {
  background-color: #36a06f;
}
</style>