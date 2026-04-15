import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/category/:category',
        name: 'Category',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/article/:category/:id',
        name: 'ArticleDetail',
        component: () => import('../views/ArticleDetail.vue')
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
