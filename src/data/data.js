/**
 * 博客基础数据（运行时动态加载）
 *
 * 数据来源：
 *   - 分类配置：public/articles/categories.json
 *   - 文章清单：public/articles/{分类}/meta.json
 *
 * 新增文章：将 {id}-{title}.html|md 放入 public/articles/{分类}/ 目录
 *          并在该分类的 meta.json 中添加一条记录（包含 title/ext/date/tags 等）
 * 新增分类：在 public/articles/categories.json 添加配置，分类 icon 放入 public/icons/ 目录
 * 文章封面图：放入 public/images/{分类}/ 目录，在 meta.json 的 articles.{id}.image 中填写文件名
 */

import { ref } from 'vue'

// 分类图标统一存放在 public/icons/ 下
// categories.json 中的 icon 字段填写文件名（如 frontend.svg），运行时解析为 /icons/frontend.svg
const ICON_BASE = '/icons/'

// 将 icon 文件名解析为完整路径
const resolveIcon = (iconField) => {
  if (!iconField) return ''
  if (iconField.startsWith('/') || /^https?:\/\//.test(iconField)) return iconField
  return ICON_BASE + iconField
}

// 将文章图片字段解析为完整路径
// 文章封面图存放在 public/images/{categoryId}/ 下，meta.json 中填写文件名即可
const resolveArticleImage = (categoryId, imageField) => {
  if (!imageField) return ''
  if (imageField.startsWith('/') || /^https?:\/\//.test(imageField)) return imageField
  return `/images/${categoryId}/${imageField}`
}

// 响应式数据源：应用启动时异步加载，加载完成后组件自动更新
const categoriesData = ref([])
const articlesData = ref({})
const loading = ref(false)
const loaded = ref(false)

/**
 * 运行时加载所有分类和文章数据
 * 1. fetch categories.json 获取分类列表
 * 2. 并发 fetch 每个分类的 meta.json 获取文章清单
 * 3. 合并元数据，构建响应式数据源
 */
export const loadArticlesData = async () => {
  if (loaded.value) return

  loading.value = true
  try {
    // 1. 加载分类配置
    const catRes = await fetch('/articles/categories.json')
    if (!catRes.ok) throw new Error('加载 categories.json 失败')
    const catConfig = await catRes.json()
    const categoryConfigs = catConfig.categories || []

    // 2. 并发加载所有分类的 meta.json
    const metaResults = await Promise.all(
      categoryConfigs.map(async (cat) => {
        try {
          const metaRes = await fetch(`/articles/${cat.id}/meta.json`)
          if (metaRes.ok) return { categoryId: cat.id, meta: await metaRes.json() }
          return { categoryId: cat.id, meta: { articles: {} } }
        } catch {
          return { categoryId: cat.id, meta: { articles: {} } }
        }
      })
    )

    // 3. 构建分类数据（解析 icon 路径）
    const categories = categoryConfigs.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: resolveIcon(cat.icon),
      image: cat.image ? resolveArticleImage(cat.id, cat.image) : ''
    }))

    // 4. 构建文章数据（合并分类默认值，解析 image 路径）
    const articles = {}
    for (let i = 0; i < categoryConfigs.length; i++) {
      const cat = categoryConfigs[i]
      const meta = metaResults[i].meta
      const articleMap = meta.articles || {}
      const fallbackTags = cat.tags || []

      // 将 articles 对象转为数组，补全默认值
      // 文章 image 必须在 meta.json 中显式配置，未配置时返回空字符串由组件 fallback 到默认图
      const articleList = Object.entries(articleMap).map(([id, article]) => ({
        id,
        title: article.title || '',
        ext: article.ext || 'html',
        category: cat.id,
        date: article.date || '',
        author: article.author || 'null',
        tags: Array.isArray(article.tags) && article.tags.length ? article.tags : [...fallbackTags],
        image: resolveArticleImage(cat.id, article.image)
      }))

      // 按 id 倒序排列（新文章在前）
      articleList.sort((a, b) => b.id.localeCompare(a.id))
      articles[cat.id] = articleList
    }

    categoriesData.value = categories
    articlesData.value = articles
    loaded.value = true
  } finally {
    loading.value = false
  }
}

export { categoriesData, articlesData, loading, loaded }
