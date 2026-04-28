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
        <div v-if="isHtmlContent" ref="contentRef" class="html-content" v-html="articleContent"></div>
        <article v-else class="article-content card">
          <h1 class="article-title">{{ article?.title }}</h1>
          <div class="article-meta">
            <span>{{ article?.date }}</span>
            <span class="meta-separator">·</span>
            <router-link :to="`/category/${article?.category}`" class="meta-category">
              {{ getCategoryName(article?.category) }}
            </router-link>
          </div>
          <div ref="contentRef" class="article-body" v-html="articleContent"></div>
        </article>
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {getArticleById, getArticleContent, getCategoryName} from '../data/articles';
import {useArticleSeo} from '../composables/useSeo';

const route = useRoute();

const categoryId = ref(route.params.category);
const articleId = ref(route.params.id);

const article = computed(() => getArticleById(categoryId.value, articleId.value));

useArticleSeo(article)

const articleContent = ref('');
const isHtmlContent = ref(false);
const contentRef = ref(null);
const headings = ref([]);
const activeHeadingId = ref('');

let observer = null;
let scrollListener = null;
let isManualTocClick = false;

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
  if (element) {
    isManualTocClick = true;
    const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({top: offsetTop, behavior: 'smooth'});
    const checkScrollEnd = setInterval(() => {
      if (!window.scrollY || Math.abs(window.scrollY - (offsetTop)) < 2) {
        isManualTocClick = false;
        clearInterval(checkScrollEnd);
      }
    }, 50);
    setTimeout(() => {
      isManualTocClick = false;
      clearInterval(checkScrollEnd);
    }, 1000);
  }
};

const updateActiveHeading = () => {
  const scrollPos = window.scrollY + 100;
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
  window.addEventListener('scroll', scrollListener, {passive: true});
};

watch(activeHeadingId, (newId) => {
  if (!newId || isManualTocClick) return;
  const tocLink = document.querySelector(`.toc-item a[href="#${newId}"]`);
  if (tocLink) {
    tocLink.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  }
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  if (scrollListener) window.removeEventListener('scroll', scrollListener);
});

const loadArticleContent = async () => {
  try {
    headings.value = [];
    activeHeadingId.value = '';
    const content = await getArticleContent(categoryId.value, articleId.value);
    isHtmlContent.value = content.startsWith('<!DOCTYPE html>') || content.startsWith('<html');
    articleContent.value = content;
    await nextTick();
    headings.value = extractHeadings();
    if (headings.value.length > 0) {
      activeHeadingId.value = headings.value[0].id;
      setupScrollObserver();
    }
  } catch (error) {
    console.error('加载文章内容失败:', error);
    articleContent.value = `<h1>${article.value?.title || '文章不存在'}</h1><p>文章内容加载失败: ${error.message}</p>`;
    isHtmlContent.value = false;
    await nextTick();
    headings.value = extractHeadings();
  }
};

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
</script>

<style scoped>
.article-detail {
  padding: var(--spacing-xl) 0;
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
  top: calc(var(--header-height) + var(--spacing-lg));
  max-height: calc(100vh - var(--header-height) - var(--spacing-xl) * 2);
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

.no-toc {
  max-width: var(--article-max);
}

.no-toc .article-main {
  max-width: 100%;
}

.article-content {
  padding: var(--spacing-xl);
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
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: center;
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

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-md) 0;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color var(--transition-normal);
}

.back-link:hover {
  background-color: var(--color-primary-hover);
  text-decoration: none;
}

.html-content {
  width: 100%;
  min-height: calc(100vh - 120px);
  overflow: hidden;
  color: var(--color-text);
}

.html-content :deep(.container) {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.html-content :deep(.article-content) {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 4px var(--color-shadow);
  padding: var(--spacing-xl);
}

.html-content :deep(code) {
  background-color: var(--color-bg-code);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
}

.html-content :deep(pre) {
  background-color: var(--color-bg-code);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.html-content :deep(h1),
.html-content :deep(h2),
.html-content :deep(h3),
.html-content :deep(h4),
.html-content :deep(h5),
.html-content :deep(h6) {
  scroll-margin-top: 80px;
}

@media (max-width: 768px) {
  .article-layout {
    flex-direction: column;
  }

  .toc-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    order: -1;
  }

  .toc-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .toc-item {
    margin: 0;
  }

  .toc-link {
    border-left: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg-tag);
  }

  .toc-level-2 .toc-link,
  .toc-level-3 .toc-link,
  .toc-level-4 .toc-link,
  .toc-level-5 .toc-link,
  .toc-level-6 .toc-link {
    padding-left: var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .toc-item.active > .toc-link {
    background-color: var(--color-primary);
    color: white;
    border-left: none;
  }

  .article-content {
  }

  .article-title {
    font-size: 1.5rem;
  }
}
</style>
