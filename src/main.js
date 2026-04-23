import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import {initDarkMode} from './utils/helpers'
import seoAnalytics from './plugins/seoAnalytics'

// 初始化深色模式
initDarkMode()

createApp(App)
    .use(router)
    .use(seoAnalytics, {router, siteUrl: 'https://blog.wbnull.cn'})
    .mount('#app')
