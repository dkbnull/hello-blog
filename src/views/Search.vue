<template>
  <div class="search-page">
    <PageContent
      title="搜索结果"
      :active-category="''"
      :show-sort="!!keyword && results.length > 0"
      :loading="false"
      :empty="!keyword || results.length === 0"
      :sort-order="sortOrder"
      @sort-change="setSortOrder"
    >
      <template #info>
        <div v-if="keyword" class="search-info">
          <span class="info-label">关键词:</span>
          <span class="search-keyword">{{ keyword }}</span>
          <span class="search-count">// 共 {{ results.length }} 篇文章</span>
        </div>
        <div v-else class="search-info">
          <span class="info-label">// 请输入关键词进行搜索</span>
          <span class="search-hint">支持按文章标题、分类、标签进行模糊匹配</span>
        </div>
      </template>

      <template #empty>
        <div v-if="keyword" class="empty-state">
          <p>未找到与 "{{ keyword }}" 相关的文章</p>
          <p class="empty-hint">请尝试其他关键词，或使用分类名称、标签进行搜索</p>
        </div>
        <div v-else class="empty-state">
          <p>请输入关键词进行搜索</p>
          <p class="empty-hint">支持按文章标题、分类、标签进行模糊匹配</p>
        </div>
      </template>

      <PostCard v-for="post in pagedItems" :key="`${post.category}-${post.id}`" :post="post" />

      <template #pagination>
        <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
      </template>
    </PageContent>
  </div>
</template>

<script setup>
import { searchArticles } from '@/data/articles'
import { usePagination } from '@/composables/usePagination'
import PageContent from '@/components/PageContent.vue'

const route = useRoute()
const router = useRouter()
const keyword = ref('')

const results = computed(() => searchArticles(keyword.value))

const { currentPage, sortOrder, totalPages, pagedItems, setSortOrder, resetPage } = usePagination(results, {
  route,
  router
})

// 初始化时设置关键词，但保留从 URL 读取的页码
keyword.value = route.query.q || ''

watch(() => route.query.q, (newQ) => {
  keyword.value = newQ || ''
  resetPage()
})
</script>

<style scoped>
.search-page {
  padding: var(--spacing-md) 0;
}

.search-info {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-left: 3px solid var(--primary-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
}

.info-label {
  color: var(--text-tertiary);
  margin-right: var(--spacing-sm);
}

.search-keyword {
  display: inline-block;
  background: var(--primary-color);
  color: #ffffff;
  padding: 2px 12px;
  border-radius: var(--radius-pill);
  font-weight: 500;
}

:root[data-theme="dark"] .search-keyword {
  color: var(--background-color);
}

.search-count {
  color: var(--text-tertiary);
  margin-left: var(--spacing-sm);
}

.search-hint {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}
</style>
