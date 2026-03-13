<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">
        <router-link to="/">Hello Blog</router-link>
      </h1>
      <div class="header-right">
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
        </nav>
        <button class="theme-toggle" @click="toggleTheme" aria-label="切换主题">
          <span v-if="isDarkMode">🌞</span>
          <span v-else>🌙</span>
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
  background-color: #333;
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
}

.logo a {
  color: white;
  text-decoration: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  margin-left: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.theme-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>