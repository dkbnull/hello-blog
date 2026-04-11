<template>
  <header class="header">
    <div class="container header-inner">
      <router-link to="/" class="brand">
        <img src="/favicon.svg" class="logo" alt="logo"/>
        <span class="brand-text">Hello Blog</span>
      </router-link>
      <div class="header-right">
        <nav :class="['nav', { 'nav-open': menuOpen }]">
          <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="nav-link"
              @click="menuOpen = false"
          >
            {{ link.name }}
          </router-link>
        </nav>
        <button class="theme-toggle" @click="toggleTheme" :aria-label="isDarkMode ? '切换浅色模式' : '切换深色模式'">
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
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
import {onMounted, ref} from 'vue'
import {toggleDarkMode} from '../utils/helpers'

const menuOpen = ref(false)

const navLinks = [
  {name: '首页', path: '/'},
  {name: '页于', path: '/about'}
]

const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = toggleDarkMode();
};

onMounted(() => {
  isDarkMode.value = document.body.classList.contains('dark-mode');
});
</script>

<style scoped>
.header {
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
}

.logo {
  width: 32px;
  height: 32px;
}

.brand-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.brand-text:hover {
  color: var(--color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.nav-link {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
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
  background-color: var(--color-text);
  border-radius: 1px;
  transition: var(--transition-fast);
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

.theme-toggle {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 50%;
  transition: background var(--transition-normal), color var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--color-bg-hover);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border);
    padding: var(--spacing-md);
    gap: var(--spacing-xs);
    box-shadow: var(--shadow);
  }

  .nav-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
  }
}
</style>
