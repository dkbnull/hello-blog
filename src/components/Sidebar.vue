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
          <span class="name">{{ category.name }}</span>
          <span class="count">{{ getArticleCount(category.id) }}</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import {getArticleCount, getCategories} from '../data/articles';

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
  height: fit-content;
  box-shadow: 0 2px 10px var(--color-shadow);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.sidebar-title {
  color: var(--color-primary);
  margin-top: 0;
  margin-bottom: var(--spacing-lg);
  font-size: 1.2rem;
  font-weight: 600;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
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
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
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
  }

  .sidebar-menu {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
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
