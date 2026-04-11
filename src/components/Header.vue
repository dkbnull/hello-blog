<template>
  <header class="header">
    <div class="container header-inner">
      <h1 class="logo">
        <router-link to="/">Hello Blog</router-link>
      </h1>
      <div class="header-right">
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
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
    </div>
  </header>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {toggleDarkMode} from '../utils/helpers';

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
  color: var(--color-text);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px var(--color-shadow);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo a {
  color: var(--color-text);
  text-decoration: none;
  transition: color var(--transition-normal);
}

.logo a:hover {
  color: var(--color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  margin-left: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  transition: background var(--transition-normal), color var(--transition-normal);
}

.nav-link:hover {
  background: var(--color-bg-hover);
  text-decoration: none;
}

.nav-link.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 500;
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
</style>
