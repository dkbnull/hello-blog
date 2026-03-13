import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'
import About from '../views/About.vue'
import ArticleDetail from '../views/ArticleDetail.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/category/:category',
        name: 'Category',
        component: Category
    },
    {
        path: '/article/:category/:id',
        name: 'ArticleDetail',
        component: ArticleDetail
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router