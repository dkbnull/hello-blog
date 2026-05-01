import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import '@/style.css'
import {useAppStore} from '@/stores/app'
import seoAnalytics from '@/plugins/seoAnalytics'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const appStore = useAppStore()
appStore.initDarkMode()

app.use(router)
    .use(seoAnalytics, {router, siteUrl: 'https://blog.wbnull.cn'})
    .mount('#app')
