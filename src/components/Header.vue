<template>
  <header class="header">
    <div class="container header-inner">
      <router-link to="/" class="brand">
        <img src="/favicon.svg" class="logo" alt="Hello Blog Logo" />
        <span class="brand-text">Hello Blog</span>
      </router-link>

      <div class="header-right">
        <div class="search-box">
          <Icon icon="search" :size="18" class="search-icon" />
          <input
            type="text"
            class="search-input"
            placeholder="搜索文章..."
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
          />
          <button v-if="searchKeyword" class="search-clear" @click="clearSearch" aria-label="清空搜索">
            <Icon icon="clear" :size="14" />
          </button>
        </div>

        <nav :class="['nav', { 'nav-open': menuOpen }]">
          <router-link
            v-for="link in NAV_LINKS"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            @click="menuOpen = false"
          >
            {{ link.name }}
          </router-link>
        </nav>

        <button class="theme-toggle" @click="toggleTheme" aria-label="切换主题">
          <Icon icon="moon" :size="20" v-show="isDarkMode" />
          <Icon icon="sun" :size="20" v-show="!isDarkMode" />
        </button>
      </div>

      <button
        class="menu-toggle"
        :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        @click="menuOpen = !menuOpen"
      >
        <span :class="['hamburger', { active: menuOpen }]">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import Icon from '@/components/Icon.vue'

const NAV_LINKS = [
  { name: '首页', path: '/' },
  { name: '关于', path: '/about' }
]

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const menuOpen = ref(false)
const searchKeyword = ref('')

const isDarkMode = computed(() => appStore.isDarkMode)
const toggleTheme = () => appStore.toggleTheme()

const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    router.push({ path: '/search', query: { q: keyword } })
  } else if (route.path === '/search') {
    router.push({ path: '/' })
  }
  menuOpen.value = false
}

const clearSearch = () => {
  searchKeyword.value = ''
  if (route.path === '/search') {
    router.push({ path: '/' })
  }
}

onMounted(() => {
  if (route.query.q) {
    searchKeyword.value = route.query.q
  }
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--background-color);
  border-bottom: 1px solid var(--glass-border);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--text-color);
}

.brand:hover {
  text-decoration: none;
  color: var(--text-color);
  text-shadow: none;
}

.logo {
  width: 32px;
  height: 32px;
}

.brand-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -0.01em;
}

.brand:hover {
  text-decoration: none;
}

.brand:hover .brand-text {
  color: var(--text-color);
  text-shadow: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-tertiary);
  pointer-events: none;
  transition: color var(--transition);
}

:root[data-theme="dark"] .search-icon {
  color: var(--primary-color);
}

.search-input {
  padding: 6px 30px 6px 32px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
  background: var(--glass-bg);
  color: var(--text-color);
  outline: none;
  width: 180px;
  transition: var(--transition);
}

.search-input:not(:has(~ .search-clear)) {
  padding-right: 12px;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
  width: 240px;
}

.search-clear {
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: var(--transition);
}

.search-clear:hover {
  color: var(--primary-color);
  background: var(--primary-light);
}

.nav {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.nav-link {
  position: relative;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.65;
  text-decoration: none;
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
  opacity: 1;
  text-decoration: none;
}

.nav-link.router-link-active {
  font-weight: 600;
  background: var(--primary-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.theme-toggle {
  width: 36px;
  height: 36px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  color: var(--text-color);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: var(--shadow-glow);
}

.menu-toggle {
  display: none;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 22px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: var(--text-color);
  border-radius: 1px;
  transition: var(--transition);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .logo {
    display: none;
  }

  .menu-toggle {
    display: block;
  }

  .nav {
    display: none;
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--background-color);
    border-bottom: 1px solid var(--glass-border);
    padding: var(--spacing-md);
    gap: var(--spacing-xs);
    box-shadow: var(--shadow-lg);
  }

  .nav-open {
    display: flex;
  }

  .nav-open .nav-link,
  .nav-open .nav-link.router-link-active {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
  }

  .nav-open .nav-link.router-link-active {
    background: var(--primary-light);
    border-radius: var(--radius-md);
  }

  .search-input {
    width: 120px;
  }

  .search-input:focus {
    width: 160px;
  }
}
</style>
