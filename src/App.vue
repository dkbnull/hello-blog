<template>
  <div class="app">
    <Header/>
    <main class="main-content">
      <router-view/>
    </main>
    <Footer/>
    <BackToTop/>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import BackToTop from './components/BackToTop.vue';
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
