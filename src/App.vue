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