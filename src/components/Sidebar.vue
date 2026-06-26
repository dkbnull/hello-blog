<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">分类</h2>
    <ul class="sidebar-menu">
      <li v-for="category in categories" :key="category.id">
        <router-link
          :to="`/category/${category.id}`"
          class="sidebar-link"
          :class="{ active: activeCategory === category.id }"
        >
          <img
            v-if="category.icon"
            :src="category.icon"
            :alt="category.name"
            class="icon"
          />
          <span class="name">{{ category.name }}</span>
          <span class="count">{{ getArticleCount(category.id) }}</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { getArticleCount, getCategories } from '@/data/articles';

defineProps({
  activeCategory: {
    type: String,
    default: ''
  }
});

const categories = getCategories();
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-sidebar);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border-sidebar);
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-md));
  align-self: flex-start;
  /* 限制最大高度为视口可用区域，超出时菜单区域滚动 */
  max-height: calc(100vh - var(--header-height) - var(--spacing-md) * 2);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px var(--color-shadow);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.sidebar-title {
  color: var(--color-primary);
  margin-top: 0;
  margin-bottom: var(--spacing-lg);
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  /* 菜单区域可滚动，标题保持固定 */
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  scrollbar-width: none; /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none; /* IE/Edge 隐藏滚动条 */
}

/* WebKit 内核浏览器隐藏滚动条 */
.sidebar-menu::-webkit-scrollbar {
  display: none;
}

.sidebar-menu li {
  margin-bottom: var(--spacing-xs);
}

.sidebar-link {
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.sidebar-link:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
  transform: translateX(4px);
  text-decoration: none;
}

.sidebar-link.active {
  background: var(--color-primary);
  color: white;
  font-weight: 500;
}

.sidebar-link .icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
}

.count {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
}

.sidebar-link.active .count {
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: static;
    /* 移动端不限制高度，使用横向 flex 布局 */
    max-height: none;
    display: block;
  }

  .sidebar-menu {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    /* 移动端取消垂直滚动 */
    overflow-y: visible;
    flex: none;
  }

  .sidebar-menu li {
    margin-bottom: 0;
  }

  .sidebar-link {
    padding: var(--spacing-sm);
    font-size: 0.85rem;
  }
}
</style>
