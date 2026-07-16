<template>
  <transition name="back-to-top-fade">
    <button
      v-if="showBackToTop"
      @click="backToTop"
      class="back-to-top"
      aria-label="回到顶部"
    >
      <Icon icon="arrowUp" :size="20" :stroke-width="2.5" />
    </button>
  </transition>
</template>

<script setup>
import Icon from '@/components/Icon.vue'

const SCROLL_THRESHOLD = 300

const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > SCROLL_THRESHOLD
}

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-color);
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow);
  transition: var(--transition);
  z-index: 999;
}

:root[data-theme="dark"] .back-to-top {
  color: var(--background-color);
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-glow), var(--shadow-lg);
}

.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.back-to-top-fade-enter-from,
.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
