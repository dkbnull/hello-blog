import {createRouter, createWebHistory} from 'vue-router'
import {getCategoryName} from '../data/articles'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
            title: 'Hello Blog - 个人技术博客',
            description: 'Hello Blog - 个人技术博客，分享Java、Spring Boot、Docker等技术文章',
            keywords: '技术博客,Java,Spring Boot,Docker,Vue,Android,Redis,Linux'
        }
    },
    {
        path: '/category/:category',
        name: 'Category',
        component: () => import('../views/Home.vue'),
        meta: {
            seo: (route) => {
                const categoryName = getCategoryName(route.params.category)
                return {
                    title: `${categoryName} 文章 - Hello Blog`,
                    description: `${categoryName}分类下的技术文章 - Hello Blog`,
                    keywords: `${categoryName},技术博客,文章`
                }
            }
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: {
            title: '关于 - Hello Blog',
            description: '关于 Hello Blog - 个人技术博客介绍、仓库地址、友链和联系方式',
            keywords: '关于,Hello Blog,技术博客,友链'
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue'),
        meta: {
            seo: (route) => {
                const q = route.query.q
                if (q) {
                    return {
                        title: `搜索: ${q} - Hello Blog`,
                        description: `搜索"${q}"的结果 - Hello Blog`,
                        keywords: `搜索,${q},技术文章`
                    }
                }
                return {
                    title: '搜索 - Hello Blog',
                    description: '搜索技术文章 - Hello Blog',
                    keywords: '搜索,技术文章'
                }
            }
        }
    },
    {
        path: '/article/:category/:id',
        name: 'ArticleDetail',
        component: () => import('../views/ArticleDetail.vue'),
        meta: {
            seo: 'article'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return {top: 0}
    }
})

export default router
