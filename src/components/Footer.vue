<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="copyright">&copy; {{ new Date().getFullYear() }} null. 版权所有.</p>
      <div class="records">
        <a href="https://beian.miit.gov.cn/" target="_blank" class="record-link">鲁ICP备2026010010号-1</a>
        <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" class="record-link">
          <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" class="record-icon" alt="公安备案图标">
          鲁公网安备37021402007219号
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: var(--color-bg-footer);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-align: center;
  padding: var(--spacing-md);
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.records {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.record-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color var(--transition-normal);
}

.record-link:hover {
  color: var(--color-primary);
  text-decoration: none;
}

.record-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .records {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
