<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { loadArticlesData } from '@/data/articles'

// 应用启动时运行时加载分类和文章数据（fetch categories.json + 各分类 meta.json）
onMounted(() => {
  loadArticlesData()
})
</script>

<style scoped>
</style>
