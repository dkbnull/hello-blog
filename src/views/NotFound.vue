<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <h1 class="error-code" data-text="404">404</h1>
        <p class="error-message">PAGE_NOT_FOUND</p>
        <p class="error-hint">// 您访问的页面不存在，请检查链接是否正确</p>
        <router-link to="/" class="back-home btn btn-primary">
          <span class="back-home-bracket">&lt;</span>
          返回首页
          <span class="back-home-bracket">/&gt;</span>
        </router-link>
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
  position: relative;
  font-size: 8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  line-height: 1;
  text-shadow: 0 0 30px var(--glow-cyan);
  animation: glitch 3s infinite;
}

.error-code::before,
.error-code::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.error-code::before {
  z-index: -1;
  animation: glitch-shift-1 3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.error-code::after {
  color: var(--primary-color);
  z-index: -2;
  animation: glitch-shift-2 3s infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
}

@keyframes glitch {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 1px);
  }
  94% {
    transform: translate(2px, -1px);
  }
  96% {
    transform: translate(-1px, -1px);
  }
  98% {
    transform: translate(1px, 1px);
  }
}

@keyframes glitch-shift-1 {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-4px, 0);
  }
  94% {
    transform: translate(4px, 0);
  }
  96% {
    transform: translate(-2px, 0);
  }
  98% {
    transform: translate(2px, 0);
  }
}

@keyframes glitch-shift-2 {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(4px, 0);
  }
  94% {
    transform: translate(-4px, 0);
  }
  96% {
    transform: translate(2px, 0);
  }
  98% {
    transform: translate(-2px, 0);
  }
}

.error-message {
  font-family: var(--font-mono);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  letter-spacing: 0.05em;
}

.error-hint {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.back-home {
  font-family: var(--font-mono);
}

.back-home-bracket {
  opacity: 0.7;
  font-weight: 700;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }

  .error-message {
    font-size: var(--font-size-xl);
  }
}
</style>
