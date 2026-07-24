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
          <span class="meta-views">
            <Icon icon="view" :size="14" />
            {{ formatViewCount(viewCount) }}
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
import { getCategoryName } from '@/data/articles'
import defaultImage from '@/assets/default.svg'
import { fetchArticleView, formatViewCount } from '@/composables/useViewCount'

// 文章摘要最大长度
const EXCERPT_MAX_LENGTH = 150

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
})

const router = useRouter()

// 文章点击量（仅展示，不累加）
const viewCount = ref(0)

onMounted(() => {
  fetchArticleView(props.post.category, props.post.id).then(count => {
    viewCount.value = count
  })
})

const postLink = computed(() => `/article/${props.post.category}/${props.post.id}`)
const target = computed(() => props.openInNewTab ? '_blank' : '_self')

const goCategory = () => {
  if (!props.post.category) return
  const url = router.resolve(`/category/${props.post.category}`).href
  if (props.openInNewTab) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    router.push(`/category/${props.post.category}`)
  }
}

const excerpt = computed(() => {
  if (!props.post.content) return '点击查看文章内容...'
  const plainText = props.post.content
    .replace(/#{1,6}\s/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n/g, ' ')
  return plainText.length > EXCERPT_MAX_LENGTH
    ? plainText.substring(0, EXCERPT_MAX_LENGTH) + '...'
    : plainText
})
</script>

<style scoped>
.post-card {
  display: flex;
  align-items: flex-start;
}

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
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image img {
  transform: scale(1.08);
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-title {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-color);
  transition: var(--transition);
}

.post-card:hover .post-title {
  color: var(--primary-color);
}

.post-meta {
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  align-items: center;
}

.meta-date::before {
  content: '> ';
  color: var(--primary-color);
  opacity: 0.7;
}

.meta-category {
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: none;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  background: var(--primary-light);
  border: 1px solid transparent;
  transition: var(--transition);
}

.meta-category:hover {
  border-color: var(--primary-color);
}

.meta-views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
}

.post-excerpt {
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
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
