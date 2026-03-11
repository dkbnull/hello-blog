<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">
        <router-link to="/">Hello Blog</router-link>
      </h1>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
// 头部导航组件
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

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav a:hover {
  color: #42b883;
}
</style>