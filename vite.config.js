import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginSeoAnalytics from './plugins/vite-plugin-seo-analytics'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            vue(),
            vitePluginSeoAnalytics({
                siteName: 'Hello Blog',
                siteUrl: 'https://blog.wbnull.cn',
                siteDesc: '个人技术博客，分享Java、Spring Boot、Docker等技术文章',
                keywords: '技术博客,Java,Spring Boot,Docker,Vue,Android,Redis,Linux',
                baId: env.VITE_BA_ID || '',
                searchAction: 'https://blog.wbnull.cn/search?q={search_term_string}'
            })
        ]
    }
})
