<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <p class="error-message">页面未找到</p>
        <p class="error-hint">您访问的页面不存在，请检查链接是否正确</p>
        <router-link to="/" class="back-home">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height) - 200px);
  display: flex;
  align-items: center;
}

.not-found-content {
  text-align: center;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1;
}

.error-message {
  font-size: var(--font-size-2xl);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.error-hint {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.back-home {
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: var(--font-size-base);
  transition: background-color var(--transition-normal);
}

.back-home:hover {
  background-color: var(--color-primary-hover);
  text-decoration: none;
}
</style>
