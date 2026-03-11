<template>
  <div class="app">
    <Header/>
    <main class="main-content">
      <router-view/>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

a {
  color: #42b883;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 应用容器 */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主内容区域 */
.main-content {
  flex: 1;
}
</style>