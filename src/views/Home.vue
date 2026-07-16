<template>
  <div class="home">
    <PageContent
      :title="pageTitle"
      :active-category="activeCategory"
      :loading="isLoading"
      :loading-text="'加载中...'"
      :empty="sortedItems.length === 0"
      :empty-text="activeCategory ? '该分类下没有文章' : '请从左侧选择分类查看文章'"
      :sort-order="sortOrder"
      @sort-change="setSortOrder"
    >
      <template v-if="!activeCategory && sortedItems.length === 0" #empty>
        <div class="empty-state">
          <p>欢迎来到 Hello Blog！</p>
          <p>请从左侧选择分类查看文章。</p>
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
import { getAllArticles, getArticlesByCategory, getCategoryName, loading } from '@/data/articles'
import { usePagination } from '@/composables/usePagination'
import PageContent from '@/components/PageContent.vue'

const route = useRoute()
const activeCategory = ref('')

const isLoading = computed(() => loading.value)

const pageTitle = computed(() => {
  if (activeCategory.value) {
    return `${getCategoryName(activeCategory.value)} 文章`
  }
  return '最新文章'
})

const allPosts = computed(() => {
  if (activeCategory.value) {
    return getArticlesByCategory(activeCategory.value)
  }
  return getAllArticles()
})

const {
  currentPage,
  sortOrder,
  sortedItems,
  totalPages,
  pagedItems,
  setSortOrder,
  resetPage
} = usePagination(allPosts)

watch(() => route.params.category, (newCategory) => {
  activeCategory.value = newCategory || ''
  resetPage()
}, { immediate: true })
</script>

<style scoped>
.home {
  padding: var(--spacing-md) 0;
}
</style>
