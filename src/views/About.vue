<template>
  <div class="about">
    <div class="container">
      <div class="content">
        <h1 class="page-title">Hello Blog</h1>
        <p class="page-subtitle">个人博客 - 用于展示技术文章和分享知识</p>

        <!-- 仓库链接 -->
        <div class="about-section">
          <h2 class="section-title">
            <span class="icon">🔗</span>
            仓库地址
          </h2>
          <div class="repo-links">
            <a href="https://github.com/dkbnull/hello-blog" target="_blank" class="repo-link card">
              <span class="icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a href="https://gitee.com/dkbnull/hello-blog" target="_blank" class="repo-link card">
              <span class="icon">🎯</span>
              <span>Gitee</span>
            </a>
          </div>
        </div>

        <!-- 友链 -->
        <div class="about-section">
          <h2 class="section-title">
            <span class="icon">🤝</span>
            友链
          </h2>
          <div class="friend-links">
            <a href="https://www.wbnull.cn" target="_blank" class="friend-link card">
              <span class="icon">🏠</span>
              <span>主站</span>
            </a>
            <a href="https://tool.wbnull.cn" target="_blank" class="friend-link card">
              <span class="icon">🛠️</span>
              <span>工具</span>
            </a>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="about-section">
          <h2 class="section-title">
            <span class="icon">💬</span>
            微信公众号
          </h2>
          <div class="contact-info">
            <div class="contact-links">
              <div class="contact-item card">
                <div class="wechat-qrcode">
                  <img src="../assets/weixin.jpg" alt="微信二维码" class="qrcode-image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about {
  padding: 2rem 0;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.dark-mode .page-title {
  color: #e0e0e0;
}

.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.dark-mode .page-subtitle {
  color: #999;
}

.about-section {
  margin-bottom: 3.5rem;
  scroll-margin-top: 2rem;
}

.section-title {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #42b883;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dark-mode .section-title {
  color: #e0e0e0;
}

.section-title .icon {
  font-size: 1.2rem;
}

/* 仓库链接样式 */
.repo-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.repo-link {
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 150px;
}

.dark-mode .repo-link {
  color: #e0e0e0;
}

.repo-link:hover {
  transform: translateY(-5px);
  border-color: #42b883;
}

.repo-link .icon {
  font-size: 1.5rem;
  color: #42b883;
}

/* 友链样式 */
.friend-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.friend-link {
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 150px;
}

.dark-mode .friend-link {
  color: #e0e0e0;
}

.friend-link:hover {
  transform: translateY(-5px);
  border-color: #42b883;
}

.friend-link .icon {
  font-size: 1.5rem;
  color: #42b883;
}

/* 联系方式样式 */
.contact-info {
  line-height: 1.8;
  color: #555;
  font-size: 1rem;
}

.dark-mode .contact-info {
  color: #999;
}

.contact-info p {
  margin-bottom: 1.5rem;
}

.contact-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-5px);
  border-color: #42b883;
}

.contact-item .icon {
  font-size: 1.5rem;
  color: #42b883;
}

.wechat-qrcode {
  margin-top: 0.5rem;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .repo-link,
  .friend-link,
  .contact-item {
    padding: 1.25rem;
    min-width: 120px;
  }

  .qrcode-image {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 480px) {
  .repo-links,
  .friend-links,
  .contact-links {
    flex-direction: column;
  }

  .repo-link,
  .friend-link,
  .contact-item {
    width: 100%;
    justify-content: center;
  }
}
</style>