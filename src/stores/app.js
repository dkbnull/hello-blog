/**
 * 应用全局状态 Store
 * 管理深色模式等全局状态
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const DARK_MODE_KEY = 'darkMode'

export const useAppStore = defineStore('app', () => {
  const isDarkMode = ref(localStorage.getItem(DARK_MODE_KEY) === 'true')

  const darkModeClass = computed(() => isDarkMode.value ? 'dark-mode' : '')

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem(DARK_MODE_KEY, String(isDarkMode.value))
    document.body.classList.toggle('dark-mode', isDarkMode.value)
  }

  const initDarkMode = () => {
    if (isDarkMode.value) {
      document.body.classList.add('dark-mode')
    }
  }

  return {
    isDarkMode,
    darkModeClass,
    toggleDarkMode,
    initDarkMode
  }
})
