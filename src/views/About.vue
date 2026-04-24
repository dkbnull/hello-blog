<template>
  <div class="about">
    <div class="content">
      <h1 class="page-title">Hello Blog</h1>
      <p class="page-subtitle">个人博客 - 分享技术文章、开发笔记与生活感悟</p>

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
            <img :src="link.icon" :alt="link.name" class="link-icon"/>
            <span>{{ link.name }}</span>
          </a>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-title">微信公众号</h2>
        <div class="qrcode-wrapper">
          <div class="qrcode-card card">
            <img src="../assets/weixin.jpg" alt="微信二维码" class="qrcode-image"/>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const linkSections = [
  {
    title: '仓库地址',
    links: [
      {name: 'GitHub', url: 'https://github.com/dkbnull/hello-blog', icon: 'https://github.com/favicon.ico'},
      {name: 'Gitee', url: 'https://gitee.com/dkbnull/hello-blog', icon: 'https://gitee.com/favicon.ico'},
    ],
  },
  {
    title: '友链',
    links: [
      {name: '主站', url: 'https://www.wbnull.cn', icon: 'https://www.wbnull.cn/favicon.svg'},
      {name: '工具', url: 'https://tool.wbnull.cn', icon: 'https://tool.wbnull.cn/favicon.svg'},
      {name: '游戏', url: 'https://game.wbnull.cn', icon: 'https://game.wbnull.cn/favicon.svg'},
    ],
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
      },
    ],
  },
];
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

.link-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
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
