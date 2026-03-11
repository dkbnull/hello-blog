<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; {{ new Date().getFullYear() }} null. 保留所有权利.</p>
      <a href="https://beian.miit.gov.cn/" target="_blank" class="record-link">鲁ICP备2026010010号-1</a>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

p {
  margin-bottom: 0;
}

.record-link {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}
</style>