import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const THEME_KEY = 'hello-null-theme'

// 系统主题媒体查询（仅用于无手动选择时跟随）
const systemMedia = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-color-scheme: light)')
  : null

/**
 * 读取初始主题：localStorage > 系统主题
 * 默认浅色模式
 */
function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return systemMedia?.matches ? 'light' : 'dark'
}

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useAppStore = defineStore('app', () => {
  const theme = ref(getInitialTheme())

  // 是否为深色模式（供组件按需判断）
  const isDarkMode = computed(() => theme.value === 'dark')

  // 监听状态变化：同步 DOM + localStorage
  watch(theme, (val) => {
    applyTheme(val)
    localStorage.setItem(THEME_KEY, val)
  })

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  // 系统主题变化监听：仅当用户未手动选择时跟随
  const handleSystemChange = (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      theme.value = e.matches ? 'light' : 'dark'
    }
  }

  // 初始化：应用当前主题 + 注册系统监听
  const initTheme = () => {
    applyTheme(theme.value)
    if (systemMedia) {
      // addEventListener 优先，老浏览器回退 addListener
      if (systemMedia.addEventListener) {
        systemMedia.addEventListener('change', handleSystemChange)
      } else if (systemMedia.addListener) {
        systemMedia.addListener(handleSystemChange)
      }
    }
  }

  return {
    theme,
    isDarkMode,
    toggleTheme,
    initTheme
  }
})
