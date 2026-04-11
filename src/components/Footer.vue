<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} null. All rights reserved.</p>
        <div class="records">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="record-link">
            鲁ICP备2026010010号-1
          </a>
          <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" rel="noopener noreferrer"
             class="record-link">
            <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" class="record-icon" alt="公安备案图标">
            鲁公网安备37021402007219号
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-bg-footer);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-md) 0 var(--spacing-md);
  margin-top: auto;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.records {
  display: flex;
  gap: var(--spacing-md);
}

.record-link {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.record-link:hover {
  color: var(--color-primary);
}

.record-icon {
  width: var(--font-size-xs);
  height: var(--font-size-xs);
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .records {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
