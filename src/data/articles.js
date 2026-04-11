import {articlesData, categoriesData} from "./data.js";

const articleContentCache = new Map();

const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';

export const getCategories = () => categoriesData;

export const getCategoryName = (categoryId) => {
    const category = categoriesData.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
};

export const getArticleCount = (categoryId) => {
    return (articlesData[categoryId] || []).length;
};

export const getArticlesByCategory = (categoryId) => {
    return articlesData[categoryId] || [];
};

export const getAllArticles = () => {
    return Object.values(articlesData).flat();
};

export const getArticleById = (categoryId, articleId) => {
    const articles = articlesData[categoryId] || [];
    return articles.find(article => article.id === articleId);
};

const buildArticlePath = (categoryId, articleId, title, extension) => {
    const fileName = `${articleId}_${title}.${extension}`;
    if (BASE_URL) {
        return `${BASE_URL}/articles/${categoryId}/${fileName}`;
    }
    return `/articles/${categoryId}/${fileName}`;
};

const buildImageBaseUrl = (categoryId) => {
    if (BASE_URL) {
        return `${BASE_URL}/articles/${categoryId}/assets/`;
    }
    return `/articles/${categoryId}/assets/`;
};

const generateErrorContent = (title, message) => `
  <div class="article-content">
    <h1>${title || '文章不存在'}</h1>
    <p>${message}</p>
  </div>
`;

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

        const htmlPath = buildArticlePath(categoryId, articleId, article.title, 'html');
        const htmlResponse = await fetch(htmlPath);
        if (htmlResponse.ok) {
            let content = await htmlResponse.text();
            const imageBaseUrl = buildImageBaseUrl(categoryId);
            content = content.replace(/src='\.\/assets\//g, `src='${imageBaseUrl}`);
            articleContentCache.set(cacheKey, content);
            return content;
        }

        const mdPath = buildArticlePath(categoryId, articleId, article.title, 'md');
        const mdResponse = await fetch(mdPath);
        if (mdResponse.ok) {
            const mdContent = await mdResponse.text();
            const {marked} = await import('marked');
            const htmlContent = marked(mdContent);
            articleContentCache.set(cacheKey, htmlContent);
            return htmlContent;
        }

        const defaultContent = generateErrorContent(article.title, '文章内容加载失败，请检查文件是否存在。');
        articleContentCache.set(cacheKey, defaultContent);
        return defaultContent;
    } catch (error) {
        console.error('加载文章内容失败:', error);
        const article = getArticleById(categoryId, articleId);
        const errorContent = generateErrorContent(article?.title, `文章内容加载失败: ${error.message}`);
        articleContentCache.set(cacheKey, errorContent);
        return errorContent;
    }
};
