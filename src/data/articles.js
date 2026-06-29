/**
 * 文章数据服务层
 * 提供文章的查询、搜索、内容加载等功能
 * 数据源为 data.js 中的响应式 ref，组件通过 computed 消费可自动响应数据变化
 */

import { articlesData, categoriesData, loading, loaded, loadArticlesData } from "@/data/data.js";

const articleContentCache = new Map();

export { loadArticlesData, loading, loaded };

export const getCategories = () => categoriesData.value;

export const getCategoryName = (categoryId) => {
  const category = categoriesData.value.find(c => c.id === categoryId);
  return category ? category.name : categoryId;
};

export const getArticleCount = (categoryId) => {
  return (articlesData.value[categoryId] || []).length;
};

export const getArticlesByCategory = (categoryId) => {
  return articlesData.value[categoryId] || [];
};

export const getAllArticles = () => {
  return Object.values(articlesData.value).flat();
};

export const getArticleById = (categoryId, articleId) => {
  const articles = articlesData.value[categoryId] || [];
  return articles.find(article => article.id === articleId);
};

const buildArticlePath = (categoryId, articleId, title, extension) => {
  const fileName = `${articleId}-${title}.${extension}`;
  return `/articles/${categoryId}/${fileName}`;
};

const generateErrorContent = (title, message) => `
  <div class="article-content">
    <h1>${title || '文章不存在'}</h1>
    <p>${message}</p>
  </div>
`;

/**
 * 模糊搜索文章
 * 支持按标题、分类名称、标签进行匹配
 */
export const searchArticles = (keyword) => {
  if (!keyword || !keyword.trim()) return [];

  const kw = keyword.trim().toLowerCase();
  const allArticles = getAllArticles();

  return allArticles.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(kw);
    const categoryName = getCategoryName(article.category).toLowerCase();
    const categoryMatch = categoryName.includes(kw) || article.category.toLowerCase().includes(kw);
    const tagMatch = article.tags?.some(tag => tag.toLowerCase().includes(kw));
    return titleMatch || categoryMatch || tagMatch;
  });
};

/**
 * 获取文章内容
 * 优先加载 HTML 格式，其次加载 Markdown 格式并转换
 * 使用缓存避免重复请求
 */
export const getArticleContent = async (categoryId, articleId) => {
  const cacheKey = `${categoryId}-${articleId}`;
  if (articleContentCache.has(cacheKey)) {
    return articleContentCache.get(cacheKey);
  }

  try {
    const article = getArticleById(categoryId, articleId);
    if (!article) {
      const errorContent = generateErrorContent(null, '找不到指定的文章，请检查链接是否正确。');
      articleContentCache.set(cacheKey, errorContent);
      return errorContent;
    }

    const extension = article.ext || 'html';
    const htmlPath = buildArticlePath(categoryId, articleId, article.title, extension);
    const htmlResponse = await fetch(htmlPath);
    if (htmlResponse.ok) {
      const content = await htmlResponse.text();
      // 重写 HTML 文章中图片的相对路径为绝对路径
      // 原始路径形如 ./assets/xxx.assets/yyy.png，是相对于文章 HTML 文件所在目录的
      // 在 SPA 路由下浏览器会按当前 URL 解析，导致 404，需统一替换为 /articles/{categoryId}/assets/
      const rewrittenContent = content.replace(
        /(\bsrc|href)\s*=\s*(['"])\.\/assets\//gi,
        `$1=$2/articles/${categoryId}/assets/`
      );
      articleContentCache.set(cacheKey, rewrittenContent);
      return rewrittenContent;
    }

    // 如果配置的是 html 但加载失败，尝试 md 格式
    if (extension === 'html') {
      const mdPath = buildArticlePath(categoryId, articleId, article.title, 'md');
      const mdResponse = await fetch(mdPath);
      if (mdResponse.ok) {
        const mdContent = await mdResponse.text();
        const { marked } = await import('marked');
        const htmlContent = marked(mdContent);
        articleContentCache.set(cacheKey, htmlContent);
        return htmlContent;
      }
    }

    const defaultContent = generateErrorContent(article.title, '文章内容加载失败，请检查文件是否存在。');
    articleContentCache.set(cacheKey, defaultContent);
    return defaultContent;
  } catch (error) {
    const article = getArticleById(categoryId, articleId);
    const errorContent = generateErrorContent(article?.title, `文章内容加载失败: ${error.message}`);
    articleContentCache.set(cacheKey, errorContent);
    return errorContent;
  }
};
