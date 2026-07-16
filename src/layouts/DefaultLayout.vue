<template>
  <div class="layout">
    <div class="glow-orb cyan" aria-hidden="true"></div>
    <div class="glow-orb purple" aria-hidden="true"></div>

    <Header />
    <main class="main">
      <slot />
    </main>
    <Footer />
    <BackToTop />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import BackToTop from '@/components/BackToTop.vue'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.main {
  flex: 1;
  position: relative;
  z-index: 1;
}

.glow-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(90px);
  opacity: var(--glow-orb-opacity);
  pointer-events: none;
  z-index: 0;
}

.glow-orb.cyan {
  width: 420px;
  height: 420px;
  top: -120px;
  left: -120px;
  background: var(--primary-color);
}

.glow-orb.purple {
  width: 380px;
  height: 380px;
  bottom: -100px;
  right: -100px;
  background: var(--accent-purple);
}
</style>
