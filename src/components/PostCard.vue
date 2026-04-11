<template>
  <article class="post-card card">
    <div class="post-image">
      <img :src="post.image || defaultImage" :alt="post.title"/>
    </div>
    <div class="post-content">
      <h2 class="post-title">
        <router-link :to="postLink">{{ post.title }}</router-link>
      </h2>
      <div class="post-meta">
        <span class="meta-date">{{ post.date }}</span>
        <span v-if="post.author" class="meta-author">{{ post.author }}</span>
        <router-link :to="`/category/${post.category}`" class="meta-category">
          {{ getCategoryName(post.category) }}
        </router-link>
      </div>
      <p class="post-excerpt">{{ excerpt }}</p>
      <div class="post-tags" v-if="post.tags?.length">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <router-link :to="postLink" class="read-more">阅读更多 →</router-link>
    </div>
  </article>
</template>

<script setup>
import {computed} from 'vue';
import {getCategoryName} from '../data/articles';
import defaultImage from '../assets/default.svg';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const postLink = computed(() => `/article/${props.post.category}/${props.post.id}`);

const excerpt = computed(() => {
  if (!props.post.content) return '点击查看文章内容...';
  const plainText = props.post.content
      .replace(/#{1,6}\s/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\n/g, ' ');
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
});
</script>

<style scoped>
.post-card {
  margin-bottom: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.post-image {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-title {
  margin-top: 0;
  margin-bottom: var(--spacing-sm);
  font-size: 1.25rem;
}

.post-title a {
  color: var(--color-text);
  text-decoration: none;
  transition: color var(--transition-normal);
}

.post-title a:hover {
  color: var(--color-primary);
}

.post-meta {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.meta-category {
  color: var(--color-primary);
  text-decoration: none;
}

.meta-category:hover {
  text-decoration: underline;
}

.post-excerpt {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  margin-bottom: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.tag {
  background-color: var(--color-bg-tag);
  padding: var(--spacing-xs) 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  transition: background-color var(--transition-normal);
}

.read-more {
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color var(--transition-normal);
}

.read-more:hover {
  background-color: var(--color-primary-hover);
  text-decoration: none;
}

@media (max-width: 768px) {
  .post-card {
    flex-direction: column;
  }

  .post-image {
    width: 100%;
    height: 180px;
  }
}
</style>
