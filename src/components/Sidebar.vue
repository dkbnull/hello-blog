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
          <span class="icon">{{ category.icon }}</span>
          <span>{{ category.name }}</span>
          <span class="category-count">({{ getArticleCount(category.id) }})</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import {getArticleCount, getCategories} from '../data/articles';

const props = defineProps({
  activeCategory: {
    type: String,
    default: ''
  }
});

const categories = getCategories();
</script>

<style scoped>
/* 左侧导航栏 */
.sidebar {
  width: 220px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dark-mode .sidebar {
  background: #1e1e1e;
  border-color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.sidebar-title {
  color: #42b883;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: none;
  padding-bottom: 0;
}

.dark-mode .sidebar-title {
  color: #42b883;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.dark-mode .sidebar-link {
  color: #e0e0e0;
}

.sidebar-link:hover {
  background: #e8f5e8;
  color: #42b883;
  transform: translateX(5px);
}

.dark-mode .sidebar-link:hover {
  background: rgba(66, 184, 131, 0.1);
  color: #42b883;
}

.sidebar-link.active {
  background: #42b883;
  color: white;
  font-weight: 500;
}

.sidebar-link .icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.category-count {
  margin-left: auto;
  font-size: 0.8rem;
  color: #666;
}

.dark-mode .category-count {
  color: #999;
}

.sidebar-link.active .category-count {
  color: rgba(255, 255, 255, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: static;
    padding: 1rem;
  }

  .sidebar-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .sidebar-menu li {
    margin-bottom: 0;
    flex: 1 1 calc(50% - 0.5rem);
  }

  .sidebar-link {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .sidebar-menu li {
    flex: 1 1 100%;
  }
}
</style>