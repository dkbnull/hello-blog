<template>
  <div class="container">
    <div class="page-layout">
      <Sidebar :active-category="activeCategory" />
      <main class="page-content">
        <div class="page-content-header">
          <h2 class="page-title">{{ title }}</h2>
          <SortControl
            v-if="showSort"
            :sort-order="sortOrder"
            @change="$emit('sort-change', $event)"
          />
        </div>

        <slot name="info" />

        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ loadingText }}</p>
        </div>

        <slot v-else-if="empty" name="empty">
          <div class="empty-state">
            <p>{{ emptyText }}</p>
          </div>
        </slot>

        <template v-else>
          <div class="posts-container">
            <slot />
          </div>
          <slot name="pagination" />
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
/**
 * 文章列表页面通用容器
 * 统一 Home/Search 页面的布局、加载、空状态、分页结构
 */
import Sidebar from '@/components/Sidebar.vue'
import SortControl from '@/components/SortControl.vue'

defineProps({
  title: { type: String, default: '最新文章' },
  activeCategory: { type: String, default: '' },
  showSort: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '加载中...' },
  empty: { type: Boolean, default: false },
  emptyText: { type: String, default: '暂无文章' },
  sortOrder: { type: String, default: 'desc' }
})

defineEmits(['sort-change'])
</script>
