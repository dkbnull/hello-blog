/**
 * 虚拟模块类型声明
 */
declare module 'virtual:articles-manifest' {
    export interface CategoryMeta {
        id: string
        name: string
        icon: string
        image?: string
        tags?: string[]
    }

    export interface ArticleMeta {
        id: string
        title: string
        category: string
        date: string
        author: string
        tags: string[]
        image: string
    }

    export const categories: CategoryMeta[]
    export const articles: Record<string, ArticleMeta[]>
}
