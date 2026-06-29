import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vitePluginSeoAnalytics from './plugins/vite-plugin-seo-analytics'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) {
              return 'vue'
            }
            if (id.includes('node_modules/marked')) {
              return 'markdown'
            }
          }
        }
      }
    },
    plugins: [
      vue(),
      VueDevTools(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: false
        }
      }),
      Components({
        dirs: ['src/components', 'src/layouts'],
        dts: 'src/components.d.ts'
      }),
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
