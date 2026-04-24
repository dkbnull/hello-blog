<template>
  <transition name="back-to-top-fade">
    <button
        v-if="backToTopVisible"
        @click="scrollToTop"
        class="back-to-top"
        aria-label="回到顶部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'

const backToTopVisible = ref(false)

const handleScroll = () => {
  backToTopVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'})
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
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
  background-color: var(--color-primary);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: background-color var(--transition-normal), transform var(--transition-fast), box-shadow var(--transition-fast);
  z-index: 999;
}

.back-to-top:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
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
