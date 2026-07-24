/**
 * 文章点击量统计组合式函数
 *
 * 数据源：countapi.mileshilliard.com（原 countapi.xyz 的稳定替代服务）
 *   - 免费、无需注册、无需 API key
 *   - 支持纯前端 CORS 调用
 *
 * 接口：
 *   - GET /api/v1/hit/{key}  计数 +1 并返回新值（用于详情页：每次访问累加）
 *   - GET /api/v1/get/{key}  仅获取当前值（用于列表卡片：不累加）
 *
 * 防刷策略：同一会话内同一文章只累加一次（基于 sessionStorage），刷新页面不重复计数
 */

import { ref } from 'vue'

const COUNTER_API_BASE = 'https://countapi.mileshilliard.com/api/v1'
// 命名空间前缀：优先从环境变量读取，未配置时回退默认值
const NAMESPACE = import.meta.env.VITE_COUNTER_NAMESPACE || 'helloblog'
// sessionStorage 中记录本会话已统计过的文章 key
const SESSION_KEY = 'helloblog-viewed-articles'

/**
 * 构建文章计数 key
 * 仅使用 categoryId 与 articleId（稳定且为安全字符），避免标题中文导致 key 异常
 */
const buildArticleKey = (categoryId, articleId) => {
  return `${NAMESPACE}-article-${categoryId}-${articleId}`
}

/**
 * 读取本会话已统计过的文章 key 列表
 */
const readViewedKeys = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * 判断当前文章是否已在本会话内统计过
 */
const isViewedInSession = (key) => {
  return readViewedKeys().includes(key)
}

/**
 * 标记文章已在本会话内统计过
 */
const markViewedInSession = (key) => {
  try {
    const viewed = readViewedKeys()
    if (!viewed.includes(key)) {
      viewed.push(key)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(viewed))
    }
  } catch {
    // sessionStorage 不可用时静默降级，允许重复计数
  }
}

/**
 * 累加文章点击量并返回最新值（用于文章详情页）
 * 同一会话内同一文章只累加一次，避免刷新刷量
 */
export const incrementArticleView = async (categoryId, articleId) => {
  const key = buildArticleKey(categoryId, articleId)
  // 已统计过：仅获取当前值，不再累加
  if (isViewedInSession(key)) {
    return fetchArticleView(categoryId, articleId)
  }
  try {
    const res = await fetch(`${COUNTER_API_BASE}/hit/${key}`)
    if (!res.ok) return 0
    const data = await res.json()
    markViewedInSession(key)
    return parseInt(data.value, 10) || 0
  } catch {
    // 网络或服务异常时静默返回 0，不影响阅读体验
    return 0
  }
}

/**
 * 仅获取文章点击量（用于列表卡片，不累加）
 */
export const fetchArticleView = async (categoryId, articleId) => {
  const key = buildArticleKey(categoryId, articleId)
  try {
    const res = await fetch(`${COUNTER_API_BASE}/get/${key}`)
    // 404 表示文章从未被访问过，计为 0
    if (res.status === 404) return 0
    if (!res.ok) return 0
    const data = await res.json()
    return parseInt(data.value, 10) || 0
  } catch {
    return 0
  }
}

/**
 * 格式化点击量展示文本
 * 超过 1 万以「万」为单位，避免数字过长破坏布局
 */
export const formatViewCount = (count) => {
  if (!count || count <= 0) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  }
  return String(count)
}

/**
 * 列表卡片用：异步加载并展示点击量
 * 返回响应式 ref，加载完成自动更新
 */
export const useArticleViewCount = (categoryId, articleId) => {
  const viewCount = ref(0)
  const loaded = ref(false)

  const load = async () => {
    viewCount.value = await fetchArticleView(categoryId, articleId)
    loaded.value = true
  }

  return { viewCount, loaded, load }
}
