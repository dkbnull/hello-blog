/**
 * Vite 文章自动扫描插件
 * 在 dev/build 时扫描 public/articles 目录，结合 categories.json 配置
 * 生成虚拟模块 virtual:articles-manifest，供 data.js 消费
 *
 * 文章文件命名规则：{id}-{title}.{html|md}
 *   - id: 文章在分类下的唯一标识（如 01、02）
 *   - title: 文章标题
 *
 * 元数据来源优先级：
 *   1. 分类目录下的 meta.json（可选，覆盖默认值）
 *   2. categories.json 中分类级别的默认值（tags、image 等）
 *   3. 文件名解析（id、title）和文件 mtime（date）
 */

import fs from 'fs'
import path from 'path'

const VIRTUAL_MODULE_ID = 'virtual:articles-manifest'
const RESOLVED_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 从文件名解析文章 id 和 title
 * 规则：{id}-{title}.{ext}
 */
function parseFileName(fileName) {
  const match = fileName.match(/^(\d+)-(.+)\.(html|md)$/i)
  if (!match) return null
  return {
    id: match[1],
    title: match[2],
    extension: match[3].toLowerCase()
  }
}

/**
 * 扫描指定分类目录，返回该分类下的文章列表
 */
function scanCategoryArticles(categoryDir, categoryId, categoryConfig, metaOverrides) {
  const articles = []

  if (!fs.existsSync(categoryDir)) return articles

  const entries = fs.readdirSync(categoryDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isFile()) continue

    const parsed = parseFileName(entry.name)
    if (!parsed) continue

    const filePath = path.join(categoryDir, entry.name)
    const stat = fs.statSync(filePath)

    // 默认元数据
    const article = {
      id: parsed.id,
      title: parsed.title,
      category: categoryId,
      date: formatDate(stat.mtime),
      author: 'null',
      tags: categoryConfig.tags ? [...categoryConfig.tags] : [],
      image: categoryConfig.image || ''
    }

    // 合并 meta.json 中的覆盖配置
    const override = metaOverrides?.articles?.[parsed.id]
    if (override) {
      Object.assign(article, override)
      // 确保 category 和 id 不被覆盖
      article.category = categoryId
      article.id = parsed.id
    }

    articles.push(article)
  }

  // 按 id 倒序排列（新文章在前）
  articles.sort((a, b) => b.id.localeCompare(a.id))

  return articles
}

/**
 * 读取分类目录下的 meta.json（可选）
 */
function readMetaJson(categoryDir) {
  const metaPath = path.join(categoryDir, 'meta.json')
  if (!fs.existsSync(metaPath)) return null
  try {
    const content = fs.readFileSync(metaPath, 'utf-8')
    return JSON.parse(content)
  } catch (e) {
    console.warn(`[articles-scanner] 解析 meta.json 失败: ${metaPath}, ${e.message}`)
    return null
  }
}

/**
 * 生成完整的 manifest 数据
 */
function generateManifest(articlesRoot) {
  const categoriesJsonPath = path.join(articlesRoot, 'categories.json')

  if (!fs.existsSync(categoriesJsonPath)) {
    throw new Error(`[articles-scanner] 缺少配置文件: ${categoriesJsonPath}`)
  }

  const config = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf-8'))
  const categoryConfigs = config.categories || []

  const categories = []
  const articles = {}

  for (const cat of categoryConfigs) {
    const categoryDir = path.join(articlesRoot, cat.id)
    const metaOverrides = readMetaJson(categoryDir)

    categories.push({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '',
      tags: cat.tags || []
    })

    articles[cat.id] = scanCategoryArticles(categoryDir, cat.id, cat, metaOverrides)
  }

  return { categories, articles }
}

/**
 * 将 manifest 序列化为虚拟模块代码
 */
function serializeManifest(manifest) {
  return `// 由 vite-plugin-articles-scanner 自动生成，请勿手动编辑
export const categories = ${JSON.stringify(manifest.categories, null, 2)};
export const articles = ${JSON.stringify(manifest.articles, null, 2)};
`
}

export default function vitePluginArticlesScanner(options = {}) {
  const articlesDir = options.articlesDir || 'articles'

  let articlesRoot = ''
  let watcher = null

  const resolveRoot = () => {
    return path.resolve(process.cwd(), 'public', articlesDir)
  }

  const handleFileChange = (file) => {
    if (!file) return
    const normalized = file.replace(/\\/g, '/')
    // 仅当变化文件位于文章目录下时触发热更新
    if (normalized.includes(`/${articlesDir}/`) || normalized.endsWith('categories.json')) {
      const server = watcher
      if (server) {
        const module = server.moduleGraph.getModuleById(RESOLVED_MODULE_ID)
        if (module) {
          server.moduleGraph.invalidateModule(module)
          server.ws.send({ type: 'full-reload' })
        }
      }
    }
  }

  return {
    name: 'vite-plugin-articles-scanner',

    configResolved(config) {
      articlesRoot = resolveRoot()
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_MODULE_ID
      }
      return null
    },

    load(id) {
      if (id !== RESOLVED_MODULE_ID) return null
      try {
        const manifest = generateManifest(articlesRoot)
        return serializeManifest(manifest)
      } catch (e) {
        this.error(e.message)
        return ''
      }
    },

    configureServer(server) {
      watcher = server

      // 监听文章目录变化，触发热更新
      server.watcher.on('change', handleFileChange)
      server.watcher.on('add', handleFileChange)
      server.watcher.on('unlink', handleFileChange)

      // 将 public/articles 加入监听范围（public 默认可能未被完全监听）
      const watchPaths = [
        path.join(process.cwd(), 'public', articlesDir),
        path.join(process.cwd(), 'public', articlesDir, 'categories.json')
      ]
      watchPaths.forEach(p => {
        if (fs.existsSync(p)) {
          server.watcher.add(p)
        }
      })
    }
  }
}

export { VIRTUAL_MODULE_ID }
