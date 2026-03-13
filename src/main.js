import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import {initDarkMode} from './utils/helpers'

// 初始化深色模式
initDarkMode()

createApp(App).use(router).mount('#app')