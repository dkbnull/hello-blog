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
import { getArticleById, getArticleContent, getCategoryName } from '@/data/articles';
import { useArticleSeo } from '@/composables/useSeo';

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

let observer = null
let scrollListener = null
let isManualTocClick = false

const article = computed(() => getArticleById(categoryId.value, articleId.value))

useArticleSeo(article)

const extractHeadings = () => {
  if (!contentRef.value) return [];
  const headingElements = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const result = [];
  const idCountMap = {};
  headingElements.forEach((el) => {
    let id = el.id;
    if (!id) {
      id = el.textContent.trim().replace(/\s+/g, '-').toLowerCase();
    }
    if (idCountMap[id] !== undefined) {
      idCountMap[id]++;
      id = `${id}-${idCountMap[id]}`;
    } else {
      idCountMap[id] = 0;
    }
    el.id = id;
    result.push({
      id,
      level: parseInt(el.tagName.charAt(1)),
      text: el.textContent.trim()
    });
  });
  return result;
};

const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (!element) return;
  isManualTocClick = true;
  const offsetTop = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  const checkScrollEnd = setInterval(() => {
    if (!window.scrollY || Math.abs(window.scrollY - offsetTop) < 2) {
      isManualTocClick = false;
      clearInterval(checkScrollEnd);
    }
  }, SCROLL_CHECK_INTERVAL);
  setTimeout(() => {
    isManualTocClick = false;
    clearInterval(checkScrollEnd);
  }, SCROLL_CHECK_TIMEOUT);
};

const updateActiveHeading = () => {
  const scrollPos = window.scrollY + SCROLL_POSITION_OFFSET;
  let currentHeading = '';
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const el = document.getElementById(headings.value[i].id);
    if (el && el.offsetTop <= scrollPos) {
      currentHeading = headings.value[i].id;
      break;
    }
  }
  activeHeadingId.value = currentHeading;
};

const setupScrollObserver = () => {
  window.removeEventListener('scroll', scrollListener);
  scrollListener = () => updateActiveHeading();
  window.addEventListener('scroll', scrollListener, { passive: true });
};

// 从完整 HTML 文档中提取 body 内容（保留内联样式）
const extractHtmlBody = (html) => {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return html;
  let body = bodyMatch[1];
  // 提取 head 中的 style 标签，注入到 body 内容中
  const styleMatches = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
  if (styleMatches) {
    body = styleMatches.join('\n') + body;
  }
  return body;
};

// 动态加载 Mermaid 库（仅在有 Mermaid 图表时加载，避免增加首屏体积）
const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
let mermaidLoadingPromise = null;

const loadMermaid = () => {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  if (mermaidLoadingPromise) return mermaidLoadingPromise;

  mermaidLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = MERMAID_CDN;
    script.async = true;
    script.onload = () => {
      if (window.mermaid) {
        // securityLevel: 'loose' 允许 HTML 标签等，适配 Typora 导出的图表
        window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
        resolve(window.mermaid);
      } else {
        reject(new Error('Mermaid 库加载失败'));
      }
    };
    script.onerror = () => {
      mermaidLoadingPromise = null;
      reject(new Error('Mermaid 库加载失败'));
    };
    document.head.appendChild(script);
  });
  return mermaidLoadingPromise;
};

// 渲染文章内容中的 Mermaid 图表
const renderMermaid = async () => {
  if (!contentRef.value) return;
  const mermaidElements = contentRef.value.querySelectorAll('.mermaid:not([data-processed])');
  if (mermaidElements.length === 0) return;

  try {
    const mermaid = await loadMermaid();
    // 为每个 mermaid 容器分配唯一 id，避免重复渲染冲突
    const stamp = Date.now();
    mermaidElements.forEach((el, idx) => {
      if (!el.id) el.id = `mermaid-${stamp}-${idx}`;
    });
    await mermaid.run({ nodes: Array.from(mermaidElements) });
  } catch (error) {
    console.warn('Mermaid 渲染失败:', error);
  }
};

const loadArticleContent = async () => {
  isLoading.value = true;
  try {
    headings.value = [];
    activeHeadingId.value = '';
    const content = await getArticleContent(categoryId.value, articleId.value);
    isHtmlContent.value = content.startsWith('<!DOCTYPE html>') || content.startsWith('<html');
    // 对 HTML 文章：提取 body 内容，隐藏自带的标题和 meta（由组件统一渲染）
    if (isHtmlContent.value) {
      articleContent.value = extractHtmlBody(content);
    } else {
      articleContent.value = content;
    }
    isLoading.value = false;
    await nextTick();
    // 隐藏 HTML 文章中自带的标题和 meta（组件已统一渲染）
    if (isHtmlContent.value && contentRef.value) {
      contentRef.value.querySelectorAll('.article-title, .article-meta').forEach(el => {
        el.style.display = 'none';
      });
    }
    headings.value = extractHeadings();
    if (headings.value.length > 0) {
      activeHeadingId.value = headings.value[0].id;
      setupScrollObserver();
    }
    // 内容渲染完成后处理 Mermaid 图表
    await renderMermaid();
  } catch (error) {
    articleContent.value = `<h1>${article.value?.title || '文章不存在'}</h1><p>文章内容加载失败: ${error.message}</p>`;
    isHtmlContent.value = false;
    isLoading.value = false;
    await nextTick();
    headings.value = extractHeadings();
  }
};

watch(activeHeadingId, (newId) => {
  if (!newId || isManualTocClick) return;
  if (window.innerWidth <= 768) return;
  const tocLink = document.querySelector(`.toc-item a[href="#${newId}"]`);
  if (tocLink) {
    tocLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
});

watch(
  [() => route.params.category, () => route.params.id],
  ([newCategory, newId]) => {
    categoryId.value = newCategory;
    articleId.value = newId;
    loadArticleContent();
  }
);

onMounted(() => {
  loadArticleContent();
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  if (scrollListener) window.removeEventListener('scroll', scrollListener);
});
</script>

<style scoped>
.article-detail {
  padding: var(--spacing-md) 0;
  background-color: var(--color-bg);
  min-height: calc(100vh - var(--header-height));
  transition: background-color var(--transition-normal);
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
  background-color: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.toc-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
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
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  border-left: 2px solid transparent;
  padding-left: var(--spacing-sm);
  transition: all var(--transition-fast);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-link:hover {
  color: var(--color-primary);
  text-decoration: none;
  border-left-color: var(--color-primary-light);
  background-color: var(--color-primary-light);
}

.toc-item.active > .toc-link {
  color: var(--color-primary);
  font-weight: 600;
  border-left-color: var(--color-primary);
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  gap: var(--spacing-md);
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-toc {
  max-width: var(--article-max);
}

.no-toc .article-main {
  max-width: 100%;
}

.article-content {
  padding: var(--spacing-lg) var(--spacing-xl);
}

.article-content:hover {
  transform: none;
  box-shadow: 0 2px 4px var(--color-shadow);
}

.article-title {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  text-align: center;
}

.article-meta {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.meta-separator {
  color: var(--color-text-tertiary);
}

.meta-category {
  color: var(--color-primary);
  text-decoration: none;
}

.meta-category:hover {
  text-decoration: underline;
}

.meta-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.meta-tags .tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
}

.article-body {
  line-height: 1.8;
  color: var(--color-text);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  scroll-margin-top: 80px;
}

.article-body :deep(p) {
  margin-bottom: var(--spacing-md);
}

.article-body :deep(code) {
  background-color: var(--color-bg-code);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.article-body :deep(pre) {
  background-color: var(--color-bg-code);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-family: var(--font-mono);
}

.article-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.article-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--spacing-md);
  margin: var(--spacing-md) 0;
  color: var(--color-text-secondary);
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--spacing-md);
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
}

.article-body :deep(th) {
  background-color: var(--color-bg-code);
}

/* HTML 文章样式覆盖 */
.html-body :deep(.container) {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.html-body :deep(.article-content) {
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}

.html-body :deep(.article-body) {
  margin-bottom: 0;
}

/* 覆盖 Typora 导出 HTML 中 #write 的默认 padding，减小正文上下留白 */
.html-body :deep(#write) {
  padding: 0;
  max-width: 100%;
}

/* 覆盖 HTML 文章中的硬编码颜色，适配暗色模式 */
.html-body :deep(h1),
.html-body :deep(h2),
.html-body :deep(h3),
.html-body :deep(h4),
.html-body :deep(h5),
.html-body :deep(h6) {
  color: var(--color-text);
  scroll-margin-top: 80px;
}

.html-body :deep(p),
.html-body :deep(li),
.html-body :deep(td),
.html-body :deep(th) {
  color: var(--color-text);
}

.html-body :deep(code) {
  background-color: var(--color-bg-code);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
}

.html-body :deep(pre) {
  background-color: var(--color-bg-code);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.html-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.html-body :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--spacing-md);
  margin: var(--spacing-md) 0;
  color: var(--color-text-secondary);
}

.html-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--spacing-md);
}

.html-body :deep(th),
.html-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
}

.html-body :deep(th) {
  background-color: var(--color-bg-code);
}

@media (max-width: 768px) {
  .article-layout {
    flex-direction: column;
  }

  .toc-sidebar {
    display: none;
  }

  .article-content {
  }

  .article-title {
    font-size: 1.5rem;
  }
}
</style>
