<template>
  <div class="about">
    <div class="content">
      <div class="about-header">
        <img src="/favicon.svg" class="about-logo" alt="Hello Blog Logo" />
        <h1 class="page-title">Hello Blog</h1>
        <p class="page-subtitle">// 个人博客 - 分享技术文章、开发笔记与生活感悟</p>
      </div>

      <section v-for="section in linkSections" :key="section.title" class="about-section">
        <h2 class="section-title">{{ section.title }}</h2>
        <div class="link-grid">
          <a
            v-for="link in section.links"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link-card card"
          >
            <img :src="link.icon" :alt="link.name" class="link-icon" />
            <span class="link-name">{{ link.name }}</span>
            <span class="link-arrow">→</span>
          </a>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-title">微信公众号</h2>
        <div class="qrcode-wrapper">
          <div class="qrcode-card card">
            <img :src="weixinImage" alt="微信二维码" class="qrcode-image" />
            <p class="qrcode-text">// 扫码关注</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import weixinImage from '@/assets/weixin.jpg'

const linkSections = [
  {
    title: '仓库地址',
    links: [
      { name: 'GitHub', url: 'https://github.com/dkbnull/hello-blog', icon: 'https://github.com/favicon.ico' },
      { name: 'Gitee', url: 'https://gitee.com/dkbnull/hello-blog', icon: 'https://gitee.com/favicon.ico' },
      { name: 'GitHub · 知识库', url: 'https://github.com/dkbnull/hello-wiki', icon: 'https://github.com/favicon.ico' },
      { name: 'Gitee · 知识库', url: 'https://gitee.com/dkbnull/hello-wiki', icon: 'https://gitee.com/favicon.ico' }
    ]
  },
  {
    title: '友链',
    links: [
      { name: '主站', url: 'https://www.wbnull.cn', icon: 'https://www.wbnull.cn/favicon.svg' },
      { name: '工具', url: 'https://tool.wbnull.cn', icon: 'https://tool.wbnull.cn/favicon.svg' },
      { name: '游戏', url: 'https://game.wbnull.cn', icon: 'https://game.wbnull.cn/favicon.svg' }
    ]
  },
  {
    title: '反馈建议',
    links: [
      {
        name: 'GitHub Issues',
        url: 'https://github.com/dkbnull/hello-blog/issues',
        icon: 'https://github.com/favicon.ico'
      },
      {
        name: 'Gitee Issues',
        url: 'https://gitee.com/dkbnull/hello-blog/issues',
        icon: 'https://gitee.com/favicon.ico'
      }
    ]
  }
]
</script>

<style scoped>
.about {
  padding: var(--spacing-xl) 0;
}

.content {
  max-width: var(--content-max);
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.about-logo {
  width: 80px;
  height: 80px;
  margin-bottom: var(--spacing-md);
  animation: logo-float 4s ease-in-out infinite;
}

@keyframes logo-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.page-title {
  text-align: center;
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-4xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  font-family: var(--font-mono);
}

.about-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  color: var(--text-color);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--glass-border);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.link-card {
  text-decoration: none;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
}

.link-card:hover {
  text-decoration: none;
  color: var(--text-color);
}

.link-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
}

.link-name {
  flex: 1;
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.link-arrow {
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  transition: var(--transition);
}

.link-card:hover .link-arrow {
  color: var(--primary-color);
  transform: translateX(4px);
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
}

.qrcode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
}

.qrcode-text {
  margin-top: var(--spacing-sm);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .content {
    padding: 0 var(--spacing-md);
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
  }

  .about-logo {
    width: 64px;
    height: 64px;
  }

  .link-card {
    padding: var(--spacing-md);
  }

  .qrcode-image {
    width: 160px;
    height: 160px;
  }
}

@media (max-width: 480px) {
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
