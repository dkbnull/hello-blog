<template>
  <div class="article-detail">
    <div class="container article-layout" :class="{ 'no-toc': headings.length === 0 }">
      <aside v-if="headings.length > 0" class="toc-sidebar">
        <nav class="toc">
          <h3 class="toc-title">目录</h3>
          <ul class="toc-list">
            <li
              v-for="heading in headings"
              :key="heading.id"
              class="toc-item"
              :class="['toc-level-' + heading.level, { active: activeHeadingId === heading.id }]"
            >
              <a :href="'#' + heading.id" class="toc-link" @click.prevent="scrollToHeading(heading.id)">{{
                  heading.text
                }}</a>
            </li>
          </ul>
        </nav>
      </aside>
      <div class="article-main">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>文章加载中...</p>
        </div>
        <template v-else>
          <article class="article-content card">
            <h1 class="article-title">{{ article?.title }}</h1>
            <div class="article-meta">
              <span>{{ article?.date }}</span>
              <span v-if="article?.author" class="meta-separator">·</span>
              <span v-if="article?.author">{{ article.author }}</span>
              <span class="meta-separator">·</span>
              <router-link :to="`/category/${article?.category}`" class="meta-category">
                {{ getCategoryName(article?.category) }}
              </router-link>
              <template v-if="article?.tags?.length">
                <span class="meta-separator">·</span>
                <span class="meta-tags">
                  <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
                </span>
              </template>
              <span class="meta-separator">·</span>
              <span class="meta-views">
                <Icon icon="view" :size="14" />
                {{ formatViewCount(viewCount) }}
              </span>
            </div>
            <div ref="contentRef" class="article-body" :class="{ 'html-body': isHtmlContent }"
                 v-html="articleContent"></div>
          </article>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getArticleById, getArticleContent, getCategoryName, loadArticlesData, loaded } from '@/data/articles'
import { useArticleSeo } from '@/composables/useSeo'
import { incrementArticleView, formatViewCount } from '@/composables/useViewCount'

const HEADER_OFFSET = 80
const SCROLL_POSITION_OFFSET = 100
const SCROLL_CHECK_INTERVAL = 50
const SCROLL_CHECK_TIMEOUT = 1000

const route = useRoute()

const categoryId = ref(route.params.category)
const articleId = ref(route.params.id)
const articleContent = ref('')
const isHtmlContent = ref(false)
const isLoading = ref(true)
const contentRef = ref(null)
const headings = ref([])
const activeHeadingId = ref('')
const viewCount = ref(0)

let scrollListener = null
let isManualTocClick = false
let scrollCheckInterval = null
let scrollCheckTimeout = null

const article = computed(() => getArticleById(categoryId.value, articleId.value))

useArticleSeo(article)

const extractHeadings = () => {
  if (!contentRef.value) return []
  const headingElements = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const result = []
  const idCountMap = {}
  headingElements.forEach((el) => {
    let id = el.id
    if (!id) {
      id = el.textContent.trim().replace(/\s+/g, '-').toLowerCase()
    }
    if (idCountMap[id] !== undefined) {
      idCountMap[id]++
      id = `${id}-${idCountMap[id]}`
    } else {
      idCountMap[id] = 0
    }
    el.id = id
    result.push({
      id,
      level: parseInt(el.tagName.charAt(1)),
      text: el.textContent.trim()
    })
  })
  return result
}

const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (!element) return
  isManualTocClick = true
  const offsetTop = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: offsetTop, behavior: 'smooth' })

  // 清除上次未完成的滚动检测，避免多次点击导致定时器累积
  if (scrollCheckInterval) clearInterval(scrollCheckInterval)
  if (scrollCheckTimeout) clearTimeout(scrollCheckTimeout)

  scrollCheckInterval = setInterval(() => {
    if (!window.scrollY || Math.abs(window.scrollY - offsetTop) < 2) {
      isManualTocClick = false
      clearInterval(scrollCheckInterval)
      scrollCheckInterval = null
    }
  }, SCROLL_CHECK_INTERVAL)
  scrollCheckTimeout = setTimeout(() => {
    isManualTocClick = false
    clearInterval(scrollCheckInterval)
    scrollCheckInterval = null
  }, SCROLL_CHECK_TIMEOUT)
}

const updateActiveHeading = () => {
  const scrollPos = window.scrollY + SCROLL_POSITION_OFFSET
  let currentHeading = ''
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const el = document.getElementById(headings.value[i].id)
    if (el && el.offsetTop <= scrollPos) {
      currentHeading = headings.value[i].id
      break
    }
  }
  activeHeadingId.value = currentHeading
}

const setupScrollObserver = () => {
  window.removeEventListener('scroll', scrollListener)
  scrollListener = () => updateActiveHeading()
  window.addEventListener('scroll', scrollListener, { passive: true })
}

// 从完整 HTML 文档中提取 body 内容（保留内联样式）
const extractHtmlBody = (html) => {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (!bodyMatch) return html
  let body = bodyMatch[1]
  // 提取 head 中的 style 标签，注入到 body 内容中
  const styleMatches = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi)
  if (styleMatches) {
    body = styleMatches.join('\n') + body
  }
  return body
}

// 动态加载 Mermaid 库（仅在有 Mermaid 图表时加载，避免增加首屏体积）
const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
let mermaidLoadingPromise = null

const loadMermaid = () => {
  if (window.mermaid) return Promise.resolve(window.mermaid)
  if (mermaidLoadingPromise) return mermaidLoadingPromise

  mermaidLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = MERMAID_CDN
    script.async = true
    script.onload = () => {
      if (window.mermaid) {
        // securityLevel: 'loose' 允许 HTML 标签等，适配 Typora 导出的图表
        window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' })
        resolve(window.mermaid)
      } else {
        reject(new Error('Mermaid 库加载失败'))
      }
    }
    script.onerror = () => {
      mermaidLoadingPromise = null
      reject(new Error('Mermaid 库加载失败'))
    }
    document.head.appendChild(script)
  })
  return mermaidLoadingPromise
}

// 渲染文章内容中的 Mermaid 图表
const renderMermaid = async () => {
  if (!contentRef.value) return
  const mermaidElements = contentRef.value.querySelectorAll('.mermaid:not([data-processed])')
  if (mermaidElements.length === 0) return

  try {
    const mermaid = await loadMermaid()
    // 为每个 mermaid 容器分配唯一 id，避免重复渲染冲突
    const stamp = Date.now()
    mermaidElements.forEach((el, idx) => {
      if (!el.id) el.id = `mermaid-${stamp}-${idx}`
    })
    await mermaid.run({ nodes: Array.from(mermaidElements) })
  } catch (error) {
    console.warn('Mermaid 渲染失败:', error)
  }
}

// 触发文章点击量统计（异步累加，不阻塞内容渲染）
const trackViewCount = () => {
  incrementArticleView(categoryId.value, articleId.value).then(count => {
    viewCount.value = count
  })
}

const loadArticleContent = async () => {
  isLoading.value = true
  // 确保文章清单数据已加载完成，否则 getArticleById 找不到文章
  if (!loaded.value) {
    await loadArticlesData()
  }
  try {
    headings.value = []
    activeHeadingId.value = ''
    viewCount.value = 0
    const content = await getArticleContent(categoryId.value, articleId.value)
    isHtmlContent.value = content.startsWith('<!DOCTYPE html>') || content.startsWith('<html')
    // 对 HTML 文章：提取 body 内容，隐藏自带的标题和 meta（由组件统一渲染）
    if (isHtmlContent.value) {
      articleContent.value = extractHtmlBody(content)
    } else {
      articleContent.value = content
    }
    isLoading.value = false
    // 文章内容加载成功后，触发点击量统计（异步执行，不阻塞渲染）
    trackViewCount()
    await nextTick()
    // 隐藏 HTML 文章中自带的标题和 meta（组件已统一渲染）
    if (isHtmlContent.value && contentRef.value) {
      contentRef.value.querySelectorAll('.article-title, .article-meta').forEach(el => {
        el.style.display = 'none'
      })
    }
    headings.value = extractHeadings()
    if (headings.value.length > 0) {
      activeHeadingId.value = headings.value[0].id
      setupScrollObserver()
    }
    // 内容渲染完成后处理 Mermaid 图表
    await renderMermaid()
  } catch (error) {
    articleContent.value = `<h1>${article.value?.title || '文章不存在'}</h1><p>文章内容加载失败: ${error.message}</p>`
    isHtmlContent.value = false
    isLoading.value = false
    await nextTick()
    headings.value = extractHeadings()
  }
}

watch(activeHeadingId, (newId) => {
  if (!newId || isManualTocClick) return
  if (window.innerWidth <= 768) return
  const tocLink = document.querySelector(`.toc-item a[href="#${newId}"]`)
  if (tocLink) {
    tocLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
})

watch(
  [() => route.params.category, () => route.params.id],
  ([newCategory, newId]) => {
    categoryId.value = newCategory
    articleId.value = newId
    loadArticleContent()
  }
)

onMounted(() => {
  loadArticleContent()
})

onBeforeUnmount(() => {
  if (scrollCheckInterval) clearInterval(scrollCheckInterval)
  if (scrollCheckTimeout) clearTimeout(scrollCheckTimeout)
  if (scrollListener) window.removeEventListener('scroll', scrollListener)
})
</script>

<style scoped>
.article-detail {
  padding: var(--spacing-md) 0;
}

.article-layout {
  display: flex;
  gap: var(--spacing-xl);
  max-width: var(--container-max);
  align-items: flex-start;
}

.toc-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  /* top = header 高度 + 页面 padding-top，保证滚动时目录顶部留白恒定 */
  top: calc(var(--header-height) + var(--spacing-md));
  max-height: calc(100vh - var(--header-height) - var(--spacing-md) * 2);
  overflow-y: auto;
}

.toc {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow);
  transition: var(--transition-normal);
}

.toc-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--glass-border);
  letter-spacing: -0.01em;
}

/* 状态脉冲点 */
.toc-title::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 0 8px var(--glow-cyan);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0;
  padding: 0;
}

.toc-link {
  display: block;
  padding: var(--spacing-xs) 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
  line-height: 1.5;
  border-left: 2px solid transparent;
  padding-left: var(--spacing-sm);
  transition: var(--transition);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-link:hover {
  color: var(--primary-color);
  text-decoration: none;
  border-left-color: var(--primary-color);
  background: var(--primary-light);
  text-shadow: 0 0 8px var(--glow-cyan);
}

.toc-item.active > .toc-link {
  color: var(--primary-color);
  font-weight: 600;
  border-left-color: var(--primary-color);
  background: var(--primary-light);
  text-shadow: 0 0 8px var(--glow-cyan);
}

.toc-level-1 .toc-link {
  padding-left: var(--spacing-xs);
  font-weight: 500;
}

.toc-level-2 .toc-link {
  padding-left: var(--spacing-md);
}

.toc-level-3 .toc-link {
  padding-left: calc(var(--spacing-md) * 2);
  font-size: var(--font-size-xs);
}

.toc-level-4 .toc-link {
  padding-left: calc(var(--spacing-md) * 3);
  font-size: var(--font-size-xs);
}

.toc-level-5 .toc-link {
  padding-left: calc(var(--spacing-md) * 4);
  font-size: var(--font-size-xs);
}

.toc-level-6 .toc-link {
  padding-left: calc(var(--spacing-md) * 5);
  font-size: var(--font-size-xs);
}

.article-main {
  flex: 1;
  min-width: 0;
}

.no-toc {
  max-width: var(--article-max);
}

.no-toc .article-main {
  max-width: 100%;
}

/* ===== 文章内容卡片（复用全局 .card） ===== */
.article-content {
  position: relative;
  padding: var(--spacing-lg) var(--spacing-xl);
  border: 0;
}

.article-content:hover {
  transform: none;
  box-shadow: var(--shadow);
}

.article-content:hover::after {
  transform: scaleY(0);
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  text-align: center;
}

.article-meta {
  font-size: var(--font-size-sm);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  border-bottom: 1px dashed var(--glass-border);
}

.meta-separator {
  color: var(--text-tertiary);
  opacity: 0.5;
}

.meta-category {
  color: var(--primary-color);
  text-decoration: none;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  background: var(--primary-light);
  border: 1px solid transparent;
  transition: var(--transition);
}

.meta-category:hover {
  border-color: var(--primary-color);
  text-decoration: none;
}

.meta-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.meta-tags .tag {
  padding: 0.1rem 0.5rem;
  font-size: 0.7rem;
}

.meta-views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
}

/* HTML 文章：重置所有外部样式，保留原始样式 */
.html-body :deep(*) {
  all: revert;
}

.html-body :deep(#write) {
  max-width: 100%;
}

@media (max-width: 768px) {
  .article-layout {
    gap: var(--spacing-md);
  }

  .toc-sidebar {
    display: none;
  }

  .article-content {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .article-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .article-content {
    padding: var(--spacing-sm) var(--spacing-xs);
  }
}
</style>
