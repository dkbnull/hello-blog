<template>
  <aside :class="['sidebar', { 'sidebar-expanded': expanded }]">
    <!-- 移动端展开按钮 -->
    <button class="sidebar-toggle" @click="expanded = !expanded" aria-label="切换分类导航">
      <img
        v-if="activeIcon && !expanded"
        :src="activeIcon"
        :alt="activeName"
        class="toggle-icon"
      />
      <Icon v-else-if="!expanded" icon="category" :size="20" />
      <Icon v-else icon="clear" :size="18" />
    </button>

    <div :class="['sidebar-body', { 'sidebar-body-collapsed': !expanded }]">
      <h2 class="sidebar-title">
        <span class="title-marker"></span>
        分类
      </h2>

      <div v-if="isLoading" class="sidebar-loading">
        <div class="loading-spinner-sm"></div>
      </div>

      <ul v-else class="sidebar-menu">
        <li v-for="category in categories" :key="category.id">
          <router-link
            :to="`/category/${category.id}`"
            class="sidebar-link"
            :class="{ active: activeCategory === category.id }"
            @click="expanded = false"
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
    </div>
  </aside>
</template>

<script setup>
import { getArticleCount, getCategories, loading } from '@/data/articles'
import Icon from '@/components/Icon.vue'

const props = defineProps({
  activeCategory: {
    type: String,
    default: ''
  }
})

const expanded = ref(false)
const categories = computed(() => getCategories())
const isLoading = computed(() => loading.value)

// 当前选中分类的图标和名称
const activeIcon = computed(() => {
  if (!props.activeCategory) return ''
  const cat = categories.value.find(c => c.id === props.activeCategory)
  return cat?.icon || ''
})
const activeName = computed(() => {
  if (!props.activeCategory) return ''
  const cat = categories.value.find(c => c.id === props.activeCategory)
  return cat?.name || ''
})
</script>

<style scoped>
.sidebar-toggle {
  display: none;
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--glass-border);
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-md));
  align-self: flex-start;
  max-height: calc(100vh - var(--header-height) - var(--spacing-md) * 2);
  display: flex;
  flex-direction: column;
  transition: var(--transition-normal);
  overflow: hidden;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--glass-border);
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.title-marker {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.sidebar-loading {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-menu::-webkit-scrollbar {
  display: none;
}

.sidebar-menu li {
  margin-bottom: var(--spacing-xs);
}

.sidebar-link {
  position: relative;
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
  border: 1px solid transparent;
  overflow: hidden;
  opacity: 0.85;
}

.sidebar-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gradient-neon);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease;
}

.sidebar-link:hover {
  background: var(--primary-light);
  color: var(--primary-color);
  border-color: var(--glass-border);
  text-decoration: none;
  opacity: 1;
}

.sidebar-link:hover::before,
.sidebar-link.active::before {
  transform: scaleY(1);
}

.sidebar-link.active {
  background: var(--primary-light);
  color: var(--primary-color);
  border-color: var(--glass-border);
  font-weight: 600;
  opacity: 1;
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
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: var(--primary-light);
  border: 1px solid transparent;
}

.sidebar-link.active .count {
  color: var(--primary-color);
  border-color: var(--glass-border);
}

@media (max-width: 768px) {
  .sidebar {
    width: auto;
    position: fixed;
    top: calc(var(--header-height) + var(--spacing-sm));
    left: var(--spacing-sm);
    z-index: 90;
    max-height: none;
    padding: 0;
    border: none;
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--background-color);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-color);
    cursor: pointer;
    transition: var(--transition);
    padding: 0;
  }

  .sidebar-toggle:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    box-shadow: var(--shadow-glow);
  }

  .toggle-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .sidebar-body-collapsed {
    display: none;
  }

  .sidebar-body {
    margin-top: var(--spacing-xs);
    background: var(--background-color);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    min-width: 180px;
  }

  .sidebar-expanded {
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .sidebar-menu {
    overflow-y: visible;
    flex: none;
  }

  .sidebar-menu li {
    margin-bottom: var(--spacing-xs);
  }

  .sidebar-link {
    padding: 6px var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .sidebar-link::before {
    display: none;
  }
}
</style>
