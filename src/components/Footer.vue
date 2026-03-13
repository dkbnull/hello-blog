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
  background-color: #ffffff;
  color: #333333;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;
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
  color: #333333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.record-link:hover {
  text-decoration: none;
}

/* 深色模式 */
.dark-mode .footer {
  background-color: #1e1e1e;
  color: #e0e0e0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.3);
}

.dark-mode .record-link {
  color: #e0e0e0;
}
</style>