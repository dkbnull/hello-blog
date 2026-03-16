<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-info">
        <p>&copy; {{ new Date().getFullYear() }} null. 版权所有.</p>
      </div>
      <div class="footer-records">
        <div class="record-item">
          <a href="https://beian.miit.gov.cn/" target="_blank" class="record-link">鲁ICP备2026010010号-1</a>
        </div>
        <div class="record-item">
          <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" class="record-link">
            <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" class="record-icon" alt="公安备案图标">
            鲁公网安备37021402007219号
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  color: #333333;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
  border-top: 1px solid #e0e0e0;
  transition: background-color 0.3s, color 0.3s;
}

.footer-records {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.record-link {
  color: #333333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.record-link:hover {
  text-decoration: none;
}

.record-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-records {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
}
</style>