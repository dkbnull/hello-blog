<template>
  <article class="post-card card">
    <router-link :to="postLink" class="post-card-link" :target="target">
      <div class="post-image">
        <img :src="post.image || defaultImage" :alt="post.title" />
      </div>
      <div class="post-content">
        <h2 class="post-title">{{ post.title }}</h2>
        <div class="post-meta">
          <span class="meta-date">{{ post.date }}</span>
          <span v-if="post.author" class="meta-author">{{ post.author }}</span>
          <span
            v-if="post.category"
            class="meta-category"
            @click.prevent.stop="goCategory"
          >
            {{ getCategoryName(post.category) }}
          </span>
        </div>
        <p class="post-excerpt">{{ excerpt }}</p>
        <div class="post-tags" v-if="post.tags?.length">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup>
import { getCategoryName } from '@/data/articles';
import defaultImage from '@/assets/default.svg';

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  // 是否在新标签页打开文章，默认 true
  openInNewTab: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();

const postLink = computed(() => `/article/${props.post.category}/${props.post.id}`);
const target = computed(() => props.openInNewTab ? '_blank' : '_self');

// 点击分类标签时，跳转到分类页（避免触发卡片整体跳转）
const goCategory = () => {
  if (!props.post.category) return;
  // 新标签页打开时，分类也使用新标签页打开以保持一致体验
  const url = router.resolve(`/category/${props.post.category}`).href;
  if (props.openInNewTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    router.push(`/category/${props.post.category}`);
  }
};

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
  display: flex;
  align-items: flex-start;
}

/* 整卡可点击链接，撑满卡片 */
.post-card-link {
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.post-card-link:hover {
  text-decoration: none;
}

.post-image {
  flex-shrink: 0;
  width: 160px;
  height: 160px;
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
  color: var(--color-text);
  transition: color var(--transition-normal);
}

.post-card-link:hover .post-title {
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
  cursor: pointer;
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
  margin-bottom: 0;
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.tag {
  background-color: var(--color-primary-light);
  padding: var(--spacing-xs) 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  color: var(--color-primary);
  transition: background-color var(--transition-normal);
}

@media (max-width: 768px) {
  .post-card-link {
    flex-direction: column;
  }

  .post-image {
    width: 100%;
    height: 140px;
  }
}
</style>
