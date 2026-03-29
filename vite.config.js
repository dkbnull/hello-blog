import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                // 确保静态资源保持原有目录结构
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.includes('articles')) {
                        return 'assets/articles/[name].[ext]'
                    }
                    return 'assets/[name]-[hash].[ext]'
                }
            }
        }
    }
})