/**
 * 应用全局状态 Store
 * 管理深色模式、搜索关键词等全局状态
 */

import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

const DARK_MODE_KEY = 'darkMode'

export const useAppStore = defineStore('app', () => {
    const isDarkMode = ref(localStorage.getItem(DARK_MODE_KEY) === 'true')

    const darkModeClass = computed(() => isDarkMode.value ? 'dark-mode' : '')

    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value
        localStorage.setItem(DARK_MODE_KEY, String(isDarkMode.value))
        if (isDarkMode.value) {
            document.body.classList.add('dark-mode')
        } else {
            document.body.classList.remove('dark-mode')
        }
    }

    const initDarkMode = () => {
        if (isDarkMode.value) {
            document.body.classList.add('dark-mode')
        }
    }

    const searchKeyword = ref('')

    const setSearchKeyword = (keyword) => {
        searchKeyword.value = keyword
    }

    return {
        isDarkMode,
        darkModeClass,
        toggleDarkMode,
        initDarkMode,
        searchKeyword,
        setSearchKeyword
    }
})
