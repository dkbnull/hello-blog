<template>
  <div class="about">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Hello Blog</h1>
        <p class="page-subtitle">个人博客 - 用于展示技术文章和分享知识</p>

        <section class="about-section">
          <h2 class="section-title">
            <span class="icon">🔗</span>
            仓库地址
          </h2>
          <div class="link-grid">
            <a href="https://github.com/dkbnull/hello-blog" target="_blank" class="link-card card">
              <span class="icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a href="https://gitee.com/dkbnull/hello-blog" target="_blank" class="link-card card">
              <span class="icon">🎯</span>
              <span>Gitee</span>
            </a>
          </div>
        </section>

        <section class="about-section">
          <h2 class="section-title">
            <span class="icon">🤝</span>
            友链
          </h2>
          <div class="link-grid">
            <a href="https://www.wbnull.cn" target="_blank" class="link-card card">
              <span class="icon">🏠</span>
              <span>主站</span>
            </a>
            <a href="https://tool.wbnull.cn" target="_blank" class="link-card card">
              <span class="icon">🛠️</span>
              <span>工具</span>
            </a>
          </div>
        </section>

        <section class="about-section">
          <h2 class="section-title">
            <span class="icon">💬</span>
            微信公众号
          </h2>
          <div class="qrcode-wrapper">
            <div class="qrcode-card card">
              <img src="../assets/weixin.jpg" alt="微信二维码" class="qrcode-image">
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about {
  padding: var(--spacing-xl) 0;
}

.content {
  max-width: var(--content-max);
  margin: 0 auto;
}

.page-title {
  text-align: center;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  font-size: 2rem;
  font-weight: 700;
}

.page-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
  font-size: 1.1rem;
}

.about-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-primary);
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title .icon {
  font-size: 1.2rem;
}

.link-grid {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.link-card {
  text-decoration: none;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 150px;
  transition: all var(--transition-normal);
}

.link-card:hover {
  border-color: var(--color-primary);
  text-decoration: none;
}

.link-card .icon {
  font-size: 1.5rem;
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
}

.qrcode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all var(--transition-normal);
}

.qrcode-card:hover {
  border-color: var(--color-primary);
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-sidebar);
}

@media (max-width: 768px) {
  .content {
    padding: 0 var(--spacing-md);
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
    margin-bottom: var(--spacing-xl);
  }

  .link-card {
    padding: 1.25rem;
    min-width: 120px;
  }

  .qrcode-image {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .link-grid {
    flex-direction: column;
  }

  .link-card {
    width: 100%;
    justify-content: center;
  }
}
</style>
